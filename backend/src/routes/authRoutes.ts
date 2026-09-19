import { Router } from 'express';
import { authController } from '../controllers/authController';
import { loginValidator } from '../validators/authValidators';
import { validate } from '../middleware/validate';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/login', loginValidator, validate, authController.login);
router.get('/me', authenticate, authController.getProfile);

export default router;
