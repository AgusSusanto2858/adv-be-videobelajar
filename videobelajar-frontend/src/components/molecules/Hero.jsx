import React from 'react'
import backgroundImage from '../../assets/images/banner.jpeg';
import LabelHeroSection from '../atoms/LabelHeroSection';

export default function Hero() {
    return (
        <>
            <section
                className="relative bg-cover bg-center py-16 rounded-xl overflow-hidden mx-4 sm:mx-8 md:mx-auto max-w-[1170px] mt-6 md:mt-10 lg:mt-16"
                style={{ backgroundImage: `url(${backgroundImage})` }}
            >
                <div className="absolute inset-0 bg-black opacity-70"></div>

                <LabelHeroSection 
                    title = "Revolusi Pembelajaran: Temukan Ilmu Baru melalui Platform Video Interaktif!"
                    subtitle = "Temukan ilmu baru yang menarik dan mendalam melalui koleksi video pembelajaran berkualitas tinggi. Tidak hanya itu, Anda juga dapat berpartisipasi dalam latihan interaktif yang akan meningkatkan pemahaman Anda."
                />
            </section>
        </>
    )
}
