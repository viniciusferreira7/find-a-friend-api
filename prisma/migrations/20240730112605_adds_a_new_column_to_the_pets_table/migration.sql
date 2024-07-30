-- CreateEnum
CREATE TYPE "Pet_independence_level" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- AlterTable
ALTER TABLE "pets" ADD COLUMN     "pet_independence_level" "Pet_independence_level" NOT NULL DEFAULT 'MEDIUM';
