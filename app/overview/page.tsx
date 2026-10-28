'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useLanguage, useFilters } from '@/lib/context';
import { REGIONAL_STATS, MOCK_APPLICATIONS, InstitutionalApplication } from '@/lib/mock-data';
import GlassFolder, { FolderFile, FolderMenuItem } from '@/components/ui/glass-folder-cards';
import IndiaChoroplethMap from '@/components/workbench/IndiaChoroplethMap';
import { toast } from 'sonner';
import {
  ArrowUpRight,
  ArrowDownRight,
  Folder,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Building2,
  Eye,
  MoreHorizontal,
  ChevronRight,
  FolderArchive,
  ShieldAlert,
  Clock,
  Sparkles,
  FileText,
  ScanText,
  Fingerprint,
  Compass,
  Users,
  ChevronDown,
  ChevronUp,
  X,
  ExternalLink,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';

export default function OverviewPage() {
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const { t, language } = useLanguage();
  const { filters, filteredApplications, setFilters, applications } = useFilters();

  // Responsive folder width for Statutory Evidence Vaults (protected 21st.dev component)
  const [vaultFolderWidth, setVaultFolderWidth] = useState<number>(330);
  const [isVaultSectionOpen, setIsVaultSectionOpen] = useState<boolean>(true);
  const [chartTimespan, setChartTimespan] = useState<string>('Last 7 Days');

  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== 'undefined') {
        const w = window.innerWidth;
        if (w < 440) setVaultFolderWidth(285);
        else if (w < 768) setVaultFolderWidth(310);
        else if (w < 1280) setVaultFolderWidth(295);
        else if (w < 1536) setVaultFolderWidth(325);
        else setVaultFolderWidth(345);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const folderTone: 'light' | 'dark' = resolvedTheme === 'dark' ? 'dark' : 'light';

  // Quick-Look Forensic Modal State
  const [quickLookApp, setQuickLookApp] = useState<InstitutionalApplication | null>(null);

  // Dynamic KPI calculation reacting to active global filters and live application state mutations
  const activeRegionStat = REGIONAL_STATS.find((r) => r.region === filters.region);

  const dynamicKpis = useMemo(() => {
    const initialApproved = MOCK_APPLICATIONS.filter((a) => a.scrutinyStatus === 'Auto-Pre-Cleared').length;
    const currentApproved = applications.filter((a) => a.scrutinyStatus === 'Auto-Pre-Cleared').length;
    const approvedDelta = currentApproved - initialApproved;

    const initialDef = MOCK_APPLICATIONS.filter((a) => a.scrutinyStatus === 'Deficiency Issued').length;
    const currentDef = applications.filter((a) => a.scrutinyStatus === 'Deficiency Issued').length;
    const defDelta = currentDef - initialDef;

    const initialFatal = MOCK_APPLICATIONS.filter((a) => a.scrutinyStatus === 'Fatal Fraud Alert').length;
    const currentFatal = applications.filter((a) => a.scrutinyStatus === 'Fatal Fraud Alert').length;
    const fatalDelta = currentFatal - initialFatal;

    if (activeRegionStat) {
      const total = activeRegionStat.applications;
      const preCleared = Math.max(0, activeRegionStat.compliantCount + approvedDelta);
      const preClearedPct = ((preCleared / total) * 100).toFixed(1);
      const def = Math.max(0, activeRegionStat.rectifiableCount + defDelta);
      const fatal = Math.max(0, activeRegionStat.fatalFraudCount + fatalDelta);
      const ghost = activeRegionStat.ghostFacultyCount;
      return {
        totalIngested: total.toLocaleString(),
        totalIngestedTrend: '+12%',
        preCleared: preCleared.toLocaleString(),
        preClearedPct: `${preClearedPct}%`,
        deficienciesIssued: def.toLocaleString(),
        deficienciesTrend: '24.5%',
        fatalFraud: fatal.toLocaleString(),
        fatalFraudTrend: '3.1%',
        ghostFaculty: ghost.toLocaleString(),
        ghostFacultyPct: '6.1%',
      };
    }

    const totalApps = 4820;
    const compliant = 3194 + approvedDelta;
    const def = 1182 + defDelta;
    const fatal = 148 + fatalDelta;
    const ghost = 296;

    return {
      totalIngested: totalApps.toLocaleString(),
      totalIngestedTrend: '+12%',
      preCleared: compliant.toLocaleString(),
      preClearedPct: `${((compliant / totalApps) * 100).toFixed(1)}%`,
      deficienciesIssued: def.toLocaleString(),
      deficienciesTrend: `${((def / totalApps) * 100).toFixed(1)}%`,
      fatalFraud: fatal.toLocaleString(),
      fatalFraudTrend: `${((fatal / totalApps) * 100).toFixed(1)}%`,
      ghostFaculty: ghost.toLocaleString(),
      ghostFacultyPct: `${((ghost / totalApps) * 100).toFixed(1)}%`,
    };
  }, [activeRegionStat, applications]);

  // High risk applications sorted by RPN
  const highRiskQueue = useMemo(() => {
    return [...filteredApplications].sort((a, b) => b.maxRpn - a.maxRpn);
  }, [filteredApplications]);

  const highestRpnDossier = useMemo(() => {
    return highRiskQueue[0] || applications[0] || MOCK_APPLICATIONS[0];
  }, [highRiskQueue, applications]);

  const handleGenerateNoticeToast = (appId?: string) => {
    const id = typeof appId === 'string' && appId ? appId : highestRpnDossier.id;
    const targetApp = applications.find((a) => a.id === id) || applications[0];
    toast.success(`Redirecting to Statutory Notice Generator for ${targetApp.nameEn}...`, {
      description: `Target Dossier: ${id} • Severity: RPN ${targetApp.maxRpn}`,
    });
    setTimeout(() => {
      router.push(`/deficiencies?appId=${id}`);
    }, 400);
  };

  // Recent Dossiers matching Image 2 table with live data linkage
  const recentDossiersList = useMemo(() => {
    return [
      {
        id: 'AICTE-2026-0142',
        name: 'Apex Institute of Technology',
        state: 'UP',
        type: 'New',
        received: '15 Jan 2026',
        status: 'Fatal Fraud Alert',
        statusClass: 'pill-fatal',
        statusLabel: 'Forgery Alert',
        targetAppId: 'AICTE-2026-NW-0842',
      },
      {
        id: 'AICTE-2026-0141',
        name: 'Shivam College of Engineering',
        state: 'MH',
        type: 'Renewal',
        received: '15 Jan 2026',
        status: 'Under Scrutiny',
        statusClass: 'pill-registry',
        statusLabel: 'Under Scrutiny',
        targetAppId: 'AICTE-2026-SO-0914',
      },
      {
        id: 'AICTE-2026-0140',
        name: 'Bharat Technical Campus',
        state: 'RJ',
        type: 'New',
        received: '14 Jan 2026',
        status: 'Deficiency Issued',
        statusClass: 'pill-deficiency',
        statusLabel: 'Deficiency',
        targetAppId: 'AICTE-2026-WE-0721',
      },
      {
        id: 'AICTE-2026-0139',
        name: 'Saraswati Group of Institutions',
        state: 'KA',
        type: 'Extension',
        received: '14 Jan 2026',
        status: 'Auto-Pre-Cleared',
        statusClass: 'pill-verified',
        statusLabel: 'Cleared',
        targetAppId: 'AICTE-2026-SW-0312',
      },
      {
        id: 'AICTE-2026-0138',
        name: 'Janta College of Engineering',
        state: 'BR',
        type: 'New',
        received: '13 Jan 2026',
        status: 'Under Scrutiny',
        statusClass: 'pill-registry',
        statusLabel: 'Under Scrutiny',
        targetAppId: 'AICTE-2026-EA-0519',
      },
    ];
  }, []);

  return (
    <div className="space-y-6 animate-glass-in">
      {/* =========================================================================
          SECTION 1: GREETING & SCOPE HEADER (Matching Image 2)
          ========================================================================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-1 px-1">
        <div>
          <h1 className="text-2xl sm:text-[28px] font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
            {language === 'hi' ? 'शुभ प्रभात, श्री आर.के. वर्मा' : 'Good Morning, Shri R.K. Verma'}
          </h1>
          <p className="text-xs sm:text-[13px] text-slate-500 dark:text-slate-400 mt-0.5">
            AICTE Regulatory Scrutiny Workstation | Evidence-Linked Scrutiny for APH 2024–27
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-mono hidden sm:block">
            15 Jan 2026, 10:24 AM
          </div>
          <div className="glass-well rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200 inline-flex items-center gap-2 shadow-2xs">
            <span>AY 2026–27 (Current)</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </div>
        </div>
      </div>

      {/* =========================================================================
          SECTION 2: 5 HERO METRIC CARDS (Exact match to Image 2)
          ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5">
        {/* Card 1: Total Dossiers */}
        <div className="liquid-glass-card rounded-[18px] p-4 flex items-center gap-3.5 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all">
          <div className="h-12 w-12 rounded-xl bg-blue-500/15 text-blue-600 dark:text-sky-400 flex items-center justify-center shrink-0">
            <Folder className="h-6 w-6" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white tabular-nums">
              {dynamicKpis.totalIngested}
            </div>
            <div className="text-xs font-normal text-slate-500 dark:text-slate-400 mt-0.5 truncate">
              {language === 'hi' ? 'कुल डोजियर' : 'Total Dossiers'}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 inline-flex items-center">
                ↑ +12%
              </span>
              <div className="flex items-end gap-0.5 h-3">
                <span className="w-1 h-1.5 bg-blue-500/40 rounded-xs" />
                <span className="w-1 h-2 bg-blue-500/50 rounded-xs" />
                <span className="w-1 h-1 bg-blue-500/40 rounded-xs" />
                <span className="w-1 h-2.5 bg-blue-500/70 rounded-xs" />
                <span className="w-1 h-2 bg-blue-500/60 rounded-xs" />
                <span className="w-1 h-3 bg-blue-500 rounded-xs" />
                <span className="w-1 h-3.5 bg-blue-500 rounded-xs" />
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Cleared (Pre-Scrutiny) */}
        <div className="liquid-glass-card rounded-[18px] p-4 flex items-center gap-3.5 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all">
          <div className="h-12 w-12 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white tabular-nums">
              {dynamicKpis.preCleared}
            </div>
            <div className="text-xs font-normal text-slate-500 dark:text-slate-400 mt-0.5 truncate">
              {language === 'hi' ? 'स्वीकृत (पूर्व-जांच)' : 'Cleared (Pre-Scrutiny)'}
            </div>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 tabular-nums">
                {dynamicKpis.preClearedPct}
              </span>
              <div className="h-1.5 flex-1 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '66.3%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Rectifiable Deficiencies */}
        <div className="liquid-glass-card rounded-[18px] p-4 flex items-center gap-3.5 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all">
          <div className="h-12 w-12 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white tabular-nums">
              {dynamicKpis.deficienciesIssued}
            </div>
            <div className="text-xs font-normal text-slate-500 dark:text-slate-400 mt-0.5 truncate">
              {language === 'hi' ? 'सुधार योग्य कमियां' : 'Rectifiable Deficiencies'}
            </div>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 tabular-nums">
                {dynamicKpis.deficienciesTrend}
              </span>
              <div className="h-1.5 flex-1 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: '24.5%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Card 4: Fatal Forgery Alerts */}
        <div className="liquid-glass-card rounded-[18px] p-4 flex items-center gap-3.5 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all">
          <div className="h-12 w-12 rounded-xl bg-rose-500/15 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
            <AlertOctagon className="h-6 w-6" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white tabular-nums">
              {dynamicKpis.fatalFraud}
            </div>
            <div className="text-xs font-normal text-slate-500 dark:text-slate-400 mt-0.5 truncate">
              {language === 'hi' ? 'गंभीर जालसाजी अलर्ट' : 'Fatal Forgery Alerts'}
            </div>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 tabular-nums">
                {dynamicKpis.fatalFraudTrend}
              </span>
              <div className="h-1.5 flex-1 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-rose-500 rounded-full" style={{ width: '3.1%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Card 5: Cross-Campus Matches */}
        <div className="liquid-glass-card rounded-[18px] p-4 flex items-center gap-3.5 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all">
          <div className="h-12 w-12 rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
            <Building2 className="h-6 w-6" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white tabular-nums">
              {dynamicKpis.ghostFaculty}
            </div>
            <div className="text-xs font-normal text-slate-500 dark:text-slate-400 mt-0.5 truncate">
              {language === 'hi' ? 'क्रॉस-कैंपस मिलान' : 'Cross-Campus Matches'}
            </div>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-[11px] font-semibold text-purple-600 dark:text-purple-400 tabular-nums">
                {dynamicKpis.ghostFacultyPct}
              </span>
              <div className="h-1.5 flex-1 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full" style={{ width: '6.1%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* =========================================================================
          SECTION 3: RECENT DOSSIERS TABLE (LEFT) + ACTION REQUIRED PANEL (RIGHT)
          (Matching Image 2 Middle Section with Pixel Precision)
          ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
        {/* Left: Recent Dossiers Table (8 Cols) */}
        <div className="lg:col-span-8 liquid-glass-card rounded-[20px] p-4 sm:p-5 space-y-3.5 shadow-sm">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200/70 dark:border-slate-800/70">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              {language === 'hi' ? 'हाल के डोजियर' : 'Recent Dossiers'}
            </h2>
            <Link
              href="/applications"
              className="text-xs font-semibold text-blue-600 dark:text-sky-400 hover:underline"
            >
              {language === 'hi' ? 'सभी देखें' : 'View All'}
            </Link>
          </div>

          <div className="w-full overflow-x-auto rounded-xl">
            <table className="w-full min-w-[620px] text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  <th className="py-2.5 px-3">#</th>
                  <th className="py-2.5 px-3">Institution Name</th>
                  <th className="py-2.5 px-3">State</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Received</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {recentDossiersList.map((dossier) => (
                  <tr
                    key={dossier.id}
                    className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors group"
                  >
                    <td className="py-3 px-3 font-mono font-medium text-slate-500 dark:text-slate-400">
                      {dossier.id}
                    </td>
                    <td className="py-3 px-3">
                      <Link
                        href={`/applications/${dossier.targetAppId}`}
                        className="font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-sky-400 transition-colors"
                      >
                        {dossier.name}
                      </Link>
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-600 dark:text-slate-300">
                      {dossier.state}
                    </td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-300">
                      {dossier.type}
                    </td>
                    <td className="py-3 px-3 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      {dossier.received}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${dossier.statusClass}`}>
                        {dossier.statusLabel}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <Link
                          href={`/applications/${dossier.targetAppId}`}
                          className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
                          title="Open Workbench"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleGenerateNoticeToast(dossier.targetAppId)}
                          className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors cursor-pointer"
                          title="Options"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Action Required Panel (4 Cols) */}
        <div className="lg:col-span-4 liquid-glass-card rounded-[20px] p-4 sm:p-5 space-y-3.5 shadow-sm">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200/70 dark:border-slate-800/70">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              {language === 'hi' ? 'कार्रवाई आवश्यक' : 'Action Required'}
            </h2>
            <Link
              href="/deficiencies"
              className="text-xs font-semibold text-blue-600 dark:text-sky-400 hover:underline"
            >
              {language === 'hi' ? 'सभी देखें' : 'View All'}
            </Link>
          </div>

          <div className="space-y-3">
            {/* Action Item 1 */}
            <Link
              href="/applications/AICTE-2026-NW-0842"
              className="p-3 rounded-2xl glass-well hover:border-rose-500/40 flex items-start gap-3 transition-all group block shadow-2xs"
            >
              {/* Document Thumbnail with simulated page lines */}
              <div className="w-11 h-14 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex flex-col justify-between p-1.5 shrink-0 shadow-xs">
                <div className="space-y-1">
                  <div className="h-1 w-full bg-rose-500/70 rounded-full" />
                  <div className="h-1 w-3/4 bg-slate-300 dark:bg-slate-600 rounded-full" />
                  <div className="h-1 w-5/6 bg-slate-300 dark:bg-slate-600 rounded-full" />
                </div>
                <div className="h-2 w-2 rounded-full bg-rose-500 self-end animate-pulse" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="px-1.5 py-0.2 rounded-md bg-rose-500/15 text-rose-600 dark:text-rose-400 text-[10px] font-bold">
                    Forgery Alert
                  </span>
                  <span className="px-1.5 py-0.2 rounded-md bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-medium">
                    Fire NOC
                  </span>
                  <span className="ml-auto text-[10.5px] text-slate-400 font-mono">2 hrs ago</span>
                </div>
                <div className="font-bold text-xs text-slate-900 dark:text-white truncate group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                  Apex Institute of Technology
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                  Expiry year altered (2027 over 2024)
                </div>
              </div>
            </Link>

            {/* Action Item 2 */}
            <Link
              href="/infrastructure"
              className="p-3 rounded-2xl glass-well hover:border-amber-500/40 flex items-start gap-3 transition-all group block shadow-2xs"
            >
              {/* Blueprint Thumbnail */}
              <div className="w-11 h-14 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex flex-col justify-between p-1.5 shrink-0 shadow-xs">
                <div className="h-full w-full border border-dashed border-amber-500/60 rounded flex items-center justify-center">
                  <div className="h-3 w-4 bg-amber-500/20" />
                </div>
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="px-1.5 py-0.2 rounded-md bg-amber-500/15 text-amber-700 dark:text-amber-400 text-[10px] font-bold">
                    Area Mismatch
                  </span>
                  <span className="px-1.5 py-0.2 rounded-md bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-medium">
                    Floor Plan
                  </span>
                  <span className="ml-auto text-[10.5px] text-slate-400 font-mono">4 hrs ago</span>
                </div>
                <div className="font-bold text-xs text-slate-900 dark:text-white truncate group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                  Shivam College of Engineering
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                  Lab area 47.8 m² (claimed 66 m²)
                </div>
              </div>
            </Link>

            {/* Action Item 3 */}
            <Link
              href="/authority-bridge#faculty"
              className="p-3 rounded-2xl glass-well hover:border-purple-500/40 flex items-start gap-3 transition-all group block shadow-2xs"
            >
              {/* Faculty Roster Thumbnail */}
              <div className="w-11 h-14 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex flex-col justify-between p-1.5 shrink-0 shadow-xs">
                <div className="space-y-1">
                  <div className="h-1 w-full bg-purple-500/70 rounded-full" />
                  <div className="h-1 w-2/3 bg-slate-300 dark:bg-slate-600 rounded-full" />
                </div>
                <Users className="h-3.5 w-3.5 text-purple-500 self-end" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="px-1.5 py-0.2 rounded-md bg-purple-500/15 text-purple-700 dark:text-purple-400 text-[10px] font-bold">
                    Ghost Faculty
                  </span>
                  <span className="px-1.5 py-0.2 rounded-md bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-medium">
                    Faculty Roster
                  </span>
                  <span className="ml-auto text-[10.5px] text-slate-400 font-mono">6 hrs ago</span>
                </div>
                <div className="font-bold text-xs text-slate-900 dark:text-white truncate group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  Cross-institution match found
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                  Same faculty PAN in 3 institutions
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* =========================================================================
          SECTION 4: 4 ACTION LAUNCHPAD CARDS (Exact match to Image 2)
          ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Launchpad 1: Document Intelligence */}
        <div className="liquid-glass-card rounded-[20px] p-4 flex flex-col justify-between space-y-3.5 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-xl bg-blue-500/15 text-blue-600 dark:text-sky-400 flex items-center justify-center shrink-0">
              <ScanText className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Document Intelligence
              </h3>
              <p className="text-[11.5px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                OCR, layout &amp; table analysis with regulatory field extraction
              </p>
            </div>
          </div>
          <Link
            href="/applications/AICTE-2026-NW-0842"
            className="btn-liquid-primary w-full py-2 px-3 rounded-xl text-xs font-bold text-center inline-flex items-center justify-center gap-1.5 shadow-xs"
          >
            <span>Analyze Documents</span>
            <span>→</span>
          </Link>
        </div>

        {/* Launchpad 2: Forensic Analysis */}
        <div className="liquid-glass-card rounded-[20px] p-4 flex flex-col justify-between space-y-3.5 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-xl bg-rose-500/15 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
              <Fingerprint className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Forensic Analysis
              </h3>
              <p className="text-[11.5px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                Detect tampering with ELA, DCT, metadata &amp; copy-move
              </p>
            </div>
          </div>
          <Link
            href="/forensics"
            className="btn-liquid-primary w-full py-2 px-3 rounded-xl text-xs font-bold text-center inline-flex items-center justify-center gap-1.5 shadow-xs"
          >
            <span>Run Forensic Scan</span>
            <span>→</span>
          </Link>
        </div>

        {/* Launchpad 3: Blueprint Analysis */}
        <div className="liquid-glass-card rounded-[20px] p-4 flex flex-col justify-between space-y-3.5 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Compass className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Blueprint Analysis
              </h3>
              <p className="text-[11.5px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                Room segmentation, scale calibration &amp; area calculation
              </p>
            </div>
          </div>
          <Link
            href="/infrastructure"
            className="btn-liquid-primary w-full py-2 px-3 rounded-xl text-xs font-bold text-center inline-flex items-center justify-center gap-1.5 shadow-xs"
          >
            <span>Analyze Floor Plans</span>
            <span>→</span>
          </Link>
        </div>

        {/* Launchpad 4: Faculty Verification */}
        <div className="liquid-glass-card rounded-[20px] p-4 flex flex-col justify-between space-y-3.5 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Faculty Verification
              </h3>
              <p className="text-[11.5px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                Cross-check with DigiLocker, EPFO &amp; state records
              </p>
            </div>
          </div>
          <Link
            href="/faculty"
            className="btn-liquid-primary w-full py-2 px-3 rounded-xl text-xs font-bold text-center inline-flex items-center justify-center gap-1.5 shadow-xs"
          >
            <span>Verify Faculty</span>
            <span>→</span>
          </Link>
        </div>
      </div>


      {/* =========================================================================
          SECTION 5: STATUTORY EVIDENCE VAULT (Streamlined & Clean) (PROTECTED 21ST.DEV 3D GLASS FOLDERS)
          (Seamlessly integrated into both light and dark themes)
          ========================================================================= */}
      <section className="liquid-glass-card rounded-[20px] p-4 sm:p-5 space-y-3.5 shadow-sm border border-slate-200/90 dark:border-slate-800/90 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/70 dark:border-slate-800/70 pb-3">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-sky-400 shrink-0">
              <FolderArchive className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                {language === 'hi' ? 'सांविधिक साक्ष्य वॉल्ट' : 'Statutory Evidence Vault'}
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold border border-emerald-500/20">
                Interactive 3D
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            <button
              onClick={() => setIsVaultSectionOpen((p) => !p)}
              className="btn-liquid-secondary px-3 py-1.5 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <span>{isVaultSectionOpen ? 'Collapse Vaults' : 'Expand Vaults'}</span>
              {isVaultSectionOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
            <Link
              href="/applications"
              className="btn-liquid-primary px-3 py-1.5 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 shadow-2xs"
            >
              <span>All Folders</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {isVaultSectionOpen && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 pt-2 items-start">
            {/* Vault 1: Fatal Forgery Dossiers */}
            <div className="p-4 rounded-2xl glass-well flex flex-col items-center justify-between space-y-3.5 border-t-2 border-t-rose-500 shadow-xs">
              <div className="w-full space-y-1">
                <div className="flex items-center justify-between">
                  <span className="pill-fatal text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                    <ShieldAlert className="w-3 h-3 text-rose-600 animate-pulse" />
                    RPN ≥ 850 Gate Veto
                  </span>
                  <span className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400">
                    148 Alerts
                  </span>
                </div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white pt-0.5">
                  Fatal Forgery Dossiers
                </h3>
              </div>

              {/* 3D GlassFolder Ember (Protected Component) */}
              <div className="py-2 flex justify-center w-full overflow-visible">
                <GlassFolder
                  width={vaultFolderWidth}
                  tone={folderTone}
                  art="ember"
                  label="Fatal Forgeries"
                  meta="3 Critical Dossiers"
                  files={[
                    {
                      name: 'NW-0842 Fire NOC (Spliced 2027).pdf',
                      meta: 'RPN 912 · 97.4% Tamper Risk',
                      art: 'ember',
                      href: '/applications/AICTE-2026-NW-0842',
                    },
                    {
                      name: 'EPFO UAN Dual-Employment Roll.csv',
                      meta: '3 Ghost Faculty Flagged',
                      art: 'dusk',
                      href: '/applications/AICTE-2026-NW-0842',
                    },
                    {
                      name: 'Land Sale Deed Index-II Splicing.pdf',
                      meta: '2.1 vs 2.5 Contiguous Acres',
                      art: 'ember',
                      href: '/applications/AICTE-2026-NW-0842',
                    },
                  ]}
                  action="more"
                  menu={[
                    {
                      label: 'Open in Scrutiny Workbench',
                      onSelect: () => router.push('/applications/AICTE-2026-NW-0842'),
                    },
                    {
                      label: 'Verify via Authority Bridge',
                      onSelect: () => router.push('/authority-bridge'),
                    },
                    {
                      label: 'Escalate to SHC Show-Cause',
                      danger: true,
                      onSelect: () => handleGenerateNoticeToast('AICTE-2026-NW-0842'),
                    },
                  ]}
                  onFileSelect={(file) => {
                    toast.info(`Opening Fatal Anomaly: ${file.name}`, {
                      description: 'Opening forensic inspection canvas in Scrutiny Workbench...',
                    });
                    router.push('/applications/AICTE-2026-NW-0842');
                  }}
                />
              </div>

              <div className="w-full pt-2.5 border-t border-slate-200/70 dark:border-slate-800/70 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-500 font-mono">3 Inactive / Quarantined</span>
                <Link
                  href="/deficiencies?appId=AICTE-2026-NW-0842"
                  className="font-bold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1"
                >
                  <span>Draft Form-B Order</span>
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              </div>
            </div>

            {/* Vault 2: EVC Rectification Queue */}
            <div className="p-4 rounded-2xl glass-well flex flex-col items-center justify-between space-y-3.5 border-t-2 border-t-amber-500 shadow-xs">
              <div className="w-full space-y-1">
                <div className="flex items-center justify-between">
                  <span className="pill-deficiency text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-600" />
                    15-Day Clock Active
                  </span>
                  <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
                    42 In Rectification
                  </span>
                </div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white pt-0.5">
                  EVC Rectification Queue
                </h3>
              </div>

              {/* 3D GlassFolder Dusk (Protected Component) */}
              <div className="py-2 flex justify-center w-full overflow-visible">
                <GlassFolder
                  width={vaultFolderWidth}
                  tone={folderTone}
                  art="dusk"
                  label="EVC Shortfalls"
                  meta="4 Pending Filings"
                  files={[
                    {
                      name: 'CAD Lab Floor Polygon Deficit.dwg',
                      meta: '48.0 m² actual vs 66.0 m² label',
                      art: 'dusk',
                      href: '/applications/AICTE-2026-SO-0914',
                    },
                    {
                      name: 'Cadre Ratio Professor Shortfall.pdf',
                      meta: 'Prof 2/7 · SFR UG 1:27.2',
                      art: 'aurora',
                      href: '/applications/AICTE-2026-SO-0914',
                    },
                    {
                      name: 'State Jamabandi Revenue Survey.pdf',
                      meta: 'Plot Contiguity Gap (0.42 km)',
                      art: 'glacier',
                      href: '/applications/AICTE-2026-SO-0914',
                    },
                  ]}
                  action="more"
                  menu={[
                    {
                      label: 'Open in Scrutiny Workbench',
                      onSelect: () => router.push('/applications/AICTE-2026-SO-0914'),
                    },
                    {
                      label: 'Verify via Authority Bridge',
                      onSelect: () => router.push('/authority-bridge'),
                    },
                    {
                      label: 'Dispatch 15-Day Form-A Notice',
                      onSelect: () => handleGenerateNoticeToast('AICTE-2026-SO-0914'),
                    },
                  ]}
                  onFileSelect={(file) => {
                    toast.info(`Opening Rectification Dossier: ${file.name}`, {
                      description: 'Loading Blueprint CV & CAD vector viewer...',
                    });
                    router.push('/applications/AICTE-2026-SO-0914');
                  }}
                />
              </div>

              <div className="w-full pt-2.5 border-t border-slate-200/70 dark:border-slate-800/70 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-500 font-mono">14d 23h Remaining</span>
                <Link
                  href="/deficiencies?appId=AICTE-2026-SO-0914"
                  className="font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
                >
                  <span>Form-A Notice</span>
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              </div>
            </div>

            {/* Vault 3: Auto-Cleared 3-Year EoA Vault */}
            <div className="p-4 rounded-2xl glass-well flex flex-col items-center justify-between space-y-3.5 border-t-2 border-t-emerald-500 shadow-xs">
              <div className="w-full space-y-1">
                <div className="flex items-center justify-between">
                  <span className="pill-verified text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    Zero Shortfall Verified
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    68.4% Auto-Cleared
                  </span>
                </div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white pt-0.5">
                  Auto-Cleared 3-Year EoA
                </h3>
              </div>

              {/* 3D GlassFolder Verdant (Protected Component) */}
              <div className="py-2 flex justify-center w-full overflow-visible">
                <GlassFolder
                  width={vaultFolderWidth}
                  tone={folderTone}
                  art="verdant"
                  label="Approved 3-Yr EoA"
                  meta="5 Verified Deeds"
                  files={[
                    {
                      name: 'DigiLocker Certified Land Deed.pdf',
                      meta: '12.4 Acres Contiguous · Verified',
                      art: 'verdant',
                      href: '/applications/AICTE-2026-WE-0721',
                    },
                    {
                      name: 'EPFO ECR Clean Payroll Roll.csv',
                      meta: '124 Faculty · 0 UAN Conflicts',
                      art: 'glacier',
                      href: '/applications/AICTE-2026-WE-0721',
                    },
                    {
                      name: 'Smart Campus Green FSI Rating.pdf',
                      meta: 'FSI 1.68 vs Sanctioned 2.0',
                      art: 'verdant',
                      href: '/applications/AICTE-2026-WE-0721',
                    },
                  ]}
                  action="more"
                  menu={[
                    {
                      label: 'Open in Scrutiny Workbench',
                      onSelect: () => router.push('/applications/AICTE-2026-WE-0721'),
                    },
                    {
                      label: 'Verify via Authority Bridge',
                      onSelect: () => router.push('/authority-bridge'),
                    },
                    {
                      label: 'Print Statutory Approval Letter',
                      onSelect: () => {
                        toast.success('Generated 3-Year EoA Approval Certificate for AICTE-2026-WE-0721');
                        router.push('/deficiencies?appId=AICTE-2026-WE-0721');
                      },
                    },
                  ]}
                  onFileSelect={(file) => {
                    toast.info(`Opening Compliant Dossier: ${file.name}`, {
                      description: 'Inspecting verified statutory credentials...',
                    });
                    router.push('/applications/AICTE-2026-WE-0721');
                  }}
                />
              </div>

              <div className="w-full pt-2.5 border-t border-slate-200/70 dark:border-slate-800/70 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-500 font-mono">Valid 2024–2027</span>
                <Link
                  href="/authority-bridge"
                  className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                >
                  <span>DPI Proofs</span>
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* =========================================================================
          SECTION 6: BOTTOM ROW (SCRUTINY OVERVIEW LINE CHART + DONUT + INDIA MAP)
          (Exact Match to Image 2 Bottom Layout)
          ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
        {/* Left: Scrutiny Overview Multi-Line Trend Chart (5 Cols) */}
        <div className="lg:col-span-5 liquid-glass-card rounded-[20px] p-4 sm:p-5 space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              {language === 'hi' ? 'जांच अवलोकन' : 'Scrutiny Overview'}
            </h3>
            <select
              value={chartTimespan}
              onChange={(e) => setChartTimespan(e.target.value)}
              className="glass-well rounded-lg px-2 py-1 text-[11px] font-semibold text-slate-700 dark:text-slate-300 cursor-pointer"
            >
              <option value="Last 7 Days">Last 7 Days</option>
              <option value="Last 14 Days">Last 14 Days</option>
              <option value="Last 30 Days">Last 30 Days</option>
            </select>
          </div>

          {/* SVG Multi-Line Chart with High-Definition Coordinate Geometry */}
          <div className="w-full pt-1">
            <svg viewBox="0 0 420 180" className="w-full h-44 select-none overflow-visible">
              <defs>
                <linearGradient id="chartBlueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="30" y1="20" x2="400" y2="20" stroke="currentColor" strokeOpacity="0.08" />
              <line x1="30" y1="60" x2="400" y2="60" stroke="currentColor" strokeOpacity="0.08" />
              <line x1="30" y1="100" x2="400" y2="100" stroke="currentColor" strokeOpacity="0.08" />
              <line x1="30" y1="140" x2="400" y2="140" stroke="currentColor" strokeOpacity="0.08" />

              {/* Y Axis Numbers */}
              <text x="24" y="24" textAnchor="end" fontSize="9.5" className="fill-slate-400">150</text>
              <text x="24" y="64" textAnchor="end" fontSize="9.5" className="fill-slate-400">100</text>
              <text x="24" y="104" textAnchor="end" fontSize="9.5" className="fill-slate-400">50</text>
              <text x="24" y="144" textAnchor="end" fontSize="9.5" className="fill-slate-400">0</text>

              {/* 1. Dossiers Curve (Blue) */}
              <path
                d="M50 78 Q110 55 170 65 T290 48 T390 35"
                fill="none"
                stroke="#38BDF8"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <circle cx="50" cy="78" r="3.5" fill="#38BDF8" />
              <circle cx="120" cy="62" r="3.5" fill="#38BDF8" />
              <circle cx="190" cy="65" r="3.5" fill="#38BDF8" />
              <circle cx="260" cy="55" r="3.5" fill="#38BDF8" />
              <circle cx="330" cy="48" r="3.5" fill="#38BDF8" />
              <circle cx="390" cy="35" r="4" fill="#38BDF8" className="animate-pulse" />

              {/* 2. Cleared Curve (Green) */}
              <path
                d="M50 115 Q110 110 170 102 T290 88 T390 82"
                fill="none"
                stroke="#34D399"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
              <circle cx="50" cy="115" r="3" fill="#34D399" />
              <circle cx="120" cy="110" r="3" fill="#34D399" />
              <circle cx="190" cy="102" r="3" fill="#34D399" />
              <circle cx="260" cy="94" r="3" fill="#34D399" />
              <circle cx="330" cy="88" r="3" fill="#34D399" />
              <circle cx="390" cy="82" r="3.5" fill="#34D399" />

              {/* 3. Deficiencies Curve (Amber) */}
              <path
                d="M50 128 Q110 125 170 120 T290 114 T390 108"
                fill="none"
                stroke="#FBBF24"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <circle cx="50" cy="128" r="2.5" fill="#FBBF24" />
              <circle cx="120" cy="125" r="2.5" fill="#FBBF24" />
              <circle cx="190" cy="120" r="2.5" fill="#FBBF24" />
              <circle cx="260" cy="117" r="2.5" fill="#FBBF24" />
              <circle cx="330" cy="114" r="2.5" fill="#FBBF24" />
              <circle cx="390" cy="108" r="3" fill="#FBBF24" />

              {/* 4. Forgery Alerts Curve (Red) */}
              <path
                d="M50 134 Q110 133 170 134 T290 131 T390 130"
                fill="none"
                stroke="#F87171"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <circle cx="50" cy="134" r="2.5" fill="#F87171" />
              <circle cx="120" cy="133" r="2.5" fill="#F87171" />
              <circle cx="190" cy="134" r="2.5" fill="#F87171" />
              <circle cx="260" cy="132" r="2.5" fill="#F87171" />
              <circle cx="330" cy="131" r="2.5" fill="#F87171" />
              <circle cx="390" cy="130" r="3" fill="#F87171" />

              {/* X Axis Labels */}
              <text x="50" y="160" textAnchor="middle" fontSize="9" className="fill-slate-400">10 Jan</text>
              <text x="120" y="160" textAnchor="middle" fontSize="9" className="fill-slate-400">11 Jan</text>
              <text x="190" y="160" textAnchor="middle" fontSize="9" className="fill-slate-400">12 Jan</text>
              <text x="260" y="160" textAnchor="middle" fontSize="9" className="fill-slate-400">13 Jan</text>
              <text x="330" y="160" textAnchor="middle" fontSize="9" className="fill-slate-400">14 Jan</text>
              <text x="390" y="160" textAnchor="middle" fontSize="9" className="fill-slate-400">15 Jan</text>
            </svg>

            {/* Legend matching Image 2 */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-[10.5px] font-semibold text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-sky-400" />
                <span>Dossiers</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                <span>Cleared</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-amber-400" />
                <span>Deficiencies</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-rose-400" />
                <span>Forgery Alerts</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center: Dossier Category Distribution Donut Chart (4 Cols) */}
        <div className="lg:col-span-4 liquid-glass-card rounded-[20px] p-4 sm:p-5 space-y-3 shadow-sm">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">
            {language === 'hi' ? 'डोजियर श्रेणी वितरण' : 'Dossier Category Distribution'}
          </h3>

          <div className="flex items-center justify-between gap-3 pt-2">
            {/* SVG Donut */}
            <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                {/* Background Ring */}
                <circle cx="50" cy="50" r="38" fill="none" stroke="currentColor" strokeOpacity="0.08" strokeWidth="14" />
                {/* Slice 1: New Approval (38%) -> strokeDasharray="90.7 238.7" */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="none"
                  stroke="#38BDF8"
                  strokeWidth="14"
                  strokeDasharray="90.7 238.7"
                  strokeDashoffset="0"
                />
                {/* Slice 2: Renewal (27%) -> 64.4 */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="none"
                  stroke="#34D399"
                  strokeWidth="14"
                  strokeDasharray="64.4 238.7"
                  strokeDashoffset="-90.7"
                />
                {/* Slice 3: Extension (18%) -> 43.0 */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="none"
                  stroke="#F59E0B"
                  strokeWidth="14"
                  strokeDasharray="43.0 238.7"
                  strokeDashoffset="-155.1"
                />
                {/* Slice 4: Increase in Intake (11%) -> 26.3 */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="none"
                  stroke="#A855F7"
                  strokeWidth="14"
                  strokeDasharray="26.3 238.7"
                  strokeDashoffset="-198.1"
                />
                {/* Slice 5: Others (6%) -> 14.3 */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="none"
                  stroke="#64748B"
                  strokeWidth="14"
                  strokeDasharray="14.3 238.7"
                  strokeDashoffset="-224.4"
                />
              </svg>
              {/* Central Donut Hole Metric */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-base font-black text-slate-900 dark:text-white tabular-nums leading-none">
                  4,820
                </span>
                <span className="text-[10px] text-slate-400 font-semibold mt-0.5">
                  Total
                </span>
              </div>
            </div>

            {/* Slices Legend matching Image 2 */}
            <div className="space-y-1.5 text-xs flex-1">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-medium">
                  <span className="h-2 w-2 rounded-full bg-sky-400" />
                  <span>New Approval</span>
                </span>
                <span className="font-bold text-slate-900 dark:text-white tabular-nums">38%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-medium">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  <span>Renewal</span>
                </span>
                <span className="font-bold text-slate-900 dark:text-white tabular-nums">27%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-medium">
                  <span className="h-2 w-2 rounded-full bg-amber-500" />
                  <span>Extension</span>
                </span>
                <span className="font-bold text-slate-900 dark:text-white tabular-nums">18%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-medium">
                  <span className="h-2 w-2 rounded-full bg-purple-500" />
                  <span>Increase in Intake</span>
                </span>
                <span className="font-bold text-slate-900 dark:text-white tabular-nums">11%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-medium">
                  <span className="h-2 w-2 rounded-full bg-slate-500" />
                  <span>Others</span>
                </span>
                <span className="font-bold text-slate-900 dark:text-white tabular-nums">6%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: State-wise Dossiers India Map Card (3 Cols) */}
        <div className="lg:col-span-3 liquid-glass-card rounded-[20px] p-4 sm:p-5 space-y-2.5 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              {language === 'hi' ? 'राज्यवार डोजियर' : 'State-wise Dossiers'}
            </h3>
            <Link
              href="/applications"
              className="text-xs font-semibold text-blue-600 dark:text-sky-400 hover:underline inline-flex items-center gap-1"
            >
              View Map
            </Link>
          </div>

          {/* India Vector Choropleth Map */}
          <IndiaChoroplethMap />

          {/* Choropleth Legend matching Image 2 */}
          <div className="grid grid-cols-2 gap-1.5 text-[10.5px] font-semibold text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-200/70 dark:border-slate-800/70">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-xs bg-sky-500" />
              <span>&gt; 500</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-xs bg-sky-600" />
              <span>200 – 500</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-xs bg-sky-800" />
              <span>100 – 200</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-xs bg-slate-300 dark:bg-slate-700" />
              <span>&lt; 100</span>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          INLINE MODAL: SPLIT-PANE FORENSIC EVIDENCE QUICK-LOOK MODAL
          ========================================================================= */}
      {quickLookApp && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-glass-in">
          <div className="liquid-glass-card rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-200 dark:border-slate-800 pb-3.5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-bold uppercase tracking-wider">
                    Forensic Evidence Quick-Look
                  </span>
                  <span className="text-xs text-rose-600 dark:text-rose-400 font-bold">
                    RPN {quickLookApp.maxRpn}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                  {quickLookApp.nameEn} ({quickLookApp.id})
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {quickLookApp.city}, {quickLookApp.state} • {quickLookApp.trustName}
                </p>
              </div>

              <button
                onClick={() => setQuickLookApp(null)}
                className="btn-liquid-secondary p-1.5 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Split-Pane Evidence Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left Pane: TruFor Noiseprint++ */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-700 text-white space-y-3 text-xs shadow-inner">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="font-bold text-sky-400 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-sky-400" />
                    <span>Forensic Alteration Heatmap</span>
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30">
                    SPLICED PATCH LOCALIZED
                  </span>
                </div>

                <div className="relative h-44 rounded-xl bg-slate-950 border border-slate-800 p-3 overflow-hidden flex flex-col justify-between">
                  <div className="text-[11px] text-slate-400">
                    Document Artifact: {quickLookApp.anomalies[0]?.documentTitle || 'Fire Safety NOC'}
                  </div>

                  <div className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-500/60 relative">
                    <div className="text-[10px] uppercase tracking-wider text-rose-400 font-bold mb-0.5">
                      Localized Tamper Bounding Box [64%, 42%, 88%, 48%]
                    </div>
                    <div className="text-sm font-bold text-rose-200">
                      &ldquo;{quickLookApp.anomalies[0]?.extractedValue || 'Valid Until: 30-06-2027'}&rdquo;
                    </div>
                    <span className="absolute top-2 right-2 text-[9px] px-1.5 py-0.5 rounded-full bg-rose-600 text-white font-bold animate-pulse">
                      γ = 20 ELA
                    </span>
                  </div>

                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>Shifted DCT Phase: (dx,dy)=(3,5)</span>
                    <span className="text-rose-400 font-bold">Conf: 98.4%</span>
                  </div>
                </div>

                <div className="text-xs text-slate-300 leading-relaxed">
                  <strong>Neural Diagnostic:</strong> 128×32 pixel patch inserted over authentic certificate body. Steganographic noise residual exhibits severe variance discontinuity against authentic substrate.
                </div>
              </div>

              {/* Right Pane: DigiLocker API Setu Diff */}
              <div className="p-4 rounded-2xl glass-well space-y-3 text-xs shadow-inner">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>DigiLocker Pull URI Handshake Diff</span>
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 font-bold border border-amber-500/20">
                    AUTHORITY MISMATCH
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/60">
                    <span className="text-[10px] uppercase text-rose-600 font-bold block mb-0.5">
                      Uploaded Dossier Declared Attribute (OCR):
                    </span>
                    <span className="font-bold text-rose-700 dark:text-rose-300 text-xs">
                      {quickLookApp.anomalies[0]?.extractedValue || 'Valid Until: 30-06-2027'}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/60">
                    <span className="text-[10px] uppercase text-emerald-600 font-bold block mb-0.5">
                      DigiLocker Authoritative Repository Record:
                    </span>
                    <span className="font-bold text-emerald-700 dark:text-emerald-300 text-xs">
                      {quickLookApp.anomalies[0]?.authorityValue || 'Expired 30-06-2024 (Reg: FS/2021/8841)'}
                    </span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl glass-well text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
                  <div>URI: in.gov.har.fire-NOC-2021-8841</div>
                  <div>Handshake Latency: 138 ms • Status: MISMATCH_DETECTED</div>
                  <div>PKI Signature: RSA-2048 Hash Invalid</div>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Recommended Action: Standing Hearing Committee Referral + 15-Day Statutory Notice
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <button
                  onClick={() => {
                    const id = quickLookApp.id;
                    setQuickLookApp(null);
                    router.push(`/applications/${id}`);
                  }}
                  className="btn-liquid-primary flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Launch Full Workbench</span>
                </button>

                <button
                  onClick={() => {
                    const id = quickLookApp.id;
                    setQuickLookApp(null);
                    router.push(`/deficiencies?appId=${id}`);
                  }}
                  className="btn-liquid-secondary flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer text-amber-700 dark:text-amber-400"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Generate Notice</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
