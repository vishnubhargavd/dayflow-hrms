# Dayflow HRMS — Performance & Optimization Rules

## 1. Mandatory Pagination for List Endpoints
- Every list endpoint MUST support pagination via query parameters `?page=1&limit=20`.
- Handled uniformly via `parsePaginationParams()` and `sendPaginated()`.
- Maximum limit capped at 100 records per request to prevent memory spikes.

## 2. Selective Field Fetching (`select` vs `include`)
- Developers MUST NOT issue unrestricted `findMany()` queries without explicit field selection.
- Example pattern in `employee.service.ts`:
  ```ts
  select: {
    id: true,
    firstName: true,
    lastName: true,
    department: { select: { name: true } }
  }
  ```
- This prevents transferring heavy unused columns or sensitive financial data over the network.

## 3. N+1 Query Elimination
- **Anti-Pattern (Prohibited)**:
  ```ts
  const employees = await prisma.employee.findMany();
  for (const emp of employees) {
    const attendance = await prisma.attendance.findMany({ where: { employeeId: emp.id } }); // N+1 queries!
  }
  ```
- **Approved Pattern**:
  Use relational joins or `in` filters:
  ```ts
  const employeesWithAttendance = await prisma.employee.findMany({
    include: { attendanceRecords: true }
  });
  ```

## 4. Database Indexing Strategy
- Indexes are added selectively for columns frequently appearing in `WHERE`, `JOIN`, `ORDER BY`, and `UNIQUE` constraints.
- Refer to [`docs/DATABASE.md`](./DATABASE.md) for full index justifications (`Attendance`, `LeaveRequest`, `LoginSequence`).
