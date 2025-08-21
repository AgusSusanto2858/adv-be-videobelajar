import express from 'express';
import { body } from 'express-validator';
import { login, register, verifyToken, verifyEmail } from '../controllers/authController.js';

const router = express.Router();

// Login route
router.post('/login', [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
], login);

// Register route
router.post('/register', [
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
        .withMessage('Password must be at least 6 characters long')
], register);

// Verify token route
router.get('/verify', verifyToken);

// Email verification route
router.get('/verify-email', verifyEmail);

export default router;