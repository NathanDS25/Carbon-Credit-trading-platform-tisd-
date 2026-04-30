// UI Enhanced v4 — Premium Holographic 3D Map + Particle Grid + Data Beams
import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { motion, AnimatePresence } from 'framer-motion';

// Reliable GeoJSON source
const INDIA_GEOJSON_URL = 'https://raw.githubusercontent.com/geohacker/india/master/state/india_state.geojson';

const IndiaHeatmap = ({ data, onStateClick }) => {
  const svgRef = useRef();
  const [tooltip, setTooltip] = useState({ show: false, x: 0, y: 0, content: null });
  const [is3D, setIs3D] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hoveredState, setHoveredState] = useState(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const width = 600;
    const height = 700;

    const svg = d3.select(svgRef.current)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet');

    svg.selectAll('*').remove();

    // --- Definitions (Glows, Patterns, Gradients) ---
    const defs = svg.append('defs');

    // Multi-layer Holographic Glow
    const glowFilter = defs.append('filter')
      .attr('id', 'hologram-glow')
      .attr('x', '-50%')
      .attr('y', '-50%')
      .attr('width', '200%')
      .attr('height', '200%');

    glowFilter.append('feGaussianBlur')
      .attr('stdDeviation', '2.5')
      .attr('result', 'blur');
    
    glowFilter.append('feComposite')
      .attr('in', 'SourceGraphic')
      .attr('in2', 'blur')
      .attr('operator', 'over');

    // Holographic Noise Filter
    const noiseFilter = defs.append('filter')
      .attr('id', 'hologram-noise');
    
    noiseFilter.append('feTurbulence')
      .attr('type', 'fractalNoise')
      .attr('baseFrequency', '0.8')
      .attr('numOctaves', '4')
      .attr('result', 'noise');
    
    noiseFilter.append('feColorMatrix')
      .attr('type', 'matrix')
      .attr('values', '0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.1 0');

    // Particle/Dot Pattern
    const pattern = defs.append('pattern')
      .attr('id', 'dot-pattern')
      .attr('patternUnits', 'userSpaceOnUse')
      .attr('width', 8)
      .attr('height', 8);

    pattern.append('circle')
      .attr('cx', 1)
      .attr('cy', 1)
      .attr('r', 0.8)
      .attr('fill', 'rgba(0, 255, 180, 0.2)');

    // Vertical Beam Gradient
    const beamGradient = defs.append('linearGradient')
      .attr('id', 'beam-gradient')
      .attr('x1', '0%').attr('y1', '100%')
      .attr('x2', '0%').attr('y2', '0%');
    beamGradient.append('stop').attr('offset', '0%').attr('stop-color', 'rgba(0, 255, 180, 0.1)');
    beamGradient.append('stop').attr('offset', '100%').attr('stop-color', 'rgba(0, 255, 180, 0.8)');

    // Radar Sweep Gradient
    const radarSweep = defs.append('radialGradient')
      .attr('id', 'radar-sweep');
    radarSweep.append('stop').attr('offset', '0%').attr('stop-color', 'rgba(0, 255, 180, 0)');
    radarSweep.append('stop').attr('offset', '80%').attr('stop-color', 'rgba(0, 255, 180, 0)');
    radarSweep.append('stop').attr('offset', '100%').attr('stop-color', 'rgba(0, 255, 180, 0.3)');

    // Projection initialized after data load for fitSize

    d3.json(INDIA_GEOJSON_URL).then(geojson => {
      const projection = d3.geoMercator().fitSize([width, height - 100], geojson);
      const path = d3.geoPath().projection(projection);
      const g = svg.append('g').attr('class', 'map-g');
      setIsLoaded(true);

      // 1. Base Map Shape (Shadow)
      g.selectAll('.base-path')
        .data(geojson.features)
        .enter()
        .append('path')
        .attr('d', path)
        .attr('fill', 'rgba(0, 20, 40, 0.4)')
        .attr('stroke', 'rgba(0, 255, 180, 0.05)')
        .attr('stroke-width', 1);

      // 2. Particle Grid Overlay
      g.selectAll('.dot-path')
        .data(geojson.features)
        .enter()
        .append('path')
        .attr('d', path)
        .attr('fill', 'url(#dot-pattern)')
        .style('pointer-events', 'none');

      // 3. Glowing Interactive States
      g.selectAll('.state-path')
        .data(geojson.features)
        .enter()
        .append('path')
        .attr('d', path)
        .attr('class', 'state-path cursor-pointer')
        .attr('fill', 'transparent')
        .attr('stroke', d => {
          const props = d.properties;
          const stateName = props.st_nm || props.NAME_1 || props.name || props.ST_NM;
          const stateData = data?.[stateName] || Object.values(data || {}).find(s => s.name === stateName);
          return stateData ? 'rgba(0, 255, 180, 0.4)' : 'rgba(255, 255, 255, 0.05)';
        })
        .attr('stroke-width', 0.8)
        .style('filter', 'url(#hologram-glow)')
        .on('mouseover', (event, d) => {
          const props = d.properties;
          const stateName = props.st_nm || props.NAME_1 || props.name || props.ST_NM;
          const stateData = data?.[stateName] || Object.values(data || {}).find(s => s.name === stateName) || { quality: 0, credits: 0 };
          
          d3.select(event.currentTarget)
            .attr('stroke', '#00FFB4')
            .attr('stroke-width', 2.5)
            .attr('fill', 'rgba(0, 255, 180, 0.05)');
          
          setHoveredState(stateName);
          setTooltip({
            show: true,
            x: event.clientX,
            y: event.clientY,
            content: { name: stateName, ...stateData }
          });
        })
        .on('mouseout', (event, d) => {
          const props = d.properties;
          const stateName = props.st_nm || props.NAME_1 || props.name || props.ST_NM;
          const stateData = data?.[stateName] || Object.values(data || {}).find(s => s.name === stateName);
          
          d3.select(event.currentTarget)
            .attr('stroke', stateData ? 'rgba(0, 255, 180, 0.4)' : 'rgba(255, 255, 255, 0.05)')
            .attr('stroke-width', 0.8)
            .attr('fill', 'transparent');
          
          setHoveredState(null);
          setTooltip(prev => ({ ...prev, show: false }));
        })
        .on('click', (event, d) => {
          const props = d.properties;
          const stateName = props.st_nm || props.NAME_1 || props.name || props.ST_NM;
          if (onStateClick) onStateClick(stateName);
        });

      // 4. Data Beams (Vertical light pillars)
      const activeStates = geojson.features.filter(f => {
          const props = f.properties;
          const name = props.st_nm || props.NAME_1 || props.name || props.ST_NM;
          return data?.[name] || Object.values(data || {}).find(s => s.name === name);
      });

      activeStates.forEach(feature => {
        const centroid = path.centroid(feature);
        if (!centroid || isNaN(centroid[0])) return;
        const [cx, cy] = centroid;
        const props = feature.properties;
        const name = props.st_nm || props.NAME_1 || props.name || props.ST_NM;
        const stateData = data?.[name] || Object.values(data || {}).find(s => s.name === name);
        const intensity = (stateData.credits / 20000) * 100; // Normalized height
        
        const beamGroup = g.append('g').attr('class', 'beam-group');

        // Pillar Base
        beamGroup.append('circle')
          .attr('cx', cx).attr('cy', cy)
          .attr('r', 3)
          .attr('fill', '#00FFB4')
          .attr('class', 'animate-pulse');

        // Vertical Beam (Simulated 3D with 2D skew or line)
        beamGroup.append('line')
          .attr('x1', cx).attr('y1', cy)
          .attr('x2', cx).attr('y2', cy - intensity)
          .attr('stroke', 'url(#beam-gradient)')
          .attr('stroke-width', 2)
          .attr('stroke-linecap', 'round')
          .style('filter', 'blur(1px)');
      });

      // 5. Radar Circular Sweep
      const radar = g.append('circle')
        .attr('cx', width / 2)
        .attr('cy', height / 2)
        .attr('r', 0)
        .attr('fill', 'none')
        .attr('stroke', 'url(#radar-sweep)')
        .attr('stroke-width', 20)
        .style('pointer-events', 'none');

      const animateRadar = () => {
        radar
          .attr('r', 0)
          .attr('opacity', 1)
          .transition()
          .duration(3000)
          .ease(d3.easeQuadOut)
          .attr('r', 400)
          .attr('opacity', 0)
          .on('end', animateRadar);
      };
      animateRadar();

      setIsLoaded(true);
    }).catch(err => {
      console.error("Failed to load India GeoJSON:", err);
      // Fallback: If URL fails, we could potentially use a local copy or show an error
    });
  }, [data, is3D]);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-transparent overflow-hidden">
      {/* HUD Header */}
      <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-start z-10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-1 h-4 bg-primary rounded-full animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Strategic Intelligence</span>
          </div>
          <p className="text-[8px] text-text-muted font-mono uppercase">Node: AS-IN-V12 // System: Active</p>
        </div>

        <div className="flex gap-2">
          <button 
            onClick={() => setIs3D(!is3D)}
            className={`px-3 py-1.5 rounded-md text-[8px] font-black uppercase tracking-widest border transition-all ${
              is3D ? 'bg-primary/20 border-primary text-primary' : 'bg-white/5 border-white/10 text-text-secondary'
            }`}
          >
            {is3D ? '3D Projected' : '2D Schematic'}
          </button>
        </div>
      </div>

      {/* Main Map Container */}
      <div className="w-full h-full flex items-center justify-center perspective-[2000px]">
        <motion.div 
          animate={{ 
            rotateX: is3D ? 35 : 0, 
            rotateZ: is3D ? -10 : 0,
            y: is3D ? 20 : 0
          }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full h-full flex items-center justify-center"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Holographic Base Grid */}
          {is3D && (
            <div className="absolute inset-0 pointer-events-none"
                 style={{
                   backgroundImage: `radial-gradient(circle at center, rgba(0, 255, 180, 0.1) 0%, transparent 70%), 
                                     linear-gradient(rgba(0, 255, 180, 0.05) 1px, transparent 1px), 
                                     linear-gradient(90deg, rgba(0, 255, 180, 0.05) 1px, transparent 1px)`,
                   backgroundSize: '100% 100%, 40px 40px, 40px 40px',
                   transform: 'rotateX(90deg) translateZ(-150px) scale(2)',
                   opacity: 0.4
                 }} 
            />
          )}

          {/* CRT Scan-lines Overlay */}
          <div className="absolute inset-0 pointer-events-none z-20"
               style={{
                 background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.1) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.03), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.03))',
                 backgroundSize: '100% 3px, 3px 100%',
                 opacity: 0.2
               }} 
          />
          
          {/* Noise Overlay */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-20"
               style={{ filter: 'url(#hologram-noise)' }}
          />

          <svg ref={svgRef} className="w-full h-[90%] max-w-[800px] drop-shadow-[0_0_80px_rgba(0,255,180,0.1)] relative z-10" />

          {/* Floating Data Point Label */}
          <AnimatePresence>
            {hoveredState && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-1/4 left-1/4 pointer-events-none"
                style={{ transform: 'translateZ(100px)' }}
              >
                <div className="text-[120px] font-black text-white/[0.03] uppercase tracking-tighter select-none">
                  {hoveredState}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Tooltip */}
      <AnimatePresence>
        {tooltip.show && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="fixed glass p-5 rounded-2xl z-50 pointer-events-none border border-primary/20 backdrop-blur-2xl shadow-glow-green"
            style={{ left: tooltip.x + 20, top: tooltip.y - 120 }}
          >
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <h4 className="text-[10px] font-black uppercase text-primary tracking-widest">{tooltip.content.name}</h4>
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[8px] text-text-muted uppercase font-bold">Credits</p>
                  <p className="text-xl font-mono font-black text-text-primary">{(tooltip.content.credits || 0).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-[8px] text-text-muted uppercase font-bold">Verification</p>
                  <p className="text-xl font-mono font-black text-primary">{tooltip.content.quality}%</p>
                </div>
              </div>
              <div className="w-full h-1 bg-white/5 rounded-full">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${tooltip.content.quality}%` }}
                  className="h-full bg-primary shadow-glow-green"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legend Footer */}
      <div className="absolute bottom-8 left-8 flex gap-8 items-center bg-white/[0.02] border border-white/5 backdrop-blur-md px-6 py-4 rounded-2xl z-10">
        <div className="flex items-center gap-3">
          <div className="w-3 h-1 bg-primary rounded-full shadow-glow-green" />
          <span className="text-[9px] font-black uppercase tracking-widest text-text-secondary">High Yield Cluster</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-1 h-4 bg-white/10 rounded-full" />
          <div className="flex flex-col">
            <span className="text-[8px] text-text-muted font-bold uppercase">Inventory Source</span>
            <span className="text-[10px] text-text-primary font-black uppercase tracking-tighter">Verified Satellite Stream</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndiaHeatmap;
