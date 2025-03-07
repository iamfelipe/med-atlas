/*
  Warnings:

  - Made the column `apiEndpoint` on table `EHRMapping` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "EHRMapping" ALTER COLUMN "apiEndpoint" SET NOT NULL;
