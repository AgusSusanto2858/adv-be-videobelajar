import nodemailer from 'nodemailer';

// Function to send verification email with retry mechanism
export const sendVerificationEmail = async (to, token, maxRetries = 3) => {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT || 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const verificationUrl =
        `${process.env.APP_URL || 'http://localhost:5000'}/api/auth/verify-email?token=${encodeURIComponent(token)}`;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject: 'Email Verification',
        html: `<p>Please verify your email by clicking <a href="${verificationUrl}">this link</a>.</p>`
    };

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            await transporter.sendMail(mailOptions);
            return true;
        } catch (error) {
            if (attempt === maxRetries) {
                console.error(`Failed to send email after ${maxRetries} attempts`, error);
                throw error;
            }

            // Exponential backoff before retrying
            await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        }
    }
};

export default sendVerificationEmail;
