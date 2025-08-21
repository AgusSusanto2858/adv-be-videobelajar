import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authAPI, transformUserData } from '../../services/nodeApiService';

// Initial state untuk authentication
const initialState = {
    user: null,
    isLoggedIn: false,
    loading: false,
    error: null,
    token: null,
};

// Async thunk untuk login
export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async ({ email, password }, { rejectWithValue }) => {
        try {
            // Check hardcoded accounts first (for backward compatibility)
            if (email === "admin@videobelajar.com" && password === "admin123") {
                const userData = {
                    id: 'admin',
                    name: 'Administrator',
                    email: email,
                    role: 'admin'
                };
                
                // Save to localStorage for consistency
                localStorage.setItem('user', JSON.stringify(userData));
                localStorage.setItem('isLoggedIn', 'true');
                
                return userData;
            }

            if (email === "user@example.com" && password === "123456") {
                const userData = {
                    id: 'demo',
                    name: 'Demo User',
                    email: email,
                    role: 'user'
                };
                
                // Save to localStorage for consistency
                localStorage.setItem('user', JSON.stringify(userData));
                localStorage.setItem('isLoggedIn', 'true');
                
                return userData;
            }

            // Use Node.js backend API
            const response = await authAPI.login({ email, password });
            
            // Save token and user data to localStorage
            localStorage.setItem('user', JSON.stringify({
                ...response.user,
                token: response.token
            }));
            localStorage.setItem('isLoggedIn', 'true');
            
            return {
                ...response.user,
                token: response.token
            };
            
        } catch (error) {
            return rejectWithValue(error.message || 'Terjadi kesalahan saat login');
        }
    }
);

// Async thunk untuk register
export const registerUser = createAsyncThunk(
    'auth/registerUser',
    async (userData, { rejectWithValue }) => {
        try {
            // Transform form data to API format
            const transformedData = transformUserData(userData);
            
            // Create user via Node.js API
            const newUser = await authAPI.register(transformedData);
            return newUser;
        } catch (error) {
            return rejectWithValue(error.message || 'Terjadi kesalahan saat mendaftar. Silakan coba lagi.');
        }
    }
);

// Async thunk untuk verify token
export const verifyToken = createAsyncThunk(
    'auth/verifyToken',
    async (_, { rejectWithValue }) => {
        try {
            const userData = await authAPI.verifyToken();
            return userData;
        } catch (error) {
            return rejectWithValue(error.message || 'Token tidak valid');
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.isLoggedIn = false;
            state.error = null;
            state.token = null;
            // Clear localStorage
            localStorage.removeItem('user');
            localStorage.removeItem('isLoggedIn');
        },
        clearAuthError: (state) => {
            state.error = null;
        },
        setUserFromStorage: (state, action) => {
            state.user = action.payload;
            state.isLoggedIn = !!action.payload;
            state.token = action.payload?.token || null;
        },
        setGuestUser: (state) => {
            const guestUser = {
                id: 'guest',
                name: 'Guest User',
                email: 'guest@example.com',
                role: 'guest'
            };
            state.user = guestUser;
            state.isLoggedIn = true;
            state.error = null;
            state.token = null;
            // Save guest session to localStorage
            localStorage.setItem('user', JSON.stringify(guestUser));
            localStorage.setItem('isLoggedIn', 'true');
        }
    },
    extraReducers: (builder) => {
        builder
            // Login
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.isLoggedIn = true;
                state.error = null;
                state.token = action.payload.token || null;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.isLoggedIn = false;
                state.user = null;
                state.token = null;
            })
            
            // Register
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                // Don't auto-login after register
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            
            // Verify token
            .addCase(verifyToken.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(verifyToken.fulfilled, (state, action) => {
                state.loading = false;
                state.user = { ...state.user, ...action.payload };
                state.isLoggedIn = true;
                state.error = null;
            })
            .addCase(verifyToken.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                // Clear invalid session
                state.user = null;
                state.isLoggedIn = false;
                state.token = null;
                localStorage.removeItem('user');
                localStorage.removeItem('isLoggedIn');
            });
    }
});

export const { logout, clearAuthError, setUserFromStorage, setGuestUser } = authSlice.actions;
export default authSlice.reducer;