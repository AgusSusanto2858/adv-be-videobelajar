import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux"; // Import Redux hooks
import Navbar from "../components/organisms/Navbar";
import PasswordInput from "../components/atoms/PasswordInput";
import { loginUser, clearAuthError } from "../store/redux/authSlice"; // Import Redux actions

export default function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    
    // Menggunakan useSelector untuk mengambil data dari Redux state
    const { loading: isLoading, error: authError } = useSelector(state => state.auth);

    // Check for message from register page
    useEffect(() => {
        if (location.state?.message) {
            setSuccessMessage(location.state.message);
            
            // Auto-fill email if provided
            if (location.state?.email) {
                setFormData(prev => ({
                    ...prev,
                    email: location.state.email
                }));
            }
            
            // Clear message after 5 seconds
            setTimeout(() => {
                setSuccessMessage('');
            }, 5000);
        }
    }, [location.state]);

    // Clear auth error when component unmounts or error changes
    useEffect(() => {
        return () => {
            dispatch(clearAuthError());
        };
    }, [dispatch]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
        // Clear auth error
        if (authError) {
            dispatch(clearAuthError());
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.email) {
            newErrors.email = 'Email wajib diisi';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Format email tidak valid';
        }
        
        if (!formData.password) {
            newErrors.password = 'Password wajib diisi';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password minimal 6 karakter';
        }
        
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        
        const newErrors = validateForm();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            // Dispatch Redux action untuk login
            const result = await dispatch(loginUser({
                email: formData.email,
                password: formData.password
            })).unwrap();

            // Login successful, redirect based on role
            if (result.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/', { state: { isLoggedIn: true, user: result } });
            }
        } catch (error) {
            // Error sudah dihandle oleh Redux, akan muncul di authError
            console.error('Login error:', error);
        }
    };

    const handleGoToRegister = () => {
        navigate('/register');
    };

    return (
        <>
            <Navbar 
                isLoggedIn={false} 
                user={null}
            />

            <div className="min-h-screen bg-yellow-50/80 font-sans">
                {/* Main Content - Same as Register */}
                <div className="flex justify-center items-center px-5 md:px-30 py-16 min-h-screen">
                    <div className="w-full max-w-lg bg-white rounded border border-gray-200 p-6 md:p-9 shadow-sm">
                        {/* Header */}
                        <div className="text-center mb-9">
                            <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-2">
                                Masuk ke Akun
                            </h2>
                            <p className="text-sm md:text-base text-gray-500">
                                Yuk, lanjutin belajarmu di videobelajar.
                            </p>
                        </div>

                        {/* Admin Login Info */}
                        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                            <p className="text-xs text-blue-600">
                                <strong>Admin:</strong> admin@videobelajar.com / admin123<br/>
                                <strong>Demo:</strong> user@example.com / 123456<br/>
                                <strong>API User:</strong> Daftar dengan register atau gunakan email dari MockAPI
                            </p>
                        </div>

                        {/* Success Message */}
                        {successMessage && (
                            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
                                <p className="text-sm text-green-600">{successMessage}</p>
                            </div>
                        )}

                        {/* Error Message dari Redux */}
                        {authError && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                                <p className="text-sm text-red-600">{authError}</p>
                            </div>
                        )}

                        {/* Form */}
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-6">
                                {/* Email */}
                                <div>
                                    <label
                                        className="block text-sm md:text-base text-gray-500 mb-2"
                                        htmlFor="email"
                                    >
                                        E-Mail <span className="text-orange-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className={`w-full h-12 px-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent ${
                                            errors.email ? 'border-red-300' : 'border-gray-200'
                                        }`}
                                        required
                                    />
                                    {errors.email && (
                                        <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                                    )}
                                </div>

                                {/* Password - Using PasswordInput Component */}
                                <div>
                                    <PasswordInput 
                                        label="Kata Sandi" 
                                        name="password" 
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        required 
                                        className={errors.password ? 'border-red-300' : ''}
                                    />
                                    {errors.password && (
                                        <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                                    )}
                                </div>

                                {/* Forgot Password Link */}
                                <div className="text-right">
                                    <a
                                        href="#"
                                        className="text-sm md:text-base text-gray-500 hover:text-gray-700 underline cursor-pointer"
                                    >
                                        Lupa Password?
                                    </a>
                                </div>

                                {/* Submit Buttons */}
                                <div className="space-y-4">
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full h-11 bg-green-400 text-white font-bold rounded-lg hover:bg-green-500 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isLoading ? 'Memproses...' : 'Masuk'}
                                    </button>
                                    <button
                                        type="button" 
                                        onClick={handleGoToRegister}
                                        className="w-full h-11 bg-green-100 text-green-400 font-bold rounded-lg hover:bg-green-200 transition-colors flex items-center justify-center cursor-pointer"
                                    >
                                        Daftar
                                    </button>
                                </div>
                            </div>
                        </form>

                        {/* Divider */}
                        <div className="flex items-center justify-center my-6">
                            <div className="flex-1 h-0.5 bg-gray-200"></div>
                            <div className="px-4 bg-white">
                                <p className="text-sm md:text-base text-gray-600">atau</p>
                            </div>
                            <div className="flex-1 h-0.5 bg-gray-200"></div>
                        </div>

                        {/* Google Sign In */}
                        <button
                            type="button"
                            className="w-full h-11 flex items-center justify-center gap-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                        >
                            <svg
                                className="w-4 h-4"
                                height="24"
                                viewBox="0 0 24 24"
                                width="24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    fill="#4285F4"
                                />
                                <path
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    fill="#34A853"
                                />
                                <path
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    fill="#FBBC05"
                                />
                                <path
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    fill="#EA4335"
                                />
                                <path d="M1 1h22v22H1z" fill="none" />
                            </svg>
                            <span className="text-sm md:text-base text-gray-700 font-bold">
                                Masuk dengan Google
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}