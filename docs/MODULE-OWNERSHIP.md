# Dayflow HRMS — Team Module Ownership & Git Branch Matrix

## Module Ownership Allocation

```text
               DAYFLOW HRMS BACKEND FOUNDATION
                             │
     ┌───────────────────────┼───────────────────────┐
     │                       │                       │
   AMEER                  ABHINAV                 VISHNU                 JOSHITH
 (Foundation)           (Attendance)             (Leave)                (Payroll)
```

### 1. Ameer — Lead Backend Architect
- **Git Branch**: `feature/ameer-foundation-auth`
- **Modules Owned**:
  - `auth`: JWT, Authentication, Login, Password Reset
  - `employees`: User Management, Employee Profiles, Login ID Generator, Department/Designation
  - `security`: RBAC Middleware, IDOR Protection, Password Hashing
  - `audit`: System Audit Logs, Login Attempt Tracking
  - `foundation`: Express App, Prisma Schema, Utilities, Database Singleton

### 2. Abhinav — Backend Developer
- **Git Branch**: `feature/abhinav-attendance-ai`
- **Modules Owned**:
  - `attendance`: Check-in/out, Work Schedules, Attendance Corrections, Overtime
  - `analytics`: Attendance analytics & reporting helpers
  - `ai`: AI HR Assistant backend integration (`/api/v1/ai/*`)

### 3. Vishnu — Backend Developer
- **Git Branch**: `feature/vishnu-leave-helpdesk`
- **Modules Owned**:
  - `leave`: Leave Requests, Leave Balances, Approvals
  - `notifications`: Notification dispatch & in-app alerts
  - `helpdesk`: HR Helpdesk & Ticketing System

### 4. Joshith — Backend Developer
- **Git Branch**: `feature/joshith-payroll-performance-recruitment`
- **Modules Owned**:
  - `payroll`: Salary Components, Payslip Generation
  - `performance`: Goal Tracking, Appraisal Reviews
  - `recruitment`: Job Requisitions, Candidate Pipelines
  - `onboarding`: Employee Onboarding Checklists
  - `reports`: HR Analytics Export Reports

## Integration Rules Across Modules

1. **Schema Authority**: `backend/prisma/schema.prisma` is the single source of truth. No developer may add competing database schemas.
2. **Import Rule**: Feature modules may import models and Prisma client from `src/config/database.ts` and middleware from `src/middleware/`.
3. **Cross-Module Service Calls**: If module A needs data from module B (e.g., Payroll calculating payable days from Attendance), call the service method in module B rather than executing ad-hoc database queries against module B's tables.
