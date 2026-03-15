import { body, validationResult } from 'express-validator';

export const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation Error',
            errors: errors.array()
        });
    }
    next();
};

export const validateLogin = [
    body('username')
        .trim()
        .notEmpty()
        .withMessage('Username is required')
        .isLength({ min: 3 })
        .withMessage('Username must be at least 3 characters'),
    body('password')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters'),
    validateRequest
];

export const validateRegister = [
    body('username')
        .trim()
        .notEmpty()
        .withMessage('Username is required')
        .isLength({ min: 3 })
        .withMessage('Username must be at least 3 characters'),
    body('email')
        .isEmail()
        .withMessage('Valid email is required'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters'),
    body('fullName')
        .trim()
        .notEmpty()
        .withMessage('Full name is required'),
    body('phone')
        .matches(/^(\+\d{1,3}[- ]?)?\d{10,}$/)
        .withMessage('Valid phone number is required'),
    validateRequest
];

export const validateCheckIn = [
    body('visitReason')
        .notEmpty()
        .withMessage('Visit reason is required')
        .isIn(['Study', 'Reading', 'Research', 'Computer/Internet', 'Borrowing Books',
               'Returning Books', 'Meeting/Event', 'Reference Help', 'Other']),
    validateRequest
];

export const validateGuestCheckIn = [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('age').isInt({ min: 1, max: 120 }).withMessage('Valid age is required'),
    body('gender').isIn(['Male', 'Female', 'Other']).withMessage('Valid gender is required'),
    body('phone').matches(/^(\+\d{1,3}[- ]?)?\d{10,}$/).withMessage('Valid phone is required'),
    body('address').trim().notEmpty().withMessage('Address is required'),
    body('sector').isIn(['Student', 'Employee', 'Self-Employed', 'Unemployed', 'Retired', 'Other']),
    body('organization').trim().notEmpty().withMessage('Organization is required'),
    body('visitReason').isIn(['Study', 'Reading', 'Research', 'Computer/Internet', 'Borrowing Books',
                              'Returning Books', 'Meeting/Event', 'Reference Help', 'Other']),
    validateRequest
];