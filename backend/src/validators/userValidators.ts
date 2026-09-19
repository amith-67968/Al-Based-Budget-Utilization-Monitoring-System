import { body } from 'express-validator';

export const createUserValidator = [
  body('name')
    .notEmpty().withMessage('Name is required'),
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Must be a valid email'),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('role')
    .notEmpty().withMessage('Role is required')
    .isIn(['admin', 'finance_officer', 'department_head']).withMessage('Invalid role'),
  body('departmentId')
    .optional()
    .isMongoId().withMessage('Invalid Department ID')
];

export const updateUserValidator = [
  body('name')
    .optional()
    .notEmpty().withMessage('Name cannot be empty'),
  body('email')
    .optional()
    .isEmail().withMessage('Must be a valid email'),
  body('password')
    .optional()
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('role')
    .optional()
    .isIn(['admin', 'finance_officer', 'department_head']).withMessage('Invalid role'),
  body('departmentId')
    .optional()
    .isMongoId().withMessage('Invalid Department ID')
];
