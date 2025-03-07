-- AlterTable
ALTER TABLE "EHRMapping" ADD COLUMN     "options" TEXT[] DEFAULT ARRAY[]::TEXT[];
