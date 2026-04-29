import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Leaf, 
  UploadCloud, 
  Database, 
  ArrowRightLeft, 
  MessageSquare, 
  Calendar, 
  Settings,
  Map,
  ShoppingBag,
  PieChart,
  Users,
  Building,
  MonitorPlay,
  FileText
} from 'lucide-react';
import logo from '../assets/logo.png';

export default function Sidebar() {
  const { userRole, logout } = useAuth();

  const getNavLinks = () => {
    switch (userRole) {
      case 'ngo':
        return [
          { name: 'Dashboard', path: '/ngo/dashboard', icon: LayoutDashboard },
          { name: 'My Plantations', path: '/ngo/dashboard/plantations', icon: Leaf },
          { name: 'Upload New', path: '/ngo/dashboard/upload', icon: UploadCloud },
          { name: 'Carbon Credits', path: '/ngo/dashboard/credits', icon: Database },
          { name: 'Transactions', path: '/ngo/dashboard/transactions', icon: ArrowRightLeft },
          { name: 'Chat', path: '/ngo/dashboard/chat', icon: MessageSquare },
          { name: 'Schedule', path: '/ngo/dashboard/schedule', icon: Calendar },
        ];
      case 'business':
        return [
          { name: 'Dashboard', path: '/business/dashboard', icon: LayoutDashboard },
          { name: 'India Heatmap', path: '/business/dashboard/heatmap', icon: Map },
          { name: 'Marketplace', path: '/business/dashboard/marketplace', icon: ShoppingBag },
          { name: 'My Portfolio', path: '/business/dashboard/portfolio', icon: PieChart },
          { name: 'Trade', path: '/business/dashboard/trade', icon: ArrowRightLeft },
          { name: 'Chat', path: '/business/dashboard/chat', icon: MessageSquare },
          { name: 'Schedule', path: '/business/dashboard/schedule', icon: Calendar },
          { name: 'Analytics', path: '/business/dashboard/analytics', icon: PieChart },
        ];
      case 'admin':
        return [
          { name: 'Overview', path: '/admin/dashboard', icon: LayoutDashboard },
          { name: 'Users', path: '/admin/dashboard/users', icon: Users },
          { name: 'Companies', path: '/admin/dashboard/companies', icon: Building },
          { name: 'Plantations', path: '/admin/dashboard/plantations', icon: Leaf },
          { name: 'Satellite Queue', path: '/admin/dashboard/queue', icon: UploadCloud },
          { name: 'Blockchain Feed', path: '/admin/dashboard/blockchain', icon: MonitorPlay },
          { name: 'Credits', path: '/admin/dashboard/credits', icon: Database },
          { name: 'Reports', path: '/admin/dashboard/reports', icon: FileText },
        ];
      default:
        return [];
    }
  };

  const navLinks = getNavLinks();

  return (
    <div className="w-24 md:w-64 border-r border-dark-border flex flex-col bg-slate-900/40 backdrop-blur-md shrink-0">
      <div className="h-24 flex items-center justify-center md:justify-start md:px-8 border-b border-dark-border">
        <img src={logo} alt="CarbonX Logo" className="h-8 md:h-10 drop-shadow-md" />
      </div>

      <nav className="flex-1 py-8 flex flex-col gap-2 px-4 overflow-y-auto">
        {navLinks.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            end={link.path.endsWith('dashboard')}
            className={({ isActive }) =>
              `flex items-center space-x-4 px-4 py-3 rounded-2xl transition-all duration-300 group relative ${
                isActive 
                  ? 'bg-gradient-to-r from-accent-cyan to-accent-blue text-white shadow-glow-cyan' 
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <link.icon className={`w-6 h-6 shrink-0 transition-transform duration-300 group-hover:scale-110`} />
            <span className="hidden md:block font-medium whitespace-nowrap">{link.name}</span>
          </NavLink>
        ))}
      </nav>
      
      <div className="p-4 border-t border-dark-border mt-auto">
        <button 
          className="flex items-center space-x-4 px-4 py-3 w-full rounded-2xl text-slate-400 hover:bg-white/5 hover:text-white transition-all group"
        >
          <Settings className="w-6 h-6 shrink-0 group-hover:rotate-90 transition-transform duration-500" />
          <span className="hidden md:block font-medium">Settings</span>
        </button>
        <button 
          onClick={logout}
          className="flex items-center space-x-4 px-4 py-3 w-full rounded-2xl text-slate-400 hover:bg-accent-red/20 hover:text-accent-red transition-all mt-2 group"
        >
          <ArrowRightLeft className="w-6 h-6 shrink-0 group-hover:-translate-x-1 transition-transform" />
          <span className="hidden md:block font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}
