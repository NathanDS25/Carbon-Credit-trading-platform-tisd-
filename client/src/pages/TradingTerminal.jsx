import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import IndiaHeatmap from '../components/IndiaHeatmap';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ComposedChart,
  Cell,
  Bar
} from 'recharts';
import { TrendingUp, Activity, Wallet, ShieldCheck, Zap, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';

// Mock OHLC Data for Candlestick Chart
const candlestickData = [
  { time: '09:00', open: 2750, close: 2780, high: 2800, low: 2740 },
  { time: '10:00', open: 2780, close: 2765, high: 2790, low: 2755 },
  { time: '11:00', open: 2765, close: 2810, high: 2830, low: 2760 },
  { time: '12:00', open: 2810, close: 2850, high: 2870, low: 2800 },
  { time: '13:00', open: 2850, close: 2830, high: 2860, low: 2820 },
  { time: '14:00', open: 2830, close: 2890, high: 2910, low: 2820 },
  { time: '15:00', open: 2890, close: 2870, high: 2900, low: 2860 },
];

// Mock data moved to useEffect fallback

const CandlestickShape = (props) => {
  const { x, y, width, height, open, close, high, low, fill } = props;
  const isUp = close > open;
  const color = isUp ? '#00C896' : '#FF4F5E';
  
  // Calculate relative positions
  const ratio = height / Math.abs(open - close);
  const highY = y - (high - Math.max(open, close)) * ratio;
  const lowY = y + height + (Math.min(open, close) - low) * ratio;

  return (
    <g>
      {/* Wick */}
      <line x1={x + width / 2} y1={highY} x2={x + width / 2} y2={lowY} stroke={color} strokeWidth={2} />
      {/* Body */}
      <rect x={x} y={y} width={width} height={height} fill={color} rx={2} />
    </g>
  );
};

const TradingTerminal = () => {
  const navigate = useNavigate();
  const [view, setView] = useState('map'); // Default to 'map' for high-fidelity inventory visualization
  const [heatmapData, setHeatmapData] = useState({});

  useEffect(() => {
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
            quality: item.avgQuality === 'A' ? 95 : item.avgQuality === 'B' ? 75 : 55,
            ngoCount: item.ngoCount
          };
        });
        setHeatmapData(transformed);
      }
    } catch (error) {
      console.error("Failed to fetch heatmap:", error);
      // Premium Mock Fallback
      setHeatmapData({
        'Maharashtra': { credits: 12500, quality: 95, ngoCount: 24 },
        'Karnataka': { credits: 8200, quality: 85, ngoCount: 18 },
        'Madhya Pradesh': { credits: 15400, quality: 70, ngoCount: 32 },
        'Kerala': { credits: 4500, quality: 98, ngoCount: 12 },
        'Tamil Nadu': { credits: 9800, quality: 82, ngoCount: 21 },
        'Gujarat': { credits: 7400, quality: 88, ngoCount: 15 },
        'Rajasthan': { credits: 5600, quality: 65, ngoCount: 10 },
      });
    }
  };

  return (
    <DashboardLayout role="COMPANY">
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 h-full pb-8">
        
        {/* Left: Main Chart Area */}
        <div className="xl:col-span-3 space-y-6 flex flex-col">
          {/* Top Info Bar */}
          <div className="glass p-6 rounded-2xl border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-8">
              <div>
                <p className="text-[10px] text-text-secondary uppercase font-black tracking-widest">CRX / INR <span className="ml-2 text-primary">Live</span></p>
                <h2 className="text-3xl font-black text-gradient mt-1">₹2,890.00 <span className="text-sm font-bold text-primary/70">+4.2%</span></h2>
              </div>
              <div className="h-10 w-[1px] bg-white/10" />
              <div className="hidden md:block">
                <p className="text-[10px] text-text-secondary uppercase font-black tracking-widest">24h High</p>
                <p className="text-sm font-mono font-bold mt-1">₹2,910.00</p>
              </div>
              <div className="hidden md:block">
                <p className="text-[10px] text-text-secondary uppercase font-black tracking-widest">24h Low</p>
                <p className="text-sm font-mono font-bold mt-1 text-danger">₹2,720.00</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="glass p-1 rounded-xl flex gap-1">
                <button 
                    onClick={() => setView('chart')}
                    className={`p-2 rounded-lg transition-all ${view === 'chart' ? 'bg-primary/20 text-primary' : 'text-text-muted hover:text-white'}`}
                >
                    <Activity size={18} />
                </button>
                <button 
                    onClick={() => setView('map')}
                    className={`p-2 rounded-lg transition-all ${view === 'map' ? 'bg-primary/20 text-primary' : 'text-text-muted hover:text-white'}`}
                >
                    <Globe size={18} />
                </button>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20">
                <Zap size={14} className="text-primary animate-pulse" />
                <span className="text-[10px] font-black text-primary uppercase">Ultra-Tier</span>
              </div>
            </div>
          </div>

          {/* Main Visualizer Container — Optimized for 3D stability (Solid background to avoid backdrop-filter conflict) */}
          <div className="flex-1 bg-[#080A0D] rounded-3xl border border-white/5 p-8 min-h-[700px] relative flex flex-col isolate" style={{ transformStyle: 'preserve-3d' }}>
            <div className="absolute top-8 left-8 z-10">
                <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                    {view === 'chart' ? <Activity size={16} className="text-primary" /> : <Globe size={16} className="text-primary" />}
                    {view === 'chart' ? 'Price Performance Terminal' : 'Regional Inventory Hologram'}
                </h3>
            </div>

            <div className="flex-1 mt-12 relative">
                <AnimatePresence mode="wait">
                    {view === 'chart' ? (
                        <motion.div 
                            key="chart"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="w-full h-full"
                        >
                            <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={candlestickData} margin={{ top: 40, right: 0, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                                <XAxis dataKey="time" stroke="rgba(255,255,255,0.3)" fontSize={10} tickLine={false} axisLine={false} dy={10} />
                                <YAxis 
                                    domain={['dataMin - 50', 'dataMax + 50']} 
                                    stroke="rgba(255,255,255,0.3)" 
                                    fontSize={10} 
                                    tickLine={false} 
                                    axisLine={false} 
                                    tickFormatter={(val) => `₹${val}`} 
                                />
                                <Tooltip 
                                contentStyle={{ backgroundColor: '#080A0D', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
                                itemStyle={{ color: '#00C896', fontWeight: 'bold' }}
                                cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }}
                                />
                                <Bar 
                                    dataKey="close" 
                                    shape={<CandlestickShape />} 
                                >
                                {candlestickData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.close > entry.open ? '#00C896' : '#FF4F5E'} />
                                ))}
                                </Bar>
                            </ComposedChart>
                            </ResponsiveContainer>
                        </motion.div>
                    ) : (
                        <motion.div 
                            key="map"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.05 }}
                            className="w-full h-full"
                        >
                            <IndiaHeatmap 
                                data={heatmapData} 
                                onStateClick={(state) => navigate(`/company/marketplace?state=${state}`)} 
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
          </div>

          {/* Order History */}
          <div className="glass rounded-3xl border border-white/5 overflow-hidden">
            <div className="px-8 py-4 border-b border-white/5 bg-white/[0.02]">
              <h3 className="text-xs font-black uppercase tracking-widest text-text-secondary">Global Trade Stream</h3>
            </div>
            <div className="max-h-48 overflow-auto">
              <table className="w-full text-[10px] text-left">
                <tbody className="divide-y divide-white/5">
                  {[...Array(5)].map((_, i) => (
                    <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-8 py-4 font-mono text-text-muted">15:24:0{i}</td>
                      <td className="px-8 py-4 font-black text-primary">BUY EXPORT</td>
                      <td className="px-8 py-4 font-mono font-bold text-text-primary">₹2,890.00</td>
                      <td className="px-8 py-4 font-mono">15.00 CRX</td>
                      <td className="px-8 py-4 text-right">
                        <span className="text-info opacity-40 font-mono">0x7a...4f1e</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="space-y-6 flex flex-col">
          <div className="glass p-8 rounded-3xl border border-white/5 space-y-8">
            <div className="flex gap-4">
              <button className="flex-1 py-4 bg-primary text-background font-black rounded-xl shadow-glow-green text-xs tracking-widest uppercase">BUY</button>
              <button className="flex-1 py-4 bg-white/5 text-text-secondary font-black rounded-xl border border-white/10 hover:text-danger hover:border-danger/50 transition-all text-xs tracking-widest uppercase">SELL</button>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[9px] text-text-muted uppercase font-black tracking-widest">Order Specification</label>
                <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-xs font-bold focus:border-primary outline-none">
                  <option>Market Aggregator</option>
                  <option>Limit Precision</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] text-text-muted uppercase font-black tracking-widest">Quantity (CRX)</label>
                <div className="relative">
                  <input type="number" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-sm focus:border-primary outline-none font-mono font-bold" placeholder="0.00" />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] font-black text-primary">TONS</span>
                </div>
              </div>

              <div className="pt-8 border-t border-white/5 space-y-4">
                <div className="flex justify-between text-[10px]">
                  <span className="text-text-muted font-bold uppercase tracking-widest">Total Liability</span>
                  <span className="font-mono font-black">₹0.00</span>
                </div>
                <div className="flex justify-between text-[10px]">
                  <span className="text-text-muted font-bold uppercase tracking-widest">Gas (Sepolia)</span>
                  <span className="font-mono text-info font-bold">0.0002 ETH</span>
                </div>
                <button className="btn-primary w-full py-5 mt-4 flex items-center justify-center gap-3 shadow-glow-green">
                    <ShieldCheck size={18} />
                    Commit Trade
                </button>
              </div>
            </div>
          </div>

          <div className="glass p-8 rounded-3xl border border-white/5 flex-1 flex flex-col justify-between">
            <div>
                <h3 className="text-xs font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                    <Wallet size={16} className="text-primary" /> Connected Wallet
                </h3>
                <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                    <p className="text-[9px] text-text-muted uppercase font-black tracking-widest">Available Balance</p>
                    <h4 className="text-2xl font-black text-gradient mt-2">1.240 <span className="text-xs font-normal">CRX</span></h4>
                </div>
            </div>
            <div className="text-center">
                <p className="text-[9px] text-text-muted uppercase font-black tracking-widest opacity-30">Encrypted P2P Node</p>
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default TradingTerminal;

