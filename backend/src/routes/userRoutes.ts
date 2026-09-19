import { Router } from 'express';
import { userController } from '../controllers/userController';
import { createUserValidator, updateUserValidator } from '../validators/userValidators';
import { validate } from '../middleware/validate';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/authorize';

const router = Router();
router.use(authenticate);

router.get('/', authorize('admin'), userController.getAll);
router.post('/', authorize('admin'), createUserValidator, validate, userController.create);
router.get('/:id', authorize('admin'), userController.getById);
router.put('/:id', authorize('admin'), updateUserValidator, validate, userController.update);
router.patch('/:id/status', authorize('admin'), userController.updateStatus);

export default router;
