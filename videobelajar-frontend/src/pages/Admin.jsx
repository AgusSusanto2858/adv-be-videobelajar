import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux' // Import Redux hooks
import { 
    fetchUsers, 
    deleteUser, 
    resetUserPassword 
} from '../store/redux/usersSlice' // Import Redux actions untuk users
import { 
    fetchCourses, 
    addCourse, 
    updateCourse, 
    deleteCourse,
    resetCoursesToDefault 
} from '../store/redux/coursesSlice' // Import Redux actions untuk courses
import { transformProductData, transformApiProductToForm } from '../services/apiService'

// Available images for selection - Using absolute paths for Vercel deployment
const availableCardImages = [
    { id: 1, src: '/images/cards/card1.png', name: 'Card 1' },
    { id: 2, src: '/images/cards/card2.png', name: 'Card 2' },
    { id: 3, src: '/images/cards/card3.png', name: 'Card 3' },
    { id: 4, src: '/images/cards/card4.png', name: 'Card 4' },
    { id: 5, src: '/images/cards/card5.png', name: 'Card 5' },
    { id: 6, src: '/images/cards/card6.png', name: 'Card 6' },
    { id: 7, src: '/images/cards/card7.png', name: 'Card 7' },
    { id: 8, src: '/images/cards/card8.png', name: 'Card 8' },
    { id: 9, src: '/images/cards/card9.png', name: 'Card 9' }
];

const availableTutorImages = [
    { id: 1, src: '/images/tutors/tutor-card1.png', name: 'Tutor 1' },
    { id: 2, src: '/images/tutors/tutor-card2.png', name: 'Tutor 2' },
    { id: 3, src: '/images/tutors/tutor-card3.png', name: 'Tutor 3' },
    { id: 4, src: '/images/tutors/tutor-card4.png', name: 'Tutor 4' },
    { id: 5, src: '/images/tutors/tutor-card5.png', name: 'Tutor 5' },
    { id: 6, src: '/images/tutors/tutor-card6.png', name: 'Tutor 6' },
    { id: 7, src: '/images/tutors/tutor-card7.png', name: 'Tutor 7' },
    { id: 8, src: '/images/tutors/tutor-card8.png', name: 'Tutor 8' },
    { id: 9, src: '/images/tutors/tutor-card9.png', name: 'Tutor 9' }
];

