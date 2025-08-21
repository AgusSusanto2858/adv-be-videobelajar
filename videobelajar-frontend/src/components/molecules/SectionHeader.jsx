import React from 'react';

const SectionHeader = ({ title, subtitle, className = "" }) => {
    return (
        <div className={`flex flex-col gap-3 ${className}`}>
            <h3 className="font-semibold text-2xl md:text-3xl text-gray-800">
                {title}
            </h3>
            <p className="font-medium text-base text-gray-500">
                {subtitle}
            </p>
        </div>
    );
};

export default SectionHeader;