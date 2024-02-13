/*
  Warnings:

  - You are about to drop the column `map` on the `invoice_items` table. All the data in the column will be lost.
  - You are about to drop the column `invoice_discount` on the `invoices` table. All the data in the column will be lost.
  - You are about to drop the column `invoice_vat` on the `invoices` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "invoice_items" DROP COLUMN "map",
ADD COLUMN     "vat" TEXT NOT NULL DEFAULT '0%';

-- AlterTable
ALTER TABLE "invoices" DROP COLUMN "invoice_discount",
DROP COLUMN "invoice_vat",
ADD COLUMN     "invoice_discount%" TEXT NOT NULL DEFAULT '0%',
ADD COLUMN     "invoice_vat%" TEXT NOT NULL DEFAULT '0%';
