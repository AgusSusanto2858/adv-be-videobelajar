import React, { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Navbar({ isLoggedIn = false, user = null, onLogout }) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const handleLogout = () => {
        const confirmLogout = window.confirm("Apakah Anda yakin ingin keluar?");
        if (confirmLogout) {
            // Clear localStorage
            localStorage.removeItem('user');
            localStorage.removeItem('isLoggedIn');
            
            // Call parent logout handler if provided
            if (onLogout) {
                onLogout();
            }
        }
        setIsDropdownOpen(false);
        setIsMobileMenuOpen(false);
    };

    return (
        <>
            <header className="bg-white shadow-sm">
                <div className="container mx-auto max-w-[1200px] px-4 md:px-6 lg:px-10 py-4 flex justify-between items-center">
                    {/* Logo */}
                    <Link to="/" className="cursor-pointer">
                        <img src="/images/logo.png" alt="Logo" className="h-6 md:h-8" />
                    </Link>
                    
                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center">
                        {isLoggedIn ? (
                            // Navbar setelah login - Desktop
                            <div className="flex items-center space-x-5 md:space-x-7">
                                <a href="#" className="text-gray-500 hover:text-gray-900 text-sm md:text-base cursor-pointer">
                                    Kategori
                                </a>
                                <div className="relative">
                                    <img 
                                        src="/images/avatar.png" 
                                        alt="User Avatar"
                                        className="h-8 w-8 md:h-12 md:w-12 rounded-md cursor-pointer hover:opacity-80 transition-opacity" 
                                        onClick={toggleDropdown}
                                        onError={(e) => {
                                            e.target.src = '/images/placeholder.png';
                                        }}
                                    />
                                    {isDropdownOpen && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                                            <p className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
                                                Hi, {user?.name || 'User'}
                                            </p>
                                            <Link 
                                                to="/profile" 
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                                            >
                                                Profile
                                            </Link>
                                            <hr />
                                            <button 
                                                onClick={handleLogout}
                                                className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 cursor-pointer"
                                            >
                                                Logout
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            // Navbar sebelum login - Desktop
                            <div className="flex items-center space-x-3">
                                <Link 
                                    to="/login"
                                    className="bg-green-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-600 transition-colors cursor-pointer"
                                >
                                    Login
                                </Link>
                                <Link 
                                    to="/register"
                                    className="border border-green-500 text-green-500 px-4 py-2 rounded-md text-sm font-medium hover:bg-green-50 transition-colors cursor-pointer"
                                >
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Hamburger Menu Button */}
                    <button 
                        className="md:hidden flex flex-col space-y-1 p-2 cursor-pointer hover:bg-gray-50 rounded transition-colors"
                        onClick={toggleMobileMenu}
                        aria-label="Toggle mobile menu"
                    >
                        <div className="w-5 h-0.5 bg-gray-600"></div>
                        <div className="w-5 h-0.5 bg-gray-600"></div>
                        <div className="w-5 h-0.5 bg-gray-600"></div>
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden bg-white border-t border-gray-200">
                        <div className="px-4 py-4 space-y-4">
                            {isLoggedIn ? (
                                // Mobile menu untuk user yang sudah login
                                <>
                                    <div className="flex items-center space-x-3 pb-4 border-b border-gray-100">
                                        <img 
                                            src="/images/avatar.png" 
                                            alt="User Avatar"
                                            className="h-10 w-10 rounded-md"
                                            onError={(e) => {
                                                e.target.src = '/images/placeholder.png';
                                            }}
                                        />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">
                                                Hi, {user?.name || 'User'}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {user?.email || 'user@example.com'}
                                            </p>
                                        </div>
                                    </div>
                                    <a 
                                        href="#" 
                                        className="block text-gray-700 hover:text-gray-900 py-2 cursor-pointer transition-colors"
                                    >
                                        Kategori
                                    </a>
                                    <Link 
                                        to="/profile" 
                                        className="block text-gray-700 hover:text-gray-900 py-2 cursor-pointer transition-colors"
                                    >
                                        Profile
                                    </Link>
                                    <button 
                                        onClick={handleLogout}
                                        className="block w-full text-left text-red-600 hover:text-red-700 py-2 cursor-pointer transition-colors"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                // Mobile menu untuk guest
                                <>
                                    <Link 
                                        to="/login"
                                        className="block w-full bg-green-500 text-white text-center px-4 py-3 rounded-md font-medium hover:bg-green-600 transition-colors cursor-pointer"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Login
                                    </Link>
                                    <Link 
                                        to="/register"
                                        className="block w-full border border-green-500 text-green-500 text-center px-4 py-3 rounded-md font-medium hover:bg-green-50 transition-colors cursor-pointer"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Register
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </header>
        </>
    )
}