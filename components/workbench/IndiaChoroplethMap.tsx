'use client';

import React, { useState } from 'react';

interface StateData {
  id: string;
  name: string;
  count: number;
  colorLevel: 1 | 2 | 3 | 4; // 1: <100, 2: 100-200, 3: 200-500, 4: >500
  d: string;
}

// Simplified scalable SVG paths representing Indian states for high-performance operational choropleth
const INDIA_STATES: StateData[] = [
  // Northern
  { id: 'JK', name: 'Jammu & Kashmir and Ladakh', count: 94, colorLevel: 1, d: 'M115,20 L135,15 L155,25 L160,45 L145,55 L130,50 L120,40 Z' },
  { id: 'HP', name: 'Himachal Pradesh', count: 86, colorLevel: 1, d: 'M130,50 L145,55 L148,68 L135,70 L126,60 Z' },
  { id: 'PB', name: 'Punjab', count: 182, colorLevel: 2, d: 'M110,55 L126,60 L124,78 L108,72 Z' },
  { id: 'HR', name: 'Haryana & Delhi NCR', count: 340, colorLevel: 3, d: 'M122,70 L136,70 L138,85 L120,86 Z' },
  { id: 'UK', name: 'Uttarakhand', count: 110, colorLevel: 2, d: 'M145,62 L162,65 L155,80 L140,75 Z' },
  // Western & Central
  { id: 'RJ', name: 'Rajasthan', count: 395, colorLevel: 3, d: 'M85,75 L120,80 L122,118 L88,115 L78,95 Z' },
  { id: 'UP', name: 'Uttar Pradesh', count: 580, colorLevel: 4, d: 'M135,80 L175,85 L185,115 L140,118 L130,95 Z' },
  { id: 'BR', name: 'Bihar', count: 240, colorLevel: 3, d: 'M185,100 L215,105 L210,125 L180,122 Z' },
  { id: 'GJ', name: 'Gujarat', count: 420, colorLevel: 3, d: 'M60,110 L88,115 L95,142 L65,145 L52,125 Z' },
  { id: 'MP', name: 'Madhya Pradesh', count: 390, colorLevel: 3, d: 'M100,120 L155,120 L160,150 L115,155 L95,135 Z' },
  { id: 'CG', name: 'Chhattisgarh', count: 165, colorLevel: 2, d: 'M155,140 L175,142 L168,178 L150,172 Z' },
  { id: 'JH', name: 'Jharkhand', count: 175, colorLevel: 2, d: 'M180,122 L205,124 L200,145 L175,142 Z' },
  { id: 'WB', name: 'West Bengal', count: 310, colorLevel: 3, d: 'M205,124 L220,126 L215,160 L198,150 Z' },
  { id: 'OD', name: 'Odisha', count: 285, colorLevel: 3, d: 'M168,155 L198,155 L192,185 L165,178 Z' },
  // Southern
  { id: 'MH', name: 'Maharashtra', count: 640, colorLevel: 4, d: 'M85,150 L140,152 L145,188 L100,195 L80,165 Z' },
  { id: 'TG', name: 'Telangana', count: 375, colorLevel: 3, d: 'M135,175 L162,175 L155,202 L130,198 Z' },
  { id: 'AP', name: 'Andhra Pradesh', count: 480, colorLevel: 3, d: 'M150,195 L175,185 L162,235 L140,225 Z' },
  { id: 'KA', name: 'Karnataka', count: 520, colorLevel: 4, d: 'M100,195 L135,198 L130,240 L105,235 L95,205 Z' },
  { id: 'KL', name: 'Kerala', count: 245, colorLevel: 3, d: 'M108,240 L120,240 L115,275 L106,270 Z' },
  { id: 'TN', name: 'Tamil Nadu', count: 590, colorLevel: 4, d: 'M120,235 L145,235 L138,278 L116,276 Z' },
  // North-East
  { id: 'AS', name: 'Assam & North East', count: 180, colorLevel: 2, d: 'M225,108 L265,105 L260,135 L225,128 Z' },
];

export function IndiaChoroplethMap() {
  const [hoveredState, setHoveredState] = useState<StateData | null>(null);

  const getColorClass = (level: 1 | 2 | 3 | 4) => {
    switch (level) {
      case 4:
        return 'fill-sky-500 hover:fill-sky-400 stroke-white/80 dark:stroke-slate-950/80';
      case 3:
        return 'fill-sky-600/85 hover:fill-sky-500 stroke-white/80 dark:stroke-slate-950/80';
      case 2:
        return 'fill-sky-700/75 hover:fill-sky-600 stroke-white/80 dark:stroke-slate-950/80';
      case 1:
        return 'fill-slate-300 dark:fill-slate-800/90 hover:fill-slate-400 dark:hover:fill-slate-700 stroke-white/80 dark:stroke-slate-950/80';
    }
  };

  return (
    <div className="relative w-full flex items-center justify-center py-2 select-none">
      <svg
        viewBox="30 10 250 280"
        className="w-full h-48 sm:h-52 drop-shadow-md transition-all"
        style={{ maxHeight: '210px' }}
      >
        <defs>
          <filter id="mapGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#0284C7" floodOpacity="0.2" />
          </filter>
        </defs>

        <g filter="url(#mapGlow)">
          {INDIA_STATES.map((state) => (
            <path
              key={state.id}
              d={state.d}
              className={`transition-all duration-150 cursor-pointer stroke-[1.2] ${getColorClass(state.colorLevel)} ${
                hoveredState?.id === state.id ? 'opacity-100 scale-[1.02] stroke-white stroke-2' : 'opacity-95'
              }`}
              onMouseEnter={() => setHoveredState(state)}
              onMouseLeave={() => setHoveredState(null)}
            />
          ))}
        </g>
      </svg>

      {/* Floating State Info Tooltip on Hover */}
      {hoveredState && (
        <div className="absolute top-2 right-2 rounded-xl bg-white/95 dark:bg-slate-900/95 border border-sky-500/40 px-3 py-1.5 shadow-xl text-left pointer-events-none animate-glass-in z-20 backdrop-blur-xs">
          <div className="text-xs font-bold text-slate-900 dark:text-white">{hoveredState.name}</div>
          <div className="text-[11px] text-blue-600 dark:text-sky-400 font-bold tabular-nums mt-0.5">
            {hoveredState.count.toLocaleString()} Dossiers
          </div>
        </div>
      )}
    </div>
  );
}

export default IndiaChoroplethMap;
