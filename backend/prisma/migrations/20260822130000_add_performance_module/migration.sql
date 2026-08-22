-- Migration: Add Performance Management Module (GoalStatus, PerformanceGoal, PerformanceReview)

-- CreateEnum
CREATE TYPE "GoalStatus" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- AlterTable PerformanceGoal
ALTER TABLE "PerformanceGoal" ADD COLUMN IF NOT EXISTS "target" TEXT;
ALTER TABLE "PerformanceGoal" ADD COLUMN IF NOT EXISTS "progress" DOUBLE PRECISION NOT NULL DEFAULT 0;
ALTER TABLE "PerformanceGoal" ADD COLUMN IF NOT EXISTS "startDate" TIMESTAMP(3);
ALTER TABLE "PerformanceGoal" ADD COLUMN IF NOT EXISTS "dueDate" DATE;
ALTER TABLE "PerformanceGoal" ADD COLUMN IF NOT EXISTS "createdById" TEXT;
ALTER TABLE "PerformanceGoal" ALTER COLUMN "description" DROP NOT NULL;

-- AlterTable PerformanceReview
ALTER TABLE "PerformanceReview" ADD COLUMN IF NOT EXISTS "reviewerId" TEXT;
ALTER TABLE "PerformanceReview" ADD COLUMN IF NOT EXISTS "reviewDate" TIMESTAMP(3);
ALTER TABLE "PerformanceReview" ADD COLUMN IF NOT EXISTS "selfAssessment" TEXT;
ALTER TABLE "PerformanceReview" ADD COLUMN IF NOT EXISTS "reviewerFeedback" TEXT;
ALTER TABLE "PerformanceReview" ADD COLUMN IF NOT EXISTS "strengths" TEXT;
ALTER TABLE "PerformanceReview" ADD COLUMN IF NOT EXISTS "improvementAreas" TEXT;

-- CreateIndex
CREATE INDEX IF NOT EXISTS "PerformanceGoal_employeeId_idx" ON "PerformanceGoal"("employeeId");
CREATE INDEX IF NOT EXISTS "PerformanceGoal_status_idx" ON "PerformanceGoal"("status");
CREATE UNIQUE INDEX IF NOT EXISTS "PerformanceReview_employeeId_reviewPeriod_key" ON "PerformanceReview"("employeeId", "reviewPeriod");
CREATE INDEX IF NOT EXISTS "PerformanceReview_employeeId_idx" ON "PerformanceReview"("employeeId");
CREATE INDEX IF NOT EXISTS "PerformanceReview_status_idx" ON "PerformanceReview"("status");

-- AddForeignKey
ALTER TABLE "PerformanceGoal" ADD CONSTRAINT "PerformanceGoal_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "PerformanceReview" ADD CONSTRAINT "PerformanceReview_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
