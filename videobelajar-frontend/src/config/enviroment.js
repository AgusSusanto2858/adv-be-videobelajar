const config = {
    // API Configuration
    API_BASE_URL: 'http://localhost:5000/api',
    
    // Environment info
    NODE_ENV: 'development',
    DEBUG: true,
    
    // Database info (for reference)
    DATABASE_TYPE: 'mysql_local',
    DATABASE_PORT: 8111,
    
    // Application settings
    APP_NAME: 'VideoBelajar',
    APP_VERSION: '2.0.0'
};

// Helper functions
export const getApiUrl = () => config.API_BASE_URL;
export const isDebugMode = () => config.DEBUG;
export const getAppInfo = () => ({
    name: config.APP_NAME,
    version: config.APP_VERSION,
    environment: config.NODE_ENV
});

// Console info untuk debugging
console.log('🔧 VideoBelajar Configuration:');
console.log('📡 API URL:', config.API_BASE_URL);
console.log('🗄️ Database Port:', config.DATABASE_PORT);
console.log('🐛 Debug Mode:', config.DEBUG);

export default config;