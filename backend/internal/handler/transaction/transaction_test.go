package transaction

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
	"github.com/vault-pro/backend/internal/mocks"
	"github.com/vault-pro/backend/internal/model"
)

func TestHandler_Create_Income_Success(t *testing.T) {
	gin.SetMode(gin.TestMode)
	mockService := new(mocks.MockTransactionService)
	handler := NewHandler(mockService)
	
	r := gin.Default()
	userID := uuid.New()
	
	r.Use(func(c *gin.Context) {
		c.Set("userID", userID)
		c.Next()
	})
	
	r.POST("/transactions", handler.Create)

	amount := decimal.NewFromFloat(1000.00)
	mockService.On("AddIncome", userID, mock.MatchedBy(func(d decimal.Decimal) bool {
		return d.Equal(amount)
	}), "Salary", "Bonus").Return(nil)

	body := CreateTransactionRequest{
		Amount:   amount,
		Type:     model.Income,
		Category: "Salary",
		Note:     "Bonus",
	}
	jsonBody, _ := json.Marshal(body)

	req, _ := http.NewRequest("POST", "/transactions", bytes.NewBuffer(jsonBody))
	w := httptest.NewRecorder()
	
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusCreated, w.Code)
	mockService.AssertExpectations(t)
}

func TestHandler_Create_Expense_Success(t *testing.T) {
	gin.SetMode(gin.TestMode)
	mockService := new(mocks.MockTransactionService)
	handler := NewHandler(mockService)
	
	r := gin.Default()
	userID := uuid.New()
	r.Use(func(c *gin.Context) {
		c.Set("userID", userID)
		c.Next()
	})
	
	r.POST("/transactions", handler.Create)

	accID := uuid.New()
	amount := decimal.NewFromFloat(50.00)
	mockService.On("AddExpense", userID, accID, mock.MatchedBy(func(d decimal.Decimal) bool {
		return d.Equal(amount)
	}), "Food", "Lunch").Return(nil)

	body := CreateTransactionRequest{
		AccountID: accID,
		Amount:    amount,
		Type:      model.Expense,
		Category:  "Food",
		Note:      "Lunch",
	}
	jsonBody, _ := json.Marshal(body)

	req, _ := http.NewRequest("POST", "/transactions", bytes.NewBuffer(jsonBody))
	w := httptest.NewRecorder()
	
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusCreated, w.Code)
	mockService.AssertExpectations(t)
}

func TestHandler_GetAll_Success(t *testing.T) {
	gin.SetMode(gin.TestMode)
	mockService := new(mocks.MockTransactionService)
	handler := NewHandler(mockService)
	
	r := gin.Default()
	userID := uuid.New()
	r.Use(func(c *gin.Context) {
		c.Set("userID", userID)
		c.Next()
	})
	
	r.GET("/transactions", handler.GetAll)

	mockTxs := []model.Transaction{
		{ID: uuid.New(), Amount: decimal.NewFromFloat(100.00)},
	}
	mockService.On("GetTransactions", userID, 5, 2026).Return(mockTxs, nil)

	req, _ := http.NewRequest("GET", "/transactions?month=5&year=2026", nil)
	w := httptest.NewRecorder()
	
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	mockService.AssertExpectations(t)
}
