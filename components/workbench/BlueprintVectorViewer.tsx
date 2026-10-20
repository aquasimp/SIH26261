'use client';

import React, { useState } from 'react';
import { BlueprintRoom } from '@/lib/mock-data';
import { calculateShoelaceArea } from '@/lib/aph-engine';
import {
  Layers,
  Ruler,
  AlertTriangle,
  CheckCircle2,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Sliders,
  Info,
} from 'lucide-react';

interface BlueprintVectorViewerProps {
  rooms: BlueprintRoom[];
  selectedRoomId?: string | null;
  onSelectRoom?: (roomId: string) => void;
  scaleFactor?: number; // meters per pixel
  onScaleChange?: (newScale: number) => void;
}

export function BlueprintVectorViewer({
  rooms,
  selectedRoomId,
  onSelectRoom,
  scaleFactor: externalScaleFactor,
  onScaleChange,
}: BlueprintVectorViewerProps) {
  // Internal scale state if not controlled externally
  // Baseline: 240px represents 10.0 meters => s = 10.0 / 240 = 0.041667 m/px
  const [internalScalePixels, setInternalScalePixels] = useState<number>(240);
  const [internalScaleMeters, setInternalScaleMeters] = useState<number>(10.0);
  const [zoomLevel, setZoomLevel] = useState<number>(100);

  // Active layer visibility
  const [showWalls, setShowWalls] = useState<boolean>(true);
  const [showIna, setShowIna] = useState<boolean>(true);
  const [showAda, setShowAda] = useState<boolean>(true);
  const [showAma, setShowAma] = useState<boolean>(true);
  const [showDimensions, setShowDimensions] = useState<boolean>(true);

  // Current scale factor in m/px
  const activeScaleFactor = externalScaleFactor ?? internalScaleMeters / internalScalePixels;

  // Handle scale change
  const handleScalePreset = (px: number, m: number) => {
    setInternalScalePixels(px);
    setInternalScaleMeters(m);
    if (onScaleChange) {
      onScaleChange(m / px);
    }
  };

  // Recomputed rooms with active scale factor
  const calibratedRooms = rooms.map((room) => {
    const ratio = activeScaleFactor / 0.04167;
    const dynamicShoelaceArea = Math.round(room.computedAreaSqm * (ratio * ratio) * 10) / 10;
    const isInflated = room.status === 'INFLATED_LABEL' || dynamicShoelaceArea < room.aphNormSqm;

    return {
      ...room,
      computedAreaSqm: dynamicShoelaceArea,
      status: isInflated && room.status !== 'COMPLIANT' ? ('INFLATED_LABEL' as const) : room.status,
    };
  });

  const activeRoom = calibratedRooms.find((r) => r.id === selectedRoomId) || calibratedRooms[0];

  return (
    <div className="flex flex-col h-full liquid-glass-card rounded-2xl overflow-hidden shadow-sm">
      {/* Top Toolbar */}
      <div className="p-3 border-b border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Layer Filters */}
        <div className="flex items-center gap-1.5 font-semibold">
          <span className="text-[10px] uppercase tracking-wider text-slate-400 mr-1 hidden sm:inline">Layers:</span>
          <button
            onClick={() => setShowIna(!showIna)}
            className={`px-2.5 py-1 rounded-lg border transition-all ${
              showIna
                ? 'bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/30 font-bold'
                : 'text-slate-400 border-slate-200 dark:border-slate-800'
            }`}
          >
            INA (Labs)
          </button>
          <button
            onClick={() => setShowAda(!showAda)}
            className={`px-2.5 py-1 rounded-lg border transition-all ${
              showAda
                ? 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/30 font-bold'
                : 'text-slate-400 border-slate-200 dark:border-slate-800'
            }`}
          >
            ADA (Admin)
          </button>
          <button
            onClick={() => setShowAma(!showAma)}
            className={`px-2.5 py-1 rounded-lg border transition-all ${
              showAma
                ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 font-bold'
                : 'text-slate-400 border-slate-200 dark:border-slate-800'
            }`}
          >
            AMA (Amenities)
          </button>
          <button
            onClick={() => setShowWalls(!showWalls)}
            className={`px-2.5 py-1 rounded-lg border transition-all ${
              showWalls
                ? 'bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-500/30 font-bold'
                : 'text-slate-400 border-slate-200 dark:border-slate-800'
            }`}
          >
            Walls
          </button>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1.5 text-slate-500">
          <button
            onClick={() => setZoomLevel((prev) => Math.max(60, prev - 15))}
            className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="font-mono text-[11px] w-12 text-center">{zoomLevel}%</span>
          <button
            onClick={() => setZoomLevel((prev) => Math.min(160, prev + 15))}
            className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Scale Calibrator Bar */}
      <div className="px-4 py-2 bg-sky-50/70 dark:bg-slate-950/70 border-b border-sky-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-2">
          <Ruler className="w-4 h-4 text-sky-600 dark:text-sky-400" />
          <span className="text-slate-600 dark:text-slate-300 font-semibold">Scale Bar Calibration:</span>
          <span className="font-bold text-sky-700 dark:text-sky-400">
            {internalScaleMeters}m = {internalScalePixels}px (s = {activeScaleFactor.toFixed(5)} m/px)
          </span>
        </div>

        {/* Scale Presets */}
        <div className="flex items-center gap-2">
          <span className="text-slate-400 text-[11px]">Presets:</span>
          <button
            onClick={() => handleScalePreset(240, 10.0)}
            className="px-2 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:border-sky-500 text-[11px] text-slate-700 dark:text-slate-300 font-bold"
          >
            10.0m (Standard)
          </button>
          <button
            onClick={() => handleScalePreset(200, 10.0)}
            className="px-2 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:border-sky-500 text-[11px] text-slate-700 dark:text-slate-300 font-bold"
          >
            Compress (-16%)
          </button>
          <button
            onClick={() => handleScalePreset(280, 10.0)}
            className="px-2 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:border-sky-500 text-[11px] text-slate-700 dark:text-slate-300 font-bold"
          >
            Expand (+16%)
          </button>
        </div>
      </div>

      {/* Main SVG Blueprint Canvas */}
      <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-slate-900 min-h-[460px]">
        <div
          style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'center center' }}
          className="relative transition-transform duration-150 rounded-lg overflow-hidden border border-slate-800 shadow-2xl bg-[#090D1A]"
        >
          <svg viewBox="0 0 800 520" className="w-[720px] h-[468px] select-none">
            {/* Grid Lines */}
            <defs>
              <pattern id="cadGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="800" height="520" fill="url(#cadGrid)" />

            {/* Perimeter & Structural Walls */}
            {showWalls && (
              <g stroke="#64748B" strokeWidth="6" fill="none" opacity="0.85">
                <rect x="30" y="30" width="740" height="420" />
                <line x1="30" y1="230" x2="770" y2="230" />
                <line x1="270" y1="30" x2="270" y2="450" />
                <line x1="510" y1="30" x2="510" y2="450" />
              </g>
            )}

            {/* Room 1: Classroom 101 (INA) */}
            {showIna && (
              <g
                className="cursor-pointer transition-all hover:opacity-90"
                onClick={() => onSelectRoom && onSelectRoom('RM-101')}
              >
                <rect
                  x="40"
                  y="40"
                  width="220"
                  height="180"
                  fill="rgba(56, 189, 248, 0.15)"
                  stroke={selectedRoomId === 'RM-101' ? '#38BDF8' : 'rgba(56, 189, 248, 0.5)'}
                  strokeWidth={selectedRoomId === 'RM-101' ? 3 : 1.5}
                  rx="4"
                />
                <text x="150" y="110" fill="#E2E8F0" fontSize="13" fontWeight="bold" textAnchor="middle">
                  CLASSROOM 101
                </text>
                <text x="150" y="130" fill="#38BDF8" fontSize="11" fontFamily="JetBrains Mono" textAnchor="middle">
                  Text: 66.0 m² | CV: 66.2 m²
                </text>
                <text x="150" y="150" fill="#34D399" fontSize="10" fontFamily="JetBrains Mono" textAnchor="middle">
                  ✓ COMPLIANT (Norm: 66.0)
                </text>
              </g>
            )}

            {/* Room 2: VLSI & Embedded Lab (INA) — TARGET FRAUD INFLATED ROOM */}
            {showIna && (
              <g
                className="cursor-pointer transition-all hover:opacity-90"
                onClick={() => onSelectRoom && onSelectRoom('RM-103')}
              >
                <rect
                  x="280"
                  y="40"
                  width="220"
                  height="180"
                  fill="rgba(244, 63, 94, 0.22)"
                  stroke={selectedRoomId === 'RM-103' ? '#F43F5E' : 'rgba(244, 63, 94, 0.8)'}
                  strokeWidth={selectedRoomId === 'RM-103' ? 3 : 2}
                  strokeDasharray="4 2"
                  rx="4"
                />
                <text x="390" y="100" fill="#FFFFFF" fontSize="13" fontWeight="bold" textAnchor="middle">
                  VLSI &amp; EMBEDDED LAB
                </text>
                <text x="390" y="122" fill="#FDA4AF" fontSize="11" fontFamily="JetBrains Mono" textAnchor="middle">
                  Printed Label: 66.0 SQ.M
                </text>
                <text x="390" y="142" fill="#F43F5E" fontSize="12" fontFamily="JetBrains Mono" fontWeight="bold" textAnchor="middle">
                  True CV Shoelace: {(46.8 * Math.pow(activeScaleFactor / 0.04167, 2)).toFixed(1)} m²
                </text>
                <text x="390" y="164" fill="#FF453A" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold" textAnchor="middle">
                  ⚠ SHORTFALL -29.1% (Norm: 66.0)
                </text>
              </g>
            )}

            {/* Room 3: Principal & Admin Office (ADA) */}
            {showAda && (
              <g
                className="cursor-pointer transition-all hover:opacity-90"
                onClick={() => onSelectRoom && onSelectRoom('RM-104')}
              >
                <rect
                  x="520"
                  y="40"
                  width="240"
                  height="180"
                  fill="rgba(129, 140, 248, 0.15)"
                  stroke={selectedRoomId === 'RM-104' ? '#818CF8' : 'rgba(129, 140, 248, 0.5)'}
                  strokeWidth={selectedRoomId === 'RM-104' ? 3 : 1.5}
                  rx="4"
                />
                <text x="640" y="110" fill="#E2E8F0" fontSize="13" fontWeight="bold" textAnchor="middle">
                  PRINCIPAL &amp; BOARD ROOM
                </text>
                <text x="640" y="130" fill="#818CF8" fontSize="11" fontFamily="JetBrains Mono" textAnchor="middle">
                  Text: 80.0 m² | CV: 82.4 m²
                </text>
                <text x="640" y="150" fill="#34D399" fontSize="10" fontFamily="JetBrains Mono" textAnchor="middle">
                  ✓ COMPLIANT (Norm: 30.0)
                </text>
              </g>
            )}

            {/* Room 4: Central Computing Lab (INA) */}
            {showIna && (
              <g
                className="cursor-pointer transition-all hover:opacity-90"
                onClick={() => onSelectRoom && onSelectRoom('RM-102')}
              >
                <rect
                  x="40"
                  y="240"
                  width="220"
                  height="200"
                  fill="rgba(56, 189, 248, 0.15)"
                  stroke={selectedRoomId === 'RM-102' ? '#38BDF8' : 'rgba(56, 189, 248, 0.5)'}
                  strokeWidth={selectedRoomId === 'RM-102' ? 3 : 1.5}
                  rx="4"
                />
                <text x="150" y="320" fill="#E2E8F0" fontSize="13" fontWeight="bold" textAnchor="middle">
                  CENTRAL COMPUTING LAB
                </text>
                <text x="150" y="340" fill="#38BDF8" fontSize="11" fontFamily="JetBrains Mono" textAnchor="middle">
                  Text: 150.0 m² | CV: 151.2 m²
                </text>
                <text x="150" y="360" fill="#34D399" fontSize="10" fontFamily="JetBrains Mono" textAnchor="middle">
                  ✓ COMPLIANT (Norm: 150.0)
                </text>
              </g>
            )}

            {/* Room 5: Circulation Corridor (ACA) */}
            <g>
              <rect
                x="280"
                y="240"
                width="220"
                height="200"
                fill="rgba(245, 158, 11, 0.10)"
                stroke="rgba(245, 158, 11, 0.4)"
                strokeWidth="1.5"
                rx="4"
              />
              <text x="390" y="320" fill="#FDE68A" fontSize="12" fontWeight="bold" textAnchor="middle">
                MAIN CIRCULATION ATRIUM
              </text>
              <text x="390" y="340" fill="#F59E0B" fontSize="10" fontFamily="JetBrains Mono" textAnchor="middle">
                Access &amp; Stairwell (2.5m Wide)
              </text>
              <text x="390" y="360" fill="#FDE68A" fontSize="10" fontFamily="JetBrains Mono" textAnchor="middle">
                Area: 110.0 m² (ACA Norm)
              </text>
            </g>

            {/* Room 6: Barrier-Free Amenities / PWD Toilets (AMA) */}
            {showAma && (
              <g
                className="cursor-pointer transition-all hover:opacity-90"
                onClick={() => onSelectRoom && onSelectRoom('RM-105')}
              >
                <rect
                  x="520"
                  y="240"
                  width="240"
                  height="200"
                  fill="rgba(16, 185, 129, 0.15)"
                  stroke={selectedRoomId === 'RM-105' ? '#10B981' : 'rgba(16, 185, 129, 0.5)'}
                  strokeWidth={selectedRoomId === 'RM-105' ? 3 : 1.5}
                  rx="4"
                />
                <text x="640" y="320" fill="#E2E8F0" fontSize="13" fontWeight="bold" textAnchor="middle">
                  AMENITIES &amp; PWD RESTROOMS
                </text>
                <text x="640" y="340" fill="#34D399" fontSize="11" fontFamily="JetBrains Mono" textAnchor="middle">
                  Text: 45.0 m² | CV: 46.8 m²
                </text>
                <text x="640" y="360" fill="#34D399" fontSize="10" fontFamily="JetBrains Mono" textAnchor="middle">
                  ✓ Ramp &amp; Tactile Access Verified
                </text>
              </g>
            )}

            {/* Scale Bar on Blueprint Canvas */}
            <g transform="translate(60, 480)">
              <line x1="0" y1="0" x2={internalScalePixels} y2="0" stroke="#FFFFFF" strokeWidth="3" />
              <line x1="0" y1="-6" x2="0" y2="6" stroke="#FFFFFF" strokeWidth="2" />
              <line x1={internalScalePixels / 2} y1="-4" x2={internalScalePixels / 2} y2="4" stroke="#FFFFFF" strokeWidth="1.5" />
              <line x1={internalScalePixels} y1="-6" x2={internalScalePixels} y2="6" stroke="#FFFFFF" strokeWidth="2" />
              <text x="0" y="16" fill="#94A3B8" fontSize="10" fontFamily="JetBrains Mono">0m</text>
              <text x={internalScalePixels / 2} y="16" fill="#94A3B8" fontSize="10" fontFamily="JetBrains Mono" textAnchor="middle">
                {(internalScaleMeters / 2).toFixed(1)}m
              </text>
              <text x={internalScalePixels} y="16" fill="#FFFFFF" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold">
                {internalScaleMeters.toFixed(1)}m
              </text>
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}
