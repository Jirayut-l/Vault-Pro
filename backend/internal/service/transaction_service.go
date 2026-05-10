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
