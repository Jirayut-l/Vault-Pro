package service

import (
	"errors"

	"github.com/google/uuid"
	"github.com/shopspring/decimal"
	"github.com/vault-pro/backend/internal/model"
	"github.com/vault-pro/backend/internal/repository"
	"gorm.io/gorm"
)

type InvestmentService interface {
	BuyInvestment(userID uuid.UUID, accountID uuid.UUID, name, symbol, invType string, units, price decimal.Decimal) (*model.Investment, error)
	GetInvestments(userID uuid.UUID) ([]model.Investment, error)
}

type investmentService struct {
	invRepo     repository.InvestmentRepository
	accountRepo repository.AccountRepository
	txRepo      repository.TransactionRepository
	db          *gorm.DB
}

func NewInvestmentService(invRepo repository.InvestmentRepository, accountRepo repository.AccountRepository, txRepo repository.TransactionRepository, db *gorm.DB) InvestmentService {
	return &investmentService{invRepo: invRepo, accountRepo: accountRepo, txRepo: txRepo, db: db}
}

func (s *investmentService) BuyInvestment(userID uuid.UUID, accountID uuid.UUID, name, symbol, invType string, units, price decimal.Decimal) (*model.Investment, error) {
	totalAmount := units.Mul(price)
	var inv *model.Investment

	err := s.db.Transaction(func(dbTx *gorm.DB) error {
		// 1. Update Account Balance
		acc, err := s.accountRepo.FindByID(accountID)
		if err != nil {
			return errors.New("account not found")
		}
		if acc.UserID != userID {
			return errors.New("unauthorized")
		}

		acc.Balance = acc.Balance.Sub(totalAmount)
		if err := s.accountRepo.Update(acc); err != nil {
			return err
		}

		// 2. Record Transaction
		txRecord := &model.Transaction{
			UserID:    userID,
			AccountID: accountID,
			Amount:    totalAmount,
			Type:      model.Expense,
			Category:  "Investment",
			Note:      "Bought " + symbol,
		}
		if err := s.txRepo.Create(txRecord); err != nil {
			return err
		}

		// 3. Update Investment Portfolio
		existingInv, err := s.invRepo.FindBySymbol(userID, symbol)
		if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
			return err
		}

		if existingInv != nil && existingInv.ID != uuid.Nil {
			// Update average cost and units
			newTotalUnits := existingInv.Units.Add(units)
			if !newTotalUnits.IsZero() {
				// (OldUnits * OldAvgCost + NewUnits * NewPrice) / NewTotalUnits
				totalCost := existingInv.Units.Mul(existingInv.AvgCost).Add(totalAmount)
				existingInv.AvgCost = totalCost.Div(newTotalUnits)
			}
			existingInv.Units = newTotalUnits
			if err := s.invRepo.Update(existingInv); err != nil {
				return err
			}
			inv = existingInv
		} else {
			// Create new investment entry
			inv = &model.Investment{
				UserID:    userID,
				AccountID: accountID,
				Name:      name,
				Symbol:    symbol,
				Type:      invType,
				Units:     units,
				AvgCost:   price,
			}
			if err := s.invRepo.Create(inv); err != nil {
				return err
			}
		}

		return nil
	})

	return inv, err
}

func (s *investmentService) GetInvestments(userID uuid.UUID) ([]model.Investment, error) {
	return s.invRepo.FindByUserID(userID)
}
