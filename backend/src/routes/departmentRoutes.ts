import { Router } from 'express';
import { departmentController } from '../controllers/departmentController';
import { createDepartmentValidator } from '../validators/departmentValidators';
import { validate } from '../middleware/validate';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/authorize';

const router = Router();
router.use(authenticate);

router.get('/', departmentController.getAll);
router.post('/', authorize('admin'), createDepartmentValidator, validate, departmentController.create);
router.get('/:id', departmentController.getById);
router.put('/:id', authorize('admin'), createDepartmentValidator, validate, departmentController.update);

export default router;
