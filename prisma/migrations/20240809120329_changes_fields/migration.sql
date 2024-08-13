/*
  Warnings:

  - You are about to alter the column `cep` on the `organizations` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `VarChar(8)`.

*/
-- AlterTable
ALTER TABLE "organizations" ALTER COLUMN "cep" SET DATA TYPE VARCHAR(8),
ALTER COLUMN "cell_phone_number" SET DATA TYPE VARCHAR(15);
