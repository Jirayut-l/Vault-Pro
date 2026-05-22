-- Vault Pro - Database Seed Script
-- Purpose: Populate the database with initial mock data for local development and testing.
-- Matches data from API_DB_Summary_With_Examples.md
-- Password for the test user is "password123"

-- Clear existing data (optional, use with caution)
TRUNCATE users, accounts, transactions, subscriptions, investments RESTART IDENTITY CASCADE;

-- 1. Insert Test User (Alex Doe)
-- UUID: 123e4567-e89b-12d3-a456-426614174000
-- Password Hash: bcrypt for "password123"
INSERT INTO users (id, username, email, password, created_at, updated_at)
VALUES (
    '123e4567-e89b-12d3-a456-426614174000',
    'Alex',
    'test@example.com',
    '$2a$10$KDhQj5JwsvebKdz8bO4H5usQq8XtLK5e7BwvISZPdX.jcamYNeWdy',
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- 2. Insert 6-Jar Accounts for Alex Doe
-- Necessity Fund (NEC)
INSERT INTO accounts (id, user_id, name, type, balance, created_at, updated_at)
VALUES (
    '550e8400-e29b-41d4-a716-446655440000',
    '123e4567-e89b-12d3-a456-426614174000',
    'Necessity Fund',
    'NEC',
    15000.50,
    '2026-05-22 08:05:00',
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- Play Account (PLY)
INSERT INTO accounts (id, user_id, name, type, balance, created_at, updated_at)
VALUES (
    '660e8400-e29b-41d4-a716-446655440001',
    '123e4567-e89b-12d3-a456-426614174000',
    'Play Account',
    'PLY',
    3000.00,
    '2026-05-22 08:05:00',
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- Financial Freedom (FFA)
INSERT INTO accounts (id, user_id, name, type, balance, created_at, updated_at)
VALUES (
    '770e8400-e29b-41d4-a716-446655440002',
    '123e4567-e89b-12d3-a456-426614174000',
    'Financial Freedom',
    'FFA',
    5000.00,
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- Long-term Savings (LTS)
INSERT INTO accounts (id, user_id, name, type, balance, created_at, updated_at)
VALUES (
    '880e8400-e29b-41d4-a716-446655440003',
    '123e4567-e89b-12d3-a456-426614174000',
    'Long-term Savings',
    'LTS',
    5000.00,
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- Education (EDU)
INSERT INTO accounts (id, user_id, name, type, balance, created_at, updated_at)
VALUES (
    '990e8400-e29b-41d4-a716-446655440004',
    '123e4567-e89b-12d3-a456-426614174000',
    'Education',
    'EDU',
    5000.00,
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- Give (GIV)
INSERT INTO accounts (id, user_id, name, type, balance, created_at, updated_at)
VALUES (
    'aa0e8400-e29b-41d4-a716-446655440005',
    '123e4567-e89b-12d3-a456-426614174000',
    'Give',
    'GIV',
    2500.00,
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- 3. Insert Mock Transactions
-- Expense: Groceries
INSERT INTO transactions (id, user_id, account_id, target_account_id, amount, type, category, note, transaction_date, created_at, updated_at)
VALUES (
    '770e8400-e29b-41d4-a716-446655440000',
    '123e4567-e89b-12d3-a456-426614174000',
    '550e8400-e29b-41d4-a716-446655440000',
    NULL,
    120.00,
    'EXPENSE',
    'Groceries',
    'Supermarket purchase',
    '2026-05-22 10:30:00',
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- Transfer: Internal Transfer
INSERT INTO transactions (id, user_id, account_id, target_account_id, amount, type, category, note, transaction_date, created_at, updated_at)
VALUES (
    '880e8400-e29b-41d4-a716-446655440000',
    '123e4567-e89b-12d3-a456-426614174000',
    '550e8400-e29b-41d4-a716-446655440000',
    '660e8400-e29b-41d4-a716-446655440001',
    500.00,
    'TRANSFER',
    'Internal Transfer',
    'Transfer to Play Account',
    '2026-05-22 11:00:00',
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- 4. Insert Mock Subscriptions
INSERT INTO subscriptions (id, user_id, account_id, name, amount, billing_cycle_day, created_at, updated_at)
VALUES (
    gen_random_uuid(),
    '123e4567-e89b-12d3-a456-426614174000',
    '550e8400-e29b-41d4-a716-446655440000',
    'Netflix Premium',
    419.00,
    15,
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- 5. Insert Mock Investments
INSERT INTO investments (id, user_id, account_id, name, symbol, type, units, avg_cost, created_at, updated_at)
VALUES (
    gen_random_uuid(),
    '123e4567-e89b-12d3-a456-426614174000',
    '770e8400-e29b-41d4-a716-446655440002',
    'K-USA-A(D) Fund',
    'K-USA-A(D)',
    'ETF',
    245.55,
    20.3624,
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- 6. Generated Bulk Mock Transactions
INSERT INTO transactions (id, user_id, account_id, target_account_id, amount, type, category, note, transaction_date, created_at, updated_at) VALUES
(gen_random_uuid(), '123e4567-e89b-12d3-a456-426614174000', '550e8400-e29b-41d4-a716-446655440000', NULL, 15000, 'EXPENSE', 'NEC Expense', 'Mock transaction for NEC', '2026-05-01 10:00:00', NOW(), NOW()),
(gen_random_uuid(), '123e4567-e89b-12d3-a456-426614174000', '550e8400-e29b-41d4-a716-446655440000', NULL, 15000, 'EXPENSE', 'NEC Expense', 'Mock transaction for NEC', '2026-05-02 10:00:00', NOW(), NOW()),
(gen_random_uuid(), '123e4567-e89b-12d3-a456-426614174000', '550e8400-e29b-41d4-a716-446655440000', NULL, 15000, 'EXPENSE', 'NEC Expense', 'Mock transaction for NEC', '2026-05-03 10:00:00', NOW(), NOW()),
(gen_random_uuid(), '123e4567-e89b-12d3-a456-426614174000', '550e8400-e29b-41d4-a716-446655440000', NULL, 15000, 'EXPENSE', 'NEC Expense', 'Mock transaction for NEC', '2026-05-04 10:00:00', NOW(), NOW()),
(gen_random_uuid(), '123e4567-e89b-12d3-a456-426614174000', '550e8400-e29b-41d4-a716-446655440000', NULL, 15000, 'EXPENSE', 'NEC Expense', 'Mock transaction for NEC', '2026-05-05 10:00:00', NOW(), NOW()),
(gen_random_uuid(), '123e4567-e89b-12d3-a456-426614174000', '550e8400-e29b-41d4-a716-446655440000', NULL, 15000, 'EXPENSE', 'NEC Expense', 'Mock transaction for NEC', '2026-05-06 10:00:00', NOW(), NOW()),
(gen_random_uuid(), '123e4567-e89b-12d3-a456-426614174000', '550e8400-e29b-41d4-a716-446655440000', NULL, 15000, 'EXPENSE', 'NEC Expense', 'Mock transaction for NEC', '2026-05-07 10:00:00', NOW(), NOW()),
(gen_random_uuid(), '123e4567-e89b-12d3-a456-426614174000', '550e8400-e29b-41d4-a716-446655440000', NULL, 15000, 'EXPENSE', 'NEC Expense', 'Mock transaction for NEC', '2026-05-08 10:00:00', NOW(), NOW()),
(gen_random_uuid(), '123e4567-e89b-12d3-a456-426614174000', '550e8400-e29b-41d4-a716-446655440000', NULL, 15000, 'EXPENSE', 'NEC Expense', 'Mock transaction for NEC', '2026-05-09 10:00:00', NOW(), NOW()),
(gen_random_uuid(), '123e4567-e89b-12d3-a456-426614174000', '660e8400-e29b-41d4-a716-446655440001', NULL, 3000, 'EXPENSE', 'PLY Expense', 'Mock transaction for PLY', '2026-05-01 10:00:00', NOW(), NOW()),
(gen_random_uuid(), '123e4567-e89b-12d3-a456-426614174000', '660e8400-e29b-41d4-a716-446655440001', NULL, 3000, 'EXPENSE', 'PLY Expense', 'Mock transaction for PLY', '2026-05-02 10:00:00', NOW(), NOW()),
(gen_random_uuid(), '123e4567-e89b-12d3-a456-426614174000', '660e8400-e29b-41d4-a716-446655440001', NULL, 3000, 'EXPENSE', 'PLY Expense', 'Mock transaction for PLY', '2026-05-03 10:00:00', NOW(), NOW()),
(gen_random_uuid(), '123e4567-e89b-12d3-a456-426614174000', '660e8400-e29b-41d4-a716-446655440001', NULL, 3000, 'EXPENSE', 'PLY Expense', 'Mock transaction for PLY', '2026-05-04 10:00:00', NOW(), NOW()),
(gen_random_uuid(), '123e4567-e89b-12d3-a456-426614174000', '660e8400-e29b-41d4-a716-446655440001', NULL, 3000, 'EXPENSE', 'PLY Expense', 'Mock transaction for PLY', '2026-05-05 10:00:00', NOW(), NOW()),
(gen_random_uuid(), '123e4567-e89b-12d3-a456-426614174000', '660e8400-e29b-41d4-a716-446655440001', NULL, 3000, 'EXPENSE', 'PLY Expense', 'Mock transaction for PLY', '2026-05-06 10:00:00', NOW(), NOW()),
(gen_random_uuid(), '123e4567-e89b-12d3-a456-426614174000', '660e8400-e29b-41d4-a716-446655440001', NULL, 3000, 'EXPENSE', 'PLY Expense', 'Mock transaction for PLY', '2026-05-07 10:00:00', NOW(), NOW()),
(gen_random_uuid(), '123e4567-e89b-12d3-a456-426614174000', '660e8400-e29b-41d4-a716-446655440001', NULL, 3000, 'EXPENSE', 'PLY Expense', 'Mock transaction for PLY', '2026-05-08 10:00:00', NOW(), NOW()),
(gen_random_uuid(), '123e4567-e89b-12d3-a456-426614174000', '660e8400-e29b-41d4-a716-446655440001', NULL, 3000, 'EXPENSE', 'PLY Expense', 'Mock transaction for PLY', '2026-05-09 10:00:00', NOW(), NOW()),
(gen_random_uuid(), '123e4567-e89b-12d3-a456-426614174000', '770e8400-e29b-41d4-a716-446655440002', NULL, 6000, 'EXPENSE', 'FFA Expense', 'Mock transaction for FFA', '2026-05-01 10:00:00', NOW(), NOW()),
(gen_random_uuid(), '123e4567-e89b-12d3-a456-426614174000', '770e8400-e29b-41d4-a716-446655440002', NULL, 6000, 'EXPENSE', 'FFA Expense', 'Mock transaction for FFA', '2026-05-02 10:00:00', NOW(), NOW()),
(gen_random_uuid(), '123e4567-e89b-12d3-a456-426614174000', '770e8400-e29b-41d4-a716-446655440002', NULL, 6000, 'EXPENSE', 'FFA Expense', 'Mock transaction for FFA', '2026-05-03 10:00:00', NOW(), NOW()),
(gen_random_uuid(), '123e4567-e89b-12d3-a456-426614174000', '770e8400-e29b-41d4-a716-446655440002', NULL, 6000, 'EXPENSE', 'FFA Expense', 'Mock transaction for FFA', '2026-05-04 10:00:00', NOW(), NOW()),
(gen_random_uuid(), '123e4567-e89b-12d3-a456-426614174000', '770e8400-e29b-41d4-a716-446655440002', NULL, 6000, 'EXPENSE', 'FFA Expense', 'Mock transaction for FFA', '2026-05-05 10:00:00', NOW(), NOW()),
(gen_random_uuid(), '123e4567-e89b-12d3-a456-426614174000', '770e8400-e29b-41d4-a716-446655440002', NULL, 6000, 'EXPENSE', 'FFA Expense', 'Mock transaction for FFA', '2026-05-06 10:00:00', NOW(), NOW()),
(gen_random_uuid(), '123e4567-e89b-12d3-a456-426614174000', '770e8400-e29b-41d4-a716-446655440002', NULL, 6000, 'EXPENSE', 'FFA Expense', 'Mock transaction for FFA', '2026-05-07 10:00:00', NOW(), NOW()),
(gen_random_uuid(), '123e4567-e89b-12d3-a456-426614174000', '770e8400-e29b-41d4-a716-446655440002', NULL, 6000, 'EXPENSE', 'FFA Expense', 'Mock transaction for FFA', '2026-05-08 10:00:00', NOW(), NOW()),
(gen_random_uuid(), '123e4567-e89b-12d3-a456-426614174000', '880e8400-e29b-41d4-a716-446655440003', NULL, 6000, 'EXPENSE', 'LTS Expense', 'Mock transaction for LTS', '2026-05-01 10:00:00', NOW(), NOW()),
(gen_random_uuid(), '123e4567-e89b-12d3-a456-426614174000', '880e8400-e29b-41d4-a716-446655440003', NULL, 6000, 'EXPENSE', 'LTS Expense', 'Mock transaction for LTS', '2026-05-02 10:00:00', NOW(), NOW()),
(gen_random_uuid(), '123e4567-e89b-12d3-a456-426614174000', '880e8400-e29b-41d4-a716-446655440003', NULL, 6000, 'EXPENSE', 'LTS Expense', 'Mock transaction for LTS', '2026-05-03 10:00:00', NOW(), NOW()),
(gen_random_uuid(), '123e4567-e89b-12d3-a456-426614174000', '880e8400-e29b-41d4-a716-446655440003', NULL, 6000, 'EXPENSE', 'LTS Expense', 'Mock transaction for LTS', '2026-05-04 10:00:00', NOW(), NOW()),
(gen_random_uuid(), '123e4567-e89b-12d3-a456-426614174000', '880e8400-e29b-41d4-a716-446655440003', NULL, 6000, 'EXPENSE', 'LTS Expense', 'Mock transaction for LTS', '2026-05-05 10:00:00', NOW(), NOW()),
(gen_random_uuid(), '123e4567-e89b-12d3-a456-426614174000', '880e8400-e29b-41d4-a716-446655440003', NULL, 6000, 'EXPENSE', 'LTS Expense', 'Mock transaction for LTS', '2026-05-06 10:00:00', NOW(), NOW()),
(gen_random_uuid(), '123e4567-e89b-12d3-a456-426614174000', '880e8400-e29b-41d4-a716-446655440003', NULL, 6000, 'EXPENSE', 'LTS Expense', 'Mock transaction for LTS', '2026-05-07 10:00:00', NOW(), NOW()),
(gen_random_uuid(), '123e4567-e89b-12d3-a456-426614174000', '880e8400-e29b-41d4-a716-446655440003', NULL, 6000, 'EXPENSE', 'LTS Expense', 'Mock transaction for LTS', '2026-05-08 10:00:00', NOW(), NOW()),
(gen_random_uuid(), '123e4567-e89b-12d3-a456-426614174000', '990e8400-e29b-41d4-a716-446655440004', NULL, 6000, 'EXPENSE', 'EDU Expense', 'Mock transaction for EDU', '2026-05-01 10:00:00', NOW(), NOW()),
(gen_random_uuid(), '123e4567-e89b-12d3-a456-426614174000', '990e8400-e29b-41d4-a716-446655440004', NULL, 6000, 'EXPENSE', 'EDU Expense', 'Mock transaction for EDU', '2026-05-02 10:00:00', NOW(), NOW()),
(gen_random_uuid(), '123e4567-e89b-12d3-a456-426614174000', '990e8400-e29b-41d4-a716-446655440004', NULL, 6000, 'EXPENSE', 'EDU Expense', 'Mock transaction for EDU', '2026-05-03 10:00:00', NOW(), NOW()),
(gen_random_uuid(), '123e4567-e89b-12d3-a456-426614174000', '990e8400-e29b-41d4-a716-446655440004', NULL, 6000, 'EXPENSE', 'EDU Expense', 'Mock transaction for EDU', '2026-05-04 10:00:00', NOW(), NOW()),
(gen_random_uuid(), '123e4567-e89b-12d3-a456-426614174000', '990e8400-e29b-41d4-a716-446655440004', NULL, 6000, 'EXPENSE', 'EDU Expense', 'Mock transaction for EDU', '2026-05-05 10:00:00', NOW(), NOW()),
(gen_random_uuid(), '123e4567-e89b-12d3-a456-426614174000', '990e8400-e29b-41d4-a716-446655440004', NULL, 6000, 'EXPENSE', 'EDU Expense', 'Mock transaction for EDU', '2026-05-06 10:00:00', NOW(), NOW()),
(gen_random_uuid(), '123e4567-e89b-12d3-a456-426614174000', '990e8400-e29b-41d4-a716-446655440004', NULL, 6000, 'EXPENSE', 'EDU Expense', 'Mock transaction for EDU', '2026-05-07 10:00:00', NOW(), NOW()),
(gen_random_uuid(), '123e4567-e89b-12d3-a456-426614174000', '990e8400-e29b-41d4-a716-446655440004', NULL, 6000, 'EXPENSE', 'EDU Expense', 'Mock transaction for EDU', '2026-05-08 10:00:00', NOW(), NOW()),
(gen_random_uuid(), '123e4567-e89b-12d3-a456-426614174000', 'aa0e8400-e29b-41d4-a716-446655440005', NULL, 3000, 'EXPENSE', 'GIV Expense', 'Mock transaction for GIV', '2026-05-01 10:00:00', NOW(), NOW()),
(gen_random_uuid(), '123e4567-e89b-12d3-a456-426614174000', 'aa0e8400-e29b-41d4-a716-446655440005', NULL, 3000, 'EXPENSE', 'GIV Expense', 'Mock transaction for GIV', '2026-05-02 10:00:00', NOW(), NOW()),
(gen_random_uuid(), '123e4567-e89b-12d3-a456-426614174000', 'aa0e8400-e29b-41d4-a716-446655440005', NULL, 3000, 'EXPENSE', 'GIV Expense', 'Mock transaction for GIV', '2026-05-03 10:00:00', NOW(), NOW()),
(gen_random_uuid(), '123e4567-e89b-12d3-a456-426614174000', 'aa0e8400-e29b-41d4-a716-446655440005', NULL, 3000, 'EXPENSE', 'GIV Expense', 'Mock transaction for GIV', '2026-05-04 10:00:00', NOW(), NOW()),
(gen_random_uuid(), '123e4567-e89b-12d3-a456-426614174000', 'aa0e8400-e29b-41d4-a716-446655440005', NULL, 3000, 'EXPENSE', 'GIV Expense', 'Mock transaction for GIV', '2026-05-05 10:00:00', NOW(), NOW()),
(gen_random_uuid(), '123e4567-e89b-12d3-a456-426614174000', 'aa0e8400-e29b-41d4-a716-446655440005', NULL, 3000, 'EXPENSE', 'GIV Expense', 'Mock transaction for GIV', '2026-05-06 10:00:00', NOW(), NOW()),
(gen_random_uuid(), '123e4567-e89b-12d3-a456-426614174000', 'aa0e8400-e29b-41d4-a716-446655440005', NULL, 3000, 'EXPENSE', 'GIV Expense', 'Mock transaction for GIV', '2026-05-07 10:00:00', NOW(), NOW()),
(gen_random_uuid(), '123e4567-e89b-12d3-a456-426614174000', 'aa0e8400-e29b-41d4-a716-446655440005', NULL, 3000, 'EXPENSE', 'GIV Expense', 'Mock transaction for GIV', '2026-05-08 10:00:00', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;
