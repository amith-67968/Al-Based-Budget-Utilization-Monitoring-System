import { Router } from 'express';
import { alertController } from '../controllers/alertController';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/authorize';

const router = Router();
router.use(authenticate);

router.get('/stats', alertController.getStats);
router.get('/recent', alertController.getRecent);
router.get('/', alertController.getAll);
router.get('/:id', alertController.getById);
router.patch('/:id/status', authorize('admin', 'finance_officer'), alertController.updateStatus);

export default router;
