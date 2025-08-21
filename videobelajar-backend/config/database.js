import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
    process.env.DB_NAME || 'videobelajar_db',
    process.env.DB_USER || 'root',
    process.env.DB_PASS || '',
    {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 8111,
        dialect: 'mysql',
        logging: false
    }
);

const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Database connected successfully');
        console.log(`📊 Connected to: ${sequelize.getDatabaseName()} on ${sequelize.options.host}:${sequelize.options.port}`);
        return true;
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        console.error('🔧 Please check your XAMPP MySQL service and database configuration');
        return false;
    }
};

const executeQuery = async (query, params = []) => {
    try {
        const [results] = await sequelize.query(query, { replacements: params });
        return results;
    } catch (error) {
        console.error('Query execution error:', error);
        throw error;
    }
};

export { sequelize, testConnection, executeQuery };
export default sequelize;
