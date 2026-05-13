package utils

import (
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
	tm, err := NewTokenManager("test_secret_key_123", "1m", "10m")
	assert.NoError(t, err)

	userID := uuid.New()

	// Test Access Token Generation & Validation
	accessToken, err := tm.GenerateAccessToken(userID)
	assert.NoError(t, err)
	assert.NotEmpty(t, accessToken)

	claims, err := tm.ValidateToken(accessToken)
	assert.NoError(t, err)
	assert.Equal(t, userID, claims.UserID)

	// Test Refresh Token Generation & Validation
	refreshToken, err := tm.GenerateRefreshToken(userID)
	assert.NoError(t, err)
	assert.NotEmpty(t, refreshToken)

	claims, err = tm.ValidateToken(refreshToken)
	assert.NoError(t, err)
	assert.Equal(t, userID, claims.UserID)

	// Test Invalid Token
	_, err = tm.ValidateToken("invalid.token.string")
	assert.Error(t, err)
}

func TestTokenExpiration(t *testing.T) {
	tm, err := NewTokenManager("test_secret_key_123", "1ms", "10m")
	assert.NoError(t, err)

	userID := uuid.New()
	token, err := tm.GenerateAccessToken(userID)
	assert.NoError(t, err)

	// Wait for expiration
	time.Sleep(10 * time.Millisecond)

	_, err = tm.ValidateToken(token)
	assert.Error(t, err, "Token should be expired")
}
