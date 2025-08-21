import React from 'react'

export default function LabelHeroSection({title, subtitle}) {
    return (
        <>
            <div className="relative container mx-auto px-4 md:px-6 lg:px-10 pt-12 text-center text-white">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 leading-tight">
                    {title}
                </h1>
                <p className="text-gray-200 mb-8 text-sm sm:text-base lg:text-lg leading-relaxed">
                    {subtitle}
                </p>
                <a href="#"
                    className="bg-green-500 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-md hover:bg-green-600 text-sm md:text-base">
                    Temukan Video Course untuk Dipelajari!
                </a>
            </div>
        </>
    )
}