const fs = require('fs');
const path = require('path');

const baseDir = 'c:/Al-Based Budget Utilization/backend/src';

const routes = {
  'routes/authRoutes.ts': `
import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { loginValidator } from '../middleware/validators';
import { validate } from '../middleware/validate';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/login', loginValidator, validate, AuthController.login);
router.get('/me', authenticate, AuthController.getProfile);

export default router;
`,
  'routes/userRoutes.ts': `
import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { createUserValidator, updateUserValidator } from '../middleware/validators';
import { validate } from '../middleware/validate';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/', authorize('admin'), UserController.getAll);
router.post('/', authorize('admin'), createUserValidator, validate, UserController.create);
router.get('/:id', authorize('admin'), UserController.getById);
router.put('/:id', authorize('admin'), updateUserValidator, validate, UserController.update);
router.patch('/:id/status', authorize('admin'), UserController.updateStatus);

export default router;
`,
  'routes/departmentRoutes.ts': `
import { Router } from 'express';
import { DepartmentController } from '../controllers/departmentController';
import { createDepartmentValidator, updateDepartmentValidator } from '../middleware/validators';
import { validate } from '../middleware/validate';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/', DepartmentController.getAll);
router.post('/', authorize('admin'), createDepartmentValidator, validate, DepartmentController.create);
router.get('/:id', DepartmentController.getById);
router.put('/:id', authorize('admin'), updateDepartmentValidator, validate, DepartmentController.update);

export default router;
`,
  'routes/budgetRoutes.ts': `
import { Router } from 'express';
import { BudgetController } from '../controllers/budgetController';
import { createBudgetValidator, updateBudgetValidator } from '../middleware/validators';
import { validate } from '../middleware/validate';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/', BudgetController.getAll);
router.post('/', authorize('admin', 'finance_officer'), createBudgetValidator, validate, BudgetController.create);
router.get('/dashboard-stats', BudgetController.getDashboardStats);
router.get('/:id', BudgetController.getById);
router.put('/:id', authorize('admin', 'finance_officer'), updateBudgetValidator, validate, BudgetController.update);
router.delete('/:id', authorize('admin', 'finance_officer'), BudgetController.delete);

export default router;
`,
  'routes/expenditureRoutes.ts': `
import { Router } from 'express';
import { ExpenditureController } from '../controllers/expenditureController';
import { createExpenditureValidator, updateExpenditureValidator } from '../middleware/validators';
import { validate } from '../middleware/validate';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/', ExpenditureController.getAll);
router.post('/', authorize('admin', 'finance_officer', 'department_head'), createExpenditureValidator, validate, ExpenditureController.create);
router.get('/recent', ExpenditureController.getRecent);
router.get('/:id', ExpenditureController.getById);
router.put('/:id', authorize('admin', 'finance_officer'), updateExpenditureValidator, validate, ExpenditureController.update);
router.delete('/:id', authorize('admin', 'finance_officer'), ExpenditureController.delete);

export default router;
`,
  'routes/monitoringRoutes.ts': `
import { Router } from 'express';
import { MonitoringController } from '../controllers/monitoringController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/overview', MonitoringController.getOverview);
router.post('/run', authorize('admin', 'finance_officer'), MonitoringController.runMonitoring);
router.get('/department/:id', MonitoringController.getDepartmentMonitoring);

export default router;
`,
  'routes/alertRoutes.ts': `
import { Router } from 'express';
import { AlertController } from '../controllers/alertController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/', AlertController.getAll);
router.get('/stats', AlertController.getStats);
router.get('/recent', AlertController.getRecent);
router.get('/:id', AlertController.getById);
router.patch('/:id/status', authorize('admin', 'finance_officer'), AlertController.updateStatus);

export default router;
`,
  'routes/reportRoutes.ts': `
import { Router } from 'express';
import { ReportController } from '../controllers/reportController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/budget-utilization', authorize('admin', 'finance_officer', 'department_head'), ReportController.getBudgetUtilization);
router.get('/expenditures', authorize('admin', 'finance_officer', 'department_head'), ReportController.getExpenditures);
router.get('/alerts', authorize('admin', 'finance_officer'), ReportController.getAlerts);

export default router;
`,
  'routes/adminRoutes.ts': `
import { Router } from 'express';
import { AdminController } from '../controllers/adminController';
import { createRuleValidator, updateRuleValidator } from '../middleware/validators';
import { validate } from '../middleware/validate';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.use(authenticate);
router.use(authorize('admin'));

router.get('/rules', AdminController.getRules);
router.post('/rules', createRuleValidator, validate, AdminController.createRule);
router.put('/rules/:id', updateRuleValidator, validate, AdminController.updateRule);

export default router;
`,
  'routes/auditRoutes.ts': `
import { Router } from 'express';
import { AuditController } from '../controllers/auditController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.use(authenticate);
router.use(authorize('admin'));

router.get('/', AuditController.getLogs);

export default router;
`,
  'routes/index.ts': `
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
`
};

Object.entries(routes).forEach(([filepath, content]) => {
  const fullPath = path.join(baseDir, filepath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content.trim() + '\\n');
});

console.log('Routes generated successfully.');
