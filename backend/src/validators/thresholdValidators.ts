import { body } from 'express-validator';

export const createThresholdRuleValidator = [
  body('ruleType')
    .notEmpty().withMessage('Rule type is required')
    .isIn(['utilization_percentage', 'spending_spike', 'category_limit', 'time_based']).withMessage('Invalid rule type'),
  body('value')
    .notEmpty().withMessage('Value is required')
    .isFloat({ min: 0 }).withMessage('Value must be a positive number'),
  body('secondaryValue')
    .optional()
    .isFloat().withMessage('Secondary value must be a number'),
  body('enabled')
    .optional()
    .isBoolean().withMessage('Enabled must be a boolean'),
  body('description')
    .notEmpty().withMessage('Description is required')
];
