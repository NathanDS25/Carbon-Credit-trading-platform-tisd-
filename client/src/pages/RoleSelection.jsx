import React from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { TreePine, Building2, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RoleCard = ({ role, title, icon: Icon, description, onClick }) => (
  <motion.div
    whileHover={{ y: -5, scale: 1.02 }}
    onClick={() => onClick(role)}
    className="glass p-8 rounded-2xl border border-white/10 cursor-pointer card-glow flex flex-col items-center text-center group"
  >
    <div className="p-4 rounded-full bg-surface mb-6 group-hover:bg-primary/20 transition-all shadow-lg group-hover:shadow-glow-green">
      <Icon className="w-10 h-10 text-primary" />
    </div>
    <h3 className="text-xl font-bold mb-3">{title}</h3>
    <p className="text-text-secondary text-sm leading-relaxed">
      {description}
    </p>
  </motion.div>
);

const RoleSelection = () => {
  const { selectRole } = useAuth();
  const navigate = useNavigate();

  const handleRoleSelect = (role) => {
    selectRole(role);
    navigate(`/${role.toLowerCase()}`);
  };

  return (
    <div className="min-h-screen w-full bg-background flex flex-col items-center justify-center p-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-5xl font-black mb-4 tracking-tight">
          Select Your <span className="text-primary italic">Clearance</span>
        </h1>
        <p className="text-text-secondary text-lg">Choose your portal into the CarbonX Ecosystem</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
        <RoleCard 
          role="NGO"
          title="NGO / Plantation"
          icon={TreePine}
          description="Register plantations, track satellite growth metrics, and mint carbon credits for the marketplace."
          onClick={handleRoleSelect}
        />
        <RoleCard 
          role="COMPANY"
          title="Business / Company"
          icon={Building2}
          description="Purchase carbon credits to offset your footprint, trade with peers, and view regional impact heatmaps."
          onClick={handleRoleSelect}
        />
        <RoleCard 
          role="ADMIN"
          title="System Administrator"
          icon={ShieldCheck}
          description="Oversee the entire network, verify satellite analysis jobs, and manage global marketplace stability."
          onClick={handleRoleSelect}
        />
      </div>
    </div>
  );
};

export default RoleSelection;
