package dashboard

import (
	"github.com/google/uuid"
	"github.com/shopspring/decimal"
	"github.com/vault-pro/backend/internal/model"
	"github.com/vault-pro/backend/internal/repository"
)

type DashboardSummary struct {
	TotalBalance decimal.Decimal            `json:"total_balance"`
	Jars         map[model.AccountType]decimal.Decimal `json:"jars"`
}

type DashboardService interface {
	GetSummary(userID uuid.UUID) (*DashboardSummary, error)
	GetExpensesByCategory(userID uuid.UUID, month, year int) (map[string]decimal.Decimal, error)
}

type dashboardService struct {
	accountRepo repository.AccountRepository
	txRepo      repository.TransactionRepository
}

func NewDashboardService(accountRepo repository.AccountRepository, txRepo repository.TransactionRepository) DashboardService {
	return &dashboardService{accountRepo: accountRepo, txRepo: txRepo}
}

func (s *dashboardService) GetSummary(userID uuid.UUID) (*DashboardSummary, error) {
	accounts, err := s.accountRepo.FindByUserID(userID)
	if err != nil {
		return nil, err
	}

	summary := &DashboardSummary{
		TotalBalance: decimal.Zero,
		Jars:         make(map[model.AccountType]decimal.Decimal),
	}

	for _, acc := range accounts {
		summary.TotalBalance = summary.TotalBalance.Add(acc.Balance)
		summary.Jars[acc.Type] = acc.Balance
	}

	return summary, nil
}

func (s *dashboardService) GetExpensesByCategory(userID uuid.UUID, month, year int) (map[string]decimal.Decimal, error) {
	txs, err := s.txRepo.FindByUserID(userID, month, year)
	if err != nil {
		return nil, err
	}

	expenses := make(map[string]decimal.Decimal)
	for _, tx := range txs {
		if tx.Type == model.Expense {
			category := tx.Category
			if category == "" {
				category = "Uncategorized"
			}
			expenses[category] = expenses[category].Add(tx.Amount)
		}
	}

	return expenses, nil
}
