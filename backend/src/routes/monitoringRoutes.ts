import { Router } from 'express';
import { monitoringController } from '../controllers/monitoringController';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/authorize';

const router = Router();
router.use(authenticate);

router.get('/overview', monitoringController.getOverview);
router.post('/run', authorize('admin', 'finance_officer'), monitoringController.runMonitoring);
router.get('/department/:id', monitoringController.getDepartmentMonitoring);

export default router;
