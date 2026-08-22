-- Incremental Migration for HR Helpdesk / Employee Request Management

-- CreateEnum
CREATE TYPE "HelpdeskCategory" AS ENUM ('SALARY_ISSUE', 'ATTENDANCE_CORRECTION', 'LEAVE_ISSUE', 'DOCUMENT_REQUEST', 'PROFILE_UPDATE', 'OTHER');

-- AlterEnum
ALTER TYPE "HelpdeskStatus" ADD VALUE 'CANCELLED';

-- AlterTable: Update HelpdeskRequest model
ALTER TABLE "HelpdeskRequest" DROP COLUMN "category",
ADD COLUMN "category" "HelpdeskCategory" NOT NULL,
ADD COLUMN "resolution" TEXT,
ADD COLUMN "resolvedAt" TIMESTAMP(3),
ADD COLUMN "closedAt" TIMESTAMP(3);

-- CreateTable: HelpdeskComment
CREATE TABLE "HelpdeskComment" (
    "id" TEXT NOT NULL,
    "helpdeskRequestId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HelpdeskComment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "HelpdeskComment_helpdeskRequestId_createdAt_idx" ON "HelpdeskComment"("helpdeskRequestId", "createdAt");

-- CreateIndex
CREATE INDEX "HelpdeskRequest_employeeId_createdAt_idx" ON "HelpdeskRequest"("employeeId", "createdAt");

-- CreateIndex
CREATE INDEX "HelpdeskRequest_category_idx" ON "HelpdeskRequest"("category");

-- CreateIndex
CREATE INDEX "HelpdeskRequest_priority_idx" ON "HelpdeskRequest"("priority");

-- CreateIndex
CREATE INDEX "HelpdeskRequest_assignedToId_idx" ON "HelpdeskRequest"("assignedToId");

-- AddForeignKey
ALTER TABLE "HelpdeskComment" ADD CONSTRAINT "HelpdeskComment_helpdeskRequestId_fkey" FOREIGN KEY ("helpdeskRequestId") REFERENCES "HelpdeskRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HelpdeskComment" ADD CONSTRAINT "HelpdeskComment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