// Image Gallery Modal Component
const ImageGalleryModal = ({ isOpen, onClose, images, onSelect, title }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-auto">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">{title}</h3>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    
                    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {images.map((image) => (
                            <div
                                key={image.id}
                                className="cursor-pointer border-2 border-transparent hover:border-blue-500 rounded-lg p-2 transition-colors"
                                onClick={() => {
                                    onSelect(image.src);
                                    onClose();
                                }}
                            >
                                <img
                                    src={image.src}
                                    alt={image.name}
                                    className="w-full h-20 object-cover rounded"
                                    onError={(e) => {
                                        e.target.src = '/images/placeholder.png';
                                    }}
                                />
                                <p className="text-xs text-center mt-1 text-gray-600">{image.name}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Add Course Modal Component
const AddCourseModal = ({ 
    isOpen, 
    onClose, 
    newCourse, 
    setNewCourse, 
    handleInputChange, 
    onSubmit, 
    errors, 
    editMode = false,
    onSelectCardImage,
    onSelectTutorImage,
    isLoading = false
}) => {
    if (!isOpen) return null;

    const categories = ['Pemasaran', 'Desain', 'Pengembangan Diri', 'Bisnis'];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-4 lg:p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-6">
                        {editMode ? 'Edit Course' : 'Add New Course'}
                    </h3>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Course Title *
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={newCourse.title}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                                    errors.title ? 'border-red-300' : 'border-gray-300'
                                }`}
                                placeholder="Enter course title"
                            />
                            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description *
                            </label>
                            <textarea
                                name="description"
                                value={newCourse.description}
                                onChange={handleInputChange}
                                rows={3}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                                    errors.description ? 'border-red-300' : 'border-gray-300'
                                }`}
                                placeholder="Enter course description"
                            />
                            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Category *
                                </label>
                                <select
                                    name="category"
                                    value={newCourse.category}
                                    onChange={handleInputChange}
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                                        errors.category ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                >
                                    <option value="">Select Category</option>
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                                {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Price (without K) *
                                </label>
                                <input
                                    type="number"
                                    name="price"
                                    value={newCourse.price}
                                    onChange={handleInputChange}
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                                        errors.price ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                    placeholder="e.g., 300"
                                />
                                {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Course Image *
                            </label>
                            <div 
                                className={`border-2 border-dashed rounded-lg p-4 text-center hover:border-gray-400 transition-colors cursor-pointer ${
                                    errors.courseImage ? 'border-red-300' : 'border-gray-300'
                                }`}
                                onClick={onSelectCardImage}
                            >
                                {newCourse.courseImage ? (
                                    <div className="space-y-2">
                                        <img 
                                            src={newCourse.courseImage} 
                                            alt="Course Image" 
                                            className="w-20 h-12 object-cover rounded mx-auto"
                                            onError={(e) => {
                                                e.target.src = '/images/placeholder.png';
                                            }}
                                        />
                                        <p className="text-sm text-gray-600">Click to change image</p>
                                    </div>
                                ) : (
                                    <div className="py-4">
                                        <div className="mx-auto w-12 h-12 text-gray-400">
                                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-2">Click to select course image</p>
                                    </div>
                                )}
                            </div>
                            {errors.courseImage && <p className="text-red-500 text-xs mt-1">{errors.courseImage}</p>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Tutor Name *
                                </label>
                                <input
                                    type="text"
                                    name="tutorName"
                                    value={newCourse.tutorName}
                                    onChange={handleInputChange}
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                                        errors.tutorName ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                    placeholder="Enter tutor name"
                                />
                                {errors.tutorName && <p className="text-red-500 text-xs mt-1">{errors.tutorName}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Tutor Image *
                                </label>
                                <div 
                                    className={`border-2 border-dashed rounded-lg p-2 text-center hover:border-gray-400 transition-colors cursor-pointer ${
                                        errors.tutorImage ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                    onClick={onSelectTutorImage}
                                >
                                    {newCourse.tutorImage ? (
                                        <div className="space-y-1">
                                            <img 
                                                src={newCourse.tutorImage} 
                                                alt="Tutor Image"
                                                className="w-10 h-10 object-cover rounded-full mx-auto"
                                                onError={(e) => {
                                                    e.target.src = '/images/placeholder.png';
                                                }}
                                            />
                                            <p className="text-xs text-gray-600">Click to change</p>
                                        </div>
                                    ) : (
                                        <div className="py-2">
                                            <div className="mx-auto w-8 h-8 text-gray-400">
                                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                            </div>
                                            <p className="text-xs text-gray-600 mt-1">Select tutor image</p>
                                        </div>
                                    )}
                                </div>
                                {errors.tutorImage && <p className="text-red-500 text-xs mt-1">{errors.tutorImage}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Position *
                                </label>
                                <input
                                    type="text"
                                    name="position"
                                    value={newCourse.position}
                                    onChange={handleInputChange}
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                                        errors.position ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                    placeholder="e.g., Senior Developer"
                                />
                                {errors.position && <p className="text-red-500 text-xs mt-1">{errors.position}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Company *
                                </label>
                                <input
                                    type="text"
                                    name="company"
                                    value={newCourse.company}
                                    onChange={handleInputChange}
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                                        errors.company ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                    placeholder="e.g., Google"
                                />
                                {errors.company && <p className="text-red-500 text-xs mt-1">{errors.company}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Rating (1-5) *
                                </label>
                                <input
                                    type="number"
                                    step="0.1"
                                    min="1"
                                    max="5"
                                    name="rating"
                                    value={newCourse.rating}
                                    onChange={handleInputChange}
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                                        errors.rating ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                />
                                {errors.rating && <p className="text-red-500 text-xs mt-1">{errors.rating}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Review Count *
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    name="reviewCount"
                                    value={newCourse.reviewCount}
                                    onChange={handleInputChange}
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                                        errors.reviewCount ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                    placeholder="e.g., 126"
                                />
                                {errors.reviewCount && <p className="text-red-500 text-xs mt-1">{errors.reviewCount}</p>}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 mt-6">
                        <button
                            onClick={onClose}
                            className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition-colors"
                            disabled={isLoading}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onSubmit}
                            className="flex-1 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Processing...' : (editMode ? 'Update Course' : 'Add Course')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function Admin() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    // Menggunakan useSelector untuk mengambil data dari Redux state
    const { 
        users, 
        loading: usersLoading, 
        error: usersError 
    } = useSelector(state => state.users);
    
    const { 
        courses, 
        loading: coursesLoading, 
        error: coursesError 
    } = useSelector(state => state.courses);

    const [activeTab, setActiveTab] = useState('dashboard');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [editingUser, setEditingUser] = useState(null);
    const [newPassword, setNewPassword] = useState('');
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    
    // Course form state
    const [newCourse, setNewCourse] = useState({
        title: '',
        description: '',
        tutorName: '',
        position: '',
        company: '',
        rating: '',
        reviewCount: '',
        price: '',
        category: '',
        courseImage: '',
        tutorImage: ''
    });
    
    const [editCourse, setEditCourse] = useState(null);
    const [errors, setErrors] = useState({});
    
    // Modal states
    const [showAddCourseModal, setShowAddCourseModal] = useState(false);
    const [showEditCourseModal, setShowEditCourseModal] = useState(false);
    const [showCardGallery, setShowCardGallery] = useState(false);
    const [showTutorGallery, setShowTutorGallery] = useState(false);

    // Load data on component mount menggunakan Redux
    useEffect(() => {
        dispatch(fetchUsers());
        dispatch(fetchCourses());
    }, [dispatch]);

    const handleDeleteUser = (user) => {
        setDeleteTarget({ ...user, type: 'user' });
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!deleteTarget) return;
        
        try {
            if (deleteTarget.type === 'user') {
                await dispatch(deleteUser(deleteTarget.id)).unwrap();
            } else if (deleteTarget.type === 'course') {
                await dispatch(deleteCourse(deleteTarget.id)).unwrap();
            }
            
            alert(`${deleteTarget.type === 'user' ? 'User' : 'Course'} berhasil dihapus!`);
        } catch (error) {
            console.error('Error deleting:', error);
            alert('Terjadi kesalahan saat menghapus. Silakan coba lagi.');
        } finally {
            setShowDeleteModal(false);
            setDeleteTarget(null);
        }
    };

    const handleResetPassword = async (userId) => {
        if (newPassword.length < 6) {
            alert('Password minimal 6 karakter');
            return;
        }
        
        try {
            await dispatch(resetUserPassword({ userId, newPassword })).unwrap();
            setEditingUser(null);
            setNewPassword('');
            alert('Password berhasil direset!');
        } catch (error) {
            console.error('Error resetting password:', error);
            alert('Terjadi kesalahan saat mereset password.');
        }
    };

    const validateCourseForm = () => {
        const newErrors = {};
        
        if (!newCourse.title.trim()) newErrors.title = 'Title wajib diisi';
        if (!newCourse.description.trim()) newErrors.description = 'Description wajib diisi';
        if (!newCourse.tutorName.trim()) newErrors.tutorName = 'Nama tutor wajib diisi';
        if (!newCourse.position.trim()) newErrors.position = 'Position wajib diisi';
        if (!newCourse.company.trim()) newErrors.company = 'Company wajib diisi';
        if (!newCourse.rating || newCourse.rating < 1 || newCourse.rating > 5) {
            newErrors.rating = 'Rating harus antara 1-5';
        }
        if (!newCourse.reviewCount || newCourse.reviewCount < 1) {
            newErrors.reviewCount = 'Review count harus lebih dari 0';
        }
        if (!newCourse.price || newCourse.price < 1) {
            newErrors.price = 'Price harus lebih dari 0';
        }
        if (!newCourse.category) newErrors.category = 'Category wajib dipilih';
        if (!newCourse.courseImage) newErrors.courseImage = 'Course image wajib dipilih';
        if (!newCourse.tutorImage) newErrors.tutorImage = 'Tutor image wajib dipilih';
        
        return newErrors;
    };

    const handleAddCourse = async () => {
        const validationErrors = validateCourseForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            await dispatch(addCourse(newCourse)).unwrap();
            
            // Reset form
            setNewCourse({
                title: '',
                description: '',
                tutorName: '',
                position: '',
                company: '',
                rating: '',
                reviewCount: '',
                price: '',
                category: '',
                courseImage: '',
                tutorImage: ''
            });
            setErrors({});
            setShowAddCourseModal(false);
            alert('Course berhasil ditambahkan!');
        } catch (error) {
            console.error('Error adding course:', error);
            alert('Terjadi kesalahan saat menambahkan course.');
        }
    };

    const handleEditCourse = (course) => {
        setEditCourse(course);
        setNewCourse({
            title: course.title,
            description: course.description,
            tutorName: course.tutorName,
            position: course.position,
            company: course.company,
            rating: course.rating.toString(),
            reviewCount: course.reviewCount.toString(),
            price: course.price.replace('K', ''),
            category: course.category,
            courseImage: course.courseImage,
            tutorImage: course.tutorImage
        });
        setShowEditCourseModal(true);
    };

    const handleUpdateCourse = async () => {
        const validationErrors = validateCourseForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            await dispatch(updateCourse({ 
                id: editCourse.id, 
                courseData: newCourse 
            })).unwrap();
            
            // Reset form
            setEditCourse(null);
            setNewCourse({
                title: '',
                description: '',
                tutorName: '',
                position: '',
                company: '',
                rating: '',
                reviewCount: '',
                price: '',
                category: '',
                courseImage: '',
                tutorImage: ''
            });
            setErrors({});
            setShowEditCourseModal(false);
            alert('Course berhasil diupdate!');
        } catch (error) {
            console.error('Error updating course:', error);
            alert('Terjadi kesalahan saat mengupdate course.');
        }
    };

    const handleDeleteCourse = (course) => {
        setDeleteTarget({ ...course, type: 'course' });
        setShowDeleteModal(true);
    };

    const handleLogout = () => {
        const confirmLogout = window.confirm("Apakah Anda yakin ingin keluar?");
        if (confirmLogout) {
            localStorage.removeItem('adminToken');
            navigate('/');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewCourse(prev => ({
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
    };

    const selectCardImage = (imageSrc) => {
        setNewCourse(prev => ({
            ...prev,
            courseImage: imageSrc
        }));
        if (errors.courseImage) {
            setErrors(prev => ({
                ...prev,
                courseImage: ''
            }));
        }
    };

    const selectTutorImage = (imageSrc) => {
        setNewCourse(prev => ({
            ...prev,
            tutorImage: imageSrc
        }));
        if (errors.tutorImage) {
            setErrors(prev => ({
                ...prev,
                tutorImage: ''
            }));
        }
    };

    const handleResetCourses = async () => {
        const confirmed = window.confirm('Reset semua course ke default? Ini akan menghapus semua course yang ada dan menggantinya dengan data default.');
        if (confirmed) {
            try {
                await dispatch(resetCoursesToDefault()).unwrap();
                alert('✅ Courses berhasil direset!');
            } catch (error) {
                console.error('Error resetting courses:', error);
                alert('Terjadi kesalahan saat mereset courses.');
            }
        }
    };

    const isLoading = usersLoading || coursesLoading;

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header - Responsive */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div className="flex items-center">
                            <h1 className="text-xl md:text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                        </div>
                        
                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-4">
                            <span className="text-sm text-gray-600">Welcome, Admin</span>
                            <button
                                onClick={handleResetCourses}
                                disabled={isLoading}
                                className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Processing...' : 'Reset Default Courses'}
                            </button>
                            <button
                                onClick={handleLogout}
                                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
                            >
                                Logout
                            </button>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setShowMobileMenu(!showMobileMenu)}
                            className="md:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>

                    {/* Mobile Navigation Menu */}
                    {showMobileMenu && (
                        <div className="md:hidden pb-4 border-t border-gray-200">
                            <div className="pt-4 space-y-2">
                                <span className="block text-sm text-gray-600 px-3">Welcome, Admin</span>
                                <button
                                    onClick={handleResetCourses}
                                    disabled={isLoading}
                                    className="block w-full text-left px-3 py-2 text-orange-600 hover:bg-orange-50 rounded-md disabled:opacity-50"
                                >
                                    {isLoading ? 'Processing...' : 'Reset Default Courses'}
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="block w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded-md"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-8">
                {/* Navigation Tabs - Responsive */}
                <div className="mb-6 lg:mb-8">
                    <nav className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-8 overflow-x-auto">
                        <button
                            onClick={() => setActiveTab('dashboard')}
                            className={`pb-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                                activeTab === 'dashboard'
                                    ? 'border-green-500 text-green-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            Dashboard
                        </button>
                        <button
                            onClick={() => setActiveTab('users')}
                            className={`pb-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                                activeTab === 'users'
                                    ? 'border-green-500 text-green-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            User Management
                        </button>
                        <button
                            onClick={() => setActiveTab('courses')}
                            className={`pb-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                                activeTab === 'courses'
                                    ? 'border-green-500 text-green-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            Course Management
                        </button>
                    </nav>
                </div>

                {/* Loading Indicator */}
                {isLoading && (
                    <div className="text-center py-8">
                        <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-blue-500 bg-blue-100">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Loading from Redux Store...
                        </div>
                    </div>
                )}

                {/* Dashboard Tab */}
                {activeTab === 'dashboard' && !isLoading && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                        <div className="bg-green-50 p-4 lg:p-6 rounded-lg shadow">
                            <h3 className="text-base lg:text-lg font-medium text-green-900 mb-2">Total Users</h3>
                            <p className="text-2xl lg:text-3xl font-bold text-green-600">{users.length}</p>
                            <p className="text-xs lg:text-sm text-green-500 mt-1">Registered accounts</p>
                        </div>
                        <div className="bg-blue-50 p-4 lg:p-6 rounded-lg shadow">
                            <h3 className="text-base lg:text-lg font-medium text-blue-900 mb-2">Total Courses</h3>
                            <p className="text-2xl lg:text-3xl font-bold text-blue-600">{courses.length}</p>
                            <p className="text-xs lg:text-sm text-blue-500 mt-1">Available courses</p>
                        </div>
                        <div className="bg-yellow-50 p-4 lg:p-6 rounded-lg shadow">
                            <h3 className="text-base lg:text-lg font-medium text-yellow-900 mb-2">Categories</h3>
                            <p className="text-2xl lg:text-3xl font-bold text-yellow-600">4</p>
                            <p className="text-xs lg:text-sm text-yellow-500 mt-1">Course categories</p>
                        </div>
                        <div className="bg-purple-50 p-4 lg:p-6 rounded-lg shadow">
                            <h3 className="text-base lg:text-lg font-medium text-purple-900 mb-2">Redux Status</h3>
                            <p className="text-2xl lg:text-3xl font-bold text-purple-600">Active</p>
                            <p className="text-xs lg:text-sm text-purple-500 mt-1">State management active</p>
                        </div>
                    </div>
                )}

                {/* Users Tab */}
                {activeTab === 'users' && !isLoading && (
                    <div className="bg-white shadow overflow-hidden sm:rounded-md">
                        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                            <h3 className="text-base lg:text-lg leading-6 font-medium text-gray-900">
                                Registered Users ({users.length})
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">Users from Redux Store (MockAPI.io)</p>
                        </div>
                        
                        {/* Users Error */}
                        {usersError && (
                            <div className="p-4 bg-red-50 border-b border-red-200">
                                <p className="text-sm text-red-600">Error: {usersError}</p>
                            </div>
                        )}
                        
                        <ul className="divide-y divide-gray-200">
                            {users.map((user) => (
                                <li key={user.id} className="px-4 py-4 sm:px-6">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0">
                                                    {user.avatar ? (
                                                        <img 
                                                            className="h-10 w-10 rounded-full" 
                                                            src={user.avatar} 
                                                            alt={user.name}
                                                            onError={(e) => {
                                                                e.target.style.display = 'none';
                                                                e.target.nextSibling.style.display = 'flex';
                                                            }}
                                                        />
                                                    ) : null}
                                                    <div 
                                                        className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center"
                                                        style={{ display: user.avatar ? 'none' : 'flex' }}
                                                    >
                                                        <span className="text-sm font-medium text-green-800">
                                                            {user.name?.charAt(0) || 'U'}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="ml-4 flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-gray-900 truncate">
                                                        {user.name}
                                                    </p>
                                                    <p className="text-sm text-gray-500 truncate">{user.email}</p>
                                                    <div className="mt-1 flex flex-wrap items-center text-xs text-gray-400 gap-1">
                                                        <span>{user.gender}</span>
                                                        <span>•</span>
                                                        <span className="break-all">{user.phone}</span>
                                                        {user.role && (
                                                            <>
                                                                <span>•</span>
                                                                <span>{user.role}</span>
                                                            </>
                                                        )}
                                                        {user.createdAt && (
                                                            <>
                                                                <span>•</span>
                                                                <span>Joined: {new Date(user.createdAt).toLocaleDateString()}</span>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                                            {editingUser === user.id ? (
                                                <div className="flex items-center space-x-2">
                                                    <input
                                                        type="password"
                                                        value={newPassword}
                                                        onChange={(e) => setNewPassword(e.target.value)}
                                                        placeholder="New password"
                                                        className="border rounded px-2 py-1 text-xs"
                                                    />
                                                    <button
                                                        onClick={() => handleResetPassword(user.id)}
                                                        className="text-green-600 hover:text-green-900 text-xs"
                                                    >
                                                        Save
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setEditingUser(null);
                                                            setNewPassword('');
                                                        }}
                                                        className="text-gray-600 hover:text-gray-900 text-xs"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            ) : (
                                                <>
                                                    <button
                                                        onClick={() => setEditingUser(user.id)}
                                                        className="bg-yellow-500 text-white px-3 py-2 rounded text-sm hover:bg-yellow-600 transition-colors text-center"
                                                    >
                                                        Reset Password
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteUser(user)}
                                                        className="bg-red-500 text-white px-3 py-2 rounded text-sm hover:bg-red-600 transition-colors text-center"
                                                    >
                                                        Delete
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        {users.length === 0 && (
                            <div className="text-center py-12">
                                <p className="text-gray-500">No users found.</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Courses Tab */}
                {activeTab === 'courses' && !isLoading && (
                    <div>
                        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
                            <div>
                                <h3 className="text-base lg:text-lg font-medium text-gray-900">
                                    Courses ({courses.length})
                                </h3>
                                <p className="text-sm text-gray-500">Courses from Redux Store (MockAPI.io)</p>
                            </div>
                            <button
                                onClick={() => setShowAddCourseModal(true)}
                                className="w-full sm:w-auto bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors text-center"
                            >
                                Add New Course
                            </button>
                        </div>

                        {/* Courses Error */}
                        {coursesError && (
                            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                                <p className="text-sm text-red-600">Error: {coursesError}</p>
                            </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                            {courses.map((course) => (
                                <div key={course.id} className="bg-white rounded-lg shadow overflow-hidden">
                                    {/* Course Image */}
                                    <div className="h-40 lg:h-48 bg-gray-200 overflow-hidden">
                                        {course.courseImage ? (
                                            <img 
                                                src={course.courseImage} 
                                                alt={course.title}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                    e.target.nextSibling.style.display = 'flex';
                                                }}
                                            />
                                        ) : null}
                                        <div 
                                            className="w-full h-full bg-blue-100 flex items-center justify-center" 
                                            style={{ display: course.courseImage ? 'none' : 'flex' }}
                                        >
                                            <span className="text-blue-600 text-sm text-center px-2">
                                                No Image
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="p-4">
                                        <h4 className="text-base lg:text-lg font-medium text-gray-900 mb-2 line-clamp-2">
                                            {course.title}
                                        </h4>
                                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                            {course.description}
                                        </p>
                                        
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                {course.category}
                                            </span>
                                            <span className="text-lg font-semibold text-green-600">Rp {course.price}</span>
                                        </div>
                                        
                                        {/* Tutor Info with Image */}
                                        {course.tutorName && (
                                            <div className="flex items-center mb-3 space-x-2">
                                                {course.tutorImage ? (
                                                    <img 
                                                        src={course.tutorImage} 
                                                        alt={course.tutorName}
                                                        className="w-8 h-8 rounded-full object-cover"
                                                        onError={(e) => {
                                                            e.target.style.display = 'none';
                                                            e.target.nextSibling.style.display = 'flex';
                                                        }}
                                                    />
                                                ) : null}
                                                <div 
                                                    className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center" 
                                                    style={{ display: course.tutorImage ? 'none' : 'flex' }}
                                                >
                                                    <span className="text-xs text-gray-500">
                                                        {course.tutorName?.charAt(0) || 'T'}
                                                    </span>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-gray-900 truncate">
                                                        {course.tutorName}
                                                    </p>
                                                    <p className="text-xs text-gray-500 truncate">
                                                        {course.position} {course.company && `di ${course.company}`}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                        
                                        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                                            <div className="flex items-center">
                                                <span className="text-yellow-400">★</span>
                                                <span className="ml-1">{course.rating} ({course.reviewCount})</span>
                                            </div>
                                        </div>
                                        
                                        <div className="space-y-2">
                                            <button
                                                onClick={() => handleEditCourse(course)}
                                                className="w-full bg-blue-500 text-white px-3 py-2 rounded text-sm hover:bg-blue-600 transition-colors"
                                            >
                                                Edit Course
                                            </button>
                                            <button
                                                onClick={() => handleDeleteCourse(course)}
                                                className="w-full bg-red-500 text-white px-3 py-2 rounded text-sm hover:bg-red-600 transition-colors"
                                            >
                                                Delete Course
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {courses.length === 0 && (
                            <div className="text-center py-12">
                                <p className="text-gray-500">No courses found.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white p-6 rounded-lg max-w-sm w-full">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Delete</h3>
                        <p className="text-sm text-gray-600 mb-6">
                            Are you sure you want to delete this {deleteTarget?.type}? This action cannot be undone.
                        </p>
                        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition-colors"
                                disabled={isLoading}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="flex-1 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Course Modal */}
            <AddCourseModal
                isOpen={showAddCourseModal}
                onClose={() => {
                    setShowAddCourseModal(false);
                    setNewCourse({
                        title: '',
                        description: '',
                        tutorName: '',
                        position: '',
                        company: '',
                        rating: '',
                        reviewCount: '',
                        price: '',
                        category: '',
                        courseImage: '',
                        tutorImage: ''
                    });
                    setErrors({});
                }}
                newCourse={newCourse}
                setNewCourse={setNewCourse}
                handleInputChange={handleInputChange}
                onSubmit={handleAddCourse}
                errors={errors}
                editMode={false}
                onSelectCardImage={() => setShowCardGallery(true)}
                onSelectTutorImage={() => setShowTutorGallery(true)}
                isLoading={coursesLoading}
            />

            {/* Edit Course Modal */}
            <AddCourseModal
                isOpen={showEditCourseModal}
                onClose={() => {
                    setShowEditCourseModal(false);
                    setEditCourse(null);
                    setNewCourse({
                        title: '',
                        description: '',
                        tutorName: '',
                        position: '',
                        company: '',
                        rating: '',
                        reviewCount: '',
                        price: '',
                        category: '',
                        courseImage: '',
                        tutorImage: ''
                    });
                    setErrors({});
                }}
                newCourse={newCourse}
                setNewCourse={setNewCourse}
                handleInputChange={handleInputChange}
                onSubmit={handleUpdateCourse}
                errors={errors}
                editMode={true}
                onSelectCardImage={() => setShowCardGallery(true)}
                onSelectTutorImage={() => setShowTutorGallery(true)}
                isLoading={coursesLoading}
            />

            {/* Image Gallery Modals */}
            <ImageGalleryModal
                isOpen={showCardGallery}
                onClose={() => setShowCardGallery(false)}
                images={availableCardImages}
                onSelect={selectCardImage}
                title="Select Course Image"
            />

            <ImageGalleryModal
                isOpen={showTutorGallery}
                onClose={() => setShowTutorGallery(false)}
                images={availableTutorImages}
                onSelect={selectTutorImage}
                title="Select Tutor Image"
            />
        </div>
    );
}