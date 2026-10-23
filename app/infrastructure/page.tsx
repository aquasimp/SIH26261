'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/lib/context';
import { MOCK_APPLICATIONS, BlueprintRoom } from '@/lib/mock-data';
import { calculateBuiltUpNorms, calculateShoelaceArea } from '@/lib/aph-engine';
import { toast } from 'sonner';
import {
  Layers,
  Maximize2,
  Ruler,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  MapPin,
  Camera,
  Compass,
  Building,
  RefreshCw,
} from 'lucide-react';

export default function InfrastructureStudioPage() {
  const { t, language } = useLanguage();

  // Selected college (default to Apex Institute which has the inflated VLSI lab)
  const application = MOCK_APPLICATIONS[0];

  // Scale calibration state: default 240px = 10.0m -> s = 10.0 / 240 = 0.04167 m/px
  const [scalePixels, setScalePixels] = useState<number>(240);
  const [scaleMeters, setScaleMeters] = useState<number>(10.0);
  const scaleFactor = scaleMeters / scalePixels; // meters per pixel

  // Active layer visibility in CAD viewer
  const [showWalls, setShowWalls] = useState<boolean>(true);
  const [showInaRooms, setShowInaRooms] = useState<boolean>(true);
  const [showAdaRooms, setShowAdaRooms] = useState<boolean>(true);
  const [showAmaRooms, setShowAmaRooms] = useState<boolean>(true);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>('RM-103');

  // What-If Simulator sliders
  const [ugIntake, setUgIntake] = useState<number>(360);
  const [pgIntake, setPgIntake] = useState<number>(60);
  const [fsiNorm, setFsiNorm] = useState<number>(2.0);
  const [labSharingPct, setLabSharingPct] = useState<number>(15);

  const whatIfResults = calculateBuiltUpNorms(
    ugIntake,
    4,
    pgIntake,
    2,
    'Urban',
    fsiNorm,
    labSharingPct / 100
  );

  // Recomputed rooms with active scale factor
  const calibratedRooms: BlueprintRoom[] = application.blueprintRooms.map((room) => {
    // If it's the inflated VLSI lab, polygon width is 110px, height is 100px
    // Raw polygon area in px: width * height = 11,000 px^2
    // With s = 0.04167 m/px: area = 11,000 * (0.04167)^2 = 19.1 m^2? Or scaled coordinate system:
    // We adjust proportionally to scaleFactor relative to baseline 0.04167
    const ratio = scaleFactor / 0.04167;
    const dynamicShoelaceArea = Math.round(room.computedAreaSqm * (ratio * ratio) * 10) / 10;
    const isInflated = room.status === 'INFLATED_LABEL' || dynamicShoelaceArea < room.aphNormSqm;

    return {
      ...room,
      computedAreaSqm: dynamicShoelaceArea,
      status: isInflated && room.status !== 'COMPLIANT' ? 'INFLATED_LABEL' : room.status,
    };
  });

  const selectedRoom = calibratedRooms.find((r) => r.id === selectedRoomId);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Architectural Blueprint &{' '}
          <span className="font-serif italic font-normal text-sky-700 dark:text-sky-400">
            Campus Audit Studio
          </span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Mask2Former CAD polygon vectorization, scale bar calibration, Shoelace area audit, and GPS cadastral checks
        </p>
      </div>

      {/* Main Grid: CAD Blueprint Viewer & Discrepancy Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left (7 cols): Interactive Blueprint CAD Canvas */}
        <div className="lg:col-span-7 liquid-glass-card rounded-2xl p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                <span>Mask2Former Vector Blueprint Inspector</span>
              </h2>
              <p className="text-xs text-slate-400">
                Click any room polygon to inspect CV area vs. APH Chapter VII norm
              </p>
            </div>

            {/* Layer Toggles */}
            <div className="flex items-center gap-2 text-xs font-semibold">
              <button
                onClick={() => setShowInaRooms(!showInaRooms)}
                className={`px-2.5 py-1 rounded-lg border transition-all ${
                  showInaRooms
                    ? 'bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/30'
                    : 'text-slate-400 border-slate-200 dark:border-slate-800'
                }`}
              >
                INA (Labs/Class)
              </button>
              <button
                onClick={() => setShowAdaRooms(!showAdaRooms)}
                className={`px-2.5 py-1 rounded-lg border transition-all ${
                  showAdaRooms
                    ? 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/30'
                    : 'text-slate-400 border-slate-200 dark:border-slate-800'
                }`}
              >
                ADA (Admin)
              </button>
              <button
                onClick={() => setShowAmaRooms(!showAmaRooms)}
                className={`px-2.5 py-1 rounded-lg border transition-all ${
                  showAmaRooms
                    ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30'
                    : 'text-slate-400 border-slate-200 dark:border-slate-800'
                }`}
              >
                AMA (Amenities)
              </button>
            </div>
          </div>

          {/* Interactive Blueprint SVG Display */}
          <div className="relative w-full h-[400px] bg-slate-950 rounded-xl overflow-hidden border border-slate-800 shadow-inner flex items-center justify-center p-4">
            <svg
              className="w-full h-full"
              viewBox="0 0 620 300"
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Background blueprint grid */}
              <defs>
                <pattern id="cadGridInfra" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(30, 41, 59, 0.6)" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="620" height="300" fill="url(#cadGridInfra)" />

              {/* Outer structural perimeter walls */}
              {showWalls && (
                <rect
                  x="20"
                  y="20"
                  width="580"
                  height="240"
                  fill="none"
                  stroke="#475569"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
              )}

              {/* Corridor Line */}
              <line x1="20" y1="150" x2="600" y2="150" stroke="#334155" strokeWidth="4" strokeDasharray="4 2" />

              {/* Render Room Polygons */}
              {calibratedRooms.map((room) => {
                const isSelected = selectedRoomId === room.id;
                const isInflated = room.status === 'INFLATED_LABEL';
                const isUndersized = room.status === 'UNDERSIZED';

                // Check category filter
                if (room.category === 'INA' && !showInaRooms) return null;
                if (room.category === 'ADA' && !showAdaRooms) return null;
                if (room.category === 'AMA' && !showAmaRooms) return null;

                let fillColor = 'rgba(56, 189, 248, 0.15)';
                let strokeColor = '#38BDF8';
                if (isInflated || isUndersized) {
                  fillColor = 'rgba(239, 68, 68, 0.25)';
                  strokeColor = '#EF4444';
                } else if (room.category === 'ADA') {
                  fillColor = 'rgba(99, 102, 241, 0.15)';
                  strokeColor = '#6366F1';
                } else if (room.category === 'AMA') {
                  fillColor = 'rgba(16, 185, 129, 0.15)';
                  strokeColor = '#10B981';
                }

                return (
                  <g
                    key={room.id}
                    onClick={() => setSelectedRoomId(room.id)}
                    className="cursor-pointer group"
                  >
                    <rect
                      x={room.x}
                      y={room.y}
                      width={room.width}
                      height={room.height}
                      fill={fillColor}
                      stroke={strokeColor}
                      strokeWidth={isSelected ? 3 : 1.5}
                      strokeDasharray={isInflated ? '4 2' : 'none'}
                      className="transition-all hover:fill-opacity-50"
                    />
                    <text
                      x={(room.x || 0) + (room.width || 0) / 2}
                      y={(room.y || 0) + (room.height || 0) / 2 - 6}
                      textAnchor="middle"
                      fill="#FFFFFF"
                      fontSize="9"
                      fontFamily="JetBrains Mono"
                      fontWeight="bold"
                    >
                      {room.name.length > 18 ? room.name.slice(0, 16) + '...' : room.name}
                    </text>
                    <text
                      x={(room.x || 0) + (room.width || 0) / 2}
                      y={(room.y || 0) + (room.height || 0) / 2 + 10}
                      textAnchor="middle"
                      fill={isInflated ? '#FCA5A5' : '#94A3B8'}
                      fontSize="8"
                      fontFamily="JetBrains Mono"
                    >
                      {room.computedAreaSqm.toFixed(1)} m² {isInflated ? '(SHORTFALL)' : ''}
                    </text>
                  </g>
                );
              })}

              {/* Graphic Scale Bar */}
              <g transform="translate(30, 275)">
                <line x1="0" y1="0" x2={scalePixels * 0.5} y2="0" stroke="#FFFFFF" strokeWidth="2.5" />
                <line x1="0" y1="-4" x2="0" y2="4" stroke="#FFFFFF" strokeWidth="2.5" />
                <line x1={scalePixels * 0.25} y1="-3" x2={scalePixels * 0.25} y2="3" stroke="#FFFFFF" strokeWidth="1.5" />
                <line x1={scalePixels * 0.5} y1="-4" x2={scalePixels * 0.5} y2="4" stroke="#FFFFFF" strokeWidth="2.5" />
                <text x="0" y="12" fill="#94A3B8" fontSize="8" fontFamily="JetBrains Mono">0m</text>
                <text x={scalePixels * 0.25} y="12" textAnchor="middle" fill="#94A3B8" fontSize="8" fontFamily="JetBrains Mono">
                  {(scaleMeters / 2).toFixed(1)}m
                </text>
                <text x={scalePixels * 0.5} y="12" textAnchor="middle" fill="#38BDF8" fontSize="8" fontFamily="JetBrains Mono" fontWeight="bold">
                  {scaleMeters}m ({scalePixels}px → s = {scaleFactor.toFixed(5)} m/px)
                </text>
              </g>
            </svg>
          </div>

          {/* Interactive Scale Bar Calibrator Controls */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
            <div className="flex items-center gap-2">
              <Ruler className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              <span className="font-bold text-slate-800 dark:text-slate-200">Scale Calibration:</span>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400">Pixels (L_px):</span>
                <input
                  type="number"
                  value={scalePixels}
                  onChange={(e) => setScalePixels(Math.max(50, Number(e.target.value)))}
                  className="w-16 px-2 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 font-bold"
                />
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-slate-400">Meters (L_m):</span>
                <input
                  type="number"
                  step="0.5"
                  value={scaleMeters}
                  onChange={(e) => setScaleMeters(Math.max(1, Number(e.target.value)))}
                  className="w-16 px-2 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 font-bold"
                />
              </div>

              <span className="text-sky-700 dark:text-sky-400 font-bold">
                s = {scaleFactor.toFixed(5)} m/px
              </span>
            </div>
          </div>
        </div>

        {/* Right (5 cols): Discrepancy Table & Selected Room Details */}
        <div className="lg:col-span-5 space-y-4">
          {/* Selected Room Details Card */}
          {selectedRoom && (
            <div className={`liquid-glass-card rounded-2xl p-4 border transition-all ${
              selectedRoom.status === 'INFLATED_LABEL'
                ? 'border-red-300 dark:border-red-900/60 bg-red-50/70 dark:bg-red-950/20 shadow-2xs'
                : 'border-slate-200/90 dark:border-slate-700'
            }`}>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    {selectedRoom.name}
                  </h3>
                  <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 mt-0.5">
                    ID: {selectedRoom.id} • Zone: {selectedRoom.category} (Instructional)
                  </div>
                </div>

                <span
                  className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded-md ${
                    selectedRoom.status === 'INFLATED_LABEL'
                      ? 'bg-red-600 text-white'
                      : 'bg-emerald-600 text-white'
                  }`}
                >
                  {selectedRoom.status === 'INFLATED_LABEL' ? 'INFLATED AREA LABEL' : 'COMPLIANT'}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 mt-3 font-mono text-xs text-center">
                <div className="p-2 rounded-lg bg-white/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700">
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">Blueprint Text</div>
                  <div className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                    {selectedRoom.declaredAreaSqm.toFixed(1)} m²
                  </div>
                </div>

                <div className="p-2 rounded-lg bg-white/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700">
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">CV Shoelace</div>
                  <div className={`font-bold mt-0.5 ${selectedRoom.status === 'INFLATED_LABEL' ? 'text-red-600 dark:text-red-400' : 'text-slate-800 dark:text-slate-200'}`}>
                    {selectedRoom.computedAreaSqm.toFixed(1)} m²
                  </div>
                </div>

                <div className="p-2 rounded-lg bg-white/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700">
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">APH Norm</div>
                  <div className="font-bold text-emerald-700 dark:text-emerald-400 mt-0.5">
                    {selectedRoom.aphNormSqm.toFixed(1)} m²
                  </div>
                </div>
              </div>

              {selectedRoom.status === 'INFLATED_LABEL' && (
                <div className="mt-3 p-2.5 rounded-lg bg-red-100/80 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-xs text-red-700 dark:text-red-300 space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    <span>APH Chapter VII Clause 7.1 Deficiency Detected</span>
                  </div>
                  <p className="text-[11px] leading-snug">
                    Text label on blueprint claims {selectedRoom.declaredAreaSqm.toFixed(1)} m² to falsely satisfy AICTE lab norms, but calibrated Shoelace polygon measures only {selectedRoom.computedAreaSqm.toFixed(1)} m² ({selectedRoom.declaredAreaSqm > 0 ? Math.max(0, ((1 - selectedRoom.computedAreaSqm / selectedRoom.declaredAreaSqm) * 100)).toFixed(1) : '0.0'}% shortfall).
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Cross-Modal Discrepancy Table */}
          <div className="liquid-glass-card rounded-2xl p-4 space-y-3">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-600 dark:text-slate-400">
              Cross-Modal Area Discrepancy Breakdown
            </h3>


            <div className="overflow-x-auto max-h-64 overflow-y-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-[10px] text-slate-400">
                    <th className="py-1.5 px-2">Facility</th>
                    <th className="py-1.5 px-2">Text Label</th>
                    <th className="py-1.5 px-2">CV Area</th>
                    <th className="py-1.5 px-2 text-right">Variance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {calibratedRooms.map((room) => {
                    const variancePct = Math.round(
                      ((room.computedAreaSqm - room.declaredAreaSqm) / room.declaredAreaSqm) * 100
                    );
                    const isDiscrepant = variancePct < -5;

                    return (
                      <tr
                        key={room.id}
                        onClick={() => setSelectedRoomId(room.id)}
                        className={`cursor-pointer hover:bg-slate-100/60 dark:hover:bg-slate-800/60 ${
                          selectedRoomId === room.id ? 'bg-sky-50 dark:bg-slate-800' : ''
                        }`}
                      >
                        <td className="py-2 px-2 font-medium truncate max-w-[120px]">
                          {room.name}
                        </td>
                        <td className="py-2 px-2 text-slate-600 dark:text-slate-400">
                          {room.declaredAreaSqm.toFixed(1)} m²
                        </td>
                        <td className={`py-2 px-2 font-bold ${isDiscrepant ? 'text-red-600' : 'text-slate-800 dark:text-slate-200'}`}>
                          {room.computedAreaSqm.toFixed(1)} m²
                        </td>
                        <td className={`py-2 px-2 text-right font-bold ${isDiscrepant ? 'text-red-600' : 'text-emerald-600'}`}>
                          {variancePct > 0 ? `+${variancePct}%` : `${variancePct}%`}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: What-If FSI/FAR Simulator & Geotagged Cadastral Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive What-If FSI/FAR Simulator (7 cols) */}
        <div className="lg:col-span-7 liquid-glass-card rounded-2xl p-5 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              <span>Interactive What-If FSI/FAR & Intake Simulator</span>
            </h3>
            <p className="text-xs text-slate-400">
              Dynamically model APH 2024–27 Chapter VII area thresholds under varying student intake and municipal FSI
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            {/* UG Intake Slider */}
            <div className="space-y-1.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700">
              <div className="flex justify-between">
                <span className="text-slate-500">UG Annual Intake:</span>
                <span className="font-bold text-sky-600">{ugIntake} students/yr</span>
              </div>
              <input
                type="range"
                min="120"
                max="960"
                step="60"
                value={ugIntake}
                onChange={(e) => setUgIntake(Number(e.target.value))}
                className="w-full accent-sky-600"
              />
            </div>

            {/* PG Intake Slider */}
            <div className="space-y-1.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700">
              <div className="flex justify-between">
                <span className="text-slate-500">PG Annual Intake:</span>
                <span className="font-bold text-sky-600">{pgIntake} students/yr</span>
              </div>
              <input
                type="range"
                min="0"
                max="240"
                step="30"
                value={pgIntake}
                onChange={(e) => setPgIntake(Number(e.target.value))}
                className="w-full accent-sky-600"
              />
            </div>

            {/* Municipal FSI Slider */}
            <div className="space-y-1.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700">
              <div className="flex justify-between">
                <span className="text-slate-500">Municipal FSI / FAR:</span>
                <span className="font-bold text-sky-600">{fsiNorm.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="4.0"
                step="0.5"
                value={fsiNorm}
                onChange={(e) => setFsiNorm(Number(e.target.value))}
                className="w-full accent-sky-600"
              />
            </div>

            {/* Allied Lab Sharing Slider */}
            <div className="space-y-1.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700">
              <div className="flex justify-between">
                <span className="text-slate-500">Allied Lab Sharing (max 30%):</span>
                <span className="font-bold text-sky-600">{labSharingPct}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="30"
                step="5"
                value={labSharingPct}
                onChange={(e) => setLabSharingPct(Number(e.target.value))}
                className="w-full accent-sky-600"
              />
            </div>
          </div>

          {/* Computed Results */}
          <div className="p-3.5 rounded-xl bg-sky-50 dark:bg-slate-800 border border-sky-200 dark:border-slate-700 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center font-mono">
            <div>
              <div className="text-[10px] text-slate-400">Total Built-up (TB_req)</div>
              <div className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                {whatIfResults.totalBuiltUpRequiredSqm.toLocaleString()} m²
              </div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400">Instructional (INA)</div>
              <div className="text-base font-bold text-sky-600 mt-0.5">
                {whatIfResults.inaRequiredSqm.toLocaleString()} m²
              </div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400">Circulation (ACA)</div>
              <div className="text-base font-bold text-indigo-600 mt-0.5">
                {whatIfResults.acaRequiredSqm.toLocaleString()} m²
              </div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400">Min Land Area</div>
              <div className="text-base font-bold text-emerald-600 mt-0.5">
                {whatIfResults.landRequiredAcres.toFixed(2)} Acres
              </div>
            </div>
          </div>
        </div>

        {/* Right: Geotagged Photos & Cadastral GIS Triangulation (5 cols) */}
        <div className="lg:col-span-5 liquid-glass-card rounded-2xl p-5 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Camera className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              <span>Campus Geotag & Cadastral Triangulation</span>
            </h3>
            <p className="text-xs text-slate-400">
              RT-DETR equipment recognition, pHash cross-campus deduplication & GPS Haversine verification
            </p>
          </div>

          <div className="space-y-3 text-xs">
            {/* Cadastral Distance Validation */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex items-center justify-between font-mono">
              <div>
                <div className="font-bold text-slate-800 dark:text-slate-200">Campus Plots Haversine Distance</div>
                <div className="text-[10px] text-slate-400">Plot 1: 28.4595°N, 77.0266°E</div>
              </div>
              <div className="text-right">
                <span className="text-emerald-600 font-bold">d = 0.0 km (Single Plot)</span>
                <span className="block text-[10px] text-slate-400">Compliant (Max 2.0 km)</span>
              </div>
            </div>

            {/* Detected Assets */}
            <div className="space-y-2">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                RT-DETR-Large Lab Asset Detections
              </div>

              <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
                <div className="p-2 rounded-lg bg-white/60 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex justify-between">
                  <span>CNC Milling Workstation:</span>
                  <span className="font-bold text-emerald-600">0.96</span>
                </div>
                <div className="p-2 rounded-lg bg-white/60 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex justify-between">
                  <span>Digital Storage Oscilloscope:</span>
                  <span className="font-bold text-emerald-600">0.94</span>
                </div>
                <div className="p-2 rounded-lg bg-white/60 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex justify-between">
                  <span>Barrier-Free PWD Ramp:</span>
                  <span className="font-bold text-emerald-600">0.91</span>
                </div>
                <div className="p-2 rounded-lg bg-white/60 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex justify-between">
                  <span>Fire Hydrant Reel:</span>
                  <span className="font-bold text-emerald-600">0.97</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
