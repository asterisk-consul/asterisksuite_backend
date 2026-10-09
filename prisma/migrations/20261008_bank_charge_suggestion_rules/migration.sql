DO $$ BEGIN
  CREATE TYPE tenant."BankChargeRuleTrigger" AS ENUM (
    'BANK_PAYMENT', 'BANK_COLLECTION', 'CARD_SETTLEMENT', 'CHECK_DEPOSIT',
    'CHECK_REJECTION', 'INVESTMENT_REDEMPTION', 'FIXED_TERM_EARLY_CANCEL'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE tenant."BankChargeCalculationType" AS ENUM ('FIXED', 'PERCENTAGE', 'FIXED_PLUS_PERCENTAGE');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS tenant.bank_charge_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bank_account_id uuid NOT NULL REFERENCES tenant.bank_accounts(id),
  bank_concept_id uuid NOT NULL REFERENCES tenant.bank_concepts(id),
  name varchar(120) NOT NULL,
  trigger tenant."BankChargeRuleTrigger" NOT NULL,
  calculation_type tenant."BankChargeCalculationType" NOT NULL,
  fixed_amount numeric(15,2) NOT NULL DEFAULT 0,
  percentage numeric(8,4),
  minimum_amount numeric(15,2),
  maximum_amount numeric(15,2),
  currency_code varchar(10),
  valid_from date,
  valid_until date,
  priority integer NOT NULL DEFAULT 0,
  editable boolean NOT NULL DEFAULT true,
  active boolean NOT NULL DEFAULT true,
  created_at timestamp(6) NOT NULL DEFAULT now(),
  updated_at timestamp(6),
  deleted_at timestamp(3),
  created_by uuid,
  updated_by uuid,
  deleted_by uuid
);

CREATE INDEX IF NOT EXISTS bank_charge_rules_account_trigger_active_idx
  ON tenant.bank_charge_rules(bank_account_id, trigger, active);
CREATE INDEX IF NOT EXISTS bank_charge_rules_concept_idx
  ON tenant.bank_charge_rules(bank_concept_id);
