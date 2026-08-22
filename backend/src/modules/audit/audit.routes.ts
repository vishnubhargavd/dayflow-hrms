import { Router, Request, Response, NextFunction } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { authorize } from '../../middleware/role.middleware';
import { getAuditLogsService } from './audit.service';
import { sendPaginated } from '../../utils/response.util';
import { Role } from '@prisma/client';

const router = Router();

router.use(authenticate);
router.use(authorize(Role.ADMIN));

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { data, meta } = await getAuditLogsService(req.query);
    return sendPaginated(res, data, meta, 'Audit logs retrieved successfully');
  } catch (error) {
    return next(error);
  }
});

export default router;
