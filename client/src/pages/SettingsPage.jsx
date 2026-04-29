import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { User, Shield, Bell, CreditCard, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('Profile');
  const role = localStorage.getItem('userRole') || 'NGO';

  const tabs = [
    { label: 'Profile', icon: User },
    { label: 'Security', icon: Shield },
    { label: 'Notifications', icon: Bell },
    { label: 'Billing', icon: CreditCard },
  ];

  const handleSave = () => {
    toast.success('Settings synchronized with database!');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Profile':
        return (
          <motion.div 
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] text-text-secondary uppercase font-black tracking-widest">Display Name</label>
                <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary outline-none transition-all" defaultValue="CarbonX Operator" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] text-text-secondary uppercase font-black tracking-widest">Email Address</label>
                <input type="email" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-text-muted cursor-not-allowed" defaultValue="operator@carbonx.com" disabled />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] text-text-secondary uppercase font-black tracking-widest">Wallet Address (On-Chain)</label>
              <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-mono focus:border-primary outline-none transition-all" placeholder="0x71C765...d89" />
            </div>
          </motion.div>
        );
      case 'Security':
        return (
          <motion.div 
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="p-6 rounded-xl bg-primary/5 border border-primary/20 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm">Two-Factor Authentication</h4>
                <p className="text-xs text-text-secondary mt-1">Add an extra layer of security to your terminal.</p>
              </div>
              <button className="btn-primary px-4 py-2 text-[10px]">Enable</button>
            </div>
            <div className="space-y-4">
              <h4 className="font-bold text-sm">Change Password</h4>
              <input type="password" placeholder="Current Password" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none" />
              <input type="password" placeholder="New Password" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none" />
            </div>
          </motion.div>
        );
      default:
        return (
          <div className="py-20 text-center">
            <p className="text-text-secondary text-sm">Modular content for {activeTab} coming in the next synchronization.</p>
          </div>
        );
    }
  };

  return (
    <DashboardLayout role={role}>
      <div className="max-w-5xl mx-auto space-y-10 py-6">
        <div>
          <h2 className="text-4xl font-black tracking-tighter text-text-primary">System <span className="text-gradient">Configuration</span></h2>
          <p className="text-text-secondary text-sm mt-1">Manage your terminal identity and security protocols.</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Tabs Sidebar */}
          <div className="space-y-2">
            {tabs.map((tab) => (
              <button 
                key={tab.label}
                onClick={() => setActiveTab(tab.label)}
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
                  activeTab === tab.label 
                    ? 'bg-primary/10 text-primary border border-primary/20 shadow-glow-green' 
                    : 'text-text-secondary hover:bg-white/5 border border-transparent'
                }`}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content Area */}
          <div className="lg:col-span-3 glass p-10 rounded-3xl border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              {tabs.find(t => t.label === activeTab)?.icon({ size: 120 })}
            </div>
            
            <AnimatePresence mode="wait">
              <div className="relative z-10 min-h-[300px]">
                {renderTabContent()}
              </div>
            </AnimatePresence>

            <div className="mt-12 pt-8 border-t border-white/5 flex justify-end">
              <motion.button 
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSave}
                className="btn-primary px-10 py-4 flex items-center gap-3 font-black uppercase tracking-widest text-xs shadow-glow-green"
              >
                <Save size={16} />
                Commit Changes
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
