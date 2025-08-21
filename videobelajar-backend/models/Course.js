import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Course = sequelize.define('Course', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    photos: {
        type: DataTypes.TEXT
    },
    mentor: {
        type: DataTypes.STRING,
        allowNull: false
    },
    rolementor: {
        type: DataTypes.STRING,
        allowNull: false
    },
    avatar: {
        type: DataTypes.TEXT
    },
    company: {
        type: DataTypes.STRING,
        allowNull: false
    },
    rating: {
        type: DataTypes.DECIMAL(2, 1),
        defaultValue: 0
    },
    review_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    price: {
        type: DataTypes.STRING,
        allowNull: false
    },
    category: {
        type: DataTypes.ENUM('Pemasaran', 'Desain', 'Pengembangan Diri', 'Bisnis'),
        allowNull: false
    }
}, {
    tableName: 'courses',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

export default Course;
