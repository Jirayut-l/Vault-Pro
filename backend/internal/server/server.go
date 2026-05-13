package server

import (
	"log"

	"github.com/gin-gonic/gin"
	"github.com/vault-pro/backend/internal/config"
	"github.com/vault-pro/backend/internal/handler"
	"github.com/vault-pro/backend/internal/middleware"
	"github.com/vault-pro/backend/internal/repository"
	"github.com/vault-pro/backend/internal/service"
	"github.com/vault-pro/backend/pkg/utils"
	"gorm.io/gorm"
)

type Server struct {
	router *gin.Engine
	cfg    *config.Config
	db     *gorm.DB
}

func NewServer(cfg *config.Config, db *gorm.DB) *Server {
	s := &Server{
		router: gin.Default(),
		cfg:    cfg,
		db:     db,
	}

	s.setupRoutes()
	return s
}

func (s *Server) setupRoutes() {
	// Initialize Token Manager
	tokenManager, err := utils.NewTokenManager(s.cfg.JWTSecret, s.cfg.AccessTokenExp, s.cfg.RefreshTokenExp)
	if err != nil {
		log.Fatalf("Failed to initialize token manager: %v", err)
	}

	// Initialize Repositories
	userRepo := repository.NewUserRepository(s.db)
	accountRepo := repository.NewAccountRepository(s.db)
	txRepo := repository.NewTransactionRepository(s.db)
	subRepo := repository.NewSubscriptionRepository(s.db)
	invRepo := repository.NewInvestmentRepository(s.db)

	// Initialize Services
	userService := service.NewUserService(userRepo, tokenManager)
	txService := service.NewTransactionService(txRepo, accountRepo, s.db)
	dashboardService := service.NewDashboardService(accountRepo, txRepo)
	subService := service.NewSubscriptionService(subRepo)
	invService := service.NewInvestmentService(invRepo, accountRepo, txRepo, s.db)

	// Initialize Handlers
	authHandler := handler.NewAuthHandler(userService)
	txHandler := handler.NewTransactionHandler(txService)
	dashboardHandler := handler.NewDashboardHandler(dashboardService)
	subHandler := handler.NewSubscriptionHandler(subService)
	invHandler := handler.NewInvestmentHandler(invService)

	// Base route
	s.router.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "Vault Pro API is running",
		})
	})

	// API v1 Routes
	authMiddleware := middleware.AuthMiddleware(tokenManager)
	v1 := s.router.Group("/api/v1")
	{
		auth := v1.Group("/auth")
		{
			auth.POST("/register", authHandler.Register)
			auth.POST("/login", authHandler.Login)
			auth.POST("/refresh", authHandler.Refresh)
			auth.GET("/me", authMiddleware, authHandler.Me)
		}

		transactions := v1.Group("/transactions", authMiddleware)
		{
			transactions.GET("", txHandler.GetAll)
			transactions.POST("", txHandler.Create)
			transactions.PUT("/:id", txHandler.Update)
			transactions.DELETE("/:id", txHandler.Delete)
		}

		dashboard := v1.Group("/dashboard", authMiddleware)
		{
			dashboard.GET("/summary", dashboardHandler.GetSummary)
			dashboard.GET("/expenses-by-category", dashboardHandler.GetExpensesByCategory)
		}

		subscriptions := v1.Group("/subscriptions", authMiddleware)
		{
			subscriptions.GET("", subHandler.GetAll)
			subscriptions.POST("", subHandler.Create)
		}

		investments := v1.Group("/investments", authMiddleware)
		{
			investments.GET("", invHandler.GetAll)
			investments.POST("/buy", invHandler.Buy)
		}
	}
}

func (s *Server) Run() error {
	log.Printf("Server starting on port %s", s.cfg.Port)
	return s.router.Run(":" + s.cfg.Port)
}
