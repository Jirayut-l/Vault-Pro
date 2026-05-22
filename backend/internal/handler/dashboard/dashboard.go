package dashboard

import (
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/vault-pro/backend/internal/service/dashboard"
)

type Handler struct {
	dashboardService dashboard.DashboardService
}

func NewHandler(dashboardService dashboard.DashboardService) *Handler {
	return &Handler{dashboardService: dashboardService}
}

func (h *Handler) RegisterRoutes(r *gin.RouterGroup) {
	r.GET("/summary", h.GetSummary)
	r.GET("/expenses-by-category", h.GetExpensesByCategory)
}

func (h *Handler) GetSummary(c *gin.Context) {
	userID, _ := c.Get("userID")
	summary, err := h.dashboardService.GetSummary(userID.(uuid.UUID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error(), "success": false})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true, "data": summary})
}

func (h *Handler) GetExpensesByCategory(c *gin.Context) {
	userID, _ := c.Get("userID")
	
	now := time.Now()
	monthStr := c.DefaultQuery("month", strconv.Itoa(int(now.Month())))
	yearStr := c.DefaultQuery("year", strconv.Itoa(now.Year()))

	month, _ := strconv.Atoi(monthStr)
	year, _ := strconv.Atoi(yearStr)

	expenses, err := h.dashboardService.GetExpensesByCategory(userID.(uuid.UUID), month, year)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error(), "success": false})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true, "data": expenses})
}
