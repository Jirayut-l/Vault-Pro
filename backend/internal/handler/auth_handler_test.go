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
	"github.com/stretchr/testify/mock"
	"github.com/vault-pro/backend/internal/model"
)

// MockUserService is a mock of the UserService interface
type MockUserService struct {
	mock.Mock
}

func (m *MockUserService) Register(username, email, password string) (*model.User, error) {
	args := m.Called(username, email, password)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*model.User), args.Error(1)
}

func (m *MockUserService) Login(email, password string) (string, string, error) {
	args := m.Called(email, password)
	return args.String(0), args.String(1), args.Error(2)
}

func (m *MockUserService) RefreshToken(tokenString string) (string, string, error) {
	args := m.Called(tokenString)
	return args.String(0), args.String(1), args.Error(2)
}

func (m *MockUserService) GetUserByID(id uuid.UUID) (*model.User, error) {
	args := m.Called(id)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*model.User), args.Error(1)
}

func TestAuthHandler_Register_Success(t *testing.T) {
	gin.SetMode(gin.TestMode)
	mockService := new(MockUserService)
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
	mockService := new(MockUserService)
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
