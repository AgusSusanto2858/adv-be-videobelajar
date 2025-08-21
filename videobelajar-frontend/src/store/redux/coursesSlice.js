import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { productsAPI, transformProductData } from '../../services/apiService';

// Initial state - array kosong yang akan diisi data API
const initialState = {
    courses: [], // Array kosong untuk data courses
    loading: false,
    error: null,
    activeCategory: 'Semua Kelas',
};

// Async thunks untuk handle API calls
export const fetchCourses = createAsyncThunk(
    'courses/fetchCourses',
    async (_, { rejectWithValue }) => {
        try {
            const response = await productsAPI.getAll();
            // Transform API data to match component expectations
            const transformedCourses = response.map(course => ({
                id: course.id,
                courseImage: course.photos,
                title: course.title,
                description: course.description,
                tutorImage: course.avatar,
                tutorName: course.mentor,
                position: course.rolementor,
                company: course.company,
                rating: course.rating,
                reviewCount: course.reviewCount,
                price: course.price,
                category: course.category
            }));
            return transformedCourses;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to fetch courses');
        }
    }
);

export const addCourse = createAsyncThunk(
    'courses/addCourse',
    async (courseData, { rejectWithValue }) => {
        try {
            // Transform form data to API format
            const apiData = transformProductData(courseData);
            const response = await productsAPI.create(apiData);
            
            // Transform response back to component format
            return {
                id: response.id,
                courseImage: response.photos,
                title: response.title,
                description: response.description,
                tutorImage: response.avatar,
                tutorName: response.mentor,
                position: response.rolementor,
                company: response.company,
                rating: response.rating,
                reviewCount: response.reviewCount,
                price: response.price,
                category: response.category
            };
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to add course');
        }
    }
);

export const updateCourse = createAsyncThunk(
    'courses/updateCourse',
    async ({ id, courseData }, { rejectWithValue }) => {
        try {
            // Transform form data to API format
            const apiData = transformProductData(courseData);
            const response = await productsAPI.update(id, apiData);
            
            // Transform response back to component format
            return {
                id: response.id,
                courseImage: response.photos,
                title: response.title,
                description: response.description,
                tutorImage: response.avatar,
                tutorName: response.mentor,
                position: response.rolementor,
                company: response.company,
                rating: response.rating,
                reviewCount: response.reviewCount,
                price: response.price,
                category: response.category
            };
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to update course');
        }
    }
);

export const deleteCourse = createAsyncThunk(
    'courses/deleteCourse',
    async (courseId, { rejectWithValue }) => {
        try {
            await productsAPI.delete(courseId);
            return courseId;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to delete course');
        }
    }
);

export const resetCoursesToDefault = createAsyncThunk(
    'courses/resetCoursesToDefault',
    async (_, { rejectWithValue }) => {
        try {
            // Delete all existing courses
            const existingCourses = await productsAPI.getAll();
            for (const course of existingCourses) {
                await productsAPI.delete(course.id);
            }
            
            // Add default courses
            const defaultCourses = [
                {
                    photos: '/images/cards/card1.png',
                    title: "Big 4 Auditor Financial Analyst",
                    description: "Mulai transformasi dengan instruktur profesional, harga yang terjangkau, dan sistem pembelajaran yang mudah dipahami.",
                    mentor: "Jenna Ortega",
                    rolementor: "Senior Accountant",
                    avatar: '/images/tutors/tutor-card1.png',
                    company: "Gojek",
                    rating: 4.5,
                    reviewCount: 126,
                    price: "300K",
                    category: "Bisnis"
                },
                {
                    photos: '/images/cards/card2.png',
                    title: "Digital Marketing Strategy",
                    description: "Pelajari strategi pemasaran digital yang efektif untuk meningkatkan brand awareness dan konversi.",
                    mentor: "Sarah Johnson",
                    rolementor: "Marketing Director",
                    avatar: '/images/tutors/tutor-card2.png',
                    company: "Tokopedia",
                    rating: 4.2,
                    reviewCount: 98,
                    price: "250K",
                    category: "Pemasaran"
                },
                {
                    photos: '/images/cards/card3.png',
                    title: "UI/UX Design Fundamentals",
                    description: "Kuasai dasar-dasar desain UI/UX untuk menciptakan pengalaman pengguna yang luar biasa.",
                    mentor: "Michael Chen",
                    rolementor: "Lead Designer",
                    avatar: '/images/tutors/tutor-card3.png',
                    company: "Grab",
                    rating: 4.7,
                    reviewCount: 204,
                    price: "400K",
                    category: "Desain"
                }
            ];
            
            const newCourses = [];
            for (const course of defaultCourses) {
                const newCourse = await productsAPI.create(course);
                newCourses.push({
                    id: newCourse.id,
                    courseImage: newCourse.photos,
                    title: newCourse.title,
                    description: newCourse.description,
                    tutorImage: newCourse.avatar,
                    tutorName: newCourse.mentor,
                    position: newCourse.rolementor,
                    company: newCourse.company,
                    rating: newCourse.rating,
                    reviewCount: newCourse.reviewCount,
                    price: newCourse.price,
                    category: newCourse.category
                });
            }
            
            return newCourses;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to reset courses');
        }
    }
);

// Reducer untuk menangani data hasil dari API dan menyimpannya ke state global
const coursesSlice = createSlice({
    name: 'courses',
    initialState,
    reducers: {
        // Synchronous actions
        setActiveCategory: (state, action) => {
            state.activeCategory = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        },
        resetCourses: (state) => {
            state.courses = [];
            state.error = null;
            state.loading = false;
        }
    },
    extraReducers: (builder) => {
        // Handle fetchCourses
        builder
            .addCase(fetchCourses.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCourses.fulfilled, (state, action) => {
                state.loading = false;
                state.courses = action.payload; // Menyimpan data API ke state global
                state.error = null;
            })
            .addCase(fetchCourses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            
            // Handle addCourse
            .addCase(addCourse.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addCourse.fulfilled, (state, action) => {
                state.loading = false;
                state.courses.push(action.payload); // Tambah course baru ke state
                state.error = null;
            })
            .addCase(addCourse.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            
            // Handle updateCourse
            .addCase(updateCourse.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateCourse.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.courses.findIndex(course => course.id === action.payload.id);
                if (index !== -1) {
                    state.courses[index] = action.payload; // Update course di state
                }
                state.error = null;
            })
            .addCase(updateCourse.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            
            // Handle deleteCourse
            .addCase(deleteCourse.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteCourse.fulfilled, (state, action) => {
                state.loading = false;
                state.courses = state.courses.filter(course => course.id !== action.payload); // Hapus course dari state
                state.error = null;
            })
            .addCase(deleteCourse.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            
            // Handle resetCoursesToDefault
            .addCase(resetCoursesToDefault.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(resetCoursesToDefault.fulfilled, (state, action) => {
                state.loading = false;
                state.courses = action.payload;
                state.error = null;
            })
            .addCase(resetCoursesToDefault.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { setActiveCategory, clearError, resetCourses } = coursesSlice.actions;
export default coursesSlice.reducer;