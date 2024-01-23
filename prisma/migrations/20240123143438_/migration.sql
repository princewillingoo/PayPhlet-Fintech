/*
  Warnings:

  - Made the column `invoice_due_date` on table `invoices` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "invoices" ALTER COLUMN "invoice_due_date" SET NOT NULL;
