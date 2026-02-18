import React from 'react';
import { motion } from 'framer-motion';

const Blog = () => {
    const posts = [
        {
            title: "How to Protect Your Business from Ransomware Attacks",
            date: "Feb 17, 2026",
            desc: "Ransomware attacks are increasing globally. Learn how AI-driven monitoring, employee awareness, and strong security frameworks can protect your organization from costly breaches.",
            image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
        },
        {
            title: "Top 5 Cybersecurity Risks in 2026",
            date: "Jan 10, 2026",
            desc: "From phishing scams to cloud misconfigurations, discover the most dangerous cyber threats businesses face today and how proactive defense strategies can minimize risks.",
            image: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
        },
        {
            title: "How Social Engineering Targets Your Employees",
            date: "Dec 05, 2025",
            desc: "Human error remains the biggest security vulnerability. Understand how attackers manipulate trust and what steps your organization can take to prevent social engineering attacks.",
            image: "https://images.unsplash.com/photo-1510511459019-5dda7724fd87?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
        }
    ];

    return (
        <section className="blog-section">
            <div className="container">
                <div className="section-title">
                    <h2>Latest News & Blog</h2>
                    <p>Stay updated with the latest trends, threats, and security best practices to keep your digital environment safe.</p>
                </div>

                <div className="blog-grid">
                    {posts.map((post, index) => (
                        <motion.div
                            key={index}
                            className="blog-card"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <div className="blog-image" style={{ height: '200px', overflow: 'hidden' }}>
                                <img
                                    src={post.image}
                                    alt={post.title}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
                                />
                                <div className="overlay"></div>
                            </div>
                            <div className="blog-content">
                                <span className="date">{post.date}</span>
                                <h3>{post.title}</h3>
                                <p>{post.desc}</p>
                                <a href="#" className="read-more">Read More &gt;</a>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Blog;
