import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';

export default function Login() {
  const { mockLogin } = useAuth();
  const navigate = useNavigate();

  const handleDemoLogin = async (role) => {
    await mockLogin(`demo-${role}@carbonx.com`, role);
    navigate(`/${role}/dashboard`);
  };

  return (
    <div className="w-full flex justify-center items-center">
      <div className="glass-panel p-8 w-full max-w-md text-center">
        <img src={logo} alt="CarbonX Logo" className="h-12 mx-auto mb-4 drop-shadow-md" />
        <p className="text-gray-400 mb-8">Professional Carbon Trading Terminal</p>
        
        <div className="space-y-4">
          <button 
            onClick={() => handleDemoLogin('ngo')}
            className="w-full py-3 px-4 bg-dark-surface border border-accent-green text-accent-green rounded-lg hover:bg-accent-green hover:text-white transition-all glow-green"
          >
            Demo Login as NGO
          </button>
          
          <button 
            onClick={() => handleDemoLogin('business')}
            className="w-full py-3 px-4 bg-dark-surface border border-accent-blue text-accent-blue rounded-lg hover:bg-accent-blue hover:text-white transition-all glow-blue"
          >
            Demo Login as Business
          </button>

          <button 
            onClick={() => handleDemoLogin('admin')}
            className="w-full py-3 px-4 bg-dark-surface border border-accent-red text-accent-red rounded-lg hover:bg-accent-red hover:text-white transition-all glow-red"
          >
            Demo Login as Admin
          </button>
        </div>
      </div>
    </div>
  );
}
