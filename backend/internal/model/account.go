package model

import (
	"time"

	"github.com/google/uuid"
	"github.com/shopspring/decimal"
	"gorm.io/gorm"
)

type AccountType string

const (
	NEC AccountType = "NEC" // Necessity
	FFA AccountType = "FFA" // Financial Freedom
	LTS AccountType = "LTS" // Long-term Savings
	EDU AccountType = "EDU" // Education
	PLY AccountType = "PLY" // Play
	GIV AccountType = "GIV" // Give
)

type Account struct {
	ID        uuid.UUID       `gorm:"type:uuid;primary_key;" json:"id"`
	UserID    uuid.UUID       `gorm:"type:uuid;not null;index" json:"user_id"`
	Name      string          `gorm:"type:varchar(100);not null" json:"name"`
	Type      AccountType     `gorm:"type:varchar(20);not null" json:"type"`
	Balance   decimal.Decimal `gorm:"type:decimal(15,2);not null;default:0" json:"balance"`
	CreatedAt time.Time       `json:"created_at"`
	UpdatedAt time.Time       `json:"updated_at"`
	DeletedAt gorm.DeletedAt  `gorm:"index" json:"-"`
}

func (a *Account) BeforeCreate(tx *gorm.DB) (err error) {
	if a.ID == uuid.Nil {
		a.ID = uuid.New()
	}
	return
}
