# Dayflow HRMS — Human Resource Management System

Dayflow is a modern, modular, scalable Human Resource Management System (HRMS) built on a backend-first architecture.

## Team Ownership & Branch Structure

- **Main Branch**: `main`
- **Ameer**: `feature/ameer-foundation-auth` — Backend Architecture, Auth, RBAC, User/Employee Management, Profiles, Security, Audit Logs
- **Abhinav**: `feature/abhinav-attendance-ai` — Attendance, Check-in/out, Working Hours, Analytics, AI HR Assistant
- **Vishnu**: `feature/vishnu-leave-helpdesk` — Leave/Time Off, Balances, Approvals, Notifications, Helpdesk
- **Joshith**: `feature/joshith-payroll-performance-recruitment` — Payroll, Payslips, Performance, Recruitment, Onboarding, Reports.

## Technology Stack

- **Runtime**: Node.js v25+
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL 16
- **ORM**: Prisma ORM
- **Authentication**: JWT + bcrypt
- **Validation**: Zod
- **API Standard**: RESTful `/api/v1`

## Quick Start (Backend)

```bash
cd backend
npm install
cp .env.example .env
# Start PostgreSQL (via Docker or local instance)
docker-compose up -d
npx prisma migrate dev --name init
npx prisma db seed
npm run dev
```

For full integration rules and architectural documentation, refer to the [`docs/`](./docs) directory.
