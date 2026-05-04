import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import { FaShieldAlt, FaBars, FaTimes } from 'react-icons/fa';


const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMenu = () => {
        setIsMobileMenuOpen(false);
    };

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
            <div className="mobile-menu-icon" onClick={toggleMenu}>
                {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
            </div>
            <div className={`nav-links ${isMobileMenuOpen ? 'active' : ''}`}>
                <Link to="/" onClick={closeMenu}>Home</Link>
                <HashLink smooth to="/#about" onClick={closeMenu}>About</HashLink>
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
                    onClick={closeMenu}
                >
                    Check My Website
                </Link>
                <HashLink smooth to="/#services" onClick={closeMenu}>Services</HashLink>
                <Link to="/contact" onClick={closeMenu}>Contact</Link>

            </div>

        </nav>
    );
};

export default Navbar;
