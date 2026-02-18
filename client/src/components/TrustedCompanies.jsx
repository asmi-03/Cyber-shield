import React from 'react';
import { motion } from 'framer-motion';

const TrustedCompanies = () => {
    // Placeholder logic for logos - normally we'd import images
    const companies = [
        "Craft", "MINIMUM", "Hype", "Power XR2", "LOGO", "Hyper Best"
    ];

    return (
        <section className="trusted-section">
            <div className="container">
                <div className="section-title">
                    <h3 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '3rem' }}>
                        Trusted Over 2300+ Companies in the World
                    </h3>
                </div>

                <div className="logos-grid">
                    {companies.map((company, index) => (
                        <motion.div
                            key={index}
                            className="company-logo"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 0.5 }}
                            whileHover={{ opacity: 1, scale: 1.1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <h2>{company}</h2>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TrustedCompanies;
