import { configureStore } from '@reduxjs/toolkit';
import coursesReducer from './coursesSlice';
import usersReducer from './usersSlice';
import authReducer from './authSlice';

const store = configureStore({
    reducer: {
        courses: coursesReducer,
        users: usersReducer,
        auth: authReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST'],
            },
        }),
    devTools: process.env.NODE_ENV !== 'production', // Enable Redux DevTools
});

export default store;