-- AlterTable: Add is_salesperson to employees
ALTER TABLE "tenant"."employees" ADD COLUMN "is_salesperson" BOOLEAN NOT NULL DEFAULT false;
