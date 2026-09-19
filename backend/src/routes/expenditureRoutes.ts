import { Router } from 'express';
import { expenditureController } from '../controllers/expenditureController';
import { createExpenditureValidator } from '../validators/expenditureValidators';
import { validate } from '../middleware/validate';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/authorize';

const router = Router();
router.use(authenticate);

router.get('/recent', expenditureController.getRecent);
router.get('/', expenditureController.getAll);
router.post('/', authorize('admin', 'finance_officer', 'department_head'), createExpenditureValidator, validate, expenditureController.create);
router.get('/:id', expenditureController.getById);
router.put('/:id', authorize('admin', 'finance_officer'), createExpenditureValidator, validate, expenditureController.update);
router.delete('/:id', authorize('admin', 'finance_officer'), expenditureController.delete);

export default router;
