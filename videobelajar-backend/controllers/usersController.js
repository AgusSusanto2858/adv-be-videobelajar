import bcrypt from 'bcryptjs';
import { validationResult } from 'express-validator';
import { Op } from 'sequelize';
import User from '../models/User.js';

// Get all users
export const getAllUsers = async (req, res) => {
    try {
        const { role, search, sortBy, sort } = req.query;

        const where = {};
        if (role) {
            where.role = role;
        }
        if (search) {
            where.name = { [Op.like]: `%${search}%` };
        }

        const allowedSort = ['created_at', 'name', 'email'];
        const sortColumn = allowedSort.includes(sortBy) ? sortBy : 'created_at';
        const sortOrder = sort && sort.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

        const users = await User.findAll({
            where,
            order: [[sortColumn, sortOrder]]
        });

        const mappedUsers = users.map(u => ({
            id: u.id,
            fullname: u.name,
            username: u.username,
            email: u.email,
            phone: u.phone,
            gender: u.gender,
            role: u.role,
            avatar: u.avatar
        }));

        res.json({
            success: true,
            message: 'Users retrieved successfully',
            data: mappedUsers,
            count: mappedUsers.length
        });

    } catch (error) {
        console.error('Get all users error:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat mengambil data users'
        });
    }
};

// Get user by ID
export const getUserById = async (req, res) => {
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

        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User tidak ditemukan'
            });
        }

        res.json({
            success: true,
            message: 'User retrieved successfully',
            data: {
                id: user.id,
                fullname: user.name,
                username: user.username,
                email: user.email,
                phone: user.phone,
                gender: user.gender,
                role: user.role,
                avatar: user.avatar
            }
        });

    } catch (error) {
        console.error('Get user by ID error:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat mengambil data user'
        });
    }
};

// Create new user
export const createUser = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const { fullname, username, email, password, phone, gender, role, avatar } = req.body;

        const existingUser = await User.findOne({ where: { [Op.or]: [{ email }, { username }] } });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Email sudah terdaftar'
            });
        }

        // Hash password
        const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Generate default avatar if not provided
        const userAvatar = avatar || `https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/male/512/${Math.floor(Math.random() * 100)}.jpg`;

        const user = await User.create({
            name: fullname,
            username,
            email,
            password: hashedPassword,
            phone: phone || null,
            gender: gender || null,
            role: role || 'student',
            avatar: userAvatar
        });

        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: {
                id: user.id,
                fullname: user.name,
                username: user.username,
                email: user.email,
                phone: user.phone,
                gender: user.gender,
                role: user.role,
                avatar: user.avatar
            }
        });

    } catch (error) {
        console.error('Create user error:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat membuat user'
        });
    }
};

// Update user
export const updateUser = async (req, res) => {
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
        const { fullname, username, email, phone, gender, role, avatar } = req.body;

        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User tidak ditemukan'
            });
        }

        if (email && email !== user.email) {
            const emailExists = await User.findOne({
                where: {
                    email,
                    id: { [Op.ne]: id }
                }
            });

            if (emailExists) {
                return res.status(400).json({
                    success: false,
                    message: 'Email sudah digunakan oleh user lain'
                });
            }
        }

        if (username && username !== user.username) {
            const usernameExists = await User.findOne({
                where: {
                    username,
                    id: { [Op.ne]: id }
                }
            });

            if (usernameExists) {
                return res.status(400).json({
                    success: false,
                    message: 'Username sudah digunakan oleh user lain'
                });
            }
        }

        const updates = {};
        if (fullname !== undefined) updates.name = fullname;
        if (username !== undefined) updates.username = username;
        if (email !== undefined) updates.email = email;
        if (phone !== undefined) updates.phone = phone || null;
        if (gender !== undefined) updates.gender = gender || null;
        if (role !== undefined) updates.role = role;
        if (avatar !== undefined) updates.avatar = avatar;

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Tidak ada data yang diupdate'
            });
        }

        await user.update(updates);

        res.json({
            success: true,
            message: 'User updated successfully',
            data: {
                id: user.id,
                fullname: user.name,
                username: user.username,
                email: user.email,
                phone: user.phone,
                gender: user.gender,
                role: user.role,
                avatar: user.avatar
            }
        });

    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat mengupdate user'
        });
    }
};

// Delete user
export const deleteUser = async (req, res) => {
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

        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User tidak ditemukan'
            });
        }

        if (user.role === 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Admin user tidak dapat dihapus'
            });
        }

        await user.destroy();

        res.json({
            success: true,
            message: 'User deleted successfully'
        });

    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat menghapus user'
        });
    }
};

// Reset password
export const resetPassword = async (req, res) => {
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
        const { newPassword } = req.body;

        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User tidak ditemukan'
            });
        }

        const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        await user.update({ password: hashedPassword });

        res.json({
            success: true,
            message: 'Password reset successfully',
            data: {
                id: user.id,
                fullname: user.name,
                username: user.username,
                email: user.email,
                phone: user.phone,
                gender: user.gender,
                role: user.role,
                avatar: user.avatar
            }
        });

    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat mereset password'
        });
    }
};