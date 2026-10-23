'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
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
  Move,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

export interface InteractiveRoom {
  id: string;
  name: string;
  category: 'INA' | 'ADA' | 'AMA' | 'ACA';
  declaredAreaSqm: number;
  aphNormSqm: number;
  points: [number, number][]; // Polygon corner coordinates in CAD px
  status: 'COMPLIANT' | 'INFLATED_LABEL' | 'UNDERSIZED';
}

const INITIAL_ROOMS: InteractiveRoom[] = [
  {
    id: 'RM-101',
    name: 'Classroom 101 (UG Lecture)',
    category: 'INA',
    declaredAreaSqm: 66.0,
    aphNormSqm: 66.0,
    points: [
      [40, 40],
      [220, 40],
      [220, 200],
      [40, 200],
    ],
    status: 'COMPLIANT',
  },
  {
    id: 'RM-102',
    name: 'Classroom 102 (UG Lecture)',
    category: 'INA',
    declaredAreaSqm: 66.0,
    aphNormSqm: 66.0,
    points: [
      [240, 40],
      [420, 40],
      [420, 200],
      [240, 200],
    ],
    status: 'COMPLIANT',
  },
  {
    id: 'RM-103',
    name: 'VLSI & Embedded Systems Lab',
    category: 'INA',
    declaredAreaSqm: 66.0,
    aphNormSqm: 66.0,
    // True geometric polygon: 164px x 164px at s=0.04167 gives ~46.8 m²
    points: [
      [440, 40],
      [604, 40],
      [604, 204],
      [440, 204],
    ],
    status: 'INFLATED_LABEL',
  },
  {
    id: 'RM-104',
    name: 'Chemistry & Materials Lab',
    category: 'INA',
    declaredAreaSqm: 66.0,
    aphNormSqm: 66.0,
    points: [
      [620, 40],
      [780, 40],
      [780, 200],
      [620, 200],
    ],
    status: 'COMPLIANT',
  },
  {
    id: 'RM-105',
    name: 'Principal & Board Room',
    category: 'ADA',
    declaredAreaSqm: 60.0,
    aphNormSqm: 50.0,
    points: [
      [40, 240],
      [220, 240],
      [220, 370],
      [40, 370],
    ],
    status: 'COMPLIANT',
  },
  {
    id: 'RM-106',
    name: 'Central Drawing Hall',
    category: 'INA',
    declaredAreaSqm: 150.0,
    aphNormSqm: 150.0,
    points: [
      [240, 240],
      [520, 240],
      [520, 370],
      [240, 370],
    ],
    status: 'COMPLIANT',
  },
  {
    id: 'RM-107',
    name: 'Barrier-Free PWD Restrooms',
    category: 'AMA',
    declaredAreaSqm: 45.0,
    aphNormSqm: 35.0,
    points: [
      [540, 240],
      [660, 240],
      [660, 370],
      [540, 370],
    ],
    status: 'COMPLIANT',
  },
  {
    id: 'RM-108',
    name: 'Main Circulation Corridor',
    category: 'ACA',
    declaredAreaSqm: 110.0,
    aphNormSqm: 100.0,
    points: [
      [680, 240],
      [780, 240],
      [780, 370],
      [680, 370],
    ],
    status: 'COMPLIANT',
  },
];

interface BlueprintVectorViewerProps {
  rooms?: BlueprintRoom[];
  selectedRoomId?: string | null;
  onSelectRoom?: (roomId: string) => void;
  scaleFactor?: number; // meters per pixel
  onScaleChange?: (newScale: number) => void;
}

