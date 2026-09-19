import { body } from 'express-validator';

export const createBudgetValidator = [
  body('financialYear')
    .notEmpty().withMessage('Financial year is required')
    .matches(/^\d{4}-\d{2}$/).withMessage('Financial year must match YYYY-YY format'),
  body('departmentId')
    .notEmpty().withMessage('Department ID is required')
    .isMongoId().withMessage('Invalid Department ID'),
  body('projectName')
    .notEmpty().withMessage('Project name is required')
    .trim()
    .isLength({ min: 2, max: 200 }).withMessage('Project name must be between 2 and 200 characters'),
  body('allocatedAmount')
    .notEmpty().withMessage('Allocated amount is required')
    .isFloat({ min: 1 }).withMessage('Allocated amount must be at least 1'),
  body('allocationDate')
    .notEmpty().withMessage('Allocation date is required')
    .isISO8601().withMessage('Must be a valid date'),
  body('startDate')
    .notEmpty().withMessage('Start date is required')
    .isISO8601().withMessage('Must be a valid date'),
  body('endDate')
    .notEmpty().withMessage('End date is required')
    .isISO8601().withMessage('Must be a valid date'),
  body('status')
    .optional()
    .isIn(['draft', 'active', 'closed']).withMessage('Status must be draft, active, or closed')
];

export const updateBudgetValidator = [
  body('financialYear')
    .optional()
    .matches(/^\d{4}-\d{2}$/).withMessage('Financial year must match YYYY-YY format'),
  body('departmentId')
    .optional()
    .isMongoId().withMessage('Invalid Department ID'),
  body('projectName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 200 }).withMessage('Project name must be between 2 and 200 characters'),
  body('allocatedAmount')
    .optional()
    .isFloat({ min: 1 }).withMessage('Allocated amount must be at least 1'),
  body('allocationDate')
    .optional()
    .isISO8601().withMessage('Must be a valid date'),
  body('startDate')
    .optional()
    .isISO8601().withMessage('Must be a valid date'),
  body('endDate')
    .optional()
    .isISO8601().withMessage('Must be a valid date'),
  body('status')
    .optional()
    .isIn(['draft', 'active', 'closed']).withMessage('Status must be draft, active, or closed')
];
