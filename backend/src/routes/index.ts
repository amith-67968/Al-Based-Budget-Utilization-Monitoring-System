import { Router } from 'express';
import authRoutes from './authRoutes';
import userRoutes from './userRoutes';
import departmentRoutes from './departmentRoutes';
import budgetRoutes from './budgetRoutes';
import expenditureRoutes from './expenditureRoutes';
import monitoringRoutes from './monitoringRoutes';
import alertRoutes from './alertRoutes';
import reportRoutes from './reportRoutes';
import adminRoutes from './adminRoutes';
import auditRoutes from './auditRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/departments', departmentRoutes);
router.use('/budgets', budgetRoutes);
router.use('/expenditures', expenditureRoutes);
router.use('/monitoring', monitoringRoutes);
router.use('/alerts', alertRoutes);
router.use('/reports', reportRoutes);
router.use('/admin', adminRoutes);
router.use('/audit-logs', auditRoutes);

export default router;
