/*
  Warnings:

  - A unique constraint covering the columns `[account_no]` on the table `business` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[qr_code_data]` on the table `business` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[qr_code]` on the table `business` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updated_at` to the `customers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `invoice_items` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "business_phone_number_key";

-- AlterTable
ALTER TABLE "business" ADD COLUMN     "account_name" TEXT,
ADD COLUMN     "account_no" TEXT,
ADD COLUMN     "bank_name" TEXT,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "qr_code" TEXT,
ADD COLUMN     "qr_code_data" TEXT,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "customers" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "invoice_items" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "business_account_no_key" ON "business"("account_no");

-- CreateIndex
CREATE UNIQUE INDEX "business_qr_code_data_key" ON "business"("qr_code_data");

-- CreateIndex
CREATE UNIQUE INDEX "business_qr_code_key" ON "business"("qr_code");
