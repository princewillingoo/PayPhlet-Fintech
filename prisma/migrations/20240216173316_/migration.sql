/*
  Warnings:

  - You are about to drop the column `userId` on the `business` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "business" DROP CONSTRAINT "business_userId_fkey";

-- DropIndex
DROP INDEX "business_address_line1_key";

-- DropIndex
DROP INDEX "business_address_line2_key";

-- DropIndex
DROP INDEX "business_email_key";

-- DropIndex
DROP INDEX "business_name_key";

-- DropIndex
DROP INDEX "business_phone_number_key";

-- DropIndex
DROP INDEX "business_userId_key";

-- AlterTable
ALTER TABLE "business" DROP COLUMN "userId",
ALTER COLUMN "address_line2" DROP NOT NULL,
ALTER COLUMN "notes" DROP NOT NULL;
