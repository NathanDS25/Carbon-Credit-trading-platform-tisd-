import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { MapPin, Calendar, Award, ExternalLink, RefreshCw } from 'lucide-react';
import api from '../services/api';

const PlantationsList = () => {
  const [plantations, setPlantations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlantations();
  }, []);

  const fetchPlantations = async () => {
    try {
      const response = await api.get('/plantations/mine');
      setPlantations(response.data.data);
    } catch (error) {
      console.error("Failed to fetch plantations:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout role="NGO">
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-black">My Plantations</h2>
            <p className="text-text-secondary text-sm">Manage and track your carbon-sequestering assets</p>
          </div>
          <button 
            onClick={fetchPlantations}
            className="p-2 rounded-lg bg-surface border border-white/10 text-text-secondary hover:text-primary transition-all"
          >
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plantations.length === 0 ? (
            <div className="col-span-3 py-20 text-center glass rounded-2xl border border-white/5">
              <p className="text-text-secondary">No plantations found. Head back to the dashboard to register one!</p>
            </div>
          ) : plantations.map((p, i) => (
            <div key={i} className="glass rounded-2xl border border-white/5 overflow-hidden flex flex-col card-glow">
              <div className="h-48 bg-surface relative overflow-hidden">
                <img 
                  src={p.imageUrl || `https://api.dicebear.com/7.x/shapes/svg?seed=${p.id}`} 
                  alt={p.name} 
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute top-4 right-4 px-2 py-1 bg-background/80 backdrop-blur-md rounded text-[10px] font-black uppercase text-primary border border-primary/20 shadow-glow-green">
                  {p.status}
                </div>
              </div>
              
              <div className="p-6 space-y-4 flex-1 flex flex-col">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-bold truncate pr-2">{p.name}</h3>
                  <Award className={p.qualityGrade === 'A' ? 'text-primary' : 'text-info'} size={20} />
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="flex items-center gap-2 text-text-secondary">
                    <MapPin size={14} className="text-primary" />
                    <span>{p.lat.toFixed(2)}, {p.lng.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-text-secondary">
                    <Calendar size={14} className="text-info" />
                    <span>{new Date(p.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-white/5 border border-white/5 space-y-2">
                  <div className="flex justify-between text-[10px] font-black text-text-secondary uppercase">
                    <span>Current NDVI</span>
                    <span className="text-primary">{p.currentNDVI || '---'}</span>
                  </div>
                  <div className="w-full h-1 bg-background rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${(p.currentNDVI || 0) * 100}%` }} />
                  </div>
                </div>

                <div className="flex-1" />

                <div className="flex gap-2 mt-4">
                  <a 
                    href={p.imageUrl} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex-1 py-2 rounded-lg bg-surface border border-white/10 text-xs font-bold text-center hover:bg-white/5 transition-all flex items-center justify-center gap-2"
                  >
                    View Imagery <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PlantationsList;
