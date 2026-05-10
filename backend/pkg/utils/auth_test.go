package utils

import (
	"os"
	"testing"
	"time"

	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
)

func TestPasswordHashing(t *testing.T) {
	password := "my_secret_password"

	// Test hashing
	hash, err := HashPassword(password)
	assert.NoError(t, err)
	assert.NotEmpty(t, hash)
	assert.NotEqual(t, password, hash)

	// Test comparison - Success
	isValid := CheckPasswordHash(password, hash)
	assert.True(t, isValid)

	// Test comparison - Failure
	isValid = CheckPasswordHash("wrong_password", hash)
	assert.False(t, isValid)
}

func TestJWTTokenManagement(t *testing.T) {
	// Set dummy secret and expirations for test
	os.Setenv("JWT_SECRET", "test_secret_key_123")
	os.Setenv("JWT_ACCESS_EXPIRATION", "1m")
	os.Setenv("JWT_REFRESH_EXPIRATION", "10m")
	
	// Update local jwtSecret variable from env
	jwtSecret = []byte(os.Getenv("JWT_SECRET"))

	userID := uuid.New()

	// Test Access Token Generation & Validation
	accessToken, err := GenerateAccessToken(userID)
	assert.NoError(t, err)
	assert.NotEmpty(t, accessToken)

	claims, err := ValidateToken(accessToken)
	assert.NoError(t, err)
	assert.Equal(t, userID, claims.UserID)

	// Test Refresh Token Generation & Validation
	refreshToken, err := GenerateRefreshToken(userID)
	assert.NoError(t, err)
	assert.NotEmpty(t, refreshToken)

	claims, err = ValidateToken(refreshToken)
	assert.NoError(t, err)
	assert.Equal(t, userID, claims.UserID)

	// Test Invalid Token
	_, err = ValidateToken("invalid.token.string")
	assert.Error(t, err)
}

func TestTokenExpiration(t *testing.T) {
	os.Setenv("JWT_SECRET", "test_secret_key_123")
	os.Setenv("JWT_ACCESS_EXPIRATION", "1ms") // Very short expiration
	jwtSecret = []byte(os.Getenv("JWT_SECRET"))

	userID := uuid.New()
	token, err := GenerateAccessToken(userID)
	assert.NoError(t, err)

	// Wait for expiration
	time.Sleep(10 * time.Millisecond)

	_, err = ValidateToken(token)
	assert.Error(t, err, "Token should be expired")
}
