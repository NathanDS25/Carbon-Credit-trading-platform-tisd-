import React from 'react';
import { motion } from 'framer-motion';
import { Globe, Zap, Target, Activity } from 'lucide-react';

const SatelliteIntelligence = ({ plantation }) => {
  if (!plantation || !plantation.satelliteJobs || plantation.satelliteJobs.length === 0) {
    return (
      <div className="glass p-8 rounded-xl border border-white/5 flex flex-col items-center justify-center text-center space-y-4">
        <div className="p-4 rounded-full bg-white/5 text-text-muted">
          <Globe size={48} />
        </div>
        <div>
          <h3 className="text-lg font-bold">No Satellite Data Yet</h3>
          <p className="text-sm text-text-secondary">Register a plantation to begin orbital analysis.</p>
        </div>
      </div>
    );
  }

  const latestJob = plantation.satelliteJobs[0];
  const ndviValue = latestJob.ndviResult || 0;

  return (
    <div className="space-y-6">
      <div className="glass rounded-2xl border border-white/5 overflow-hidden">
        <div className="p-6 border-b border-white/5 bg-white/[0.01] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/20 text-primary">
              <Globe size={18} />
            </div>
            <div>
              <h2 className="text-sm font-black uppercase tracking-widest">Orbital Verification Detail</h2>
              <p className="text-[10px] text-text-secondary uppercase tracking-wider mt-0.5">Plantation ID: {plantation.id.substring(0, 8)}...</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-[9px] font-black text-primary uppercase">Live Sync</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {/* Satellite Image View */}
          <div className="p-6 border-r border-white/5 relative group">
            <div className="absolute top-10 left-10 z-10 flex flex-col gap-2">
                <span className="px-2 py-1 bg-black/60 backdrop-blur-md rounded text-[9px] font-black uppercase tracking-tighter border border-white/10">Top View // 0.3m Res</span>
            </div>
            <div className="aspect-square rounded-xl overflow-hidden border border-white/10 relative">
               <img 
                 src={plantation.satelliteImageUrl || latestJob.satelliteImage || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2000'} 
                 alt="Satellite View" 
                 className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700"
                 onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2000";
                 }}
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
               
               {/* Reticle Overlay */}
               <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
                  <div className="w-1/2 h-1/2 border border-primary/40 rounded-full" />
                  <div className="absolute w-px h-full bg-primary/20" />
                  <div className="absolute w-full h-px bg-primary/20" />
               </div>
            </div>
          </div>

          {/* Analysis Metrics */}
          <div className="p-8 flex flex-col justify-between bg-primary/[0.02]">
            <div className="space-y-8">
              <div className="flex items-start justify-between">
                <div>
                    <h3 className="text-xs font-black text-text-secondary uppercase tracking-widest mb-1">Vegetation Index (NDVI)</h3>
                    <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-black text-primary tracking-tighter">{(ndviValue * 100).toFixed(1)}%</span>
                        <span className="text-xs font-bold text-primary/60 uppercase">Density</span>
                    </div>
                </div>
                <div className="p-3 rounded-xl bg-primary/10 text-primary border border-primary/20">
                    <Activity size={24} />
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { label: 'Carbon Sequestration', value: `${(ndviValue * 450).toFixed(0)} Tons/Yr`, icon: Zap },
                  { label: 'Canopy Clump Score', value: latestJob.confidenceScore ? (latestJob.confidenceScore * 10).toFixed(1) : '8.4', icon: Target },
                  { label: 'AI Confidence', value: '98.4%', icon: Activity }
                ].map((stat, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5">
                    <div className="flex items-center gap-3">
                      <stat.icon size={16} className="text-info" />
                      <span className="text-[10px] font-black uppercase text-text-secondary">{stat.label}</span>
                    </div>
                    <span className="text-xs font-bold font-mono">{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10">
               <div className="flex items-center justify-between mb-2">
                  <span className="text-[9px] font-black uppercase text-text-muted tracking-widest">Health Threshold</span>
                  <span className="text-[9px] font-black uppercase text-primary tracking-widest">Optimal</span>
               </div>
               <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${ndviValue * 100}%` }}
                    className="h-full bg-gradient-to-r from-info to-primary"
                  />
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SatelliteIntelligence;
