import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Leaf, Building, Shield } from 'lucide-react';
import logo from '../../assets/logo.png';

export default function RoleSelection() {
  const { setRole } = useAuth();
  const navigate = useNavigate();

  const handleSelectRole = async (role) => {
    await setRole(role);
    navigate(`/${role}/dashboard`);
  };

  return (
    <div className="w-full flex justify-center items-center p-6">
      <div className="w-full max-w-5xl">
        <div className="text-center mb-12">
          <img src={logo} alt="CarbonX Logo" className="h-16 mx-auto mb-6 drop-shadow-md" />
          <h1 className="text-3xl font-bold text-white mb-4">Welcome</h1>
          <p className="text-gray-400 text-lg">Select your account type to proceed</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* NGO / Plantation Card */}
          <div 
            onClick={() => handleSelectRole('ngo')}
            className="glass-panel p-8 cursor-pointer group hover:-translate-y-2 transition-all duration-300 border-2 border-transparent hover:border-accent-green hover:glow-green"
          >
            <div className="w-16 h-16 bg-accent-green/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Leaf className="w-8 h-8 text-accent-green" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">NGO / Plantation</h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Register your land, upload satellite images for verification, and mint carbon credits to sell on the marketplace.
            </p>
            <div className="flex items-center text-accent-green text-sm font-medium">
              Join as NGO <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </div>

          {/* Business / Company Card */}
          <div 
            onClick={() => handleSelectRole('business')}
            className="glass-panel p-8 cursor-pointer group hover:-translate-y-2 transition-all duration-300 border-2 border-transparent hover:border-accent-blue hover:glow-blue"
          >
            <div className="w-16 h-16 bg-accent-blue/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Building className="w-8 h-8 text-accent-blue" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Business</h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Purchase high-quality carbon credits to offset your corporate footprint, trade P2P, and monitor your green portfolio.
            </p>
            <div className="flex items-center text-accent-blue text-sm font-medium">
              Join as Business <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </div>

          {/* Admin Card (Usually hidden, but here for demo) */}
          <div 
            onClick={() => handleSelectRole('admin')}
            className="glass-panel p-8 cursor-pointer group hover:-translate-y-2 transition-all duration-300 border-2 border-transparent hover:border-accent-red hover:glow-red"
          >
            <div className="w-16 h-16 bg-accent-red/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Shield className="w-8 h-8 text-accent-red" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">System Admin</h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Monitor blockchain activity, verify satellite imagery, manage users, and ensure platform integrity.
            </p>
            <div className="flex items-center text-accent-red text-sm font-medium">
              Access Admin <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
