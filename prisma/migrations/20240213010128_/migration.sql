/*
  Warnings:

  - You are about to drop the column `invoice_vat%` on the `invoices` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "invoices" DROP COLUMN "invoice_vat%",
ADD COLUMN     "invoice_vat" DOUBLE PRECISION NOT NULL DEFAULT 0.00;
