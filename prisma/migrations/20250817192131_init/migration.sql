/*
  Warnings:

  - A unique constraint covering the columns `[customerId,date]` on the table `Invoice` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Invoice_customerId_date_key" ON "public"."Invoice"("customerId", "date");
