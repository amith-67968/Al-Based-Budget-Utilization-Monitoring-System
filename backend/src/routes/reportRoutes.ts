import { Router } from 'express';
import { reportController } from '../controllers/reportController';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/authorize';

const router = Router();
router.use(authenticate);

router.get('/budget-utilization', authorize('admin', 'finance_officer', 'department_head'), reportController.getBudgetUtilization);
router.get('/expenditures', authorize('admin', 'finance_officer', 'department_head'), reportController.getExpenditures);
router.get('/alerts', authorize('admin', 'finance_officer'), reportController.getAlerts);

export default router;
