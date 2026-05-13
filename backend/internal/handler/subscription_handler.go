package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/shopspring/decimal"
	"github.com/vault-pro/backend/internal/service"
)

type SubscriptionHandler struct {
	subService service.SubscriptionService
}

func NewSubscriptionHandler(subService service.SubscriptionService) *SubscriptionHandler {
	return &SubscriptionHandler{subService: subService}
}

type CreateSubscriptionRequest struct {
	AccountID       uuid.UUID       `json:"account_id" binding:"required"`
	Name            string          `json:"name" binding:"required"`
	Amount          decimal.Decimal `json:"amount" binding:"required"`
	BillingCycleDay int             `json:"billing_cycle_day" binding:"required,min=1,max=31"`
}

func (h *SubscriptionHandler) GetAll(c *gin.Context) {
	userID, _ := c.Get("userID")
	subs, err := h.subService.GetSubscriptions(userID.(uuid.UUID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error(), "success": false})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true, "data": subs})
}

func (h *SubscriptionHandler) Create(c *gin.Context) {
	userID, _ := c.Get("userID")
	var req CreateSubscriptionRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error(), "success": false})
		return
	}

	sub, err := h.subService.CreateSubscription(userID.(uuid.UUID), req.AccountID, req.Name, req.Amount, req.BillingCycleDay)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error(), "success": false})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Subscription created successfully", "success": true, "data": sub})
}
