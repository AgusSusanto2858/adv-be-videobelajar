const API_BASE_URL = 'http://localhost:5000/api';

// Get token from localStorage
const getAuthToken = () => {
    try {
        const user = localStorage.getItem('user');
        if (user) {
            const userData = JSON.parse(user);
            return userData.token;
        }
        return null;
    } catch (error) {
        console.error('Error getting auth token:', error);
        return null;
    }
};

// Generic API request function
const apiRequest = async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = getAuthToken();
    
    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
            ...options.headers,
        },
        ...options,
    };

    try {
        const response = await fetch(url, config);
        
        // Handle different response types
        const contentType = response.headers.get('content-type');
        let data;
        
        if (contentType && contentType.includes('application/json')) {
            data = await response.json();
        } else {
            data = await response.text();
        }
        
        if (!response.ok) {
            // Handle API error responses
            const errorMessage = data.message || `HTTP error! status: ${response.status}`;
            throw new Error(errorMessage);
        }
        
        return data;
    } catch (error) {
        console.error('API request failed:', error);
        throw error;
    }
};

// Authentication API
export const authAPI = {
    // Login
    login: async (credentials) => {
        const response = await apiRequest('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        });
        return response.data;
    },
    
    // Register
    register: async (userData) => {
        const response = await apiRequest('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData),
        });
        return response.data;
    },
    
    // Verify token
    verifyToken: async () => {
        const response = await apiRequest('/auth/verify');
        return response.data;
    }
};

// Users API
export const usersAPI = {
    // Get all users
    getAll: async () => {
        const response = await apiRequest('/users');
        return response.data;
    },
    
    // Get user by ID
    getById: async (id) => {
        const response = await apiRequest(`/users/${id}`);
        return response.data;
    },
    
    // Create new user
    create: async (userData) => {
        const response = await apiRequest('/users', {
            method: 'POST',
            body: JSON.stringify(userData),
        });
        return response.data;
    },
    
    // Update user
    update: async (id, userData) => {
        const response = await apiRequest(`/users/${id}`, {
            method: 'PUT',
            body: JSON.stringify(userData),
        });
        return response.data;
    },
    
    // Delete user
    delete: async (id) => {
        const response = await apiRequest(`/users/${id}`, {
            method: 'DELETE',
        });
        return response;
    },
    
    // Reset password
    resetPassword: async (id, newPassword) => {
        const response = await apiRequest(`/users/${id}/reset-password`, {
            method: 'PATCH',
            body: JSON.stringify({ newPassword }),
        });
        return response.data;
    },
    
    // Find user by email (for login)
    findByEmail: async (email) => {
        const users = await this.getAll();
        return users.find(user => user.email === email);
    },
    
    // Check if email exists (for registration)
    emailExists: async (email) => {
        try {
            const users = await this.getAll();
            return users.some(user => user.email === email);
        } catch (error) {
            console.error('Error checking email existence:', error);
            return false;
        }
    }
};

// Courses API (menggantikan productsAPI)
export const coursesAPI = {
    // Get all courses
    getAll: async (params = {}) => {
        let endpoint = '/courses';
        const queryParams = new URLSearchParams();
        
        if (params.category) queryParams.append('category', params.category);
        if (params.limit) queryParams.append('limit', params.limit);
        if (params.offset) queryParams.append('offset', params.offset);
        
        if (queryParams.toString()) {
            endpoint += `?${queryParams.toString()}`;
        }
        
        const response = await apiRequest(endpoint);
        return response.data;
    },
    
    // Get course by ID
    getById: async (id) => {
        const response = await apiRequest(`/courses/${id}`);
        return response.data;
    },
    
    // Create new course
    create: async (courseData) => {
        const response = await apiRequest('/courses', {
            method: 'POST',
            body: JSON.stringify(courseData),
        });
        return response.data;
    },
    
    // Update course
    update: async (id, courseData) => {
        const response = await apiRequest(`/courses/${id}`, {
            method: 'PUT',
            body: JSON.stringify(courseData),
        });
        return response.data;
    },
    
    // Delete course
    delete: async (id) => {
        const response = await apiRequest(`/courses/${id}`, {
            method: 'DELETE',
        });
        return response;
    },
    
    // Get courses by category
    getByCategory: async (category) => {
        if (category === 'Semua Kelas') {
            return await this.getAll();
        }
        const response = await apiRequest(`/courses/category/${category}`);
        return response.data;
    },
    
    // Reset to default courses
    resetToDefault: async () => {
        const response = await apiRequest('/courses/reset-default', {
            method: 'POST',
        });
        return response.data;
    }
};

// For backward compatibility, keep productsAPI as alias
export const productsAPI = coursesAPI;

// Helper functions for data transformation
export const transformUserData = (formData) => ({
    name: formData.fullName,
    email: formData.email,
    phone: formData.phoneNumber,
    password: formData.password,
    gender: formData.gender,
    role: 'student', // Default role
});

export const transformProductData = (courseData) => ({
    photos: courseData.courseImage,
    title: courseData.title,
    description: courseData.description,
    mentor: courseData.tutorName,
    rolementor: courseData.position,
    avatar: courseData.tutorImage,
    company: courseData.company,
    rating: parseFloat(courseData.rating),
    review_count: parseInt(courseData.reviewCount),
    price: courseData.price + 'K',
    category: courseData.category
});

// Reverse transformation for editing
export const transformApiUserToForm = (apiUser) => ({
    fullName: apiUser.name,
    email: apiUser.email,
    phoneNumber: apiUser.phone,
    gender: apiUser.gender,
    // Don't include password for security
});

export const transformApiProductToForm = (apiProduct) => ({
    title: apiProduct.title,
    description: apiProduct.description,
    tutorName: apiProduct.mentor,
    position: apiProduct.rolementor,
    company: apiProduct.company,
    rating: apiProduct.rating?.toString() || '0',
    reviewCount: apiProduct.review_count?.toString() || '0',
    price: apiProduct.price?.replace('K', '') || '0',
    category: apiProduct.category,
    courseImage: apiProduct.photos,
    tutorImage: apiProduct.avatar
});

// Health check function
export const healthCheck = async () => {
    try {
        const response = await apiRequest('/health');
        return response;
    } catch (error) {
        console.error('Backend health check failed:', error);
        throw new Error('Backend server is not responding');
    }
};

export default { 
    authAPI, 
    usersAPI, 
    coursesAPI, 
    productsAPI, 
    transformUserData, 
    transformProductData, 
    transformApiUserToForm, 
    transformApiProductToForm,
    healthCheck 
};