import { Router, Request, Response } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { sendSuccess } from '../../utils/response.util';

const router = Router();

router.use(authenticate);

router.get('/', (req: Request, res: Response) => {
  return sendSuccess(
    res,
    { owner: 'Joshith', status: 'CONTRACT_READY' },
    'Performance module endpoint skeleton — To be extended by Joshith (feature/joshith-payroll-performance-recruitment)'
  );
});

export default router;
