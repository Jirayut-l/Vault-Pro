package main

import (
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/vault-pro/backend/internal/handler"
	"github.com/vault-pro/backend/internal/repository"
	"github.com/vault-pro/backend/internal/service"
	"github.com/vault-pro/backend/pkg/utils"
)

func init() {
	// Load .env file
	if err := godotenv.Load(); err != nil {
		log.Println("Warning: .env file not found, using system environment variables")
	}
}

func main() {
	// Connect to Database
	utils.ConnectDatabase()

	// Initialize Layers
	userRepo := repository.NewUserRepository(utils.DB)
	userService := service.NewUserService(userRepo)
	authHandler := handler.NewAuthHandler(userService)

	accountRepo := repository.NewAccountRepository(utils.DB)
	txRepo := repository.NewTransactionRepository(utils.DB)
	txService := service.NewTransactionService(txRepo, accountRepo, utils.DB)
	txHandler := handler.NewTransactionHandler(txService)

	dashboardService := service.NewDashboardService(accountRepo, txRepo)
	dashboardHandler := handler.NewDashboardHandler(dashboardService)

	// Initialize Gin
	r := gin.Default()

	// CORS or other global middleware could go here

	// API v1 Routes
	v1 := r.Group("/api/v1")
	{
		auth := v1.Group("/auth")
		{
			auth.POST("/register", authHandler.Register)
			auth.POST("/login", authHandler.Login)
			auth.POST("/refresh", authHandler.Refresh)
			auth.GET("/me", handler.AuthMiddleware(), authHandler.Me)
		}

		transactions := v1.Group("/transactions", handler.AuthMiddleware())
		{
			transactions.POST("/income", txHandler.AddIncome)
			transactions.POST("/expense", txHandler.AddExpense)
			transactions.POST("/transfer", txHandler.Transfer)
		}

		dashboard := v1.Group("/dashboard", handler.AuthMiddleware())
		{
			dashboard.GET("/summary", dashboardHandler.GetSummary)
			dashboard.GET("/expenses-by-category", dashboardHandler.GetExpensesByCategory)
		}
	}

	// Base route
	r.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "Vault Pro API is running",
		})
	})

	// Get port from env
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server starting on port %s", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatalf("Failed to run server: %v", err)
	}
}
