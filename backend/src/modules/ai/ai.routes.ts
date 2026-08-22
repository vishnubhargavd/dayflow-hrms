import { Router, Request, Response } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { sendSuccess } from '../../utils/response.util';

const router = Router();

// 1. Authenticate requesting user
router.use(authenticate);

// POST /api/v1/ai/query — Secure AI Assistant query bridge
router.post('/query', (req: Request, res: Response) => {
  const user = req.user!;
  
  // AI Architecture Rule Contract:
  // - Role determination: user.role (ADMIN, HR, EMPLOYEE)
  // - Context scoping: EMPLOYEE accesses only their own leave/attendance records; ADMIN/HR access aggregate insights.
  return sendSuccess(
    res,
    {
      owner: 'Abhinav',
      status: 'CONTRACT_READY',
      requestingUser: {
        id: user.userId,
        role: user.role,
        employeeId: user.employeeId,
      },
      securityBoundary: 'AI query layer MUST filter context via Prisma services based on user.role and user.employeeId before forwarding to AI models.',
    },
    'AI Assistant endpoint bridge skeleton — To be completed by Abhinav (feature/abhinav-attendance-ai)'
  );
});

export default router;
