import React, { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { FaPlus, FaMinus } from 'react-icons/fa';

const FAQItem = ({ question, answer, isOpen, toggle }) => {
    return (
        <div className={`faq-item ${isOpen ? 'open' : ''}`} onClick={toggle}>
            <div className="faq-question">
                <h3>{question}</h3>
                <span className="icon">
                    {isOpen ? <FaMinus /> : <FaPlus />}
                </span>
            </div>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="faq-answer"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <p>{answer}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const FAQ = () => {
    const [activeIndex, setActiveIndex] = useState(0);

    const faqs = [
        { q: "How Can I Safely Browse The Internet?", a: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo." },
        { q: "How Does Secuvant's Co-managed Security Model Work?", a: "To take a trivial example, which of us ever undertakes laborious physical exercise, except to obtain some advantage from it." },
        { q: "What Type Frequency Of Alerts And Notifications Will Receive?", a: "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque." },
        { q: "How Is Our Data Stored And Protected And For How Long?", a: "Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere." }
    ];

    return (
        <section className="faq-section">
            <div className="container">
                <div className="faq-grid">
                    {/* Left Side: Image/Content */}
                    <div className="faq-image-content">
                        <h2>General Questions</h2>
                        <h3>Frequently Asked <br /><span className="highlight-red">Questions?</span></h3>

                        <div className="faq-illustration" style={{ height: '300px', borderRadius: '20px', overflow: 'hidden', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                            <img
                                src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                                alt="Abstract Red Futuristic Background"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        </div>
                    </div>

                    {/* Right Side: Accordion */}
                    <div className="faq-list">
                        {faqs.map((faq, index) => (
                            <FAQItem
                                key={index}
                                question={faq.q}
                                answer={faq.a}
                                isOpen={activeIndex === index}
                                toggle={() => setActiveIndex(activeIndex === index ? null : index)}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FAQ;
