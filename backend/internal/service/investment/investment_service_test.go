package investment_test

import (
	"errors"
	"testing"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/google/uuid"
	"github.com/shopspring/decimal"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
	"github.com/vault-pro/backend/internal/model"
	"github.com/vault-pro/backend/internal/service/investment"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

// --- Mocks ---

type MockInvestmentRepository struct {
	mock.Mock
}

func (m *MockInvestmentRepository) FindBySymbol(userID uuid.UUID, symbol string) (*model.Investment, error) {
	args := m.Called(userID, symbol)
	if args.Get(0) != nil {
		return args.Get(0).(*model.Investment), args.Error(1)
	}
	return nil, args.Error(1)
}

func (m *MockInvestmentRepository) Update(inv *model.Investment) error {
	args := m.Called(inv)
	return args.Error(0)
}

func (m *MockInvestmentRepository) Create(inv *model.Investment) error {
	args := m.Called(inv)
	return args.Error(0)
}

func (m *MockInvestmentRepository) FindByUserID(userID uuid.UUID) ([]model.Investment, error) {
	args := m.Called(userID)
	if args.Get(0) != nil {
		return args.Get(0).([]model.Investment), args.Error(1)
	}
	return nil, args.Error(1)
}

func (m *MockInvestmentRepository) FindByID(id uuid.UUID) (*model.Investment, error) {
	args := m.Called(id)
	if args.Get(0) != nil {
		return args.Get(0).(*model.Investment), args.Error(1)
	}
	return nil, args.Error(1)
}

type MockAccountRepository struct {
	mock.Mock
}

func (m *MockAccountRepository) FindByID(id uuid.UUID) (*model.Account, error) {
	args := m.Called(id)
	if args.Get(0) != nil {
		return args.Get(0).(*model.Account), args.Error(1)
	}
	return nil, args.Error(1)
}

func (m *MockAccountRepository) Update(acc *model.Account) error {
	args := m.Called(acc)
	return args.Error(0)
}

func (m *MockAccountRepository) Create(account *model.Account) error {
	args := m.Called(account)
	return args.Error(0)
}

func (m *MockAccountRepository) FindByUserID(userID uuid.UUID) ([]model.Account, error) {
	args := m.Called(userID)
	if args.Get(0) != nil {
		return args.Get(0).([]model.Account), args.Error(1)
	}
	return nil, args.Error(1)
}

func (m *MockAccountRepository) FindByUserIDAndType(userID uuid.UUID, accType model.AccountType) (*model.Account, error) {
	args := m.Called(userID, accType)
	if args.Get(0) != nil {
		return args.Get(0).(*model.Account), args.Error(1)
	}
	return nil, args.Error(1)
}

type MockTransactionRepository struct {
	mock.Mock
}

func (m *MockTransactionRepository) Create(tx *model.Transaction) error {
	args := m.Called(tx)
	return args.Error(0)
}

func (m *MockTransactionRepository) FindByUserID(userID uuid.UUID, month, year int) ([]model.Transaction, error) {
	args := m.Called(userID, month, year)
	if args.Get(0) != nil {
		return args.Get(0).([]model.Transaction), args.Error(1)
	}
	return nil, args.Error(1)
}

func (m *MockTransactionRepository) FindByID(id uuid.UUID) (*model.Transaction, error) {
	args := m.Called(id)
	if args.Get(0) != nil {
		return args.Get(0).(*model.Transaction), args.Error(1)
	}
	return nil, args.Error(1)
}

func (m *MockTransactionRepository) Delete(id uuid.UUID) error {
	args := m.Called(id)
	return args.Error(0)
}

func (m *MockTransactionRepository) Update(tx *model.Transaction) error {
	args := m.Called(tx)
	return args.Error(0)
}

func (m *MockTransactionRepository) BulkCreate(txs []model.Transaction) error {
	args := m.Called(txs)
	return args.Error(0)
}

// --- Setup Helper ---

func setupTestDB(t *testing.T) (*gorm.DB, sqlmock.Sqlmock) {
	sqlDB, mock, err := sqlmock.New()
	assert.NoError(t, err)

	gormDB, err := gorm.Open(postgres.New(postgres.Config{
		Conn: sqlDB,
	}), &gorm.Config{
		SkipDefaultTransaction: true,
	})
	assert.NoError(t, err)

	return gormDB, mock
}

// --- Tests ---

func TestGetInvestments_Success(t *testing.T) {
	userID := uuid.New()
	mockRepo := new(MockInvestmentRepository)
	expectedInvestments := []model.Investment{
		{ID: uuid.New(), UserID: userID, Symbol: "AAPL", Units: decimal.NewFromFloat(10)},
	}

	mockRepo.On("FindByUserID", userID).Return(expectedInvestments, nil)

	service := investment.NewInvestmentService(mockRepo, nil, nil, nil)
	result, err := service.GetInvestments(userID)

	assert.NoError(t, err)
	assert.Equal(t, expectedInvestments, result)
	mockRepo.AssertExpectations(t)
}

func TestBuyInvestment_Success_NewInvestment(t *testing.T) {
	gormDB, mockDB := setupTestDB(t)
	mockInvRepo := new(MockInvestmentRepository)
	mockAccRepo := new(MockAccountRepository)
	mockTxRepo := new(MockTransactionRepository)

	userID := uuid.New()
	accountID := uuid.New()
	units := decimal.NewFromFloat(10)
	price := decimal.NewFromFloat(150)
	totalAmount := units.Mul(price)

	account := &model.Account{
		ID:      accountID,
		UserID:  userID,
		Balance: decimal.NewFromFloat(2000),
	}

	mockDB.ExpectBegin()

	mockAccRepo.On("FindByID", accountID).Return(account, nil)
	mockAccRepo.On("Update", mock.AnythingOfType("*model.Account")).Run(func(args mock.Arguments) {
		acc := args.Get(0).(*model.Account)
		assert.Equal(t, decimal.NewFromFloat(500).String(), acc.Balance.String())
	}).Return(nil)

	mockTxRepo.On("Create", mock.AnythingOfType("*model.Transaction")).Run(func(args mock.Arguments) {
		tx := args.Get(0).(*model.Transaction)
		assert.Equal(t, totalAmount.String(), tx.Amount.String())
		assert.Equal(t, "Bought AAPL", tx.Note)
	}).Return(nil)

	mockInvRepo.On("FindBySymbol", userID, "AAPL").Return(nil, gorm.ErrRecordNotFound)
	mockInvRepo.On("Create", mock.AnythingOfType("*model.Investment")).Run(func(args mock.Arguments) {
		inv := args.Get(0).(*model.Investment)
		assert.Equal(t, units.String(), inv.Units.String())
		assert.Equal(t, price.String(), inv.AvgCost.String())
	}).Return(nil)

	mockDB.ExpectCommit()

	service := investment.NewInvestmentService(mockInvRepo, mockAccRepo, mockTxRepo, gormDB)
	inv, err := service.BuyInvestment(userID, accountID, "Apple Inc.", "AAPL", "Stock", units, price)

	assert.NoError(t, err)
	assert.NotNil(t, inv)
	assert.Equal(t, "Apple Inc.", inv.Name)
	assert.Equal(t, "AAPL", inv.Symbol)

	mockAccRepo.AssertExpectations(t)
	mockTxRepo.AssertExpectations(t)
	mockInvRepo.AssertExpectations(t)
	assert.NoError(t, mockDB.ExpectationsWereMet())
}

func TestBuyInvestment_Success_ExistingInvestment(t *testing.T) {
	gormDB, mockDB := setupTestDB(t)
	mockInvRepo := new(MockInvestmentRepository)
	mockAccRepo := new(MockAccountRepository)
	mockTxRepo := new(MockTransactionRepository)

	userID := uuid.New()
	accountID := uuid.New()
	newUnits := decimal.NewFromFloat(5)
	newPrice := decimal.NewFromFloat(200)

	account := &model.Account{
		ID:      accountID,
		UserID:  userID,
		Balance: decimal.NewFromFloat(5000),
	}

	existingInv := &model.Investment{
		ID:      uuid.New(),
		UserID:  userID,
		Symbol:  "AAPL",
		Units:   decimal.NewFromFloat(10),
		AvgCost: decimal.NewFromFloat(150),
	}

	mockDB.ExpectBegin()

	mockAccRepo.On("FindByID", accountID).Return(account, nil)
	mockAccRepo.On("Update", mock.AnythingOfType("*model.Account")).Return(nil)
	mockTxRepo.On("Create", mock.AnythingOfType("*model.Transaction")).Return(nil)

	mockInvRepo.On("FindBySymbol", userID, "AAPL").Return(existingInv, nil)
	mockInvRepo.On("Update", mock.AnythingOfType("*model.Investment")).Run(func(args mock.Arguments) {
		inv := args.Get(0).(*model.Investment)
		// Total old cost = 10 * 150 = 1500
		// Total new cost = 5 * 200 = 1000
		// New total units = 15
		// New avg cost = 2500 / 15 = 166.6666...
		expectedUnits := decimal.NewFromFloat(15)
		assert.Equal(t, expectedUnits.String(), inv.Units.String())
	}).Return(nil)

	mockDB.ExpectCommit()

	service := investment.NewInvestmentService(mockInvRepo, mockAccRepo, mockTxRepo, gormDB)
	inv, err := service.BuyInvestment(userID, accountID, "Apple Inc.", "AAPL", "Stock", newUnits, newPrice)

	assert.NoError(t, err)
	assert.NotNil(t, inv)
	assert.Equal(t, decimal.NewFromFloat(15).String(), inv.Units.String())

	mockAccRepo.AssertExpectations(t)
	mockTxRepo.AssertExpectations(t)
	mockInvRepo.AssertExpectations(t)
	assert.NoError(t, mockDB.ExpectationsWereMet())
}

func TestBuyInvestment_Error_AccountNotFound(t *testing.T) {
	gormDB, mockDB := setupTestDB(t)
	mockAccRepo := new(MockAccountRepository)

	userID := uuid.New()
	accountID := uuid.New()
	units := decimal.NewFromFloat(10)
	price := decimal.NewFromFloat(150)

	mockDB.ExpectBegin()
	mockAccRepo.On("FindByID", accountID).Return(nil, errors.New("not found"))
	mockDB.ExpectRollback()

	service := investment.NewInvestmentService(nil, mockAccRepo, nil, gormDB)
	inv, err := service.BuyInvestment(userID, accountID, "Apple", "AAPL", "Stock", units, price)

	assert.Error(t, err)
	assert.Equal(t, "account not found", err.Error())
	assert.Nil(t, inv)

	mockAccRepo.AssertExpectations(t)
	assert.NoError(t, mockDB.ExpectationsWereMet())
}

func TestBuyInvestment_Error_Unauthorized(t *testing.T) {
	gormDB, mockDB := setupTestDB(t)
	mockAccRepo := new(MockAccountRepository)

	userID := uuid.New()
	otherUserID := uuid.New()
	accountID := uuid.New()
	units := decimal.NewFromFloat(10)
	price := decimal.NewFromFloat(150)

	account := &model.Account{
		ID:      accountID,
		UserID:  otherUserID, // Different user ID
		Balance: decimal.NewFromFloat(2000),
	}

	mockDB.ExpectBegin()
	mockAccRepo.On("FindByID", accountID).Return(account, nil)
	mockDB.ExpectRollback()

	service := investment.NewInvestmentService(nil, mockAccRepo, nil, gormDB)
	inv, err := service.BuyInvestment(userID, accountID, "Apple", "AAPL", "Stock", units, price)

	assert.Error(t, err)
	assert.Equal(t, "unauthorized", err.Error())
	assert.Nil(t, inv)

	mockAccRepo.AssertExpectations(t)
	assert.NoError(t, mockDB.ExpectationsWereMet())
}
