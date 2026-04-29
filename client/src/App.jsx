import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import RoleSelection from './pages/RoleSelection';
import NGODashboard from './pages/NGODashboard';
import CompanyDashboard from './pages/CompanyDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Marketplace from './pages/Marketplace';
import TradingTerminal from './pages/TradingTerminal';
import PlantationsList from './pages/PlantationsList';
import ChatTerminal from './pages/ChatTerminal';
import MeetingsTerminal from './pages/MeetingsTerminal';
import TradePage from './pages/TradePage';
import SettingsPage from './pages/SettingsPage';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, role, loading } = useAuth();
  
  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!user) return <Navigate to="/login" />;
  
  if (allowedRoles && (!role || !allowedRoles.includes(role.toUpperCase()))) {
    console.warn(`Access denied: Role '${role}' not in ${allowedRoles}`);
    return <Navigate to="/role-selection" />;
  }
  
  return children;
};

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/role-selection" element={<ProtectedRoute><RoleSelection /></ProtectedRoute>} />
      
      {/* NGO Routes */}
      <Route path="/ngo" element={<ProtectedRoute allowedRoles={['NGO']}><Navigate to="/ngo/dashboard" /></ProtectedRoute>} />
      <Route path="/ngo/dashboard" element={<ProtectedRoute allowedRoles={['NGO']}><NGODashboard /></ProtectedRoute>} />
      <Route path="/ngo/plantations" element={<ProtectedRoute allowedRoles={['NGO']}><PlantationsList /></ProtectedRoute>} />
      <Route path="/ngo/marketplace" element={<ProtectedRoute allowedRoles={['NGO']}><Marketplace /></ProtectedRoute>} />
      <Route path="/ngo/chat" element={<ProtectedRoute allowedRoles={['NGO']}><ChatTerminal /></ProtectedRoute>} />
      <Route path="/ngo/meetings" element={<ProtectedRoute allowedRoles={['NGO']}><MeetingsTerminal /></ProtectedRoute>} />

      {/* Company Routes */}
      <Route path="/company" element={<ProtectedRoute allowedRoles={['COMPANY']}><Navigate to="/company/dashboard" /></ProtectedRoute>} />
      <Route path="/company/dashboard" element={<ProtectedRoute allowedRoles={['COMPANY']}><TradingTerminal /></ProtectedRoute>} />
      <Route path="/company/heatmap" element={<ProtectedRoute allowedRoles={['COMPANY']}><CompanyDashboard /></ProtectedRoute>} />
      <Route path="/company/marketplace" element={<ProtectedRoute allowedRoles={['COMPANY']}><Marketplace /></ProtectedRoute>} />
      <Route path="/company/trade" element={<ProtectedRoute allowedRoles={['COMPANY']}><TradePage /></ProtectedRoute>} />
      <Route path="/company/chat" element={<ProtectedRoute allowedRoles={['COMPANY']}><ChatTerminal /></ProtectedRoute>} />
      <Route path="/company/meetings" element={<ProtectedRoute allowedRoles={['COMPANY']}><MeetingsTerminal /></ProtectedRoute>} />

      {/* Admin Routes */}
      <Route path="/admin" element={<ProtectedRoute allowedRoles={['ADMIN']}><Navigate to="/admin/dashboard" /></ProtectedRoute>} />
      <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/plantations" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/blockchain" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/audit" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/chat" element={<ProtectedRoute allowedRoles={['ADMIN']}><ChatTerminal /></ProtectedRoute>} />
      <Route path="/admin/meetings" element={<ProtectedRoute allowedRoles={['ADMIN']}><MeetingsTerminal /></ProtectedRoute>} />

      {/* Common Routes */}
      <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
      
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="*" element={<div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <h1 className="text-9xl font-black text-white/5 absolute">404</h1>
        <h2 className="text-2xl font-bold">Terminal Link Broken</h2>
        <p className="text-text-secondary mt-2">The coordinate you requested does not exist.</p>
        <button onClick={() => window.location.href = '/login'} className="btn-primary mt-6 px-8 py-2">Re-initialize</button>
      </div>} />
    </Routes>
  );
};

export default App;
