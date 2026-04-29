import React from 'react';
import Layout from '../../components/Layout';
import StatCard from '../../components/StatCard';
import { Database, TrendingUp, IndianRupee, CheckCircle, Clock, XCircle, Upload, Leaf } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const priceData = [
  { name: 'Jan', price: 120 },
  { name: 'Feb', price: 132 },
  { name: 'Mar', price: 101 },
  { name: 'Apr', price: 145 },
  { name: 'May', price: 160 },
  { name: 'Jun', price: 155 },
  { name: 'Jul', price: 180 },
];

const plantations = [
  { id: 1, name: 'Amazon Reforest Alpha', location: '12.9716° N, 77.5946° E', area: '15.2', date: '2023-10-12', status: 'Verified', credits: 450 },
  { id: 2, name: 'Kerala Green Belt', location: '10.8505° N, 76.2711° E', area: '8.4', date: '2023-11-05', status: 'Pending', credits: 0 },
  { id: 3, name: 'Western Ghats Sector B', location: '15.3173° N, 75.7139° E', area: '22.1', date: '2023-09-20', status: 'Rejected', credits: 0 },
];

const transactions = [
  { hash: '0xabc1...f89a', type: 'Sell', amount: 100, date: '2 hours ago', price: '₹14,500' },
  { hash: '0xdef2...b12c', type: 'Mint', amount: 450, date: '1 day ago', price: '-' },
  { hash: '0xghi3...e34d', type: 'Sell', amount: 50, date: '3 days ago', price: '₹6,800' },
];

export default function NGODashboard() {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Verified':
        return <span className="px-2 py-1 bg-accent-green/20 text-accent-green border border-accent-green/30 rounded text-xs flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Verified</span>;
      case 'Pending':
        return <span className="px-2 py-1 bg-accent-blue/20 text-accent-blue border border-accent-blue/30 rounded text-xs flex items-center gap-1"><Clock className="w-3 h-3" /> Pending</span>;
      case 'Rejected':
        return <span className="px-2 py-1 bg-accent-red/20 text-accent-red border border-accent-red/30 rounded text-xs flex items-center gap-1"><XCircle className="w-3 h-3" /> Rejected</span>;
      default:
        return null;
    }
  };

  return (
    <Layout>
      <div className="space-y-6 pb-20">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">NGO Portfolio Overview</h1>
            <p className="text-gray-400 text-sm">Monitor your carbon credits, plantations, and market prices.</p>
          </div>
          <button className="bg-gradient-to-r from-accent-green to-teal-500 hover:from-teal-500 hover:to-accent-green text-white px-6 py-2 rounded-lg font-medium shadow-[0_0_15px_rgba(0,200,150,0.4)] transition-all flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Upload New Plantation
          </button>
        </div>

        {/* Portfolio Strip */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Total Credits Earned" value="1,240 CC" icon={Database} color="blue" subtitle="Lifetime generated" />
          <StatCard title="Credits Available" value="840 CC" icon={Leaf} color="cyan" subtitle="Ready to trade" />
          <StatCard title="Credits Sold" value="400 CC" icon={TrendingUp} color="gray" subtitle="All time sold" />
          <StatCard title="Revenue (INR)" value="₹ 58,200" icon={IndianRupee} color="cyan" subtitle="Total earnings" />
        </div>

        {/* Middle Section: Chart & Transactions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Chart */}
          <div className="lg:col-span-2 glass-panel p-6">
            <h3 className="text-lg font-bold text-white mb-4">Carbon Credit Price History (INR)</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={priceData}>
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00C896" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#00C896" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="name" stroke="#4B5563" tick={{fill: '#9CA3AF'}} axisLine={false} />
                  <YAxis stroke="#4B5563" tick={{fill: '#9CA3AF'}} axisLine={false} tickFormatter={(value) => `₹${value}`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(19, 21, 26, 0.9)', borderColor: '#1E232B', borderRadius: '8px', color: '#fff' }}
                    itemStyle={{ color: '#00C896' }}
                  />
                  <Area type="monotone" dataKey="price" stroke="#00C896" strokeWidth={3} fillOpacity={1} fill="url(#colorPrice)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Transactions */}
          <div className="glass-panel p-6 overflow-hidden flex flex-col">
            <h3 className="text-lg font-bold text-white mb-4">Recent Transactions</h3>
            <div className="flex-1 overflow-y-auto pr-2 space-y-4">
              {transactions.map((tx, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-dark-bg border border-dark-border rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-white flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${tx.type === 'Sell' ? 'bg-accent-blue' : 'bg-accent-green'}`}></span>
                      {tx.type} {tx.amount} CC
                    </p>
                    <p className="text-xs text-accent-green font-mono mt-1">{tx.hash}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-300">{tx.price}</p>
                    <p className="text-xs text-gray-500">{tx.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* My Plantations Table */}
        <div className="glass-panel overflow-hidden">
          <div className="p-6 border-b border-dark-border">
            <h3 className="text-lg font-bold text-white">My Plantations</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-dark-bg/50 text-gray-400 text-sm">
                  <th className="p-4 font-medium border-b border-dark-border">Plantation Name</th>
                  <th className="p-4 font-medium border-b border-dark-border">GPS Location</th>
                  <th className="p-4 font-medium border-b border-dark-border">Area (sq km)</th>
                  <th className="p-4 font-medium border-b border-dark-border">Upload Date</th>
                  <th className="p-4 font-medium border-b border-dark-border">Status</th>
                  <th className="p-4 font-medium border-b border-dark-border text-right">Credits Awarded</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {plantations.map((p) => (
                  <tr key={p.id} className="border-b border-dark-border hover:bg-dark-bg/30 transition-colors">
                    <td className="p-4 font-medium text-white">{p.name}</td>
                    <td className="p-4 text-gray-400 font-mono text-xs">{p.location}</td>
                    <td className="p-4 text-gray-300">{p.area}</td>
                    <td className="p-4 text-gray-400">{p.date}</td>
                    <td className="p-4">{getStatusBadge(p.status)}</td>
                    <td className="p-4 text-right font-bold text-accent-green">{p.credits > 0 ? `+${p.credits}` : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </Layout>
  );
}
