package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/shopspring/decimal"
	"github.com/vault-pro/backend/internal/service"
)

type TransactionHandler struct {
	txService service.TransactionService
}

func NewTransactionHandler(txService service.TransactionService) *TransactionHandler {
	return &TransactionHandler{txService: txService}
}

type IncomeRequest struct {
	Amount   decimal.Decimal `json:"amount" binding:"required"`
	Category string          `json:"category"`
	Note     string          `json:"note"`
}

type ExpenseRequest struct {
	AccountID uuid.UUID       `json:"account_id" binding:"required"`
	Amount    decimal.Decimal `json:"amount" binding:"required"`
	Category  string          `json:"category"`
	Note      string          `json:"note"`
}

type TransferRequest struct {
	FromAccountID uuid.UUID       `json:"from_account_id" binding:"required"`
	ToAccountID   uuid.UUID       `json:"to_account_id" binding:"required"`
	Amount        decimal.Decimal `json:"amount" binding:"required"`
	Note          string          `json:"note"`
}

func (h *TransactionHandler) AddIncome(c *gin.Context) {
	userID, _ := c.Get("userID")
	var req IncomeRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error(), "success": false})
		return
	}

	err := h.txService.AddIncome(userID.(uuid.UUID), req.Amount, req.Category, req.Note)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error(), "success": false})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Income added and distributed successfully", "success": true})
}

func (h *TransactionHandler) AddExpense(c *gin.Context) {
	userID, _ := c.Get("userID")
	var req ExpenseRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error(), "success": false})
		return
	}

	err := h.txService.AddExpense(userID.(uuid.UUID), req.AccountID, req.Amount, req.Category, req.Note)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error(), "success": false})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Expense recorded successfully", "success": true})
}

func (h *TransactionHandler) Transfer(c *gin.Context) {
	userID, _ := c.Get("userID")
	var req TransferRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error(), "success": false})
		return
	}

	err := h.txService.Transfer(userID.(uuid.UUID), req.FromAccountID, req.ToAccountID, req.Amount, req.Note)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error(), "success": false})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Transfer completed successfully", "success": true})
}
