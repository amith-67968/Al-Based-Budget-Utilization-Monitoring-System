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

// Public / system seed endpoint (for cloud setup & database initialization)
router.all('/system/seed', async (_req, res) => {
  try {
    const { seedDB } = await import('../seed/seed');
    console.log('Seeding triggered via /api/system/seed...');
    await seedDB(false);
    return res.json({
      success: true,
      message: 'Database successfully seeded with 8 departments, 13 users, 144 budgets, 671 expenditures, 8 threshold rules, 20 alerts, and 60 audit logs.'
    });
  } catch (error: any) {
    console.error('Seed error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Error executing database seed'
    });
  }
});

export default router;
