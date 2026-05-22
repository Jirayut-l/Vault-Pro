package repository

import (
	"github.com/google/uuid"
	"github.com/vault-pro/backend/internal/model"
	"gorm.io/gorm"
)

type TransactionRepository interface {
	Create(tx *model.Transaction) error
	FindByUserID(userID uuid.UUID, month, year int) ([]model.Transaction, error)
	FindByID(id uuid.UUID) (*model.Transaction, error)
	Delete(id uuid.UUID) error
	Update(tx *model.Transaction) error
	BulkCreate(txs []model.Transaction) error
}

	type transactionRepository struct {
	db *gorm.DB
	}

	func NewTransactionRepository(db *gorm.DB) TransactionRepository {
	return &transactionRepository{db: db}
	}

	func (r *transactionRepository) Create(tx *model.Transaction) error {
	return r.db.Create(tx).Error
	}

	func (r *transactionRepository) BulkCreate(txs []model.Transaction) error {
	return r.db.CreateInBatches(txs, 100).Error
	}

	func (r *transactionRepository) Update(tx *model.Transaction) error {
	return r.db.Save(tx).Error
	}


func (r *transactionRepository) FindByUserID(userID uuid.UUID, month, year int) ([]model.Transaction, error) {
	var transactions []model.Transaction
	query := r.db.Where("user_id = ?", userID)
	
	if month > 0 {
		query = query.Where("EXTRACT(MONTH FROM transaction_date) = ?", month)
	}
	if year > 0 {
		query = query.Where("EXTRACT(YEAR FROM transaction_date) = ?", year)
	}
	
	err := query.Order("transaction_date DESC").Find(&transactions).Error
	return transactions, err
}

func (r *transactionRepository) FindByID(id uuid.UUID) (*model.Transaction, error) {
	var tx model.Transaction
	err := r.db.First(&tx, id).Error
	return &tx, err
}

func (r *transactionRepository) Delete(id uuid.UUID) error {
	return r.db.Delete(&model.Transaction{}, id).Error
}
