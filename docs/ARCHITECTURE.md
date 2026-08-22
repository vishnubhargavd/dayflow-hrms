# Dayflow HRMS — Backend System Architecture

## Architectural Philosophy

Dayflow HRMS is built using a clean, modular, layered backend architecture designed to support a multi-developer team (Ameer, Abhinav, Vishnu, Joshith) building in parallel without component interference or cross-module coupling.

```text
HTTP Request
     ↓
Express Router (src/modules/*/*.routes.ts)
     ↓
Authentication Middleware (src/middleware/auth.middleware.ts)
     ↓
Authorization / RBAC Middleware (src/middleware/role.middleware.ts)
     ↓
Validation Middleware (src/middleware/validation.middleware.ts)
     ↓
Controller Layer (src/modules/*/*.controller.ts)
     ↓
Service Layer / Business Rules (src/modules/*/*.service.ts)
     ↓
Prisma Client / Database Layer (src/config/database.ts)
     ↓
PostgreSQL Database
```

## Core Layer Responsibilities

### 1. Route Layer (`*.routes.ts`)
- Defines HTTP endpoints, methods, and URL parameters under `/api/v1/`.
- Mounts middleware chains (`authenticate`, `authorize(roles)`, `validateBody(schema)`).
- **Rule**: Routes MUST NOT contain business logic or database queries.

### 2. Controller Layer (`*.controller.ts`)
- Extracts HTTP request data (`body`, `params`, `query`, `req.user`).
- Delegates business execution to the Service Layer.
- Formats standard HTTP JSON responses using `sendSuccess()`, `sendPaginated()`, or delegates errors to `next(error)`.
- **Rule**: Controllers MUST NOT execute direct Prisma queries or complex business math.

### 3. Service Layer (`*.service.ts`)
- Contains all domain logic, business rules, calculations, and transactional database logic via Prisma.
- Performs business-level ownership and authorization checks (e.g. IDOR protection).
- **Rule**: Services return clean JavaScript/TypeScript domain objects or throw typed `AppError` exceptions.

### 4. Database Access Layer (`src/config/database.ts` & Prisma)
- Uses a singleton `PrismaClient` instance with connection pooling.
- Enforces strict foreign keys, composite indexes, and unique constraints at the PostgreSQL database level.

## Module Boundaries

The backend is structured into 12 distinct domain modules located under `src/modules/`:

| Module | Purpose | Owner |
|---|---|---|
| `auth` | Authentication, JWT, Login, Password Change | Ameer |
| `employees` | Employee Directory, Profiles, Creation, Departments | Ameer |
| `attendance` | Daily Check-in/out, Work Schedules, Corrections | Abhinav |
| `leave` | Leave Requests, Balances, Approvals | Vishnu |
| `payroll` | Component Setup, Monthly Payslips | Joshith |
| `performance` | Goals, Performance Reviews | Joshith |
| `recruitment` | Job Postings, Candidate Tracking, Onboarding | Joshith |
| `notifications` | In-app notifications & events | Vishnu |
| `helpdesk` | Internal HR Ticketing System | Vishnu |
| `reports` | System Analytics & Export Reports | Joshith |
| `ai` | AI Assistant Context Bridge & Queries | Abhinav |
| `audit` | Security Audit & Login Attempt Logging | Ameer |
