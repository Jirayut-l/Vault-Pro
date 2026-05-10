package service

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

func (s *userService) RefreshToken(tokenString string) (string, string, error) {
	claims, err := utils.ValidateToken(tokenString)
	if err != nil {
		return "", "", err
	}

	accessToken, err := utils.GenerateAccessToken(claims.UserID)
	if err != nil {
		return "", "", err
	}

	refreshToken, err := utils.GenerateRefreshToken(claims.UserID)
	if err != nil {
		return "", "", err
	}

	return accessToken, refreshToken, nil
}

type userService struct {
	userRepo repository.UserRepository
}

func NewUserService(userRepo repository.UserRepository) UserService {
	return &userService{userRepo: userRepo}
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

	accessToken, err := utils.GenerateAccessToken(user.ID)
	if err != nil {
		return "", "", err
	}

	refreshToken, err := utils.GenerateRefreshToken(user.ID)
	if err != nil {
		return "", "", err
	}

	return accessToken, refreshToken, nil
}

func (s *userService) GetUserByID(id uuid.UUID) (*model.User, error) {
	return s.userRepo.FindByID(id)
}
