/*
  Warnings:

  - You are about to drop the column `passwordHash` on the `organizations` table. All the data in the column will be lost.
  - Added the required column `password_hash` to the `organizations` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `cell_phone_number` on the `organizations` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "organizations" DROP COLUMN "passwordHash",
ADD COLUMN     "password_hash" TEXT NOT NULL,
DROP COLUMN "cell_phone_number",
ADD COLUMN     "cell_phone_number" INTEGER NOT NULL;
