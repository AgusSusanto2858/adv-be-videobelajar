import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { usersAPI, transformUserData } from '../../services/nodeApiService';

// Initial state
const initialState = {
    users: [],
    loading: false,
    error: null,
};

// Async thunks untuk Users API
export const fetchUsers = createAsyncThunk(
    'users/fetchUsers',
    async (_, { rejectWithValue }) => {
        try {
            const response = await usersAPI.getAll();
            return response;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to fetch users');
        }
    }
);

export const addUser = createAsyncThunk(
    'users/addUser',
    async (userData, { rejectWithValue }) => {
        try {
            // Transform form data to API format
            const apiData = transformUserData(userData);
            const response = await usersAPI.create(apiData);
            return response;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to add user');
        }
    }
);

export const updateUser = createAsyncThunk(
    'users/updateUser',
    async ({ id, userData }, { rejectWithValue }) => {
        try {
            const response = await usersAPI.update(id, userData);
            return response;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to update user');
        }
    }
);

export const deleteUser = createAsyncThunk(
    'users/deleteUser',
    async (userId, { rejectWithValue }) => {
        try {
            await usersAPI.delete(userId);
            return userId;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to delete user');
        }
    }
);

export const resetUserPassword = createAsyncThunk(
    'users/resetUserPassword',
    async ({ userId, newPassword }, { rejectWithValue }) => {
        try {
            const response = await usersAPI.resetPassword(userId, newPassword);
            return response;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to reset password');
        }
    }
);

// Reducer untuk users
const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        clearUsersError: (state) => {
            state.error = null;
        },
        resetUsers: (state) => {
            state.users = [];
            state.error = null;
            state.loading = false;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch users
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload;
                state.error = null;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            
            // Add user
            .addCase(addUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addUser.fulfilled, (state, action) => {
                state.loading = false;
                state.users.push(action.payload);
                state.error = null;
            })
            .addCase(addUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            
            // Update user
            .addCase(updateUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.users.findIndex(user => user.id === action.payload.id);
                if (index !== -1) {
                    state.users[index] = action.payload;
                }
                state.error = null;
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            
            // Delete user
            .addCase(deleteUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.loading = false;
                state.users = state.users.filter(user => user.id !== action.payload);
                state.error = null;
            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            
            // Reset password
            .addCase(resetUserPassword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(resetUserPassword.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.users.findIndex(user => user.id === action.payload.id);
                if (index !== -1) {
                    state.users[index] = action.payload;
                }
                state.error = null;
            })
            .addCase(resetUserPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { clearUsersError, resetUsers } = usersSlice.actions;
export default usersSlice.reducer;