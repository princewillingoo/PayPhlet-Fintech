/*
  Warnings:

  - You are about to drop the `Payment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_invoiceId_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_userId_fkey";

-- DropTable
DROP TABLE "Payment";

-- CreateTable
CREATE TABLE "payment" (
    "id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "payment_ref" TEXT NOT NULL,
    "paid" BOOLEAN NOT NULL DEFAULT false,
    "channel" "PaymentMethod" NOT NULL,
    "paystack_ref" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "invoiceId" TEXT NOT NULL,

    CONSTRAINT "payment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "payment_payment_ref_key" ON "payment"("payment_ref");

-- CreateIndex
CREATE UNIQUE INDEX "payment_paystack_ref_key" ON "payment"("paystack_ref");

-- CreateIndex
CREATE UNIQUE INDEX "payment_invoiceId_key" ON "payment"("invoiceId");

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "invoices"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
