package service

import (
	"testing"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/google/uuid"
	"github.com/shopspring/decimal"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
	"github.com/vault-pro/backend/internal/model"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

// MockAccountRepository is a mock of the AccountRepository interface
type MockAccountRepository struct {
	mock.Mock
}

func (m *MockAccountRepository) Create(account *model.Account) error {
	args := m.Called(account)
	return args.Error(0)
}

func (m *MockAccountRepository) FindByUserID(userID uuid.UUID) ([]model.Account, error) {
	args := m.Called(userID)
	return args.Get(0).([]model.Account), args.Error(1)
}

func (m *MockAccountRepository) FindByUserIDAndType(userID uuid.UUID, accType model.AccountType) (*model.Account, error) {
	args := m.Called(userID, accType)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*model.Account), args.Error(1)
}

func (m *MockAccountRepository) Update(account *model.Account) error {
	args := m.Called(account)
	return args.Error(0)
}

func (m *MockAccountRepository) FindByID(id uuid.UUID) (*model.Account, error) {
	args := m.Called(id)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*model.Account), args.Error(1)
}

// MockTransactionRepository is a mock of the TransactionRepository interface
type MockTransactionRepository struct {
	mock.Mock
}

func (m *MockTransactionRepository) Create(tx *model.Transaction) error {
	args := m.Called(tx)
	return args.Error(0)
}

func (m *MockTransactionRepository) FindByUserID(userID uuid.UUID, month, year int) ([]model.Transaction, error) {
	args := m.Called(userID, month, year)
	return args.Get(0).([]model.Transaction), args.Error(1)
}

func (m *MockTransactionRepository) FindByID(id uuid.UUID) (*model.Transaction, error) {
	args := m.Called(id)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*model.Transaction), args.Error(1)
}

func (m *MockTransactionRepository) Delete(id uuid.UUID) error {
	args := m.Called(id)
	return args.Error(0)
}

func TestAddIncome_6JarDistribution(t *testing.T) {
	// Setup sqlmock for GORM Transaction
	db, mockSql, err := sqlmock.New()
	assert.NoError(t, err)
	defer db.Close()

	gormDB, err := gorm.Open(postgres.New(postgres.Config{
		Conn: db,
	}), &gorm.Config{})
	assert.NoError(t, err)

	mockAccountRepo := new(MockAccountRepository)
	mockTxRepo := new(MockTransactionRepository)
	service := NewTransactionService(mockTxRepo, mockAccountRepo, gormDB)

	userID := uuid.New()
	incomeAmount := decimal.NewFromFloat(1000.00)
	category := "Salary"
	note := "Monthly Salary"

	// Mock SQL transaction expectations
	mockSql.ExpectBegin()
	
	// Expect calls for each jar
	jarTypes := []model.AccountType{model.NEC, model.FFA, model.LTS, model.EDU, model.PLY, model.GIV}
	percentages := map[model.AccountType]float64{
		model.NEC: 0.55, model.FFA: 0.10, model.LTS: 0.10, 
		model.EDU: 0.10, model.PLY: 0.10, model.GIV: 0.05,
	}

	for _, accType := range jarTypes {
		accID := uuid.New()
		existingAcc := &model.Account{
			ID:      accID,
			UserID:  userID,
			Type:    accType,
			Balance: decimal.Zero,
		}
		
		mockAccountRepo.On("FindByUserIDAndType", userID, accType).Return(existingAcc, nil).Once()
		mockAccountRepo.On("Update", mock.MatchedBy(func(a *model.Account) bool {
			expectedBalance := incomeAmount.Mul(decimal.NewFromFloat(percentages[accType]))
			return a.Type == accType && a.Balance.Equal(expectedBalance)
		})).Return(nil).Once()
		
		mockTxRepo.On("Create", mock.MatchedBy(func(tx *model.Transaction) bool {
			expectedAmount := incomeAmount.Mul(decimal.NewFromFloat(percentages[accType]))
			return tx.AccountID == accID && tx.Amount.Equal(expectedAmount) && tx.Type == model.Income
		})).Return(nil).Once()
	}

	mockSql.ExpectCommit()

	// Act
	err = service.AddIncome(userID, incomeAmount, category, note)

	// Assert
	assert.NoError(t, err)
	mockAccountRepo.AssertExpectations(t)
	mockTxRepo.AssertExpectations(t)
	assert.NoError(t, mockSql.ExpectationsWereMet())
}

func TestAddExpense_Success(t *testing.T) {
	db, mockSql, _ := sqlmock.New()
	defer db.Close()
	gormDB, _ := gorm.Open(postgres.New(postgres.Config{Conn: db}), &gorm.Config{})

	mockAccountRepo := new(MockAccountRepository)
	mockTxRepo := new(MockTransactionRepository)
	service := NewTransactionService(mockTxRepo, mockAccountRepo, gormDB)

	userID := uuid.New()
	accID := uuid.New()
	amount := decimal.NewFromFloat(50.00)
	
	existingAcc := &model.Account{
		ID:      accID,
		UserID:  userID,
		Balance: decimal.NewFromFloat(100.00),
	}

	mockSql.ExpectBegin()
	mockAccountRepo.On("FindByID", accID).Return(existingAcc, nil)
	mockAccountRepo.On("Update", mock.MatchedBy(func(a *model.Account) bool {
		return a.Balance.Equal(decimal.NewFromFloat(50.00))
	})).Return(nil)
	mockTxRepo.On("Create", mock.Anything).Return(nil)
	mockSql.ExpectCommit()

	err := service.AddExpense(userID, accID, amount, "Food", "Lunch")

	assert.NoError(t, err)
	mockAccountRepo.AssertExpectations(t)
	mockTxRepo.AssertExpectations(t)
}

func TestTransfer_Success(t *testing.T) {
	db, mockSql, _ := sqlmock.New()
	defer db.Close()
	gormDB, _ := gorm.Open(postgres.New(postgres.Config{Conn: db}), &gorm.Config{})

	mockAccountRepo := new(MockAccountRepository)
	mockTxRepo := new(MockTransactionRepository)
	service := NewTransactionService(mockTxRepo, mockAccountRepo, gormDB)

	userID := uuid.New()
	fromID := uuid.New()
	toID := uuid.New()
	amount := decimal.NewFromFloat(30.00)
	
	fromAcc := &model.Account{ID: fromID, UserID: userID, Balance: decimal.NewFromFloat(100.00)}
	toAcc := &model.Account{ID: toID, UserID: userID, Balance: decimal.NewFromFloat(10.00)}

	mockSql.ExpectBegin()
	mockAccountRepo.On("FindByID", fromID).Return(fromAcc, nil)
	mockAccountRepo.On("FindByID", toID).Return(toAcc, nil)
	mockAccountRepo.On("Update", mock.Anything).Return(nil).Twice()
	mockTxRepo.On("Create", mock.Anything).Return(nil)
	mockSql.ExpectCommit()

	err := service.Transfer(userID, fromID, toID, amount, "Test Transfer")

	assert.NoError(t, err)
	mockAccountRepo.AssertExpectations(t)
}
