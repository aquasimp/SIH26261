'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useLanguage, useFilters } from '@/lib/context';
import { InstitutionalApplication } from '@/lib/mock-data';
import GlassFolder, { ArtPreset, FolderFile } from '@/components/ui/glass-folder-cards';
import { toast } from 'sonner';
import {
  Search,
  Download,
  Building,
  CheckCircle2,
  AlertTriangle,
  Eye,
  ChevronDown,
  LayoutGrid,
  List,
  Sparkles,
  Scale,
  X,
  ArrowUpRight,
  FolderArchive,
  Layers,
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

const CAMPUS_VERIFICATION_IMAGES = [
  'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=600&q=80',
];

export default function ApplicationsPage() {
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const { t, language } = useLanguage();
  const { applications, setApplications, filteredApplications, filters, setFilters } = useFilters();
  const [viewMode, setViewMode] = useState<'table' | 'cards' | 'folders'>('table');
  const [sortBy, setSortBy] = useState<'rpn' | 'ici' | 'date'>('rpn');

  // Responsive folder width state
  const [folderWidth, setFolderWidth] = useState<number>(330);
  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== 'undefined') {
        setFolderWidth(window.innerWidth < 420 ? 285 : 330);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const folderTone: 'light' | 'dark' = resolvedTheme === 'dark' ? 'dark' : 'light';

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
    <div className="space-y-4 animate-glass-in">
      {/* Top Header & Workstation Action Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-sky-700 dark:text-sky-400 uppercase tracking-wider">
              National Institutional Dossier Registry
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)]">
            Institutional Scrutiny{' '}
            <span className="title-serif-italic text-sky-700 dark:text-sky-400">
              Registry
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1">
            Searchable statutory repository across all 8 AICTE regions with 5-component ICI sub-scores and forensic flags
          </p>
        </div>

        {/* Action Controls Toolbar */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* View mode toggle: Table / Cards / 3D Glass Folders */}
          <div className="glass-well inline-flex rounded-xl p-0.5 shadow-2xs">
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-lg transition-all cursor-pointer ${
                viewMode === 'table' ? 'btn-liquid-primary shadow-xs' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
              title="Table view"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`p-2 rounded-lg transition-all cursor-pointer ${
                viewMode === 'cards' ? 'btn-liquid-primary shadow-xs' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
              title="Card view"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('folders')}
              className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer inline-flex items-center gap-1.5 text-xs font-semibold ${
                viewMode === 'folders' ? 'btn-liquid-primary shadow-xs' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
              title="3D Glass Dossier Folders View"
            >
              <FolderArchive className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
              <span className="hidden sm:inline">3D Folders</span>
            </button>
          </div>

          {/* Sort selector */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="appearance-none pl-3 pr-8 py-2 rounded-xl glass-well text-xs font-semibold text-[var(--text-primary)] shadow-2xs cursor-pointer focus:outline-none"
            >
              <option value="rpn">Sort: Highest Risk (RPN)</option>
              <option value="ici">Sort: Compliance Index (ICI)</option>
              <option value="date">Sort: Submission Date</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--text-faint)]" />
          </div>

          {/* Simulate New Dossier Ingestion */}
          <button
            onClick={handleSimulateSynDocIngestion}
            className="btn-liquid-primary inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold cursor-pointer shadow-sm"
            title="Generate synthetic adversarial application using AICTE-SynDoc-10K generator"
          >
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            <span>+ Simulate Ingestion</span>
          </button>

          {/* Export buttons */}
          <button
            onClick={handleExportCSV}
            className="btn-liquid-secondary inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer shadow-2xs"
            title="Export filtered registry to CSV"
          >
            <Download className="w-3.5 h-3.5 text-[var(--text-muted)]" />
            <span>CSV</span>
          </button>
          <button
            onClick={handleExportJSON}
            className="btn-liquid-secondary inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer shadow-2xs"
            title="Export filtered registry to JSON"
          >
            <Download className="w-3.5 h-3.5 text-[var(--text-muted)]" />
            <span>JSON</span>
          </button>
        </div>
      </div>

      {/* Quick Search & Compare Indicator Strip */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-[18px] liquid-glass-card flex-1 shadow-sm">
          <Search className="w-4 h-4 text-[var(--text-muted)] shrink-0" />
          <input
            type="text"
            placeholder="Filter registry by Institution Name, Permanent ID (PID), City, or Trust..."
            value={filters.searchQuery}
            onChange={(e) => setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))}
            className="w-full bg-transparent text-xs sm:text-sm font-medium text-[var(--text-primary)] placeholder:text-[var(--text-faint)] focus:outline-none"
          />
          {filters.searchQuery && (
            <button
              onClick={() => setFilters((prev) => ({ ...prev, searchQuery: '' }))}
              className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] px-1.5 cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        {/* Compare 2 Institutions Indicator / Button */}
        {selectedForCompare.length > 0 && (
          <div className="p-2.5 px-4 rounded-2xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-between gap-3 shrink-0 shadow-2xs">
            <div className="text-xs">
              <span className="font-bold text-sky-700 dark:text-sky-300">
                {selectedForCompare.length} / 2 Selected for Comparison
              </span>
              {selectedForCompare.length === 1 && (
                <span className="text-[11px] text-[var(--text-muted)] block">
                  Select 1 more dossier to unlock comparison matrix
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                disabled={selectedForCompare.length !== 2}
                onClick={() => setIsCompareModalOpen(true)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer inline-flex items-center gap-1.5 ${
                  selectedForCompare.length === 2
                    ? 'btn-liquid-primary shadow-xs'
                    : 'bg-slate-300/40 dark:bg-slate-700/40 text-slate-500 cursor-not-allowed opacity-60'
                }`}
              >
                <Scale className="w-3.5 h-3.5" />
                <span>Compare Dossiers</span>
              </button>
              <button
                onClick={() => setSelectedForCompare([])}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
                title="Clear comparison selection"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Table View */}
      {viewMode === 'table' ? (
        <div className="liquid-glass-card rounded-[18px] p-4 sm:p-5 overflow-hidden shadow-md">
          <div className="w-full overflow-x-auto rounded-xl">
            <table className="w-full min-w-[760px] text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[var(--glass-well-border)] text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                  <th className="py-3 px-3.5 w-10 text-center">Cmp</th>
                  <th className="py-3 px-3.5">Application &amp; Institution</th>
                  <th className="py-3 px-3.5">Category &amp; Zone</th>
                  <th className="py-3 px-3.5">ICI &amp; 5-Domain Profile</th>
                  <th className="py-3 px-3.5">Risk (RPN)</th>
                  <th className="py-3 px-3.5">Scrutiny Status</th>
                  <th className="py-3 px-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--glass-well-border)]">
                {sortedApplications.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-[var(--text-muted)] text-xs font-medium">
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
                        className={`hover:bg-white/40 dark:hover:bg-white/5 transition-colors group ${
                          isChecked ? 'bg-sky-500/10' : ''
                        }`}
                      >
                        {/* Compare Checkbox */}
                        <td className="py-3 px-3.5 text-center">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleToggleCompare(app.id)}
                            className="rounded accent-sky-600 cursor-pointer w-4 h-4"
                            title="Select to compare side-by-side"
                          />
                        </td>

                        {/* Institution Name & IDs */}
                        <td className="py-3 px-3.5">
                          <div className="font-semibold text-xs text-[var(--text-primary)] group-hover:text-sky-700 dark:group-hover:text-sky-400 transition-colors">
                            {language === 'hi' ? app.nameHi : app.nameEn}
                          </div>
                          <div className="text-[11px] text-[var(--text-muted)] flex items-center gap-2 mt-0.5">
                            <span className="font-mono font-semibold text-[var(--text-secondary)]">{app.id}</span>
                            <span>•</span>
                            <span>PID: <span className="font-mono">{app.pid}</span></span>
                            <span>•</span>
                            <span>{app.city}, {app.state}</span>
                          </div>
                        </td>

                        {/* Category & Region */}
                        <td className="py-3 px-3.5">
                          <div className="font-medium text-[var(--text-primary)] text-xs">
                            {app.applicationCategory}
                          </div>
                          <div className="text-[11px] text-[var(--text-muted)]">
                            {app.region} • {app.zoneType} ({app.institutionType.split(' ')[0]})
                          </div>
                        </td>

                        {/* ICI Score & 5-Domain Spark Bar */}
                        <td className="py-3 px-3.5">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs tabular-nums text-[var(--text-primary)]">
                              {app.iciScore.toFixed(1)}
                            </span>
                            {app.fatalGateTriggered && (
                              <span className="text-[9.5px] font-bold px-1.5 py-0.5 rounded-full bg-rose-600 text-white">
                                FATAL VETO
                              </span>
                            )}
                          </div>

                          {/* 5-Component Spark Bar */}
                          <div className="flex items-center gap-1 mt-1.5 w-28" title="Infra, Faculty, Legal, Authority, Financial">
                            <div className="h-1.5 rounded-full bg-sky-500" style={{ width: `${app.subScores.infra}%` }} title={`Infra: ${app.subScores.infra}`} />
                            <div className="h-1.5 rounded-full bg-indigo-500" style={{ width: `${app.subScores.faculty}%` }} title={`Faculty: ${app.subScores.faculty}`} />
                            <div className="h-1.5 rounded-full bg-violet-500" style={{ width: `${app.subScores.legal}%` }} title={`Legal: ${app.subScores.legal}`} />
                            <div className="h-1.5 rounded-full bg-emerald-500" style={{ width: `${app.subScores.authority}%` }} title={`Authority: ${app.subScores.authority}`} />
                            <div className="h-1.5 rounded-full bg-amber-500" style={{ width: `${app.subScores.financial}%` }} title={`Financial: ${app.subScores.financial}`} />
                          </div>
                        </td>

                        {/* Risk RPN */}
                        <td className="py-3 px-3.5">
                          <div className="font-bold text-xs tabular-nums text-[var(--text-primary)]">
                            RPN {app.maxRpn}
                          </div>
                          <div className="text-[11px] text-[var(--text-muted)]">
                            {app.anomalies.length} Anomaly Triggers
                          </div>
                        </td>

                        {/* Scrutiny Status Pill */}
                        <td className="py-3 px-3.5">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                              isFatal
                                ? 'pill-fatal'
                                : isCleared
                                ? 'pill-verified'
                                : isDeficiency
                                ? 'pill-deficiency'
                                : 'bg-slate-500/10 text-slate-600'
                            }`}
                          >
                            {isFatal && <span className="h-1.5 w-1.5 rounded-full bg-rose-600 animate-pulse" />}
                            {app.scrutinyStatus}
                          </span>
                        </td>

                        {/* Action Link */}
                        <td className="py-3 px-3.5 text-right">
                          <Link
                            href={`/applications/${app.id}`}
                            className="btn-liquid-primary inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold shadow-2xs"
                          >
                            <Eye className="w-3.5 h-3.5" />
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
      ) : viewMode === 'cards' ? (
        /* Cards View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedApplications.map((app) => {
            const isFatal = app.scrutinyStatus === 'Fatal Fraud Alert';
            const isCleared = app.scrutinyStatus === 'Auto-Pre-Cleared';
            const isChecked = selectedForCompare.includes(app.id);

            return (
              <div
                key={app.id}
                className={`liquid-glass-card rounded-[18px] p-4 sm:p-5 flex flex-col justify-between space-y-3.5 transition-all shadow-md ${
                  isFatal
                    ? 'top-rule-fatal'
                    : isCleared
                    ? 'top-rule-verified'
                    : 'top-rule-deficiency'
                } ${isChecked ? 'ring-2 ring-sky-500 shadow-xl' : ''}`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span
                      className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                        isFatal
                          ? 'pill-fatal'
                          : isCleared
                          ? 'pill-verified'
                          : 'pill-deficiency'
                      }`}
                    >
                      {app.scrutinyStatus}
                    </span>

                    <div className="flex items-center gap-2.5">
                      <label className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleCompare(app.id)}
                          className="rounded accent-sky-600 cursor-pointer"
                        />
                        <span>Compare</span>
                      </label>
                      <span className="text-xs font-bold tabular-nums text-[var(--text-primary)]">
                        RPN {app.maxRpn}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-[var(--text-primary)] mt-2.5 line-clamp-1">
                    {language === 'hi' ? app.nameHi : app.nameEn}
                  </h3>
                  <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                    <span className="font-mono">{app.id}</span> • {app.city}, {app.state}
                  </p>

                  <div className="mt-3 p-3 rounded-xl glass-well flex items-center justify-between text-xs">
                    <div>
                      <div className="text-[10px] uppercase text-[var(--text-faint)] font-bold">ICI Score</div>
                      <div className="text-base font-bold text-[var(--text-primary)] flex items-center gap-1 mt-0.5">
                        <span className="tabular-nums">{app.iciScore.toFixed(1)}</span>
                        {app.fatalGateTriggered && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-rose-600 text-white font-bold">
                            VETO
                          </span>
                        )}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase text-[var(--text-faint)] font-bold">Total Built-up</div>
                      <div className="text-xs font-bold text-[var(--text-secondary)] mt-0.5 tabular-nums">
                        {app.landAndBuiltUp.totalBuiltUpAvailableSqm.toLocaleString()} m²
                      </div>
                    </div>
                  </div>

                  {/* 5-Component Spark Bar */}
                  <div className="mt-2.5">
                    <div className="flex items-center justify-between text-[10px] text-[var(--text-faint)] mb-1">
                      <span>5-COMP ICI</span>
                      <span>Infra • Fac • Leg • Auth • Fin</span>
                    </div>
                    <div className="flex items-center gap-1 w-full">
                      <div className="h-1.5 rounded-full bg-sky-500" style={{ width: `${app.subScores.infra}%` }} />
                      <div className="h-1.5 rounded-full bg-indigo-500" style={{ width: `${app.subScores.faculty}%` }} />
                      <div className="h-1.5 rounded-full bg-violet-500" style={{ width: `${app.subScores.legal}%` }} />
                      <div className="h-1.5 rounded-full bg-emerald-500" style={{ width: `${app.subScores.authority}%` }} />
                      <div className="h-1.5 rounded-full bg-amber-500" style={{ width: `${app.subScores.financial}%` }} />
                    </div>
                  </div>
                </div>

                <Link
                  href={`/applications/${app.id}`}
                  className="btn-liquid-primary w-full inline-flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold cursor-pointer shadow-sm"
                >
                  <Eye className="w-4 h-4" />
                  <span>Open Scrutiny Workbench</span>
                </Link>
              </div>
            );
          })}
        </div>
      ) : (
        /* 3D Glass Folders View (Interactive Regulatory Dossier Pockets) */
        <div className="space-y-4">
          <div className="p-3.5 rounded-2xl glass-well flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
              <span className="font-bold text-[var(--text-primary)]">
                3D Interactive Statutory Dossier Evidence Shelves
              </span>
              <span className="text-[var(--text-muted)] hidden md:inline">
                • Click any folder to expand annexure sheets; click a sheet to open Scrutiny Workbench; click &apos;+&apos; to drop supplemental affidavits with spring physics
              </span>
            </div>
            <div className="text-[11px] font-mono text-[var(--text-muted)]">
              {filteredApplications.length} Dossiers Active in Scope
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-start">
            {sortedApplications.map((app, appIdx) => {
              const isFatal = app.scrutinyStatus === 'Fatal Fraud Alert';
              const isCleared = app.scrutinyStatus === 'Auto-Pre-Cleared';
              const isChecked = selectedForCompare.includes(app.id);

              const artPreset: ArtPreset = isFatal
                ? 'ember'
                : app.scrutinyStatus === 'Deficiency Issued'
                ? 'dusk'
                : isCleared
                ? 'verdant'
                : 'aurora';

              const hashVal = Math.abs(app.id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0));
              const campusImg = CAMPUS_VERIFICATION_IMAGES[hashVal % CAMPUS_VERIFICATION_IMAGES.length];

              const institutionalAnnexures: FolderFile[] = [
                {
                  name: `${app.id.slice(-7)} Fire NOC.pdf`,
                  meta: app.fatalGateTriggered ? 'RPN 912 · TruFor Tampered' : 'Verified · e-District QR',
                  art: isFatal ? 'ember' : 'glacier',
                  href: `/applications/${app.id}`,
                },
                {
                  name: 'Land Sale Deed.pdf',
                  meta: `${app.landAndBuiltUp.landAvailableAcres} Acres · DigiLocker URI`,
                  image: campusImg,
                  href: `/applications/${app.id}`,
                },
                {
                  name: 'CAD Floor Plan.dwg',
                  meta: `${app.landAndBuiltUp.totalBuiltUpAvailableSqm.toLocaleString()} m² · Shoelace CV`,
                  art: 'dusk',
                  href: `/applications/${app.id}`,
                },
                {
                  name: 'EPFO ECR 2.0 Roll.csv',
                  meta: `${app.facultyMetrics.availableVerified} Faculty · ${app.facultyMetrics.ghostFlaggedCount} Ghost`,
                  art: 'verdant',
                  href: `/applications/${app.id}`,
                },
              ];

              return (
                <div
                  key={app.id}
                  className={`liquid-glass-card rounded-[22px] p-5 flex flex-col items-center justify-between transition-all shadow-lg overflow-hidden ${
                    isFatal
                      ? 'top-rule-fatal'
                      : isCleared
                      ? 'top-rule-verified'
                      : 'top-rule-deficiency'
                  } ${isChecked ? 'ring-2 ring-sky-500 shadow-xl' : ''}`}
                >
                  {/* Institutional Header & Comparison Selector */}
                  <div className="w-full mb-3 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
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
                        <label className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleToggleCompare(app.id)}
                            className="rounded accent-sky-600 cursor-pointer"
                          />
                          <span>Compare</span>
                        </label>
                        <span className="text-xs font-bold tabular-nums text-[var(--text-primary)]">
                          RPN {app.maxRpn}
                        </span>
                      </div>
                    </div>
                    <h3 className="text-sm font-bold text-[var(--text-primary)] truncate mt-1">
                      {language === 'hi' ? app.nameHi : app.nameEn}
                    </h3>
                    <div className="text-[11px] text-[var(--text-muted)] flex items-center justify-between">
                      <span className="font-mono">{app.id}</span>
                      <span>{app.city}, {app.state}</span>
                    </div>
                  </div>

                  {/* 3D Glass Dossier Folder */}
                  <div className="py-2 flex justify-center w-full overflow-visible">
                    <GlassFolder
                      width={folderWidth}
                      tone={folderTone}
                      art={artPreset}
                      seed={hashVal + appIdx}
                      label={app.id.replace('AICTE-2026-', '')}
                      meta={`${app.applicationCategory.slice(0, 18)} · ICI ${app.iciScore.toFixed(1)}`}
                      files={institutionalAnnexures}
                      action="add"
                      onAdd={() => {
                        const newDoc: FolderFile = {
                          name: 'EVC Supplemental Affidavit.pdf',
                          meta: 'Uploaded Just Now · SHA-256 Validated',
                          art: 'glacier',
                          href: `/applications/${app.id}`,
                        };
                        toast.success(`Supplemental Evidence Sheet Ingested into ${app.id}`, {
                          description: 'EVC Supplemental Affidavit.pdf dropped into pocket with spring physics.',
                        });
                        return newDoc;
                      }}
                      onFileSelect={(file) => {
                        toast.info(`Opening Annexure: ${file.name}`, {
                          description: `Navigating to Scrutiny Workbench for ${app.id} (${file.meta || 'Statutory Filing'})`,
                        });
                        router.push(`/applications/${app.id}`);
                      }}
                    />
                  </div>

                  {/* Bottom Shelf Metadata & Navigation */}
                  <div className="w-full pt-3 mt-2 border-t border-[var(--glass-well-border)] flex items-center justify-between text-xs">
                    <div className="text-[11px] text-[var(--text-muted)]">
                      <span>ICI: <strong className="text-[var(--text-primary)]">{app.iciScore.toFixed(1)}</strong></span>
                      <span className="mx-1.5">•</span>
                      <span>{app.anomalies.length} Flagged</span>
                    </div>
                    <Link
                      href={`/applications/${app.id}`}
                      className="btn-liquid-primary inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold shadow-xs"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Open Workbench</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =========================================================================
          COMPARATIVE REGULATORY & FORENSIC MATRIX MODAL
          (Side-by-side comparison of 2 selected institutions)
          ========================================================================= */}
      {isCompareModalOpen && compareApps && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 animate-glass-in">
          <div className="liquid-glass-card rounded-3xl max-w-5xl w-full max-h-[92vh] overflow-y-auto p-6 space-y-4 shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[var(--glass-well-border)] pb-3.5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-sky-600 text-white text-[10px] font-bold uppercase tracking-wider">
                    Statutory Comparison Matrix
                  </span>
                  <span className="text-xs text-[var(--text-muted)]">
                    Cross-Institutional Forensic &amp; APH Chapter VII Benchmarking
                  </span>
                </div>
                <h2 className="text-base sm:text-lg font-bold text-[var(--text-primary)] mt-1">
                  Comparative Analysis: {compareApps[0].nameEn} vs. {compareApps[1].nameEn}
                </h2>
              </div>
              <button
                onClick={() => setIsCompareModalOpen(false)}
                className="btn-liquid-secondary p-1.5 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Comparison Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Institution A Card */}
              <div className="p-4 rounded-2xl glass-well space-y-3 shadow-inner">
                <div className="border-b border-[var(--glass-well-border)] pb-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-sky-700 dark:text-sky-400">
                      DOSSIER A: <span className="font-mono">{compareApps[0].id}</span>
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
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
                  <p className="text-[11px] text-[var(--text-muted)]">
                    PID: <span className="font-mono">{compareApps[0].pid}</span> • {compareApps[0].region} • {compareApps[0].city}, {compareApps[0].state}
                  </p>
                </div>

                {/* KPI Metrics */}
                <div className="grid grid-cols-2 gap-2 text-center text-xs">
                  <div className="p-2.5 rounded-xl bg-white/40 dark:bg-black/20 border border-[var(--glass-well-border)]">
                    <span className="text-[10px] text-[var(--text-faint)] block uppercase font-semibold">ICI Score</span>
                    <span className="font-bold text-lg text-[var(--text-primary)] tabular-nums">
                      {compareApps[0].iciScore.toFixed(1)} / 100
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/40 dark:bg-black/20 border border-[var(--glass-well-border)]">
                    <span className="text-[10px] text-[var(--text-faint)] block uppercase font-semibold">Max Risk (RPN)</span>
                    <span className="font-bold text-lg text-rose-600 dark:text-rose-400 tabular-nums">
                      RPN {compareApps[0].maxRpn}
                    </span>
                  </div>
                </div>

                {/* 5-Domain Subscores */}
                <div className="space-y-1.5 text-xs">
                  <div className="text-[10px] text-[var(--text-faint)] uppercase font-bold">5-Domain Breakdown</div>
                  <div className="flex justify-between">
                    <span>Infrastructure:</span>
                    <span className="font-bold tabular-nums">{compareApps[0].subScores.infra}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Faculty Cadre:</span>
                    <span className="font-bold tabular-nums">{compareApps[0].subScores.faculty}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Legal &amp; Land:</span>
                    <span className="font-bold tabular-nums">{compareApps[0].subScores.legal}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Authority DPI:</span>
                    <span className="font-bold tabular-nums">{compareApps[0].subScores.authority}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Financial Audit:</span>
                    <span className="font-bold tabular-nums">{compareApps[0].subScores.financial}%</span>
                  </div>
                </div>

                {/* Land & Built-up */}
                <div className="p-3 rounded-xl bg-white/40 dark:bg-black/20 border border-[var(--glass-well-border)] space-y-1 text-xs">
                  <div className="text-[10px] text-sky-700 dark:text-sky-400 font-bold uppercase">Land &amp; Spatial</div>
                  <div className="flex justify-between">
                    <span>Total Built-up:</span>
                    <span className="font-bold tabular-nums">{compareApps[0].landAndBuiltUp.totalBuiltUpAvailableSqm} / {compareApps[0].landAndBuiltUp.totalBuiltUpRequiredSqm} m²</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Land Acres:</span>
                    <span className="font-bold tabular-nums">{compareApps[0].landAndBuiltUp.landAvailableAcres} / {compareApps[0].landAndBuiltUp.landRequiredAcres} Ac</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Plots:</span>
                    <span className="font-bold tabular-nums">{compareApps[0].landAndBuiltUp.plotCount} plot(s) • d={compareApps[0].landAndBuiltUp.maxInterPlotDistanceKm} km</span>
                  </div>
                </div>

                {/* Faculty & Anomalies */}
                <div className="p-3 rounded-xl bg-white/40 dark:bg-black/20 border border-[var(--glass-well-border)] space-y-1 text-xs">
                  <div className="text-[10px] text-sky-700 dark:text-sky-400 font-bold uppercase">Faculty &amp; Forensics</div>
                  <div className="flex justify-between">
                    <span>Faculty:</span>
                    <span className="font-bold tabular-nums">{compareApps[0].facultyMetrics.availableVerified} / {compareApps[0].facultyMetrics.requiredTotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>UG SFR:</span>
                    <span className="font-bold tabular-nums">{compareApps[0].facultyMetrics.sfrUG}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Ghost Faculty:</span>
                    <span className="font-bold text-rose-600 tabular-nums">{compareApps[0].facultyMetrics.ghostFlaggedCount} detected</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Anomalies:</span>
                    <span className="font-bold text-amber-600 tabular-nums">{compareApps[0].anomalies.length} flag(s)</span>
                  </div>
                </div>

                <Link
                  href={`/applications/${compareApps[0].id}`}
                  className="btn-liquid-primary w-full inline-flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold"
                >
                  <span>Launch Workbench for {compareApps[0].id}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Institution B Card */}
              <div className="p-4 rounded-2xl glass-well space-y-3 shadow-inner">
                <div className="border-b border-[var(--glass-well-border)] pb-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-700 dark:text-indigo-400">
                      DOSSIER B: <span className="font-mono">{compareApps[1].id}</span>
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
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
                  <p className="text-[11px] text-[var(--text-muted)]">
                    PID: <span className="font-mono">{compareApps[1].pid}</span> • {compareApps[1].region} • {compareApps[1].city}, {compareApps[1].state}
                  </p>
                </div>

                {/* KPI Metrics */}
                <div className="grid grid-cols-2 gap-2 text-center text-xs">
                  <div className="p-2.5 rounded-xl bg-white/40 dark:bg-black/20 border border-[var(--glass-well-border)]">
                    <span className="text-[10px] text-[var(--text-faint)] block uppercase font-semibold">ICI Score</span>
                    <span className="font-bold text-lg text-[var(--text-primary)] tabular-nums">
                      {compareApps[1].iciScore.toFixed(1)} / 100
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/40 dark:bg-black/20 border border-[var(--glass-well-border)]">
                    <span className="text-[10px] text-[var(--text-faint)] block uppercase font-semibold">Max Risk (RPN)</span>
                    <span className="font-bold text-lg text-rose-600 dark:text-rose-400 tabular-nums">
                      RPN {compareApps[1].maxRpn}
                    </span>
                  </div>
                </div>

                {/* 5-Domain Subscores */}
                <div className="space-y-1.5 text-xs">
                  <div className="text-[10px] text-[var(--text-faint)] uppercase font-bold">5-Domain Breakdown</div>
                  <div className="flex justify-between">
                    <span>Infrastructure:</span>
                    <span className="font-bold tabular-nums">{compareApps[1].subScores.infra}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Faculty Cadre:</span>
                    <span className="font-bold tabular-nums">{compareApps[1].subScores.faculty}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Legal &amp; Land:</span>
                    <span className="font-bold tabular-nums">{compareApps[1].subScores.legal}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Authority DPI:</span>
                    <span className="font-bold tabular-nums">{compareApps[1].subScores.authority}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Financial Audit:</span>
                    <span className="font-bold tabular-nums">{compareApps[1].subScores.financial}%</span>
                  </div>
                </div>

                {/* Land & Built-up */}
                <div className="p-3 rounded-xl bg-white/40 dark:bg-black/20 border border-[var(--glass-well-border)] space-y-1 text-xs">
                  <div className="text-[10px] text-indigo-700 dark:text-indigo-400 font-bold uppercase">Land &amp; Spatial</div>
                  <div className="flex justify-between">
                    <span>Total Built-up:</span>
                    <span className="font-bold tabular-nums">{compareApps[1].landAndBuiltUp.totalBuiltUpAvailableSqm} / {compareApps[1].landAndBuiltUp.totalBuiltUpRequiredSqm} m²</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Land Acres:</span>
                    <span className="font-bold tabular-nums">{compareApps[1].landAndBuiltUp.landAvailableAcres} / {compareApps[1].landAndBuiltUp.landRequiredAcres} Ac</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Plots:</span>
                    <span className="font-bold tabular-nums">{compareApps[1].landAndBuiltUp.plotCount} plot(s) • d={compareApps[1].landAndBuiltUp.maxInterPlotDistanceKm} km</span>
                  </div>
                </div>

                {/* Faculty & Anomalies */}
                <div className="p-3 rounded-xl bg-white/40 dark:bg-black/20 border border-[var(--glass-well-border)] space-y-1 text-xs">
                  <div className="text-[10px] text-indigo-700 dark:text-indigo-400 font-bold uppercase">Faculty &amp; Forensics</div>
                  <div className="flex justify-between">
                    <span>Faculty:</span>
                    <span className="font-bold tabular-nums">{compareApps[1].facultyMetrics.availableVerified} / {compareApps[1].facultyMetrics.requiredTotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>UG SFR:</span>
                    <span className="font-bold tabular-nums">{compareApps[1].facultyMetrics.sfrUG}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Ghost Faculty:</span>
                    <span className="font-bold text-rose-600 tabular-nums">{compareApps[1].facultyMetrics.ghostFlaggedCount} detected</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Anomalies:</span>
                    <span className="font-bold text-amber-600 tabular-nums">{compareApps[1].anomalies.length} flag(s)</span>
                  </div>
                </div>

                <Link
                  href={`/applications/${compareApps[1].id}`}
                  className="btn-liquid-primary w-full inline-flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold"
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
