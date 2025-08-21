import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { coursesAPI, transformProductData } from '../../services/nodeApiService';

// Initial state
const initialState = {
    courses: [],
    loading: false,
    error: null,
    activeCategory: 'Semua Kelas',
};

// Async thunks untuk handle API calls
export const fetchCourses = createAsyncThunk(
    'courses/fetchCourses',
    async (params = {}, { rejectWithValue }) => {
        try {
            const response = await coursesAPI.getAll(params);
            
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
                reviewCount: course.review_count,
                price: course.price,
                category: course.category,
                createdAt: course.created_at,
                updatedAt: course.updated_at
            }));
            
            return transformedCourses;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to fetch courses');
        }
    }
);

export const fetchCoursesByCategory = createAsyncThunk(
    'courses/fetchCoursesByCategory',
    async (category, { rejectWithValue }) => {
        try {
            const response = await coursesAPI.getByCategory(category);
            
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
                reviewCount: course.review_count,
                price: course.price,
                category: course.category,
                createdAt: course.created_at,
                updatedAt: course.updated_at
            }));
            
            return transformedCourses;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to fetch courses by category');
        }
    }
);

export const addCourse = createAsyncThunk(
    'courses/addCourse',
    async (courseData, { rejectWithValue }) => {
        try {
            // Transform form data to API format
            const apiData = transformProductData(courseData);
            const response = await coursesAPI.create(apiData);
            
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
                reviewCount: response.review_count,
                price: response.price,
                category: response.category,
                createdAt: response.created_at,
                updatedAt: response.updated_at
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
            const response = await coursesAPI.update(id, apiData);
            
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
                reviewCount: response.review_count,
                price: response.price,
                category: response.category,
                createdAt: response.created_at,
                updatedAt: response.updated_at
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
            await coursesAPI.delete(courseId);
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
            const response = await coursesAPI.resetToDefault();
            
            // Transform response to component format
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
                reviewCount: course.review_count,
                price: course.price,
                category: course.category,
                createdAt: course.created_at,
                updatedAt: course.updated_at
            }));
            
            return transformedCourses;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to reset courses');
        }
    }
);

// Reducer
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
                state.courses = action.payload;
                state.error = null;
            })
            .addCase(fetchCourses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            
            // Handle fetchCoursesByCategory
            .addCase(fetchCoursesByCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCoursesByCategory.fulfilled, (state, action) => {
                state.loading = false;
                state.courses = action.payload;
                state.error = null;
            })
            .addCase(fetchCoursesByCategory.rejected, (state, action) => {
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
                state.courses.push(action.payload);
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
                    state.courses[index] = action.payload;
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
                state.courses = state.courses.filter(course => course.id !== action.payload);
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