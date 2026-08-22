# Dayflow HRMS — Payroll Module Documentation

## Overview

The Payroll Module provides production-grade salary management, component structure assignments, historical salary revision tracking, period payroll processing, payslip generation, and strict IDOR/RBAC security protections.

---

## Domain Architecture & Workflow

```text
Employee
   ↓
Salary Structure (Base Salary + Components)
   ↓
Salary History (Triggered on revision)
   ↓
Payroll Processing (Period check & calculations)
   ↓
Payslip Generation (Detailed breakdown)
```

---

## Database Models & Relationships

- **`SalaryComponent`**: Defines individual earnings (HRA, Transport, Bonus) or deductions (Tax, Insurance).
- **`SalaryStructure`**: Links an `Employee` to their active base salary and component assignments (`SalaryStructureItem`).
- **`SalaryHistory`**: Tracks historical revisions when an employee's salary structure changes, storing previous vs. new base and net salaries, effective dates, reasons, and user audit.
- **`PayrollRecord`**: Represents the calculated salary for a specific month/year cycle. Protected by a composite unique constraint `@@unique([employeeId, month, year])` to prevent duplicate processing.
- **`Payslip`**: Linked 1-to-1 with `PayrollRecord`. Contains serialized breakdown JSON of basic salary, allowances, deductions, and attendance metrics.

---

## Calculation Rules

```text
Total Earnings = SUM(Component Amounts where type = EARNING)
Gross Salary   = Base Salary + Total Earnings

Total Deductions = SUM(Component Amounts where type = DEDUCTION)
Net Salary       = MAX(0, Gross Salary - Total Deductions)
```

---

## API Endpoints

### Employee Self-Service (Authenticated Employee)
- `GET /api/v1/payroll/me` — Current salary structure and latest payroll status for logged-in user.
- `GET /api/v1/payroll/me/history` — Personal payroll history (paginated).
- `GET /api/v1/payroll/me/payslips` — List of personal payslips.
- `GET /api/v1/payroll/me/payslips/:id` — Detailed payslip (enforces ownership: `payslip.employeeId === req.user.employeeId`).

### Admin / HR Payroll Management (`Role.ADMIN`, `Role.HR`)
- `POST /api/v1/payroll/components` — Create salary component.
- `GET /api/v1/payroll/components` — List all components.
- `PUT /api/v1/payroll/components/:id` — Update salary component.
- `POST /api/v1/payroll/salary-structure` — Assign/update employee salary structure (creates `SalaryHistory`).
- `GET /api/v1/payroll/salary-structure/:employeeId` — Get salary structure for specific employee.
- `GET /api/v1/payroll/history/:employeeId` — Get salary history for specific employee.
- `POST /api/v1/payroll/process` — Process payroll and generate payslip.
- `GET /api/v1/payroll/records` — List all payroll records.
- `PATCH /api/v1/payroll/records/:id/status` — Update status (`DRAFT`, `PROCESSING`, `APPROVED`, `PAID`).

---

## Security & IDOR Protections

1. **Self-Service Endpoint Protection**: Employees cannot query arbitrary employee IDs via `/me/*` routes. Identity is strictly extracted from the verified JWT payload (`req.user.employeeId`).
2. **Administrative RBAC**: All write and cross-employee read routes are guarded by `authorize(Role.ADMIN, Role.HR)`.
3. **Data Sanitization**: Sensitive financial metrics are omitted from general employee directory listings.

---

## Attendance & Leave Integration Contracts

- **Attendance Integration**: The payroll processing service optionally accepts `workingDays`, `presentDays`, `paidLeaveDays`, `unpaidLeaveDays`, `absentDays`, and `overtimeHours`. These metrics are embedded cleanly into the payslip breakdown JSON without altering Abhinav's Attendance module.
- **Leave Integration**: Unpaid leave deductions can be passed cleanly to adjust payroll components without modifying Vishnu's Leave module.
