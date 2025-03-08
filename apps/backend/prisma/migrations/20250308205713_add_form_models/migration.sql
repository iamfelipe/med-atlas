-- CreateEnum
CREATE TYPE "FormStatus" AS ENUM ('pending', 'completed');

-- CreateTable
CREATE TABLE "Form" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" "FormStatus" NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "ehrId" TEXT NOT NULL,

    CONSTRAINT "Form_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FormQuestion" (
    "id" TEXT NOT NULL,
    "formId" TEXT NOT NULL,
    "mappingId" TEXT NOT NULL,
    "value" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FormQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Form_userId_key" ON "Form"("userId");

-- AddForeignKey
ALTER TABLE "Form" ADD CONSTRAINT "Form_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Form" ADD CONSTRAINT "Form_ehrId_fkey" FOREIGN KEY ("ehrId") REFERENCES "EHR"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormQuestion" ADD CONSTRAINT "FormQuestion_formId_fkey" FOREIGN KEY ("formId") REFERENCES "Form"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormQuestion" ADD CONSTRAINT "FormQuestion_mappingId_fkey" FOREIGN KEY ("mappingId") REFERENCES "EHRMapping"("id") ON DELETE CASCADE ON UPDATE CASCADE;
