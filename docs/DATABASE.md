# Dayflow HRMS — Database Schema & Data Dictionary

## Schema Overview

The database is built on PostgreSQL 16 managed exclusively via Prisma ORM (`backend/prisma/schema.prisma`). The design follows strict 3NF (Third Normal Form) normalization to prevent data redundancy and anomalies.

## Primary Entities & Relationships

```text
User (1) <────> (1) Employee
                      │
                      ├─── (N) ─── Attendance
                      ├─── (N) ─── LeaveRequest
                      ├─── (N) ─── LeaveBalance
                      ├─── (N) ─── Payslip
                      ├─── (N) ─── PerformanceReview
                      ├─── (N) ─── Document
                      ├─── (N) ─── HelpdeskRequest
                      └─── (N) ─── Subordinates (Self-Referential Manager FK)
```

## Foreign Key Cascade Policies

- `User -> Employee`: `ON DELETE CASCADE` — Deleting a user purges the employee profile cleanly.
- `Employee -> Department`: `ON DELETE SET NULL` — Removing a department preserves employee records while clearing assignment.
- `Employee -> Designation`: `ON DELETE SET NULL` — Removing a designation preserves employee records.
- `Employee -> Attendance / Leave / Payslip`: `ON DELETE CASCADE` — Historical logs belong to employee lifecycle.

---

## Index Analysis & Justification

Every index in the database is explicitly designed and justified to satisfy critical performance and data integrity constraints:

### 1. `Attendance(employeeId, date)` — Composite Unique Index
- **Prisma Schema**: `@@unique([employeeId, date])`
- **Fields Supported**: `id`, `employeeId`, `date`, `checkIn`, `checkOut`, `status` (`PRESENT`, `ABSENT`, `HALF_DAY`, `LEAVE`), `workHours`, `overtimeHours`, `createdAt`, `updatedAt`.
- **Justification**:
  1. **Data Integrity**: Guarantees at the database level that an employee cannot have multiple conflicting attendance records for the same calendar date.
  2. **Query Performance**: Accelerates daily attendance lookup queries by employee (`SELECT * FROM "Attendance" WHERE "employeeId" = $1 AND "date" = $2`) to `O(log N)` complexity.

### 2. `Attendance(status)` & `Attendance(date)` — Indexes
- **Prisma Schema**: `@@index([status])`, `@@index([date])`
- **Justification**:
  1. **Query Filtering**: Accelerates date-range queries (`WHERE "date" >= $1 AND "date" <= $2`) and status-specific lookups (`WHERE "status" = 'ABSENT'`).

### 3. `LeaveRequest(status)` — Index
- **Prisma Schema**: `@@index([status])`
- **Justification**:
  1. **HR Approval Workflow**: HR Managers frequently query for pending leave requests (`WHERE status = 'PENDING'`). Without this index, HR dashboards would require a full table scan across tens of thousands of historical leave requests.

### 4. `LeaveRequest(employeeId, createdAt)` — Composite Index
- **Prisma Schema**: `@@index([employeeId, createdAt])`
- **Justification**:
  1. **Employee Leave History**: Employees frequently load their personal leave history ordered by recency. This composite index satisfies index-only scans for paginated personal queries.

### 5. `LeaveBalance(employeeId, leaveTypeId, year)` — Composite Unique Index
- **Prisma Schema**: `@@unique([employeeId, leaveTypeId, year])`
- **Justification**:
  1. **Balance Integrity**: Prevents duplicate yearly leave balance allocations for the same leave type for any given employee.

### 6. `LoginSequence(companyCode, year)` — Composite Unique Index
- **Prisma Schema**: `@@unique([companyCode, year])`
- **Justification**:
  1. **Concurrency Control**: Powers atomic sequence increments during Login ID generation (`OIJODO20260001`), ensuring multi-threaded employee creation requests generate non-conflicting Login IDs.
