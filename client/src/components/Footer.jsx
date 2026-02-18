import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram, FaShieldAlt } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="site-footer">

            {/* Main Footer Links */}
            <div className="footer-main">
                <div className="container">
                    <div className="footer-grid">

                        {/* Column 1: Services */}
                        <div className="footer-col">
                            <h3>Services</h3>
                            <ul>
                                <li><a href="#">Security Training</a></li>
                                <li><a href="#">Cloud Security</a></li>
                                <li><a href="#">Secure Managed IT</a></li>
                                <li><a href="#">Data Privacy</a></li>
                                <li><a href="#">Industry Certified</a></li>
                                <li><a href="#">Threat Intelligence</a></li>
                            </ul>
                        </div>

                        {/* Column 2: Support */}
                        <div className="footer-col">
                            <h3>Support</h3>
                            <ul>
                                <li><Link to="/contact">Contact Us</Link></li>
                                <li><a href="#">Knowledge Base</a></li>
                                <li><a href="#">About Us</a></li>
                                <li><a href="#">FAQ</a></li>
                                <li><a href="#">Partnerships</a></li>
                            </ul>
                        </div>

                        {/* Column 3: Contact */}
                        <div className="footer-col contact-col">
                            <h3>Get in Touch</h3>
                            <p><strong>Email:</strong> guptaasmi75@gmail.com</p>
                            <p><strong>Phone:</strong> 9149493518</p>
                            <p><strong>Address:</strong> JAMMU AND KASHMIR</p>
                        </div>

                    </div>
                </div>
            </div>

            {/* Copyright */}
            <div className="footer-bottom">
                <div className="container">
                    <p>&copy; 2026 Cyber Shield. All Rights Reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
