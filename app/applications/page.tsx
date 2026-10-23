'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useLanguage, useFilters } from '@/lib/context';
import { InstitutionalApplication } from '@/lib/mock-data';
import { toast } from 'sonner';
import {
  Search,
  Download,
  Building,
  CheckCircle2,
  AlertTriangle,
  ArrowUpDown,
  Filter,
  Eye,
  ChevronRight,
  ChevronDown,
  LayoutGrid,
  List,
  Sparkles,
  Scale,
  X,
  ArrowUpRight,
  ShieldAlert,
  RotateCcw,
  Check,
} from 'lucide-react';

const SYNTHETIC_COLLEGE_NAMES = [
  { en: 'Aryabhata Institute of Quantum Engineering', hi: 'आर्यभट इंस्टीट्यूट ऑफ क्वांटम इंजीनियरिंग' },
  { en: 'Bhaskara Institute of AI & Autonomous Systems', hi: 'भास्कर इंस्टीट्यूट ऑफ एआई एंड ऑटोनॉमस सिस्टम्स' },
  { en: 'Varahamihira Technical Campus for Robotics', hi: 'वराहमिहिर टेक्निकल कैंपस फॉर रोबोटिक्स' },
  { en: 'Kashyap University School of Advanced Computing', hi: 'कश्यप यूनिवर्सिटी स्कूल ऑफ एडवांस्ड कंप्यूटिंग' },
  { en: 'Chanakya Autonomous Engineering Academy', hi: 'चाणक्य ऑटोनॉमस इंजीनियरिंग एकेडमी' },
];

const REGIONS = [
  'North-Western',
  'Southern',
  'Western',
  'South-Western',
  'Eastern',
  'Central',
  'Northern',
  'South-Central',
] as const;

