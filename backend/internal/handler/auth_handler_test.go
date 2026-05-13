package handler

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
	"github.com/vault-pro/backend/internal/mocks"
	"github.com/vault-pro/backend/internal/model"
)

func TestAuthHandler_Register_Success(t *testing.T) {
	gin.SetMode(gin.TestMode)
	mockService := new(mocks.MockUserService)
	handler := NewAuthHandler(mockService)
	
	r := gin.Default()
	r.POST("/register", handler.Register)

	mockUser := &model.User{ID: uuid.New(), Username: "testuser", Email: "test@example.com"}
	mockService.On("Register", "testuser", "test@example.com", "password123").Return(mockUser, nil)

	body := RegisterRequest{
		Username: "testuser",
		Email:    "test@example.com",
		Password: "password123",
	}
	jsonBody, _ := json.Marshal(body)

	req, _ := http.NewRequest("POST", "/register", bytes.NewBuffer(jsonBody))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusCreated, w.Code)
	var response map[string]interface{}
	json.Unmarshal(w.Body.Bytes(), &response)
	assert.True(t, response["success"].(bool))
	mockService.AssertExpectations(t)
}

func TestAuthHandler_Login_Success(t *testing.T) {
	gin.SetMode(gin.TestMode)
	mockService := new(mocks.MockUserService)
	handler := NewAuthHandler(mockService)
	
	r := gin.Default()
	r.POST("/login", handler.Login)

	mockService.On("Login", "test@example.com", "password123").Return("access_token", "refresh_token", nil)

	body := LoginRequest{
		Email:    "test@example.com",
		Password: "password123",
	}
	jsonBody, _ := json.Marshal(body)

	req, _ := http.NewRequest("POST", "/login", bytes.NewBuffer(jsonBody))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	// Check cookie
	cookies := w.Result().Cookies()
	var found bool
	for _, c := range cookies {
		if c.Name == "refresh_token" && c.Value == "refresh_token" {
			found = true
		}
	}
	assert.True(t, found, "Refresh token cookie should be set")
	mockService.AssertExpectations(t)
}
