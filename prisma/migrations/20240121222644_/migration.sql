/*
  Warnings:

  - Made the column `customer` on table `invoices` required. This step will fail if there are existing NULL values in that column.
  - Changed the type of `status` on the `invoices` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('DRAFT', 'SENT');

-- AlterTable
ALTER TABLE "invoices" ALTER COLUMN "customer" SET NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "Status" NOT NULL;