export default function ApplicationsPage() {
  const { t, language } = useLanguage();
  const { applications, setApplications, filteredApplications, filters, setFilters } = useFilters();
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [sortBy, setSortBy] = useState<'rpn' | 'ici' | 'date'>('rpn');

  // Compare 2 Institutions Selection State
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState<boolean>(false);

  // Sorting
  const sortedApplications = useMemo(() => {
    return [...filteredApplications].sort((a, b) => {
      if (sortBy === 'rpn') return b.maxRpn - a.maxRpn;
      if (sortBy === 'ici') return b.iciScore - a.iciScore;
      return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
    });
  }, [filteredApplications, sortBy]);

  // Comparison pair data
  const compareApps = useMemo(() => {
    if (selectedForCompare.length !== 2) return null;
    const appA = applications.find((a) => a.id === selectedForCompare[0]);
    const appB = applications.find((a) => a.id === selectedForCompare[1]);
    if (!appA || !appB) return null;
    return [appA, appB] as const;
  }, [selectedForCompare, applications]);

  const handleToggleCompare = (id: string) => {
    if (selectedForCompare.includes(id)) {
      setSelectedForCompare((prev) => prev.filter((item) => item !== id));
    } else {
      if (selectedForCompare.length >= 2) {
        toast.info('You can compare maximum 2 institutions at a time. Deselect one first.');
        return;
      }
      const updated = [...selectedForCompare, id];
      setSelectedForCompare(updated);
      if (updated.length === 2) {
        toast.success('2 institutions selected! Click "Compare Dossiers" to view matrix.');
      }
    }
  };

  // Simulate New Dossier Ingestion (AICTE-SynDoc-10K Adversarial Generator)
  const handleSimulateSynDocIngestion = () => {
    const randomIdx = Math.floor(Math.random() * SYNTHETIC_COLLEGE_NAMES.length);
    const college = SYNTHETIC_COLLEGE_NAMES[randomIdx];
    const region = REGIONS[Math.floor(Math.random() * REGIONS.length)];
    const randomPid = `1-${Math.floor(1000000000 + Math.random() * 9000000000)}`;
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const newId = `AICTE-2026-SYN-${randomCode}`;

    const isFatalAnomaly = Math.random() > 0.4;
    const rpn = isFatalAnomaly ? Math.floor(750 + Math.random() * 200) : Math.floor(350 + Math.random() * 300);
    const ici = isFatalAnomaly ? Number((35 + Math.random() * 25).toFixed(1)) : Number((72 + Math.random() * 18).toFixed(1));

    const newApp: InstitutionalApplication = {
      id: newId,
      pid: randomPid,
      nameEn: college.en,
      nameHi: college.hi,
      trustName: `${college.en.split(' ')[0]} Shiksha & Research Trust`,
      region,
      state: 'National Capital Region',
      city: 'Institutional Zone',
      zoneType: 'Urban',
      institutionType: 'Private Self-Financed',
      applicationCategory: 'Extension of Approval (EoA)',
      scrutinyStatus: isFatalAnomaly ? 'Fatal Fraud Alert' : 'Deficiency Issued',
      academicYear: '2026-27',
      submittedAt: new Date().toISOString(),
      iciScore: ici,
      fatalGateTriggered: isFatalAnomaly,
      maxRpn: rpn,
      subScores: {
        infra: Number((ici * 0.95).toFixed(1)),
        faculty: Number((ici * 0.9).toFixed(1)),
        legal: Number((ici * 0.85).toFixed(1)),
        authority: Number((ici * 0.9).toFixed(1)),
        financial: Number((ici * 1.05).toFixed(1)),
      },
      landAndBuiltUp: {
        applicableFsi: 2.0,
        totalSanctionedStudentsUG: 1200,
        totalSanctionedStudentsPG: 120,
        inaRequiredSqm: 5760,
        inaAvailableSqm: isFatalAnomaly ? 4600 : 5800,
        adaRequiredSqm: 720,
        adaAvailableSqm: 740,
        amaRequiredSqm: 600,
        amaAvailableSqm: 610,
        acaRequiredSqm: 1770,
        acaAvailableSqm: 1650,
        totalBuiltUpRequiredSqm: 8850,
        totalBuiltUpAvailableSqm: isFatalAnomaly ? 7600 : 8800,
        landRequiredAcres: 2.5,
        landAvailableAcres: isFatalAnomaly ? 2.1 : 2.75,
        plotCount: 1,
        maxInterPlotDistanceKm: 0.0,
      },
      facultyMetrics: {
        requiredTotal: 68,
        availableVerified: isFatalAnomaly ? 48 : 64,
        ghostFlaggedCount: isFatalAnomaly ? 3 : 0,
        cadreRequired: { prof: 7, assoc: 15, asst: 46 },
        cadreAvailable: { prof: isFatalAnomaly ? 2 : 6, assoc: 12, asst: 34 },
        sfrUG: isFatalAnomaly ? '1:27.2' : '1:20.5',
        sfrPG: '1:15.0',
      },
      anomalies: [
        {
          id: `ANOM-SYN-${randomCode}-01`,
          documentId: 'DOC-SYN-01',
          documentTitle: isFatalAnomaly ? 'Fire Safety NOC Certificate' : 'Floor CAD Blueprint',
          category: isFatalAnomaly ? 'FORGERY_SPLICING' : 'BLUEPRINT_AREA',
          severity: isFatalAnomaly ? 'FATAL_FRAUD' : 'MAJOR_DEFICIENCY',
          titleEn: isFatalAnomaly
            ? 'Adversarially Spliced Validity Window (2027 spliced over 2024)'
            : 'Inflated Laboratory Boundary Polygon (48.0 m² actual vs 66.0 m² label)',
          titleHi: isFatalAnomaly
            ? 'अग्नि शमन एनओसी समाप्ति वर्ष में कृत्रिम हेरफेर'
            : 'कंप्यूटर लैब क्षेत्रफल में लेबल मुद्रास्फीति',
          descriptionEn: isFatalAnomaly
            ? 'TruFor Noiseprint++ and DCT BAG analysis localized an adversarial spliced patch altering validity date with 97.4% tamper confidence.'
            : 'Mask2Former Swin-Base Shoelace integration revealed lab carpet area of 48.0 m² against printed label of 66.0 m².',
          descriptionHi: isFatalAnomaly
            ? 'ट्रू-फॉर नॉयसप्रिंट++ विश्लेषण ने 97.4% विश्वास के साथ हेरफेर की पुष्टि की।'
            : 'मास्क2फॉर्मर शूलेस गणना ने क्षेत्रफल में कमी पाई।',
          aphClause: isFatalAnomaly
            ? 'APH 2024-27 Chapter VII & Annexure 16, Clause 2.1'
            : 'APH 2024-27 Chapter VII Clause 7.1',
          modelUsed: isFatalAnomaly ? 'TruFor (CVPR 2023) + NFA-ViT' : 'Mask2Former Swin-Base + Shoelace',
          tamperProbability: isFatalAnomaly ? 0.974 : 0.892,
          confidenceScore: 0.952,
          rpnScore: rpn,
          boundingBox: [60, 40, 85, 48],
          extractedValue: isFatalAnomaly ? 'Valid Until: 30-06-2027' : 'Lab Area: 66.0 m²',
          authorityValue: isFatalAnomaly ? 'State Fire Portal: Expired 30-06-2024' : 'Computed Shoelace: 48.0 m²',
          verificationState: 'MISMATCH_DETECTED',
        },
      ],
      blueprintRooms: applications[0]?.blueprintRooms || [],
      facultyRoster: applications[0]?.facultyRoster || [],
      documents: applications[0]?.documents || [],
    };

    setApplications((prev) => [newApp, ...prev]);
    toast.success(`AICTE-SynDoc-10K: Ingested synthetic adversarial filing ${newId}!`, {
      description: `Generated ${college.en} with ${isFatalAnomaly ? 'Fatal TruFor Splicing' : 'Blueprint Area Deficiency'}.`,
    });
  };

  // Export functions with real browser download triggers
  const handleExportCSV = () => {
    const escapeCsv = (val: string | number | boolean) => `"${String(val).replace(/"/g, '""')}"`;
    const headers = ['ID', 'PID', 'Name', 'Region', 'State', 'Category', 'Status', 'ICI Score', 'Max RPN', 'Fatal Veto'];
    const rows = sortedApplications.map((app) => [
      escapeCsv(app.id),
      escapeCsv(app.pid),
      escapeCsv(app.nameEn),
      escapeCsv(app.region),
      escapeCsv(app.state),
      escapeCsv(app.applicationCategory),
      escapeCsv(app.scrutinyStatus),
      escapeCsv(app.iciScore),
      escapeCsv(app.maxRpn),
      escapeCsv(app.fatalGateTriggered ? 'YES' : 'NO'),
    ]);
    const csvContent = [headers.map(escapeCsv).join(','), ...rows.map((e) => e.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `AICTE_Scrutiny_Registry_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success(`Exported ${sortedApplications.length} filtered registry records to CSV`);
  };

  const handleExportJSON = () => {
    const jsonStr = JSON.stringify(sortedApplications, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `AICTE_Scrutiny_Dossiers_${Date.now()}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success(`Exported ${sortedApplications.length} dossiers to JSON successfully`);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      {/* Top Header & Workstation Action Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] font-bold text-sky-700 dark:text-sky-400 uppercase tracking-widest">
              NATIONAL INSTITUTIONAL DOSSIER REGISTRY
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text-primary)]">
            Institutional Scrutiny{' '}
            <span className="title-serif-italic text-sky-700 dark:text-sky-400">
              Registry
            </span>
          </h1>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Searchable statutory repository across all 8 AICTE regions with 5-component ICI sub-scores and forensic flags
          </p>
        </div>

        {/* Action Controls Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Card / Table view toggle */}
          <div className="inline-flex rounded-lg p-0.5 bg-[var(--glass-bg-subtle)] border border-[var(--glass-border)]">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md transition-all cursor-pointer ${
                viewMode === 'table' ? 'bg-white dark:bg-slate-800 text-sky-700 dark:text-sky-400 shadow-2xs font-bold' : 'text-slate-400 hover:text-slate-600'
              }`}
              title="Table view"
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded-md transition-all cursor-pointer ${
                viewMode === 'cards' ? 'bg-white dark:bg-slate-800 text-sky-700 dark:text-sky-400 shadow-2xs font-bold' : 'text-slate-400 hover:text-slate-600'
              }`}
              title="Card view"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Sort selector */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="appearance-none pl-2.5 pr-7 py-1.5 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-2xs cursor-pointer focus:outline-none font-mono"
            >
              <option value="rpn">Sort: Highest Risk (RPN)</option>
              <option value="ici">Sort: Compliance Index (ICI)</option>
              <option value="date">Sort: Submission Date</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          </div>

          {/* + Simulate New Dossier Ingestion (AICTE-SynDoc-10K) */}
          <button
            onClick={handleSimulateSynDocIngestion}
            className="btn-obsidian inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer"
            title="Generate synthetic adversarial application using AICTE-SynDoc-10K generator"
          >
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            <span>+ Simulate Ingestion (SynDoc-10K)</span>
          </button>

          {/* Export buttons */}
          <button
            onClick={handleExportCSV}
            className="btn-glass-subtle inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer font-mono"
            title="Export filtered registry to CSV"
          >
            <Download className="w-3 h-3 text-slate-500" />
            <span>CSV</span>
          </button>
          <button
            onClick={handleExportJSON}
            className="btn-glass-subtle inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer font-mono"
            title="Export filtered registry to JSON"
          >
            <Download className="w-3 h-3 text-slate-500" />
            <span>JSON</span>
          </button>
        </div>
      </div>

      {/* Quick Search & Compare Indicator Strip */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl liquid-glass-card flex-1">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Filter registry by Institution Name, Permanent ID (PID), City, or Trust..."
            value={filters.searchQuery}
            onChange={(e) => setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))}
            className="w-full bg-transparent text-xs font-medium text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none"
          />
          {filters.searchQuery && (
            <button
              onClick={() => setFilters((prev) => ({ ...prev, searchQuery: '' }))}
              className="text-xs text-slate-400 hover:text-slate-600 font-mono px-1 cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        {/* Compare 2 Institutions Indicator / Button */}
        {selectedForCompare.length > 0 && (
          <div className="p-2 px-3 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-between gap-3 animate-in fade-in shrink-0">
            <div className="text-xs font-mono">
              <span className="font-bold text-sky-700 dark:text-sky-300">
                {selectedForCompare.length} / 2 Selected for Comparison
              </span>
              {selectedForCompare.length === 1 && (
                <span className="text-[10px] text-[var(--text-muted)] block">
                  Select 1 more dossier to unlock comparison matrix
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5">
              <button
                disabled={selectedForCompare.length !== 2}
                onClick={() => setIsCompareModalOpen(true)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer inline-flex items-center gap-1 ${
                  selectedForCompare.length === 2
                    ? 'bg-sky-600 hover:bg-sky-700 text-white shadow-xs'
                    : 'bg-slate-300 dark:bg-slate-700 text-slate-500 cursor-not-allowed opacity-60'
                }`}
              >
                <Scale className="w-3.5 h-3.5" />
                <span>Compare Dossiers</span>
              </button>
              <button
                onClick={() => setSelectedForCompare([])}
                className="p-1 rounded text-slate-400 hover:text-slate-600 cursor-pointer"
                title="Clear comparison selection"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Table View */}
      {viewMode === 'table' ? (
        <div className="liquid-glass-card rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[var(--glass-border)] text-[10px] font-mono font-semibold uppercase tracking-wider text-[var(--text-muted)] bg-[var(--glass-bg-subtle)]">
                  <th className="py-2.5 px-3 w-8 text-center">Cmp</th>
                  <th className="py-2.5 px-3">Application &amp; Institution</th>
                  <th className="py-2.5 px-3">Category &amp; Zone</th>
                  <th className="py-2.5 px-3">ICI &amp; 5-Domain Profile</th>
                  <th className="py-2.5 px-3">Risk (RPN)</th>
                  <th className="py-2.5 px-3">Scrutiny Status</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--glass-border)]">
                {sortedApplications.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-[var(--text-muted)] font-mono text-xs">
                      No applications match the current search or regional criteria.
                    </td>
                  </tr>
                ) : (
                  sortedApplications.map((app) => {
                    const isFatal = app.scrutinyStatus === 'Fatal Fraud Alert';
                    const isCleared = app.scrutinyStatus === 'Auto-Pre-Cleared';
                    const isDeficiency = app.scrutinyStatus === 'Deficiency Issued';
                    const isChecked = selectedForCompare.includes(app.id);

                    return (
                      <tr
                        key={app.id}
                        className={`hover:bg-[var(--glass-bg-elevated)] transition-colors group ${
                          isChecked ? 'bg-sky-500/5' : ''
                        }`}
                      >
                        {/* Compare Checkbox */}
                        <td className="py-3 px-3 text-center">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleToggleCompare(app.id)}
                            className="rounded accent-sky-600 cursor-pointer w-3.5 h-3.5"
                            title="Select to compare side-by-side"
                          />
                        </td>

                        {/* Institution Name & IDs */}
                        <td className="py-3 px-3">
                          <div className="font-semibold text-xs text-[var(--text-primary)] group-hover:text-sky-700 dark:group-hover:text-sky-400 transition-colors">
                            {language === 'hi' ? app.nameHi : app.nameEn}
                          </div>
                          <div className="text-[10px] font-mono text-[var(--text-muted)] flex items-center gap-1.5 mt-0.5">
                            <span className="font-bold text-slate-700 dark:text-slate-300">{app.id}</span>
                            <span>•</span>
                            <span>PID: {app.pid}</span>
                            <span>•</span>
                            <span>{app.city}, {app.state}</span>
                          </div>
                        </td>

                        {/* Category & Region */}
                        <td className="py-3 px-3">
                          <div className="font-medium text-[var(--text-primary)] text-xs">
                            {app.applicationCategory}
                          </div>
                          <div className="text-[10px] text-[var(--text-muted)] font-mono">
                            {app.region} • {app.zoneType} ({app.institutionType.split(' ')[0]})
                          </div>
                        </td>

                        {/* ICI Score & 5-Domain Spark Bar */}
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`font-mono font-bold text-xs ${
                                isFatal
                                  ? 'text-red-600 dark:text-red-400'
                                  : isCleared
                                  ? 'text-emerald-600 dark:text-emerald-400'
                                  : 'text-amber-600 dark:text-amber-400'
                              }`}
                            >
                              {app.iciScore.toFixed(1)}
                            </span>
                            {app.fatalGateTriggered && (
                              <span className="text-[9px] font-mono font-bold px-1 py-0.2 rounded bg-red-600 text-white">
                                FATAL VETO
                              </span>
                            )}
                          </div>

                          {/* 5-Component Spark Bar */}
                          <div className="flex items-center gap-1 mt-1 w-28" title="Infra, Faculty, Legal, Authority, Financial">
                            <div className="h-1 rounded-full bg-sky-500" style={{ width: `${app.subScores.infra}%` }} title={`Infra: ${app.subScores.infra}`} />
                            <div className="h-1 rounded-full bg-indigo-500" style={{ width: `${app.subScores.faculty}%` }} title={`Faculty: ${app.subScores.faculty}`} />
                            <div className="h-1 rounded-full bg-violet-500" style={{ width: `${app.subScores.legal}%` }} title={`Legal: ${app.subScores.legal}`} />
                            <div className="h-1 rounded-full bg-emerald-500" style={{ width: `${app.subScores.authority}%` }} title={`Authority: ${app.subScores.authority}`} />
                            <div className="h-1 rounded-full bg-amber-500" style={{ width: `${app.subScores.financial}%` }} title={`Financial: ${app.subScores.financial}`} />
                          </div>
                        </td>

                        {/* Risk RPN */}
                        <td className="py-3 px-3">
                          <div className="font-mono font-bold text-xs text-slate-800 dark:text-slate-200">
                            RPN {app.maxRpn}
                          </div>
                          <div className="text-[9.5px] text-[var(--text-muted)] font-mono">
                            {app.anomalies.length} Anomaly Triggers
                          </div>
                        </td>

                        {/* Scrutiny Status Pill */}
                        <td className="py-3 px-3">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${
                              isFatal
                                ? 'pill-fatal'
                                : isCleared
                                ? 'pill-verified'
                                : isDeficiency
                                ? 'pill-deficiency'
                                : 'bg-slate-500/10 text-slate-600'
                            }`}
                          >
                            {isFatal && <span className="h-1.5 w-1.5 rounded-full bg-red-600 animate-pulse" />}
                            {app.scrutinyStatus}
                          </span>
                        </td>

                        {/* Action Link */}
                        <td className="py-3 px-3 text-right">
                          <Link
                            href={`/applications/${app.id}`}
                            className="btn-obsidian inline-flex items-center gap-1 px-2.5 py-1 rounded-md font-mono text-[10.5px] font-semibold shadow-2xs"
                          >
                            <Eye className="w-3 h-3" />
                            <span>Workbench</span>
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Cards View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedApplications.map((app) => {
            const isFatal = app.scrutinyStatus === 'Fatal Fraud Alert';
            const isCleared = app.scrutinyStatus === 'Auto-Pre-Cleared';
            const isDeficiency = app.scrutinyStatus === 'Deficiency Issued';
            const isChecked = selectedForCompare.includes(app.id);

            return (
              <div
                key={app.id}
                className={`liquid-glass-card rounded-2xl p-4 flex flex-col justify-between space-y-3 transition-all ${
                  isFatal
                    ? 'top-rule-fatal'
                    : isCleared
                    ? 'top-rule-verified'
                    : 'top-rule-deficiency'
                } ${isChecked ? 'ring-2 ring-sky-500 shadow-md' : ''}`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span
                      className={`text-[9.5px] font-mono font-bold px-2 py-0.5 rounded ${
                        isFatal
                          ? 'pill-fatal'
                          : isCleared
                          ? 'pill-verified'
                          : 'pill-deficiency'
                      }`}
                    >
                      {app.scrutinyStatus}
                    </span>

                    <div className="flex items-center gap-2">
                      <label className="flex items-center gap-1 text-[10px] font-mono text-[var(--text-muted)] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleCompare(app.id)}
                          className="rounded accent-sky-600 cursor-pointer"
                        />
                        <span>Compare</span>
                      </label>
                      <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200">
                        RPN {app.maxRpn}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-[var(--text-primary)] mt-2 line-clamp-1">
                    {language === 'hi' ? app.nameHi : app.nameEn}
                  </h3>
                  <p className="text-[10px] text-[var(--text-muted)] font-mono mt-0.5">
                    {app.id} • {app.city}, {app.state}
                  </p>

                  <div className="mt-2.5 p-2 rounded-lg bg-[var(--glass-bg-subtle)] border border-[var(--glass-border)] flex items-center justify-between text-xs font-mono">
                    <div>
                      <div className="text-[9px] uppercase text-[var(--text-faint)] font-bold">ICI Score</div>
                      <div className="text-base font-bold text-[var(--text-primary)] flex items-center gap-1">
                        <span>{app.iciScore.toFixed(1)}</span>
                        {app.fatalGateTriggered && (
                          <span className="text-[8.5px] px-1 rounded bg-red-600 text-white font-bold">
                            VETO
                          </span>
                        )}
                      </div>
                    </div>
                    <div>
                      <div className="text-[9px] uppercase text-[var(--text-faint)] font-bold">Total Built-up</div>
                      <div className="text-xs font-bold text-[var(--text-secondary)]">
                        {app.landAndBuiltUp.totalBuiltUpAvailableSqm.toLocaleString()} m²
                      </div>
                    </div>
                  </div>

                  {/* 5-Component Spark Bar */}
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-[9px] text-[var(--text-faint)] font-mono mb-1">
                      <span>5-COMP ICI</span>
                      <span>Infra • Fac • Leg • Auth • Fin</span>
                    </div>
                    <div className="flex items-center gap-1 w-full">
                      <div className="h-1 rounded-full bg-sky-500" style={{ width: `${app.subScores.infra}%` }} />
                      <div className="h-1 rounded-full bg-indigo-500" style={{ width: `${app.subScores.faculty}%` }} />
                      <div className="h-1 rounded-full bg-violet-500" style={{ width: `${app.subScores.legal}%` }} />
                      <div className="h-1 rounded-full bg-emerald-500" style={{ width: `${app.subScores.authority}%` }} />
                      <div className="h-1 rounded-full bg-amber-500" style={{ width: `${app.subScores.financial}%` }} />
                    </div>
                  </div>
                </div>

                <Link
                  href={`/applications/${app.id}`}
                  className="btn-obsidian w-full inline-flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Open Scrutiny Workbench</span>
                </Link>
              </div>
            );
          })}
        </div>
      )}

      {/* =========================================================================
          COMPARATIVE REGULATORY & FORENSIC MATRIX MODAL
          (Side-by-side comparison of 2 selected institutions)
          ========================================================================= */}
      {isCompareModalOpen && compareApps && (
        <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="liquid-glass-card rounded-2xl max-w-5xl w-full max-h-[92vh] overflow-y-auto p-5 space-y-4 shadow-2xl border border-[var(--glass-border-strong)]">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[var(--glass-border)] pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.2 rounded bg-sky-600 text-white font-mono text-[9.5px] font-bold">
                    SIDE-BY-SIDE STATUTORY COMPARISON MATRIX
                  </span>
                  <span className="text-xs font-mono text-[var(--text-muted)]">
                    Cross-Institutional Forensic &amp; APH Chapter VII Benchmarking
                  </span>
                </div>
                <h2 className="text-base font-bold text-[var(--text-primary)] mt-1">
                  Comparative Analysis: {compareApps[0].nameEn} vs. {compareApps[1].nameEn}
                </h2>
              </div>
              <button
                onClick={() => setIsCompareModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Comparison Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Institution A Card */}
              <div className="p-4 rounded-xl bg-[var(--glass-bg-subtle)] border border-[var(--glass-border)] space-y-3">
                <div className="border-b border-[var(--glass-border)] pb-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-sky-700 dark:text-sky-400">
                      DOSSIER A: {compareApps[0].id}
                    </span>
                    <span
                      className={`text-[9.5px] font-mono font-bold px-2 py-0.2 rounded ${
                        compareApps[0].scrutinyStatus === 'Fatal Fraud Alert'
                          ? 'pill-fatal'
                          : compareApps[0].scrutinyStatus === 'Auto-Pre-Cleared'
                          ? 'pill-verified'
                          : 'pill-deficiency'
                      }`}
                    >
                      {compareApps[0].scrutinyStatus}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-[var(--text-primary)] mt-1">
                    {compareApps[0].nameEn}
                  </h3>
                  <p className="text-[10px] font-mono text-[var(--text-muted)]">
                    PID: {compareApps[0].pid} • {compareApps[0].region} • {compareApps[0].city}, {compareApps[0].state}
                  </p>
                </div>

                {/* KPI Metrics */}
                <div className="grid grid-cols-2 gap-2 text-center font-mono text-xs">
                  <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-[var(--glass-border)]">
                    <span className="text-[9.5px] text-[var(--text-faint)] block uppercase">ICI Score</span>
                    <span className="font-bold text-base text-[var(--text-primary)]">
                      {compareApps[0].iciScore.toFixed(1)} / 100
                    </span>
                  </div>
                  <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-[var(--glass-border)]">
                    <span className="text-[9.5px] text-[var(--text-faint)] block uppercase">Max Risk (RPN)</span>
                    <span className="font-bold text-base text-red-600 dark:text-red-400">
                      RPN {compareApps[0].maxRpn}
                    </span>
                  </div>
                </div>

                {/* 5-Domain Subscores */}
                <div className="space-y-1.5 font-mono text-[11px]">
                  <div className="text-[9.5px] text-[var(--text-faint)] uppercase font-bold">5-Domain Breakdown</div>
                  <div className="flex justify-between">
                    <span>Infrastructure:</span>
                    <span className="font-bold">{compareApps[0].subScores.infra}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Faculty Cadre:</span>
                    <span className="font-bold">{compareApps[0].subScores.faculty}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Legal &amp; Land:</span>
                    <span className="font-bold">{compareApps[0].subScores.legal}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Authority DPI:</span>
                    <span className="font-bold">{compareApps[0].subScores.authority}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Financial Audit:</span>
                    <span className="font-bold">{compareApps[0].subScores.financial}%</span>
                  </div>
                </div>

                {/* Land & Built-up */}
                <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-[var(--glass-border)] space-y-1 font-mono text-[10.5px]">
                  <div className="text-[9.5px] text-sky-700 dark:text-sky-400 font-bold uppercase">Land &amp; Spatial</div>
                  <div className="flex justify-between">
                    <span>Total Built-up:</span>
                    <span className="font-bold">{compareApps[0].landAndBuiltUp.totalBuiltUpAvailableSqm} / {compareApps[0].landAndBuiltUp.totalBuiltUpRequiredSqm} m²</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Land Acres:</span>
                    <span className="font-bold">{compareApps[0].landAndBuiltUp.landAvailableAcres} / {compareApps[0].landAndBuiltUp.landRequiredAcres} Ac</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Plots:</span>
                    <span className="font-bold">{compareApps[0].landAndBuiltUp.plotCount} plot(s) • d={compareApps[0].landAndBuiltUp.maxInterPlotDistanceKm} km</span>
                  </div>
                </div>

                {/* Faculty & Anomalies */}
                <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-[var(--glass-border)] space-y-1 font-mono text-[10.5px]">
                  <div className="text-[9.5px] text-sky-700 dark:text-sky-400 font-bold uppercase">Faculty &amp; Forensics</div>
                  <div className="flex justify-between">
                    <span>Faculty:</span>
                    <span className="font-bold">{compareApps[0].facultyMetrics.availableVerified} / {compareApps[0].facultyMetrics.requiredTotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>UG SFR:</span>
                    <span className="font-bold">{compareApps[0].facultyMetrics.sfrUG}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Ghost Faculty:</span>
                    <span className="font-bold text-red-600">{compareApps[0].facultyMetrics.ghostFlaggedCount} detected</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Anomalies:</span>
                    <span className="font-bold text-amber-600">{compareApps[0].anomalies.length} flag(s)</span>
                  </div>
                </div>

                <Link
                  href={`/applications/${compareApps[0].id}`}
                  className="btn-obsidian w-full inline-flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs font-bold"
                >
                  <span>Launch Workbench for {compareApps[0].id}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Institution B Card */}
              <div className="p-4 rounded-xl bg-[var(--glass-bg-subtle)] border border-[var(--glass-border)] space-y-3">
                <div className="border-b border-[var(--glass-border)] pb-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-indigo-700 dark:text-indigo-400">
                      DOSSIER B: {compareApps[1].id}
                    </span>
                    <span
                      className={`text-[9.5px] font-mono font-bold px-2 py-0.2 rounded ${
                        compareApps[1].scrutinyStatus === 'Fatal Fraud Alert'
                          ? 'pill-fatal'
                          : compareApps[1].scrutinyStatus === 'Auto-Pre-Cleared'
                          ? 'pill-verified'
                          : 'pill-deficiency'
                      }`}
                    >
                      {compareApps[1].scrutinyStatus}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-[var(--text-primary)] mt-1">
                    {compareApps[1].nameEn}
                  </h3>
                  <p className="text-[10px] font-mono text-[var(--text-muted)]">
                    PID: {compareApps[1].pid} • {compareApps[1].region} • {compareApps[1].city}, {compareApps[1].state}
                  </p>
                </div>

                {/* KPI Metrics */}
                <div className="grid grid-cols-2 gap-2 text-center font-mono text-xs">
                  <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-[var(--glass-border)]">
                    <span className="text-[9.5px] text-[var(--text-faint)] block uppercase">ICI Score</span>
                    <span className="font-bold text-base text-[var(--text-primary)]">
                      {compareApps[1].iciScore.toFixed(1)} / 100
                    </span>
                  </div>
                  <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-[var(--glass-border)]">
                    <span className="text-[9.5px] text-[var(--text-faint)] block uppercase">Max Risk (RPN)</span>
                    <span className="font-bold text-base text-red-600 dark:text-red-400">
                      RPN {compareApps[1].maxRpn}
                    </span>
                  </div>
                </div>

                {/* 5-Domain Subscores */}
                <div className="space-y-1.5 font-mono text-[11px]">
                  <div className="text-[9.5px] text-[var(--text-faint)] uppercase font-bold">5-Domain Breakdown</div>
                  <div className="flex justify-between">
                    <span>Infrastructure:</span>
                    <span className="font-bold">{compareApps[1].subScores.infra}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Faculty Cadre:</span>
                    <span className="font-bold">{compareApps[1].subScores.faculty}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Legal &amp; Land:</span>
                    <span className="font-bold">{compareApps[1].subScores.legal}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Authority DPI:</span>
                    <span className="font-bold">{compareApps[1].subScores.authority}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Financial Audit:</span>
                    <span className="font-bold">{compareApps[1].subScores.financial}%</span>
                  </div>
                </div>

                {/* Land & Built-up */}
                <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-[var(--glass-border)] space-y-1 font-mono text-[10.5px]">
                  <div className="text-[9.5px] text-indigo-700 dark:text-indigo-400 font-bold uppercase">Land &amp; Spatial</div>
                  <div className="flex justify-between">
                    <span>Total Built-up:</span>
                    <span className="font-bold">{compareApps[1].landAndBuiltUp.totalBuiltUpAvailableSqm} / {compareApps[1].landAndBuiltUp.totalBuiltUpRequiredSqm} m²</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Land Acres:</span>
                    <span className="font-bold">{compareApps[1].landAndBuiltUp.landAvailableAcres} / {compareApps[1].landAndBuiltUp.landRequiredAcres} Ac</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Plots:</span>
                    <span className="font-bold">{compareApps[1].landAndBuiltUp.plotCount} plot(s) • d={compareApps[1].landAndBuiltUp.maxInterPlotDistanceKm} km</span>
                  </div>
                </div>

                {/* Faculty & Anomalies */}
                <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-[var(--glass-border)] space-y-1 font-mono text-[10.5px]">
                  <div className="text-[9.5px] text-indigo-700 dark:text-indigo-400 font-bold uppercase">Faculty &amp; Forensics</div>
                  <div className="flex justify-between">
                    <span>Faculty:</span>
                    <span className="font-bold">{compareApps[1].facultyMetrics.availableVerified} / {compareApps[1].facultyMetrics.requiredTotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>UG SFR:</span>
                    <span className="font-bold">{compareApps[1].facultyMetrics.sfrUG}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Ghost Faculty:</span>
                    <span className="font-bold text-red-600">{compareApps[1].facultyMetrics.ghostFlaggedCount} detected</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Anomalies:</span>
                    <span className="font-bold text-amber-600">{compareApps[1].anomalies.length} flag(s)</span>
                  </div>
                </div>

                <Link
                  href={`/applications/${compareApps[1].id}`}
                  className="btn-obsidian w-full inline-flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs font-bold"
                >
                  <span>Launch Workbench for {compareApps[1].id}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
