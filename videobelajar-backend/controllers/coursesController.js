import { validationResult } from 'express-validator';
import { Op } from 'sequelize';
import Course from '../models/Course.js';

// Get all courses
export const getAllCourses = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const { category, limit, offset, search, sortBy, sort } = req.query;

        const where = {};
        if (category) {
            where.category = category;
        }
        if (search) {
            where.title = { [Op.like]: `%${search}%` };
        }

        const allowedSort = ['created_at', 'title', 'price', 'rating'];
        const sortColumn = allowedSort.includes(sortBy) ? sortBy : 'created_at';
        const sortOrder = sort && sort.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

        const { rows: courses, count: totalCount } = await Course.findAndCountAll({
            where,
            order: [[sortColumn, sortOrder]],
            ...(limit && { limit: parseInt(limit) }),
            ...(offset && { offset: parseInt(offset) })
        });

        res.json({
            success: true,
            message: 'Courses retrieved successfully',
            data: courses,
            pagination: {
                total: totalCount,
                count: courses.length,
                limit: limit ? parseInt(limit) : null,
                offset: offset ? parseInt(offset) : null
            }
        });

    } catch (error) {
        console.error('Get all courses error:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat mengambil data courses'
        });
    }
};

// Get course by ID
export const getCourseById = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const { id } = req.params;
        
        const course = await Course.findByPk(id);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course tidak ditemukan'
            });
        }

        res.json({
            success: true,
            message: 'Course retrieved successfully',
            data: course
        });

    } catch (error) {
        console.error('Get course by ID error:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat mengambil data course'
        });
    }
};

// Get courses by category
export const getCoursesByCategory = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const { category } = req.params;

        const courses = await Course.findAll({
            where: { category },
            order: [['created_at', 'DESC']]
        });

        res.json({
            success: true,
            message: `Courses in category '${category}' retrieved successfully`,
            data: courses,
            count: courses.length
        });

    } catch (error) {
        console.error('Get courses by category error:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat mengambil data courses'
        });
    }
};

// Create new course
export const createCourse = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const {
            title,
            description,
            photos,
            mentor,
            rolementor,
            avatar,
            company,
            rating,
            review_count,
            price,
            category
        } = req.body;

        const course = await Course.create({
            title,
            description,
            photos: photos || null,
            mentor,
            rolementor,
            avatar: avatar || null,
            company,
            rating: rating || 0,
            review_count: review_count || 0,
            price,
            category
        });

        res.status(201).json({
            success: true,
            message: 'Course created successfully',
            data: course
        });

    } catch (error) {
        console.error('Create course error:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat membuat course'
        });
    }
};

// Update course
export const updateCourse = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const { id } = req.params;
        const {
            title,
            description,
            photos,
            mentor,
            rolementor,
            avatar,
            company,
            rating,
            review_count,
            price,
            category
        } = req.body;

        const course = await Course.findByPk(id);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course tidak ditemukan'
            });
        }

        const updates = {};
        if (title !== undefined) updates.title = title;
        if (description !== undefined) updates.description = description;
        if (photos !== undefined) updates.photos = photos || null;
        if (mentor !== undefined) updates.mentor = mentor;
        if (rolementor !== undefined) updates.rolementor = rolementor;
        if (avatar !== undefined) updates.avatar = avatar || null;
        if (company !== undefined) updates.company = company;
        if (rating !== undefined) updates.rating = rating;
        if (review_count !== undefined) updates.review_count = review_count;
        if (price !== undefined) updates.price = price;
        if (category !== undefined) updates.category = category;

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Tidak ada data yang diupdate'
            });
        }

        await course.update(updates);

        res.json({
            success: true,
            message: 'Course updated successfully',
            data: course
        });

    } catch (error) {
        console.error('Update course error:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat mengupdate course'
        });
    }
};

// Delete course
export const deleteCourse = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const { id } = req.params;

        const course = await Course.findByPk(id);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course tidak ditemukan'
            });
        }

        await course.destroy();

        res.json({
            success: true,
            message: 'Course deleted successfully'
        });

    } catch (error) {
        console.error('Delete course error:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat menghapus course'
        });
    }
};

// Reset to default courses
export const resetToDefaultCourses = async (req, res) => {
    try {
        await Course.destroy({ where: {}, truncate: true });

        const defaultCourses = [
            {
                title: "Big 4 Auditor Financial Analyst",
                description: "Mulai transformasi dengan instruktur profesional, harga yang terjangkau, dan sistem pembelajaran yang mudah dipahami.",
                photos: '/images/cards/card1.png',
                mentor: "Jenna Ortega",
                rolementor: "Senior Accountant",
                avatar: '/images/tutors/tutor-card1.png',
                company: "Gojek",
                rating: 4.5,
                review_count: 126,
                price: "300K",
                category: "Bisnis"
            },
            {
                title: "Digital Marketing Strategy",
                description: "Pelajari strategi pemasaran digital yang efektif untuk meningkatkan brand awareness dan konversi.",
                photos: '/images/cards/card2.png',
                mentor: "Sarah Johnson",
                rolementor: "Marketing Director",
                avatar: '/images/tutors/tutor-card2.png',
                company: "Tokopedia",
                rating: 4.2,
                review_count: 98,
                price: "250K",
                category: "Pemasaran"
            },
            {
                title: "UI/UX Design Fundamentals",
                description: "Kuasai dasar-dasar desain UI/UX untuk menciptakan pengalaman pengguna yang luar biasa.",
                photos: '/images/cards/card3.png',
                mentor: "Michael Chen",
                rolementor: "Lead Designer",
                avatar: '/images/tutors/tutor-card3.png',
                company: "Grab",
                rating: 4.7,
                review_count: 204,
                price: "400K",
                category: "Desain"
            }
        ];

        const createdCourses = await Course.bulkCreate(defaultCourses);

        res.json({
            success: true,
            message: 'Courses reset to default successfully',
            data: createdCourses,
            count: createdCourses.length
        });

    } catch (error) {
        console.error('Reset courses error:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat mereset courses'
        });
    }
};