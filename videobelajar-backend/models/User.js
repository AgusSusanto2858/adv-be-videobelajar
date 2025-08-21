import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phone: {
        type: DataTypes.STRING
    },
    gender: {
        type: DataTypes.ENUM('Laki-laki', 'Perempuan')
    },
    role: {
        type: DataTypes.ENUM('admin', 'user', 'student'),
        defaultValue: 'student'
    },
    avatar: {
        type: DataTypes.TEXT
    },
    verification_token: {
        type: DataTypes.STRING
    }
}, {
    tableName: 'users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

export default User;
