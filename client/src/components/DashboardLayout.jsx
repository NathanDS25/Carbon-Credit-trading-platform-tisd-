import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  MessageSquare, 
  Calendar, 
  PlusCircle, 
  Menu, 
  X, 
  LogOut, 
  Settings, 
  Shield, 
  Globe, 
  Database, 
  Zap, 
  Activity,
  Cpu
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const SidebarItem = ({ to, icon: Icon, label, collapsed, active }) => (
  <Link to={to}>
    <motion.div 
      whileHover={{ x: 6, backgroundColor: 'rgba(0, 200, 150, 0.08)' }}
      className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden ${
        active 
          ? 'bg-primary/10 text-primary border border-primary/20 shadow-[0_0_20px_rgba(0,200,150,0.1)]' 
          : 'text-text-secondary hover:text-white'
      }`}
    >
      {active && <motion.div layoutId="active-pill" className="absolute left-0 w-1 h-6 bg-primary rounded-r-full shadow-glow-green" />}
      <Icon size={20} className={active ? 'text-primary' : 'group-hover:text-primary transition-colors'} />
      {!collapsed && (
        <span className="font-bold text-[11px] uppercase tracking-[0.15em] whitespace-nowrap">
          {label}
        </span>
      )}
      {!collapsed && active && (
        <div className="absolute right-4 w-1.5 h-1.5 rounded-full bg-primary shadow-glow-green animate-pulse" />
      )}
    </motion.div>
  </Link>
);

const DashboardLayout = ({ children, role }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { logout, user } = useAuth();
  const location = useLocation();

  const menuItems = {
    NGO: [
      { to: '/ngo/dashboard', icon: LayoutDashboard, label: 'Overview' },
      { to: '/ngo/plantations', icon: PlusCircle, label: 'Plantations' },
      { to: '/ngo/marketplace', icon: Globe, label: 'Marketplace' },
      { to: '/ngo/chat', icon: MessageSquare, label: 'Messages' },
      { to: '/ngo/meetings', icon: Calendar, label: 'Meetings' },
    ],
    COMPANY: [
      { to: '/company/dashboard', icon: Cpu, label: 'Terminal' },
      { to: '/company/heatmap', icon: Activity, label: 'Intelligence' },
      { to: '/company/marketplace', icon: Globe, label: 'Registry' },
      { to: '/company/chat', icon: MessageSquare, label: 'Network' },
      { to: '/company/meetings', icon: Calendar, label: 'Verification' },
    ],
    ADMIN: [
      { to: '/admin/dashboard', icon: Shield, label: 'Control' },
      { to: '/admin/plantations', icon: Zap, label: 'Verification' },
      { to: '/admin/users', icon: Database, label: 'Accounts' },
      { to: '/admin/blockchain', icon: Zap, label: 'Nodes' },
    ]
  };

  return (
    <div className="app-root flex min-h-screen font-sans selection:bg-primary/30 relative">
      <div className="scanline pointer-events-none opacity-[0.03] z-0" />
      
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: collapsed ? '80px' : '260px' }}
        className="glass border-r border-white/5 flex flex-col z-50 relative m-4 mr-0 rounded-3xl"
      >
        <div className="p-6 flex items-center justify-between border-b border-white/5">
          {!collapsed && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-info flex items-center justify-center shadow-glow-green">
                <span className="font-black text-background text-lg italic">X</span>
              </div>
              <h1 className="text-xl font-black tracking-tighter text-white">
                CARBON<span className="text-primary">X</span>
              </h1>
            </motion.div>
          )}
          <button 
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-lg hover:bg-white/5 text-text-secondary transition-colors ml-auto"
          >
            {collapsed ? <Menu size={20} /> : <X size={20} />}
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar mt-4">
          <p className={`text-[9px] font-black uppercase tracking-[0.3em] text-text-muted mb-4 px-4 ${collapsed ? 'text-center' : ''}`}>
            {collapsed ? '—' : `${role} Interface`}
          </p>
          {menuItems[role]?.map((item, i) => (
            <SidebarItem 
              key={i} 
              {...item} 
              collapsed={collapsed} 
              active={location.pathname === item.to}
            />
          ))}
        </nav>

        <div className="p-4 border-t border-white/5 space-y-2">
          <SidebarItem to="/settings" icon={Settings} label="Settings" collapsed={collapsed} active={location.pathname === '/settings'} />
          <motion.button 
            whileHover={{ x: 6, backgroundColor: 'rgba(255, 79, 94, 0.08)' }}
            onClick={async () => {
              await logout();
              window.location.href = '/login';
            }}
            className="flex items-center gap-4 px-4 py-3 rounded-xl text-danger w-full transition-all group"
          >
            <LogOut size={20} className="group-hover:text-danger" />
            {!collapsed && <span className="font-bold text-[11px] uppercase tracking-[0.15em]">Disconnect</span>}
          </motion.button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 relative flex flex-col p-8 z-10">
        {/* Top Sync Bar */}
        <div className="flex justify-end gap-4 mb-6 sticky top-0 z-[100] py-2">
          <div className="glass px-4 py-2 rounded-xl border border-white/5 flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-glow-green animate-pulse" />
            <span className="text-[9px] font-black text-primary uppercase tracking-[0.2em]">PostgreSQL Sync Active</span>
          </div>
          <div className="glass px-4 py-2 rounded-xl border border-white/5 flex items-center gap-3">
            <Database size={12} className="text-info" />
            <span className="text-[9px] font-black text-text-secondary uppercase tracking-[0.2em]">Prisma Engine: v5.8.1</span>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default DashboardLayout;
