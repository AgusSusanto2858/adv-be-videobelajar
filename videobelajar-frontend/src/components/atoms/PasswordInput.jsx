import React, { useState } from "react";

const EyeIcon = () => (
    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
    </svg>
);

const EyeOffIcon = () => (
    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
        <line x1="1" y1="1" x2="23" y2="23" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
    </svg>
);

export default function PasswordInput({ 
    label, 
    name, 
    value = "",
    onChange,
    required = false, 
    className = "",
    placeholder = "",
    ...props 
}) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div>
            <label className="block text-sm md:text-base text-gray-500 mb-2">
                {label} {required && <span className="text-orange-500">*</span>}
            </label>
            <div className="relative">
                <input
                    type={showPassword ? "text" : "password"}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className={`w-full h-12 px-3 pr-12 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent ${className}`}
                    required={required}
                    {...props}
                />
                <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center justify-center w-12 h-12 hover:bg-gray-50 rounded-r-md transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                >
                    {showPassword ? <EyeIcon /> : <EyeOffIcon />}
                </button>
            </div>
        </div>
    );
}