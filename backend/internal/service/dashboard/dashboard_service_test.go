package dashboard

import (
	"testing"

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

	summary, err := dashboardService.GetSummary(userID)

	assert.NoError(t, err)
	assert.NotNil(t, summary)
	assert.True(t, summary.TotalBalance.Equal(decimal.NewFromFloat(750.00)))
	assert.True(t, summary.Jars[model.NEC].Equal(decimal.NewFromFloat(550.00)))
	assert.True(t, summary.Jars[model.FFA].Equal(decimal.NewFromFloat(100.00)))
	mockAccountRepo.AssertExpectations(t)
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
