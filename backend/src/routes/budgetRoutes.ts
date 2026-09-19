import { Router } from 'express';
import { budgetController } from '../controllers/budgetController';
import { createBudgetValidator, updateBudgetValidator } from '../validators/budgetValidators';
import { validate } from '../middleware/validate';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/authorize';

const router = Router();
router.use(authenticate);

router.get('/dashboard-stats', budgetController.getDashboardStats);
router.get('/', budgetController.getAll);
router.post('/', authorize('admin', 'finance_officer'), createBudgetValidator, validate, budgetController.create);
router.get('/:id', budgetController.getById);
router.put('/:id', authorize('admin', 'finance_officer'), updateBudgetValidator, validate, budgetController.update);
router.delete('/:id', authorize('admin', 'finance_officer'), budgetController.delete);

export default router;
