import express from 'express';
import { body, param, query } from 'express-validator';
import {
    getAllCourses,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse,
    getCoursesByCategory,
    resetToDefaultCourses
} from '../controllers/coursesController.js';

const router = express.Router();

// Get all courses with optional filtering
router.get('/', [
    query('category')
        .optional()
        .isIn(['Pemasaran', 'Desain', 'Pengembangan Diri', 'Bisnis'])
        .withMessage('Category must be one of: Pemasaran, Desain, Pengembangan Diri, Bisnis'),
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100'),
    query('offset')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Offset must be a non-negative integer')
], getAllCourses);

// Get course by ID
router.get('/:id', [
    param('id').isInt().withMessage('Course ID must be a valid integer')
], getCourseById);

// Get courses by category
router.get('/category/:category', [
    param('category')
        .isIn(['Pemasaran', 'Desain', 'Pengembangan Diri', 'Bisnis'])
        .withMessage('Category must be one of: Pemasaran, Desain, Pengembangan Diri, Bisnis')
], getCoursesByCategory);

// Create new course
router.post('/', [
    body('title')
        .trim()
        .isLength({ min: 3 })
        .withMessage('Title must be at least 3 characters long'),
    body('description')
        .trim()
        .isLength({ min: 10 })
        .withMessage('Description must be at least 10 characters long'),
    body('photos')
        .optional()
        .isURL()
        .withMessage('Photos must be a valid URL'),
    body('mentor')
        .trim()
        .isLength({ min: 2 })
        .withMessage('Mentor name must be at least 2 characters long'),
    body('rolementor')
        .trim()
        .isLength({ min: 2 })
        .withMessage('Mentor role must be at least 2 characters long'),
    body('avatar')
        .optional()
        .isURL()
        .withMessage('Avatar must be a valid URL'),
    body('company')
        .trim()
        .isLength({ min: 2 })
        .withMessage('Company name must be at least 2 characters long'),
    body('rating')
        .optional()
        .isFloat({ min: 0, max: 5 })
        .withMessage('Rating must be between 0 and 5'),
    body('review_count')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Review count must be a non-negative integer'),
    body('price')
        .trim()
        .isLength({ min: 1 })
        .withMessage('Price is required'),
    body('category')
        .isIn(['Pemasaran', 'Desain', 'Pengembangan Diri', 'Bisnis'])
        .withMessage('Category must be one of: Pemasaran, Desain, Pengembangan Diri, Bisnis')
], createCourse);

// Update course
router.put('/:id', [
    param('id').isInt().withMessage('Course ID must be a valid integer'),
    body('title')
        .optional()
        .trim()
        .isLength({ min: 3 })
        .withMessage('Title must be at least 3 characters long'),
    body('description')
        .optional()
        .trim()
        .isLength({ min: 10 })
        .withMessage('Description must be at least 10 characters long'),
    body('photos')
        .optional()
        .isURL()
        .withMessage('Photos must be a valid URL'),
    body('mentor')
        .optional()
        .trim()
        .isLength({ min: 2 })
        .withMessage('Mentor name must be at least 2 characters long'),
    body('rolementor')
        .optional()
        .trim()
        .isLength({ min: 2 })
        .withMessage('Mentor role must be at least 2 characters long'),
    body('avatar')
        .optional()
        .isURL()
        .withMessage('Avatar must be a valid URL'),
    body('company')
        .optional()
        .trim()
        .isLength({ min: 2 })
        .withMessage('Company name must be at least 2 characters long'),
    body('rating')
        .optional()
        .isFloat({ min: 0, max: 5 })
        .withMessage('Rating must be between 0 and 5'),
    body('review_count')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Review count must be a non-negative integer'),
    body('price')
        .optional()
        .trim()
        .isLength({ min: 1 })
        .withMessage('Price is required'),
    body('category')
        .optional()
        .isIn(['Pemasaran', 'Desain', 'Pengembangan Diri', 'Bisnis'])
        .withMessage('Category must be one of: Pemasaran, Desain, Pengembangan Diri, Bisnis')
], updateCourse);

// Delete course
router.delete('/:id', [
    param('id').isInt().withMessage('Course ID must be a valid integer')
], deleteCourse);

// Reset to default courses
router.post('/reset-default', resetToDefaultCourses);

export default router;