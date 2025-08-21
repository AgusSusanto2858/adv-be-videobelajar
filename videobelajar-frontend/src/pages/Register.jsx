import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux"; // Import Redux hooks
import Navbar from "../components/organisms/Navbar";
import PasswordInput from "../components/atoms/PasswordInput";
import { registerUser, clearAuthError } from "../store/redux/authSlice"; // Import Redux actions

export default function Register() {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        gender: '',
        phoneNumber: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    // Menggunakan useSelector untuk mengambil data dari Redux state
    const { loading: isLoading, error: authError } = useSelector(state => state.auth);

    // Clear auth error when component mounts
    useEffect(() => {
        dispatch(clearAuthError());
        
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
        
        if (!formData.fullName.trim()) {
            newErrors.fullName = 'Nama lengkap wajib diisi';
        }
        
        if (!formData.email) {
            newErrors.email = 'Email wajib diisi';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Format email tidak valid';
        }
        
        if (!formData.gender) {
            newErrors.gender = 'Jenis kelamin wajib dipilih';
        }
        
        if (!formData.phoneNumber) {
            newErrors.phoneNumber = 'Nomor HP wajib diisi';
        } else if (!/^\d{10,13}$/.test(formData.phoneNumber)) {
            newErrors.phoneNumber = 'Nomor HP harus berupa angka 10-13 digit';
        }
        
        if (!formData.password) {
            newErrors.password = 'Password wajib diisi';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password minimal 6 karakter';
        }
        
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Konfirmasi password wajib diisi';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Password tidak cocok';
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
            // Dispatch Redux action untuk register
            await dispatch(registerUser(formData)).unwrap();
            
            // Registration successful
            setSuccessMessage('Pendaftaran berhasil! Redirecting to login...');
            
            // Reset form
            setFormData({
                fullName: '',
                email: '',
                gender: '',
                phoneNumber: '',
                password: '',
                confirmPassword: ''
            });
            
            // Redirect after 2 seconds
            setTimeout(() => {
                navigate('/login', { 
                    state: { 
                        message: 'Pendaftaran berhasil! Silakan login dengan akun baru Anda.',
                        email: formData.email
                    } 
                });
            }, 2000);
            
        } catch (error) {
            // Error sudah dihandle oleh Redux, akan muncul di authError
            console.error('Registration error:', error);
        }
    };

    const handleGoToLogin = () => {
        navigate('/login');
    };

    return (
        <>
            <Navbar 
                isLoggedIn={false} 
                user={null}
            />

            <div className="min-h-screen bg-yellow-50/80 font-sans">
                {/* Main Content */}
                <div className="flex justify-center items-center px-5 md:px-30 py-16 min-h-screen">
                    <div className="w-full max-w-lg bg-white rounded border border-gray-200 p-6 md:p-9 shadow-sm">
                        {/* Header */}
                        <div className="text-center mb-9">
                            <h3 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-2">
                                Pendaftaran Akun
                            </h3>
                            <p className="text-sm md:text-base text-gray-500">
                                Yuk, daftarkan akunmu sekarang juga!
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
                                {/* Full Name */}
                                <div>
                                    <label className="block text-sm md:text-base text-gray-500 mb-2">
                                        Nama Lengkap <span className="text-orange-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleInputChange}
                                        className={`w-full h-12 px-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent ${
                                            errors.fullName ? 'border-red-300' : 'border-gray-200'
                                        }`}
                                        required
                                    />
                                    {errors.fullName && (
                                        <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
                                    )}
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="block text-sm md:text-base text-gray-500 mb-2">
                                        E-Mail <span className="text-orange-500">*</span>
                                    </label>
                                    <input
                                        type="email"
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

                                {/* Gender */}
                                <div>
                                    <label className="block text-sm md:text-base text-gray-500 mb-2">
                                        Jenis Kelamin <span className="text-orange-500">*</span>
                                    </label>
                                    <select
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleInputChange}
                                        className={`w-full h-12 px-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent cursor-pointer ${
                                            errors.gender ? 'border-red-300' : 'border-gray-200'
                                        }`}
                                        required
                                    >
                                        <option value="">Pilih Jenis Kelamin</option>
                                        <option value="Laki-laki">Laki-laki</option>
                                        <option value="Perempuan">Perempuan</option>
                                    </select>
                                    {errors.gender && (
                                        <p className="mt-1 text-sm text-red-600">{errors.gender}</p>
                                    )}
                                </div>

                                {/* Phone Number */}
                                <div>
                                    <label className="block text-sm md:text-base text-gray-500 mb-2">
                                        No. Hp <span className="text-orange-500">*</span>
                                    </label>
                                    <div className="flex gap-2">
                                        <div className="flex items-center border border-gray-200 rounded-md flex-shrink-0">
                                            <div className="flex items-center justify-center w-8 sm:w-11 h-12 border-r border-gray-200 px-1 sm:px-2">
                                                <span className="text-sm sm:text-lg">🇮🇩</span>
                                            </div>
                                            <select className="w-12 sm:w-20 h-12 border-none focus:outline-none text-xs sm:text-sm cursor-pointer">
                                                <option value="+62">+62</option>
                                            </select>
                                        </div>
                                        <input
                                            type="tel"
                                            name="phoneNumber"
                                            value={formData.phoneNumber}
                                            onChange={handleInputChange}
                                            className={`flex-1 min-w-0 h-12 px-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent ${
                                                errors.phoneNumber ? 'border-red-300' : 'border-gray-200'
                                            }`}
                                            required
                                        />
                                    </div>
                                    {errors.phoneNumber && (
                                        <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>
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

                                {/* Confirm Password - Using PasswordInput Component */}
                                <div>
                                    <PasswordInput 
                                        label="Konfirmasi Kata Sandi" 
                                        name="confirmPassword" 
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        required 
                                        className={errors.confirmPassword ? 'border-red-300' : ''}
                                    />
                                    {errors.confirmPassword && (
                                        <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                                    )}
                                </div>

                                {/* Submit Buttons */}
                                <div className="space-y-4">
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full h-11 bg-green-400 text-white font-bold rounded-lg hover:bg-green-500 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isLoading ? 'Mendaftar...' : 'Daftar'}
                                    </button>
                                    <button
                                        type="button" 
                                        onClick={handleGoToLogin}
                                        className="w-full h-11 bg-green-100 text-green-400 font-bold rounded-lg hover:bg-green-200 transition-colors flex items-center justify-center cursor-pointer"
                                    >
                                        Masuk
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

                        {/* Google Sign Up */}
                        <button
                            type="button"
                            className="w-full h-11 flex items-center justify-center gap-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                        >
                            <svg className="w-4 h-4" viewBox="0 0 24 24">
                                <path
                                    fill="#4285F4"
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                />
                                <path
                                    fill="#34A853"
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                />
                                <path
                                    fill="#FBBC05"
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                />
                                <path
                                    fill="#EA4335"
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                />
                            </svg>
                            <span className="text-sm md:text-base text-gray-700 font-bold">
                                Daftar dengan Google
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}