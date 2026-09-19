import { body } from 'express-validator';

export const createExpenditureValidator = [
  body('budgetId')
    .notEmpty().withMessage('Budget ID is required')
    .isMongoId().withMessage('Invalid Budget ID'),
  body('departmentId')
    .notEmpty().withMessage('Department ID is required')
    .isMongoId().withMessage('Invalid Department ID'),
  body('amountSpent')
    .notEmpty().withMessage('Amount spent is required')
    .isFloat({ min: 0.01 }).withMessage('Amount spent must be at least 0.01'),
  body('expenseCategory')
    .notEmpty().withMessage('Expense category is required')
    .isIn(['salaries', 'infrastructure', 'equipment', 'supplies', 'travel', 'maintenance', 'consulting', 'training', 'utilities', 'miscellaneous'])
    .withMessage('Invalid expense category'),
  body('date')
    .notEmpty().withMessage('Date is required')
    .isISO8601().withMessage('Must be a valid date'),
  body('description')
    .notEmpty().withMessage('Description is required')
    .isLength({ min: 2, max: 500 }).withMessage('Description must be between 2 and 500 characters'),
  body('supportingDocumentReference')
    .optional()
    .trim()
];
