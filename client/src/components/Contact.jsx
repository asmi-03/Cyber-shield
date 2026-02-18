import React, { useState } from 'react';
import '../styles/Contact.scss';
import { FaPaperPlane, FaPhone, FaEnvelope, FaMapMarkerAlt, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Contact = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        message: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form Submitted:', formData);
        alert('Message sent! (Simulated)');
        // Add EmailJS or backend logic here
    };

    return (
        <section className="contact-section" id="contact">
            <div className="contact-container">
                <div className="glass-card">
                    {/* Left Panel: Contact Info */}
                    <div className="contact-info-panel">
                        <div className="circle-decoration circle-1"></div>
                        <div className="circle-decoration circle-2"></div>

                        <div className="info-content">
                            <h3>Contact Information</h3>
                            <p>Say something to start a live chat!</p>

                            <div className="info-items">
                                <div className="info-item">
                                    <FaPhone className="icon" />
                                    <span>9149493518</span>
                                </div>
                                <div className="info-item">
                                    <FaEnvelope className="icon" />
                                    <span>guptaasmi@gmail.com</span>
                                </div>
                                <div className="info-item">
                                    <FaMapMarkerAlt className="icon" />
                                    <span>Jammu and kashmir</span>
                                </div>
                            </div>
                        </div>

                        <div className="social-links">
                            <a href="#"><FaInstagram /></a>
                            <a href="#"><FaLinkedin /></a>
                        </div>
                    </div>

                    {/* Right Panel: Form */}
                    <div className="contact-form-panel">
                        <form onSubmit={handleSubmit}>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>First Name</label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Last Name</label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Phone Number</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>


                            <div className="form-group">
                                <label>Message</label>
                                <textarea
                                    name="message"
                                    rows="1"
                                    placeholder="Write your message.."
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                ></textarea>
                            </div>

                            <button type="submit" className="submit-btn" style={{ float: "right" }}>Send Message</button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Newsletter Section */}
            <div className="newsletter-section">
                <div className="newsletter-box">
                    <h2>Subscribe Our Newsletter</h2>
                    <p>Subscribe to our newsletter to get the latest cybersecurity news and updates throughout the week.</p>
                    <form className="subscribe-form" onSubmit={(e) => e.preventDefault()}>
                        <input type="email" placeholder="Enter your email address" />
                        <button type="submit">Subscribe</button>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default Contact;
