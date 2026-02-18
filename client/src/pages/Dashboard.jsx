import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Radar3D from '../components/Radar3D';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import '../styles/main.scss';

const data = [
    { name: 'Phishing', count: 400 },
    { name: 'Malware', count: 300 },
    { name: 'Safe', count: 1200 },
    { name: 'Suspicious', count: 200 },
];

const Dashboard = () => {
    return (
        <div className="dashboard-container">
            <div className="dashboard-header glow-text">
                <h1>GLOBAL THREAT INTELLIGENCE</h1>
            </div>

            <div className="dashboard-grid">
                {/* Radar Section */}
                <div className="grid-item radar-section">
                    <h2>LIVE THREAT RADAR</h2>
                    <div className="canvas-wrapper">
                        <Canvas camera={{ position: [0, 5, 8], fov: 60 }}>
                            <ambientLight intensity={0.5} />
                            <Radar3D />
                            <OrbitControls enableZoom={false} maxPolarAngle={Math.PI / 2.5} minPolarAngle={0} />
                        </Canvas>
                    </div>
                </div>

                {/* Stats Section */}
                <div className="grid-item stats-section">
                    <h2>THREAT STATISTICS</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                            <XAxis dataKey="name" stroke="#fff" />
                            <YAxis stroke="#fff" />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#000', border: '1px solid #00f3ff' }}
                                itemStyle={{ color: '#00f3ff' }}
                            />
                            <Bar dataKey="count" fill="#bc13fe" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Recent Activity */}
                <div className="grid-item activity-section">
                    <h2>RECENT SCANS</h2>
                    <ul className="activity-list">
                        <li className="danger">
                            <span className="time">10:42:01</span>
                            <span className="url">secure-login-bank.com</span>
                            <span className="status">PHISHING</span>
                        </li>
                        <li className="safe">
                            <span className="time">10:41:55</span>
                            <span className="url">google.com</span>
                            <span className="status">SAFE</span>
                        </li>
                        <li className="suspicious">
                            <span className="time">10:41:40</span>
                            <span className="url">free-crypto-giveaway.xyz</span>
                            <span className="status">WARNING</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
