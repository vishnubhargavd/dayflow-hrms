import { Router, Request, Response } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { sendSuccess } from '../../utils/response.util';

const router = Router();

router.use(authenticate);

router.get('/', (req: Request, res: Response) => {
  return sendSuccess(
    res,
    { owner: 'Abhinav', status: 'CONTRACT_READY' },
    'Attendance module endpoint skeleton — To be extended by Abhinav (feature/abhinav-attendance-ai)'
  );
});

export default router;
