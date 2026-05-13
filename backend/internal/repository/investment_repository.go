package repository

import (
	"github.com/google/uuid"
	"github.com/vault-pro/backend/internal/model"
	"gorm.io/gorm"
)

type InvestmentRepository interface {
	Create(inv *model.Investment) error
	FindByUserID(userID uuid.UUID) ([]model.Investment, error)
	FindByID(id uuid.UUID) (*model.Investment, error)
	FindBySymbol(userID uuid.UUID, symbol string) (*model.Investment, error)
	Update(inv *model.Investment) error
}

type investmentRepository struct {
	db *gorm.DB
}

func NewInvestmentRepository(db *gorm.DB) InvestmentRepository {
	return &investmentRepository{db: db}
}

func (r *investmentRepository) Create(inv *model.Investment) error {
	return r.db.Create(inv).Error
}

func (r *investmentRepository) FindByUserID(userID uuid.UUID) ([]model.Investment, error) {
	var invs []model.Investment
	err := r.db.Where("user_id = ?", userID).Find(&invs).Error
	return invs, err
}

func (r *investmentRepository) FindByID(id uuid.UUID) (*model.Investment, error) {
	var inv model.Investment
	err := r.db.First(&inv, id).Error
	return &inv, err
}

func (r *investmentRepository) FindBySymbol(userID uuid.UUID, symbol string) (*model.Investment, error) {
	var inv model.Investment
	err := r.db.Where("user_id = ? AND symbol = ?", userID, symbol).First(&inv).Error
	return &inv, err
}

func (r *investmentRepository) Update(inv *model.Investment) error {
	return r.db.Save(inv).Error
}
