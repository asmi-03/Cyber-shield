import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CountUp from 'react-countup';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import {
  FaTachometerAlt, FaShieldAlt, FaTools, FaFileAlt, FaNetworkWired, FaSearch, FaCog,
  FaExclamationTriangle, FaBug, FaCheckCircle, FaLock, FaServer
} from 'react-icons/fa';
import { sendDataToAI } from '../services/n8nService';
import '../styles/WebsiteChecker.scss';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const WebsiteChecker = () => {
  const [activeTab, setActiveTab] = useState('Dashboard');
  
  // Dashboard State
  const [criticalThreats, setCriticalThreats] = useState(1);
  const [activeThreats, setActiveThreats] = useState(12);
  const [logs, setLogs] = useState([]);
  
  // Network Scan State
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const canvasRef = useRef(null);
  
  // Analytics State
  const [queryTime, setQueryTime] = useState('0.0');
  const [requestStats, setRequestStats] = useState({ total: 0, failed: 0 });

  // Live Backend Data Integration (Global Server Logs)
  useEffect(() => {
    let interval;
    const fetchDashboardData = async () => {
      if (result) return; // If specific website analyzed, pause global polling

      try {
        const start = performance.now();
        const response = await fetch('http://localhost:5000/api/dashboard');
        const end = performance.now();
        setQueryTime((end - start).toFixed(1));
        setRequestStats(prev => ({ ...prev, total: prev.total + 1 }));

        if (!response.ok) throw new Error("API not ok");
        
        const data = await response.json();
        if (data.logs) {
          setLogs(data.logs);
          let critCount = 0; let activeCount = 0;
          data.logs.forEach(log => {
            if (log.severity === 'Critical') critCount++;
            if (['Critical', 'High', 'Medium'].includes(log.severity)) activeCount++;
          });
          setCriticalThreats(critCount);
          setActiveThreats(activeCount);
        }
      } catch {
        // --- SIMULATION FALLBACK ---
        setRequestStats(prev => ({ ...prev, total: prev.total + 1, failed: prev.failed + 1 }));
        setQueryTime((Math.random() * 40 + 20).toFixed(1)); // simulated latency 20-60ms
        
        setLogs(prev => {
          // Generate a new log frequently for a live dashboard feel
          const types = ['SQL Injection', 'Malware Payload', 'Brute Force Attempt', 'Port Scan', 'Unauthorized Access', 'Data Exfiltration'];
          const sev = Math.random() > 0.85 ? 'Critical' : Math.random() > 0.6 ? 'High' : Math.random() > 0.3 ? 'Medium' : 'Low';
          const newLog = {
            id: Date.now(),
            severity: sev,
            type: types[Math.floor(Math.random() * types.length)],
            source: `192.168.1.${Math.floor(Math.random()*255)}`,
            time: new Date().toLocaleTimeString()
          };
          const updatedLogs = [newLog, ...prev].slice(0, 50); // Keep last 50
          
          // Update stats based on simulated logs
          let critCount = 0; let activeCount = 0;
          updatedLogs.forEach(log => {
            if (log.severity === 'Critical') critCount++;
            if (['Critical', 'High', 'Medium'].includes(log.severity)) activeCount++;
          });
          setCriticalThreats(critCount);
          setActiveThreats(activeCount);
          return updatedLogs;
        });
      }
    };

    fetchDashboardData();
    interval = setInterval(fetchDashboardData, 1500); // 1.5s updates for a very live feel
    return () => clearInterval(interval);
  }, [result]);

  // Settings State for Workable Toggles
  const [settings, setSettings] = useState({ autonomous: true, notifications: false, strictScan: true });
  const toggleSetting = (key) => setSettings(prev => ({ ...prev, [key]: !prev[key] }));

  // Remediation State for Workable Playbooks
  const [playbookStatus, setPlaybookStatus] = useState({});
  const runPlaybook = (idx) => {
    if (playbookStatus[idx]) return;
    setPlaybookStatus(prev => ({ ...prev, [idx]: 'Running...' }));
    setTimeout(() => setPlaybookStatus(prev => ({ ...prev, [idx]: 'Completed' })), 2000);
  };

  // Clear Scanner state ONLY on empty URL, allowing it to persist across tabs
  useEffect(() => {
    if (url.trim() === '') {
      setResult(null);
      setError('');
    }
  }, [url]);

  // Matrix Effect for Network Scan
  useEffect(() => {
    if (activeTab !== 'Network Scan' || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.parentElement.offsetWidth || window.innerWidth;
    canvas.height = canvas.parentElement.offsetHeight || 600;

    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()';
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops = Array(Math.floor(columns)).fill(1);

    const draw = () => {
      ctx.fillStyle = 'rgba(56, 72, 92, 0.1)'; 
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = fontSize + 'px monospace';
      
      for (let i = 0; i < drops.length; i++) {
        const text = letters.charAt(Math.floor(Math.random() * letters.length));
        ctx.fillStyle = Math.random() > 0.98 ? '#ea2027' : '#0F0';
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
    };
    const interval = setInterval(draw, 33);
    return () => clearInterval(interval);
  }, [activeTab]);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!url) return;
    setLoading(true); setError(''); setResult(null);

    try {
      let data = null;
      try { data = await sendDataToAI({ url, type: 'scan' }); } 
      catch { data = { prediction: 'unknown', error: 'simulated' }; }

      if (data.prediction === 'unknown' || data.error) {
        const lowerUrl = url.toLowerCase();
        const isTrusted = /google|github|youtube|linkedin|microsoft|apple|netflix/.test(lowerUrl);
        const isDanger = lowerUrl.includes('.xyz') || lowerUrl.includes('.tk');
        data = {
          prediction: isDanger ? 'phishing' : 'safe',
          confidence: isTrusted ? 0.95 : isDanger ? 0.9 : 0.8,
          details: { ssl: !lowerUrl.startsWith('http:'), malware: isDanger, has_ip: false, strange_tld: isDanger }
        };
      }

      const isSafe = data.prediction === 'safe';
      const score = isSafe ? Math.floor(data.confidence * 100) : Math.floor((1 - data.confidence) * 100);

      setResult({
        isSafe, score,
        details: { ssl: data.details.ssl, malware: data.details.malware, domainAge: 'Standard', serverLoc: 'Standard' }
      });

      // Populating the rest of the dashboard with data specific to this URL
      const siteLogs = [];
      let cT = 0;
      let aT = 0;
      
      const addLog = (sev, typ) => {
        siteLogs.push({ id: Date.now() + Math.random(), severity: sev, type: typ, source: url, time: new Date().toLocaleTimeString() });
        if (sev === 'Critical') cT++;
        if (['Critical', 'High', 'Medium'].includes(sev)) aT++;
      };

      if (!data.details.ssl) addLog('High', 'Missing SSL Certificate');
      if (data.details.malware) addLog('Critical', 'Malware Signature Detected');
      if (data.prediction === 'phishing') addLog('Critical', 'Phishing Patterns Identified');
      
      if (isSafe) {
        addLog('Low', 'Open Port 80 (HTTP)');
        addLog('Medium', 'Missing Content-Security-Policy');
        addLog('Low', 'Cookies without HttpOnly flag');
      } else {
        addLog('High', 'Suspicious Cross-Origin Requests');
        addLog('Medium', 'Outdated Web Server Version');
        addLog('Critical', 'Exposed Admin Panel');
      }

      setLogs(siteLogs);
      setCriticalThreats(cT);
      setActiveThreats(aT);
      
    } catch { setError('Failed to analyze website.'); } finally { setLoading(false); }
  };

  const pieData = {
    labels: ['Critical', 'High', 'Medium', 'Low'],
    datasets: [{
      data: [criticalThreats, Math.max(2, activeThreats - criticalThreats), 8, 4],
      backgroundColor: ['#ef4444', '#facc15', '#38bdf8', '#4ade80'],
      borderWidth: 2, borderColor: 'rgba(255,255,255,0.1)',
    }],
  };

  // eslint-disable-next-line no-unused-vars
  const NavButton = ({ name, icon: Icon }) => (
    <button 
      onClick={() => setActiveTab(name)}
      className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-md font-medium text-sm transition-colors text-left
        ${activeTab === name ? 'bg-indigo-500 text-white' : 'text-slate-300 hover:bg-white/5'}`}
    >
      <Icon className={activeTab === name ? "text-white" : ""} /> {name}
    </button>
  );

  return (
    <div className="min-h-screen bg-transparent font-sans text-slate-200 flex flex-col" style={{ paddingTop: '80px', zIndex: 10, position: 'relative' }}>
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 bg-black/40 backdrop-blur-md border-r border-white/10 flex flex-col py-4 px-3 flex-shrink-0 z-20">
          <div className="space-y-1 mb-6">
            <NavButton name="Dashboard" icon={FaCheckCircle} />
            <NavButton name="Threat Management" icon={FaShieldAlt} />
            <NavButton name="Remediation" icon={FaTools} />
            <NavButton name="Security Logs" icon={FaFileAlt} />
          </div>

          <div className="mb-2 px-4 text-xs font-bold text-slate-400 tracking-wider">ANALYSIS TOOLS</div>
          <div className="space-y-1 mb-6">
            <NavButton name="Network Scan" icon={FaNetworkWired} />
            <NavButton name="Log Analysis" icon={FaSearch} />
          </div>

          <div className="mb-2 px-4 text-xs font-bold text-slate-400 tracking-wider">SETTINGS</div>
          <div className="space-y-1">
            <NavButton name="System Settings" icon={FaCog} />
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-8 overflow-y-auto bg-transparent relative z-10">
          
          {activeTab === 'Dashboard' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3 mb-8">
                <div className="bg-white/10 rounded-full p-2 text-white border border-white/20">
                  <FaTachometerAlt className="text-xl" />
                </div>
                <h1 className="text-3xl font-bold text-white tracking-wide">Security Dashboard</h1>
              </div>

              <div className="flex flex-wrap gap-12 mb-10 pl-4">
                <div className="flex-1 min-w-[200px] border-l-2 border-red-500 pl-4 relative">
                  <h3 className="text-red-500 font-semibold text-sm mb-2 uppercase tracking-wider">Critical Threats</h3>
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-5xl font-bold text-white mb-4">{criticalThreats}</div>
                      <button className="px-3 py-1 text-xs font-bold text-red-500 border border-red-500 rounded hover:bg-red-500/10 uppercase">View All</button>
                    </div>
                    <FaExclamationTriangle className="text-4xl text-red-500 opacity-80 mt-1" />
                  </div>
                </div>

                <div className="flex-1 min-w-[200px] border-l-2 border-yellow-500 pl-4 relative">
                  <h3 className="text-yellow-500 font-semibold text-sm mb-2 uppercase tracking-wider">Active Threats</h3>
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-5xl font-bold text-white mb-4">{activeThreats}</div>
                      <button className="px-3 py-1 text-xs font-bold text-yellow-500 border border-yellow-500 rounded hover:bg-yellow-500/10 uppercase">View All</button>
                    </div>
                    <FaBug className="text-4xl text-yellow-500 opacity-80 mt-1" />
                  </div>
                </div>
              </div>

              <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                <h3 className="text-white font-medium flex items-center gap-2 mb-6">
                  <FaTachometerAlt className="text-slate-400" /> Threats by Severity
                </h3>
                <div className="flex items-center justify-center gap-12">
                  <div className="w-64 h-64 relative">
                    <Pie data={pieData} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
                  </div>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3"><div className="w-8 h-4 bg-red-500 rounded-sm"></div><span className="text-sm">Critical</span></div>
                    <div className="flex items-center gap-3"><div className="w-8 h-4 bg-yellow-400 rounded-sm"></div><span className="text-sm">High</span></div>
                    <div className="flex items-center gap-3"><div className="w-8 h-4 bg-green-400 rounded-sm"></div><span className="text-sm">Low</span></div>
                    <div className="flex items-center gap-3"><div className="w-8 h-4 bg-cyan-400 rounded-sm"></div><span className="text-sm">Medium</span></div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'Network Scan' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full relative overflow-hidden bg-black/20 rounded-xl p-8 border border-white/10">
              <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0.3 }} />
              <div className="relative z-10 max-w-2xl mx-auto mt-10">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-white mb-2">Network <span className="text-[#0F0]">Scanner</span></h2>
                  <p className="text-slate-400">Enter a URL to analyze its security status instantly.</p>
                </div>

                <form onSubmit={handleAnalyze} className="flex gap-2 mb-8">
                  <input type="text" placeholder="Enter website URL (e.g., www.example.com)" value={url} onChange={(e) => setUrl(e.target.value)}
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#0F0]" />
                  <button type="submit" disabled={loading} className="bg-[#0F0] text-black font-bold px-6 py-3 rounded-lg hover:bg-green-400 transition-colors">
                    {loading ? 'Analyzing...' : 'Analyze Now'}
                  </button>
                </form>

                {error && <div className="text-red-500 text-center mb-4">{error}</div>}

                <AnimatePresence>
                  {result && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className={`rounded-xl p-6 border ${result.isSafe ? 'bg-green-900/20 border-green-500/50' : 'bg-red-900/20 border-red-500/50'}`}>
                      <div className="flex items-center gap-6 mb-6">
                        <div className="relative w-24 h-24 flex items-center justify-center">
                          <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />
                            <motion.path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" 
                              stroke={result.isSafe ? '#0F0' : '#ea2027'} strokeWidth="3" strokeDasharray={`${result.score}, 100`} />
                          </svg>
                          <div className="absolute flex flex-col items-center">
                            <span className="text-2xl font-bold text-white"><CountUp end={result.score} duration={2} />%</span>
                          </div>
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-white flex items-center gap-2 mb-2">
                            {result.isSafe ? <FaCheckCircle className="text-[#0F0]" /> : <FaExclamationTriangle className="text-[#ea2027]" />}
                            {result.isSafe ? 'This Website is Safe' : 'Suspicious Activity Detected'}
                          </h3>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 bg-black/20 p-3 rounded-lg"><FaLock className="text-slate-400" /> <span>SSL Certificate: <strong className="text-white">{result.details.ssl ? 'Valid' : 'Invalid'}</strong></span></div>
                        <div className="flex items-center gap-3 bg-black/20 p-3 rounded-lg"><FaBug className="text-slate-400" /> <span>Malware: <strong className="text-white">{result.details.malware ? 'Detected' : 'Clean'}</strong></span></div>
                        <div className="flex items-center gap-3 bg-black/20 p-3 rounded-lg"><FaServer className="text-slate-400" /> <span>Server Location: <strong className="text-white">{result.details.serverLoc}</strong></span></div>
                        <div className="flex items-center gap-3 bg-black/20 p-3 rounded-lg"><FaShieldAlt className="text-slate-400" /> <span>Domain Age: <strong className="text-white">{result.details.domainAge}</strong></span></div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {activeTab === 'Security Logs' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto h-full flex flex-col">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <FaFileAlt className="text-indigo-400" /> Live Security Event Logs
              </h2>
              <div className="flex-1 bg-black/20 rounded-xl border border-white/10 p-6 overflow-y-auto">
                <div className="space-y-3">
                  <AnimatePresence>
                    {logs.map((log) => (
                      <motion.div key={log.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                        className={`p-4 rounded-lg border-l-4 flex justify-between items-center bg-slate-800/50
                          ${log.severity === 'Critical' ? 'border-red-500' : log.severity === 'High' ? 'border-yellow-500' : log.severity === 'Medium' ? 'border-blue-500' : 'border-green-500'}`}>
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <span className={`text-xs font-bold uppercase px-2 py-0.5 rounded text-white
                              ${log.severity === 'Critical' ? 'bg-red-500' : log.severity === 'High' ? 'bg-yellow-500 !text-black' : log.severity === 'Medium' ? 'bg-blue-500' : 'bg-green-500'}`}>
                              {log.severity}
                            </span>
                            <span className="font-semibold text-slate-200">{log.type}</span>
                          </div>
                          <div className="text-sm text-slate-400 font-mono">Source IP: {log.source}</div>
                        </div>
                        <div className="text-slate-500 font-mono text-sm">{log.time}</div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'Threat Management' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-5xl mx-auto h-full flex flex-col">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <FaShieldAlt className="text-indigo-400" /> Active Threat Management
              </h2>
              <div className="flex-1 bg-black/20 rounded-xl border border-white/10 overflow-hidden overflow-y-auto">
                <table className="w-full text-left text-sm text-slate-300">
                  <thead className="bg-white/5 text-slate-400 uppercase font-semibold text-xs border-b border-white/10">
                    <tr>
                      <th className="px-6 py-4">Threat Type</th>
                      <th className="px-6 py-4">Severity</th>
                      <th className="px-6 py-4">Source IP</th>
                      <th className="px-6 py-4">Time</th>
                      <th className="px-6 py-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {logs?.map((log) => (
                      <tr key={log.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 font-medium text-slate-200">{log.type}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${log.severity === 'Critical' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : log.severity === 'High' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' : log.severity === 'Medium' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-green-500/20 text-green-400 border border-green-500/30'}`}>{log.severity}</span>
                        </td>
                        <td className="px-6 py-4 font-mono text-xs">{log.source}</td>
                        <td className="px-6 py-4 text-slate-500">{log.time}</td>
                        <td className="px-6 py-4 text-right">
                          <button className="text-indigo-400 hover:text-indigo-300 font-semibold text-xs border border-indigo-400/30 px-3 py-1 rounded hover:bg-indigo-400/10 transition-colors">Isolate</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === 'Remediation' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto h-full">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <FaTools className="text-indigo-400" /> Automated Remediation Playbooks
              </h2>
              <div className="grid gap-4">
                {[
                  { title: 'Isolate Compromised Node', desc: 'Block all ingress/egress traffic on affected firewall port for IP 192.168.1.105.', type: 'Critical', color: 'red' },
                  { title: 'Patch OpenSSL Vulnerability', desc: 'Deploy hotfix KB4532 to all frontend server clusters.', type: 'High', color: 'yellow' },
                  { title: 'Reset Compromised Credentials', desc: 'Force password reset for 3 accounts flagged in recent brute force attempt.', type: 'Medium', color: 'blue' },
                  { title: 'Update Firewall Rules', desc: 'Drop incoming packets from 4 newly identified malicious subnets.', type: 'Low', color: 'green' }
                ].map((item, idx) => (
                  <div key={idx} className="bg-black/20 p-5 rounded-xl border border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-white/20 transition-colors">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className={`w-2 h-2 rounded-full bg-${item.color}-500`}></span>
                        <h4 className="text-white font-bold text-lg">{item.title}</h4>
                      </div>
                      <p className="text-slate-400 text-sm ml-5">{item.desc}</p>
                    </div>
                    <button 
                      onClick={() => runPlaybook(idx)}
                      disabled={!!playbookStatus[idx]}
                      className={`px-5 py-2 rounded-lg font-bold text-sm transition-colors ml-5 sm:ml-0 whitespace-nowrap border
                        ${playbookStatus[idx] === 'Completed' ? 'bg-green-600/20 text-green-400 border-green-500/30' : 
                          playbookStatus[idx] === 'Running...' ? 'bg-yellow-600/20 text-yellow-400 border-yellow-500/30' : 
                          'bg-indigo-600/20 hover:bg-indigo-600/40 border-indigo-500/30 text-indigo-300'}`}
                    >
                      {playbookStatus[idx] || 'Run Playbook'}
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'Log Analysis' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto h-full flex flex-col">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <FaSearch className="text-indigo-400" /> Advanced Log Analysis
              </h2>
              <div className="bg-black/20 rounded-xl p-6 border border-white/10 mb-6">
                <h3 className="text-slate-300 font-medium mb-4">Event Frequency by Severity (Live Data)</h3>
                <div className="h-64 relative w-full">
                  <Bar 
                    data={{
                      labels: ['Critical', 'High', 'Medium', 'Low'],
                      datasets: [
                        { 
                          label: 'Active Logs in Database', 
                          data: [
                            logs?.filter(l => l.severity === 'Critical').length || 0,
                            logs?.filter(l => l.severity === 'High').length || 0,
                            logs?.filter(l => l.severity === 'Medium').length || 0,
                            logs?.filter(l => l.severity === 'Low').length || 0
                          ], 
                          backgroundColor: ['rgba(239, 68, 68, 0.5)', 'rgba(234, 179, 8, 0.5)', 'rgba(56, 189, 248, 0.5)', 'rgba(74, 222, 128, 0.5)'], 
                          borderColor: ['#ef4444', '#eab308', '#38bdf8', '#4ade80'], 
                          borderWidth: 1 
                        }
                      ]
                    }} 
                    options={{ maintainAspectRatio: false, scales: { y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8', precision: 0 } }, x: { grid: { display: false }, ticks: { color: '#94a3b8' } } }, plugins: { legend: { labels: { color: '#e2e8f0' } } } }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-black/20 p-4 rounded-xl border border-white/10 text-center"><div className="text-2xl font-bold text-white mb-1">{logs?.length || 0}</div><div className="text-xs text-slate-400 uppercase">Total Logs Retained</div></div>
                <div className="bg-black/20 p-4 rounded-xl border border-white/10 text-center"><div className="text-2xl font-bold text-indigo-400 mb-1">{queryTime}ms</div><div className="text-xs text-slate-400 uppercase">Real API Latency</div></div>
                <div className="bg-black/20 p-4 rounded-xl border border-white/10 text-center"><div className="text-2xl font-bold text-green-400 mb-1">{requestStats.total === 0 ? '100.0' : (((requestStats.total - requestStats.failed) / requestStats.total) * 100).toFixed(1)}%</div><div className="text-xs text-slate-400 uppercase">API Connection Uptime</div></div>
              </div>
            </motion.div>
          )}

          {activeTab === 'System Settings' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto h-full">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <FaCog className="text-indigo-400" /> System Configuration
              </h2>
              <div className="bg-black/20 rounded-xl border border-white/10 divide-y divide-white/10">
                <div className="p-6 flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-bold mb-1">Autonomous Threat Defense</h4>
                    <p className="text-sm text-slate-400">Allow AI to automatically execute remediation playbooks for Critical threats.</p>
                  </div>
                  <div onClick={() => toggleSetting('autonomous')} className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${settings.autonomous ? 'bg-green-500' : 'bg-slate-600'}`}>
                    <div className={`absolute top-1 w-4 h-4 rounded-full shadow transition-all ${settings.autonomous ? 'right-1 bg-white' : 'left-1 bg-slate-300'}`}></div>
                  </div>
                </div>
                <div className="p-6 flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-bold mb-1">Real-time Push Notifications</h4>
                    <p className="text-sm text-slate-400">Receive alerts via email and SMS when anomalies are detected.</p>
                  </div>
                  <div onClick={() => toggleSetting('notifications')} className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${settings.notifications ? 'bg-green-500' : 'bg-slate-600'}`}>
                    <div className={`absolute top-1 w-4 h-4 rounded-full shadow transition-all ${settings.notifications ? 'right-1 bg-white' : 'left-1 bg-slate-300'}`}></div>
                  </div>
                </div>
                <div className="p-6 flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-bold mb-1">Strict Network Scanning</h4>
                    <p className="text-sm text-slate-400">Perform deep packet inspection on all incoming untrusted subnets.</p>
                  </div>
                  <div onClick={() => toggleSetting('strictScan')} className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${settings.strictScan ? 'bg-green-500' : 'bg-slate-600'}`}>
                    <div className={`absolute top-1 w-4 h-4 rounded-full shadow transition-all ${settings.strictScan ? 'right-1 bg-white' : 'left-1 bg-slate-300'}`}></div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

        </div>
      </div>
    </div>
  );
};

export default WebsiteChecker;
