import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Filler } from 'chart.js';
import { Pie, Line } from 'react-chartjs-2';
import {
  FaHome, FaShieldAlt, FaTools, FaFileAlt, FaNetworkWired, FaChartBar, FaCog,
  FaExclamationTriangle, FaBell, FaChevronRight, FaShieldVirus, FaCheckCircle, FaSpinner, FaServer, FaLock, FaUserSecret
} from 'react-icons/fa';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Filler);

const navItems = [
  { name: 'Dashboard', icon: FaHome },
  { name: 'Threat Management', icon: FaShieldAlt },
  { name: 'Remediation', icon: FaTools },
  { name: 'Security Logs', icon: FaFileAlt },
  { name: 'Network Scan', icon: FaNetworkWired },
  { name: 'Log Analysis', icon: FaChartBar },
  { name: 'System Settings', icon: FaCog },
];

// --- Sub-Components for Live Tabs ---

const MainDashboardTab = () => {
  const [criticalThreats, setCriticalThreats] = useState(3);
  const [activeThreats, setActiveThreats] = useState(12);
  const [logs, setLogs] = useState(() => [
    { id: 1, severity: 'High', type: 'Phishing Attempt', source: '192.168.1.105', time: new Date(Date.now() - 50000).toLocaleTimeString() },
    { id: 2, severity: 'Medium', type: 'Unauthorized Access', source: '10.0.0.4', time: new Date(Date.now() - 100000).toLocaleTimeString() },
    { id: 3, severity: 'Critical', type: 'DDoS Attack Detected', source: 'Multiple IPs', time: new Date(Date.now() - 150000).toLocaleTimeString() },
  ]);

  useEffect(() => {

    const interval = setInterval(() => {
      const weightedSeverity = Math.random() > 0.85 ? 'Critical' : Math.random() > 0.6 ? 'High' : Math.random() > 0.3 ? 'Medium' : 'Low';
      const types = ['SQL Injection', 'Malware Payload', 'Brute Force Attempt', 'Port Scan', 'Data Exfiltration'];
      
      const newLog = {
        id: Date.now(),
        severity: weightedSeverity,
        type: types[Math.floor(Math.random() * types.length)],
        source: `${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`,
        time: new Date().toLocaleTimeString()
      };
      
      setLogs(prev => [newLog, ...prev].slice(0, 10));
      
      if (newLog.severity === 'Critical') setCriticalThreats(prev => prev + 1);
      if (['Critical', 'High', 'Medium'].includes(newLog.severity)) setActiveThreats(prev => prev + 1);
      
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  const pieData = {
    labels: ['Critical', 'High', 'Medium', 'Low'],
    datasets: [{
      data: [criticalThreats, Math.max(5, activeThreats - criticalThreats - 3), 8, 20], 
      backgroundColor: ['#ef4444', '#eab308', '#3b82f6', '#22c55e'],
      borderColor: '#1e293b',
      borderWidth: 2,
    }],
  };

  const pieOptions = {
    plugins: { legend: { position: 'bottom', labels: { color: '#cbd5e1', padding: 20, font: { size: 12 } } } },
    maintainAspectRatio: false,
    cutout: '0%',
  };

  return (
    <>
      <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Security Dashboard</h1>
          <p className="text-slate-400 mt-1">Real-time threat monitoring and analysis.</p>
        </div>
        <div className="flex items-center gap-3 text-sm font-medium text-slate-300 bg-slate-800/80 py-2 px-4 rounded-full border border-slate-700">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          System Online
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Critical Threats */}
        <div className="bg-slate-800/60 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-red-500/20 hover:border-red-500/40 transition-colors flex flex-col justify-between group">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-500/20 rounded-xl"><FaExclamationTriangle className="text-2xl text-red-500" /></div>
              <h3 className="text-lg font-semibold text-slate-200">Critical Threats</h3>
            </div>
            <span className="text-4xl font-black text-red-500">{criticalThreats}</span>
          </div>
          <p className="text-slate-400 text-sm mb-4">Requires immediate attention and remediation.</p>
          <button className="flex items-center justify-between w-full py-2 px-4 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors border border-red-500/20 group-hover:border-red-500/40">
            <span className="font-semibold">View All Critical</span><FaChevronRight />
          </button>
        </div>

        {/* Active Threats */}
        <div className="bg-slate-800/60 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-yellow-500/20 hover:border-yellow-500/40 transition-colors flex flex-col justify-between group">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-yellow-500/20 rounded-xl"><FaBell className="text-2xl text-yellow-500" /></div>
              <h3 className="text-lg font-semibold text-slate-200">Active Threats</h3>
            </div>
            <span className="text-4xl font-black text-yellow-500">{activeThreats}</span>
          </div>
          <p className="text-slate-400 text-sm mb-4">Ongoing security events currently being tracked.</p>
          <button className="flex items-center justify-between w-full py-2 px-4 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 rounded-lg transition-colors border border-yellow-500/20 group-hover:border-yellow-500/40">
            <span className="font-semibold">View All Active</span><FaChevronRight />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-1 bg-slate-800/60 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-slate-700 flex flex-col h-[420px]">
          <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <FaChartBar className="text-indigo-400" /> Threats by Severity
          </h2>
          <div className="flex-1 w-full relative min-h-0"><Pie data={pieData} options={pieOptions} /></div>
        </div>

        <div className="xl:col-span-2 bg-slate-800/60 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-slate-700 flex flex-col h-[420px] overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-white flex items-center gap-3">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span> Live AI Threat Detection
            </h2>
            <span className="text-xs font-mono text-indigo-400 bg-indigo-900/30 px-3 py-1 rounded-full border border-indigo-500/30">Active</span>
          </div>
          <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
            <AnimatePresence>
              {logs.map((log) => (
                <motion.div key={log.id} initial={{ opacity: 0, x: -20, height: 0 }} animate={{ opacity: 1, x: 0, height: 'auto' }} className={`p-4 rounded-xl border-l-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md ${log.severity === 'Critical' ? 'bg-red-900/20 border-red-500' : log.severity === 'High' ? 'bg-yellow-900/10 border-yellow-500' : log.severity === 'Medium' ? 'bg-blue-900/10 border-blue-500' : 'bg-green-900/10 border-green-500'}`}>
                  <div className="flex items-center gap-4">
                    <div className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded ${log.severity === 'Critical' ? 'bg-red-500 text-white' : log.severity === 'High' ? 'bg-yellow-500 text-slate-900' : log.severity === 'Medium' ? 'bg-blue-500 text-white' : 'bg-green-500 text-white'}`}>{log.severity}</div>
                    <div>
                      <p className={`font-semibold ${log.severity === 'Critical' ? 'text-red-400' : 'text-slate-200'}`}>{log.type}</p>
                      <p className="text-sm text-slate-400 font-mono mt-1">Source: {log.source}</p>
                    </div>
                  </div>
                  <div className="text-sm text-slate-500 font-mono">{log.time}</div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  );
};

const ThreatManagementTab = () => {
  const [threats, setThreats] = useState(() => [
    { id: 'TR-9921', ip: '192.168.1.105', type: 'Phishing Attempt', status: 'Active', severity: 'High', time: new Date().toLocaleTimeString() },
    { id: 'TR-9922', ip: '10.0.0.4', type: 'Unauthorized Access', status: 'Blocked', severity: 'Medium', time: new Date(Date.now() - 60000).toLocaleTimeString() },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      const types = ['SQL Injection', 'Malware Payload', 'Brute Force Attempt', 'Port Scan'];
      const newThreat = {
        id: `TR-${Math.floor(Math.random()*10000)}`,
        ip: `${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`,
        type: types[Math.floor(Math.random() * types.length)],
        status: 'Active',
        severity: Math.random() > 0.8 ? 'Critical' : Math.random() > 0.5 ? 'High' : 'Medium',
        time: new Date().toLocaleTimeString()
      };
      setThreats(prev => [newThreat, ...prev].slice(0, 8));
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  const handleAction = (id, action) => {
    setThreats(prev => prev.map(t => t.id === id ? { ...t, status: action } : t));
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <h2 className="text-2xl font-bold text-white flex items-center gap-3"><FaShieldAlt className="text-red-500" /> Threat Management (Live)</h2>
      <div className="bg-slate-800/60 backdrop-blur-lg rounded-2xl p-6 border border-slate-700 shadow-xl overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-slate-700 text-slate-400">
              <th className="py-3 px-4">Threat ID</th>
              <th className="py-3 px-4">Source IP</th>
              <th className="py-3 px-4">Type</th>
              <th className="py-3 px-4">Severity</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {threats.map((t) => (
                <motion.tr key={t.id} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                  <td className="py-3 px-4 font-mono text-sm">{t.id}</td>
                  <td className="py-3 px-4 font-mono text-sm text-blue-400">{t.ip}</td>
                  <td className="py-3 px-4">{t.type}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${t.severity === 'Critical' ? 'bg-red-500/20 text-red-400 border border-red-500/50' : t.severity === 'High' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/50' : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50'}`}>{t.severity}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`flex items-center gap-2 ${t.status === 'Active' ? 'text-red-400' : 'text-green-400'}`}>
                      {t.status === 'Active' ? <span className="animate-pulse w-2 h-2 bg-red-500 rounded-full"></span> : <FaCheckCircle />}
                      {t.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 flex gap-2 justify-end">
                    {t.status === 'Active' && (
                      <>
                        <button onClick={() => handleAction(t.id, 'Quarantined')} className="bg-orange-500/20 hover:bg-orange-500/40 text-orange-400 px-3 py-1 rounded text-sm transition-colors border border-orange-500/30">Quarantine</button>
                        <button onClick={() => handleAction(t.id, 'Blocked')} className="bg-red-500/20 hover:bg-red-500/40 text-red-400 px-3 py-1 rounded text-sm transition-colors border border-red-500/30">Block IP</button>
                      </>
                    )}
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

const RemediationTab = () => {
  const [tasks, setTasks] = useState([
    { id: 1, name: 'Patch CVE-2024-1234', progress: 45, status: 'running' },
    { id: 2, name: 'Isolate Infected Node 10.0.0.8', progress: 80, status: 'running' },
    { id: 3, name: 'Update Firewall Rules', progress: 100, status: 'completed' },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTasks(prev => prev.map(task => {
        if (task.status === 'running') {
          const newProg = Math.min(100, task.progress + Math.floor(Math.random() * 10) + 2);
          return { ...task, progress: newProg, status: newProg === 100 ? 'completed' : 'running' };
        }
        return task;
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <h2 className="text-2xl font-bold text-white flex items-center gap-3"><FaTools className="text-orange-400" /> Automated Remediation (Live)</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tasks.map(task => (
          <div key={task.id} className="bg-slate-800/60 backdrop-blur-lg rounded-2xl p-6 border border-slate-700 shadow-xl relative overflow-hidden">
             {task.status === 'completed' && <div className="absolute top-0 left-0 w-1 h-full bg-green-500" />}
             {task.status === 'running' && <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 animate-pulse" />}
             <div className="flex justify-between items-center mb-4">
               <h3 className="font-semibold text-slate-200">{task.name}</h3>
               {task.status === 'running' ? <FaSpinner className="animate-spin text-blue-400" /> : <FaCheckCircle className="text-green-400" />}
             </div>
             <div className="w-full bg-slate-700 rounded-full h-3 mb-2 overflow-hidden">
               <div className={`h-full rounded-full transition-all duration-500 ${task.progress === 100 ? 'bg-green-500' : 'bg-blue-500'}`} style={{ width: `${task.progress}%` }}></div>
             </div>
             <div className="text-right text-sm text-slate-400 font-mono">{task.progress}%</div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

const SecurityLogsTab = () => {
  const [logs, setLogs] = useState([
    "[SYSTEM] Initiating secure shell daemon...",
    "[INFO] Loaded 14092 rules for threat detection."
  ]);
  const endRef = useRef(null);

  useEffect(() => {
    const messages = [
      "Detected anomalous packet from 172.16.254.1",
      "Firewall block triggered on port 22",
      "User 'admin' failed authentication (3 attempts)",
      "Syncing telemetry data to cloud server...",
      "Kernel module 'sec_audit' loaded successfully.",
      "Connection timeout on internal subnet 10.0.x.x"
    ];
    const interval = setInterval(() => {
      const msg = messages[Math.floor(Math.random() * messages.length)];
      const prefix = Math.random() > 0.8 ? '[WARN]' : Math.random() > 0.9 ? '[ERROR]' : '[INFO]';
      setLogs(prev => [...prev, `${new Date().toISOString()} ${prefix} ${msg}`].slice(-50));
    }, 800);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 h-full flex flex-col min-h-[600px]">
      <h2 className="text-2xl font-bold text-white flex items-center gap-3"><FaFileAlt className="text-green-400" /> Live Security Logs</h2>
      <div className="bg-[#0a0a0a] rounded-2xl p-4 border border-slate-700 shadow-xl flex-1 overflow-y-auto font-mono text-sm leading-relaxed custom-scrollbar h-[500px]">
        {logs.map((l, i) => (
          <div key={i} className={`mb-1 ${l.includes('[ERROR]') ? 'text-red-500' : l.includes('[WARN]') ? 'text-yellow-400' : 'text-green-400'}`}>
            <span className="opacity-50 select-none mr-2">{(i+1).toString().padStart(3, '0')}</span>
            {l}
          </div>
        ))}
        <div ref={endRef} />
      </div>
    </motion.div>
  );
};

const NetworkScanTab = () => {
  const [nodes, setNodes] = useState(() => Array(15).fill(0).map((_, i) => ({
    id: i,
    ip: `192.168.1.${100 + i}`,
    status: Math.random() > 0.8 ? 'offline' : 'online',
    ping: Math.floor(Math.random() * 50) + 10
  })));

  useEffect(() => {
    const interval = setInterval(() => {
      setNodes(prev => prev.map(n => ({
        ...n,
        ping: n.status === 'online' ? Math.max(1, n.ping + (Math.random() * 10 - 5)) : 0,
        status: Math.random() > 0.95 ? (n.status === 'online' ? 'offline' : 'online') : n.status
      })));
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <h2 className="text-2xl font-bold text-white flex items-center gap-3"><FaNetworkWired className="text-purple-400" /> Live Network Topology Scan</h2>
      <div className="bg-slate-800/60 backdrop-blur-lg rounded-2xl p-8 border border-slate-700 shadow-xl min-h-[500px]">
        <div className="w-full h-full flex flex-wrap justify-center content-start gap-6">
          {nodes.map(n => (
            <motion.div layout key={n.id} className={`relative flex flex-col items-center justify-center p-4 rounded-xl border-2 w-32 h-32 bg-slate-900/80 shadow-lg transition-colors ${n.status === 'online' ? 'border-green-500/30 hover:border-green-500' : 'border-red-500/30 hover:border-red-500'}`}>
              <FaServer className={`text-3xl mb-3 ${n.status === 'online' ? 'text-green-400' : 'text-red-500'}`} />
              <div className="text-xs font-mono text-slate-300">{n.ip}</div>
              <div className="text-[10px] text-slate-500 font-mono mt-1">{n.status === 'online' ? `${n.ping.toFixed(0)}ms` : 'OFFLINE'}</div>
              {n.status === 'online' && <div className="absolute top-2 right-2 w-2 h-2 bg-green-500 rounded-full animate-ping"></div>}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const LogAnalysisTab = () => {
  const [dataPts, setDataPts] = useState(() => Array(20).fill(0).map(() => Math.floor(Math.random() * 100)));

  useEffect(() => {
    const interval = setInterval(() => {
      setDataPts(prev => [...prev.slice(1), Math.floor(Math.random() * 100) + 20]);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const data = {
    labels: Array(20).fill('').map((_, i) => `T-${20-i}s`),
    datasets: [{
      label: 'Log Ingestion Rate (events/sec)',
      data: dataPts,
      borderColor: '#8b5cf6',
      backgroundColor: 'rgba(139, 92, 246, 0.2)',
      borderWidth: 2,
      fill: true,
      tension: 0.4,
      pointRadius: 3,
      pointBackgroundColor: '#8b5cf6'
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } },
      x: { grid: { display: false }, ticks: { color: '#94a3b8' } }
    },
    plugins: { legend: { labels: { color: '#cbd5e1' } } },
    animation: { duration: 500, easing: 'linear' }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <h2 className="text-2xl font-bold text-white flex items-center gap-3"><FaChartBar className="text-indigo-400" /> Real-time Log Analytics</h2>
      <div className="bg-slate-800/60 backdrop-blur-lg rounded-2xl p-6 border border-slate-700 shadow-xl h-[500px]">
        <Line data={data} options={options} />
      </div>
    </motion.div>
  );
};

const SystemSettingsTab = () => {
  const [settings, setSettings] = useState({
    firewall: { val: true, loading: false },
    ids: { val: true, loading: false },
    autoRemediate: { val: false, loading: false },
    strictMode: { val: false, loading: false },
  });

  const toggle = (key) => {
    setSettings(p => ({ ...p, [key]: { ...p[key], loading: true } }));
    setTimeout(() => {
      setSettings(p => ({ ...p, [key]: { val: !p[key].val, loading: false } }));
    }, 1200); 
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <h2 className="text-2xl font-bold text-white flex items-center gap-3"><FaCog className="text-slate-400" /> Live System Configuration</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { id: 'firewall', name: 'Global Firewall Status', desc: 'Enforce inbound/outbound packet filtering', icon: FaShieldAlt },
          { id: 'ids', name: 'Intrusion Detection (IDS)', desc: 'Monitor network traffic for malicious activity', icon: FaUserSecret },
          { id: 'autoRemediate', name: 'Auto-Remediation', desc: 'Automatically block IPs on high-confidence threats', icon: FaTools },
          { id: 'strictMode', name: 'Zero-Trust Strict Mode', desc: 'Require MFA for all internal service access', icon: FaLock },
        ].map(item => {
          const state = settings[item.id];
          return (
            <div key={item.id} className="bg-slate-800/60 backdrop-blur-lg rounded-2xl p-6 border border-slate-700 shadow-xl flex justify-between items-center transition-colors hover:border-slate-600">
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl ${state.val ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-700 text-slate-400'}`}>
                  <item.icon className="text-2xl" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-200">{item.name}</h3>
                  <p className="text-sm text-slate-400">{item.desc}</p>
                </div>
              </div>
              <button 
                onClick={() => !state.loading && toggle(item.id)}
                disabled={state.loading}
                className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 ${state.val ? 'bg-blue-600' : 'bg-slate-600'} ${state.loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${state.val ? 'translate-x-9' : 'translate-x-1'}`} />
                {state.loading && <FaSpinner className="absolute -top-8 right-1/2 translate-x-1/2 text-blue-400 animate-spin" />}
              </button>
            </div>
          )
        })}
      </div>
    </motion.div>
  );
};

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('Dashboard');

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'Dashboard': return <MainDashboardTab />;
      case 'Threat Management': return <ThreatManagementTab />;
      case 'Remediation': return <RemediationTab />;
      case 'Security Logs': return <SecurityLogsTab />;
      case 'Network Scan': return <NetworkScanTab />;
      case 'Log Analysis': return <LogAnalysisTab />;
      case 'System Settings': return <SystemSettingsTab />;
      default: return <MainDashboardTab />;
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-900 text-slate-200 font-sans mt-16 md:mt-0 pt-4 md:pt-20">
      {/* Sidebar Navigation */}
      <div className="md:w-64 w-full bg-slate-800/50 backdrop-blur-xl border-b md:border-b-0 md:border-r border-slate-700 flex flex-row md:flex-col overflow-x-auto md:overflow-x-visible flex-shrink-0 z-10 custom-scrollbar-hide">
        <div className="hidden md:flex items-center gap-3 p-6 border-b border-slate-700">
          <FaShieldVirus className="text-3xl text-blue-500" />
          <span className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">CyberOps</span>
        </div>
        <div className="flex flex-row md:flex-col p-2 md:p-4 gap-2 flex-1">
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={() => setActiveTab(item.name)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 whitespace-nowrap outline-none
                ${activeTab === item.name 
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.15)]' 
                  : 'hover:bg-slate-700/50 text-slate-400 hover:text-slate-200'}`}
            >
              <item.icon className={`text-lg ${activeTab === item.name ? 'text-blue-400' : ''}`} />
              <span className="font-medium">{item.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-4 md:p-8 overflow-y-auto w-full relative h-screen md:h-auto">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto">
          {renderActiveTab()}
        </div>
      </div>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(30, 41, 59, 0.5); border-radius: 8px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(71, 85, 105, 0.8); border-radius: 8px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(100, 116, 139, 1); }
        .custom-scrollbar-hide::-webkit-scrollbar { display: none; }
        .custom-scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default Dashboard;
