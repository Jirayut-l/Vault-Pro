package service

import (
	"github.com/google/uuid"
	"github.com/shopspring/decimal"
	"github.com/vault-pro/backend/internal/model"
	"github.com/vault-pro/backend/internal/repository"
)

type SubscriptionService interface {
	CreateSubscription(userID uuid.UUID, accountID uuid.UUID, name string, amount decimal.Decimal, billingCycleDay int) (*model.Subscription, error)
	GetSubscriptions(userID uuid.UUID) ([]model.Subscription, error)
}

type subscriptionService struct {
	subRepo repository.SubscriptionRepository
}

func NewSubscriptionService(subRepo repository.SubscriptionRepository) SubscriptionService {
	return &subscriptionService{subRepo: subRepo}
}

func (s *subscriptionService) CreateSubscription(userID uuid.UUID, accountID uuid.UUID, name string, amount decimal.Decimal, billingCycleDay int) (*model.Subscription, error) {
	sub := &model.Subscription{
		UserID:          userID,
		AccountID:       accountID,
		Name:            name,
		Amount:          amount,
		BillingCycleDay: billingCycleDay,
		IsActive:        true,
	}
	err := s.subRepo.Create(sub)
	return sub, err
}

func (s *subscriptionService) GetSubscriptions(userID uuid.UUID) ([]model.Subscription, error) {
	return s.subRepo.FindByUserID(userID)
}
