/*
  Warnings:

  - You are about to drop the column `business_address` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `business_name` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `company_email` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[phone_number]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "business_address",
DROP COLUMN "business_name",
DROP COLUMN "company_email";

-- CreateTable
CREATE TABLE "business" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "address_line1" TEXT NOT NULL,
    "address_line2" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "State" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "notes" TEXT NOT NULL,

    CONSTRAINT "business_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "business_name_key" ON "business"("name");

-- CreateIndex
CREATE UNIQUE INDEX "business_email_key" ON "business"("email");

-- CreateIndex
CREATE UNIQUE INDEX "business_phone_number_key" ON "business"("phone_number");

-- CreateIndex
CREATE UNIQUE INDEX "business_address_line1_key" ON "business"("address_line1");

-- CreateIndex
CREATE UNIQUE INDEX "business_address_line2_key" ON "business"("address_line2");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_number_key" ON "users"("phone_number");
