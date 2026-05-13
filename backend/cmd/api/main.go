package main

import (
	"log"

	"github.com/vault-pro/backend/internal/config"
	"github.com/vault-pro/backend/internal/server"
	"github.com/vault-pro/backend/pkg/utils"
)

func main() {
	// Load Configuration
	cfg := config.LoadConfig()

	// Connect to Database
	utils.ConnectDatabase(cfg)

	// Initialize and Run Server
	srv := server.NewServer(cfg, utils.DB)
	if err := srv.Run(); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
