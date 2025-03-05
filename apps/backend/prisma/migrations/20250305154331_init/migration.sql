/*
  Warnings:

  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "ehrId" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "EHR" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "baseUrl" TEXT NOT NULL,
    "authType" TEXT NOT NULL,

    CONSTRAINT "EHR_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EHRMapping" (
    "id" TEXT NOT NULL,
    "ehrId" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "fieldName" TEXT NOT NULL,
    "mappingPath" TEXT NOT NULL,
    "dataType" TEXT NOT NULL,
    "required" BOOLEAN NOT NULL DEFAULT false,
    "apiEndpoint" TEXT,

    CONSTRAINT "EHRMapping_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EHR_name_key" ON "EHR"("name");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_ehrId_fkey" FOREIGN KEY ("ehrId") REFERENCES "EHR"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EHRMapping" ADD CONSTRAINT "EHRMapping_ehrId_fkey" FOREIGN KEY ("ehrId") REFERENCES "EHR"("id") ON DELETE CASCADE ON UPDATE CASCADE;
