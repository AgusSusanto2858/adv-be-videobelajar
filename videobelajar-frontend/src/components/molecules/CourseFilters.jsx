import React from 'react';
import { categories } from '../../data/coursesData';

const CourseFilters = ({ activeCategory, onCategoryChange }) => {
    return (
        <div className="flex gap-1 overflow-x-auto">
            {categories.map((category) => (
                <div 
                    key={category}
                    className="flex flex-col gap-2 px-9 py-3 cursor-pointer transition-colors"
                    onClick={() => onCategoryChange(category)}
                >
                    <a 
                        href="#" 
                        className={`font-medium text-base whitespace-nowrap transition-colors ${
                            activeCategory === category 
                                ? 'text-orange-500' 
                                : 'text-gray-500 hover:text-orange-400'
                        }`}
                        onClick={(e) => e.preventDefault()}
                    >
                        {category}
                    </a>
                    {activeCategory === category && (
                        <div className="w-13 h-1.5 rounded-lg bg-orange-500"></div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default CourseFilters;