/*
  Warnings:

  - You are about to drop the column `remember_Token` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "remember_Token",
ADD COLUMN     "remember_token" TEXT;
