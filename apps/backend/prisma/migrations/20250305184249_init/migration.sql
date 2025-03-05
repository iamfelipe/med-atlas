-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ehrId" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

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
    "required" BOOLEAN DEFAULT true,
    "apiEndpoint" TEXT,

    CONSTRAINT "EHRMapping_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "EHR_name_key" ON "EHR"("name");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_ehrId_fkey" FOREIGN KEY ("ehrId") REFERENCES "EHR"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EHRMapping" ADD CONSTRAINT "EHRMapping_ehrId_fkey" FOREIGN KEY ("ehrId") REFERENCES "EHR"("id") ON DELETE CASCADE ON UPDATE CASCADE;
