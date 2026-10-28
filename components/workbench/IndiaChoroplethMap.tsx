'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { INDIA_STATES_DATA, StateData } from './indiaMapData';

export interface IndiaChoroplethMapProps {
  className?: string;
  onSelectState?: (state: StateData | null) => void;
}

export function IndiaChoroplethMap({ className, onSelectState }: IndiaChoroplethMapProps) {
  const [hoveredState, setHoveredState] = useState<StateData | null>(null);
  const [selectedState, setSelectedState] = useState<StateData | null>(null);

  const activeState = hoveredState || selectedState;

  const getColorClass = (level: 1 | 2 | 3 | 4, isHovered: boolean, isSelected: boolean) => {
    if (isSelected) {
      return 'fill-sky-400 dark:fill-sky-300 stroke-white dark:stroke-sky-100 stroke-[2.5] drop-shadow-md';
    }
    if (isHovered) {
      return 'fill-sky-400 dark:fill-sky-300 stroke-white dark:stroke-white stroke-[2.2] drop-shadow-md';
    }

    switch (level) {
      case 4:
        return 'fill-sky-500 dark:fill-sky-500 stroke-white/90 dark:stroke-slate-900/90 stroke-[1.1] hover:fill-sky-400 dark:hover:fill-sky-400';
      case 3:
        return 'fill-sky-600 dark:fill-sky-600 stroke-white/90 dark:stroke-slate-900/90 stroke-[1.1] hover:fill-sky-500 dark:hover:fill-sky-500';
      case 2:
        return 'fill-sky-800 dark:fill-sky-800 stroke-white/90 dark:stroke-slate-900/90 stroke-[1.1] hover:fill-sky-700 dark:hover:fill-sky-700';
      case 1:
      default:
        return 'fill-slate-300 dark:fill-slate-700/80 stroke-white/90 dark:stroke-slate-900/90 stroke-[1.1] hover:fill-slate-400 dark:hover:fill-slate-600';
    }
  };

  const getTierLabel = (level: 1 | 2 | 3 | 4) => {
    switch (level) {
      case 4:
        return '> 500 Dossiers (High Density)';
      case 3:
        return '200 – 500 Dossiers (Medium-High)';
      case 2:
        return '100 – 200 Dossiers (Moderate)';
      case 1:
        return '< 100 Dossiers (Low Density)';
    }
  };

  const handleStateClick = (state: StateData) => {
    if (selectedState?.id === state.id) {
      setSelectedState(null);
      if (onSelectState) onSelectState(null);
    } else {
      setSelectedState(state);
      if (onSelectState) onSelectState(state);
    }
  };

  return (
    <div className={`relative w-full flex items-center justify-center py-1 select-none ${className || ''}`}>
      <svg
        viewBox="70 20 860 950"
        preserveAspectRatio="xMidYMid meet"
        className="w-full h-52 sm:h-56 max-h-[240px] drop-shadow-md transition-all cursor-pointer"
        aria-label="Interactive Choropleth Map of India"
      >
        <defs>
          <filter id="mapGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#0284C7" floodOpacity="0.18" />
          </filter>
        </defs>

        <g filter="url(#mapGlow)">
          {INDIA_STATES_DATA.map((state) => {
            const isHovered = hoveredState?.id === state.id;
            const isSelected = selectedState?.id === state.id;

            return (
              <path
                key={state.id}
                id={state.id}
                d={state.d}
                className={`transition-all duration-150 cursor-pointer ${getColorClass(
                  state.colorLevel,
                  isHovered,
                  isSelected
                )}`}
                onMouseEnter={() => setHoveredState(state)}
                onMouseLeave={() => setHoveredState(null)}
                onClick={() => handleStateClick(state)}
                onTouchStart={() => handleStateClick(state)}
              >
                <title>{`${state.name}: ${state.count} Dossiers`}</title>
              </path>
            );
          })}
        </g>
      </svg>

      {/* Floating State Info Tooltip on Hover or Selection */}
      {activeState && (
        <div className="absolute top-1 right-1 sm:top-2 sm:right-2 rounded-xl bg-white/95 dark:bg-slate-900/95 border border-sky-500/40 px-3 py-2 shadow-2xl text-left pointer-events-auto animate-glass-in z-20 backdrop-blur-md max-w-[200px]">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
              {activeState.name}
            </span>
            {selectedState?.id === activeState.id && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedState(null);
                  if (onSelectState) onSelectState(null);
                }}
                className="text-[10px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                title="Clear selection"
              >
                ✕
              </button>
            )}
          </div>

          <div className="text-xs text-blue-600 dark:text-sky-400 font-extrabold tabular-nums mt-0.5">
            {activeState.count.toLocaleString()} Dossiers
          </div>

          <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
            {getTierLabel(activeState.colorLevel)}
          </div>

          <Link
            href={`/applications?search=${encodeURIComponent(activeState.name)}`}
            className="mt-1.5 block text-[10px] font-bold text-sky-600 dark:text-sky-400 hover:underline"
          >
            Filter Dossiers →
          </Link>
        </div>
      )}
    </div>
  );
}

export default IndiaChoroplethMap;
