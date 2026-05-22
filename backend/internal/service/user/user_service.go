package user

import (
	"errors"

	"github.com/google/uuid"
	"github.com/vault-pro/backend/internal/model"
	"github.com/vault-pro/backend/internal/repository"
	"github.com/vault-pro/backend/pkg/utils"
)

type UserService interface {
	Register(username, email, password string) (*model.User, error)
	Login(email, password string) (string, string, error) // AccessToken, RefreshToken, Error
	RefreshToken(tokenString string) (string, string, error)
	GetUserByID(id uuid.UUID) (*model.User, error)
}

type userService struct {
	userRepo     repository.UserRepository
	tokenManager *utils.TokenManager
}

func NewUserService(userRepo repository.UserRepository, tokenManager *utils.TokenManager) UserService {
	return &userService{userRepo: userRepo, tokenManager: tokenManager}
}

func (s *userService) RefreshToken(tokenString string) (string, string, error) {
	claims, err := s.tokenManager.ValidateToken(tokenString)
	if err != nil {
		return "", "", err
	}

	accessToken, err := s.tokenManager.GenerateAccessToken(claims.UserID)
	if err != nil {
		return "", "", err
	}

	refreshToken, err := s.tokenManager.GenerateRefreshToken(claims.UserID)
	if err != nil {
		return "", "", err
	}

	return accessToken, refreshToken, nil
}

func (s *userService) Register(username, email, password string) (*model.User, error) {
	hashedPassword, err := utils.HashPassword(password)
	if err != nil {
		return nil, err
	}

	user := &model.User{
		Username: username,
		Email:    email,
		Password: hashedPassword,
	}

	if err := s.userRepo.Create(user); err != nil {
		return nil, err
	}

	return user, nil
}

func (s *userService) Login(email, password string) (string, string, error) {
	user, err := s.userRepo.FindByEmail(email)
	if err != nil {
		return "", "", errors.New("invalid email or password")
	}

	if !utils.CheckPasswordHash(password, user.Password) {
		return "", "", errors.New("invalid email or password")
	}

	accessToken, err := s.tokenManager.GenerateAccessToken(user.ID)
	if err != nil {
		return "", "", err
	}

	refreshToken, err := s.tokenManager.GenerateRefreshToken(user.ID)
	if err != nil {
		return "", "", err
	}

	return accessToken, refreshToken, nil
}

func (s *userService) GetUserByID(id uuid.UUID) (*model.User, error) {
	return s.userRepo.FindByID(id)
}
