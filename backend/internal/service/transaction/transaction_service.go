package transaction

import (
	"errors"

	"github.com/google/uuid"
	"github.com/shopspring/decimal"
	"github.com/vault-pro/backend/internal/model"
	"github.com/vault-pro/backend/internal/repository"
	"gorm.io/gorm"
)

// Standard service errors
var (
	ErrAccountNotFound        = errors.New("account not found")
	ErrTransactionNotFound    = errors.New("transaction not found")
	ErrUnauthorized           = errors.New("unauthorized access")
	ErrInvalidTransactionType = errors.New("invalid transaction type")
	ErrMissingAccountID       = errors.New("missing account ID")
	ErrMissingTargetAccountID = errors.New("missing target account ID")
)

// Income allocation percentages as per 6-Jars logic
var incomeAllocationPercentages = map[model.AccountType]decimal.Decimal{
	model.NEC: decimal.NewFromFloat(0.55),
	model.FFA: decimal.NewFromFloat(0.10),
	model.LTS: decimal.NewFromFloat(0.10),
	model.EDU: decimal.NewFromFloat(0.10),
	model.PLY: decimal.NewFromFloat(0.10),
	model.GIV: decimal.NewFromFloat(0.05),
}

type TransactionService interface {
	AddIncome(userID uuid.UUID, amount decimal.Decimal, category, note string) error
	AddExpense(userID uuid.UUID, accountID uuid.UUID, amount decimal.Decimal, category, note string) error
	Transfer(userID uuid.UUID, fromAccountID, toAccountID uuid.UUID, amount decimal.Decimal, note string) error
	GetTransactions(userID uuid.UUID, month, year int) ([]model.Transaction, error)
	UpdateTransaction(userID uuid.UUID, txID uuid.UUID, amount decimal.Decimal, category, note string) error
	DeleteTransaction(userID uuid.UUID, txID uuid.UUID) error
	BulkAddTransactions(userID uuid.UUID, transactions []model.Transaction) error
}

type transactionService struct {
	txRepo      repository.TransactionRepository
	accountRepo repository.AccountRepository
	db          *gorm.DB
}

func NewTransactionService(txRepo repository.TransactionRepository, accountRepo repository.AccountRepository, db *gorm.DB) TransactionService {
	return &transactionService{
		txRepo:      txRepo,
		accountRepo: accountRepo,
		db:          db,
	}
}

// AddIncome distributes the income amount across the 6 jars based on standard percentages.
func (s *transactionService) AddIncome(userID uuid.UUID, amount decimal.Decimal, category, note string) error {
	return s.db.Transaction(func(dbTx *gorm.DB) error {
		for accType, percent := range incomeAllocationPercentages {
			acc, err := s.accountRepo.FindByUserIDAndType(userID, accType)
			if err != nil {
				// If account doesn't exist, create it (default behavior for new users)
				acc = &model.Account{
					UserID:  userID,
					Type:    accType,
					Name:    string(accType),
					Balance: decimal.Zero,
				}
				if err := s.accountRepo.Create(acc); err != nil {
					return err
				}
			}

			allocation := amount.Mul(percent)
			acc.Balance = acc.Balance.Add(allocation)

			if err := s.accountRepo.Update(acc); err != nil {
				return err
			}

			txRecord := &model.Transaction{
				UserID:    userID,
				AccountID: acc.ID,
				Amount:    allocation,
				Type:      model.Income,
				Category:  category,
				Note:      note,
			}

			if err := s.txRepo.Create(txRecord); err != nil {
				return err
			}
		}
		return nil
	})
}

// AddExpense subtracts the amount from a specific account.
func (s *transactionService) AddExpense(userID uuid.UUID, accountID uuid.UUID, amount decimal.Decimal, category, note string) error {
	return s.db.Transaction(func(dbTx *gorm.DB) error {
		if _, err := s.getValidAccount(accountID, userID); err != nil {
			return err
		}

		if err := s.adjustBalances(accountID, nil, model.Expense, amount); err != nil {
			return err
		}

		txRecord := &model.Transaction{
			UserID:    userID,
			AccountID: accountID,
			Amount:    amount,
			Type:      model.Expense,
			Category:  category,
			Note:      note,
		}
		return s.txRepo.Create(txRecord)
	})
}

// Transfer moves an amount from one account to another.
func (s *transactionService) Transfer(userID uuid.UUID, fromAccountID, toAccountID uuid.UUID, amount decimal.Decimal, note string) error {
	return s.db.Transaction(func(dbTx *gorm.DB) error {
		if _, err := s.getValidAccount(fromAccountID, userID); err != nil {
			return err
		}
		if _, err := s.getValidAccount(toAccountID, userID); err != nil {
			return err
		}

		if err := s.adjustBalances(fromAccountID, &toAccountID, model.Transfer, amount); err != nil {
			return err
		}

		txRecord := &model.Transaction{
			UserID:          userID,
			AccountID:       fromAccountID,
			TargetAccountID: &toAccountID,
			Amount:          amount,
			Type:            model.Transfer,
			Note:            note,
		}
		return s.txRepo.Create(txRecord)
	})
}

// GetTransactions retrieves transactions for a user by month and year.
func (s *transactionService) GetTransactions(userID uuid.UUID, month, year int) ([]model.Transaction, error) {
	return s.txRepo.FindByUserID(userID, month, year)
}

