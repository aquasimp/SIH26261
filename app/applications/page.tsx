'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage, useFilters } from '@/lib/context';
import { InstitutionalApplication } from '@/lib/mock-data';
import { toast } from 'sonner';
import {
  Search,
  Download,
  Building2,
  AlertTriangle,
  CheckCircle2,
  ArrowUpDown,
  Filter,
  Eye,
  ChevronRight,
  ChevronDown,
  LayoutGrid,
  List,
} from 'lucide-react';

export default function ApplicationsPage() {
  const { t, language } = useLanguage();
  const { filteredApplications, filters, setFilters } = useFilters();
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [sortBy, setSortBy] = useState<'rpn' | 'ici' | 'date'>('rpn');

  // Sorting
  const sortedApplications = [...filteredApplications].sort((a, b) => {
    if (sortBy === 'rpn') return b.maxRpn - a.maxRpn;
    if (sortBy === 'ici') return b.iciScore - a.iciScore;
    return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
  });

  // Export functions
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
    toast.success('Exported registry records to CSV successfully');
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(sortedApplications, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `AICTE_Scrutiny_Dossiers_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    toast.success('Exported registry records to JSON successfully');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Title & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Institutional Dossier{' '}
            <span className="font-serif italic font-normal text-sky-700 dark:text-sky-400">
              Registry
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Searchable statutory repository across all 8 AICTE regions with 5-component ICI sub-scores and forensic flags.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Card / Table view toggle */}
          <div className="inline-flex rounded-xl p-0.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'table' ? 'bg-white dark:bg-slate-900 text-sky-600 shadow-2xs' : 'text-slate-400 hover:text-slate-600'
              }`}
              title="Table view"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'cards' ? 'bg-white dark:bg-slate-900 text-sky-600 shadow-2xs' : 'text-slate-400 hover:text-slate-600'
              }`}
              title="Card view"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          {/* Sort selector */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="appearance-none pl-2.5 pr-6 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-2xs cursor-pointer focus:outline-none"
            >
              <option value="rpn">Sort: Highest Risk (RPN)</option>
              <option value="ici">Sort: Compliance Index (ICI)</option>
              <option value="date">Sort: Submission Date</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          </div>

          {/* Export buttons */}
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-sky-500/40 text-xs font-semibold transition-all shadow-2xs"
            title="Export CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>CSV</span>
          </button>
          <button
            onClick={handleExportJSON}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-sky-500/40 text-xs font-semibold transition-all shadow-2xs"
            title="Export JSON"
          >
            <Download className="w-3.5 h-3.5" />
            <span>JSON</span>
          </button>
        </div>
      </div>

      {/* In-page quick search filter bar */}
      <div className="flex items-center gap-3 p-3 rounded-2xl liquid-glass-card">
        <Search className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
        <input
          type="text"
          placeholder="Filter by Institution Name, AICTE Permanent ID (PID), City, or Trust..."
          value={filters.searchQuery}
          onChange={(e) => setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))}
          className="w-full bg-transparent text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none"
        />
        {filters.searchQuery && (
          <button
            onClick={() => setFilters((prev) => ({ ...prev, searchQuery: '' }))}
            className="text-xs text-slate-400 hover:text-slate-600 px-2 font-medium"
          >
            Clear
          </button>
        )}
      </div>

      {/* Table View */}
      {viewMode === 'table' ? (
        <div className="liquid-glass-card rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  <th className="py-3 px-4">Application & Institution</th>
                  <th className="py-3 px-3">Category & Zone</th>
                  <th className="py-3 px-3">ICI Score & Sub-scores</th>
                  <th className="py-3 px-3">Max RPN Risk</th>
                  <th className="py-3 px-3">Scrutiny Status</th>
                  <th className="py-3 px-4 text-right">Scrutiny Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {sortedApplications.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400 text-xs">
                      No applications match the current filter criteria.
                    </td>
                  </tr>
                ) : (
                  sortedApplications.map((app) => {
                    const isFatal = app.scrutinyStatus === 'Fatal Fraud Alert';
                    const isCleared = app.scrutinyStatus === 'Auto-Pre-Cleared';
                    const isDeficiency = app.scrutinyStatus === 'Deficiency Issued';

                    return (
                      <tr
                        key={app.id}
                        className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group"
                      >
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                            {language === 'hi' ? app.nameHi : app.nameEn}
                          </div>
                          <div className="text-[11px] font-mono text-slate-400 flex items-center gap-2 mt-0.5">
                            <span className="font-semibold text-slate-600 dark:text-slate-300">{app.id}</span>
                            <span>•</span>
                            <span>PID: {app.pid}</span>
                            <span>•</span>
                            <span>{app.city}, {app.state}</span>
                          </div>
                        </td>

                        <td className="py-3.5 px-3">
                          <div className="font-medium text-slate-800 dark:text-slate-200">
                            {app.applicationCategory}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {app.region} • {app.zoneType} ({app.institutionType})
                          </div>
                        </td>

                        <td className="py-3.5 px-3">
                          <div className="flex items-center gap-2">
                            <span
                              className={`font-mono font-bold text-base ${
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
                                FATAL VETO
                              </span>
                            )}
                          </div>

                          {/* 5-Component Spark Bar */}
                          <div className="flex items-center gap-1 mt-1.5 w-32" title="Infra, Faculty, Legal, Authority, Financial">
                            <div className="h-1.5 rounded-full bg-sky-500" style={{ width: `${app.subScores.infra}%` }} title={`Infra: ${app.subScores.infra}`} />
                            <div className="h-1.5 rounded-full bg-indigo-500" style={{ width: `${app.subScores.faculty}%` }} title={`Faculty: ${app.subScores.faculty}`} />
                            <div className="h-1.5 rounded-full bg-violet-500" style={{ width: `${app.subScores.legal}%` }} title={`Legal: ${app.subScores.legal}`} />
                            <div className="h-1.5 rounded-full bg-emerald-500" style={{ width: `${app.subScores.authority}%` }} title={`Authority: ${app.subScores.authority}`} />
                            <div className="h-1.5 rounded-full bg-amber-500" style={{ width: `${app.subScores.financial}%` }} title={`Financial: ${app.subScores.financial}`} />
                          </div>
                        </td>

                        <td className="py-3.5 px-3">
                          <div className="font-mono font-bold text-xs text-slate-800 dark:text-slate-200">
                            RPN {app.maxRpn}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {app.anomalies.length} Anomaly Triggers
                          </div>
                        </td>

                        <td className="py-3.5 px-3">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                              isFatal
                                ? 'bg-red-500/10 text-red-700 dark:text-red-400 border border-red-500/25'
                                : isCleared
                                ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/25'
                                : isDeficiency
                                ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/25'
                                : 'bg-slate-500/10 text-slate-700 dark:text-slate-400 border border-slate-500/25'
                            }`}
                          >
                            {isFatal && <span className="h-1.5 w-1.5 rounded-full bg-red-600 animate-pulse" />}
                            {app.scrutinyStatus}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <Link
                            href={`/applications/${app.id}`}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold text-xs bg-sky-600 hover:bg-sky-700 text-white shadow-xs transition-all hover:-translate-y-0.5"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Launch Workbench</span>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {sortedApplications.map((app) => {
            const isFatal = app.scrutinyStatus === 'Fatal Fraud Alert';
            const isCleared = app.scrutinyStatus === 'Auto-Pre-Cleared';

            return (
              <div
                key={app.id}
                className="liquid-glass-card rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:-translate-y-1 transition-all shadow-sm"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isFatal
                          ? 'bg-red-500/10 text-red-700 dark:text-red-400 border border-red-500/20'
                          : isCleared
                          ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20'
                      }`}
                    >
                      {app.scrutinyStatus}
                    </span>
                    <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300">
                      RPN {app.maxRpn}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white mt-2.5">
                    {language === 'hi' ? app.nameHi : app.nameEn}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                    PID: {app.pid} • {app.city}, {app.state} • {app.applicationCategory}
                  </p>

                  <div className="mt-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs">
                    <div>
                      <div className="text-[10px] uppercase font-bold text-slate-400">Compliance Index</div>
                      <div className="text-lg font-bold font-mono text-slate-900 dark:text-white flex items-center gap-1.5">
                        <span>{app.iciScore.toFixed(1)}</span>
                        <span className="text-xs font-normal text-slate-400">/ 100</span>
                        {app.fatalGateTriggered && (
                          <span className="text-[9px] font-mono font-bold px-1 rounded bg-red-600 text-white">
                            VETO
                          </span>
                        )}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase font-bold text-slate-400">Total Built-up</div>
                      <div className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
                        {app.landAndBuiltUp.totalBuiltUpAvailableSqm.toLocaleString()} m²
                      </div>
                    </div>
                  </div>

                  {/* 5-Component Spark Bar */}
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold mb-1">
                      <span>5-COMP ICI PROFILE</span>
                      <span className="font-mono">Infra • Fac • Leg • Auth • Fin</span>
                    </div>
                    <div className="flex items-center gap-1 w-full">
                      <div className="h-1.5 rounded-full bg-sky-500" style={{ width: `${app.subScores.infra}%` }} title={`Infra: ${app.subScores.infra}`} />
                      <div className="h-1.5 rounded-full bg-indigo-500" style={{ width: `${app.subScores.faculty}%` }} title={`Faculty: ${app.subScores.faculty}`} />
                      <div className="h-1.5 rounded-full bg-violet-500" style={{ width: `${app.subScores.legal}%` }} title={`Legal: ${app.subScores.legal}`} />
                      <div className="h-1.5 rounded-full bg-emerald-500" style={{ width: `${app.subScores.authority}%` }} title={`Authority: ${app.subScores.authority}`} />
                      <div className="h-1.5 rounded-full bg-amber-500" style={{ width: `${app.subScores.financial}%` }} title={`Financial: ${app.subScores.financial}`} />
                    </div>
                  </div>

                  {/* Active Forensic Flags */}
                  {app.anomalies.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {app.anomalies.slice(0, 2).map((anom) => (
                        <span
                          key={anom.id}
                          className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700"
                        >
                          {anom.category.replace(/_/g, ' ')}
                        </span>
                      ))}
                      {app.anomalies.length > 2 && (
                        <span className="text-[10px] font-mono text-slate-400 py-0.5">
                          +{app.anomalies.length - 2} more
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <Link
                  href={`/applications/${app.id}`}
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold bg-sky-600 hover:bg-sky-700 text-white shadow-xs transition-all hover:-translate-y-0.5"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Open Scrutiny Workbench</span>
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
