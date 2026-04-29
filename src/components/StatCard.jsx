import React from 'react';

export default function StatCard({ title, value, subtitle, icon: Icon, color = 'cyan' }) {
  const colorMap = {
    cyan: 'from-accent-cyan to-accent-blue shadow-glow-cyan text-white',
    blue: 'from-blue-500 to-indigo-600 shadow-[0_0_15px_rgba(59,130,246,0.4)] text-white',
    red: 'from-rose-500 to-accent-red shadow-glow-red text-white',
    gray: 'from-slate-800 to-slate-900 border border-slate-700 text-white'
  };

  const isGradientBg = color !== 'gray';

  return (
    <div className={`p-6 rounded-3xl transition-transform duration-300 hover:-translate-y-2 relative overflow-hidden group ${isGradientBg ? 'bg-gradient-to-br ' + colorMap[color] : colorMap[color]}`}>
      
      {/* Background decoration for gradient cards */}
      {isGradientBg && (
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500 pointer-events-none"></div>
      )}

      <div className="flex items-start justify-between relative z-10">
        <div>
          <p className={`text-sm font-medium mb-2 ${isGradientBg ? 'text-white/80' : 'text-slate-400'}`}>{title}</p>
          <h3 className="text-3xl font-black tracking-tight mb-2">
            {value}
          </h3>
          {subtitle && (
            <p className={`text-xs font-medium ${isGradientBg ? 'text-white/90' : 'text-slate-500'} flex items-center gap-1`}>
              {subtitle}
            </p>
          )}
        </div>
        {Icon && (
          <div className={`p-3 rounded-2xl ${isGradientBg ? 'bg-white/20 backdrop-blur-md' : 'bg-slate-800 border border-slate-700'}`}>
            <Icon className={`w-6 h-6 ${isGradientBg ? 'text-white' : 'text-slate-300'}`} />
          </div>
        )}
      </div>
    </div>
  );
}
