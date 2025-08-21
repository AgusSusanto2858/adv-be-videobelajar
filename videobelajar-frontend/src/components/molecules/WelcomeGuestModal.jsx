import React from 'react'

export default function WelcomeGuestModal({ isOpen, onConfirm }) {
    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>
            
            {/* Modal */}
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
                    {/* Modal Header */}
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex items-center gap-3">
                            {/* Welcome Icon */}
                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">
                                Selamat Datang, Guest!
                            </h3>
                        </div>
                    </div>
                    
                    {/* Modal Body */}
                    <div className="p-6">
                        <div className="space-y-4">
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium text-blue-900 mb-1">
                                            Informasi Mode Guest
                                        </h4>
                                        <p className="text-sm text-blue-700">
                                            Anda sekarang masuk sebagai Guest. Fitur ini dibuat untuk <strong>uji coba halaman</strong> antara kondisi login dan tidak login.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                <h4 className="text-sm font-medium text-gray-900">Sebagai Guest, Anda dapat:</h4>
                                <ul className="text-sm text-gray-600 space-y-1">
                                    <li className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                                        Menjelajahi semua konten pembelajaran
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                                        Mengakses menu navigasi pengguna
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                                        Melihat tampilan interface untuk user login
                                    </li>
                                </ul>
                            </div>

                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                                <p className="text-xs text-yellow-800">
                                    <strong>Catatan:</strong> Mode Guest ini hanya untuk pengujian/iseng-iseng.
                                </p>
                            </div>
                        </div>
                        
                        {/* Modal Action */}
                        <div className="flex justify-center mt-6">
                            <button
                                onClick={onConfirm}
                                className="px-6 py-2.5 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 transition-colors cursor-pointer"
                            >
                                Mulai Jelajahi sebagai Guest
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}