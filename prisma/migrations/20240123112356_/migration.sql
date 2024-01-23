/*
  Warnings:

  - Added the required column `invoice_subject` to the `invoices` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "invoices" ADD COLUMN     "invoice_subject" TEXT NOT NULL;
