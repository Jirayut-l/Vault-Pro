package service

import (
	"testing"

	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
	"github.com/vault-pro/backend/internal/model"
	"github.com/vault-pro/backend/pkg/utils"
)

// MockUserRepository is a mock of the UserRepository interface
type MockUserRepository struct {
	mock.Mock
}

func (m *MockUserRepository) Create(user *model.User) error {
	args := m.Called(user)
	return args.Error(0)
}

func (m *MockUserRepository) FindByEmail(email string) (*model.User, error) {
	args := m.Called(email)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*model.User), args.Error(1)
}

func (m *MockUserRepository) FindByID(id uuid.UUID) (*model.User, error) {
	args := m.Called(id)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*model.User), args.Error(1)
}

func TestRegister_Success(t *testing.T) {
	mockRepo := new(MockUserRepository)
	userService := NewUserService(mockRepo)

	username := "testuser"
	email := "test@example.com"
	password := "password123"

	mockRepo.On("Create", mock.MatchedBy(func(u *model.User) bool {
		return u.Username == username && u.Email == email && u.Password != password
	})).Return(nil)

	user, err := userService.Register(username, email, password)

	assert.NoError(t, err)
	assert.NotNil(t, user)
	assert.Equal(t, username, user.Username)
	assert.Equal(t, email, user.Email)
	mockRepo.AssertExpectations(t)
}

func TestLogin_Success(t *testing.T) {
	mockRepo := new(MockUserRepository)
	userService := NewUserService(mockRepo)

	email := "test@example.com"
	password := "password123"
	
	// Create a user with a hashed password
	hashedPassword, _ := utils.HashPassword(password)
	
	mockUser := &model.User{
		ID:       uuid.New(),
		Email:    email,
		Password: hashedPassword, 
	}

	mockRepo.On("FindByEmail", email).Return(mockUser, nil)

	accessToken, refreshToken, err := userService.Login(email, password)

	assert.NoError(t, err)
	assert.NotEmpty(t, accessToken)
	assert.NotEmpty(t, refreshToken)
	mockRepo.AssertExpectations(t)
}

func TestLogin_Failure_WrongPassword(t *testing.T) {
	mockRepo := new(MockUserRepository)
	userService := NewUserService(mockRepo)

	email := "test@example.com"
	password := "correct_password"
	wrongPassword := "wrong_password"
	
	hashedPassword, _ := utils.HashPassword(password)

	mockUser := &model.User{
		Email:    email,
		Password: hashedPassword,
	}

	mockRepo.On("FindByEmail", email).Return(mockUser, nil)

	accessToken, refreshToken, err := userService.Login(email, wrongPassword)

	assert.Error(t, err)
	assert.Empty(t, accessToken)
	assert.Empty(t, refreshToken)
	assert.Equal(t, "invalid email or password", err.Error())
}
