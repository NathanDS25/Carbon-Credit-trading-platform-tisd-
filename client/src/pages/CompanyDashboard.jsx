// UI Enhanced v2 — 3D Map + Motion + Glassmorphism
import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import IndiaHeatmap from '../components/IndiaHeatmap';
import { TrendingUp, Award, Users, DollarSign, Activity, Globe, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../services/api';

const RollingNumber = ({ value, prefix = "" }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const target = parseInt(value.toString().replace(/[^0-9]/g, ''));

  useEffect(() => {
    let start = 0;
    const duration = 1200;
    const increment = target / (duration / 30);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setDisplayValue(target);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(start));
      }
    }, 30);
    return () => clearInterval(timer);
  }, [target]);

  return <span>{prefix}{displayValue.toLocaleString()}</span>;
};

const StatCard = ({ title, value, change, icon: Icon, color, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
    whileHover={{ y: -5, scale: 1.02 }}
    className="glass p-6 rounded-2xl border border-white/5 relative overflow-hidden group card-glow cursor-default"
  >
    <div className={`absolute -top-4 -right-4 p-8 opacity-5 group-hover:opacity-10 transition-all duration-500 transform rotate-12 ${color}`}>
      <Icon size={80} />
    </div>
    
    <div className="flex items-center gap-3 mb-4">
      <div className={`p-2 rounded-lg bg-opacity-10 ${color.replace('text-', 'bg-')} border border-white/5`}>
        <Icon size={18} className={color} />
      </div>
      <p className="text-[10px] text-text-secondary uppercase font-black tracking-widest">{title}</p>
    </div>

    <div className="space-y-1">
      <h3 className="text-3xl font-black tracking-tighter text-gradient">
        <RollingNumber value={value} prefix={value.toString().startsWith('₹') ? '₹' : ''} />
        {value.toString().includes('Tons') && ' Tons'}
      </h3>
      <div className="flex items-center gap-2">
        <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${change.startsWith('+') ? 'bg-primary/10 text-primary' : 'text-danger bg-danger/10'}`}>
          {change}
        </div>
        <span className="text-[10px] text-text-muted font-bold uppercase">Live Data</span>
      </div>
    </div>
  </motion.div>
);

const CompanyDashboard = () => {
  const [stats, setStats] = useState({
    creditsOwned: 0,
    totalOffset: 0,
    portfolioValue: 0,
    ngoNetwork: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/admin/stats');
      if (response.data.data) {
        const s = response.data.data;
        setStats({
          creditsOwned: s.totalCreditsMinted || 0,
          totalOffset: s.totalCreditsMinted * 0.8 || 0,
          portfolioValue: s.totalTradedVolume || 0,
          ngoNetwork: s.totalUsers || 0
        });
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  const [heatmapData] = useState({
    'Maharashtra': { credits: 12500, quality: 95 },
    'Karnataka': { credits: 8200, quality: 85 },
    'Madhya Pradesh': { credits: 15400, quality: 70 },
    'Kerala': { credits: 4500, quality: 98 },
    'Tamil Nadu': { credits: 9800, quality: 82 },
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  return (
    <DashboardLayout role="COMPANY">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        <div className="flex items-end justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Globe size={14} className="text-primary animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Live Terminal</span>
            </div>
            <h1 className="text-4xl font-black tracking-tighter text-text-primary">Ecosystem <span className="text-gradient">Intelligence</span></h1>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard title="Credits Owned" value={stats.creditsOwned} change="+100%" icon={Award} color="text-primary" delay={0.1} />
          <StatCard title="Total Offset" value={`${stats.totalOffset} Tons`} change="+100%" icon={TrendingUp} color="text-info" delay={0.2} />
          <StatCard title="Portfolio Value" value={`₹${stats.portfolioValue}`} change="+100%" icon={DollarSign} color="text-primary" delay={0.3} />
          <StatCard title="NGO Network" value={stats.ngoNetwork} change="+100%" icon={Users} color="text-info" delay={0.4} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-sm font-black uppercase tracking-widest flex items-center gap-3">
              <Activity size={18} className="text-primary" /> Regional Impact Hologram
            </h2>
            <div className="h-[600px] relative">
              <IndiaHeatmap data={heatmapData} onStateClick={(state) => console.log(state)} />
            </div>
          </div>

          <div className="glass rounded-3xl border border-white/5 flex flex-col overflow-hidden">
            <div className="p-6 border-b border-white/5 bg-white/[0.01]">
              <h2 className="text-xl font-black tracking-tight text-text-primary">Live Order Book</h2>
              <div className="flex items-center gap-1.5 mt-1">
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shadow-glow-green" />
                <span className="text-[10px] font-black text-primary uppercase tracking-widest">Real-Time Sync</span>
              </div>
            </div>
            
            <div className="flex-1 overflow-auto">
              <table className="w-full text-left">
                <thead className="bg-white/5 text-[9px] font-black text-text-muted uppercase tracking-widest">
                  <tr>
                    <th className="px-6 py-4">Strike (INR)</th>
                    <th className="px-6 py-4">Vol</th>
                    <th className="px-6 py-4">Conf</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {[2850, 2840, 2835, 2820].map((price, i) => (
                    <tr key={i} className="hover:bg-white/5 transition-colors cursor-pointer group">
                      <td className="px-6 py-4 font-mono text-xs font-bold text-danger">{price.toLocaleString()}</td>
                      <td className="px-6 py-4 font-mono text-[10px]">{(Math.random() * 500).toFixed(0)}</td>
                      <td className="px-6 py-4"><span className="text-[8px] font-black px-2 py-0.5 rounded bg-purple/10 text-purple border border-purple/20">U-TIER</span></td>
                    </tr>
                  ))}
                  <tr className="bg-primary/5">
                    <td colSpan="3" className="px-6 py-4 text-center text-[10px] font-black text-primary uppercase tracking-widest">Market Spot: ₹2,810.00</td>
                  </tr>
                  {[2805, 2795, 2780, 2775].map((price, i) => (
                    <tr key={i} className="hover:bg-white/5 transition-colors cursor-pointer group">
                      <td className="px-6 py-4 font-mono text-xs font-bold text-primary">{price.toLocaleString()}</td>
                      <td className="px-6 py-4 font-mono text-[10px]">{(Math.random() * 500).toFixed(0)}</td>
                      <td className="px-6 py-4"><span className="text-[8px] font-black px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">A-TIER</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-6 border-t border-white/5">
              <button className="w-full py-4 rounded-xl bg-gradient-to-r from-primary to-info text-background font-black uppercase tracking-[0.2em] text-xs shadow-glow-green hover:brightness-110 transition-all">Execute Transaction</button>
            </div>
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default CompanyDashboard;
