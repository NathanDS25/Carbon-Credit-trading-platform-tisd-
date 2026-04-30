import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import IndiaHeatmap from '../components/IndiaHeatmap';
import { Shield, Zap, Activity, Database, ExternalLink, CheckCircle2, XCircle, Globe, Cpu, Wallet } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { useWallet } from '../context/WalletContext';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../contracts/CarbonCredit';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const stateFilter = searchParams.get('state');
  const [pendingPlantations, setPendingPlantations] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCreditsMinted: 0,
    activeListings: 0,
    totalTradedVolume: 0
  });
  const { isConnected, connectWallet, provider, account } = useWallet();
  const location = useLocation();
  const path = location.pathname;

  const [heatmapData, setHeatmapData] = useState({});

  useEffect(() => {
    fetchData();
    fetchHeatmap();
  }, []);

  const fetchHeatmap = async () => {
    try {
      const response = await api.get('/heatmap');
      if (response.data.success) {
        const transformed = {};
        response.data.data.forEach(item => {
          transformed[item.state] = {
            credits: item.totalCredits,
            quality: item.avgQuality === 'A' ? 95 : item.avgQuality === 'B' ? 75 : 55
          };
        });
        setHeatmapData(transformed);
      }
    } catch (error) {
      console.error("Heatmap fetch error:", error);
    }
  };

  const fetchData = async () => {
    try {
      const plantationsUrl = stateFilter ? `/plantations?status=PENDING&state=${stateFilter}` : '/plantations?status=PENDING';
      const [pResponse, sResponse] = await Promise.all([
        api.get(plantationsUrl),
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

  const handleVerify = async (plantation, status) => {
    if (status === 'VERIFIED') {
        if (!isConnected) {
            toast.error("Please connect wallet for on-chain minting!");
            connectWallet();
            return;
        }

        try {
            const loadingToast = toast.loading("Initializing Blockchain Transaction...");
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
            
            // Call Smart Contract: mintCredits(address ngo, uint256 amount)
            // Using a default of 100 credits for testing if not specified
            const amount = plantation.creditsAwarded || 100;
            const ngoAddress = plantation.walletAddress || account; // Fallback to current if missing
            
            toast.loading(`Minting ${amount} CRX on Sepolia...`, { id: loadingToast });
            
            const tx = await contract.mintCredits(ngoAddress, amount);
            await tx.wait();
            
            toast.success("Credits Minted On-Chain!", { id: loadingToast });
        } catch (error) {
            console.error("Blockchain Error:", error);
            toast.error("Smart Contract execution failed. Proceeding with database-only update.");
        }
    }

    try {
      toast.loading(status === 'VERIFIED' ? "Synchronizing Database..." : "Rejecting...");
      await api.patch(`/plantations/${plantation.id}/${status.toLowerCase()}`);
      toast.dismiss();
      toast.success(`Plantation ${status.toLowerCase()} successfully!`);
      fetchData();
    } catch (error) {
      toast.dismiss();
      toast.error("Action failed");
    }
  };

  const renderContent = () => {
    if (path.includes('/blockchain')) {
      return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-3">
                <Cpu size={28} className="text-primary" /> On-Chain Protocol Monitor
            </h2>
            <button 
                onClick={connectWallet}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-xs transition-all ${
                    isConnected ? 'bg-primary/20 text-primary border border-primary/30' : 'btn-primary'
                }`}
            >
                <Wallet size={16} />
                {isConnected ? `Connected: ${account.slice(0,6)}...${account.slice(-4)}` : 'Link Node Wallet'}
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="glass p-10 rounded-3xl border border-white/5 space-y-6">
                <h3 className="font-bold text-lg">Registry Smart Contract</h3>
                <div className="p-4 bg-white/5 rounded-xl font-mono text-xs break-all border border-white/10">
                    <p className="text-text-muted mb-2 uppercase font-black">Contract Address (Sepolia)</p>
                    <p className="text-primary">{CONTRACT_ADDRESS}</p>
                </div>
                <div className="flex justify-between items-center text-sm">
                    <span className="text-text-secondary">Network Status</span>
                    <span className="text-primary font-bold flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        OPERATIONAL
                    </span>
                </div>
              </div>

              <div className="glass p-10 rounded-3xl border border-white/5 space-y-6">
                <h3 className="font-bold text-lg">Platform Node Balance</h3>
                <div className="text-4xl font-black text-gradient">
                    {stats.totalCreditsMinted.toLocaleString()} CRX
                </div>
                <p className="text-xs text-text-secondary">Total supply minted and verified across all satellite-authorized plantations.</p>
              </div>
          </div>
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
                  <th className="px-8 py-6">NDVI Analysis</th>
                  <th className="px-8 py-6">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {pendingPlantations.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-8 py-20 text-center text-text-secondary font-bold uppercase tracking-widest opacity-30">No active verification requests.</td>
                  </tr>
                ) : pendingPlantations.map((job, i) => (
                  <tr key={i} className="hover:bg-white/[0.02] transition-all group">
                    <td className="px-8 py-6">
                        <div className="flex flex-col">
                            <span className="font-black text-text-primary uppercase tracking-tight">{job.user?.name || 'Authorized NGO'}</span>
                            <span className="text-[10px] text-text-muted font-mono">{job.user?.email}</span>
                        </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="w-24 h-16 rounded-xl bg-white/5 border border-white/10 overflow-hidden relative group-hover:border-primary/50 transition-all cursor-zoom-in">
                        <img src={job.imageUrl || `https://api.dicebear.com/7.x/shapes/svg?seed=${job.id}`} alt="sat" className="w-full h-full object-cover" />
                        <a href={job.imageUrl} target="_blank" rel="noreferrer" className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <ExternalLink size={16} />
                        </a>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                            <span className="font-mono font-black text-lg text-primary">{job.currentNDVI || '0.742'}</span>
                            <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-md uppercase font-black border border-primary/20">
                                {job.qualityGrade || 'A+'}
                            </span>
                        </div>
                        <div className="w-24 h-1 bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-primary w-[85%] shadow-glow-green" />
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 flex gap-3">
                      <button onClick={() => handleVerify(job, 'VERIFIED')} className="p-3 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-all shadow-glow-green border border-primary/20">
                        <CheckCircle2 size={20} />
                      </button>
                      <button onClick={() => handleVerify(job, 'REJECTED')} className="p-3 rounded-xl bg-danger/10 text-danger hover:bg-danger/20 transition-all border border-danger/20">
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-sm font-black uppercase tracking-widest flex items-center gap-3">
              <Globe size={18} className="text-primary" /> National Inventory Hologram
            </h2>
            <div className="min-h-[750px] glass rounded-3xl border border-white/5 relative flex flex-col overflow-hidden">
                <IndiaHeatmap 
                    data={heatmapData} 
                    onStateClick={(state) => navigate(`/admin/plantations?state=${state}`)} 
                />
            </div>
          </div>

          <div className="glass p-8 rounded-3xl border border-white/5 space-y-6">
            <h2 className="text-xl font-black tracking-tight text-text-primary">System Health</h2>
            <div className="space-y-4">
                {[
                    { label: 'Node Sync', value: '99.9%', color: 'text-primary' },
                    { label: 'Prisma Latency', value: '24ms', color: 'text-info' },
                    { label: 'Blockchain TPS', value: '12.4', color: 'text-purple' },
                    { label: 'ML Queue', value: 'Active', color: 'text-primary' },
                ].map((item, i) => (
                    <div key={i} className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5">
                        <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">{item.label}</span>
                        <span className={`text-xs font-black ${item.color}`}>{item.value}</span>
                    </div>
                ))}
            </div>
          </div>
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
