-- Migration: Add Payroll Management Module (SalaryComponent, SalaryStructure, SalaryHistory, PayrollRecord, Payslip)

-- CreateEnum
CREATE TYPE "SalaryComponentType" AS ENUM ('EARNING', 'DEDUCTION');

-- AlterTable: SalaryComponent (previously created as stub in initial migration)
ALTER TABLE "SalaryComponent"
  ALTER COLUMN "type" TYPE "SalaryComponentType" USING "type"::"SalaryComponentType",
  ADD COLUMN IF NOT EXISTS "description" TEXT,
  ADD COLUMN IF NOT EXISTS "isActive" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable: SalaryStructure
CREATE TABLE IF NOT EXISTS "SalaryStructure" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "baseSalary" DOUBLE PRECISION NOT NULL,
    "effectiveDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SalaryStructure_pkey" PRIMARY KEY ("id")
);

-- CreateTable: SalaryStructureItem
CREATE TABLE IF NOT EXISTS "SalaryStructureItem" (
    "id" TEXT NOT NULL,
    "salaryStructureId" TEXT NOT NULL,
    "salaryComponentId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SalaryStructureItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable: SalaryHistory
CREATE TABLE IF NOT EXISTS "SalaryHistory" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "previousBaseSalary" DOUBLE PRECISION,
    "newBaseSalary" DOUBLE PRECISION NOT NULL,
    "previousNetSalary" DOUBLE PRECISION,
    "newNetSalary" DOUBLE PRECISION NOT NULL,
    "effectiveDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reason" TEXT NOT NULL,
    "changedById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SalaryHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable: PayrollRecord
CREATE TABLE IF NOT EXISTS "PayrollRecord" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "baseSalary" DOUBLE PRECISION NOT NULL,
    "totalEarnings" DOUBLE PRECISION NOT NULL,
    "totalDeductions" DOUBLE PRECISION NOT NULL,
    "grossSalary" DOUBLE PRECISION NOT NULL,
    "netSalary" DOUBLE PRECISION NOT NULL,
    "status" "PayrollStatus" NOT NULL DEFAULT 'DRAFT',
    "paymentDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PayrollRecord_pkey" PRIMARY KEY ("id")
);

-- AlterTable: Payslip (previously created as stub in initial migration)
ALTER TABLE "Payslip" ADD COLUMN IF NOT EXISTS "payrollRecordId" TEXT NOT NULL;
ALTER TABLE "Payslip" ADD COLUMN IF NOT EXISTS "payslipNumber" TEXT NOT NULL;
ALTER TABLE "Payslip" ADD COLUMN IF NOT EXISTS "breakdownJson" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "SalaryComponent_name_key" ON "SalaryComponent"("name");
CREATE UNIQUE INDEX IF NOT EXISTS "SalaryStructure_employeeId_key" ON "SalaryStructure"("employeeId");
CREATE INDEX IF NOT EXISTS "SalaryStructure_employeeId_idx" ON "SalaryStructure"("employeeId");
CREATE UNIQUE INDEX IF NOT EXISTS "SalaryStructureItem_salaryStructureId_salaryComponentId_key" ON "SalaryStructureItem"("salaryStructureId", "salaryComponentId");
CREATE INDEX IF NOT EXISTS "SalaryHistory_employeeId_createdAt_idx" ON "SalaryHistory"("employeeId", "createdAt");
CREATE UNIQUE INDEX IF NOT EXISTS "PayrollRecord_employeeId_month_year_key" ON "PayrollRecord"("employeeId", "month", "year");
CREATE INDEX IF NOT EXISTS "PayrollRecord_month_year_idx" ON "PayrollRecord"("month", "year");
CREATE INDEX IF NOT EXISTS "PayrollRecord_status_idx" ON "PayrollRecord"("status");
CREATE UNIQUE INDEX IF NOT EXISTS "Payslip_payrollRecordId_key" ON "Payslip"("payrollRecordId");
CREATE UNIQUE INDEX IF NOT EXISTS "Payslip_payslipNumber_key" ON "Payslip"("payslipNumber");
CREATE INDEX IF NOT EXISTS "Payslip_employeeId_month_year_idx" ON "Payslip"("employeeId", "month", "year");

-- AddForeignKey
ALTER TABLE "SalaryStructure" ADD CONSTRAINT "SalaryStructure_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SalaryStructureItem" ADD CONSTRAINT "SalaryStructureItem_salaryStructureId_fkey" FOREIGN KEY ("salaryStructureId") REFERENCES "SalaryStructure"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SalaryStructureItem" ADD CONSTRAINT "SalaryStructureItem_salaryComponentId_fkey" FOREIGN KEY ("salaryComponentId") REFERENCES "SalaryComponent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SalaryHistory" ADD CONSTRAINT "SalaryHistory_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SalaryHistory" ADD CONSTRAINT "SalaryHistory_changedById_fkey" FOREIGN KEY ("changedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PayrollRecord" ADD CONSTRAINT "PayrollRecord_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payslip" ADD CONSTRAINT "Payslip_payrollRecordId_fkey" FOREIGN KEY ("payrollRecordId") REFERENCES "PayrollRecord"("id") ON DELETE CASCADE ON UPDATE CASCADE;
