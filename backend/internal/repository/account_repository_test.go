package repository

import (
	"regexp"
	"testing"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/google/uuid"
	"github.com/shopspring/decimal"
	"github.com/stretchr/testify/assert"
	"github.com/vault-pro/backend/internal/model"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func TestAccountRepository_FindByUserID(t *testing.T) {
	db, mock, err := sqlmock.New()
	assert.NoError(t, err)
	defer db.Close()

	gormDB, err := gorm.Open(postgres.New(postgres.Config{
		Conn: db,
	}), &gorm.Config{})
	assert.NoError(t, err)

	repo := NewAccountRepository(gormDB)
	userID := uuid.New()

	rows := sqlmock.NewRows([]string{"id", "user_id", "name", "type", "balance"}).
		AddRow(uuid.New(), userID, "Necessity", "NEC", decimal.NewFromFloat(500.00))

	mock.ExpectQuery(regexp.QuoteMeta(`SELECT * FROM "accounts" WHERE user_id = $1 AND "accounts"."deleted_at" IS NULL`)).
		WithArgs(userID).
		WillReturnRows(rows)

	accounts, err := repo.FindByUserID(userID)

	assert.NoError(t, err)
	assert.Len(t, accounts, 1)
	assert.Equal(t, "Necessity", accounts[0].Name)
	assert.NoError(t, mock.ExpectationsWereMet())
}

func TestAccountRepository_Update(t *testing.T) {
	db, mock, err := sqlmock.New()
	assert.NoError(t, err)
	defer db.Close()

	gormDB, err := gorm.Open(postgres.New(postgres.Config{
		Conn: db,
	}), &gorm.Config{})
	assert.NoError(t, err)

	repo := NewAccountRepository(gormDB)
	accID := uuid.New()
	acc := &model.Account{
		ID:      accID,
		Name:    "Necessity",
		Balance: decimal.NewFromFloat(600.00),
	}

	mock.ExpectBegin()
	mock.ExpectExec(regexp.QuoteMeta(`UPDATE "accounts" SET`)).
		WillReturnResult(sqlmock.NewResult(1, 1))
	mock.ExpectCommit()

	err = repo.Update(acc)

	assert.NoError(t, err)
	assert.NoError(t, mock.ExpectationsWereMet())
}
