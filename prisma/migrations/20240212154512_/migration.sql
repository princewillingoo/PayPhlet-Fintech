/*
  Warnings:

  - Made the column `invoice_vat` on table `invoices` required. This step will fail if there are existing NULL values in that column.
  - Made the column `invoice_discount` on table `invoices` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "invoice_items" ADD COLUMN     "map" DOUBLE PRECISION NOT NULL DEFAULT 0.00;

-- AlterTable
ALTER TABLE "invoices" ALTER COLUMN "invoice_note" SET DEFAULT 'This is a sample invoice note.',
ALTER COLUMN "invoice_vat" SET NOT NULL,
ALTER COLUMN "invoice_vat" SET DEFAULT 0.00,
ALTER COLUMN "invoice_discount" SET NOT NULL,
ALTER COLUMN "invoice_discount" SET DEFAULT 0.00,
ALTER COLUMN "status" SET DEFAULT 'DRAFT';
