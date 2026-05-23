package dashboard

import (
	"testing"
	"time"

	"github.com/google/uuid"
	"github.com/shopspring/decimal"
	"github.com/stretchr/testify/assert"
	"github.com/vault-pro/backend/internal/mocks"
	"github.com/vault-pro/backend/internal/model"
)

func TestGetSummary_Success(t *testing.T) {
	mockAccountRepo := new(mocks.MockAccountRepository)
	mockTxRepo := new(mocks.MockTransactionRepository)
	dashboardService := NewDashboardService(mockAccountRepo, mockTxRepo)

	userID := uuid.New()
	
	accounts := []model.Account{
		{Type: model.NEC, Balance: decimal.NewFromFloat(550.00)},
		{Type: model.FFA, Balance: decimal.NewFromFloat(100.00)},
		{Type: model.LTS, Balance: decimal.NewFromFloat(100.00)},
	}

	mockAccountRepo.On("FindByUserID", userID).Return(accounts, nil)

	now := time.Now()
	transactions := []model.Transaction{
		{Type: model.Income, Amount: decimal.NewFromFloat(2000.00)},
		{Type: model.Expense, Amount: decimal.NewFromFloat(500.00)},
	}
	mockTxRepo.On("FindByUserID", userID, int(now.Month()), now.Year()).Return(transactions, nil)

	summary, err := dashboardService.GetSummary(userID)

	assert.NoError(t, err)
	assert.NotNil(t, summary)
	assert.True(t, summary.TotalBalance.Equal(decimal.NewFromFloat(750.00)))
	assert.True(t, summary.MonthlyIncome.Equal(decimal.NewFromFloat(2000.00)))
	assert.True(t, summary.MonthlyExpenses.Equal(decimal.NewFromFloat(500.00)))
	
	assert.Equal(t, 3, len(summary.JarsSummary))
	
	// Assert NEC: (550 / 750) * 100 = 73.33333333333333
	assert.Equal(t, model.NEC, summary.JarsSummary[0].Type)
	assert.True(t, summary.JarsSummary[0].Balance.Equal(decimal.NewFromFloat(550.00)))
	assert.InDelta(t, 73.33, summary.JarsSummary[0].Percentage, 0.01)

	// Assert FFA: (100 / 750) * 100 = 13.333333333333334
	assert.Equal(t, model.FFA, summary.JarsSummary[1].Type)
	assert.True(t, summary.JarsSummary[1].Balance.Equal(decimal.NewFromFloat(100.00)))
	assert.InDelta(t, 13.33, summary.JarsSummary[1].Percentage, 0.01)

	mockAccountRepo.AssertExpectations(t)
	mockTxRepo.AssertExpectations(t)
}

func TestGetExpensesByCategory_Success(t *testing.T) {
	mockAccountRepo := new(mocks.MockAccountRepository)
	mockTxRepo := new(mocks.MockTransactionRepository)
	dashboardService := NewDashboardService(mockAccountRepo, mockTxRepo)

	userID := uuid.New()
	month, year := 5, 2026

	transactions := []model.Transaction{
		{Type: model.Expense, Category: "Food", Amount: decimal.NewFromFloat(150.00)},
		{Type: model.Expense, Category: "Food", Amount: decimal.NewFromFloat(50.00)},
		{Type: model.Expense, Category: "Rent", Amount: decimal.NewFromFloat(1000.00)},
		{Type: model.Income, Category: "Salary", Amount: decimal.NewFromFloat(5000.00)}, // Should be ignored
	}

	mockTxRepo.On("FindByUserID", userID, month, year).Return(transactions, nil)

	expenses, err := dashboardService.GetExpensesByCategory(userID, month, year)

	assert.NoError(t, err)
	assert.NotNil(t, expenses)
	assert.True(t, expenses["Food"].Equal(decimal.NewFromFloat(200.00)))
	assert.True(t, expenses["Rent"].Equal(decimal.NewFromFloat(1000.00)))
	assert.Equal(t, 2, len(expenses))
	mockTxRepo.AssertExpectations(t)
}
