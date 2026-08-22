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
| Payroll | `/api/v1/payroll` | GET | Bearer JWT | Joshith |
| Performance | `/api/v1/performance` | GET | Bearer JWT | Joshith |
| Recruitment | `/api/v1/recruitment` | GET | Bearer JWT | Joshith |
| Notifications | `/api/v1/notifications` | GET | Bearer JWT | Vishnu |
| Helpdesk | `/api/v1/helpdesk` | GET | Bearer JWT | Vishnu |
| Reports | `/api/v1/reports` | GET | Bearer JWT | Joshith |
| AI Assistant | `/api/v1/ai/query` | POST | Bearer JWT | Abhinav |
| Audit Logs | `/api/v1/audit` | GET | Bearer JWT | ADMIN |
