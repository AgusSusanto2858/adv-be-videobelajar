import express from 'express';
import multer from 'multer';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/upload', (req, res) => {
    upload.single('file')(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ success: false, message: err.message });
        } else if (err) {
            return res.status(400).json({ success: false, message: err.message });
        }

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }

        res.json({
            success: true,
            message: 'File uploaded successfully',
            data: {
                filename: req.file.filename,
                path: req.file.path
            }
        });
    });
});

export default router;
