import React from 'react';
import { motion } from 'framer-motion';
import { FaPlay } from 'react-icons/fa';

const About = () => {
    return (
        <section className="about-section" id="about">
            <div className="container">
                <div className="about-grid">

                    {/* Left Side - Image/Visuals */}
                    <motion.div
                        className="about-image-wrapper"
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <img
                            src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                            alt="Cyber Security Professionals"
                            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px' }}
                        />
                        <div className="floating-sphere"></div>
                        <div className="floating-card">
                            <span>SECURE PAYMENT</span>
                            <div className="lock-icon">🔒</div>
                        </div>
                    </motion.div>

                    {/* Right Side - Content */}
                    <motion.div
                        className="about-content"
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <h4 style={{ color: '#ea2027', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 'bold', marginBottom: '1rem' }}>
                            About Us
                        </h4>
                        <h2 style={{ fontSize: '3rem', fontFamily: '"Orbitron", sans-serif', textTransform: 'uppercase', lineHeight: '1.2', marginBottom: '2rem' }}>
                            Advanced <span className="highlight-red" style={{ color: '#ea2027' }}>Cyber Security</span> Provider
                        </h2>
                        <p className="description" style={{ fontSize: '1.1rem', color: '#b2bec3', lineHeight: '1.8', marginBottom: '2rem' }}>
                            <span style={{ fontFamily: '"Orbitron", sans-serif', fontWeight: 'bold', color: 'white' }}>CYBER SHIELD</span> is an advanced cyber security provider dedicated to protecting individuals, businesses, and digital infrastructures from evolving cyber threats. We combine Artificial Intelligence, real-time threat intelligence, and intelligent automation to deliver proactive, scalable, and enterprise-grade security solutions.
                        </p>

                        <div style={{ display: 'flex', gap: '2rem', marginTop: '2rem' }}>
                            <div className="stat-box">
                                <h3 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#ea2027', margin: 0 }}>10k+</h3>
                                <p style={{ margin: 0, fontSize: '0.9rem', color: '#b2bec3' }}>Trusted Clients</p>
                            </div>
                            <div className="stat-box">
                                <h3 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#ea2027', margin: 0 }}>50+</h3>
                                <p style={{ margin: 0, fontSize: '0.9rem', color: '#b2bec3' }}>Cyber Experts</p>
                            </div>
                        </div>

                    </motion.div>

                </div>
            </div>
        </section>
    );
};

export default About;
