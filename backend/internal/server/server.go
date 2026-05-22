package server

import (
	"log"

	"github.com/gin-gonic/gin"
	"github.com/vault-pro/backend/internal/config"
	"github.com/vault-pro/backend/internal/handler/auth"
	"github.com/vault-pro/backend/internal/handler/dashboard"
	"github.com/vault-pro/backend/internal/handler/investment"
	"github.com/vault-pro/backend/internal/handler/subscription"
	"github.com/vault-pro/backend/internal/handler/transaction"
	"github.com/vault-pro/backend/internal/middleware"
	"github.com/vault-pro/backend/internal/repository"
	dashboardSvc "github.com/vault-pro/backend/internal/service/dashboard"
	investmentSvc "github.com/vault-pro/backend/internal/service/investment"
	subscriptionSvc "github.com/vault-pro/backend/internal/service/subscription"
	transactionSvc "github.com/vault-pro/backend/internal/service/transaction"
	userSvc "github.com/vault-pro/backend/internal/service/user"
	"github.com/vault-pro/backend/pkg/utils"
	"gorm.io/gorm"
)

type Server struct {
	router *gin.Engine
	cfg    *config.Config
	db     *gorm.DB
}

func New(cfg *config.Config, db *gorm.DB) *Server {
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
	userService := userSvc.NewUserService(userRepo, tokenManager)
	txService := transactionSvc.NewTransactionService(txRepo, accountRepo, s.db)
	dashboardService := dashboardSvc.NewDashboardService(accountRepo, txRepo)
	subService := subscriptionSvc.NewSubscriptionService(subRepo)
	invService := investmentSvc.NewInvestmentService(invRepo, accountRepo, txRepo, s.db)

	// Initialize Handlers
	authHandler := auth.NewHandler(userService)
	txHandler := transaction.NewHandler(txService)
	dashboardHandler := dashboard.NewHandler(dashboardService)
	subHandler := subscription.NewHandler(subService)
	invHandler := investment.NewHandler(invService)

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
		authGroup := v1.Group("/auth")
		authHandler.RegisterRoutes(authGroup, authMiddleware)

		transactionsGroup := v1.Group("/transactions", authMiddleware)
		txHandler.RegisterRoutes(transactionsGroup)

		dashboardGroup := v1.Group("/dashboard", authMiddleware)
		dashboardHandler.RegisterRoutes(dashboardGroup)

		subscriptionsGroup := v1.Group("/subscriptions", authMiddleware)
		subHandler.RegisterRoutes(subscriptionsGroup)

		investmentsGroup := v1.Group("/investments", authMiddleware)
		invHandler.RegisterRoutes(investmentsGroup)
	}
}

func (s *Server) Run() error {
	log.Printf("Server starting on port %s", s.cfg.Port)
	return s.router.Run(":" + s.cfg.Port)
}
