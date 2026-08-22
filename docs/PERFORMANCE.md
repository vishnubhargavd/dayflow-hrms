# Dayflow HRMS — Performance Management Documentation

## Overview

The Performance Management module allows employees to track goal progress, submit self-assessments, and view performance reviews. HR Managers and Administrators can create/assign goals, initiate review cycles, evaluate reviews with ratings (1.0–5.0) and feedback, and monitor overall performance history.

---

## Domain Architecture & Workflow

```text
Employee
   ↓
Assigned Goals (Progress 0–100%, Auto-completes at 100%)
   ↓
Performance Review Cycle (Initiated by HR/Admin)
   ↓
Employee Self-Assessment (Status: SELF_ASSESSMENT / UNDER_REVIEW)
   ↓
Manager/HR Evaluation (Rating 1.0–5.0, Feedback, Strengths, Improvement Areas)
   ↓
Performance History (Status: COMPLETED)
```

---

## Database Models & Relationships

- **`PerformanceGoal`**: Represents an employee goal.
  - Fields: `id`, `employeeId`, `title`, `description`, `target`, `progress` (0–100%), `status` (`GoalStatus`), `startDate`, `dueDate`, `createdById`, timestamps.
  - Relation: `Employee`, `User` (`createdBy`).
- **`PerformanceReview`**: Represents a performance evaluation cycle.
  - Fields: `id`, `employeeId`, `reviewerId`, `reviewPeriod`, `reviewDate`, `overallRating` (1.0–5.0), `status` (`ReviewStatus`), `selfAssessment`, `reviewerFeedback`, `strengths`, `improvementAreas`, timestamps.
  - Unique Constraint: `@@unique([employeeId, reviewPeriod])` prevents duplicate review cycles.

---

## API Endpoints

### Employee Self-Service (`/api/v1/performance/me/*`)
- `GET /api/v1/performance/me/goals` — List personal goals.
- `PATCH /api/v1/performance/me/goals/:id/progress` — Update goal progress (0–100%).
- `GET /api/v1/performance/me/reviews` — List personal reviews.
- `GET /api/v1/performance/me/reviews/:id` — Get details of a specific personal review.
- `PATCH /api/v1/performance/me/reviews/:id/self-assessment` — Submit/update self-assessment.

### Admin / HR Management (`/api/v1/performance/*`)
- `POST /api/v1/performance/goals` — Assign goal to an employee (`Role.ADMIN`, `Role.HR`).
- `GET /api/v1/performance/goals` — List all goals across employees.
- `PUT /api/v1/performance/goals/:id` — Update goal details or status.
- `POST /api/v1/performance/reviews` — Create a review period for an employee.
- `GET /api/v1/performance/reviews` — List all reviews.
- `GET /api/v1/performance/history/:employeeId` — View performance history for an employee.
- `PATCH /api/v1/performance/reviews/:id/evaluation` — Submit evaluation rating (1.0–5.0), feedback, and mark `COMPLETED`.

---

## Validation & Business Rules

1. **Progress Bounds**: Goal progress must be between 0% and 100%. Reaching 100% automatically sets status to `COMPLETED`.
2. **Rating Bounds**: Review overall rating must be between 1.0 and 5.0.
3. **IDOR & Security**: Identity extracted strictly from JWT (`req.user.employeeId`). Employees can only update progress/self-assessment on their own records.
