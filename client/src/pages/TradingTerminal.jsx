import React from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { TrendingUp, ArrowDownRight, ArrowUpRight, Activity } from 'lucide-react';

const data = [
  { time: '09:00', price: 2750 },
  { time: '10:00', price: 2780 },
  { time: '11:00', price: 2765 },
  { time: '12:00', price: 2810 },
  { time: '13:00', price: 2850 },
  { time: '14:00', price: 2830 },
  { time: '15:00', price: 2890 },
];

const TradingTerminal = () => {
  return (
    <DashboardLayout role="COMPANY">
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 h-[calc(100vh-160px)]">
        
        {/* Left: Main Chart Area */}
        <div className="xl:col-span-3 space-y-6 flex flex-col">
          {/* Top Info Bar */}
          <div className="glass p-4 rounded-xl border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-8">
              <div>
                <p className="text-[10px] text-text-secondary uppercase font-bold tracking-widest">CRX / INR</p>
                <h2 className="text-2xl font-black text-primary">₹2,890.00 <span className="text-sm font-normal text-primary/70">+4.2%</span></h2>
              </div>
              <div className="h-10 w-[1px] bg-white/5" />
              <div>
                <p className="text-[10px] text-text-secondary uppercase font-bold tracking-widest">24h High</p>
                <p className="text-sm font-mono">₹2,910.00</p>
              </div>
              <div>
                <p className="text-[10px] text-text-secondary uppercase font-bold tracking-widest">24h Low</p>
                <p className="text-sm font-mono">₹2,720.00</p>
              </div>
              <div>
                <p className="text-[10px] text-text-secondary uppercase font-bold tracking-widest">24h Volume</p>
                <p className="text-sm font-mono text-info">12.5k Tons</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-[10px] font-bold text-primary bg-primary/10 px-2 py-1 rounded">LIVE</span>
              <Activity className="text-primary animate-pulse" size={16} />
            </div>
          </div>

          {/* Price Chart */}
          <div className="flex-1 glass rounded-xl border border-white/5 p-6 min-h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00C896" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00C896" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="time" stroke="#9BA3AF" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis domain={['dataMin - 100', 'dataMax + 100']} stroke="#9BA3AF" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#13151A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  itemStyle={{ color: '#00C896' }}
                />
                <Area type="monotone" dataKey="price" stroke="#00C896" strokeWidth={3} fillOpacity={1} fill="url(#colorPrice)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Recent History Table */}
          <div className="glass rounded-xl border border-white/5 overflow-hidden h-64">
            <div className="px-6 py-3 border-b border-white/5 flex justify-between items-center bg-surface">
              <h3 className="text-sm font-bold uppercase tracking-widest">Recent Trades</h3>
              <TrendingUp size={14} className="text-text-secondary" />
            </div>
            <table className="w-full text-xs text-left">
              <tbody className="divide-y divide-white/5">
                {[1,2,3,4,5].map((_, i) => (
                  <tr key={i} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-3 font-mono text-text-secondary">15:24:0{i}</td>
                    <td className="px-6 py-3 font-bold text-primary">BUY</td>
                    <td className="px-6 py-3 font-mono">2,890.00</td>
                    <td className="px-6 py-3 font-mono">15.00 Tons</td>
                    <td className="px-6 py-3 text-right">
                      <span className="text-info opacity-50">0x7a...4f1e</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Execution Panel */}
        <div className="space-y-6 flex flex-col">
          <div className="glass p-6 rounded-xl border border-white/5 flex-1">
            <div className="flex gap-4 mb-6">
              <button className="flex-1 py-2 bg-primary text-background font-black rounded-lg shadow-glow-green">BUY</button>
              <button className="flex-1 py-2 bg-white/5 text-text-secondary font-black rounded-lg border border-white/10 hover:text-danger hover:border-danger/50 transition-all">SELL</button>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] text-text-secondary uppercase font-bold">Order Type</label>
                <select className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm focus:border-primary outline-none">
                  <option>Market Order</option>
                  <option>Limit Order</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] text-text-secondary uppercase font-bold">Amount (Tons)</label>
                <div className="relative">
                  <input type="number" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm focus:border-primary outline-none font-mono" placeholder="0.00" />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-text-secondary uppercase">CRX</span>
                </div>
              </div>

              <div className="pt-6 border-t border-white/5 space-y-3">
                <div className="flex justify-between text-xs">
                  <span className="text-text-secondary">Estimated Total:</span>
                  <span className="font-mono">₹0.00</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-text-secondary">Network Fee:</span>
                  <span className="font-mono text-info">0.0002 ETH</span>
                </div>
                <button className="btn-primary w-full py-4 mt-2">Execute Transaction</button>
              </div>
            </div>
          </div>

          <div className="glass p-6 rounded-xl border border-white/5">
            <h3 className="text-sm font-bold uppercase tracking-widest mb-4">MetaMask Wallet</h3>
            <div className="p-4 rounded-lg bg-surface border border-white/5">
              <p className="text-[10px] text-text-secondary uppercase font-bold">Balance</p>
              <h4 className="text-xl font-mono text-primary mt-1">1.240 CRX</h4>
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default TradingTerminal;
