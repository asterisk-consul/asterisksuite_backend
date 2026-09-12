-- Migration: Current Accounts → Always Base Currency
-- Step 1: Add base_currency_code column temporarily
ALTER TABLE tenant.current_accounts ADD COLUMN base_currency_code VARCHAR(10);

-- Step 2: Fill base_currency_code from currencies.is_base
UPDATE tenant.current_accounts ca
SET base_currency_code = c.code
FROM tenant.currencies c
WHERE c.is_base = true;

-- Step 3: If no base currency exists, default to ARS
UPDATE tenant.current_accounts SET base_currency_code = 'ARS' WHERE base_currency_code IS NULL;

-- Step 4: Migrate entries: calculate converted_amount for non-base entries
-- For entries that already have converted_amount, keep it
-- For entries without converted_amount in non-base currency, calculate using exchange_rate
UPDATE tenant.current_account_entries cae
SET converted_amount = CASE
    WHEN cae.converted_amount IS NOT NULL THEN cae.converted_amount
    WHEN cae.exchange_rate IS NOT NULL AND cae.exchange_rate > 0 THEN cae.amount * cae.exchange_rate
    ELSE cae.amount
END
WHERE cae.currency_code != (SELECT code FROM tenant.currencies WHERE is_base = true LIMIT 1)
  AND cae.converted_amount IS NULL;

-- Step 5: For base currency entries, set converted_amount = amount
UPDATE tenant.current_account_entries cae
SET converted_amount = cae.amount
WHERE cae.currency_code = (SELECT code FROM tenant.currencies WHERE is_base = true LIMIT 1)
  AND cae.converted_amount IS NULL;

-- Step 6: Create/consolidate base currency accounts per party
-- First, create base currency account for parties that don't have one
INSERT INTO tenant.current_accounts (id, party_id, party_type, balance, active, created_at, updated_at, created_by)
SELECT gen_random_uuid(), ca.party_id, ca.party_type, 0, true, NOW(), NOW(), ca.created_by
FROM tenant.current_accounts ca
WHERE NOT EXISTS (
    SELECT 1 FROM tenant.current_accounts ca2
    WHERE ca2.party_id = ca.party_id AND ca2.deleted_at IS NULL
)
AND ca.currency_code != (SELECT code FROM tenant.currencies WHERE is_base = true LIMIT 1)
GROUP BY ca.party_id, ca.party_type, ca.created_by;

-- Step 7: Consolidate balances into base currency account
-- For each party with a non-base account, add the converted balance to the base account
UPDATE tenant.current_accounts base_ca
SET balance = base_ca.balance + COALESCE(sub.total_converted, 0),
    updated_at = NOW()
FROM (
    SELECT ca.party_id,
           SUM(CASE
               WHEN ca.currency_code = (SELECT code FROM tenant.currencies WHERE is_base = true LIMIT 1)
               THEN ca.balance
               WHEN ca.converted_balance IS NOT NULL THEN ca.converted_balance
               ELSE 0
           END) as total_converted
    FROM tenant.current_accounts ca
    WHERE ca.deleted_at IS NULL
    GROUP BY ca.party_id
) sub
WHERE base_ca.party_id = sub.party_id
  AND base_ca.currency_code = (SELECT code FROM tenant.currencies WHERE is_base = true LIMIT 1)
  AND base_ca.deleted_at IS NULL;

-- Step 8: Soft-delete non-base currency accounts
UPDATE tenant.current_accounts
SET deleted_at = NOW(), deleted_by = created_by
WHERE currency_code != (SELECT code FROM tenant.currencies WHERE is_base = true LIMIT 1)
  AND deleted_at IS NULL;

-- Step 9: Drop the old unique constraint and create new one
ALTER TABLE tenant.current_accounts DROP CONSTRAINT IF EXISTS current_accounts_party_id_currency_code_key;
ALTER TABLE tenant.current_accounts ADD CONSTRAINT current_accounts_party_id_key UNIQUE (party_id);

-- Step 10: Drop columns
ALTER TABLE tenant.current_accounts DROP COLUMN IF EXISTS currency_code;
ALTER TABLE tenant.current_accounts DROP COLUMN IF EXISTS converted_balance;
ALTER TABLE tenant.current_accounts DROP COLUMN IF EXISTS base_currency_code;