// UpdateTransaction updates an existing transaction and adjusts balances if the amount changes.
func (s *transactionService) UpdateTransaction(userID uuid.UUID, txID uuid.UUID, amount decimal.Decimal, category, note string) error {
	return s.db.Transaction(func(dbTx *gorm.DB) error {
		tx, err := s.getValidTransaction(txID, userID)
		if err != nil {
			return err
		}

		// Adjust balances if amount changed
		if !amount.Equal(tx.Amount) {
			diff := amount.Sub(tx.Amount)
			if err := s.adjustBalances(tx.AccountID, tx.TargetAccountID, tx.Type, diff); err != nil {
				return err
			}
			tx.Amount = amount
		}

		tx.Category = category
		tx.Note = note

		return s.txRepo.Update(tx)
	})
}

// DeleteTransaction removes a transaction and reverses its balance effects.
func (s *transactionService) DeleteTransaction(userID uuid.UUID, txID uuid.UUID) error {
	return s.db.Transaction(func(dbTx *gorm.DB) error {
		tx, err := s.getValidTransaction(txID, userID)
		if err != nil {
			return err
		}

		// Reverse the transaction's effect by applying the negative amount
		reversalAmount := tx.Amount.Neg()
		if err := s.adjustBalances(tx.AccountID, tx.TargetAccountID, tx.Type, reversalAmount); err != nil {
			return err
		}

		return s.txRepo.Delete(txID)
	})
}

// BulkAddTransactions processes an array of transactions in a single batch, aggregating balance changes.
func (s *transactionService) BulkAddTransactions(userID uuid.UUID, transactions []model.Transaction) error {
	return s.db.Transaction(func(dbTx *gorm.DB) error {
		balanceAdjustments := make(map[uuid.UUID]decimal.Decimal)
		var txRecords []model.Transaction

		for _, tx := range transactions {
			if tx.UserID != userID && tx.UserID != uuid.Nil {
				return ErrUnauthorized
			}

			txRecord := tx
			txRecord.UserID = userID
			if txRecord.ID == uuid.Nil {
				txRecord.ID = uuid.New()
			}

			switch tx.Type {
			case model.Income:
				if tx.AccountID == uuid.Nil {
					return ErrMissingAccountID
				}
				balanceAdjustments[tx.AccountID] = balanceAdjustments[tx.AccountID].Add(tx.Amount)

			case model.Expense:
				if tx.AccountID == uuid.Nil {
					return ErrMissingAccountID
				}
				balanceAdjustments[tx.AccountID] = balanceAdjustments[tx.AccountID].Sub(tx.Amount)

			case model.Transfer:
				if tx.AccountID == uuid.Nil || tx.TargetAccountID == nil || *tx.TargetAccountID == uuid.Nil {
					return ErrMissingTargetAccountID
				}
				balanceAdjustments[tx.AccountID] = balanceAdjustments[tx.AccountID].Sub(tx.Amount)
				balanceAdjustments[*tx.TargetAccountID] = balanceAdjustments[*tx.TargetAccountID].Add(tx.Amount)

			default:
				return ErrInvalidTransactionType
			}

			txRecords = append(txRecords, txRecord)
		}

		// Apply all accumulated balance adjustments
		for accountID, adj := range balanceAdjustments {
			if adj.IsZero() {
				continue
			}

			acc, err := s.getValidAccount(accountID, userID)
			if err != nil {
				return err
			}

			acc.Balance = acc.Balance.Add(adj)
			if err := s.accountRepo.Update(acc); err != nil {
				return err
			}
		}

		if len(txRecords) > 0 {
			return s.txRepo.BulkCreate(txRecords)
		}
		return nil
	})
}

// --- Internal Helper Methods ---

// getValidAccount ensures an account exists and belongs to the given user.
func (s *transactionService) getValidAccount(accountID, userID uuid.UUID) (*model.Account, error) {
	acc, err := s.accountRepo.FindByID(accountID)
	if err != nil {
		return nil, ErrAccountNotFound
	}
	if acc.UserID != userID {
		return nil, ErrUnauthorized
	}
	return acc, nil
}

// getValidTransaction ensures a transaction exists and belongs to the given user.
func (s *transactionService) getValidTransaction(txID, userID uuid.UUID) (*model.Transaction, error) {
	tx, err := s.txRepo.FindByID(txID)
	if err != nil {
		return nil, ErrTransactionNotFound
	}
	if tx.UserID != userID {
		return nil, ErrUnauthorized
	}
	return tx, nil
}

// adjustBalances updates account balances based on transaction type and amount.
// A positive amount represents the standard flow (e.g., creating a transaction).
// A negative amount reverses the flow (e.g., deleting a transaction).
func (s *transactionService) adjustBalances(accountID uuid.UUID, targetAccountID *uuid.UUID, txType model.TransactionType, amount decimal.Decimal) error {
	acc, err := s.accountRepo.FindByID(accountID)
	if err != nil {
		return ErrAccountNotFound
	}

	switch txType {
	case model.Income:
		acc.Balance = acc.Balance.Add(amount)
	case model.Expense, model.Transfer:
		acc.Balance = acc.Balance.Sub(amount)
	}

	if err := s.accountRepo.Update(acc); err != nil {
		return err
	}

	// Apply target account changes for transfers
	if txType == model.Transfer && targetAccountID != nil {
		targetAcc, err := s.accountRepo.FindByID(*targetAccountID)
		if err != nil {
			return ErrAccountNotFound
		}
		targetAcc.Balance = targetAcc.Balance.Add(amount)
		if err := s.accountRepo.Update(targetAcc); err != nil {
			return err
		}
	}

	return nil
}
