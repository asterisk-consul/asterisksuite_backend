-- AlterEnum: Add EXPENSE to PaymentType enum
ALTER TYPE tenant."PaymentType" ADD VALUE IF NOT EXISTS 'EXPENSE';
