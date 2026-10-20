'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage, useFilters } from '@/lib/context';
import { REGIONAL_STATS } from '@/lib/mock-data';
import { toast } from 'sonner';
import {
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  AlertOctagon,
  FileSearch,
  FileWarning,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  Server,
  Building,
  UserX,
  MapPin,
  ChevronRight,
} from 'lucide-react';

export default function OverviewPage() {
  const router = useRouter();
  const { t, language } = useLanguage();
  const { filters, filteredApplications, setFilters } = useFilters();
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  // Dynamic KPI calculation reacting to active global filters
  const activeRegionStat = REGIONAL_STATS.find((r) => r.region === filters.region);

  const dynamicKpis = React.useMemo(() => {
    if (activeRegionStat) {
      const total = activeRegionStat.applications;
      const preCleared = activeRegionStat.compliantCount;
      const preClearedPct = ((preCleared / total) * 100).toFixed(1);
      const def = activeRegionStat.rectifiableCount;
      const fatal = activeRegionStat.fatalFraudCount;
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
    const compliant = REGIONAL_STATS.reduce((acc, r) => acc + r.compliantCount, 0); // 3,194
    const def = REGIONAL_STATS.reduce((acc, r) => acc + r.rectifiableCount, 0); // 1,182
    const fatal = REGIONAL_STATS.reduce((acc, r) => acc + r.fatalFraudCount, 0); // 148
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
  }, [activeRegionStat, filters]);

  // High risk applications sorted by RPN
  const highRiskQueue = [...filteredApplications].sort((a, b) => b.maxRpn - a.maxRpn);

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

  const handleGenerateNoticeToast = () => {
    toast.success('Generated Standing Hearing Committee Show-Cause Order for Apex Institute (PID: 1-9482710392)', {
      description: 'Redirecting to Official Deficiency Notice Generator...',
    });
    setTimeout(() => {
      router.push('/deficiencies');
    }, 900);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Institutional Regulatory Scrutiny{' '}
            <span className="font-serif italic font-normal text-sky-700 dark:text-sky-400">
              Intelligence
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Evidence-Linked Document Authentication, Forensic Tampering Localization & Infrastructure Verification (APH 2024–27)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/applications"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 hover:border-sky-500/50 shadow-2xs transition-all"
          >
            <span>View All Applications</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          </Link>
        </div>
      </div>

      {/* Row 1: The Unified 6-Column Metric Grid (SIH26246 Signature Component) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 divide-y sm:divide-y-0 sm:divide-x divide-slate-200/90 dark:divide-slate-800 liquid-glass-card rounded-2xl overflow-hidden shadow-sm">
        {/* Metric 1: Ingested */}
        <div className="top-rule-archive p-4 bg-white/70 dark:bg-slate-900/70 hover:-translate-y-0.5 hover:bg-white dark:hover:bg-slate-800/90 transition-all duration-200 flex flex-col justify-between">
          <div className="text-xs font-semibold uppercase tracking-[0.06em] text-slate-600 dark:text-slate-300 line-clamp-2 min-h-[2rem]">
            {t.kpiTotalIngested}
          </div>
          <div className="flex items-baseline justify-between gap-2 my-1.5">
            <span className="fluid-kpi-numeral text-slate-900 dark:text-white">{dynamicKpis.totalIngested}</span>
            <span className="px-2 py-0.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 text-[11px] font-bold inline-flex items-center gap-0.5">
              <ArrowUpRight className="w-3 h-3" />
              {dynamicKpis.totalIngestedTrend}
            </span>
          </div>
          <div className="text-xs text-slate-600 dark:text-slate-400 truncate">
            {filters.region !== 'All Regions (8)' ? `Filtered: ${filters.region}` : t.kpiTotalIngestedSub}
          </div>
        </div>

        {/* Metric 2: Pre-Cleared */}
        <div className="top-rule-compliant p-4 bg-white/70 dark:bg-slate-900/70 hover:-translate-y-0.5 hover:bg-white dark:hover:bg-slate-800/90 transition-all duration-200 flex flex-col justify-between">
          <div className="text-xs font-semibold uppercase tracking-[0.06em] text-slate-600 dark:text-slate-300 line-clamp-2 min-h-[2rem]">
            {t.kpiPreCleared}
          </div>
          <div className="flex items-baseline justify-between gap-2 my-1.5">
            <span className="fluid-kpi-numeral text-emerald-700 dark:text-emerald-400">{dynamicKpis.preCleared}</span>
            <span className="px-2 py-0.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold inline-flex items-center gap-0.5">
              <CheckCircle2 className="w-3 h-3" />
              {dynamicKpis.preClearedPct}
            </span>
          </div>
          <div className="text-xs text-slate-600 dark:text-slate-400 truncate">
            {t.kpiPreClearedSub}
          </div>
        </div>

        {/* Metric 3: Deficiencies Issued */}
        <div className="top-rule-deficiency p-4 bg-white/70 dark:bg-slate-900/70 hover:-translate-y-0.5 hover:bg-white dark:hover:bg-slate-800/90 transition-all duration-200 flex flex-col justify-between">
          <div className="text-xs font-semibold uppercase tracking-[0.06em] text-slate-600 dark:text-slate-300 line-clamp-2 min-h-[2rem]">
            {t.kpiDeficienciesIssued}
          </div>
          <div className="flex items-baseline justify-between gap-2 my-1.5">
            <span className="fluid-kpi-numeral text-amber-700 dark:text-amber-400">{dynamicKpis.deficienciesIssued}</span>
            <span className="px-2 py-0.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300 text-[11px] font-bold inline-flex items-center gap-0.5">
              <ArrowDownRight className="w-3 h-3" />
              {dynamicKpis.deficienciesTrend}
            </span>
          </div>
          <div className="text-xs text-slate-600 dark:text-slate-400 truncate">
            {t.kpiDeficienciesIssuedSub}
          </div>
        </div>

        {/* Metric 4: Fatal Forgery */}
        <div className="top-rule-fraud p-4 bg-white/70 dark:bg-slate-900/70 hover:-translate-y-0.5 hover:bg-white dark:hover:bg-slate-800/90 transition-all duration-200 flex flex-col justify-between">
          <div className="text-xs font-semibold uppercase tracking-[0.06em] text-slate-600 dark:text-slate-300 line-clamp-2 min-h-[2rem]">
            {t.kpiFatalFraud}
          </div>
          <div className="flex items-baseline justify-between gap-2 my-1.5">
            <span className="fluid-kpi-numeral text-red-600 dark:text-red-400">{dynamicKpis.fatalFraud}</span>
            <span className="px-2 py-0.5 rounded-full border border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300 text-[11px] font-bold inline-flex items-center gap-0.5">
              <ArrowUpRight className="w-3 h-3" />
              {dynamicKpis.fatalFraudTrend}
            </span>
          </div>
          <div className="text-xs text-slate-600 dark:text-slate-400 truncate">
            {t.kpiFatalFraudSub}
          </div>
        </div>

        {/* Metric 5: Ghost Faculty */}
        <div className="top-rule-fraud p-4 bg-white/70 dark:bg-slate-900/70 hover:-translate-y-0.5 hover:bg-white dark:hover:bg-slate-800/90 transition-all duration-200 flex flex-col justify-between">
          <div className="text-xs font-semibold uppercase tracking-[0.06em] text-slate-600 dark:text-slate-300 line-clamp-2 min-h-[2rem]">
            {t.kpiGhostFaculty}
          </div>
          <div className="flex items-baseline justify-between gap-2 my-1.5">
            <span className="fluid-kpi-numeral text-red-600 dark:text-red-400">{dynamicKpis.ghostFaculty}</span>
            <span className="px-2 py-0.5 rounded-full border border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300 text-[11px] font-bold inline-flex items-center gap-0.5">
              <UserX className="w-3 h-3" />
              {dynamicKpis.ghostColleges}
            </span>
          </div>
          <div className="text-xs text-slate-600 dark:text-slate-400 truncate">
            {t.kpiGhostFacultySub}
          </div>
        </div>

        {/* Metric 6: Authority Live */}
        <div className="top-rule-compliant p-4 bg-white/70 dark:bg-slate-900/70 hover:-translate-y-0.5 hover:bg-white dark:hover:bg-slate-800/90 transition-all duration-200 flex flex-col justify-between">
          <div className="text-xs font-semibold uppercase tracking-[0.06em] text-slate-600 dark:text-slate-300 line-clamp-2 min-h-[2rem]">
            {t.kpiAuthorityLive}
          </div>
          <div className="flex items-baseline justify-between gap-2 my-1.5">
            <span className="fluid-kpi-numeral text-emerald-700 dark:text-emerald-400">{dynamicKpis.authorityRate}</span>
            <span className="px-2 py-0.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold inline-flex items-center gap-0.5">
              {dynamicKpis.authorityLatency}
            </span>
          </div>
          <div className="text-xs text-slate-600 dark:text-slate-400 truncate">
            {t.kpiAuthorityLiveSub}
          </div>
        </div>
      </section>

      {/* Row 2: Priority Intervention / High-Risk Alert Banner (SIH26246 Pattern) */}
      <section className="glass-interactive border border-red-500/30 bg-red-500/5 dark:bg-red-500/10 rounded-2xl p-4 sm:p-5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-start gap-3.5 min-w-0">
          {/* Dual Pulsing Radar Indicator */}
          <div className="relative flex h-3.5 w-3.5 mt-1 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-red-600"></span>
          </div>

          <div className="space-y-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2 py-0.5 text-[10px] font-mono font-bold tracking-wider uppercase rounded-md bg-red-600 text-white shadow-2xs">
                {t.criticalAlertBadge}
              </span>
              <span className="text-xs font-semibold text-red-700 dark:text-red-300">
                Fatal Document Forgery & Multi-College Ghost Faculty
              </span>
            </div>
            <p className="text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200 leading-snug">
              {t.criticalAlertTitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto">
          <Link
            href="/applications/AICTE-2026-NW-0842"
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-600/20 transition-all hover:-translate-y-0.5"
          >
            <FileSearch className="w-3.5 h-3.5" />
            <span>{t.btnViewEvidence}</span>
          </Link>
          <button
            onClick={handleGenerateNoticeToast}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all shadow-2xs"
          >
            <FileWarning className="w-3.5 h-3.5 text-amber-600" />
            <span>{t.btnGenerateNotice}</span>
          </button>
        </div>
      </section>

      {/* Row 3: 2-Column Asymmetric Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Regional Scrutiny Matrix (7 cols) */}
        <section className="lg:col-span-7 liquid-glass-card rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                <span>{t.regionalMatrixTitle}</span>
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                {t.regionalMatrixSub}
              </p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold border border-slate-200 dark:border-slate-700">
              {filters.region !== 'All Regions (8)' ? `Active: ${filters.region}` : '8 Regional Offices'}
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
                  className={`p-3 rounded-xl border transition-all cursor-pointer group ${
                    isSelected
                      ? 'bg-sky-50/80 dark:bg-sky-950/40 border-sky-500 shadow-sm ring-1.5 ring-sky-500/40'
                      : 'bg-white/50 dark:bg-slate-800/40 hover:bg-white/90 dark:hover:bg-slate-800/80 border-slate-200/80 dark:border-slate-700/60'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <div className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-sky-600 dark:group-hover:text-sky-400 flex items-center gap-2">
                      <span className={isSelected ? 'text-sky-700 dark:text-sky-300 font-bold' : ''}>{reg.region}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                        {reg.applications} dossiers
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-[11px] font-mono">
                      <span className="text-emerald-700 dark:text-emerald-400 font-bold">{compliantPct}% Compliant</span>
                      <span className="text-amber-700 dark:text-amber-400 font-bold">{reg.rectifiableCount} Deficiencies</span>
                      <span className="text-red-600 dark:text-red-400 font-bold">{reg.fatalFraudCount} Fatal</span>
                    </div>
                  </div>

                  {/* Tri-color Stacked Bar */}
                  <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden flex">
                    <div style={{ width: `${compliantPct}%` }} className="bg-emerald-500 h-full" title={`Compliant: ${compliantPct}%`} />
                    <div style={{ width: `${rectifiablePct}%` }} className="bg-amber-500 h-full" title={`Rectifiable: ${rectifiablePct}%`} />
                    <div style={{ width: `${fraudPct}%` }} className="bg-red-500 h-full" title={`Fatal Fraud: ${fraudPct}%`} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Right: Subsystem Anomaly Telemetry & Authority Latencies (5 cols) */}
        <section className="lg:col-span-5 liquid-glass-card rounded-2xl p-5 space-y-5">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Server className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              <span>{t.telemetryTitle}</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {t.telemetrySub}
            </p>
          </div>

          {/* Top Forensic Triggers */}
          <div className="space-y-2.5">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Active Neural Detection Triggers
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-between">
                <span className="font-semibold text-red-700 dark:text-red-300">1. Fire NOC Expiry / Date Splicing</span>
                <span className="font-mono font-bold text-red-700 dark:text-red-300">62 cases (TruFor)</span>
              </div>
              <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-between">
                <span className="font-semibold text-red-700 dark:text-red-300">2. EPFO ECR 2.0 / Ghost Faculty Overlap</span>
                <span className="font-mono font-bold text-red-700 dark:text-red-300">94 colleges (ArcFace)</span>
              </div>
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between">
                <span className="font-semibold text-amber-700 dark:text-amber-300">3. Blueprint Lab Carpet Area Inflation</span>
                <span className="font-mono font-bold text-amber-700 dark:text-amber-300">41 cases (Mask2Former)</span>
              </div>
              <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-between">
                <span className="font-semibold text-indigo-700 dark:text-indigo-300">4. Digital Signature & Seal Cloning</span>
                <span className="font-mono font-bold text-indigo-700 dark:text-indigo-300">28 cases (SSIM &gt; 0.995)</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-500/10 border border-slate-500/20 flex items-center justify-between">
                <span className="font-semibold text-slate-700 dark:text-slate-300">5. Land Contiguity &gt; 2.0 km / FSI Deficit</span>
                <span className="font-mono font-bold text-slate-700 dark:text-slate-300">17 cases (Haversine)</span>
              </div>
            </div>
          </div>

          {/* Authority Response Times */}
          <div className="space-y-2.5 pt-2 border-t border-slate-200/60 dark:border-slate-800">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              National DPI Bridge Live Latency
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 flex flex-col">
                <span className="text-[10px] text-slate-400">DigiLocker Pull URI</span>
                <span className="text-emerald-700 dark:text-emerald-400 font-bold">118 ms (99.8%)</span>
              </div>
              <div className="p-2 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 flex flex-col">
                <span className="text-[10px] text-slate-400">EPFO Shram Suvidha</span>
                <span className="text-emerald-700 dark:text-emerald-400 font-bold">164 ms (98.2%)</span>
              </div>
              <div className="p-2 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 flex flex-col">
                <span className="text-[10px] text-slate-400">MCA21 v3 Registry</span>
                <span className="text-emerald-700 dark:text-emerald-400 font-bold">142 ms (99.1%)</span>
              </div>
              <div className="p-2 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 flex flex-col">
                <span className="text-[10px] text-slate-400">State e-District QR</span>
                <span className="text-emerald-700 dark:text-emerald-400 font-bold">88 ms (99.9%)</span>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Row 4: High-Risk Institutional Dossier Queue */}
      <section className="liquid-glass-card rounded-2xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <AlertOctagon className="w-4 h-4 text-red-600 dark:text-red-400" />
              <span>{t.highRiskQueueTitle}</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {t.highRiskQueueSub}
            </p>
          </div>
          <Link
            href="/applications"
            className="text-xs font-semibold text-sky-700 dark:text-sky-400 hover:underline flex items-center gap-1"
          >
            <span>Complete Registry Table ({filteredApplications.length})</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200/80 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                <th className="py-2.5 px-3">{t.colInstitution}</th>
                <th className="py-2.5 px-3">{t.colRegion}</th>
                <th className="py-2.5 px-3">{t.colIciScore}</th>
                <th className="py-2.5 px-3">{t.colTopAnomaly}</th>
                <th className="py-2.5 px-3">{t.colAuthorityState}</th>
                <th className="py-2.5 px-3 text-right">{t.colAction}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {highRiskQueue.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <AlertTriangle className="w-6 h-6 text-amber-500 opacity-60" />
                      <div className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        No institutional dossiers match the selected filters
                      </div>
                      <button
                        onClick={() => setFilters((prev) => ({ ...prev, region: 'All Regions (8)', scrutinyStatus: 'All Statuses' }))}
                        className="mt-1 px-3 py-1 rounded-lg text-xs font-semibold bg-sky-500/10 text-sky-700 dark:text-sky-300 hover:bg-sky-500/20 transition-colors"
                      >
                        Reset Filter Criteria
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                highRiskQueue.map((app) => {
                  const topAnom = app.anomalies[0];
                  const isFatal = app.scrutinyStatus === 'Fatal Fraud Alert';
                  const isCleared = app.scrutinyStatus === 'Auto-Pre-Cleared';


                return (
                  <tr
                    key={app.id}
                    className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors group"
                  >
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                        {language === 'hi' ? app.nameHi : app.nameEn}
                      </div>
                      <div className="text-[11px] font-mono text-slate-400 flex items-center gap-2 mt-0.5">
                        <span>{app.id}</span>
                        <span>•</span>
                        <span>PID: {app.pid}</span>
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <div className="text-slate-800 dark:text-slate-200 font-medium">
                        {app.region}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {app.city}, {app.state}
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-mono font-bold text-sm ${
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
                          <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-red-600 text-white">
                            VETO
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        RPN: {app.maxRpn}
                      </div>
                    </td>

                    <td className="py-3 px-3 max-w-xs">
                      {topAnom ? (
                        <div>
                          <div className="text-[11px] font-semibold text-slate-800 dark:text-slate-200 line-clamp-1">
                            {language === 'hi' ? topAnom.titleHi : topAnom.titleEn}
                          </div>
                          <div className="text-[10px] font-mono text-red-600 dark:text-red-400 mt-0.5">
                            {topAnom.modelUsed.split('+')[0]} • {Math.round(topAnom.tamperProbability * 100)}% Conf
                          </div>
                        </div>
                      ) : (
                        <div className="text-emerald-600 dark:text-emerald-400 text-xs font-medium flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Zero Deficiencies</span>
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          isFatal
                            ? 'bg-red-500/10 text-red-700 dark:text-red-400 border border-red-500/20'
                            : isCleared
                            ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20'
                        }`}
                      >
                        {isFatal ? 'MISMATCH_DETECTED' : isCleared ? 'VERIFIED' : 'PARTIAL_DEFICIENCY'}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-right">
                      <Link
                        href={`/applications/${app.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl font-bold text-xs bg-sky-500/10 text-sky-700 dark:text-sky-300 hover:bg-sky-500/20 border border-sky-500/25 transition-all shadow-2xs group-hover:scale-105"
                      >
                        <span>{t.btnLaunchWorkbench}</span>
                      </Link>
                    </td>
                  </tr>
                );
              })
            )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
