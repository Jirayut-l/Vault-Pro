package utils

import (
	"fmt"
	"log"

	"github.com/vault-pro/backend/internal/config"
	"github.com/vault-pro/backend/internal/model"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var DB *gorm.DB

func ConnectDatabase(cfg *config.Config) {
	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=%s TimeZone=Asia/Bangkok",
		cfg.DBHost, cfg.DBUser, cfg.DBPassword, cfg.DBName, cfg.DBPort, cfg.DBSSLMode)

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})

	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	fmt.Println("Database connection established")
	DB = db

	// Auto Migration
	err = db.AutoMigrate(
		&model.User{},
		&model.Account{},
		&model.Transaction{},
		&model.Subscription{},
		&model.Investment{},
	)
	if err != nil {
		log.Printf("Warning: Auto migration failed: %v", err)
	} else {
		fmt.Println("Database migration completed")
	}
}
