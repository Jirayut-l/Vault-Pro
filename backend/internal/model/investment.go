package model

import (
	"time"

	"github.com/google/uuid"
	"github.com/shopspring/decimal"
	"gorm.io/gorm"
)

type Investment struct {
	ID        uuid.UUID       `gorm:"type:uuid;primary_key;" json:"id"`
	UserID    uuid.UUID       `gorm:"type:uuid;not null;index" json:"user_id"`
	AccountID uuid.UUID       `gorm:"type:uuid;not null;index" json:"account_id"`
	Name      string          `gorm:"type:varchar(100);not null" json:"name"`
	Symbol    string          `gorm:"type:varchar(20);not null" json:"symbol"`
	Type      string          `gorm:"type:varchar(50)" json:"type"` // RMF, Thai ESG, ETF, etc.
	Units     decimal.Decimal `gorm:"type:decimal(20,8);not null;default:0" json:"units"`
	AvgCost   decimal.Decimal `gorm:"type:decimal(20,8);not null;default:0" json:"avg_cost"`
	CreatedAt time.Time       `json:"created_at"`
	UpdatedAt time.Time       `json:"updated_at"`
	DeletedAt gorm.DeletedAt  `gorm:"index" json:"-"`
}

func (i *Investment) BeforeCreate(tx *gorm.DB) (err error) {
	if i.ID == uuid.Nil {
		i.ID = uuid.New()
	}
	return
}
