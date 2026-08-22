# Dayflow HRMS — REST API Contract & Conventions

All API endpoints strictly follow RESTful conventions under the versioned base path:

`/api/v1/`

## Response Formats

### 1. Standard Success Response (`200 OK`, `201 Created`)

```json
{
  "success": true,
  "message": "Employee created successfully",
  "data": {
    "loginId": "OIJODO20260001",
    "email": "john.doe@dayflow.com",
    "temporaryPassword": "pX9!mK2#vL8z",
    "requiresPasswordChange": true
  },
  "timestamp": "2026-08-22T11:00:00.000Z"
}
```

### 2. Standard Paginated Response

```json
{
  "success": true,
  "message": "Employees retrieved successfully",
  "data": [...],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 145,
    "totalPages": 8
  },
  "timestamp": "2026-08-22T11:00:00.000Z"
}
```

### 3. Standard Error Response

```json
{
  "success": false,
  "message": "Validation failed: email: Invalid email address",
  "errorCode": "VALIDATION_ERROR",
  "timestamp": "2026-08-22T11:00:00.000Z",
  "path": "/api/v1/employees"
}
```

## Standard Error Codes

- `BAD_REQUEST` (400): Malformed input payload.
- `VALIDATION_ERROR` (400): Zod validation constraint violation.
- `UNAUTHORIZED` (401): Missing or invalid Bearer token.
- `FORBIDDEN` (403): Role or ownership permission failure (RBAC / IDOR).
- `NOT_FOUND` (404): Resource missing.
- `DUPLICATE_ENTRY` (409): Unique constraint violation.
- `INTERNAL_SERVER_ERROR` (500): Server error.

## Endpoint Directory

| Module | Endpoint | Method | Auth Required | Allowed Roles |
|---|---|---|---|---|
| Health | `/api/v1/health` | GET | Public | All |
| Auth | `/api/v1/auth/login` | POST | Public | All |
| Auth | `/api/v1/auth/change-password` | POST | Bearer JWT | All |
| Auth | `/api/v1/auth/me` | GET | Bearer JWT | All |
| Employees | `/api/v1/employees` | POST | Bearer JWT | ADMIN, HR |
| Employees | `/api/v1/employees` | GET | Bearer JWT | All |
| Attendance | `/api/v1/attendance/check-in` | POST | Bearer JWT | All Employees |
| Attendance | `/api/v1/attendance/check-out` | POST | Bearer JWT | All Employees |
| Attendance | `/api/v1/attendance/today` | GET | Bearer JWT | All Employees |
| Attendance | `/api/v1/attendance` | GET | Bearer JWT | All (EMPLOYEE scoped to self; ADMIN/HR all) |
| Attendance | `/api/v1/attendance/weekly` | GET | Bearer JWT | All (EMPLOYEE scoped to self; ADMIN/HR all) |
| Attendance | `/api/v1/attendance/monthly` | GET | Bearer JWT | All (EMPLOYEE scoped to self; ADMIN/HR all) |
| Attendance | `/api/v1/attendance/insights` | GET | Bearer JWT | All (Personal smart insights scoped to self) |
| Attendance | `/api/v1/attendance/insights/overview` | GET | Bearer JWT | ADMIN, HR |
| Attendance | `/api/v1/attendance/analytics` | GET | Bearer JWT | All (Personal metrics scoped to self) |
| Attendance | `/api/v1/attendance/analytics/overview` | GET | Bearer JWT | ADMIN, HR |
| Attendance | `/api/v1/attendance/analytics/departments` | GET | Bearer JWT | ADMIN, HR |
| Attendance | `/api/v1/attendance/analytics/trend` | GET | Bearer JWT | ADMIN, HR |
| Attendance | `/api/v1/attendance/analytics/low-attendance` | GET | Bearer JWT | ADMIN, HR |
| Leave | `/api/v1/leave/me/balances` | GET | Bearer JWT | All Employees (Scoped to self) |
| Leave | `/api/v1/leave/me/requests` | GET | Bearer JWT | All Employees (Scoped to self) |
| Leave | `/api/v1/leave/me/requests/:id` | GET | Bearer JWT | All Employees (Scoped to self) |
| Leave | `/api/v1/leave/me/requests` | POST | Bearer JWT | All Employees (Scoped to self) |
| Leave | `/api/v1/leave/me/requests/:id/cancel` | PATCH | Bearer JWT | All Employees (Scoped to self) |
| Leave | `/api/v1/leave/types` | GET | Bearer JWT | All Authenticated Users |
| Leave | `/api/v1/leave/types` | POST | Bearer JWT | ADMIN, HR |
| Leave | `/api/v1/leave/balances/allocate` | POST | Bearer JWT | ADMIN, HR |
| Leave | `/api/v1/leave/balances/:employeeId` | GET | Bearer JWT | ADMIN, HR |
| Leave | `/api/v1/leave/requests` | GET | Bearer JWT | ADMIN, HR |
| Leave | `/api/v1/leave/requests/:id/approve` | PATCH | Bearer JWT | ADMIN, HR |
| Leave | `/api/v1/leave/requests/:id/reject` | PATCH | Bearer JWT | ADMIN, HR |
| Payroll | `/api/v1/payroll` | GET | Bearer JWT | Joshith |
| Performance | `/api/v1/performance` | GET | Bearer JWT | Joshith |
| Recruitment | `/api/v1/recruitment` | GET | Bearer JWT | Joshith |
| Notifications | `/api/v1/notifications` | GET | Bearer JWT | Vishnu |
| Helpdesk | `/api/v1/helpdesk` | GET | Bearer JWT | Vishnu |
| Reports | `/api/v1/reports` | GET | Bearer JWT | Joshith |
| Audit Logs | `/api/v1/audit` | GET | Bearer JWT | ADMIN |

