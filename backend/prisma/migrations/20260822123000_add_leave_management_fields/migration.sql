-- Incremental Migration for Leave & Time-Off Management

-- AlterTable: Add description and isActive status to LeaveType
ALTER TABLE "LeaveType" ADD COLUMN "description" TEXT,
ADD COLUMN "isActive" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable: Add reviewerComment field to LeaveRequest
ALTER TABLE "LeaveRequest" ADD COLUMN "reviewerComment" TEXT;

-- CreateIndex: Add performance index for date range searches on LeaveRequest
CREATE INDEX "LeaveRequest_startDate_endDate_idx" ON "LeaveRequest"("startDate", "endDate");

-- CreateIndex: Add index for filtering LeaveRequests by leaveTypeId
CREATE INDEX "LeaveRequest_leaveTypeId_idx" ON "LeaveRequest"("leaveTypeId");
