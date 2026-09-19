import { Router } from 'express';
import { auditController } from '../controllers/auditController';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/authorize';

const router = Router();
router.use(authenticate);
router.use(authorize('admin'));

router.get('/', auditController.getLogs);

export default router;
