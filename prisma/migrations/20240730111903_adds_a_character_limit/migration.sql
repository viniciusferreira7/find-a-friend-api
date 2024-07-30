/*
  Warnings:

  - You are about to alter the column `manager_name` on the `organizations` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `name` on the `pet_requeriments` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(400)`.
  - You are about to alter the column `name` on the `pets` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `description` on the `pets` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(300)`.
  - You are about to alter the column `name` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.

*/
-- AlterTable
ALTER TABLE "organizations" ALTER COLUMN "manager_name" SET DATA TYPE VARCHAR(100);

-- AlterTable
ALTER TABLE "pet_requeriments" ALTER COLUMN "name" SET DATA TYPE VARCHAR(400);

-- AlterTable
ALTER TABLE "pets" ALTER COLUMN "name" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "description" SET DATA TYPE VARCHAR(300);

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "name" SET DATA TYPE VARCHAR(100);
