package model

import (
	"time"

	"github.com/google/uuid"
	"github.com/shopspring/decimal"
	"gorm.io/gorm"
)

type Subscription struct {
	ID              uuid.UUID       `gorm:"type:uuid;primary_key;" json:"id"`
	UserID          uuid.UUID       `gorm:"type:uuid;not null;index" json:"user_id"`
	AccountID       uuid.UUID       `gorm:"type:uuid;not null;index" json:"account_id"`
	Name            string          `gorm:"type:varchar(100);not null" json:"name"`
	Amount          decimal.Decimal `gorm:"type:decimal(15,2);not null" json:"amount"`
	BillingCycleDay int             `gorm:"not null" json:"billing_cycle_day"`
	IsActive        bool            `gorm:"default:true" json:"is_active"`
	CreatedAt       time.Time       `json:"created_at"`
	UpdatedAt       time.Time       `json:"updated_at"`
	DeletedAt       gorm.DeletedAt  `gorm:"index" json:"-"`
}

func (s *Subscription) BeforeCreate(tx *gorm.DB) (err error) {
	if s.ID == uuid.Nil {
		s.ID = uuid.New()
	}
	return
}
