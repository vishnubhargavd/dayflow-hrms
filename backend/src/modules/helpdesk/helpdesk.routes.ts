import { Router, Request, Response } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { sendSuccess } from '../../utils/response.util';

const router = Router();

router.use(authenticate);

router.get('/', (req: Request, res: Response) => {
  return sendSuccess(
    res,
    { owner: 'Vishnu', status: 'CONTRACT_READY' },
    'Helpdesk module endpoint skeleton — To be extended by Vishnu (feature/vishnu-leave-helpdesk)'
  );
});

export default router;
