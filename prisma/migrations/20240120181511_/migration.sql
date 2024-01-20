/*
  Warnings:

  - You are about to drop the column `businessAddress` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `businessName` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `companyEmail` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `emailVerifiedAt` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `isEmailVerified` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `phoneNumber` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `rememberToken` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `users` table. All the data in the column will be lost.
  - Added the required column `phone_number` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "businessAddress",
DROP COLUMN "businessName",
DROP COLUMN "companyEmail",
DROP COLUMN "createdAt",
DROP COLUMN "emailVerifiedAt",
DROP COLUMN "isEmailVerified",
DROP COLUMN "phoneNumber",
DROP COLUMN "rememberToken",
DROP COLUMN "updatedAt",
ADD COLUMN     "business_address" TEXT,
ADD COLUMN     "business_name" TEXT,
ADD COLUMN     "company_email" TEXT,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "email_verified_at" TIMESTAMP(3),
ADD COLUMN     "is_email_verified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "phone_number" TEXT NOT NULL,
ADD COLUMN     "remember_Token" TEXT,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;
