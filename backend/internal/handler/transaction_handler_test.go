package handler

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/shopspring/decimal"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

// MockTransactionService is a mock of the TransactionService interface
type MockTransactionService struct {
	mock.Mock
}

func (m *MockTransactionService) AddIncome(userID uuid.UUID, amount decimal.Decimal, category, note string) error {
	args := m.Called(userID, amount, category, note)
	return args.Error(0)
}

func (m *MockTransactionService) AddExpense(userID uuid.UUID, accountID uuid.UUID, amount decimal.Decimal, category, note string) error {
	args := m.Called(userID, accountID, amount, category, note)
	return args.Error(0)
}

func (m *MockTransactionService) Transfer(userID uuid.UUID, fromAccountID, toAccountID uuid.UUID, amount decimal.Decimal, note string) error {
	args := m.Called(userID, fromAccountID, toAccountID, amount, note)
	return args.Error(0)
}

func TestTransactionHandler_AddIncome_Success(t *testing.T) {
	gin.SetMode(gin.TestMode)
	mockService := new(MockTransactionService)
	handler := NewTransactionHandler(mockService)
	
	r := gin.Default()
	userID := uuid.New()
	
	r.Use(func(c *gin.Context) {
		c.Set("userID", userID)
		c.Next()
	})
	
	r.POST("/income", handler.AddIncome)

	amount := decimal.NewFromFloat(1000.00)
	// Use mock.MatchedBy for decimal comparison
	mockService.On("AddIncome", userID, mock.MatchedBy(func(d decimal.Decimal) bool {
		return d.Equal(amount)
	}), "Salary", "Bonus").Return(nil)

	body := IncomeRequest{
		Amount:   amount,
		Category: "Salary",
		Note:     "Bonus",
	}
	jsonBody, _ := json.Marshal(body)

	req, _ := http.NewRequest("POST", "/income", bytes.NewBuffer(jsonBody))
	w := httptest.NewRecorder()
	
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusCreated, w.Code)
	mockService.AssertExpectations(t)
}

func TestTransactionHandler_AddExpense_Success(t *testing.T) {
	gin.SetMode(gin.TestMode)
	mockService := new(MockTransactionService)
	handler := NewTransactionHandler(mockService)
	
	r := gin.Default()
	userID := uuid.New()
	r.Use(func(c *gin.Context) {
		c.Set("userID", userID)
		c.Next()
	})
	
	r.POST("/expense", handler.AddExpense)

	accID := uuid.New()
	amount := decimal.NewFromFloat(50.00)
	mockService.On("AddExpense", userID, accID, mock.MatchedBy(func(d decimal.Decimal) bool {
		return d.Equal(amount)
	}), "Food", "Lunch").Return(nil)

	body := ExpenseRequest{
		AccountID: accID,
		Amount:    amount,
		Category:  "Food",
		Note:      "Lunch",
	}
	jsonBody, _ := json.Marshal(body)

	req, _ := http.NewRequest("POST", "/expense", bytes.NewBuffer(jsonBody))
	w := httptest.NewRecorder()
	
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusCreated, w.Code)
	mockService.AssertExpectations(t)
}
