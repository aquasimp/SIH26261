'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage, useFilters } from '@/lib/context';
import { REGIONAL_STATS, MOCK_APPLICATIONS, InstitutionalApplication } from '@/lib/mock-data';
import { toast } from 'sonner';
import {
  ArrowUpRight,
  ArrowDownRight,
  ExternalLink,
  ChevronRight,
  RotateCcw,
  ShieldAlert,
  FileText,
  AlertTriangle,
  CheckCircle2,
  X,
  Eye,
  Activity,
  Layers,
  Sparkles,
} from 'lucide-react';

export default function OverviewPage() {
  const router = useRouter();
  const { t, language } = useLanguage();
  const { filters, filteredApplications, setFilters, applications } = useFilters();
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  // Quick-Look Forensic Modal State
  const [quickLookApp, setQuickLookApp] = useState<InstitutionalApplication | null>(null);

  // Dynamic KPI calculation reacting to active global filters and live application state mutations
  const activeRegionStat = REGIONAL_STATS.find((r) => r.region === filters.region);

  const dynamicKpis = useMemo(() => {
    // Calculate live mutation deltas against initial mock database
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
      const regionInitialApproved = MOCK_APPLICATIONS.filter(
        (a) => a.region === filters.region && a.scrutinyStatus === 'Auto-Pre-Cleared'
      ).length;
      const regionCurrentApproved = applications.filter(
        (a) => a.region === filters.region && a.scrutinyStatus === 'Auto-Pre-Cleared'
      ).length;
      const rApprovedDelta = regionCurrentApproved - regionInitialApproved;

      const regionInitialDef = MOCK_APPLICATIONS.filter(
        (a) => a.region === filters.region && a.scrutinyStatus === 'Deficiency Issued'
      ).length;
      const regionCurrentDef = applications.filter(
        (a) => a.region === filters.region && a.scrutinyStatus === 'Deficiency Issued'
      ).length;
      const rDefDelta = regionCurrentDef - regionInitialDef;

      const regionInitialFatal = MOCK_APPLICATIONS.filter(
        (a) => a.region === filters.region && a.scrutinyStatus === 'Fatal Fraud Alert'
      ).length;
      const regionCurrentFatal = applications.filter(
        (a) => a.region === filters.region && a.scrutinyStatus === 'Fatal Fraud Alert'
      ).length;
      const rFatalDelta = regionCurrentFatal - regionInitialFatal;

      const total = activeRegionStat.applications;
      const preCleared = Math.max(0, activeRegionStat.compliantCount + rApprovedDelta);
      const preClearedPct = ((preCleared / total) * 100).toFixed(1);
      const def = Math.max(0, activeRegionStat.rectifiableCount + rDefDelta);
      const fatal = Math.max(0, activeRegionStat.fatalFraudCount + rFatalDelta);
      const ghost = activeRegionStat.ghostFacultyCount;
      return {
        totalIngested: total.toLocaleString(),
        totalIngestedTrend: '+8.4%',
        preCleared: preCleared.toLocaleString(),
        preClearedPct: `${preClearedPct}%`,
        deficienciesIssued: def.toLocaleString(),
        deficienciesTrend: '-3.2%',
        fatalFraud: fatal.toLocaleString(),
        fatalFraudTrend: '+14.2%',
        ghostFaculty: ghost.toLocaleString(),
        ghostColleges: `${Math.round(ghost * 0.32)} Clgs`,
        authorityRate: '98.2%',
        authorityLatency: '148ms avg',
      };
    }

    const totalApps = REGIONAL_STATS.reduce((acc, r) => acc + r.applications, 0); // 4,820
    const compliant = Math.max(0, REGIONAL_STATS.reduce((acc, r) => acc + r.compliantCount, 0) + approvedDelta);
    const def = Math.max(0, REGIONAL_STATS.reduce((acc, r) => acc + r.rectifiableCount, 0) + defDelta);
    const fatal = Math.max(0, REGIONAL_STATS.reduce((acc, r) => acc + r.fatalFraudCount, 0) + fatalDelta);
    const ghost = REGIONAL_STATS.reduce((acc, r) => acc + r.ghostFacultyCount, 0); // 296

    return {
      totalIngested: totalApps.toLocaleString(),
      totalIngestedTrend: '+12.4%',
      preCleared: compliant.toLocaleString(),
      preClearedPct: `${((compliant / totalApps) * 100).toFixed(1)}%`,
      deficienciesIssued: def.toLocaleString(),
      deficienciesTrend: '-4.1%',
      fatalFraud: fatal.toLocaleString(),
      fatalFraudTrend: '+18.9%',
      ghostFaculty: ghost.toLocaleString(),
      ghostColleges: '94 Clgs',
      authorityRate: '98.4%',
      authorityLatency: '142ms avg',
    };
  }, [activeRegionStat, applications, filters.region]);

  // High risk applications sorted by RPN
  const highRiskQueue = useMemo(() => {
    return [...filteredApplications].sort((a, b) => b.maxRpn - a.maxRpn);
  }, [filteredApplications]);

  // Highest RPN dossier bound dynamically for Priority Alert banner
  const highestRpnDossier = useMemo(() => {
    return highRiskQueue[0] || applications[0] || MOCK_APPLICATIONS[0];
  }, [highRiskQueue, applications]);

  const handleRegionClick = (regionName: string) => {
    if (filters.region === regionName) {
      setFilters((prev) => ({ ...prev, region: 'All Regions (8)' }));
      setSelectedRegion(null);
      toast.info('Cleared region filter — Showing All 8 Regions');
    } else {
      setSelectedRegion(regionName);
      setFilters((prev) => ({ ...prev, region: regionName }));
      toast.info(`Filtered view by AICTE Region: ${regionName}`);
    }
  };

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

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-0.5">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] font-bold text-sky-700 dark:text-sky-400 uppercase tracking-widest">
              AICTE REGULATORY SCRUTINY WORKSTATION
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text-primary)]">
            Institutional Regulatory Scrutiny{' '}
            <span className="title-serif-italic text-sky-700 dark:text-sky-400">
              Intelligence
            </span>
          </h1>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Evidence-Linked Document Authentication, Forensic Tampering Localization &amp; Infrastructure Verification (APH 2024–27)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/applications"
            className="btn-glass-subtle inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold"
          >
            <span>All Dossiers</span>
            <span className="font-mono text-[10.5px] text-[var(--text-muted)]">4,820</span>
            <ChevronRight className="w-3.5 h-3.5 text-[var(--text-faint)]" />
          </Link>
        </div>
      </div>

      {/* =========================================================================
          ROW 1: UNIFIED 6-COLUMN METRIC GRID
          (2px Top Severity Rules, Locked Baseline Trend Pills, Tabular Numerals)
          ========================================================================= */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 divide-y sm:divide-y-0 sm:divide-x divide-[var(--glass-border)] liquid-glass-card rounded-xl overflow-hidden shadow-sm">
        {/* Metric 1: Ingested */}
        <div className="top-rule-registry p-3.5 bg-[var(--glass-bg)] hover:bg-[var(--glass-bg-elevated)] transition-colors flex flex-col justify-between">
          <div className="text-[10.5px] font-mono font-semibold uppercase tracking-wider text-[var(--text-muted)] line-clamp-1">
            {t.kpiTotalIngested}
          </div>
          <div className="flex items-baseline justify-between gap-1.5 my-1">
            <span className="metric-value text-[var(--text-primary)]">{dynamicKpis.totalIngested}</span>
            <span className="px-1.5 py-0.2 rounded border border-indigo-500/30 bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 text-[10.5px] font-mono font-bold inline-flex items-center gap-0.5">
              <ArrowUpRight className="w-2.5 h-2.5" />
              {dynamicKpis.totalIngestedTrend}
            </span>
          </div>
          <div className="text-[10.5px] font-mono text-[var(--text-muted)] truncate">
            {filters.region !== 'All Regions (8)' ? `Scope: ${filters.region}` : t.kpiTotalIngestedSub}
          </div>
        </div>

        {/* Metric 2: Pre-Cleared */}
        <div className="top-rule-verified p-3.5 bg-[var(--glass-bg)] hover:bg-[var(--glass-bg-elevated)] transition-colors flex flex-col justify-between">
          <div className="text-[10.5px] font-mono font-semibold uppercase tracking-wider text-[var(--text-muted)] line-clamp-1">
            {t.kpiPreCleared}
          </div>
          <div className="flex items-baseline justify-between gap-1.5 my-1">
            <span className="metric-value text-emerald-700 dark:text-emerald-400">{dynamicKpis.preCleared}</span>
            <span className="px-1.5 py-0.2 rounded border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-[10.5px] font-mono font-bold inline-flex items-center gap-0.5">
              {dynamicKpis.preClearedPct}
            </span>
          </div>
          <div className="text-[10.5px] font-mono text-[var(--text-muted)] truncate">
            {t.kpiPreClearedSub}
          </div>
        </div>

        {/* Metric 3: Deficiencies Issued */}
        <div className="top-rule-deficiency p-3.5 bg-[var(--glass-bg)] hover:bg-[var(--glass-bg-elevated)] transition-colors flex flex-col justify-between">
          <div className="text-[10.5px] font-mono font-semibold uppercase tracking-wider text-[var(--text-muted)] line-clamp-1">
            {t.kpiDeficienciesIssued}
          </div>
          <div className="flex items-baseline justify-between gap-1.5 my-1">
            <span className="metric-value text-amber-700 dark:text-amber-400">{dynamicKpis.deficienciesIssued}</span>
            <span className="px-1.5 py-0.2 rounded border border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300 text-[10.5px] font-mono font-bold inline-flex items-center gap-0.5">
              <ArrowDownRight className="w-2.5 h-2.5" />
              {dynamicKpis.deficienciesTrend}
            </span>
          </div>
          <div className="text-[10.5px] font-mono text-[var(--text-muted)] truncate">
            {t.kpiDeficienciesIssuedSub}
          </div>
        </div>

        {/* Metric 4: Fatal Forgery */}
        <div className="top-rule-fatal p-3.5 bg-[var(--glass-bg)] hover:bg-[var(--glass-bg-elevated)] transition-colors flex flex-col justify-between">
          <div className="text-[10.5px] font-mono font-semibold uppercase tracking-wider text-[var(--text-muted)] line-clamp-1">
            {t.kpiFatalFraud}
          </div>
          <div className="flex items-baseline justify-between gap-1.5 my-1">
            <span className="metric-value text-red-600 dark:text-red-400">{dynamicKpis.fatalFraud}</span>
            <span className="px-1.5 py-0.2 rounded border border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300 text-[10.5px] font-mono font-bold inline-flex items-center gap-0.5">
              <ArrowUpRight className="w-2.5 h-2.5" />
              {dynamicKpis.fatalFraudTrend}
            </span>
          </div>
          <div className="text-[10.5px] font-mono text-[var(--text-muted)] truncate">
            {t.kpiFatalFraudSub}
          </div>
        </div>

        {/* Metric 5: Ghost Faculty */}
        <div className="top-rule-fatal p-3.5 bg-[var(--glass-bg)] hover:bg-[var(--glass-bg-elevated)] transition-colors flex flex-col justify-between">
          <div className="text-[10.5px] font-mono font-semibold uppercase tracking-wider text-[var(--text-muted)] line-clamp-1">
            {t.kpiGhostFaculty}
          </div>
          <div className="flex items-baseline justify-between gap-1.5 my-1">
            <span className="metric-value text-red-600 dark:text-red-400">{dynamicKpis.ghostFaculty}</span>
            <span className="px-1.5 py-0.2 rounded border border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300 text-[10.5px] font-mono font-bold inline-flex items-center gap-0.5">
              {dynamicKpis.ghostColleges}
            </span>
          </div>
          <div className="text-[10.5px] font-mono text-[var(--text-muted)] truncate">
            {t.kpiGhostFacultySub}
          </div>
        </div>

        {/* Metric 6: Authority Live */}
        <div className="top-rule-verified p-3.5 bg-[var(--glass-bg)] hover:bg-[var(--glass-bg-elevated)] transition-colors flex flex-col justify-between">
          <div className="text-[10.5px] font-mono font-semibold uppercase tracking-wider text-[var(--text-muted)] line-clamp-1">
            {t.kpiAuthorityLive}
          </div>
          <div className="flex items-baseline justify-between gap-1.5 my-1">
            <span className="metric-value text-emerald-700 dark:text-emerald-400">{dynamicKpis.authorityRate}</span>
            <span className="px-1.5 py-0.2 rounded border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-[10.5px] font-mono font-bold inline-flex items-center gap-0.5">
              {dynamicKpis.authorityLatency}
            </span>
          </div>
          <div className="text-[10.5px] font-mono text-[var(--text-muted)] truncate">
            {t.kpiAuthorityLiveSub}
          </div>
        </div>
      </section>

      {/* =========================================================================
          ROW 2: PRIORITY INTERVENTION / HIGH-RISK ALERT BANNER
          (Dual Pulsing Radar Dot, Dynamic Highest-RPN Dossier Binding, Forensic Modal)
          ========================================================================= */}
      <section className="glass-interactive border border-red-500/30 bg-red-500/5 dark:bg-red-950/20 rounded-xl p-3 sm:p-3.5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-start gap-3 min-w-0">
          {/* Dual Pulsing Radar Dot */}
          <div className="relative flex h-3 w-3 mt-1 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="animate-pulse absolute inline-flex h-2.5 w-2.5 rounded-full bg-red-500 opacity-90"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
          </div>

          <div className="space-y-0.5 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-1.5 py-0.2 text-[9.5px] font-mono font-bold tracking-wider uppercase rounded bg-red-600 text-white shadow-2xs">
                CRITICAL RPN {highestRpnDossier.maxRpn} • APH CH-VII VIOLATION
              </span>
              <span className="text-xs font-semibold text-red-700 dark:text-red-300 font-mono">
                SEC_APH_VII: FATAL_FORGERY_DETECTED
              </span>
            </div>
            <p className="text-xs sm:text-[13px] font-medium text-[var(--text-primary)] leading-snug">
              {highestRpnDossier.anomalies[0]?.titleEn || 'Campus Land Deed Survey Alteration & Fire NOC Date Splicing Detected'} —{' '}
              <span className="font-bold">{highestRpnDossier.nameEn}</span> (PID: {highestRpnDossier.pid}) —{' '}
              <span className="font-mono text-red-600 dark:text-red-400 font-bold">
                {Math.round((highestRpnDossier.anomalies[0]?.tamperProbability || 0.984) * 100)}% TruFor Confidence
              </span> — Standing Hearing Committee &amp; Physical EVC Recommended
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
          {/* View Forensic Evidence Quick-Look Modal Button */}
          <button
            onClick={() => setQuickLookApp(highestRpnDossier)}
            className="btn-obsidian flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold shadow-xs cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{t.btnViewEvidence}</span>
          </button>
          {/* Generate Show-Cause Notice Button */}
          <button
            onClick={() => handleGenerateNoticeToast(highestRpnDossier.id)}
            className="btn-glass-subtle flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-amber-600" />
            <span>{t.btnGenerateNotice}</span>
          </button>
        </div>
      </section>

      {/* =========================================================================
          ROW 3: ASYMMETRIC 12-COLUMN GRID
          (Left 7 Cols: 8-Region Scrutiny Matrix • Right 5 Cols: Subsystems & DPI Latency)
          ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
        {/* Left: All-India 8-Region AICTE Scrutiny & Anomaly Density Matrix (7 cols) */}
        <section className="lg:col-span-7 liquid-glass-card rounded-xl p-3.5 space-y-3">
          <div className="flex items-center justify-between border-b border-[var(--glass-border)] pb-2.5">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] font-bold text-sky-700 dark:text-sky-400 uppercase tracking-wider">
                  01 / REGIONAL SCRUTINY &amp; ANOMALY DENSITY MATRIX
                </span>
              </div>
              <h2 className="text-xs sm:text-sm font-bold text-[var(--text-primary)]">
                {t.regionalMatrixTitle}
              </h2>
              <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                {t.regionalMatrixSub} • Click any regional committee to isolate in Global Filter Bar
              </p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[var(--glass-bg-subtle)] text-[var(--text-muted)] font-semibold border border-[var(--glass-border)]">
              {filters.region !== 'All Regions (8)' ? `Filtered: ${filters.region}` : 'All 8 Regions'}
            </span>
          </div>

          <div className="space-y-2">
            {REGIONAL_STATS.map((reg) => {
              const totalApps = reg.applications;
              const compliantPct = Math.round((reg.compliantCount / totalApps) * 100);
              const rectifiablePct = Math.round((reg.rectifiableCount / totalApps) * 100);
              const fraudPct = Math.round((reg.fatalFraudCount / totalApps) * 100);
              const isSelected = filters.region === reg.region || selectedRegion === reg.region;

              return (
                <div
                  key={reg.region}
                  onClick={() => handleRegionClick(reg.region)}
                  className={`p-2.5 rounded-lg border transition-all cursor-pointer group ${
                    isSelected
                      ? 'bg-sky-500/10 border-sky-500/60 shadow-xs ring-1 ring-sky-500/30'
                      : 'bg-[var(--glass-bg)] hover:bg-[var(--glass-bg-elevated)] border-[var(--glass-border)]'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <div className="font-semibold text-[var(--text-primary)] group-hover:text-sky-700 dark:group-hover:text-sky-400 flex items-center gap-2">
                      <span className={isSelected ? 'text-sky-700 dark:text-sky-400 font-bold' : ''}>
                        {reg.region}
                      </span>
                      <span className="text-[9.5px] font-mono px-1.5 py-0.2 rounded bg-[var(--glass-bg-subtle)] text-[var(--text-muted)] border border-[var(--glass-border)]">
                        {reg.applications} dossiers
                      </span>
                      <span className="text-[9.5px] font-mono text-slate-500 dark:text-slate-400">
                        Mean ICI: <strong>{reg.avgIci.toFixed(1)}</strong>
                      </span>
                    </div>
                    <div className="flex items-center gap-2.5 text-[10.5px] font-mono">
                      <span className="text-emerald-700 dark:text-emerald-400 font-bold">
                        {compliantPct}% Cleared
                      </span>
                      <span className="text-amber-700 dark:text-amber-400 font-bold">
                        {reg.rectifiableCount} Def.
                      </span>
                      <span className="text-red-600 dark:text-red-400 font-bold">
                        {reg.fatalFraudCount} Fatal
                      </span>
                      <span className="text-red-600 dark:text-red-400 font-bold hidden sm:inline">
                        {reg.ghostFacultyCount} Ghost
                      </span>
                    </div>
                  </div>

                  {/* Tri-color Horizontal Stacked Bar */}
                  <div className="h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden flex">
                    <div
                      style={{ width: `${compliantPct}%` }}
                      className="bg-emerald-500 h-full"
                      title={`Compliant: ${compliantPct}%`}
                    />
                    <div
                      style={{ width: `${rectifiablePct}%` }}
                      className="bg-amber-500 h-full"
                      title={`Rectifiable: ${rectifiablePct}%`}
                    />
                    <div
                      style={{ width: `${fraudPct}%` }}
                      className="bg-red-500 h-full"
                      title={`Fatal Fraud: ${fraudPct}%`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Right: Subsystem Anomaly Telemetry & National DPI Bridge Health (5 cols) */}
        <section className="lg:col-span-5 liquid-glass-card rounded-xl p-3.5 space-y-3 flex flex-col justify-between">
          <div>
            <div className="border-b border-[var(--glass-border)] pb-2.5">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] font-bold text-sky-700 dark:text-sky-400 uppercase tracking-wider">
                  02 / SUBSYSTEM TELEMETRY &amp; DPI HEALTH
                </span>
              </div>
              <h2 className="text-xs sm:text-sm font-bold text-[var(--text-primary)]">
                {t.telemetryTitle}
              </h2>
              <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                Distribution of 5 neural scrutiny engines &amp; live DPI node latencies
              </p>
            </div>

            {/* Top Subsystem Frequency Distribution */}
            <div className="space-y-1.5 mt-2.5">
              <div className="text-[9.5px] font-mono font-semibold uppercase tracking-wider text-[var(--text-faint)]">
                Frequency Distribution Across 5 AI Scrutiny Engines
              </div>

              <div className="space-y-1.5 text-xs font-mono">
                {/* 1. PP-StructureV3 */}
                <div className="p-2 rounded-lg border-l-2 border-l-sky-500 bg-[var(--glass-bg-subtle)] border border-[var(--glass-border)] flex items-center justify-between">
                  <span className="font-medium text-[var(--text-primary)] text-[11px]">
                    1. PP-StructureV3 + SLANet &amp; LayoutLMv3 KIE
                  </span>
                  <span className="text-[10px] font-bold text-sky-700 dark:text-sky-400">
                    142 cases (38.2%)
                  </span>
                </div>

                {/* 2. TruFor Noiseprint++ */}
                <div className="p-2 rounded-lg border-l-2 border-l-red-600 bg-[var(--glass-bg-subtle)] border border-[var(--glass-border)] flex items-center justify-between">
                  <span className="font-medium text-[var(--text-primary)] text-[11px]">
                    2. TruFor Noiseprint++ &amp; NFA-ViT Splicing
                  </span>
                  <span className="text-[10px] font-bold text-red-600 dark:text-red-400">
                    62 cases (16.7%)
                  </span>
                </div>

                {/* 3. YOLOv11-Doc */}
                <div className="p-2 rounded-lg border-l-2 border-l-indigo-500 bg-[var(--glass-bg-subtle)] border border-[var(--glass-border)] flex items-center justify-between">
                  <span className="font-medium text-[var(--text-primary)] text-[11px]">
                    3. YOLOv11-Doc + Siamese ArcFace Seal/Signature
                  </span>
                  <span className="text-[10px] font-bold text-indigo-700 dark:text-indigo-400">
                    28 cases (7.5%)
                  </span>
                </div>

                {/* 4. Mask2Former */}
                <div className="p-2 rounded-lg border-l-2 border-l-amber-500 bg-[var(--glass-bg-subtle)] border border-[var(--glass-border)] flex items-center justify-between">
                  <span className="font-medium text-[var(--text-primary)] text-[11px]">
                    4. Mask2Former + RMBG-1.4 Blueprint Shoelace
                  </span>
                  <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400">
                    41 cases (11.0%)
                  </span>
                </div>

                {/* 5. RetinaFace */}
                <div className="p-2 rounded-lg border-l-2 border-l-red-600 bg-[var(--glass-bg-subtle)] border border-[var(--glass-border)] flex items-center justify-between">
                  <span className="font-medium text-[var(--text-primary)] text-[11px]">
                    5. RetinaFace + ArcFace 512-D Qdrant Ghost Faculty
                  </span>
                  <span className="text-[10px] font-bold text-red-600 dark:text-red-400">
                    98 cases (26.6%)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* National DPI Bridge Live Latency & Uptime Telemetry (All 6 Nodes) */}
          <div className="space-y-1.5 pt-2 border-t border-[var(--glass-border)]">
            <div className="text-[9.5px] font-mono font-semibold uppercase tracking-wider text-[var(--text-faint)] flex items-center justify-between">
              <span>National DPI Authority Node Telemetry</span>
              <span className="text-emerald-600 font-bold">6/6 Authorities Online</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-xs font-mono">
              <div className="p-1.5 rounded-lg bg-[var(--glass-bg-subtle)] border border-[var(--glass-border)] flex flex-col">
                <span className="text-[9px] text-[var(--text-faint)] uppercase truncate">DigiLocker Pull URI</span>
                <span className="text-emerald-700 dark:text-emerald-400 font-bold text-[11px]">138 ms (99.8%)</span>
              </div>
              <div className="p-1.5 rounded-lg bg-[var(--glass-bg-subtle)] border border-[var(--glass-border)] flex flex-col">
                <span className="text-[9px] text-[var(--text-faint)] uppercase truncate">EPFO ECR 2.0</span>
                <span className="text-emerald-700 dark:text-emerald-400 font-bold text-[11px]">164 ms (98.6%)</span>
              </div>
              <div className="p-1.5 rounded-lg bg-[var(--glass-bg-subtle)] border border-[var(--glass-border)] flex flex-col">
                <span className="text-[9px] text-[var(--text-faint)] uppercase truncate">MCA21 v3 Trust</span>
                <span className="text-emerald-700 dark:text-emerald-400 font-bold text-[11px]">112 ms (99.4%)</span>
              </div>
              <div className="p-1.5 rounded-lg bg-[var(--glass-bg-subtle)] border border-[var(--glass-border)] flex flex-col">
                <span className="text-[9px] text-[var(--text-faint)] uppercase truncate">State e-District QR</span>
                <span className="text-emerald-700 dark:text-emerald-400 font-bold text-[11px]">94 ms (99.9%)</span>
              </div>
              <div className="p-1.5 rounded-lg bg-[var(--glass-bg-subtle)] border border-[var(--glass-border)] flex flex-col">
                <span className="text-[9px] text-[var(--text-faint)] uppercase truncate">Jamabandi GIS</span>
                <span className="text-emerald-700 dark:text-emerald-400 font-bold text-[11px]">210 ms (97.8%)</span>
              </div>
              <div className="p-1.5 rounded-lg bg-[var(--glass-bg-subtle)] border border-[var(--glass-border)] flex flex-col">
                <span className="text-[9px] text-[var(--text-faint)] uppercase truncate">NAD Degree Registry</span>
                <span className="text-emerald-700 dark:text-emerald-400 font-bold text-[11px]">129 ms (99.2%)</span>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* =========================================================================
          ROW 4: HIGH-RISK INSTITUTIONAL DOSSIER QUEUE
          (Sorted by RPN, Live Mutated Status, 5-Domain Spark-Bars, Top Forensic Badges)
          ========================================================================= */}
      <section className="liquid-glass-card rounded-xl p-3.5 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--glass-border)] pb-2.5">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] font-bold text-red-600 dark:text-red-400 uppercase tracking-wider">
                03 / DOSSIER SCRUTINY QUEUE (ORDERED BY RPN RISK)
              </span>
            </div>
            <h2 className="text-xs sm:text-sm font-bold text-[var(--text-primary)]">
              {t.highRiskQueueTitle}
            </h2>
            <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
              {t.highRiskQueueSub} • Live closed-loop status synchronized with officer workbench determinations
            </p>
          </div>
          <Link
            href="/applications"
            className="text-xs font-mono font-medium text-sky-700 dark:text-sky-400 hover:underline flex items-center gap-1"
          >
            <span>Complete Registry Table ({filteredApplications.length})</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>

        {/* Dense Workstation Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[var(--glass-border)] text-[10px] font-mono font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                <th className="py-2 px-2.5">{t.colInstitution}</th>
                <th className="py-2 px-2.5">{t.colRegion}</th>
                <th className="py-2 px-2.5">ICI &amp; 5-Domain Spark</th>
                <th className="py-2 px-2.5">{t.colTopAnomaly}</th>
                <th className="py-2 px-2.5">Scrutiny Status</th>
                <th className="py-2 px-2.5 text-right">{t.colAction}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--glass-border)]">
              {highRiskQueue.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-[var(--text-muted)]">
                    <div className="flex flex-col items-center justify-center gap-1.5">
                      <div className="text-xs font-semibold text-[var(--text-primary)]">
                        No institutional dossiers match the selected criteria
                      </div>
                      <button
                        onClick={() =>
                          setFilters((prev) => ({
                            ...prev,
                            region: 'All Regions (8)',
                            scrutinyStatus: 'All Statuses',
                          }))
                        }
                        className="btn-glass-subtle mt-1 px-2.5 py-1 rounded text-xs font-mono inline-flex items-center gap-1 cursor-pointer"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Reset Filters</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                highRiskQueue.map((app) => {
                  const topAnom = app.anomalies[0];
                  const isFatal = app.scrutinyStatus === 'Fatal Fraud Alert';
                  const isCleared = app.scrutinyStatus === 'Auto-Pre-Cleared';
                  const isDeficiency = app.scrutinyStatus === 'Deficiency Issued';

                  return (
                    <tr
                      key={app.id}
                      className="hover:bg-[var(--glass-bg-elevated)] transition-colors group"
                    >
                      <td className="py-2.5 px-2.5">
                        <div className="font-semibold text-[var(--text-primary)] group-hover:text-sky-700 dark:group-hover:text-sky-400 transition-colors">
                          {language === 'hi' ? app.nameHi : app.nameEn}
                        </div>
                        <div className="text-[10px] font-mono text-[var(--text-muted)] flex items-center gap-2 mt-0.5">
                          <span className="font-bold text-slate-700 dark:text-slate-300">{app.id}</span>
                          <span>•</span>
                          <span>PID: {app.pid}</span>
                        </div>
                      </td>

                      <td className="py-2.5 px-2.5">
                        <div className="text-[var(--text-primary)] font-medium">
                          {app.region}
                        </div>
                        <div className="text-[10px] font-mono text-[var(--text-muted)]">
                          {app.city}, {app.state}
                        </div>
                      </td>

                      <td className="py-2.5 px-2.5">
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
                              VETO
                            </span>
                          )}
                          <span className="text-[9.5px] font-mono text-[var(--text-muted)]">
                            RPN {app.maxRpn}
                          </span>
                        </div>

                        {/* 5-Domain Mini Spark Bars */}
                        <div
                          className="flex items-center gap-1 mt-1 w-28"
                          title="Infra, Faculty, Legal, Authority, Financial"
                        >
                          <div
                            className="h-1 rounded-full bg-sky-500"
                            style={{ width: `${app.subScores.infra}%` }}
                            title={`Infra: ${app.subScores.infra}`}
                          />
                          <div
                            className="h-1 rounded-full bg-indigo-500"
                            style={{ width: `${app.subScores.faculty}%` }}
                            title={`Faculty: ${app.subScores.faculty}`}
                          />
                          <div
                            className="h-1 rounded-full bg-violet-500"
                            style={{ width: `${app.subScores.legal}%` }}
                            title={`Legal: ${app.subScores.legal}`}
                          />
                          <div
                            className="h-1 rounded-full bg-emerald-500"
                            style={{ width: `${app.subScores.authority}%` }}
                            title={`Authority: ${app.subScores.authority}`}
                          />
                          <div
                            className="h-1 rounded-full bg-amber-500"
                            style={{ width: `${app.subScores.financial}%` }}
                            title={`Financial: ${app.subScores.financial}`}
                          />
                        </div>
                      </td>

                      <td className="py-2.5 px-2.5 max-w-xs">
                        {topAnom ? (
                          <div>
                            <div className="text-[11px] font-semibold text-[var(--text-primary)] line-clamp-1">
                              {language === 'hi' ? topAnom.titleHi : topAnom.titleEn}
                            </div>
                            <div className="text-[9.5px] font-mono text-red-600 dark:text-red-400 mt-0.5">
                              {topAnom.modelUsed.split('+')[0]} • {Math.round(topAnom.tamperProbability * 100)}% Conf
                            </div>
                          </div>
                        ) : (
                          <div className="text-emerald-600 dark:text-emerald-400 text-[11px] font-mono">
                            Zero Deficiencies (APH Compliant)
                          </div>
                        )}
                      </td>

                      <td className="py-2.5 px-2.5">
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

                      <td className="py-2.5 px-2.5 text-right space-x-1.5">
                        <Link
                          href={`/applications/${app.id}`}
                          className="btn-obsidian inline-flex items-center gap-1 px-2.5 py-1 rounded-md font-mono text-[10px] font-semibold shadow-2xs"
                        >
                          <span>Workbench</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </Link>
                        <button
                          onClick={() => handleGenerateNoticeToast(app.id)}
                          className="btn-glass-subtle inline-flex items-center gap-1 px-2 py-1 rounded-md font-mono text-[10px] font-medium cursor-pointer"
                          title="Generate Official Statutory Notice"
                        >
                          <span>Notice</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* =========================================================================
          INLINE MODAL: SPLIT-PANE FORENSIC EVIDENCE QUICK-LOOK MODAL
          (TruFor Noiseprint++ Heatmap vs. DigiLocker XML Handshake Diff)
          ========================================================================= */}
      {quickLookApp && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="liquid-glass-card rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-5 space-y-4 shadow-2xl border border-[var(--glass-border-strong)]">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-[var(--glass-border)] pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.2 rounded bg-red-600 text-white font-mono text-[9.5px] font-bold">
                    FORENSIC EVIDENCE DOSSIER QUICK-LOOK
                  </span>
                  <span className="font-mono text-xs text-red-600 font-semibold">
                    RPN {quickLookApp.maxRpn}
                  </span>
                </div>
                <h3 className="text-base font-bold text-[var(--text-primary)] mt-1">
                  {quickLookApp.nameEn} ({quickLookApp.id})
                </h3>
                <p className="text-xs text-[var(--text-muted)] font-mono">
                  {quickLookApp.city}, {quickLookApp.state} • {quickLookApp.trustName}
                </p>
              </div>

              <button
                onClick={() => setQuickLookApp(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Split-Pane Evidence Grid (Left: TruFor Splicing Heatmap • Right: DigiLocker Diff) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left Pane: TruFor Noiseprint++ Splicing Localization */}
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-700 text-white space-y-2.5 font-mono text-xs">
                <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                  <span className="font-bold text-sky-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                    <span>TruFor Noiseprint++ &amp; NFA-ViT</span>
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-red-500/20 text-red-400 font-bold border border-red-500/30">
                    SPLICED PATCH LOCALIZED
                  </span>
                </div>

                {/* Simulated Certificate Heatmap Visual */}
                <div className="relative h-44 rounded-lg bg-slate-950 border border-slate-800 p-3 overflow-hidden flex flex-col justify-between">
                  <div className="text-[10px] text-slate-400">
                    Document Artifact: {quickLookApp.anomalies[0]?.documentTitle || 'Fire Safety NOC'}
                  </div>

                  {/* Spliced Text & BBox Simulation */}
                  <div className="p-2 rounded bg-red-950/40 border border-red-500/60 relative">
                    <div className="text-[9px] uppercase tracking-wider text-red-400 font-bold mb-0.5">
                      Localized Tamper Bounding Box [64%, 42%, 88%, 48%]
                    </div>
                    <div className="text-sm font-bold text-red-200">
                      "{quickLookApp.anomalies[0]?.extractedValue || 'Valid Until: 30-06-2027'}"
                    </div>
                    <span className="absolute top-1.5 right-1.5 text-[8.5px] px-1 rounded bg-red-600 text-white font-bold animate-pulse">
                      γ = 20 ELA
                    </span>
                  </div>

                  <div className="flex justify-between text-[9.5px] text-slate-400">
                    <span>Shifted DCT Phase: (dx,dy)=(3,5)</span>
                    <span className="text-red-400 font-bold">Conf: 98.4%</span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-300 leading-relaxed">
                  <strong>Neural Diagnostic:</strong> 128×32 pixel patch inserted over authentic certificate body. Steganographic noise residual exhibits severe variance discontinuity against authentic document substrate.
                </div>
              </div>

              {/* Right Pane: DigiLocker API Setu Canonical XML Diff */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-[var(--glass-border)] space-y-2.5 font-mono text-xs">
                <div className="flex items-center justify-between border-b border-[var(--glass-border)] pb-1.5">
                  <span className="font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>DigiLocker Pull URI Handshake Diff</span>
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-700 dark:text-amber-400 font-bold border border-amber-500/20">
                    AUTHORITY MISMATCH
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="p-2 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/60">
                    <span className="text-[9.5px] uppercase text-red-600 font-bold block">
                      Uploaded Dossier Declared Attribute (OCR):
                    </span>
                    <span className="font-bold text-red-700 dark:text-red-300 text-xs">
                      {quickLookApp.anomalies[0]?.extractedValue || 'Valid Until: 30-06-2027'}
                    </span>
                  </div>

                  <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/60">
                    <span className="text-[9.5px] uppercase text-emerald-600 font-bold block">
                      DigiLocker Authoritative Repository Record:
                    </span>
                    <span className="font-bold text-emerald-700 dark:text-emerald-300 text-xs">
                      {quickLookApp.anomalies[0]?.authorityValue || 'Expired 30-06-2024 (Reg: FS/2021/8841)'}
                    </span>
                  </div>
                </div>

                <div className="p-2 rounded-lg bg-[var(--glass-bg-subtle)] border border-[var(--glass-border)] text-[10px] text-[var(--text-muted)] space-y-0.5">
                  <div>URI: in.gov.har.fire-NOC-2021-8841</div>
                  <div>Handshake Latency: 138 ms • Status: MISMATCH_DETECTED</div>
                  <div>PKI Signature: RSA-2048 Hash Invalid</div>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 pt-2 border-t border-[var(--glass-border)]">
              <div className="text-[11px] font-mono text-[var(--text-muted)]">
                Recommended Action: Standing Hearing Committee Referral + 15-Day Statutory Notice
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => {
                    const id = quickLookApp.id;
                    setQuickLookApp(null);
                    router.push(`/applications/${id}`);
                  }}
                  className="btn-obsidian flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer"
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
                  className="btn-glass-subtle flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer text-amber-700 dark:text-amber-400"
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
