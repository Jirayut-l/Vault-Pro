package repository

import (
	"github.com/google/uuid"
	"github.com/vault-pro/backend/internal/model"
	"gorm.io/gorm"
)

type AccountRepository interface {
	Create(account *model.Account) error
	FindByUserID(userID uuid.UUID) ([]model.Account, error)
	FindByUserIDAndType(userID uuid.UUID, accType model.AccountType) (*model.Account, error)
	Update(account *model.Account) error
	FindByID(id uuid.UUID) (*model.Account, error)
}

type accountRepository struct {
	db *gorm.DB
}

func NewAccountRepository(db *gorm.DB) AccountRepository {
	return &accountRepository{db: db}
}

func (r *accountRepository) Create(account *model.Account) error {
	return r.db.Create(account).Error
}

func (r *accountRepository) FindByUserID(userID uuid.UUID) ([]model.Account, error) {
	var accounts []model.Account
	err := r.db.Where("user_id = ?", userID).Find(&accounts).Error
	return accounts, err
}

func (r *accountRepository) FindByUserIDAndType(userID uuid.UUID, accType model.AccountType) (*model.Account, error) {
	var account model.Account
	err := r.db.Where("user_id = ? AND type = ?", userID, accType).First(&account).Error
	return &account, err
}

func (r *accountRepository) Update(account *model.Account) error {
	return r.db.Save(account).Error
}

func (r *accountRepository) FindByID(id uuid.UUID) (*model.Account, error) {
	var account model.Account
	err := r.db.First(&account, id).Error
	return &account, err
}
