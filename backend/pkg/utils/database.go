package utils

import (
	"fmt"
	"log"
	"os"

	"github.com/vault-pro/backend/internal/model"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var DB *gorm.DB

func ConnectDatabase() {
	host := os.Getenv("DB_HOST")
	port := os.Getenv("DB_PORT")
	user := os.Getenv("DB_USER")
	password := os.Getenv("DB_PASSWORD")
	dbname := os.Getenv("DB_NAME")
	sslmode := os.Getenv("DB_SSLMODE")

	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=%s TimeZone=Asia/Bangkok",
		host, user, password, dbname, port, sslmode)

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
