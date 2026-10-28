'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage, useFilters } from '@/lib/context';
import { REGIONAL_STATS, RegionalStats } from '@/lib/mock-data';
import IndiaChoroplethMap from '@/components/workbench/IndiaChoroplethMap';
import { toast } from 'sonner';
import {
  BarChart3,
  TrendingUp,
  Download,
  Printer,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Building,
  Calendar,
  Filter,
  Layers,
  MapPin,
  FileText,
} from 'lucide-react';

export default function ReportsAnalyticsPage() {
  const { t, language } = useLanguage();
  const { applications } = useFilters();

  const [selectedTimeRange, setSelectedTimeRange] = useState<'7d' | '30d' | '90d'>('7d');
  const [selectedRegion, setSelectedRegion] = useState<string>('ALL');

  // Trend data points for the Scrutiny Throughput Chart
  const trendData = [
    { date: '10 Jan', dossiers: 95, cleared: 62, deficiencies: 25, fraud: 8 },
    { date: '11 Jan', dossiers: 110, cleared: 78, deficiencies: 28, fraud: 4 },
    { date: '12 Jan', dossiers: 104, cleared: 70, deficiencies: 30, fraud: 4 },
    { date: '13 Jan', dossiers: 135, cleared: 88, deficiencies: 38, fraud: 9 },
    { date: '14 Jan', dossiers: 120, cleared: 82, deficiencies: 31, fraud: 7 },
    { date: '15 Jan', dossiers: 148, cleared: 102, deficiencies: 39, fraud: 7 },
  ];

  const handleExportSummaryCSV = () => {
    const csvContent = [
      ['Region', 'Total Applications', 'Avg ICI Score', 'Compliant Count', 'Rectifiable Count', 'Fatal Fraud Count'].join(','),
      ...REGIONAL_STATS.map((r: RegionalStats) =>
        [r.region, r.applications, r.avgIci, r.compliantCount, r.rectifiableCount, r.fatalFraudCount].join(',')
      ),
    ].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `AICTE_Regional_Scrutiny_Summary_${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('Exported regional regulatory summary to CSV');
  };

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-glass-in">
      {/* Page Title & Action Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-1 px-1">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[12px] font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider">
              AICTE Strategic Regulatory Intelligence
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--text-primary)]">
            Reports &amp;{' '}
            <span className="font-extrabold text-sky-600 dark:text-sky-400">
              Analytics Bureau
            </span>
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1 max-w-3xl leading-relaxed">
            National institutional compliance benchmarks, state-level scrutiny throughput, risk concentrations, and audit documentation.
          </p>
        </div>

        {/* Global Export & Print Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handleExportSummaryCSV}
            className="btn-liquid-secondary cursor-pointer px-3.5 py-2.5 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 shadow-2xs"
          >
            <Download className="w-4 h-4 text-[var(--text-muted)]" />
            <span>Export Registry (CSV)</span>
          </button>

          <button
            onClick={handlePrintReport}
            className="btn-liquid-primary cursor-pointer px-4 py-2.5 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 shadow-sm"
          >
            <Printer className="w-4 h-4" />
            <span>Print Executive Brief</span>
          </button>
        </div>
      </div>

      {/* Top 4 Performance KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <div className="liquid-glass-card rounded-[20px] p-5 space-y-1.5 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
          <span className="text-xs uppercase tracking-wider text-[var(--text-muted)] font-semibold block">
            Total Dossiers Ingested
          </span>
          <div className="text-3xl font-extrabold text-[var(--text-primary)]">
            4,820
          </div>
          <div className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+12.4% vs AY 2023–24</span>
          </div>
        </div>

        <div className="liquid-glass-card rounded-[20px] p-5 space-y-1.5 border border-emerald-500/25 bg-emerald-500/5 shadow-sm">
          <span className="text-xs uppercase tracking-wider text-emerald-800 dark:text-emerald-200 font-semibold block">
            Pre-Scrutiny Clearance Rate
          </span>
          <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
            66.3%
          </div>
          <div className="text-xs text-emerald-800 dark:text-emerald-200 font-medium">
            3,194 institutions auto-cleared with zero shortfall
          </div>
        </div>

        <div className="liquid-glass-card rounded-[20px] p-5 space-y-1.5 border border-amber-500/25 bg-amber-500/5 shadow-sm">
          <span className="text-xs uppercase tracking-wider text-amber-800 dark:text-amber-200 font-semibold block">
            Rectifiable Deficiencies
          </span>
          <div className="text-3xl font-extrabold text-amber-600 dark:text-amber-400">
            24.5%
          </div>
          <div className="text-xs text-amber-800 dark:text-amber-200 font-medium">
            1,182 institutions on 15-day EVC notice window
          </div>
        </div>

        <div className="liquid-glass-card rounded-[20px] p-5 space-y-1.5 border border-rose-500/25 bg-rose-500/5 shadow-sm">
          <span className="text-xs uppercase tracking-wider text-rose-800 dark:text-rose-200 font-semibold block">
            Fatal Forgery Vetoes
          </span>
          <div className="text-3xl font-extrabold text-rose-600 dark:text-rose-400">
            3.1%
          </div>
          <div className="text-xs text-rose-800 dark:text-rose-200 font-medium">
            148 dossiers escalated to Standing Hearing Comm.
          </div>
        </div>
      </div>

      {/* Row 2: Scrutiny Trends & Category Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Scrutiny Throughput Chart (2 cols) */}
        <div className="lg:col-span-2 liquid-glass-card rounded-[22px] p-5 space-y-4 shadow-sm border border-slate-200/80 dark:border-slate-800/80">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--glass-border)] pb-3">
            <div>
              <h2 className="text-base font-bold text-[var(--text-primary)]">
                Scrutiny Throughput &amp; Resolution Trends
              </h2>
              <p className="text-xs text-[var(--text-muted)]">
                Daily regulatory disposition volume across all 8 zonal offices
              </p>
            </div>

            <div className="inline-flex rounded-xl p-0.5 glass-well text-xs font-semibold">
              {(['7d', '30d', '90d'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setSelectedTimeRange(r)}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    selectedTimeRange === r
                      ? 'btn-liquid-primary shadow-xs'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {r.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Line Chart Graphic */}
          <div className="h-64 w-full pt-4">
            <svg viewBox="0 0 600 200" className="w-full h-full overflow-visible">
              {/* Grid Lines */}
              <line x1="40" y1="30" x2="580" y2="30" stroke="currentColor" className="text-slate-200 dark:text-slate-800" strokeDasharray="3 3" />
              <line x1="40" y1="80" x2="580" y2="80" stroke="currentColor" className="text-slate-200 dark:text-slate-800" strokeDasharray="3 3" />
              <line x1="40" y1="130" x2="580" y2="130" stroke="currentColor" className="text-slate-200 dark:text-slate-800" strokeDasharray="3 3" />
              <line x1="40" y1="180" x2="580" y2="180" stroke="currentColor" className="text-slate-200 dark:text-slate-800" />

              {/* Total Dossiers Line (Blue) */}
              <polyline
                fill="none"
                stroke="#0284c7"
                strokeWidth="3"
                points="50,110 150,90 250,98 350,55 450,75 550,35"
              />
              {/* Cleared Line (Emerald) */}
              <polyline
                fill="none"
                stroke="#10b981"
                strokeWidth="2.5"
                points="50,135 150,115 250,125 350,95 450,105 550,75"
              />
              {/* Deficiencies Line (Amber) */}
              <polyline
                fill="none"
                stroke="#f59e0b"
                strokeWidth="2"
                points="50,165 150,162 250,158 350,145 450,155 550,142"
              />

              {/* Data points */}
              {[
                { x: 50, y: 35, label: '10 Jan' },
                { x: 150, y: 35, label: '11 Jan' },
                { x: 250, y: 35, label: '12 Jan' },
                { x: 350, y: 35, label: '13 Jan' },
                { x: 450, y: 35, label: '14 Jan' },
                { x: 550, y: 35, label: '15 Jan' },
              ].map((p, idx) => (
                <text
                  key={idx}
                  x={p.x}
                  y="196"
                  textAnchor="middle"
                  className="fill-slate-500 text-[10.5px] font-mono"
                >
                  {p.label}
                </text>
              ))}
            </svg>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 text-xs pt-2 font-medium">
            <span className="flex items-center gap-1.5 text-sky-600 dark:text-sky-400">
              <span className="w-3 h-3 rounded-full bg-sky-500" />
              <span>Total Dossiers (Avg 120/day)</span>
            </span>
            <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              <span>Cleared (80/day)</span>
            </span>
            <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
              <span className="w-3 h-3 rounded-full bg-amber-500" />
              <span>15-Day EVC Notice (32/day)</span>
            </span>
          </div>
        </div>

        {/* Dossier Category Distribution (Donut Breakdown) */}
        <div className="liquid-glass-card rounded-[22px] p-5 space-y-4 shadow-sm border border-slate-200/80 dark:border-slate-800/80 flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-[var(--text-primary)]">
              Application Categories
            </h2>
            <p className="text-xs text-[var(--text-muted)]">
              Approval stream proportions for APH 2024–27
            </p>
          </div>

          <div className="space-y-3.5 my-auto">
            {[
              { label: 'Extension of Approval (EoA)', pct: 54, count: '2,603', color: 'bg-blue-600' },
              { label: 'New Institution Approval', pct: 22, count: '1,060', color: 'bg-emerald-500' },
              { label: 'Increase in Sanctioned Intake', pct: 15, count: '723', color: 'bg-amber-500' },
              { label: 'Closure / Mergers / Restoration', pct: 9, count: '434', color: 'bg-slate-500' },
            ].map((cat) => (
              <div key={cat.label} className="space-y-1 text-xs">
                <div className="flex justify-between font-semibold">
                  <span className="text-[var(--text-primary)]">{cat.label}</span>
                  <span className="text-[var(--text-muted)] font-mono">{cat.count} ({cat.pct}%)</span>
                </div>
                <div className="h-2 w-full rounded-full glass-well overflow-hidden">
                  <div className={`h-full ${cat.color} rounded-full`} style={{ width: `${cat.pct}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-xl glass-well text-[11px] text-[var(--text-muted)] flex items-center justify-between">
            <span>Statutory Bureau Quorum</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">Active (RO-04 / EVC)</span>
          </div>
        </div>
      </div>

      {/* Row 3: National Choropleth Map & Regional Risk Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* National State-wise Map */}
        <div className="liquid-glass-card rounded-[22px] p-5 space-y-3 shadow-sm border border-slate-200/80 dark:border-slate-800/80">
          <div className="flex items-center justify-between border-b border-[var(--glass-border)] pb-3">
            <div>
              <h2 className="text-base font-bold text-[var(--text-primary)]">
                National Dossier Density
              </h2>
              <p className="text-xs text-[var(--text-muted)]">State-wise scrutiny filings across India</p>
            </div>
            <MapPin className="w-4.5 h-4.5 text-sky-500" />
          </div>

          <div className="flex flex-col items-center justify-center space-y-2">
            <IndiaChoroplethMap />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10.5px] font-semibold text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200/70 dark:border-slate-800/70 w-full">
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

        {/* Regional Benchmarks Table (2 cols) */}
        <div className="lg:col-span-2 liquid-glass-card rounded-[22px] p-5 space-y-3.5 shadow-sm border border-slate-200/80 dark:border-slate-800/80">
          <div className="flex items-center justify-between border-b border-[var(--glass-border)] pb-3">
            <div>
              <h2 className="text-base font-bold text-[var(--text-primary)]">
                Zonal Regulatory Risk &amp; Compliance Matrix
              </h2>
              <p className="text-xs text-[var(--text-muted)]">
                Benchmarking across all 8 AICTE administrative regions
              </p>
            </div>
          </div>

          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[620px] text-left border-collapse text-xs">
              <thead className="glass-well text-[10.5px] uppercase tracking-wider text-[var(--text-muted)] font-semibold border-b border-[var(--glass-border)]">
                <tr>
                  <th className="py-2.5 px-3">AICTE Region</th>
                  <th className="py-2.5 px-3">Dossiers</th>
                  <th className="py-2.5 px-3">Avg ICI</th>
                  <th className="py-2.5 px-3">Auto-Cleared</th>
                  <th className="py-2.5 px-3">15-Day EVC Notice</th>
                  <th className="py-2.5 px-3 text-right">Fatal Alerts</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--glass-border)]">
                {REGIONAL_STATS.map((r) => (
                  <tr key={r.region} className="hover:bg-slate-900/[0.03] dark:hover:bg-white/[0.03] transition-colors">
                    <td className="py-3 px-3 font-semibold text-[var(--text-primary)]">
                      {r.region}
                    </td>
                    <td className="py-3 px-3 font-mono text-[var(--text-secondary)]">
                      {r.applications.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 font-semibold">
                      <span className={r.avgIci >= 80 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}>
                        {r.avgIci}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-emerald-600 dark:text-emerald-400 font-medium">
                      {r.compliantCount} ({Math.round((r.compliantCount / r.applications) * 100)}%)
                    </td>
                    <td className="py-3 px-3 text-amber-600 dark:text-amber-400 font-medium">
                      {r.rectifiableCount}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span className="pill-fatal inline-flex items-center gap-1 text-[10.5px] font-bold px-2 py-0.5 rounded-full">
                        {r.fatalFraudCount} Alerts
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
