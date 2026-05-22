package auth

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/vault-pro/backend/internal/service"
)

type Handler struct {
	userService service.UserService
}

func NewHandler(userService service.UserService) *Handler {
	return &Handler{userService: userService}
}

func (h *Handler) RegisterRoutes(r *gin.RouterGroup, authMiddleware gin.HandlerFunc) {
	r.POST("/register", h.Register)
	r.POST("/login", h.Login)
	r.POST("/refresh", h.Refresh)
	r.GET("/me", authMiddleware, h.Me)
}

type RegisterRequest struct {
	Username string `json:"username" binding:"required"`
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=6"`
}

type LoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

func (h *Handler) Register(c *gin.Context) {
	var req RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error(), "success": false})
		return
	}

	user, err := h.userService.Register(req.Username, req.Email, req.Password)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to register user", "success": false})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "User registered successfully",
		"success": true,
		"data": gin.H{
			"id":       user.ID,
			"username": user.Username,
			"email":    user.Email,
		},
	})
}

func (h *Handler) Login(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error(), "success": false})
		return
	}

	accessToken, refreshToken, err := h.userService.Login(req.Email, req.Password)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error(), "success": false})
		return
	}

	// Set refresh token in HttpOnly cookie
	c.SetSameSite(http.SameSiteStrictMode)
	c.SetCookie("refresh_token", refreshToken, 60*60*24*7, "/", "", true, true)

	c.JSON(http.StatusOK, gin.H{
		"message": "Login successful",
		"success": true,
		"data": gin.H{
			"access_token": accessToken,
		},
	})
}

func (h *Handler) Refresh(c *gin.Context) {
	refreshToken, err := c.Cookie("refresh_token")
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Refresh token not found", "success": false})
		return
	}

	newAccessToken, newRefreshToken, err := h.userService.RefreshToken(refreshToken)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired refresh token", "success": false})
		return
	}

	// Update refresh token cookie
	c.SetSameSite(http.SameSiteStrictMode)
	c.SetCookie("refresh_token", newRefreshToken, 60*60*24*7, "/", "", true, true)

	c.JSON(http.StatusOK, gin.H{
		"message": "Token refreshed successfully",
		"success": true,
		"data": gin.H{
			"access_token": newAccessToken,
		},
	})
}

func (h *Handler) Me(c *gin.Context) {
	userID, _ := c.Get("userID")
	
	// In a real app, you might want to fetch full user info from DB
	// For now, we just return the ID from the token
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"user_id": userID,
		},
	})
}
