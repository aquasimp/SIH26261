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
  FileText,
  CheckCircle2,
  X,
  Eye,
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
        ghostColleges: `${Math.round(ghost * 0.32)} Institutions`,
        authorityRate: '98.2%',
        authorityLatency: '148ms latency',
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
      ghostColleges: '94 Institutions',
      authorityRate: '98.4%',
      authorityLatency: '142ms latency',
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
    <div className="space-y-4 animate-glass-in">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-sky-700 dark:text-sky-400 uppercase tracking-wider">
              AICTE Regulatory Scrutiny Workstation
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)]">
            Institutional Regulatory Scrutiny{' '}
            <span className="title-serif-italic text-sky-700 dark:text-sky-400">
              Intelligence
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1">
            Evidence-Linked Document Authentication, Forensic Tampering Localization &amp; Infrastructure Verification (APH 2024–27)
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/applications"
            className="btn-liquid-secondary inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold shadow-2xs"
          >
            <span>All Dossiers</span>
            <span className="text-[11px] font-semibold text-[var(--text-muted)] tabular-nums">4,820</span>
            <ChevronRight className="w-3.5 h-3.5 text-[var(--text-faint)]" />
          </Link>
        </div>
      </div>

      {/* =========================================================================
          ROW 1: UNIFIED 6-COLUMN METRIC GRID
          (2px Top Severity Rules, Monochrome High-Contrast Display Numerals, No Truncation)
          ========================================================================= */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 divide-y sm:divide-y-0 sm:divide-x divide-[var(--glass-well-border)] liquid-glass-card rounded-2xl overflow-hidden shadow-lg">
        {/* Metric 1: Ingested */}
        <div className="top-rule-registry p-4 flex flex-col justify-between hover:bg-white/40 dark:hover:bg-white/5 transition-colors">
          <div className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
            {t.kpiTotalIngested}
          </div>
          <div className="flex items-baseline justify-between gap-2 my-2">
            <span className="metric-value">{dynamicKpis.totalIngested}</span>
            <span className="px-2 py-0.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 text-xs font-semibold inline-flex items-center gap-0.5">
              <ArrowUpRight className="w-3 h-3" />
              {dynamicKpis.totalIngestedTrend}
            </span>
          </div>
          <div className="text-xs text-[var(--text-secondary)] font-medium">
            {filters.region !== 'All Regions (8)' ? `Scope: ${filters.region}` : t.kpiTotalIngestedSub}
          </div>
        </div>

        {/* Metric 2: Pre-Cleared */}
        <div className="top-rule-verified p-4 flex flex-col justify-between hover:bg-white/40 dark:hover:bg-white/5 transition-colors">
          <div className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
            {t.kpiPreCleared}
          </div>
          <div className="flex items-baseline justify-between gap-2 my-2">
            <span className="metric-value">{dynamicKpis.preCleared}</span>
            <span className="px-2 py-0.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-xs font-semibold inline-flex items-center gap-0.5">
              {dynamicKpis.preClearedPct}
            </span>
          </div>
          <div className="text-xs text-[var(--text-secondary)] font-medium">
            {t.kpiPreClearedSub}
          </div>
        </div>

        {/* Metric 3: Deficiencies Issued */}
        <div className="top-rule-deficiency p-4 flex flex-col justify-between hover:bg-white/40 dark:hover:bg-white/5 transition-colors">
          <div className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
            {t.kpiDeficienciesIssued}
          </div>
          <div className="flex items-baseline justify-between gap-2 my-2">
            <span className="metric-value">{dynamicKpis.deficienciesIssued}</span>
            <span className="px-2 py-0.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300 text-xs font-semibold inline-flex items-center gap-0.5">
              <ArrowDownRight className="w-3 h-3" />
              {dynamicKpis.deficienciesTrend}
            </span>
          </div>
          <div className="text-xs text-[var(--text-secondary)] font-medium">
            {t.kpiDeficienciesIssuedSub}
          </div>
        </div>

        {/* Metric 4: Fatal Forgery */}
        <div className="top-rule-fatal p-4 flex flex-col justify-between hover:bg-white/40 dark:hover:bg-white/5 transition-colors">
          <div className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
            {t.kpiFatalFraud}
          </div>
          <div className="flex items-baseline justify-between gap-2 my-2">
            <span className="metric-value">{dynamicKpis.fatalFraud}</span>
            <span className="px-2 py-0.5 rounded-full border border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-300 text-xs font-semibold inline-flex items-center gap-0.5">
              <ArrowUpRight className="w-3 h-3" />
              {dynamicKpis.fatalFraudTrend}
            </span>
          </div>
          <div className="text-xs text-[var(--text-secondary)] font-medium">
            {t.kpiFatalFraudSub}
          </div>
        </div>

        {/* Metric 5: Ghost Faculty */}
        <div className="top-rule-fatal p-4 flex flex-col justify-between hover:bg-white/40 dark:hover:bg-white/5 transition-colors">
          <div className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
            {t.kpiGhostFaculty}
          </div>
          <div className="flex items-baseline justify-between gap-2 my-2">
            <span className="metric-value">{dynamicKpis.ghostFaculty}</span>
            <span className="px-2 py-0.5 rounded-full border border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-300 text-xs font-semibold inline-flex items-center gap-0.5">
              {dynamicKpis.ghostColleges}
            </span>
          </div>
          <div className="text-xs text-[var(--text-secondary)] font-medium">
            {t.kpiGhostFacultySub}
          </div>
        </div>

        {/* Metric 6: Authority Live */}
        <div className="top-rule-verified p-4 flex flex-col justify-between hover:bg-white/40 dark:hover:bg-white/5 transition-colors">
          <div className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
            {t.kpiAuthorityLive}
          </div>
          <div className="flex items-baseline justify-between gap-2 my-2">
            <span className="metric-value">{dynamicKpis.authorityRate}</span>
            <span className="px-2 py-0.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-xs font-semibold inline-flex items-center gap-0.5">
              {dynamicKpis.authorityLatency}
            </span>
          </div>
          <div className="text-xs text-[var(--text-secondary)] font-medium">
            {t.kpiAuthorityLiveSub}
          </div>
        </div>
      </section>

      {/* =========================================================================
          ROW 2: PRIORITY INTERVENTION / HIGH-RISK ALERT BANNER
          (Dual Pulsing Radar Dot, Dynamic Highest-RPN Dossier Binding, Forensic Modal)
          ========================================================================= */}
      <section className="glass-interactive border border-rose-500/35 bg-rose-500/8 dark:bg-rose-950/25 rounded-2xl p-4 sm:p-5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-start gap-3.5 min-w-0">
          {/* Dual Pulsing Radar Dot */}
          <div className="relative flex h-3.5 w-3.5 mt-1 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="animate-pulse absolute inline-flex h-2.5 w-2.5 rounded-full bg-rose-500 opacity-90"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-rose-600"></span>
          </div>

          <div className="space-y-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase rounded-full bg-rose-600 text-white shadow-2xs">
                CRITICAL RPN {highestRpnDossier.maxRpn} • APH CH-VII VIOLATION
              </span>
              <span className="text-xs font-semibold text-rose-700 dark:text-rose-300">
                Fatal Forgery Detected
              </span>
            </div>
            <p className="text-xs sm:text-sm font-medium text-[var(--text-primary)] leading-normal">
              {highestRpnDossier.anomalies[0]?.titleEn || 'Campus Land Deed Survey Alteration & Fire NOC Date Splicing Detected'} —{' '}
              <span className="font-bold">{highestRpnDossier.nameEn}</span> (PID: <span className="font-mono text-xs">{highestRpnDossier.pid}</span>) —{' '}
              <span className="text-rose-600 dark:text-rose-400 font-bold">
                {Math.round((highestRpnDossier.anomalies[0]?.tamperProbability || 0.984) * 100)}% TruFor Confidence
              </span> — Standing Hearing Committee &amp; Physical EVC Recommended
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto">
          {/* View Forensic Evidence Quick-Look Modal Button */}
          <button
            onClick={() => setQuickLookApp(highestRpnDossier)}
            className="btn-liquid-primary flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold shadow-sm cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{t.btnViewEvidence}</span>
          </button>
          {/* Generate Show-Cause Notice Button */}
          <button
            onClick={() => handleGenerateNoticeToast(highestRpnDossier.id)}
            className="btn-liquid-secondary flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold shadow-2xs cursor-pointer"
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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: All-India 8-Region AICTE Scrutiny Matrix (7 cols) */}
        <section className="lg:col-span-7 liquid-glass-card rounded-2xl p-4 sm:p-5 space-y-4 shadow-md">
          <div className="flex items-center justify-between border-b border-[var(--glass-well-border)] pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-sky-700 dark:text-sky-400 uppercase tracking-wider">
                  Regional Scrutiny &amp; Anomaly Density Matrix
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-bold text-[var(--text-primary)] mt-0.5">
                {t.regionalMatrixTitle}
              </h2>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                {t.regionalMatrixSub} • Select any regional committee to filter the global view
              </p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full glass-well text-[var(--text-secondary)] font-semibold shadow-2xs">
              {filters.region !== 'All Regions (8)' ? `Filtered: ${filters.region}` : 'All 8 Regions'}
            </span>
          </div>

          <div className="space-y-2.5">
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
                  className={`p-3 rounded-xl transition-all cursor-pointer group ${
                    isSelected
                      ? 'glass-well border-sky-500/60 shadow-md ring-1 ring-sky-500/40'
                      : 'glass-interactive'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-2">
                    <div className="font-semibold text-[var(--text-primary)] group-hover:text-sky-700 dark:group-hover:text-sky-400 flex items-center gap-2.5">
                      <span className={isSelected ? 'text-sky-700 dark:text-sky-400 font-bold' : ''}>
                        {reg.region}
                      </span>
                      <span className="text-[11px] px-2 py-0.5 rounded-full glass-well text-[var(--text-muted)] tabular-nums font-medium">
                        {reg.applications} dossiers
                      </span>
                      <span className="text-[11px] text-[var(--text-secondary)]">
                        Mean ICI: <strong className="tabular-nums">{reg.avgIci.toFixed(1)}</strong>
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs font-semibold tabular-nums">
                      <span className="text-emerald-700 dark:text-emerald-400">
                        {compliantPct}% Cleared
                      </span>
                      <span className="text-amber-700 dark:text-amber-400">
                        {reg.rectifiableCount} Def.
                      </span>
                      <span className="text-rose-600 dark:text-rose-400">
                        {reg.fatalFraudCount} Fatal
                      </span>
                      <span className="text-rose-600 dark:text-rose-400 hidden sm:inline">
                        {reg.ghostFacultyCount} Ghost
                      </span>
                    </div>
                  </div>

                  {/* Tri-color Horizontal Stacked Bar */}
                  <div className="h-2 w-full rounded-full glass-well overflow-hidden flex">
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
                      className="bg-rose-500 h-full"
                      title={`Fatal Fraud: ${fraudPct}%`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Right: Subsystem Anomaly Telemetry & National DPI Bridge Health (5 cols) */}
        <section className="lg:col-span-5 liquid-glass-card rounded-2xl p-4 sm:p-5 space-y-4 flex flex-col justify-between shadow-md">
          <div>
            <div className="border-b border-[var(--glass-well-border)] pb-3">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-sky-700 dark:text-sky-400 uppercase tracking-wider">
                  Subsystem Telemetry &amp; DPI Health
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-bold text-[var(--text-primary)] mt-0.5">
                {t.telemetryTitle}
              </h2>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                Distribution of 5 neural scrutiny engines &amp; live DPI node latencies
              </p>
            </div>

            {/* Top Subsystem Frequency Distribution */}
            <div className="space-y-2 mt-3">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-faint)]">
                Frequency Distribution Across 5 AI Scrutiny Engines
              </div>

              <div className="space-y-2 text-xs">
                {/* 1. PP-StructureV3 */}
                <div className="p-2.5 rounded-xl border-l-3 border-l-sky-500 glass-well flex items-center justify-between">
                  <span className="font-semibold text-[var(--text-primary)]">
                    1. PP-StructureV3 + SLANet &amp; LayoutLMv3 KIE
                  </span>
                  <span className="text-xs font-bold text-sky-700 dark:text-sky-400 tabular-nums">
                    142 cases (38.2%)
                  </span>
                </div>

                {/* 2. TruFor Noiseprint++ */}
                <div className="p-2.5 rounded-xl border-l-3 border-l-rose-600 glass-well flex items-center justify-between">
                  <span className="font-semibold text-[var(--text-primary)]">
                    2. TruFor Noiseprint++ &amp; NFA-ViT Splicing
                  </span>
                  <span className="text-xs font-bold text-rose-600 dark:text-rose-400 tabular-nums">
                    62 cases (16.7%)
                  </span>
                </div>

                {/* 3. YOLOv11-Doc */}
                <div className="p-2.5 rounded-xl border-l-3 border-l-indigo-500 glass-well flex items-center justify-between">
                  <span className="font-semibold text-[var(--text-primary)]">
                    3. YOLOv11-Doc + Siamese ArcFace Seal/Signature
                  </span>
                  <span className="text-xs font-bold text-indigo-700 dark:text-indigo-400 tabular-nums">
                    28 cases (7.5%)
                  </span>
                </div>

                {/* 4. Mask2Former */}
                <div className="p-2.5 rounded-xl border-l-3 border-l-amber-500 glass-well flex items-center justify-between">
                  <span className="font-semibold text-[var(--text-primary)]">
                    4. Mask2Former + RMBG-1.4 Blueprint Shoelace
                  </span>
                  <span className="text-xs font-bold text-amber-700 dark:text-amber-400 tabular-nums">
                    41 cases (11.0%)
                  </span>
                </div>

                {/* 5. RetinaFace */}
                <div className="p-2.5 rounded-xl border-l-3 border-l-rose-600 glass-well flex items-center justify-between">
                  <span className="font-semibold text-[var(--text-primary)]">
                    5. RetinaFace + ArcFace 512-D Qdrant Ghost Faculty
                  </span>
                  <span className="text-xs font-bold text-rose-600 dark:text-rose-400 tabular-nums">
                    98 cases (26.6%)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* National DPI Bridge Live Latency & Uptime Telemetry (All 6 Nodes) */}
          <div className="space-y-2 pt-3 border-t border-[var(--glass-well-border)]">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-faint)] flex items-center justify-between">
              <span>National DPI Authority Node Telemetry</span>
              <span className="text-emerald-600 font-bold">6/6 Authorities Online</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              <div className="p-2 rounded-xl glass-well flex flex-col">
                <span className="text-[10px] text-[var(--text-faint)] uppercase font-semibold">DigiLocker Pull URI</span>
                <span className="text-emerald-700 dark:text-emerald-400 font-bold text-xs tabular-nums mt-0.5">138 ms (99.8%)</span>
              </div>
              <div className="p-2 rounded-xl glass-well flex flex-col">
                <span className="text-[10px] text-[var(--text-faint)] uppercase font-semibold">EPFO ECR 2.0</span>
                <span className="text-emerald-700 dark:text-emerald-400 font-bold text-xs tabular-nums mt-0.5">164 ms (98.6%)</span>
              </div>
              <div className="p-2 rounded-xl glass-well flex flex-col">
                <span className="text-[10px] text-[var(--text-faint)] uppercase font-semibold">MCA21 v3 Trust</span>
                <span className="text-emerald-700 dark:text-emerald-400 font-bold text-xs tabular-nums mt-0.5">112 ms (99.4%)</span>
              </div>
              <div className="p-2 rounded-xl glass-well flex flex-col">
                <span className="text-[10px] text-[var(--text-faint)] uppercase font-semibold">State e-District QR</span>
                <span className="text-emerald-700 dark:text-emerald-400 font-bold text-xs tabular-nums mt-0.5">94 ms (99.9%)</span>
              </div>
              <div className="p-2 rounded-xl glass-well flex flex-col">
                <span className="text-[10px] text-[var(--text-faint)] uppercase font-semibold">Jamabandi GIS</span>
                <span className="text-emerald-700 dark:text-emerald-400 font-bold text-xs tabular-nums mt-0.5">210 ms (97.8%)</span>
              </div>
              <div className="p-2 rounded-xl glass-well flex flex-col">
                <span className="text-[10px] text-[var(--text-faint)] uppercase font-semibold">NAD Degree Registry</span>
                <span className="text-emerald-700 dark:text-emerald-400 font-bold text-xs tabular-nums mt-0.5">129 ms (99.2%)</span>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* =========================================================================
          ROW 4: HIGH-RISK INSTITUTIONAL DOSSIER QUEUE
          (Sorted by RPN, Live Mutated Status, 5-Domain Spark-Bars, Top Forensic Badges)
          ========================================================================= */}
      <section className="liquid-glass-card rounded-2xl p-4 sm:p-5 space-y-4 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--glass-well-border)] pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
                Dossier Scrutiny Queue (Ordered by RPN Risk)
              </span>
            </div>
            <h2 className="text-sm sm:text-base font-bold text-[var(--text-primary)] mt-0.5">
              {t.highRiskQueueTitle}
            </h2>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              {t.highRiskQueueSub} • Live closed-loop status synchronized with officer workbench determinations
            </p>
          </div>
          <Link
            href="/applications"
            className="text-xs font-semibold text-sky-700 dark:text-sky-400 hover:underline flex items-center gap-1.5"
          >
            <span>Complete Registry Table ({filteredApplications.length})</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Dense Workstation Table */}
        <div className="overflow-x-auto rounded-xl glass-well">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[var(--glass-well-border)] text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                <th className="py-3 px-3.5">{t.colInstitution}</th>
                <th className="py-3 px-3.5">{t.colRegion}</th>
                <th className="py-3 px-3.5">ICI &amp; 5-Domain Breakdown</th>
                <th className="py-3 px-3.5">{t.colTopAnomaly}</th>
                <th className="py-3 px-3.5">Scrutiny Status</th>
                <th className="py-3 px-3.5 text-right">{t.colAction}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--glass-well-border)]">
              {highRiskQueue.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-[var(--text-muted)]">
                    <div className="flex flex-col items-center justify-center gap-2">
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
                        className="btn-liquid-secondary mt-1 px-3 py-1.5 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer shadow-2xs"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
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
                      className="hover:bg-white/40 dark:hover:bg-white/5 transition-colors group"
                    >
                      <td className="py-3 px-3.5">
                        <div className="font-semibold text-xs text-[var(--text-primary)] group-hover:text-sky-700 dark:group-hover:text-sky-400 transition-colors">
                          {language === 'hi' ? app.nameHi : app.nameEn}
                        </div>
                        <div className="text-[11px] text-[var(--text-muted)] flex items-center gap-2 mt-0.5">
                          <span className="font-mono font-semibold text-[var(--text-secondary)]">{app.id}</span>
                          <span>•</span>
                          <span>PID: <span className="font-mono">{app.pid}</span></span>
                        </div>
                      </td>

                      <td className="py-3 px-3.5">
                        <div className="text-[var(--text-primary)] font-medium">
                          {app.region}
                        </div>
                        <div className="text-[11px] text-[var(--text-muted)]">
                          {app.city}, {app.state}
                        </div>
                      </td>

                      <td className="py-3 px-3.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs tabular-nums text-[var(--text-primary)]">
                            {app.iciScore.toFixed(1)}
                          </span>
                          {app.fatalGateTriggered && (
                            <span className="text-[9.5px] font-bold px-1.5 py-0.5 rounded-full bg-rose-600 text-white">
                              VETO
                            </span>
                          )}
                          <span className="text-[11px] text-[var(--text-muted)] font-medium">
                            RPN <span className="tabular-nums font-semibold">{app.maxRpn}</span>
                          </span>
                        </div>

                        {/* 5-Domain Mini Spark Bars */}
                        <div
                          className="flex items-center gap-1 mt-1.5 w-28"
                          title="Infra, Faculty, Legal, Authority, Financial"
                        >
                          <div
                            className="h-1.5 rounded-full bg-sky-500"
                            style={{ width: `${app.subScores.infra}%` }}
                            title={`Infra: ${app.subScores.infra}`}
                          />
                          <div
                            className="h-1.5 rounded-full bg-indigo-500"
                            style={{ width: `${app.subScores.faculty}%` }}
                            title={`Faculty: ${app.subScores.faculty}`}
                          />
                          <div
                            className="h-1.5 rounded-full bg-violet-500"
                            style={{ width: `${app.subScores.legal}%` }}
                            title={`Legal: ${app.subScores.legal}`}
                          />
                          <div
                            className="h-1.5 rounded-full bg-emerald-500"
                            style={{ width: `${app.subScores.authority}%` }}
                            title={`Authority: ${app.subScores.authority}`}
                          />
                          <div
                            className="h-1.5 rounded-full bg-amber-500"
                            style={{ width: `${app.subScores.financial}%` }}
                            title={`Financial: ${app.subScores.financial}`}
                          />
                        </div>
                      </td>

                      <td className="py-3 px-3.5 max-w-xs">
                        {topAnom ? (
                          <div>
                            <div className="text-xs font-semibold text-[var(--text-primary)] line-clamp-1">
                              {language === 'hi' ? topAnom.titleHi : topAnom.titleEn}
                            </div>
                            <div className="text-[11px] text-rose-600 dark:text-rose-400 font-medium mt-0.5">
                              {topAnom.modelUsed.split('+')[0]} • {Math.round(topAnom.tamperProbability * 100)}% Conf
                            </div>
                          </div>
                        ) : (
                          <div className="text-emerald-600 dark:text-emerald-400 text-xs font-medium">
                            Zero Deficiencies (APH Compliant)
                          </div>
                        )}
                      </td>

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

                      <td className="py-3 px-3.5 text-right space-x-2">
                        <Link
                          href={`/applications/${app.id}`}
                          className="btn-liquid-primary inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold shadow-2xs"
                        >
                          <span>Workbench</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => handleGenerateNoticeToast(app.id)}
                          className="btn-liquid-secondary inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold cursor-pointer shadow-2xs"
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
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-glass-in">
          <div className="liquid-glass-card rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-[var(--glass-well-border)] pb-3.5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-bold uppercase tracking-wider">
                    Forensic Evidence Quick-Look
                  </span>
                  <span className="text-xs text-rose-600 font-bold">
                    RPN {quickLookApp.maxRpn}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-[var(--text-primary)] mt-1">
                  {quickLookApp.nameEn} ({quickLookApp.id})
                </h3>
                <p className="text-xs text-[var(--text-muted)]">
                  {quickLookApp.city}, {quickLookApp.state} • {quickLookApp.trustName}
                </p>
              </div>

              <button
                onClick={() => setQuickLookApp(null)}
                className="btn-liquid-secondary p-1.5 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Split-Pane Evidence Grid (Left: TruFor Splicing Heatmap • Right: DigiLocker Diff) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left Pane: TruFor Noiseprint++ Splicing Localization */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-700/80 text-white space-y-3 text-xs shadow-inner">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="font-bold text-sky-400 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-sky-400" />
                    <span>TruFor Noiseprint++ &amp; NFA-ViT</span>
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30">
                    SPLICED PATCH LOCALIZED
                  </span>
                </div>

                {/* Simulated Certificate Heatmap Visual */}
                <div className="relative h-44 rounded-xl bg-slate-950 border border-slate-800 p-3 overflow-hidden flex flex-col justify-between">
                  <div className="text-[11px] text-slate-400">
                    Document Artifact: {quickLookApp.anomalies[0]?.documentTitle || 'Fire Safety NOC'}
                  </div>

                  {/* Spliced Text & BBox Simulation */}
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
                  <strong>Neural Diagnostic:</strong> 128×32 pixel patch inserted over authentic certificate body. Steganographic noise residual exhibits severe variance discontinuity against authentic document substrate.
                </div>
              </div>

              {/* Right Pane: DigiLocker API Setu Canonical XML Diff */}
              <div className="p-4 rounded-2xl glass-well space-y-3 text-xs shadow-inner">
                <div className="flex items-center justify-between border-b border-[var(--glass-well-border)] pb-2">
                  <span className="font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
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

                <div className="p-2.5 rounded-xl glass-well text-[11px] text-[var(--text-muted)] space-y-1">
                  <div>URI: in.gov.har.fire-NOC-2021-8841</div>
                  <div>Handshake Latency: 138 ms • Status: MISMATCH_DETECTED</div>
                  <div>PKI Signature: RSA-2048 Hash Invalid</div>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-[var(--glass-well-border)]">
              <div className="text-xs text-[var(--text-muted)] font-medium">
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
