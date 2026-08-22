# Dayflow HRMS — Developer Integration Rules & Workflow

## Git Collaboration & Branch Policy

1. **Branch Naming**:
   - Ameer: `feature/ameer-foundation-auth`
   - Abhinav: `feature/abhinav-attendance-ai`
   - Vishnu: `feature/vishnu-leave-helpdesk`
   - Joshith: `feature/joshith-payroll-performance-recruitment`
2. **Main Protection**: No developer pushes directly to `main`. All changes enter `main` via reviewed Pull Requests.
3. **Pull Request Protocol**:
   - Pull latest `main` into your feature branch before requesting review:
     ```bash
     git fetch origin main
     git rebase origin/main
     ```
   - Run tests (`npm test`) and build (`npm run build`) before opening a PR.

## Code Standards & Architecture Rules

1. **Layer Enforcement**: `Route -> Controller -> Service -> Prisma`. Do not bypass layers.
2. **Error Handling**: Throw `AppError(message, statusCode, errorCode)` in services. Never return raw `null` without error handling for invalid operations.
3. **Response Helpers**: Controllers must return responses using `sendSuccess()`, `sendPaginated()`, or pass errors to `next(error)`.
4. **Validation**: Validate all incoming data using Zod middleware before controller execution.
5. **No Independent Schemas**: All database models must be declared in `backend/prisma/schema.prisma`.
