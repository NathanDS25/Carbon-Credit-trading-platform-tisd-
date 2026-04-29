// UI Enhanced v2 — 3D Map + Motion + Glassmorphism
import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { motion, AnimatePresence } from 'framer-motion';

const INDIA_GEOJSON_URL = 'https://raw.githubusercontent.com/HindustanTimesLabs/shapefiles/master/india/states/india_states.json';

const IndiaHeatmap = ({ data, onStateClick }) => {
  const svgRef = useRef();
  const [tooltip, setTooltip] = useState({ show: false, x: 0, y: 0, content: null });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!svgRef.current) return;

    const width = 600;
    const height = 700;

    const svg = d3.select(svgRef.current)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet');

    svg.selectAll('*').remove();

    const projection = d3.geoMercator()
      .center([82, 22])
      .scale(1100)
      .translate([width / 2, height / 2]);

    const path = d3.geoPath().projection(projection);

    d3.json(INDIA_GEOJSON_URL).then(geojson => {
      const g = svg.append('g').attr('class', 'map-g');

      // State Paths with Tiers
      g.selectAll('path')
        .data(geojson.features)
        .enter()
        .append('path')
        .attr('d', path)
        .attr('class', 'state-path cursor-pointer transition-all duration-500')
        .attr('fill', d => {
          const stateName = d.properties.st_nm;
          const stateData = data?.[stateName];
          if (!stateData) return 'rgba(255,255,255,0.03)';
          
          if (stateData.quality >= 90) return '#1a0a2e'; // Ultra
          if (stateData.quality >= 80) return '#001a12'; // High
          if (stateData.quality >= 60) return '#1a1200'; // Medium
          return '#1a0505'; // Low
        })
        .attr('stroke', d => {
          const stateData = data?.[d.properties.st_nm];
          if (!stateData) return 'rgba(255,255,255,0.1)';
          if (stateData.quality >= 90) return '#BF5FFF';
          if (stateData.quality >= 80) return '#00C896';
          if (stateData.quality >= 60) return '#FFD700';
          return '#FF4F5E';
        })
        .attr('stroke-width', 0.8)
        .style('filter', d => {
          const stateData = data?.[d.properties.st_nm];
          if (!stateData) return 'none';
          const color = stateData.quality >= 90 ? '#BF5FFF' : 
                        stateData.quality >= 80 ? '#00C896' :
                        stateData.quality >= 60 ? '#FFD700' : '#FF4F5E';
          return `drop-shadow(0 0 6px ${color})`;
        })
        .on('mouseover', (event, d) => {
          const stateData = data?.[d.properties.st_nm] || { quality: 0, credits: 0 };
          d3.select(event.currentTarget)
            .attr('stroke-width', 2)
            .attr('fill-opacity', 0.8);
          
          setTooltip({
            show: true,
            x: event.clientX,
            y: event.clientY,
            content: { name: d.properties.st_nm, ...stateData }
          });
        })
        .on('mouseout', (event) => {
          d3.select(event.currentTarget)
            .attr('stroke-width', 0.8)
            .attr('fill-opacity', 1);
          setTooltip(prev => ({ ...prev, show: false }));
        })
        .on('click', (event, d) => {
          if (onStateClick) onStateClick(d.properties.st_nm);
        });

      // Animated Pulse Dots for Active Areas
      const activeStates = geojson.features.filter(f => data?.[f.properties.st_nm]);
      activeStates.forEach(feature => {
        const centroid = path.centroid(feature);
        const stateData = data[feature.properties.st_nm];
        const color = stateData.quality >= 80 ? '#00C896' : '#FFD700';

        // Outer Pulse
        g.append('circle')
          .attr('cx', centroid[0])
          .attr('cy', centroid[1])
          .attr('r', 4)
          .attr('fill', color)
          .attr('opacity', 0.3)
          .append('animate')
          .attr('attributeName', 'r')
          .attr('from', '4')
          .attr('to', '15')
          .attr('dur', '2s')
          .attr('begin', '0s')
          .attr('repeatCount', 'indefinite');

        g.append('circle')
          .attr('cx', centroid[0])
          .attr('cy', centroid[1])
          .attr('r', 4)
          .attr('fill', color)
          .attr('opacity', 0.3)
          .append('animate')
          .attr('attributeName', 'opacity')
          .attr('from', '0.6')
          .attr('to', '0')
          .attr('dur', '2s')
          .attr('begin', '0s')
          .attr('repeatCount', 'indefinite');

        // Inner Core
        g.append('circle')
          .attr('cx', centroid[0])
          .attr('cy', centroid[1])
          .attr('r', 3)
          .attr('fill', '#fff')
          .attr('stroke', color)
          .attr('stroke-width', 2);
      });

      setIsLoaded(true);
    }).catch(err => console.error("Map Error:", err));
  }, [data]);

  return (
    <div className="relative w-full h-full map-perspective overflow-visible">
      <motion.div 
        initial={{ opacity: 0, scale: 0.92, rotateX: 10 }}
        animate={isLoaded ? { opacity: 1, scale: 1, rotateX: 28 } : {}}
        transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        className="map-tilted w-full h-full"
        style={{ transformOrigin: 'center 60%' }}
      >
        <svg ref={svgRef} className="w-full h-full drop-shadow-[0_0_80px_rgba(0,200,150,0.08)]"></svg>
      </motion.div>
      
      <AnimatePresence>
        {tooltip.show && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            className="fixed glass p-4 rounded-xl z-50 pointer-events-none shadow-glow-green border-primary/20 backdrop-blur-xl"
            style={{ left: tooltip.x + 20, top: tooltip.y + 20 }}
          >
            <h4 className="text-xs font-black uppercase tracking-widest text-primary mb-2">{tooltip.content.name}</h4>
            <div className="space-y-2">
              <div className="flex justify-between gap-8">
                <span className="text-[10px] text-text-secondary font-bold uppercase">Inventory</span>
                <span className="text-xs font-mono text-text-primary">{tooltip.content.credits.toLocaleString()} CRX</span>
              </div>
              <div className="flex justify-between gap-8">
                <span className="text-[10px] text-text-secondary font-bold uppercase">Confidence</span>
                <span className={`text-xs font-bold ${tooltip.content.quality >= 80 ? 'text-primary' : 'text-warning'}`}>
                  {tooltip.content.quality}%
                </span>
              </div>
            </div>
            {/* Progress bar for quality */}
            <div className="mt-3 w-full h-1 bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${tooltip.content.quality}%` }}
                className={`h-full ${tooltip.content.quality >= 80 ? 'bg-primary shadow-glow-green' : 'bg-warning'}`}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default IndiaHeatmap;
