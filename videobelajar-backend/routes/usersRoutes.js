import express from 'express';
import { body, param } from 'express-validator';
import {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    resetPassword
} from '../controllers/usersController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply authentication middleware to all user routes
router.use(authMiddleware);

// Get all users
router.get('/', getAllUsers);

// Get user by ID
router.get('/:id', [
    param('id').isInt().withMessage('User ID must be a valid integer')
], getUserById);

// Create new user
router.post('/', [
    body('fullname')
        .trim()
        .isLength({ min: 2 })
        .withMessage('Fullname must be at least 2 characters long'),
    body('username')
        .trim()
        .isLength({ min: 3 })
        .withMessage('Username must be at least 3 characters long'),
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
    body('phone')
        .optional()
        .isMobilePhone('id-ID')
        .withMessage('Please provide a valid Indonesian phone number'),
    body('gender')
        .optional()
        .isIn(['Laki-laki', 'Perempuan'])
        .withMessage('Gender must be either Laki-laki or Perempuan'),
    body('role')
        .optional()
        .isIn(['admin', 'user', 'student'])
        .withMessage('Role must be admin, user, or student')
], createUser);

// Update user
router.put('/:id', [
    param('id').isInt().withMessage('User ID must be a valid integer'),
    body('fullname')
        .optional()
        .trim()
        .isLength({ min: 2 })
        .withMessage('Fullname must be at least 2 characters long'),
    body('username')
        .optional()
        .trim()
        .isLength({ min: 3 })
        .withMessage('Username must be at least 3 characters long'),
    body('email')
        .optional()
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    body('phone')
        .optional()
        .isMobilePhone('id-ID')
        .withMessage('Please provide a valid Indonesian phone number'),
    body('gender')
        .optional()
        .isIn(['Laki-laki', 'Perempuan'])
        .withMessage('Gender must be either Laki-laki or Perempuan'),
    body('role')
        .optional()
        .isIn(['admin', 'user', 'student'])
        .withMessage('Role must be admin, user, or student')
], updateUser);

// Delete user
router.delete('/:id', [
    param('id').isInt().withMessage('User ID must be a valid integer')
], deleteUser);

// Reset password
router.patch('/:id/reset-password', [
    param('id').isInt().withMessage('User ID must be a valid integer'),
    body('newPassword')
        .isLength({ min: 6 })
        .withMessage('New password must be at least 6 characters long')
], resetPassword);

export default router;