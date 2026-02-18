import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CountUp from 'react-countup';
import { FaShieldAlt, FaBug, FaLock, FaServer, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import '../styles/WebsiteChecker.scss';

const WebsiteChecker = () => {
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    const handleAnalyze = async (e) => {
        e.preventDefault();
        if (!url) return;

        setLoading(true);
        setError('');
        setResult(null);

        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            // Mock result - in real app, fetch from backend
            const isSafe = Math.random() > 0.3;
            const score = isSafe ? Math.floor(Math.random() * 20 + 80) : Math.floor(Math.random() * 40 + 20);

            setResult({
                isSafe: isSafe,
                score: score,
                details: {
                    ssl: true,
                    malware: !isSafe,
                    domainAge: '3 Years',
                    serverLoc: 'USA'
                },
                stats: [
                    isSafe ? 2 : 85, // Phishing
                    isSafe ? 5 : 92, // Malware
                    isSafe ? 12 : 78, // Spam
                    isSafe ? 8 : 65  // Suspicious
                ]
            });
        }, 2000);
    };

    const canvasRef = React.useRef(null);

    React.useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%';
        const fontSize = 14;
        const columns = canvas.width / fontSize;

        const drops = [];
        for (let i = 0; i < columns; i++) {
            drops[i] = 1;
        }

        const draw = () => {
            ctx.fillStyle = 'rgba(5, 5, 5, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = '#0F0'; // Green text
            ctx.font = fontSize + 'px monospace';

            for (let i = 0; i < drops.length; i++) {
                const text = letters.charAt(Math.floor(Math.random() * letters.length));

                // Randomly switch colors for cyber effect
                if (Math.random() > 0.98) {
                    ctx.fillStyle = '#ea2027'; // Red glitch
                } else {
                    ctx.fillStyle = '#0F0';
                }

                ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        };

        const interval = setInterval(draw, 33);

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', handleResize);

        return () => {
            clearInterval(interval);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <section className="website-checker-section" id="check-website">
            <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, opacity: 0.3 }} />
            <div className="container">
                <motion.div
                    className="checker-content"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="section-title">
                        <h2>Check Your <span className="highlight-red">Website Safety</span></h2>
                        <p>Enter a URL to analyze its security status instantly.</p>
                    </div>

                    <form onSubmit={handleAnalyze} className="checker-form">
                        <div className="input-group">
                            <input
                                type="text"
                                placeholder="Enter website URL (e.g., www.example.com)"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                            />
                            <button type="submit" disabled={loading}>
                                {loading ? 'Analyzing...' : 'Analyze Now'}
                            </button>
                        </div>
                    </form>

                    <AnimatePresence>
                        {result && (
                            <motion.div
                                className="result-container"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <div className={`result-card ${result.isSafe ? 'safe' : 'danger'}`}>
                                    <div className="score-circle">
                                        <div className="circle-content">
                                            <span className="score">
                                                <CountUp end={result.score} duration={2} />%
                                            </span>
                                            <span className="label">Safety Score</span>
                                        </div>
                                        <svg viewBox="0 0 36 36" className="circular-chart">
                                            <path className="circle-bg"
                                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                            />
                                            <motion.path className="circle"
                                                strokeDasharray={`${result.score}, 100`}
                                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                                initial={{ strokeDasharray: "0, 100" }}
                                                animate={{ strokeDasharray: `${result.score}, 100` }}
                                                transition={{ duration: 2, ease: "easeInOut" }}
                                            />
                                        </svg>
                                    </div>
                                    {/* Cute 3D Robot */}
                                    <motion.div
                                        className="floating-robot"
                                        animate={{ y: [0, -20, 0] }}
                                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                        style={{
                                            position: 'absolute',
                                            top: '-80px',
                                            right: '0',
                                            width: '180px',
                                            height: '180px',
                                            pointerEvents: 'none',
                                            zIndex: 3
                                        }}
                                    >
                                        <img
                                            src="https://cdn-icons-png.flaticon.com/512/4712/4712109.png"
                                            alt="Cute Security Robot"
                                            style={{ width: '100%', height: '100%', objectFit: 'contain', filter: 'drop-shadow(0 0 20px rgba(234,32,39,0.5))' }}
                                        />
                                    </motion.div>

                                    <div className="result-details">
                                        <h3>
                                            {result.isSafe ? <FaCheckCircle /> : <FaExclamationTriangle />}
                                            {result.isSafe ? ' This Website is Safe' : ' Suspicious Activity Detected'}
                                        </h3>

                                        <div className="details-grid">
                                            <div className="detail-item">
                                                <FaLock className="icon" />
                                                <span>SSL Certificate: <strong>{result.details.ssl ? 'Valid' : 'Invalid'}</strong></span>
                                            </div>
                                            <div className="detail-item">
                                                <FaBug className="icon" />
                                                <span>Malware: <strong>{result.details.malware ? 'Detected' : 'Clean'}</strong></span>
                                            </div>
                                            <div className="detail-item">
                                                <FaServer className="icon" />
                                                <span>Server Location: <strong>{result.details.serverLoc}</strong></span>
                                            </div>
                                            <div className="detail-item">
                                                <FaShieldAlt className="icon" />
                                                <span>Domain Age: <strong>{result.details.domainAge}</strong></span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </section>
    );
};

export default WebsiteChecker;
