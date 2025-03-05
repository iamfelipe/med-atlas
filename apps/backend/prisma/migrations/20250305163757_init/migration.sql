-- AlterTable
ALTER TABLE "EHRMapping" ALTER COLUMN "required" DROP NOT NULL,
ALTER COLUMN "required" SET DEFAULT true;
