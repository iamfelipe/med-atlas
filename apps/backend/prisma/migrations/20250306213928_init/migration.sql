/*
  Warnings:

  - The `dataType` column on the `EHRMapping` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "EHRDataType" AS ENUM ('STRING', 'NUMBER', 'DATE', 'BOOLEAN', 'MULTIPLE', 'RADIO', 'DROPDOWN');

-- AlterTable
ALTER TABLE "EHRMapping" DROP COLUMN "dataType",
ADD COLUMN     "dataType" "EHRDataType" NOT NULL DEFAULT 'STRING';
