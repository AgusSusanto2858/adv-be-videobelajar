import React from 'react'
import Navbar from '../components/organisms/Navbar'
import Footer from '../components/organisms/Footer'

export default function HomeLayouts({ children, isLoggedIn = false, user = null, onLogout }) {
    return (
        <>
            <Navbar 
                isLoggedIn={isLoggedIn} 
                user={user}
                onLogout={onLogout}
            />
            {children}
            <Footer />
        </>
    )
}