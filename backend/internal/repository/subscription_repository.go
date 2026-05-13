package repository

import (
	"github.com/google/uuid"
	"github.com/vault-pro/backend/internal/model"
	"gorm.io/gorm"
)

type SubscriptionRepository interface {
	Create(sub *model.Subscription) error
	FindByUserID(userID uuid.UUID) ([]model.Subscription, error)
	FindByID(id uuid.UUID) (*model.Subscription, error)
	Update(sub *model.Subscription) error
	Delete(id uuid.UUID) error
}

type subscriptionRepository struct {
	db *gorm.DB
}

func NewSubscriptionRepository(db *gorm.DB) SubscriptionRepository {
	return &subscriptionRepository{db: db}
}

func (r *subscriptionRepository) Create(sub *model.Subscription) error {
	return r.db.Create(sub).Error
}

func (r *subscriptionRepository) FindByUserID(userID uuid.UUID) ([]model.Subscription, error) {
	var subs []model.Subscription
	err := r.db.Where("user_id = ?", userID).Find(&subs).Error
	return subs, err
}

func (r *subscriptionRepository) FindByID(id uuid.UUID) (*model.Subscription, error) {
	var sub model.Subscription
	err := r.db.First(&sub, id).Error
	return &sub, err
}

func (r *subscriptionRepository) Update(sub *model.Subscription) error {
	return r.db.Save(sub).Error
}

func (r *subscriptionRepository) Delete(id uuid.UUID) error {
	return r.db.Delete(&model.Subscription{}, id).Error
}
