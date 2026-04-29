import React from 'react';
import Layout from '../../components/Layout';
import StatCard from '../../components/StatCard';
import { Users, Building, Database, Activity, CheckCircle, XCircle, Shield, MonitorPlay, ExternalLink } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const userManagement = [
  { id: 1, name: 'EcoTrust India', email: 'contact@ecotrust.in', role: 'NGO', wallet: '0x123...456', credits: 1200, status: 'Active' },
  { id: 2, name: 'TechNova Corp', email: 'admin@technova.com', role: 'Business', wallet: '0xabc...def', credits: 450, status: 'Active' },
  { id: 3, name: 'GreenRoots', email: 'hello@greenroots.org', role: 'NGO', wallet: '0x789...012', credits: 0, status: 'Suspended' },
];

const verificationQueue = [
  { id: 'VQ-101', ngo: 'Kerala Green Belt', location: '10.8505° N, 76.2711° E', area: '8.4', image: 'satellite_img_12.jpg', status: 'Pending' },
  { id: 'VQ-102', ngo: 'Western Ghats Sector B', location: '15.3173° N, 75.7139° E', area: '22.1', image: 'satellite_img_13.jpg', status: 'Pending' },
];

const blockchainFeed = [
  { hash: '0xabc123...', from: 'EcoTrust', to: 'TechNova', amount: 150, time: '2 mins ago' },
  { hash: '0xdef456...', from: '0x00...000 (Mint)', to: 'Kerala Green', amount: 400, time: '15 mins ago' },
  { hash: '0xghi789...', from: 'TechNova', to: '0x11...111', amount: 50, time: '1 hour ago' },
];

const activityData = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  transactions: Math.floor(Math.random() * 50) + 10
}));

export default function AdminDashboard() {
  return (
    <Layout>
      <div className="space-y-6 pb-20">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2"><Shield className="w-6 h-6 text-accent-red" /> Global Admin Overview</h1>
            <p className="text-gray-400 text-sm">System metrics, verification queue, and blockchain monitoring.</p>
          </div>
          <button className="bg-dark-surface border border-accent-red text-accent-red px-4 py-2 rounded-lg hover:bg-accent-red hover:text-white transition-all glow-red">
            Emergency Override
          </button>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Total Users" value="1,245" icon={Users} color="blue" />
          <StatCard title="Total Companies" value="312" icon={Building} color="blue" />
          <StatCard title="Credits Minted" value="45,800 CC" icon={Database} color="cyan" />
          <StatCard title="Traded Volume" value="₹ 4.2 Cr" icon={Activity} color="gray" />
        </div>

        {/* Middle Section: Activity & Queue */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Activity Bar Chart (Placeholder for Heatmap) */}
          <div className="lg:col-span-2 glass-panel p-6">
            <h3 className="text-lg font-bold text-white mb-4">Daily Platform Transactions (Last 30 Days)</h3>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activityData}>
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(19, 21, 26, 0.9)', borderColor: '#1E232B', borderRadius: '8px', color: '#fff' }}
                    cursor={{fill: 'rgba(255,255,255,0.05)'}}
                  />
                  <Bar dataKey="transactions" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Blockchain Monitor */}
          <div className="glass-panel p-6 flex flex-col">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><MonitorPlay className="w-5 h-5 text-accent-blue" /> Live On-Chain Feed</h3>
            <div className="flex-1 space-y-3 overflow-y-auto pr-2">
              {blockchainFeed.map((tx, idx) => (
                <div key={idx} className="bg-dark-bg border border-dark-border p-3 rounded-lg flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-accent-blue font-mono">{tx.hash}</span>
                    <span className="text-xs text-gray-500">{tx.time}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400">{tx.from}</span>
                      <span className="text-gray-600">→</span>
                      <span className="text-white">{tx.to}</span>
                    </div>
                    <span className="text-accent-green font-bold">{tx.amount} CC</span>
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-4 w-full py-2 bg-dark-bg text-gray-400 text-sm rounded-lg hover:text-white border border-dark-border transition-colors flex justify-center items-center gap-2">
              View on Etherscan <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Lower Section: Verification Queue & Users */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Verification Queue */}
          <div className="glass-panel overflow-hidden flex flex-col">
            <div className="p-6 border-b border-dark-border">
              <h3 className="text-lg font-bold text-white">Plantation Verification Queue</h3>
            </div>
            <div className="p-6 space-y-4 flex-1">
              {verificationQueue.map((item) => (
                <div key={item.id} className="bg-dark-bg border border-dark-border p-4 rounded-lg flex flex-col lg:flex-row justify-between gap-4">
                  <div>
                    <h4 className="text-white font-medium">{item.ngo}</h4>
                    <p className="text-xs text-gray-400 font-mono mt-1">Loc: {item.location} | Area: {item.area} sq km</p>
                    <div className="mt-2 text-xs text-accent-blue flex items-center gap-1">
                      <div className="w-2 h-2 bg-accent-blue rounded-full animate-pulse"></div>
                      Awaiting Satellite Analysis
                    </div>
                  </div>
                  <div className="flex gap-2 items-center">
                    <button className="p-2 bg-dark-surface border border-accent-green text-accent-green rounded hover:bg-accent-green hover:text-white transition-colors" title="Approve & Mint">
                      <CheckCircle className="w-5 h-5" />
                    </button>
                    <button className="p-2 bg-dark-surface border border-accent-red text-accent-red rounded hover:bg-accent-red hover:text-white transition-colors" title="Reject">
                      <XCircle className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* User Management */}
          <div className="glass-panel overflow-hidden">
            <div className="p-6 border-b border-dark-border">
              <h3 className="text-lg font-bold text-white">User Management</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-dark-bg/50 text-gray-400 text-sm">
                    <th className="p-4 font-medium border-b border-dark-border">User</th>
                    <th className="p-4 font-medium border-b border-dark-border">Role</th>
                    <th className="p-4 font-medium border-b border-dark-border text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {userManagement.map((u) => (
                    <tr key={u.id} className="border-b border-dark-border hover:bg-dark-bg/30">
                      <td className="p-4">
                        <div className="text-white font-medium">{u.name}</div>
                        <div className="text-xs text-gray-500">{u.email}</div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs border ${u.role === 'NGO' ? 'bg-accent-green/10 text-accent-green border-accent-green/30' : 'bg-accent-blue/10 text-accent-blue border-accent-blue/30'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <span className={`px-2 py-1 rounded text-xs ${u.status === 'Active' ? 'text-gray-300 bg-dark-surface' : 'text-accent-red bg-accent-red/10'}`}>
                          {u.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>
    </Layout>
  );
}
