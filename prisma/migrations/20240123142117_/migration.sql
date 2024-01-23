-- AlterTable
ALTER TABLE "invoices" ALTER COLUMN "invoice_due_date" DROP NOT NULL,
ALTER COLUMN "invoice_note" DROP NOT NULL,
ALTER COLUMN "invoice_vat" DROP NOT NULL,
ALTER COLUMN "invoice_discount" DROP NOT NULL;
