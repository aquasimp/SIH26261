'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/lib/context';
import { MOCK_APPLICATIONS } from '@/lib/mock-data';
import {
  calculateBuiltUpNorms,
  calculateFacultyNorms,
  calculateHaversineDistance,
  validateMultiPlotContiguity,
  CampusPlot,
} from '@/lib/aph-engine';
import { BlueprintVectorViewer } from '@/components/workbench/BlueprintVectorViewer';
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
  Users,
  ShieldAlert,
  ArrowRight,
} from 'lucide-react';

const MOCK_PLOTS: CampusPlot[] = [
  {
    id: 'PLOT-1',
    name: 'Plot 1 (Main Academic & Admin Campus)',
    lat: 28.4595,
    lon: 77.0266,
    areaAcres: 1.85,
    khasraNo: '114/2',
    containsAcademicBuiltUp: true,
    isContiguousToMain: true,
  },
  {
    id: 'PLOT-2',
    name: 'Plot 2 (Sports Ground & Hostel)',
    lat: 28.4682,
    lon: 77.0345,
    areaAcres: 0.85,
    khasraNo: '115/1',
    containsAcademicBuiltUp: false,
    isContiguousToMain: false,
  },
];

export default function InfrastructureStudioPage() {
  const { t, language } = useLanguage();

  // Selected college (default to Apex Institute which has the inflated VLSI lab)
  const application = MOCK_APPLICATIONS[0];

  // Scale calibration state: default 240px = 10.0m -> s = 10.0 / 240 = 0.04167 m/px
  const [scaleFactor, setScaleFactor] = useState<number>(10.0 / 240);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>('RM-103');

  // What-If APH 2024–27 Simulator sliders
  const [ugIntake, setUgIntake] = useState<number>(360);
  const [ugDuration, setUgDuration] = useState<number>(4);
  const [pgIntake, setPgIntake] = useState<number>(60);
  const [pgDuration, setPgDuration] = useState<number>(2);
  const [zoneType, setZoneType] = useState<'Mega/Metro' | 'Urban' | 'Rural'>('Urban');
  const [fsiNorm, setFsiNorm] = useState<number>(2.0);
  const [labSharingPct, setLabSharingPct] = useState<number>(15);
  const [ghostFacultyDeduction, setGhostFacultyDeduction] = useState<number>(4);

  // Exact APH Built-up Area & Land Calculation
  const builtUpResults = calculateBuiltUpNorms(
    ugIntake,
    ugDuration,
    pgIntake,
    pgDuration,
    zoneType,
    fsiNorm,
    labSharingPct / 100
  );

  // Exact APH 1:2:6 Faculty Cadre Calculation
  const facultyResults = calculateFacultyNorms(
    ugIntake,
    ugDuration,
    pgIntake,
    pgDuration,
    application.facultyMetrics.cadreAvailable,
    ghostFacultyDeduction
  );

  // Multi-Plot Contiguity Validation
  const [plots, setPlots] = useState<CampusPlot[]>(MOCK_PLOTS);
  const plotValidation = validateMultiPlotContiguity(plots);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Architectural Blueprint &amp;{' '}
          <span className="font-serif italic font-normal text-sky-700 dark:text-sky-400">
            Campus Audit Studio
          </span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Interactive Shoelace polygon vertex dragging, graphic scale bar calibration, multi-plot Haversine validator, and APH 2024–27 What-If simulator
        </p>
      </div>

      {/* Main Grid: Upgraded CAD Blueprint Viewer */}
      <div className="grid grid-cols-1 gap-6">
        <div className="h-[620px]">
          <BlueprintVectorViewer
            rooms={application.blueprintRooms}
            selectedRoomId={selectedRoomId}
            onSelectRoom={(id) => setSelectedRoomId(id)}
            scaleFactor={scaleFactor}
            onScaleChange={(s) => setScaleFactor(s)}
          />
        </div>
      </div>

      {/* Row 2: Exact APH 2024–27 What-If Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive What-If FSI/FAR & Cadre Simulator (7 cols) */}
        <div className="lg:col-span-7 liquid-glass-card rounded-2xl p-5 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              <span>AICTE APH 2024–27 Chapter VII Deterministic Math Simulator</span>
            </h3>
            <p className="text-xs text-slate-400">
              TB_req = (INA + ADA + AMA) + 0.25*(INA + ADA + AMA), allied lab sharing discount (up to 30%), and 1:2:6 faculty cadre
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

          {/* Computed Built-up Breakdown Results */}
          <div className="p-3.5 rounded-xl bg-sky-50 dark:bg-slate-800 border border-sky-200 dark:border-slate-700 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center font-mono">
            <div>
              <div className="text-[10px] text-slate-400">Total Built-up (TB_req)</div>
              <div className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                {builtUpResults.totalBuiltUpRequiredSqm.toLocaleString()} m²
              </div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400">Instructional (INA)</div>
              <div className="text-base font-bold text-sky-600 mt-0.5">
                {builtUpResults.inaRequiredSqm.toLocaleString()} m²
              </div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400">Circulation (ACA = 0.25)</div>
              <div className="text-base font-bold text-indigo-600 mt-0.5">
                {builtUpResults.acaRequiredSqm.toLocaleString()} m²
              </div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400">Min Land Area</div>
              <div className="text-base font-bold text-emerald-600 mt-0.5">
                {builtUpResults.landRequiredAcres.toFixed(2)} Acres
              </div>
            </div>
          </div>

          {/* Faculty 1:2:6 Cadre & Ghost Deduction Simulator */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-sky-600" />
                <span>1:2:6 Cadre Ratio &amp; Concurrent Ghost Faculty Deduction:</span>
              </span>
              <div className="flex items-center gap-2 font-mono text-[11px]">
                <span className="text-slate-400">Ghost Deduction:</span>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={ghostFacultyDeduction}
                  onChange={(e) => setGhostFacultyDeduction(Number(e.target.value))}
                  className="w-12 px-1.5 py-0.5 rounded border border-slate-300 dark:border-slate-700 text-center font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2 text-center font-mono text-xs">
              <div className="p-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] text-slate-400 block">Total Required</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {facultyResults.requiredFacultyTotal} Faculty
                </span>
              </div>
              <div className="p-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] text-slate-400 block">Professors (F/9)</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {facultyResults.requiredProfessors}
                </span>
              </div>
              <div className="p-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] text-slate-400 block">Assoc. (2F/9)</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {facultyResults.requiredAssociateProfessors}
                </span>
              </div>
              <div className="p-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] text-slate-400 block">Asst. (Rem)</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {facultyResults.requiredAssistantProfessors}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Multi-Plot Haversine Validator & RT-DETR Recognition (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Multi-Plot Haversine Contiguity Validator */}
          <div className="liquid-glass-card rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>Multi-Plot Haversine &amp; Contiguity Validator</span>
              </h3>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                  plotValidation.isCompliant
                    ? 'bg-emerald-500/10 text-emerald-600'
                    : 'bg-red-500/10 text-red-600'
                }`}
              >
                {plotValidation.isCompliant ? 'APH COMPLIANT' : 'VIOLATION DETECTED'}
              </span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              {plots.map((p, idx) => (
                <div
                  key={p.id}
                  className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between"
                >
                  <div>
                    <div className="font-bold text-slate-800 dark:text-slate-200">{p.name}</div>
                    <div className="text-[10px] text-slate-400">
                      Khasra #{p.khasraNo} • {p.areaAcres} Acres • ({p.lat.toFixed(4)}°N, {p.lon.toFixed(4)}°E)
                    </div>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-600 font-bold">
                    {p.containsAcademicBuiltUp ? 'Academic Hub' : 'Amenities/Hostel'}
                  </span>
                </div>
              ))}

              <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-slate-900 border border-emerald-200 dark:border-slate-700 flex justify-between items-center text-[11px]">
                <span className="text-slate-600 dark:text-slate-400">Max Inter-Plot Distance:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  d = {plotValidation.maxDistanceKm} km (Limit ≤ 2.0 km)
                </span>
              </div>
            </div>
          </div>

          {/* RT-DETR-Large Lab Asset Recognition & pHash Deduplication */}
          <div className="liquid-glass-card rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-sky-600" />
                <span>RT-DETR-Large Asset Recognition &amp; pHash</span>
              </h3>
              <span className="text-[10px] font-mono text-slate-400">IoU @ 0.50</span>
            </div>

            <div className="space-y-1.5 font-mono text-xs">
              {[
                { asset: 'CNC 5-Axis Milling Machine', conf: 0.962, serial: 'SN-48192-A', phashMatch: 'Clean' },
                { asset: 'Digital Storage Oscilloscope', conf: 0.941, serial: 'TEK-TBS-2000', phashMatch: 'Clean' },
                { asset: 'Barrier-Free Tactile PWD Ramp', conf: 0.915, serial: 'CIVIL-RAMP-01', phashMatch: 'Clean' },
                { asset: '50kL Fire Water Reservoir Pump', conf: 0.978, serial: 'PUMP-DIESEL-88', phashMatch: 'Clean' },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 flex items-center justify-between"
                >
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-200 block text-[11px]">
                      {item.asset}
                    </span>
                    <span className="text-[10px] text-slate-400">Serial: {item.serial}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-emerald-600">{item.conf.toFixed(3)}</span>
                    <span className="block text-[10px] text-slate-400">pHash: {item.phashMatch}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
