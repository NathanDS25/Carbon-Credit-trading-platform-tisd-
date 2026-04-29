// UI Enhanced v2 — 3D Map + Motion + Glassmorphism
import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { Shield, Zap, Activity, Database, ExternalLink, CheckCircle2, XCircle, Globe, Cpu } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
  const [pendingPlantations, setPendingPlantations] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCreditsMinted: 0,
    activeListings: 0,
    totalTradedVolume: 0
  });
  const location = useLocation();
  const path = location.pathname;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [pResponse, sResponse] = await Promise.all([
        api.get('/plantations?status=PENDING'),
        api.get('/admin/stats')
      ]);
      setPendingPlantations(pResponse.data.data || []);
      if (sResponse.data.data) {
        setStats(sResponse.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch admin data:", error);
    }
  };

  const handleVerify = async (id, status) => {
    try {
      toast.loading(status === 'VERIFIED' ? "Minting Credits on Blockchain..." : "Rejecting...");
      await api.patch(`/plantations/${id}/${status.toLowerCase()}`);
      toast.dismiss();
      toast.success(`Plantation ${status.toLowerCase()} successfully!`);
      fetchData();
    } catch (error) {
      toast.dismiss();
      toast.error("Action failed");
    }
  };

  const renderContent = () => {
    if (path.includes('/users')) {
      return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass p-12 rounded-3xl text-center border border-white/5">
          <Database size={64} className="mx-auto mb-6 text-primary opacity-30" />
          <h2 className="text-2xl font-black uppercase tracking-tighter">Identity Management</h2>
          <p className="text-text-secondary text-sm mt-2">Database visualization of all active NGO and Business accounts.</p>
        </motion.div>
      );
    }

    if (path.includes('/blockchain')) {
      return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass p-12 rounded-3xl text-center border border-white/5">
          <Cpu size={64} className="mx-auto mb-6 text-primary opacity-30" />
          <h2 className="text-2xl font-black uppercase tracking-tighter">On-Chain Node Monitor</h2>
          <p className="text-sm text-text-secondary mt-2 font-mono bg-white/5 p-4 rounded-xl">
            Sepolia Testnet: {import.meta.env.VITE_CONTRACT_ADDRESS || '0x71C7656EC7ab88b098defB751B7401B5f6d8976F'}
          </p>
        </motion.div>
      );
    }

    if (path.includes('/plantations')) {
      return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="flex items-center gap-3">
            <Shield size={24} className="text-primary" />
            <h2 className="text-2xl font-black uppercase tracking-tighter">Verification <span className="text-gradient">Queue</span></h2>
          </div>
          <div className="glass rounded-3xl border border-white/5 overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-white/5 text-text-secondary text-[10px] uppercase font-black tracking-widest">
                <tr>
                  <th className="px-8 py-6">NGO Entity</th>
                  <th className="px-8 py-6">Satellite Intel</th>
                  <th className="px-8 py-6">NDVI Score</th>
                  <th className="px-8 py-6">Protocol</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {pendingPlantations.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-8 py-20 text-center text-text-secondary font-bold uppercase tracking-widest opacity-30">No active verification requests.</td>
                  </tr>
                ) : pendingPlantations.map((job, i) => (
                  <tr key={i} className="hover:bg-white/[0.02] transition-all group">
                    <td className="px-8 py-6 font-black text-text-primary uppercase tracking-tight">{job.user?.name || 'Authorized NGO'}</td>
                    <td className="px-8 py-6">
                      <div className="w-16 h-16 rounded-xl bg-white/5 border border-white/10 overflow-hidden relative group-hover:border-primary/50 transition-all cursor-zoom-in">
                        <img src={job.imageUrl || `https://api.dicebear.com/7.x/shapes/svg?seed=${job.id}`} alt="sat" className="w-full h-full object-cover" />
                        <a href={job.imageUrl} target="_blank" rel="noreferrer" className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <ExternalLink size={16} />
                        </a>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-lg text-primary">{job.currentNDVI || 'ANALYZING'}</span>
                        {job.qualityGrade && (
                          <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-md uppercase font-black border border-primary/20">Grade {job.qualityGrade}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-6 flex gap-3">
                      <button onClick={() => handleVerify(job.id, 'VERIFIED')} className="p-3 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-all shadow-glow-green border border-primary/20">
                        <CheckCircle2 size={20} />
                      </button>
                      <button onClick={() => handleVerify(job.id, 'REJECTED')} className="p-3 rounded-xl bg-danger/10 text-danger hover:bg-danger/20 transition-all border border-danger/20">
                        <XCircle size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      );
    }

    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
        <div className="flex items-end justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Globe size={14} className="text-primary animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">System Oversight</span>
            </div>
            <h1 className="text-4xl font-black tracking-tighter text-text-primary">Admin <span className="text-gradient">Console</span></h1>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: 'Total Users', value: stats.totalUsers, icon: Database, color: 'text-info' },
            { label: 'Credits Minted', value: stats.totalCreditsMinted, icon: Zap, color: 'text-primary' },
            { label: 'Market Active', value: stats.activeListings, icon: Activity, color: 'text-info' },
            { label: 'System Volume', value: `₹${(stats.totalTradedVolume).toLocaleString()}`, icon: Shield, color: 'text-primary' },
          ].map((kpi, i) => (
            <div key={i} className="glass p-8 rounded-3xl border border-white/5 flex items-center justify-between group hover:border-primary/20 transition-all">
              <div>
                <p className="text-text-secondary text-[10px] uppercase font-black tracking-widest">{kpi.label}</p>
                <h3 className="text-3xl font-black mt-2 text-gradient tracking-tighter">{kpi.value}</h3>
              </div>
              <kpi.icon className={`${kpi.color} opacity-20 group-hover:opacity-100 transition-all`} size={40} />
            </div>
          ))}
        </div>
      </motion.div>
    );
  };

  return (
    <DashboardLayout role="ADMIN">
      {renderContent()}
    </DashboardLayout>
  );
};

export default AdminDashboard;
