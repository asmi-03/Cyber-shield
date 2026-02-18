import React from 'react';
import { motion } from 'framer-motion';

const WhyChooseUs = () => {
    return (
        <section className="why-choose-us-section" style={{ textAlign: 'center' }}>
            <div className="container">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="section-title">
                        <h2>Why Choose Us</h2>
                    </div>
                    <p style={{ maxWidth: '700px', margin: '0 auto 3rem auto' }}>
                        <span style={{ fontFamily: '"Orbitron", sans-serif', fontWeight: 'bold' }}>CYBER SHIELD</span> is an advanced AI-powered cybersecurity platform designed to detect, analyze, and prevent phishing attacks in real time. It combines modern web technologies with intelligent automation to create a fully secure digital environment for users and organizations.
                    </p>

                    {/* You can add more content here like feature list or image if needed */}
                </motion.div>
            </div>
        </section>
    );
};

export default WhyChooseUs;
