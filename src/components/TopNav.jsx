import React from 'react';
import { Bell, User, Wallet, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function TopNav() {
  const { currentUser, userRole } = useAuth();
  
  const truncateAddress = (address) => `${address.slice(0, 6)}...${address.slice(-4)}`;
  const dummyWallet = '0x1234567890abcdef1234567890abcdef12345678';

  return (
    <header className="h-24 px-8 flex items-center justify-between border-b border-dark-border bg-slate-900/40 backdrop-blur-md shrink-0">
      
      {/* Search Bar - like in inspiration image */}
      <div className="flex-1 max-w-xl hidden lg:block">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-accent-cyan transition-colors" />
          <input 
            type="text" 
            placeholder="Search projects, transactions, NGOs..." 
            className="w-full bg-slate-800/50 border border-dark-border rounded-full py-3 pl-12 pr-4 text-white placeholder-slate-400 focus:outline-none focus:border-accent-cyan focus:ring-1 focus:ring-accent-cyan transition-all"
          />
        </div>
      </div>

      <div className="flex-1 lg:hidden">
        {/* Mobile Spacer */}
      </div>

      <div className="flex items-center space-x-6">
        <div className="hidden sm:flex items-center space-x-2 bg-slate-800/50 border border-dark-border px-4 py-2 rounded-full hover:border-accent-cyan hover:shadow-glow-cyan transition-all cursor-pointer">
          <Wallet className="w-4 h-4 text-accent-cyan" />
          <span className="text-sm font-mono text-slate-300">{truncateAddress(dummyWallet)}</span>
        </div>

        <button className="relative p-2 text-slate-400 hover:text-white hover:scale-110 transition-all cursor-pointer bg-slate-800/50 rounded-full border border-dark-border">
          <Bell className="w-5 h-5" />
          <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-accent-red rounded-full border-2 border-slate-900 shadow-glow-red"></span>
        </button>

        <div className="flex items-center space-x-4 pl-6 border-l border-dark-border cursor-pointer group">
          <div className="text-right hidden md:block">
            <p className="text-sm font-bold text-white group-hover:text-accent-cyan transition-colors">{currentUser?.displayName || 'User'}</p>
            <p className="text-xs text-slate-400 uppercase tracking-widest">{userRole}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center border border-slate-600 shadow-lg group-hover:border-accent-cyan transition-all">
            <User className="w-6 h-6 text-slate-300 group-hover:text-white" />
          </div>
        </div>
      </div>
    </header>
  );
}
