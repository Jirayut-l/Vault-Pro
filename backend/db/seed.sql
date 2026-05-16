-- Vault Pro - Database Seed Script
-- Purpose: Populate the database with initial mock data for local development and testing.
-- Password for the test user is "password123"

-- Clear existing data (optional, use with caution)
-- TRUNCATE users, accounts, transactions RESTART IDENTITY CASCADE;

-- 1. Insert Test User
-- UUID: 550e8400-e29b-41d4-a716-446655440000
-- Password Hash: bcrypt for "password123"
INSERT INTO users (id, username, email, password, created_at, updated_at)
VALUES (
    '550e8400-e29b-41d4-a716-446655440000',
    'tester',
    'test@example.com',
    '$2a$10$8K1p/a06v.f.q.l.k.l.k.u.v.v.v.v.v.v.v.v.v.v.v.v.v.v.',
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- 2. Insert 6-Jar Accounts for the Test User
-- Necessity (NEC) - 55%
INSERT INTO accounts (id, user_id, name, type, balance, created_at, updated_at)
VALUES (
    '550e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440000',
    'Necessities',
    'NEC',
    27500.00,
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- Financial Freedom (FFA) - 10%
INSERT INTO accounts (id, user_id, name, type, balance, created_at, updated_at)
VALUES (
    '550e8400-e29b-41d4-a716-446655440002',
    '550e8400-e29b-41d4-a716-446655440000',
    'Financial Freedom',
    'FFA',
    5000.00,
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- Long-term Savings (LTS) - 10%
INSERT INTO accounts (id, user_id, name, type, balance, created_at, updated_at)
VALUES (
    '550e8400-e29b-41d4-a716-446655440003',
    '550e8400-e29b-41d4-a716-446655440000',
    'Long-term Savings',
    'LTS',
    5000.00,
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- Education (EDU) - 10%
INSERT INTO accounts (id, user_id, name, type, balance, created_at, updated_at)
VALUES (
    '550e8400-e29b-41d4-a716-446655440004',
    '550e8400-e29b-41d4-a716-446655440000',
    'Education',
    'EDU',
    5000.00,
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- Play (PLY) - 10%
INSERT INTO accounts (id, user_id, name, type, balance, created_at, updated_at)
VALUES (
    '550e8400-e29b-41d4-a716-446655440005',
    '550e8400-e29b-41d4-a716-446655440000',
    'Play',
    'PLY',
    5000.00,
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- Give (GIV) - 5%
INSERT INTO accounts (id, user_id, name, type, balance, created_at, updated_at)
VALUES (
    '550e8400-e29b-41d4-a716-446655440006',
    '550e8400-e29b-41d4-a716-446655440000',
    'Give',
    'GIV',
    2500.00,
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- 3. Insert Mock Transactions
-- Income: Monthly Salary
INSERT INTO transactions (id, user_id, account_id, amount, type, category, note, transaction_date, created_at, updated_at)
VALUES (
    gen_random_uuid(),
    '550e8400-e29b-41d4-a716-446655440000',
    '550e8400-e29b-41d4-a716-446655440001',
    50000.00,
    'INCOME',
    'Salary',
    'May 2026 Salary',
    NOW() - INTERVAL '5 days',
    NOW(),
    NOW()
);

-- Expense: Rent
INSERT INTO transactions (id, user_id, account_id, amount, type, category, note, transaction_date, created_at, updated_at)
VALUES (
    gen_random_uuid(),
    '550e8400-e29b-41d4-a716-446655440000',
    '550e8400-e29b-41d4-a716-446655440001',
    15000.00,
    'EXPENSE',
    'Housing',
    'Monthly Rent',
    NOW() - INTERVAL '4 days',
    NOW(),
    NOW()
);

-- Expense: Groceries
INSERT INTO transactions (id, user_id, account_id, amount, type, category, note, transaction_date, created_at, updated_at)
VALUES (
    gen_random_uuid(),
    '550e8400-e29b-41d4-a716-446655440000',
    '550e8400-e29b-41d4-a716-446655440001',
    2000.00,
    'EXPENSE',
    'Food',
    'Weekly groceries',
    NOW() - INTERVAL '3 days',
    NOW(),
    NOW()
);

-- Expense: Course
INSERT INTO transactions (id, user_id, account_id, amount, type, category, note, transaction_date, created_at, updated_at)
VALUES (
    gen_random_uuid(),
    '550e8400-e29b-41d4-a716-446655440000',
    '550e8400-e29b-41d4-a716-446655440004',
    3000.00,
    'EXPENSE',
    'Education',
    'Go Programming Course',
    NOW() - INTERVAL '2 days',
    NOW(),
    NOW()
);

-- Transfer: FFA to Investment Account (Simulation)
INSERT INTO transactions (id, user_id, account_id, target_account_id, amount, type, category, note, transaction_date, created_at, updated_at)
VALUES (
    gen_random_uuid(),
    '550e8400-e29b-41d4-a716-446655440000',
    '550e8400-e29b-41d4-a716-446655440002',
    '550e8400-e29b-41d4-a716-446655440003',
    1000.00,
    'TRANSFER',
    'Investment',
    'Moving to long-term savings',
    NOW() - INTERVAL '1 day',
    NOW(),
    NOW()
);
