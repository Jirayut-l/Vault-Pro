package model

import (
	"time"

	"github.com/google/uuid"
	"github.com/shopspring/decimal"
	"gorm.io/gorm"
)

type TransactionType string

const (
	Income   TransactionType = "INCOME"
	Expense  TransactionType = "EXPENSE"
	Transfer TransactionType = "TRANSFER"
)

type Transaction struct {
	ID              uuid.UUID       `gorm:"type:uuid;primary_key;" json:"id"`
	UserID          uuid.UUID       `gorm:"type:uuid;not null;index" json:"user_id"`
	AccountID       uuid.UUID       `gorm:"type:uuid;not null;index" json:"account_id"`
	TargetAccountID *uuid.UUID      `gorm:"type:uuid;index" json:"target_account_id,omitempty"` // For transfers
	Amount          decimal.Decimal `gorm:"type:decimal(15,2);not null" json:"amount"`
	Type            TransactionType `gorm:"type:varchar(20);not null" json:"type"`
	Category        string          `gorm:"type:varchar(100)" json:"category"`
	Note            string          `gorm:"type:text" json:"note"`
	TransactionDate time.Time       `gorm:"not null" json:"transaction_date"`
	CreatedAt       time.Time       `json:"created_at"`
	UpdatedAt       time.Time       `json:"updated_at"`
	DeletedAt       gorm.DeletedAt  `gorm:"index" json:"-"`
}

func (t *Transaction) BeforeCreate(tx *gorm.DB) (err error) {
	if t.ID == uuid.Nil {
		t.ID = uuid.New()
	}
	if t.TransactionDate.IsZero() {
		t.TransactionDate = time.Now()
	}
	return
}
