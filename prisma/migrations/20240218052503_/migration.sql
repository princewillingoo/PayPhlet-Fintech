/*
  Warnings:

  - A unique constraint covering the columns `[phone_number]` on the table `customers` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "customers_phone_number_key" ON "customers"("phone_number");
