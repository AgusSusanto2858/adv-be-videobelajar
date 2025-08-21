import { productsAPI } from '../services/apiService';

// Default courses data sebagai fallback
const defaultCoursesData = [
    {
        id: 1,
        photos: '/images/cards/card1.png',
        title: "Big 4 Auditor Financial Analyst",
        description: "Mulai transformasi dengan instruktur profesional, harga yang terjangkau, dan sistem pembelajaran yang mudah dipahami.",
        avatar: '/images/tutors/tutor-card1.png',
        mentor: "Jenna Ortega",
        rolementor: "Senior Accountant",
        company: "Gojek",
        rating: 4.5,
        reviewCount: 126,
        price: "300K",
        category: "Bisnis"
    },
    {
        id: 2,
        photos: '/images/cards/card2.png',
        title: "Digital Marketing Strategy",
        description: "Pelajari strategi pemasaran digital yang efektif untuk meningkatkan brand awareness dan konversi.",
        avatar: '/images/tutors/tutor-card2.png',
        mentor: "Sarah Johnson",
        rolementor: "Marketing Director",
        company: "Tokopedia",
        rating: 4.2,
        reviewCount: 98,
        price: "250K",
        category: "Pemasaran"
    },
    {
        id: 3,
        photos: '/images/cards/card3.png',
        title: "UI/UX Design Fundamentals",
        description: "Kuasai dasar-dasar desain UI/UX untuk menciptakan pengalaman pengguna yang luar biasa.",
        avatar: '/images/tutors/tutor-card3.png',
        mentor: "Michael Chen",
        rolementor: "Lead Designer",
        company: "Grab",
        rating: 4.7,
        reviewCount: 204,
        price: "400K",
        category: "Desain"
    }
];

// Transform API data to match component props
const transformApiDataForComponents = (apiData) => {
    return apiData.map(item => ({
        id: item.id,
        courseImage: item.photos,
        title: item.title,
        description: item.description,
        tutorImage: item.avatar,
        tutorName: item.mentor,
        position: item.rolementor,
        company: item.company,
        rating: item.rating,
        reviewCount: item.reviewCount,
        price: item.price,
        category: item.category
    }));
};

// Cache untuk menghindari multiple API calls
let coursesCache = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 30000; // 30 seconds cache

// Function to get all courses from API
export const getAllCourses = async () => {
    // Use cache if still valid
    const now = Date.now();
    if (coursesCache && (now - cacheTimestamp) < CACHE_DURATION) {
        return coursesCache;
    }

    try {
        const apiData = await productsAPI.getAll();
        const transformedData = transformApiDataForComponents(apiData);
        
        // Update cache
        coursesCache = transformedData;
        cacheTimestamp = now;
        
        return transformedData;
    } catch (error) {
        console.error('Error fetching courses from API:', error);
        
        // Return default data as fallback
        const transformedDefault = transformApiDataForComponents(defaultCoursesData);
        coursesCache = transformedDefault;
        cacheTimestamp = now;
        
        return transformedDefault;
    }
};

// Function to get courses by category
export const getCoursesByCategory = async (category) => {
    try {
        const apiData = await productsAPI.getByCategory(category);
        return transformApiDataForComponents(apiData);
    } catch (error) {
        console.error('Error fetching courses by category:', error);
        
        // Fallback to default data filtered by category
        const defaultTransformed = transformApiDataForComponents(defaultCoursesData);
        if (category === 'Semua Kelas') return defaultTransformed;
        return defaultTransformed.filter(course => course.category === category);
    }
};

// Function to get featured courses
export const getFeaturedCourses = async (limit = 6) => {
    try {
        const allCourses = await getAllCourses();
        return allCourses.slice(0, limit);
    } catch (error) {
        console.error('Error fetching featured courses:', error);
        return transformApiDataForComponents(defaultCoursesData).slice(0, limit);
    }
};

// Function to add new course via API
export const addCourse = async (courseData) => {
    try {
        const newCourse = await productsAPI.create(courseData);
        clearCache(); // Clear cache to force refresh
        return newCourse;
    } catch (error) {
        console.error('Error adding course:', error);
        throw error;
    }
};

// Function to update course via API
export const updateCourse = async (id, courseData) => {
    try {
        const updatedCourse = await productsAPI.update(id, courseData);
        clearCache(); // Clear cache to force refresh
        return updatedCourse;
    } catch (error) {
        console.error('Error updating course:', error);
        throw error;
    }
};

// Function to delete course via API
export const deleteCourse = async (id) => {
    try {
        await productsAPI.delete(id);
        clearCache(); // Clear cache to force refresh
        return true;
    } catch (error) {
        console.error('Error deleting course:', error);
        throw error;
    }
};

// Function to reset courses to default (populate API with default data)
export const resetToDefaultCourses = async () => {
    try {
        // First, get all existing courses and delete them
        const existingCourses = await productsAPI.getAll();
        
        // Delete all existing courses
        for (const course of existingCourses) {
            await productsAPI.delete(course.id);
        }
        
        // Add default courses
        for (const course of defaultCoursesData) {
            const { id, ...courseWithoutId } = course; // Remove id as API will generate it
            await productsAPI.create(courseWithoutId);
        }
        
        clearCache(); // Clear cache to force refresh
        console.log('✅ Default courses reset successfully!');
        return true;
    } catch (error) {
        console.error('Error resetting courses:', error);
        throw error;
    }
};

// Clear cache function
const clearCache = () => {
    coursesCache = null;
    cacheTimestamp = 0;
};

// Function to refresh courses data and clear cache
export const refreshCoursesData = () => {
    clearCache();
    return getAllCourses();
};

export const categories = [
    'Semua Kelas',
    'Pemasaran', 
    'Desain', 
    'Pengembangan Diri', 
    'Bisnis'
];

// Backward compatibility - keep existing exports but make them async-aware
export const coursesData = getAllCourses(); // This returns a Promise now

export default {
    getAllCourses,
    getCoursesByCategory,
    getFeaturedCourses,
    addCourse,
    updateCourse,
    deleteCourse,
    resetToDefaultCourses,
    refreshCoursesData,
    categories
};