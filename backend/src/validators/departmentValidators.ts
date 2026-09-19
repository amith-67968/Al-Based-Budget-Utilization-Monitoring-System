import { body } from 'express-validator';

export const createDepartmentValidator = [
  body('name')
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  body('description')
    .optional(),
  body('headUserId')
    .optional()
    .isMongoId().withMessage('Invalid Head User ID')
];