export function BlueprintVectorViewer({
  selectedRoomId: externalSelectedRoomId,
  onSelectRoom,
  scaleFactor: externalScaleFactor,
  onScaleChange,
}: BlueprintVectorViewerProps) {
  // Linear scale bar slider state: s in [0.030, 0.055] m/px
  // Default: 10.0m = 240px => s = 10.0 / 240 = 0.041667 m/px
  const [scalePixels, setScalePixels] = useState<number>(240);
  const [scaleMeters, setScaleMeters] = useState<number>(10.0);
  const internalScaleFactor = scaleMeters / scalePixels;
  const activeScaleFactor = externalScaleFactor ?? internalScaleFactor;

  // Zoom
  const [zoomLevel, setZoomLevel] = useState<number>(100);

  // 4 CAD Layer Toggles
  const [showMask2Former, setShowMask2Former] = useState<boolean>(true);
  const [showRmbgWalls, setShowRmbgWalls] = useState<boolean>(true);
  const [showPcpRecalib, setShowPcpRecalib] = useState<boolean>(true);
  const [showRdpVertices, setShowRdpVertices] = useState<boolean>(true);

  // Interactive Room Polygon Vertices
  const [roomList, setRoomList] = useState<InteractiveRoom[]>(INITIAL_ROOMS);
  const [selectedRoomId, setSelectedRoomId] = useState<string>('RM-103');

  // Dragging vertex state
  const [draggingVertex, setDraggingVertex] = useState<{
    roomId: string;
    vertexIndex: number;
  } | null>(null);

  const svgRef = useRef<SVGSVGElement | null>(null);

  const effectiveSelectedRoomId = externalSelectedRoomId ?? selectedRoomId;

  // Re-calculate polygon area for each room using Shoelace Formula
  const evaluatedRooms = roomList.map((room) => {
    const shoelaceArea = calculateShoelaceArea(room.points, activeScaleFactor);
    const inflationRatio = (room.declaredAreaSqm - shoelaceArea) / room.declaredAreaSqm;
    const isInflated = inflationRatio > 0.05; // Inflation exceeds 5%

    return {
      ...room,
      computedAreaSqm: shoelaceArea,
      status: isInflated ? ('INFLATED_LABEL' as const) : ('COMPLIANT' as const),
      inflationRatioPct: Math.round(inflationRatio * 1000) / 10,
    };
  });

  const activeRoom =
    evaluatedRooms.find((r) => r.id === effectiveSelectedRoomId) || evaluatedRooms[2];

  // Scale preset clicker
  const handleScaleChange = (px: number, m: number) => {
    setScalePixels(px);
    setScaleMeters(m);
    if (onScaleChange) {
      onScaleChange(m / px);
    }
  };

  // Reset polygon vertices
  const handleResetVertices = () => {
    setRoomList(INITIAL_ROOMS);
  };

  // Handle vertex drag start
  const handleVertexMouseDown = (e: React.MouseEvent, roomId: string, vertexIndex: number) => {
    e.stopPropagation();
    setDraggingVertex({ roomId, vertexIndex });
    setSelectedRoomId(roomId);
    if (onSelectRoom) onSelectRoom(roomId);
  };

  // SVG Mouse Move for Dragging
  const handleSvgMouseMove = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      if (!draggingVertex || !svgRef.current) return;

      const svg = svgRef.current;
      const pt = svg.createSVGPoint();
      pt.x = e.clientX;
      pt.y = e.clientY;
      const svgPoint = pt.matrixTransform(svg.getScreenCTM()?.inverse());

      const snappedX = Math.round(svgPoint.x);
      const snappedY = Math.round(svgPoint.y);

      setRoomList((prev) =>
        prev.map((r) => {
          if (r.id !== draggingVertex.roomId) return r;
          const newPts: [number, number][] = r.points.map((p, idx) =>
            idx === draggingVertex.vertexIndex ? [snappedX, snappedY] : p
          );
          return {
            ...r,
            points: newPts,
          };
        })
      );
    },
    [draggingVertex]
  );

  const handleSvgMouseUp = () => {
    setDraggingVertex(null);
  };

  return (
    <div className="flex flex-col h-full liquid-glass-card rounded-2xl overflow-hidden shadow-sm select-none">
      {/* Top Toolbar: 4 CAD Layer Toggles */}
      <div className="p-3 border-b border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Layer Filters */}
        <div className="flex flex-wrap items-center gap-1.5 font-semibold">
          <span className="text-[10px] uppercase tracking-wider text-slate-400 mr-1 hidden sm:inline">
            Layers:
          </span>
          <button
            onClick={() => setShowMask2Former(!showMask2Former)}
            className={`px-2.5 py-1 rounded-lg border transition-all ${
              showMask2Former
                ? 'bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/30 font-bold'
                : 'text-slate-400 border-slate-200 dark:border-slate-800'
            }`}
          >
            Mask2Former (AP: 0.62)
          </button>
          <button
            onClick={() => setShowRmbgWalls(!showRmbgWalls)}
            className={`px-2.5 py-1 rounded-lg border transition-all ${
              showRmbgWalls
                ? 'bg-slate-500/15 text-slate-700 dark:text-slate-300 border-slate-500/30 font-bold'
                : 'text-slate-400 border-slate-200 dark:border-slate-800'
            }`}
          >
            RMBG-1.4 Walls
          </button>
          <button
            onClick={() => setShowPcpRecalib(!showPcpRecalib)}
            className={`px-2.5 py-1 rounded-lg border transition-all ${
              showPcpRecalib
                ? 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/30 font-bold'
                : 'text-slate-400 border-slate-200 dark:border-slate-800'
            }`}
          >
            PCP-Net SGP
          </button>
          <button
            onClick={() => setShowRdpVertices(!showRdpVertices)}
            className={`px-2.5 py-1 rounded-lg border transition-all ${
              showRdpVertices
                ? 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30 font-bold'
                : 'text-slate-400 border-slate-200 dark:border-slate-800'
            }`}
          >
            RDP (ε=2.0px) Vertices
          </button>
        </div>

        {/* Reset & Zoom */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleResetVertices}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs flex items-center gap-1"
            title="Reset Polygon Vertices to Original CAD"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          <div className="flex items-center gap-1 text-slate-500">
            <button
              onClick={() => setZoomLevel((p) => Math.max(60, p - 15))}
              className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono text-[11px] w-10 text-center">{zoomLevel}%</span>
            <button
              onClick={() => setZoomLevel((p) => Math.min(160, p + 15))}
              className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Scale Bar Slider & Calibration Controls */}
      <div className="px-4 py-2 bg-sky-50/70 dark:bg-slate-950/70 border-b border-sky-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-2">
          <Ruler className="w-4 h-4 text-sky-600 dark:text-sky-400" />
          <span className="font-semibold text-slate-700 dark:text-slate-300">Scale Calibration:</span>
          <span className="font-bold text-sky-700 dark:text-sky-400">
            s = {activeScaleFactor.toFixed(5)} m/px ({scaleMeters}m = {scalePixels}px)
          </span>
        </div>

        {/* Interactive Slider for s */}
        <div className="flex items-center gap-2">
          <span className="text-slate-400 text-[11px]">Adjust (px):</span>
          <input
            type="range"
            min="180"
            max="320"
            value={scalePixels}
            onChange={(e) => handleScaleChange(Number(e.target.value), scaleMeters)}
            className="w-28 accent-sky-600 cursor-pointer"
          />
          <button
            onClick={() => handleScaleChange(240, 10.0)}
            className="px-2 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-[10px] font-bold"
          >
            Reset (10m = 240px)
          </button>
        </div>
      </div>

      {/* Main CAD Architectural SVG Canvas */}
      <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-slate-950 min-h-[440px]">
        <div
          style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'center center' }}
          className="relative transition-transform duration-100 rounded-lg overflow-hidden border border-slate-800 shadow-2xl bg-[#080D1A]"
        >
          <svg
            ref={svgRef}
            viewBox="0 0 820 420"
            className="w-[740px] h-[380px] select-none"
            onMouseMove={handleSvgMouseMove}
            onMouseUp={handleSvgMouseUp}
          >
            {/* Architectural Grid Lines */}
            <defs>
              <pattern id="archCadGrid" width="30" height="30" patternUnits="userSpaceOnUse">
                <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.8" />
              </pattern>
            </defs>
            <rect width="820" height="420" fill="url(#archCadGrid)" />

            {/* RMBG-1.4 Structural Load-Bearing Wall Mask */}
            {showRmbgWalls && (
              <g stroke="#64748B" strokeWidth="6" fill="none" opacity="0.85" strokeLinecap="square">
                {/* Exterior Perimeter */}
                <rect x="25" y="25" width="770" height="365" />
                {/* Central Corridor Divider */}
                <line x1="25" y1="220" x2="795" y2="220" />
                {/* Vertical Structural Columns */}
                <line x1="230" y1="25" x2="230" y2="390" />
                <line x1="430" y1="25" x2="430" y2="390" />
                <line x1="610" y1="25" x2="610" y2="390" />
              </g>
            )}

            {/* Render Each Interactive Room Polygon */}
            {evaluatedRooms.map((room) => {
              const isSelected = room.id === effectiveSelectedRoomId;
              const isInflated = room.status === 'INFLATED_LABEL';
              const pointsStr = room.points.map((p) => `${p[0]},${p[1]}`).join(' ');

              // Center point for text label
              const avgX = room.points.reduce((acc, p) => acc + p[0], 0) / room.points.length;
              const avgY = room.points.reduce((acc, p) => acc + p[1], 0) / room.points.length;

              let fillColor = 'rgba(56, 189, 248, 0.16)';
              let strokeColor = '#38BDF8';

              if (isInflated) {
                fillColor = 'rgba(239, 68, 68, 0.25)';
                strokeColor = '#EF4444';
              } else if (room.category === 'ADA') {
                fillColor = 'rgba(129, 140, 248, 0.16)';
                strokeColor = '#818CF8';
              } else if (room.category === 'AMA') {
                fillColor = 'rgba(16, 185, 129, 0.16)';
                strokeColor = '#10B981';
              } else if (room.category === 'ACA') {
                fillColor = 'rgba(245, 158, 11, 0.14)';
                strokeColor = '#F59E0B';
              }

              return (
                <g key={room.id} className="cursor-pointer">
                  {/* Mask2Former Instance Polygon Fill */}
                  {showMask2Former && (
                    <polygon
                      points={pointsStr}
                      fill={fillColor}
                      stroke={strokeColor}
                      strokeWidth={isSelected ? 2.8 : 1.4}
                      strokeDasharray={isInflated ? '4 2' : 'none'}
                      onClick={() => {
                        setSelectedRoomId(room.id);
                        if (onSelectRoom) onSelectRoom(room.id);
                      }}
                      className="transition-all hover:fill-opacity-50"
                    />
                  )}

                  {/* PCP-Net SGP Boundary Recalibration (Dashed inner boundary) */}
                  {showPcpRecalib && (
                    <polygon
                      points={pointsStr}
                      fill="none"
                      stroke="rgba(255, 255, 255, 0.25)"
                      strokeWidth="1"
                      strokeDasharray="2 2"
                    />
                  )}

                  {/* Room Text Labels */}
                  <text
                    x={avgX}
                    y={avgY - 12}
                    textAnchor="middle"
                    fill="#FFFFFF"
                    fontSize="11"
                    fontFamily="Plus Jakarta Sans"
                    fontWeight="bold"
                    pointerEvents="none"
                  >
                    {room.name.length > 20 ? room.name.slice(0, 18) + '...' : room.name}
                  </text>
                  <text
                    x={avgX}
                    y={avgY + 4}
                    textAnchor="middle"
                    fill={isInflated ? '#FDA4AF' : '#94A3B8'}
                    fontSize="9.5"
                    fontFamily="JetBrains Mono"
                    pointerEvents="none"
                  >
                    Text: {room.declaredAreaSqm.toFixed(1)} m² | CV: {room.computedAreaSqm.toFixed(1)} m²
                  </text>
                  <text
                    x={avgX}
                    y={avgY + 20}
                    textAnchor="middle"
                    fill={isInflated ? '#EF4444' : '#34D399'}
                    fontSize="9"
                    fontFamily="JetBrains Mono"
                    fontWeight="bold"
                    pointerEvents="none"
                  >
                    {isInflated
                      ? `⚠ SHORTFALL (${room.inflationRatioPct}%)`
                      : `✓ COMPLIANT (Norm: ${room.aphNormSqm.toFixed(0)})`}
                  </text>

                  {/* RDP Corner Vertices Handles (Draggable) */}
                  {showRdpVertices &&
                    isSelected &&
                    room.points.map((pt, vIdx) => (
                      <g key={vIdx}>
                        <circle
                          cx={pt[0]}
                          cy={pt[1]}
                          r={6}
                          fill="#FACC15"
                          stroke="#1E293B"
                          strokeWidth={2}
                          className="cursor-move hover:scale-125 transition-transform"
                          onMouseDown={(e) => handleVertexMouseDown(e, room.id, vIdx)}
                        />
                        <text
                          x={pt[0]}
                          y={pt[1] - 8}
                          fontSize="8"
                          fontFamily="JetBrains Mono"
                          fill="#FACC15"
                          textAnchor="middle"
                          pointerEvents="none"
                        >
                          v{vIdx + 1}
                        </text>
                      </g>
                    ))}
                </g>
              );
            })}

            {/* Scale Bar on SVG */}
            <g transform="translate(40, 395)">
              <line x1="0" y1="0" x2={scalePixels * 0.5} y2="0" stroke="#FFFFFF" strokeWidth="2.5" />
              <line x1="0" y1="-4" x2="0" y2="4" stroke="#FFFFFF" strokeWidth="2" />
              <line x1={scalePixels * 0.25} y1="-3" x2={scalePixels * 0.25} y2="3" stroke="#FFFFFF" strokeWidth="1.5" />
              <line x1={scalePixels * 0.5} y1="-4" x2={scalePixels * 0.5} y2="4" stroke="#FFFFFF" strokeWidth="2" />
              <text x="0" y="14" fill="#94A3B8" fontSize="8" fontFamily="JetBrains Mono">
                0m
              </text>
              <text x={scalePixels * 0.25} y="14" textAnchor="middle" fill="#94A3B8" fontSize="8" fontFamily="JetBrains Mono">
                {(scaleMeters / 2).toFixed(1)}m
              </text>
              <text x={scalePixels * 0.5} y="14" textAnchor="middle" fill="#38BDF8" fontSize="8" fontFamily="JetBrains Mono" fontWeight="bold">
                {scaleMeters.toFixed(1)}m
              </text>
            </g>
          </svg>
        </div>
      </div>

      {/* Bottom Cross-Modal Discrepancy Table */}
      <div className="p-3 border-t border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 text-xs">
        <div className="flex items-center justify-between mb-2">
          <span className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[10px]">
            Live Shoelace Geometric Calculation vs APH 2024–27 Norm:
          </span>
          {activeRoom.status === 'INFLATED_LABEL' && (
            <span className="px-2 py-0.5 rounded bg-red-600 text-white font-mono text-[10px] font-bold animate-pulse">
              FLAG: BLUEPRINT_AREA_INFLATION &gt; 5%
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[11px] text-center">
          <div className="p-2 rounded bg-slate-100 dark:bg-slate-800">
            <span className="text-slate-400 block text-[9.5px]">Printed Text Label</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">{activeRoom.declaredAreaSqm.toFixed(1)} m²</span>
          </div>
          <div className="p-2 rounded bg-slate-100 dark:bg-slate-800">
            <span className="text-slate-400 block text-[9.5px]">Portal Claimed Area</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">{activeRoom.declaredAreaSqm.toFixed(1)} m²</span>
          </div>
          <div className="p-2 rounded bg-slate-100 dark:bg-slate-800">
            <span className="text-slate-400 block text-[9.5px]">CV Shoelace Area</span>
            <span
              className={`font-bold ${
                activeRoom.status === 'INFLATED_LABEL' ? 'text-red-600 dark:text-red-400' : 'text-emerald-600'
              }`}
            >
              {activeRoom.computedAreaSqm.toFixed(1)} m²
            </span>
          </div>
          <div className="p-2 rounded bg-slate-100 dark:bg-slate-800">
            <span className="text-slate-400 block text-[9.5px]">APH Chapter VII Norm</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">{activeRoom.aphNormSqm.toFixed(1)} m²</span>
          </div>
        </div>
      </div>
    </div>
  );
}
