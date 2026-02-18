import React from 'react';
import { motion } from 'framer-motion';
import { FaUserSecret, FaBug, FaCloud, FaSearch, FaShieldAlt, FaChalkboardTeacher } from 'react-icons/fa';

const Offerings = () => {
    const offers = [
        { icon: <FaUserSecret />, title: 'Threat Intelligence', desc: 'Real-time monitoring and AI-driven threat analysis to identify malicious activities before they impact your system. Stay ahead of evolving cyber attacks with predictive intelligence.' },
        { icon: <FaSearch />, title: 'Security Assessment', desc: 'Comprehensive vulnerability scanning and penetration testing to uncover weaknesses in your infrastructure and strengthen your security posture.' },
        { icon: <FaBug />, title: 'Compromise Assessment', desc: 'Identify hidden breaches and unauthorized access within your systems. We investigate suspicious activities and eliminate potential threats before they escalate.' },
        { icon: <FaShieldAlt />, title: 'Incident Response', desc: 'Rapid detection, containment, and recovery from cyber attacks. Our response team minimizes downtime and ensures business continuity.' },
        { icon: <FaCloud />, title: 'Cloud Security', desc: 'Secure your cloud infrastructure with advanced monitoring, data encryption, identity management, and compliance-ready configurations.' },
        { icon: <FaChalkboardTeacher />, title: 'Security Training', desc: 'Empower your team with cybersecurity awareness training to prevent phishing attacks, social engineering threats, and insider risks.' }
    ];

    return (
        <section className="offerings-section" id="offerings">
            <div className="container">
                <div className="section-title">
                    <h2>What We Offer</h2>
                    <p>We provide advanced, AI-powered cybersecurity solutions designed to detect, prevent, and respond to modern digital threats. Our proactive approach ensures continuous protection, data security, and business resilience in an ever-evolving cyber landscape.</p>
                </div>

                <div className="offerings-grid">
                    {offers.map((offer, index) => (
                        <motion.div
                            key={index}
                            className="offering-card"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -10 }}
                        >
                            <div className="icon-box-simple">
                                {offer.icon}
                            </div>
                            <h3>{offer.title}</h3>
                            <p>{offer.desc}</p>
                            <a href="#" className="read-more">Learn More &gt;</a>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Offerings;
