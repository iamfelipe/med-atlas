/*
  Warnings:

  - The values [STRING,NUMBER,DATE,BOOLEAN,MULTIPLE,RADIO,DROPDOWN] on the enum `EHRDataType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "EHRDataType_new" AS ENUM ('string', 'number', 'date', 'boolean', 'multiple', 'radio', 'dropdown');
ALTER TABLE "EHRMapping" ALTER COLUMN "dataType" DROP DEFAULT;
ALTER TABLE "EHRMapping" ALTER COLUMN "dataType" TYPE "EHRDataType_new" USING ("dataType"::text::"EHRDataType_new");
ALTER TYPE "EHRDataType" RENAME TO "EHRDataType_old";
ALTER TYPE "EHRDataType_new" RENAME TO "EHRDataType";
DROP TYPE "EHRDataType_old";
ALTER TABLE "EHRMapping" ALTER COLUMN "dataType" SET DEFAULT 'string';
COMMIT;

-- AlterTable
ALTER TABLE "EHRMapping" ALTER COLUMN "dataType" SET DEFAULT 'string';
