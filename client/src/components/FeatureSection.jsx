import React from 'react';
import { motion } from 'framer-motion';

const FeatureSection = () => {
    return (
        <section className="feature-section">
            <div className="container">
                <div className="feature-grid">
                    {/* Left Content */}
                    <motion.div
                        className="feature-content"
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2>
                            Providing Best <span className="highlight-red">Cyber Security</span> Solutions
                        </h2>
                        <p>
                            In today’s digital world, cyber threats are evolving faster than ever. Providing the best cyber security solutions means delivering proactive, intelligent, and adaptive protection that safeguards data, systems, and users from advanced attacks.
                        </p>
                        <p>
                            A trusted cyber security provider focuses not only on preventing breaches but also on detecting threats early, responding instantly, and continuously strengthening security infrastructure.
                        </p>
                    </motion.div>

                    {/* Right Image */}
                    <motion.div
                        className="feature-image"
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="feature-image-container" style={{ position: 'relative', height: '500px', borderRadius: '20px', overflow: 'hidden', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                            <img
                                src="https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                                alt="Glowing Neon Cyber Security Shield"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                            <div className="floating-circle-red" style={{ position: 'absolute', bottom: '-50px', right: '-50px', width: '200px', height: '200px', background: 'linear-gradient(135deg, #ea2027 0%, #ff4757 100%)', borderRadius: '50%', filter: 'blur(40px)', opacity: '0.5' }}></div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default FeatureSection;
