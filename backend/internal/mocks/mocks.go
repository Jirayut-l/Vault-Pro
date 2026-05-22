package mocks

import (
	"github.com/google/uuid"
	"github.com/shopspring/decimal"
	"github.com/stretchr/testify/mock"
	"github.com/vault-pro/backend/internal/model"
)

// MockUserRepository
type MockUserRepository struct {
	mock.Mock
}

func (m *MockUserRepository) Create(user *model.User) error {
	args := m.Called(user)
	return args.Error(0)
}

func (m *MockUserRepository) FindByEmail(email string) (*model.User, error) {
	args := m.Called(email)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*model.User), args.Error(1)
}

func (m *MockUserRepository) FindByID(id uuid.UUID) (*model.User, error) {
	args := m.Called(id)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*model.User), args.Error(1)
}

// MockAccountRepository
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

// MockTransactionRepository
type MockTransactionRepository struct {
	mock.Mock
}

func (m *MockTransactionRepository) Create(tx *model.Transaction) error {
	args := m.Called(tx)
	return args.Error(0)
}

func (m *MockTransactionRepository) BulkCreate(txs []model.Transaction) error {
	args := m.Called(txs)
	return args.Error(0)
}

func (m *MockTransactionRepository) Update(tx *model.Transaction) error {
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

// MockTransactionService
type MockTransactionService struct {
	mock.Mock
}

func (m *MockTransactionService) AddIncome(userID uuid.UUID, amount decimal.Decimal, category, note string) error {
	args := m.Called(userID, amount, category, note)
	return args.Error(0)
}

func (m *MockTransactionService) AddExpense(userID uuid.UUID, accountID uuid.UUID, amount decimal.Decimal, category, note string) error {
	args := m.Called(userID, accountID, amount, category, note)
	return args.Error(0)
}

func (m *MockTransactionService) Transfer(userID uuid.UUID, fromAccountID, toAccountID uuid.UUID, amount decimal.Decimal, note string) error {
	args := m.Called(userID, fromAccountID, toAccountID, amount, note)
	return args.Error(0)
}

func (m *MockTransactionService) GetTransactions(userID uuid.UUID, month, year int) ([]model.Transaction, error) {
	args := m.Called(userID, month, year)
	return args.Get(0).([]model.Transaction), args.Error(1)
}

func (m *MockTransactionService) UpdateTransaction(userID uuid.UUID, txID uuid.UUID, amount decimal.Decimal, category, note string) error {
	args := m.Called(userID, txID, amount, category, note)
	return args.Error(0)
}

func (m *MockTransactionService) DeleteTransaction(userID uuid.UUID, txID uuid.UUID) error {
	args := m.Called(userID, txID)
	return args.Error(0)
}

func (m *MockTransactionService) BulkAddTransactions(userID uuid.UUID, transactions []model.Transaction) error {
	args := m.Called(userID, transactions)
	return args.Error(0)
}

// MockUserService
type MockUserService struct {
	mock.Mock
}

func (m *MockUserService) Register(username, email, password string) (*model.User, error) {
	args := m.Called(username, email, password)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*model.User), args.Error(1)
}

func (m *MockUserService) Login(email, password string) (string, string, error) {
	args := m.Called(email, password)
	return args.String(0), args.String(1), args.Error(2)
}

func (m *MockUserService) RefreshToken(tokenString string) (string, string, error) {
	args := m.Called(tokenString)
	return args.String(0), args.String(1), args.Error(2)
}

func (m *MockUserService) GetUserByID(id uuid.UUID) (*model.User, error) {
	args := m.Called(id)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*model.User), args.Error(1)
}
