package transaction

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/shopspring/decimal"
	"github.com/vault-pro/backend/internal/model"
	"github.com/vault-pro/backend/internal/service/transaction"
)

type Handler struct {
	txService transaction.TransactionService
}

func NewHandler(txService transaction.TransactionService) *Handler {
	return &Handler{txService: txService}
}

func (h *Handler) RegisterRoutes(r *gin.RouterGroup) {
	r.GET("", h.GetAll)
	r.POST("", h.Create)
	r.POST("/bulk", h.BulkCreate)
	r.PUT("/:id", h.Update)
	r.DELETE("/:id", h.Delete)
}

type CreateTransactionRequest struct {
	Amount          decimal.Decimal       `json:"amount" binding:"required"`
	Type            model.TransactionType `json:"type" binding:"required"`
	AccountID       uuid.UUID             `json:"account_id"`
	TargetAccountID *uuid.UUID            `json:"target_account_id"`
	Category        string                `json:"category"`
	Note            string                `json:"note"`
}

type BulkCreateTransactionRequest struct {
	Transactions []model.Transaction `json:"transactions" binding:"required,dive"`
}


type UpdateTransactionRequest struct {
	Amount   decimal.Decimal `json:"amount" binding:"required"`
	Category string          `json:"category"`
	Note     string          `json:"note"`
}

func (h *Handler) GetAll(c *gin.Context) {
	userID, _ := c.Get("userID")
	
	monthStr := c.Query("month")
	yearStr := c.Query("year")

	month, _ := strconv.Atoi(monthStr)
	year, _ := strconv.Atoi(yearStr)

	transactions, err := h.txService.GetTransactions(userID.(uuid.UUID), month, year)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error(), "success": false})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true, "data": transactions})
}

func (h *Handler) Create(c *gin.Context) {
	userID, _ := c.Get("userID")
	var req CreateTransactionRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error(), "success": false})
		return
	}

	var err error
	switch req.Type {
	case model.Income:
		err = h.txService.AddIncome(userID.(uuid.UUID), req.Amount, req.Category, req.Note)
	case model.Expense:
		if req.AccountID == uuid.Nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "account_id is required for expense", "success": false})
			return
		}
		err = h.txService.AddExpense(userID.(uuid.UUID), req.AccountID, req.Amount, req.Category, req.Note)
	case model.Transfer:
		if req.AccountID == uuid.Nil || req.TargetAccountID == nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "account_id and target_account_id are required for transfer", "success": false})
			return
		}
		err = h.txService.Transfer(userID.(uuid.UUID), req.AccountID, *req.TargetAccountID, req.Amount, req.Note)
	default:
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid transaction type", "success": false})
		return
	}

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error(), "success": false})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Transaction created successfully", "success": true})
}

func (h *Handler) BulkCreate(c *gin.Context) {
	userID, _ := c.Get("userID")
	var req BulkCreateTransactionRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error(), "success": false})
		return
	}

	err := h.txService.BulkAddTransactions(userID.(uuid.UUID), req.Transactions)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error(), "success": false})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Bulk transactions created successfully", "success": true})
}


func (h *Handler) Update(c *gin.Context) {
	userID, _ := c.Get("userID")
	idStr := c.Param("id")
	txID, err := uuid.Parse(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid transaction id", "success": false})
		return
	}

	var req UpdateTransactionRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error(), "success": false})
		return
	}

	err = h.txService.UpdateTransaction(userID.(uuid.UUID), txID, req.Amount, req.Category, req.Note)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error(), "success": false})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Transaction updated successfully", "success": true})
}

func (h *Handler) Delete(c *gin.Context) {
	userID, _ := c.Get("userID")
	idStr := c.Param("id")
	txID, err := uuid.Parse(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid transaction id", "success": false})
		return
	}

	err = h.txService.DeleteTransaction(userID.(uuid.UUID), txID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error(), "success": false})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Transaction deleted successfully", "success": true})
}
