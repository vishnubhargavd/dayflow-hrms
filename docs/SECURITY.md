# Dayflow HRMS — Security Architecture & Guidelines

## 1. Password Hashing & Credentials Handling
- All passwords (permanent and temporary) are hashed using `bcrypt` with a cost factor of `10`.
- **Zero Plaintext Storage**: Plaintext passwords are NEVER stored in the database, cached in memory, or logged.
- **Temporary Password Lifecycle**:
  1. System generates a 12-character cryptographically random password (`generateTempPassword()`).
  2. Password is immediately hashed and stored.
  3. Account is marked with `requiresPasswordChange = true` and `accountStatus = PENDING_FIRST_LOGIN`.
  4. Temporary password is returned ONCE in the employee creation HTTP response payload for HR transmission.
  5. User is forced to change password upon initial login (`/api/v1/auth/change-password`).

## 2. JWT Authentication Architecture
- Tokens are signed using HMAC SHA-256 (`JWT_SECRET`) with configurable expiration (`JWT_EXPIRES_IN=8h`).
- Tokens contain safe user metadata: `{ userId, loginId, email, role, employeeId, requiresPasswordChange }`.
- Sent via `Authorization: Bearer <token>` HTTP header.

## 3. Server-Side RBAC (Role-Based Access Control)
- System roles: `ADMIN`, `HR`, `EMPLOYEE`.
- Enforced declaratively in route definitions via `authorize(Role.ADMIN, Role.HR)`.
- Request is denied with HTTP 403 Forbidden if user role is insufficient.

## 4. IDOR / BOLA Protection (Insecure Direct Object Reference)
- Endpoint `GET /api/v1/employees/:id`:
  - Controller passes `req.user` to `getEmployeeByIdService()`.
  - If `req.user` is an `EMPLOYEE` viewing another employee's record, sensitive financial fields (`bankName`, `accountNumber`, `ifscCode`, `panNumber`) are stripped from the response object.
  - If `req.user` is `ADMIN`, `HR`, or the employee themselves (`isSelf`), full details are provided.

## 5. Parameterized Queries & SQL Injection Prevention
- All database operations execute through Prisma ORM, which automatically parameterizes SQL queries.
- Direct string concatenation into SQL statements is prohibited.

## 6. Input Validation
- Every incoming HTTP payload (body, query, params) is validated using Zod schemas before hitting controllers.
