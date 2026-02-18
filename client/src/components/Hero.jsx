import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaLinkedin, FaGithub, FaInstagram } from 'react-icons/fa';

const Hero = () => {
    return (
        <section className="hero-section">
            <div className="container hero-content">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={{
                        hidden: { opacity: 0, x: -50 },
                        visible: {
                            opacity: 1,
                            x: 0,
                            transition: {
                                duration: 0.8,
                                staggerChildren: 0.2
                            }
                        }
                    }}
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        justifyContent: 'center',
                        zIndex: 2
                    }}
                >
                    <motion.h1
                        variants={{
                            hidden: { opacity: 0, y: 20 },
                            visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
                        }}
                        style={{
                            fontSize: '6rem',
                            fontWeight: 'bold',
                            lineHeight: '1.1',
                            marginBottom: '1.5rem',
                            textShadow: '0 0 20px rgba(234, 32, 39, 0.5)',
                            fontFamily: '"Orbitron", sans-serif',
                            textTransform: 'uppercase'
                        }}
                    >
                        Cyber <span style={{ color: '#ea2027', display: 'inline-block' }}>Shield</span>
                    </motion.h1>

                    <motion.div
                        variants={{
                            hidden: { width: 0 },
                            visible: { width: '150px', transition: { duration: 0.8 } }
                        }}
                        style={{ height: '6px', background: '#ea2027', marginBottom: '2.5rem' }}
                    />

                    <motion.p
                        variants={{
                            hidden: { opacity: 0, x: -20 },
                            visible: { opacity: 1, x: 0 }
                        }}
                        style={{
                            fontSize: '1.5rem',
                            maxWidth: '750px',
                            marginBottom: '3rem',
                            lineHeight: '1.6',
                            borderLeft: '5px solid #ea2027',
                            paddingLeft: '30px',
                            background: 'linear-gradient(90deg, rgba(234,32,39,0.1) 0%, rgba(0,0,0,0) 100%)'
                        }}
                    >
                        Cyber Shield is an advanced AI-powered cybersecurity platform designed to detect, analyze, and prevent phishing attacks in real time. It combines modern web technologies with intelligent automation to create a fully secure digital environment for users and organizations.
                    </motion.p>

                    <motion.div
                        className="hero-buttons"
                        variants={{
                            hidden: { opacity: 0, scale: 0.8 },
                            visible: { opacity: 1, scale: 1 }
                        }}
                    >
                        <Link to="/contact" className="btn btn-outline">Contact Us</Link>
                    </motion.div>

                    <motion.div
                        className="social-icons"
                        variants={{
                            hidden: { opacity: 0, y: 20 },
                            visible: { opacity: 1, y: 0 }
                        }}
                        style={{ marginTop: '30px', display: 'flex', gap: '20px', position: 'relative', zIndex: 10 }}
                    >
                        <a href="https://www.linkedin.com/in/asmi-gupta-6692242a2" target="_blank" rel="noopener noreferrer" style={{ color: 'white', fontSize: '2.5rem', transition: 'all 0.3s' }} onMouseOver={(e) => e.currentTarget.style.color = '#ea2027'} onMouseOut={(e) => e.currentTarget.style.color = 'white'}>
                            <FaLinkedin />
                        </a>
                        <a href="https://github.com/asmi-03" target="_blank" rel="noopener noreferrer" style={{ color: 'white', fontSize: '2.5rem', transition: 'all 0.3s' }} onMouseOver={(e) => e.currentTarget.style.color = '#ea2027'} onMouseOut={(e) => e.currentTarget.style.color = 'white'}>
                            <FaGithub />
                        </a>
                        <a href="https://www.instagram.com/asmiiii.03/" target="_blank" rel="noopener noreferrer" style={{ color: 'white', fontSize: '2.5rem', transition: 'all 0.3s' }} onMouseOver={(e) => e.currentTarget.style.color = '#ea2027'} onMouseOut={(e) => e.currentTarget.style.color = 'white'}>
                            <FaInstagram />
                        </a>
                    </motion.div>
                </motion.div>
            </div>

            {/* 3D Scene is handled by HeroScene in the background, so we just overlay the content */}
        </section>
    );
};

export default Hero;
