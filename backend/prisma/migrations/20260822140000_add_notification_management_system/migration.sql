-- Incremental Migration for Notification Management System

-- AlterTable: Add readAt column to Notification
ALTER TABLE "Notification" ADD COLUMN "readAt" TIMESTAMP(3);

-- CreateIndex: Add performance indexes for notifications
CREATE INDEX "Notification_userId_createdAt_idx" ON "Notification"("userId", "createdAt");

-- CreateIndex: Add index for filtering notifications by type
CREATE INDEX "Notification_type_idx" ON "Notification"("type");
