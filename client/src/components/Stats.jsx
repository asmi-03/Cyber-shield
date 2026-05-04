import React from 'react';
import { FaGlobe, FaShieldAlt, FaDollarSign, FaUserSecret } from 'react-icons/fa';
import CountUp from 'react-countup';
import { motion, useAnimation } from "framer-motion";

const StatItem = ({ icon, number, label, suffix }) => {
    const controls = useAnimation();
    const [key, setKey] = React.useState(0);

    const handleClick = async () => {
        setKey(prev => prev + 1); // Restart count animation
        await controls.start({
            scale: [1, 1.2, 1],
            rotate: [0, 360, 0],
            transition: { duration: 0.6, ease: "easeInOut" }
        });
    };

    return (
        <motion.div
            className="stat-item"
            onClick={handleClick}
            animate={controls}
            whileHover={{ scale: 1.05, cursor: 'pointer', y: -5 }}
            initial={{ scale: 1 }}
        >
            <div className="icon">{icon}</div>
            <span className="number" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '5px' }}>
                <CountUp
                    key={key}
                    start={0}
                    end={number}
                    duration={2.5}
                    separator=","
                    enableScrollSpy
                    scrollSpyOnce={true}
                />
                {suffix && <span>{suffix}</span>}
                <span style={{ fontSize: '1.5rem', marginTop: '-10px' }}>+</span>
            </span>
            <span className="label">{label}</span>
        </motion.div>
    );
};

const Stats = () => {
    const stats = [
        { icon: <FaGlobe />, number: 3325, label: 'Global Projects' },
        { icon: <FaShieldAlt />, number: 4579, label: 'Clients Protect' },
        { icon: <FaDollarSign />, number: 100, label: 'Service Guarantee', suffix: '%' }, // Note: User wanted 100%+ so handling suffix carefully
        { icon: <FaUserSecret />, number: 7845, label: 'Experts Team' }
    ];

    return (
        <section className="stats-section">
            <div className="container">
                <div className="stats-grid">
                    {stats.map((stat, index) => (
                        <StatItem key={index} {...stat} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Stats;
