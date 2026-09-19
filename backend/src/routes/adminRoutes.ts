import { Router } from 'express';
import { adminController } from '../controllers/adminController';
import { createThresholdRuleValidator } from '../validators/thresholdValidators';
import { validate } from '../middleware/validate';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/authorize';

const router = Router();
router.use(authenticate);
router.use(authorize('admin'));

router.get('/rules', adminController.getRules);
router.post('/rules', createThresholdRuleValidator, validate, adminController.createRule);
router.put('/rules/:id', createThresholdRuleValidator, validate, adminController.updateRule);

export default router;