---

## Attendance Analytics Specifications

### Query Parameters
- `from` (`YYYY-MM-DD`): Optional start date filter (defaults to 30 days prior).
- `to` (`YYYY-MM-DD`): Optional end date filter (defaults to today).
- `threshold` (Number, 1-100): Used in `/low-attendance` (defaults to 80%).

### Calculation Formulas
1. **Attendance Rate (%)**:
   $$\text{attendanceRate} = \frac{\text{presentDays} + 0.5 \times \text{halfDays}}{\text{totalRecords}} \times 100$$
2. **Absenteeism Rate (%)**:
   $$\text{absenteeismRate} = \frac{\text{absentDays}}{\text{totalRecords}} \times 100$$
3. **Average Daily Working Hours**:
   $$\text{averageWorkingHours} = \frac{\text{totalWorkingHours}}{\text{presentDays} + \text{halfDays}}$$

### RBAC Summary
- `GET /api/v1/attendance/insights`: Accessible to all authenticated users (personal contextual insights).
- `GET /api/v1/attendance/insights/overview`: `ADMIN`, `HR` only (organization & department intelligence).
- `GET /api/v1/attendance/analytics`: Accessible to all authenticated users (strictly scoped to own `employeeId`).
- `GET /api/v1/attendance/analytics/overview`: `ADMIN`, `HR` only.
- `GET /api/v1/attendance/analytics/departments`: `ADMIN`, `HR` only.
- `GET /api/v1/attendance/analytics/trend`: `ADMIN`, `HR` only.
- `GET /api/v1/attendance/analytics/low-attendance`: `ADMIN`, `HR` only.

---

## Smart HR Intelligence & Insights Engine

The Smart Insights layer analyzes database records locally (without third-party or external AI APIs) and surfaces contextual cards on employee & HR dashboards:

### Personal Employee Insights
- **Low Attendance Alert** (`WARNING`): Triggered when attendance rate $< 80\%$.
- **Perfect Attendance** (`SUCCESS`): Triggered when attendance rate is $100\%$ over $\ge 5$ recorded days.
- **Period Comparison** (`SUCCESS` / `WARNING`): Measures month-over-month attendance rate delta ($\Delta \ge +1\%$ improvement or $\Delta \le -2\%$ dip).
- **Overtime Surge** (`WARNING`): Triggered when monthly overtime $\ge 10.0$ hours.
- **Department Benchmark** (`SUCCESS`): Highlights when an employee's attendance is above the department average.

### Organization & HR Insights
- **Workforce Watchlist** (`WARNING`): Aggregates count of employees with attendance $< 80\%$.
- **Top Department Attendance** (`SUCCESS`): Highlights top-performing departments ($\ge 85\%$).
- **Department Attendance Concern** (`WARNING`): Flags lowest-performing department $(< 80\%$).
- **Department Overtime Surge** (`INFO`): Detects departments with $\ge 20$ hours of aggregate overtime.
