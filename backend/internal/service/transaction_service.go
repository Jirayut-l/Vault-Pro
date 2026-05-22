package service

import (
	"errors"

	"github.com/google/uuid"
	"github.com/shopspring/decimal"
	"github.com/vault-pro/backend/internal/model"
	"github.com/vault-pro/backend/internal/repository"
	"gorm.io/gorm"
)

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
	return &transactionService{txRepo: txRepo, accountRepo: accountRepo, db: db}
}

func (s *transactionService) AddIncome(userID uuid.UUID, amount decimal.Decimal, category, note string) error {
	// Use transaction for atomic operation
	return s.db.Transaction(func(dbTx *gorm.DB) error {
		// Percentages as defined in SKILLS.md
		percentages := map[model.AccountType]decimal.Decimal{
			model.NEC: decimal.NewFromFloat(0.55),
			model.FFA: decimal.NewFromFloat(0.10),
			model.LTS: decimal.NewFromFloat(0.10),
			model.EDU: decimal.NewFromFloat(0.10),
			model.PLY: decimal.NewFromFloat(0.10),
			model.GIV: decimal.NewFromFloat(0.05),
		}

		for accType, percent := range percentages {
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

			// Record transaction for each jar
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

func (s *transactionService) BulkAddTransactions(userID uuid.UUID, transactions []model.Transaction) error {
	return s.db.Transaction(func(dbTx *gorm.DB) error {
		balanceAdjustments := make(map[uuid.UUID]decimal.Decimal)
		var txRecords []model.Transaction

		for _, tx := range transactions {
			if tx.UserID != userID && tx.UserID != uuid.Nil {
				return errors.New("unauthorized transaction user ID")
			}
			
			txRecord := tx
			txRecord.UserID = userID
			if txRecord.ID == uuid.Nil {
				txRecord.ID = uuid.New()
			}
			
			if tx.Type == model.Income {
				if tx.AccountID == uuid.Nil {
					return errors.New("income in bulk must specify an account ID")
				}
				balanceAdjustments[tx.AccountID] = balanceAdjustments[tx.AccountID].Add(tx.Amount)
			} else if tx.Type == model.Expense {
				if tx.AccountID == uuid.Nil {
					return errors.New("expense must specify an account ID")
				}
				balanceAdjustments[tx.AccountID] = balanceAdjustments[tx.AccountID].Sub(tx.Amount)
			} else if tx.Type == model.Transfer {
				if tx.AccountID == uuid.Nil || tx.TargetAccountID == nil || *tx.TargetAccountID == uuid.Nil {
					return errors.New("transfer must specify source and target account IDs")
				}
				balanceAdjustments[tx.AccountID] = balanceAdjustments[tx.AccountID].Sub(tx.Amount)
				balanceAdjustments[*tx.TargetAccountID] = balanceAdjustments[*tx.TargetAccountID].Add(tx.Amount)
			} else {
				return errors.New("invalid transaction type in bulk payload")
			}
			txRecords = append(txRecords, txRecord)
		}

		for accountID, adj := range balanceAdjustments {
			if adj.IsZero() {
				continue
			}
			acc, err := s.accountRepo.FindByID(accountID)
			if err != nil {
				return err
			}
			if acc.UserID != userID {
				return errors.New("unauthorized account modification")
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

func (s *transactionService) AddExpense(userID uuid.UUID, accountID uuid.UUID, amount decimal.Decimal, category, note string) error {
	return s.db.Transaction(func(dbTx *gorm.DB) error {
		acc, err := s.accountRepo.FindByID(accountID)
		if err != nil {
			return errors.New("account not found")
		}

		if acc.UserID != userID {
			return errors.New("unauthorized")
		}

		acc.Balance = acc.Balance.Sub(amount)
		if err := s.accountRepo.Update(acc); err != nil {
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

func (s *transactionService) Transfer(userID uuid.UUID, fromAccountID, toAccountID uuid.UUID, amount decimal.Decimal, note string) error {
	return s.db.Transaction(func(dbTx *gorm.DB) error {
		fromAcc, err := s.accountRepo.FindByID(fromAccountID)
		if err != nil {
			return errors.New("source account not found")
		}

		toAcc, err := s.accountRepo.FindByID(toAccountID)
		if err != nil {
			return errors.New("target account not found")
		}

		if fromAcc.UserID != userID || toAcc.UserID != userID {
			return errors.New("unauthorized")
		}

		fromAcc.Balance = fromAcc.Balance.Sub(amount)
		toAcc.Balance = toAcc.Balance.Add(amount)

		if err := s.accountRepo.Update(fromAcc); err != nil {
			return err
		}
		if err := s.accountRepo.Update(toAcc); err != nil {
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

func (s *transactionService) GetTransactions(userID uuid.UUID, month, year int) ([]model.Transaction, error) {
	return s.txRepo.FindByUserID(userID, month, year)
}

func (s *transactionService) UpdateTransaction(userID uuid.UUID, txID uuid.UUID, amount decimal.Decimal, category, note string) error {
	return s.db.Transaction(func(dbTx *gorm.DB) error {
		tx, err := s.txRepo.FindByID(txID)
		if err != nil {
			return errors.New("transaction not found")
		}

		if tx.UserID != userID {
			return errors.New("unauthorized")
		}

		// Handle balance adjustments if amount changed
		if !amount.Equal(tx.Amount) {
			diff := amount.Sub(tx.Amount)
			
			acc, err := s.accountRepo.FindByID(tx.AccountID)
			if err != nil {
				return errors.New("account not found")
			}

			if tx.Type == model.Income {
				acc.Balance = acc.Balance.Add(diff)
			} else if tx.Type == model.Expense {
				acc.Balance = acc.Balance.Sub(diff)
			} else if tx.Type == model.Transfer {
				acc.Balance = acc.Balance.Sub(diff)
				if tx.TargetAccountID != nil {
					targetAcc, err := s.accountRepo.FindByID(*tx.TargetAccountID)
					if err != nil {
						return errors.New("target account not found")
					}
					targetAcc.Balance = targetAcc.Balance.Add(diff)
					if err := s.accountRepo.Update(targetAcc); err != nil {
						return err
					}
				}
			}

			if err := s.accountRepo.Update(acc); err != nil {
				return err
			}
			tx.Amount = amount
		}

		tx.Category = category
		tx.Note = note

		return s.txRepo.Update(tx)
	})
}

func (s *transactionService) DeleteTransaction(userID uuid.UUID, txID uuid.UUID) error {
	return s.db.Transaction(func(dbTx *gorm.DB) error {
		tx, err := s.txRepo.FindByID(txID)
		if err != nil {
			return errors.New("transaction not found")
		}

		if tx.UserID != userID {
			return errors.New("unauthorized")
		}

		// Reverse balance effect
		acc, err := s.accountRepo.FindByID(tx.AccountID)
		if err != nil {
			return errors.New("account not found")
		}

		if tx.Type == model.Income {
			acc.Balance = acc.Balance.Sub(tx.Amount)
		} else if tx.Type == model.Expense {
			acc.Balance = acc.Balance.Add(tx.Amount)
		} else if tx.Type == model.Transfer {
			acc.Balance = acc.Balance.Add(tx.Amount)
			if tx.TargetAccountID != nil {
				targetAcc, err := s.accountRepo.FindByID(*tx.TargetAccountID)
				if err != nil {
					return errors.New("target account not found")
				}
				targetAcc.Balance = targetAcc.Balance.Sub(tx.Amount)
				if err := s.accountRepo.Update(targetAcc); err != nil {
					return err
				}
			}
		}

		if err := s.accountRepo.Update(acc); err != nil {
			return err
		}

		return s.txRepo.Delete(txID)
	})
}
