import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { validationResult } from 'express-validator';
import { Op } from 'sequelize';
import User from '../models/User.js';
import { sendVerificationEmail } from '../utils/email.js';

// Generate JWT token
const generateToken = (userId, email, role) => {
    return jwt.sign(
        { userId, email, role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
};

// Login controller
export const login = async (req, res) => {
    try {
        // Check validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const { email, password } = req.body;

        // Check hardcoded accounts first (for backward compatibility)
        if (email === "admin@videobelajar.com" && password === "admin123") {
            const token = generateToken('admin', email, 'admin');
            return res.json({
                success: true,
                message: 'Login successful',
                data: {
                    user: {
                        id: 'admin',
                        name: 'Administrator',
                        email: email,
                        role: 'admin'
                    },
                    token
                }
            });
        }

        if (email === "user@example.com" && password === "123456") {
            const token = generateToken('demo', email, 'user');
            return res.json({
                success: true,
                message: 'Login successful',
                data: {
                    user: {
                        id: 'demo',
                        name: 'Demo User',
                        email: email,
                        role: 'user'
                    },
                    token
                }
            });
        }

        // Check database users
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Email atau password salah'
            });
        }

        // For database users, check if password is hashed or plain text
        let isPasswordValid = false;
        
        if (user.password.startsWith('$2')) {
            // Password is hashed
            isPasswordValid = await bcrypt.compare(password, user.password);
        } else {
            // Password is plain text (for backward compatibility)
            isPasswordValid = password === user.password;
        }

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Email atau password salah'
            });
        }

        // Generate token
        const token = generateToken(user.id, user.email, user.role);

        // Return user data without password
        const userData = {
            id: user.id,
            fullname: user.name,
            username: user.username,
            email: user.email,
            role: user.role || 'user',
            avatar: user.avatar
        };

        res.json({
            success: true,
            message: 'Login successful',
            data: {
                user: userData,
                token
            }
        });

    } catch (error) {
        console.error('Login error:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat login'
        });
    }
};

// Register controller
export const register = async (req, res) => {
    try {
        // Check validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const { fullname, username, email, password } = req.body;

        // Generate verification token
        const verificationToken = uuidv4();

        // Check if email or username already exists
        const existingUser = await User.findOne({ where: { [Op.or]: [{ email }, { username }] } });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Email sudah terdaftar. Silakan gunakan email lain.'
            });
        }

        // Hash password
        const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Generate random avatar
        const avatarId = Math.floor(Math.random() * 100) + 1;
        const avatar = `https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/male/512/${avatarId}.jpg`;

        // Insert new user
        const newUser = await User.create({
            name: fullname,
            username,
            email,
            password: hashedPassword,
            role: 'student',
            avatar,
            verification_token: verificationToken
        });

        // Return user data without password
        const userData = {
            id: newUser.id,
            fullname: newUser.name,
            username: newUser.username,
            email: newUser.email,
            role: newUser.role,
            avatar: newUser.avatar
        };

        // Send verification email
        try {
            await sendVerificationEmail(email, verificationToken);
        } catch (emailError) {
            console.error('Email send error:', emailError.message);
        }

        return res.status(201).json({
            success: true,
            message: 'Pendaftaran berhasil, silakan verifikasi email Anda',
            data: userData
        });

    } catch (error) {
        console.error('Register error:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat mendaftar. Silakan coba lagi.'
        });
    }
};

// Verify token controller
export const verifyToken = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Token tidak ditemukan'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Get user from database
        const user = await User.findByPk(decoded.userId);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User tidak ditemukan'
            });
        }
        const userData = {
            id: user.id,
            fullname: user.name,
            username: user.username,
            email: user.email,
            role: user.role,
            avatar: user.avatar
        };

        res.json({
            success: true,
            message: 'Token valid',
            data: userData
        });

    } catch (error) {
        console.error('Token verification error:', error.message);
        return res.status(401).json({
            success: false,
            message: 'Token tidak valid'
        });
    }
};

// Email verification controller
export const verifyEmail = async (req, res) => {
    try {
        const token = decodeURIComponent(req.query.token || '');

        if (!token) {
            return res.status(400).json({
                success: false,
                message: 'Invalid Verification Token'
            });
        }

        const user = await User.findOne({ where: { verification_token: token } });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid Verification Token'
            });
        }

        await user.update({ verification_token: null });

        return res.json({
            success: true,
            message: 'Email Verified Successfully'
        });
    } catch (error) {
        console.error('Email verification error:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Verification failed'
        });
    }
};