const API_BASE_URL = 'https://6868a237d5933161d70c0a7f.mockapi.io';

// Generic API request function
const apiRequest = async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
        ...options,
    };

    try {
        const response = await fetch(url, config);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('API request failed:', error);
        throw error;
    }
};

// Users API
export const usersAPI = {
    // Get all users
    getAll: () => apiRequest('/users'),
    
    // Get user by ID
    getById: (id) => apiRequest(`/users/${id}`),
    
    // Create new user
    create: (userData) => apiRequest('/users', {
        method: 'POST',
        body: JSON.stringify(userData),
    }),
    
    // Update user
    update: (id, userData) => apiRequest(`/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(userData),
    }),
    
    // Delete user
    delete: (id) => apiRequest(`/users/${id}`, {
        method: 'DELETE',
    }),
    
    // Find user by email (for login)
    findByEmail: async (email) => {
        const users = await apiRequest('/users');
        return users.find(user => user.email === email);
    },
    
    // Check if email exists (for registration)
    emailExists: async (email) => {
        const users = await apiRequest('/users');
        return users.some(user => user.email === email);
    }
};

// Products API
export const productsAPI = {
    // Get all products
    getAll: () => apiRequest('/product'),
    
    // Get product by ID
    getById: (id) => apiRequest(`/product/${id}`),
    
    // Create new product
    create: (productData) => apiRequest('/product', {
        method: 'POST',
        body: JSON.stringify(productData),
    }),
    
    // Update product
    update: (id, productData) => apiRequest(`/product/${id}`, {
        method: 'PUT',
        body: JSON.stringify(productData),
    }),
    
    // Delete product
    delete: (id) => apiRequest(`/product/${id}`, {
        method: 'DELETE',
    }),
    
    // Get products by category
    getByCategory: async (category) => {
        const products = await apiRequest('/product');
        if (category === 'Semua Kelas') return products;
        return products.filter(product => product.category === category);
    }
};

// Helper functions for data transformation
export const transformUserData = (formData) => ({
    name: formData.fullName,
    email: formData.email,
    phone: formData.phoneNumber,
    password: formData.password,
    gender: formData.gender,
    role: 'Student', // Default role
    avatar: `https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/male/512/${Math.floor(Math.random() * 100)}.jpg`
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
    reviewCount: parseInt(courseData.reviewCount),
    price: courseData.price + 'K',
    category: courseData.category
});

// Reverse transformation for editing
export const transformApiUserToForm = (apiUser) => ({
    fullName: apiUser.name,
    email: apiUser.email,
    phoneNumber: apiUser.phone,
    gender: apiUser.gender,
    password: apiUser.password
});

export const transformApiProductToForm = (apiProduct) => ({
    title: apiProduct.title,
    description: apiProduct.description,
    tutorName: apiProduct.mentor,
    position: apiProduct.rolementor,
    company: apiProduct.company,
    rating: apiProduct.rating.toString(),
    reviewCount: apiProduct.reviewCount.toString(),
    price: apiProduct.price.replace('K', ''),
    category: apiProduct.category,
    courseImage: apiProduct.photos,
    tutorImage: apiProduct.avatar
});

export default { usersAPI, productsAPI };