package dashboard

import (
	"time"

	"github.com/google/uuid"
	"github.com/shopspring/decimal"
	"github.com/vault-pro/backend/internal/model"
	"github.com/vault-pro/backend/internal/repository"
)

type JarSummary struct {
	Type       model.AccountType `json:"type"`
	Balance    decimal.Decimal   `json:"balance"`
	Percentage float64           `json:"percentage"`
}

type DashboardSummary struct {
	TotalBalance    decimal.Decimal `json:"total_balance"`
	MonthlyIncome   decimal.Decimal `json:"monthly_income"`
	MonthlyExpenses decimal.Decimal `json:"monthly_expenses"`
	JarsSummary     []JarSummary    `json:"jars_summary"`
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

	totalBalance := decimal.Zero
	for _, acc := range accounts {
		totalBalance = totalBalance.Add(acc.Balance)
	}

	// Fetch current month's transactions to calculate monthly income and expenses
	now := time.Now()
	txs, err := s.txRepo.FindByUserID(userID, int(now.Month()), now.Year())
	if err != nil {
		return nil, err
	}

	monthlyIncome := decimal.Zero
	monthlyExpenses := decimal.Zero
	for _, tx := range txs {
		if tx.Type == model.Income {
			monthlyIncome = monthlyIncome.Add(tx.Amount)
		} else if tx.Type == model.Expense {
			monthlyExpenses = monthlyExpenses.Add(tx.Amount)
		}
	}

	jarsSummary := make([]JarSummary, 0, len(accounts))
	for _, acc := range accounts {
		percentage := 0.0
		if !totalBalance.IsZero() {
			percentageDiv := acc.Balance.Div(totalBalance).Mul(decimal.NewFromFloat(100))
			percentage, _ = percentageDiv.Float64()
		}
		jarsSummary = append(jarsSummary, JarSummary{
			Type:       acc.Type,
			Balance:    acc.Balance,
			Percentage: percentage,
		})
	}

	return &DashboardSummary{
		TotalBalance:    totalBalance,
		MonthlyIncome:   monthlyIncome,
		MonthlyExpenses: monthlyExpenses,
		JarsSummary:     jarsSummary,
	}, nil
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
