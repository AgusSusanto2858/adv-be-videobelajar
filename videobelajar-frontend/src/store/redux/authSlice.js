import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { usersAPI, transformUserData } from '../../services/apiService';

// Initial state untuk authentication
const initialState = {
    user: null,
    isLoggedIn: false,
    loading: false,
    error: null,
};

// Async thunk untuk login
export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async ({ email, password }, { rejectWithValue }) => {
        try {
            // Check hardcoded accounts first
            if (email === "admin@videobelajar.com" && password === "admin123") {
                return {
                    id: 'admin',
                    name: 'Administrator',
                    email: email,
                    role: 'admin'
                };
            }

            if (email === "user@example.com" && password === "123456") {
                return {
                    id: 'demo',
                    name: 'Demo User',
                    email: email,
                    role: 'user'
                };
            }

            // Check API users
            const user = await usersAPI.findByEmail(email);
            if (user && user.password === password) {
                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    gender: user.gender,
                    phone: user.phone,
                    role: user.role || 'user'
                };
            } else {
                return rejectWithValue('Email atau password salah');
            }
        } catch (error) {
            return rejectWithValue('Terjadi kesalahan saat login');
        }
    }
);

// Async thunk untuk register
export const registerUser = createAsyncThunk(
    'auth/registerUser',
    async (userData, { rejectWithValue }) => {
        try {
            // Check if email already exists
            const emailExists = await usersAPI.emailExists(userData.email);
            if (emailExists) {
                return rejectWithValue('Email sudah terdaftar. Silakan gunakan email lain.');
            }

            // Transform form data to API format
            const transformedData = transformUserData(userData);
            
            // Create user via API
            const newUser = await usersAPI.create(transformedData);
            return newUser;
        } catch (error) {
            return rejectWithValue('Terjadi kesalahan saat mendaftar. Silakan coba lagi.');
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
                // Save to localStorage
                localStorage.setItem('user', JSON.stringify(action.payload));
                localStorage.setItem('isLoggedIn', 'true');
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.isLoggedIn = false;
                state.user = null;
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
            });
    }
});

export const { logout, clearAuthError, setUserFromStorage, setGuestUser } = authSlice.actions;
export default authSlice.reducer;