package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/shopspring/decimal"
	"github.com/vault-pro/backend/internal/service"
)

type InvestmentHandler struct {
	invService service.InvestmentService
}

func NewInvestmentHandler(invService service.InvestmentService) *InvestmentHandler {
	return &InvestmentHandler{invService: invService}
}

type BuyInvestmentRequest struct {
	AccountID uuid.UUID       `json:"account_id" binding:"required"`
	Name      string          `json:"name" binding:"required"`
	Symbol    string          `json:"symbol" binding:"required"`
	Type      string          `json:"type"` // RMF, Thai ESG, ETF
	Units     decimal.Decimal `json:"units" binding:"required"`
	Price     decimal.Decimal `json:"price" binding:"required"`
}

func (h *InvestmentHandler) GetAll(c *gin.Context) {
	userID, _ := c.Get("userID")
	invs, err := h.invService.GetInvestments(userID.(uuid.UUID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error(), "success": false})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true, "data": invs})
}

func (h *InvestmentHandler) Buy(c *gin.Context) {
	userID, _ := c.Get("userID")
	var req BuyInvestmentRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error(), "success": false})
		return
	}

	inv, err := h.invService.BuyInvestment(userID.(uuid.UUID), req.AccountID, req.Name, req.Symbol, req.Type, req.Units, req.Price)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error(), "success": false})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Investment purchase recorded successfully", "success": true, "data": inv})
}
