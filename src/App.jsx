import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

// Global FX
import ParticleBackground from './components/ParticleBackground';
import CustomCursor from './components/CustomCursor';

// Auth Pages
import Login from './pages/Auth/Login';
import RoleSelection from './pages/Auth/RoleSelection';

// Dashboards
import NGODashboard from './pages/NGO/Dashboard';
import BusinessDashboard from './pages/Business/Dashboard';
import AdminDashboard from './pages/Admin/Dashboard';

function ProtectedRoute({ children, allowedRole }) {
  const { currentUser, userRole, loading } = useAuth();

  if (loading) return <div className="min-h-screen text-white flex items-center justify-center">Loading...</div>;
  if (!currentUser) return <Navigate to="/login" replace />;
  if (allowedRole && userRole !== allowedRole) return <Navigate to="/role-selection" replace />;

  return children;
}

function App() {
  return (
    <Router>
      <ParticleBackground />
      <CustomCursor />
      
      <div className="w-full h-screen flex items-center justify-center relative z-10 p-4 md:p-8">
        <Toaster position="top-right" toastOptions={{
          style: {
            background: 'rgba(15, 23, 42, 0.8)',
            backdropFilter: 'blur(10px)',
            color: '#fff',
            border: '1px solid rgba(51, 65, 85, 0.5)',
            borderRadius: '1rem'
          }
        }} />
        
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/role-selection" element={<ProtectedRoute><RoleSelection /></ProtectedRoute>} />
          
          <Route path="/ngo/dashboard/*" element={
            <ProtectedRoute allowedRole="ngo">
              <NGODashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/business/dashboard/*" element={
            <ProtectedRoute allowedRole="business">
              <BusinessDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/admin/dashboard/*" element={
            <ProtectedRoute allowedRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } />

          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
