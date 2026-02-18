import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaShieldAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 50;
            if (isScrolled !== scrolled) {
                setScrolled(isScrolled);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [scrolled]);

    return (
        <nav className={`navbar ${scrolled ? 'scrolled glass' : ''}`}>
            <div className="logo">
                <FaShieldAlt style={{ color: 'var(--theme-red)', fontSize: '2rem' }} />
                <span style={{ fontFamily: '"Orbitron", sans-serif', textTransform: 'uppercase', letterSpacing: '2px', textShadow: '0 0 10px var(--theme-red)' }}>
                    Cyber <span style={{ color: 'var(--highlight-blue)' }}>Shield</span>
                </span>
            </div>
            <div className="nav-links">
                <Link to="/">Home</Link>
                <a href="#about">About</a>
                <Link to="/check-website"
                    className="nav-special-btn"
                    style={{
                        backgroundColor: '#ea2027',
                        color: 'white',
                        padding: '8px 20px',
                        borderRadius: '20px',
                        fontWeight: 'bold',
                        textDecoration: 'none',
                        border: 'none',
                        display: 'inline-block',
                        boxShadow: '0 0 10px rgba(234, 32, 39, 0.4)'
                    }}
                >
                    Check My Website
                </Link>
                <a href="#services">Services</a>
                <Link to="/contact">Contact</Link>

                <Link to="/dashboard">Pages</Link>
            </div>

        </nav>
    );
};

export default Navbar;
