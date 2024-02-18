/*
  Warnings:

  - You are about to drop the column `State` on the `business` table. All the data in the column will be lost.
  - Added the required column `state` to the `business` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "business" DROP COLUMN "State",
ADD COLUMN     "state" TEXT NOT NULL;
