-- Buat database
CREATE DATABASE IF NOT EXISTS videobelajar_db;
USE videobelajar_db;

-- Tabel users
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    gender ENUM('Laki-laki', 'Perempuan'),
    role ENUM('admin', 'user', 'student') DEFAULT 'student',
    avatar TEXT,
    verification_token VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabel courses (menggantikan products)
CREATE TABLE courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    photos TEXT, -- URL gambar course
    mentor VARCHAR(255) NOT NULL,
    rolementor VARCHAR(255) NOT NULL,
    avatar TEXT, -- URL gambar mentor
    company VARCHAR(255) NOT NULL,
    rating DECIMAL(2,1) DEFAULT 0,
    review_count INT DEFAULT 0,
    price VARCHAR(50) NOT NULL,
    category ENUM('Pemasaran', 'Desain', 'Pengembangan Diri', 'Bisnis') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default admin user
INSERT INTO users (name, email, password, role, avatar) VALUES 
('Administrator', 'admin@videobelajar.com', 'admin123', 'admin', '/images/avatar.png');

-- Insert demo user
INSERT INTO users (name, email, password, phone, gender, role, avatar) VALUES 
('Demo User', 'user@example.com', '123456', '081234567890', 'Laki-laki', 'user', '/images/avatar.png');

-- Insert default courses
INSERT INTO courses (title, description, photos, mentor, rolementor, avatar, company, rating, review_count, price, category) VALUES 
('Big 4 Auditor Financial Analyst', 'Mulai transformasi dengan instruktur profesional, harga yang terjangkau, dan sistem pembelajaran yang mudah dipahami.', '/images/cards/card1.png', 'Jenna Ortega', 'Senior Accountant', '/images/tutors/tutor-card1.png', 'Gojek', 4.5, 126, '300K', 'Bisnis'),
('Digital Marketing Strategy', 'Pelajari strategi pemasaran digital yang efektif untuk meningkatkan brand awareness dan konversi.', '/images/cards/card2.png', 'Sarah Johnson', 'Marketing Director', '/images/tutors/tutor-card2.png', 'Tokopedia', 4.2, 98, '250K', 'Pemasaran'),
('UI/UX Design Fundamentals', 'Kuasai dasar-dasar desain UI/UX untuk menciptakan pengalaman pengguna yang luar biasa.', '/images/cards/card3.png', 'Michael Chen', 'Lead Designer', '/images/tutors/tutor-card3.png', 'Grab', 4.7, 204, '400K', 'Desain');