import React from 'react';
import { motion } from 'framer-motion';
import { FaUserShield, FaLock, FaFileContract } from 'react-icons/fa';
const Services = () => {
    const services = [
        {
            icon: <FaUserShield />,
            title: 'Security Services',
            desc: 'We deliver end-to-end cybersecurity solutions designed to protect your digital assets from modern cyber threats. From threat detection to incident response, our advanced systems ensure continuous protection and resilience.',
            buttonText: 'Explore Services >',
            highlight: false
        },
        {
            icon: <FaLock />,
            title: 'Data Privacy',
            desc: 'Your data is your most valuable asset. We implement strong encryption, secure authentication, and strict access control policies to safeguard sensitive information and ensure compliance with global privacy standards.',
            buttonText: 'Protect Your Data >',
            highlight: false
        },
        {
            icon: <FaFileContract />,
            title: 'Industry Certified',
            desc: 'Our security practices follow industry standards and compliance frameworks, ensuring reliable, trusted, and certified protection for businesses of all sizes across multiple sectors.',
            buttonText: 'View Certifications >',
            highlight: false // This one will have the red gradient background
        }
    ];

    return (
        <section className="services-section" id="services">
            <div className="container">
                <div className="features-grid">
                    {services.map((service, index) => (
                        <motion.div
                            key={index}
                            className={`feature-card ${service.highlight ? 'highlight' : ''}`}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2 }}
                        >
                            <div className="icon-box">
                                {service.icon}
                            </div>
                            <div className="content">
                                <h3>{service.title}</h3>
                                <p>{service.desc}</p>
                                <a href="#" className="learn-more">{service.buttonText}</a>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Services;
