'use client';

import React from 'react';
import { useFilters, useLanguage } from '@/lib/context';
import { Filter, RotateCcw, ChevronDown } from 'lucide-react';

export function GlobalFilterBar() {
  const { filters, setFilters, resetFilters, resetDemoState, filteredApplications } = useFilters();
  const { t } = useLanguage();

  const isFiltered =
    filters.academicYear !== '2026-27' ||
    filters.region !== 'All Regions (8)' ||
    filters.institutionType !== 'All Types' ||
    filters.applicationCategory !== 'All Categories' ||
    filters.scrutinyStatus !== 'All Statuses' ||
    filters.searchQuery !== '';

  return (
    <div className="w-full px-4 py-2 border-b border-[var(--glass-border)] bg-[var(--glass-bg-subtle)] backdrop-blur-xl transition-colors">
      <div className="flex flex-wrap items-center justify-between gap-2.5 text-xs">
        {/* Left: Filter dropdown pills */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-[var(--text-muted)] font-mono font-semibold uppercase tracking-wider text-[9.5px] mr-0.5">
            <Filter className="w-3 h-3 text-[var(--text-faint)]" />
            <span>Scope:</span>
          </div>

          {/* Academic Year */}
          <div className="relative">
            <select
              value={filters.academicYear}
              onChange={(e) => setFilters((prev) => ({ ...prev, academicYear: e.target.value }))}
              className="appearance-none pl-2.5 pr-6 py-1 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] font-medium text-[var(--text-primary)] hover:border-[var(--glass-border-strong)] transition-all shadow-2xs focus:outline-none focus:ring-1 focus:ring-slate-400 dark:focus:ring-slate-500 cursor-pointer text-xs font-mono"
            >
              <option value="2026-27">AY 2026-27 (Current)</option>
              <option value="2025-26">AY 2025-26 (Archived)</option>
              <option value="2024-25">AY 2024-25 (Historical)</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--text-faint)]" />
          </div>

          {/* AICTE Region */}
          <div className="relative">
            <select
              value={filters.region}
              onChange={(e) => setFilters((prev) => ({ ...prev, region: e.target.value }))}
              className="appearance-none pl-2.5 pr-6 py-1 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] font-medium text-[var(--text-primary)] hover:border-[var(--glass-border-strong)] transition-all shadow-2xs focus:outline-none focus:ring-1 focus:ring-slate-400 dark:focus:ring-slate-500 cursor-pointer text-xs"
            >
              <option value="All Regions (8)">{t.allRegions}</option>
              <option value="North-Western">North-Western (Delhi/NCR/PB)</option>
              <option value="Southern">Southern (Chennai/TN)</option>
              <option value="Western">Western (Mumbai/MH/Goa)</option>
              <option value="South-Western">South-Western (Bengaluru/KA)</option>
              <option value="Eastern">Eastern (Kolkata/OD)</option>
              <option value="Central">Central (Bhopal/MP)</option>
              <option value="Northern">Northern (Kanpur/UP)</option>
              <option value="South-Central">South-Central (Hyderabad/TS)</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--text-faint)]" />
          </div>

          {/* Institution Type */}
          <div className="relative">
            <select
              value={filters.institutionType}
              onChange={(e) => setFilters((prev) => ({ ...prev, institutionType: e.target.value }))}
              className="appearance-none pl-2.5 pr-6 py-1 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] font-medium text-[var(--text-primary)] hover:border-[var(--glass-border-strong)] transition-all shadow-2xs focus:outline-none focus:ring-1 focus:ring-slate-400 dark:focus:ring-slate-500 cursor-pointer text-xs"
            >
              <option value="All Types">{t.allTypes}</option>
              <option value="Private Self-Financed">Private Self-Financed</option>
              <option value="Government / Aided">Government / Aided</option>
              <option value="Deemed-to-be University">Deemed-to-be University</option>
              <option value="Autonomous">Autonomous</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--text-faint)]" />
          </div>

          {/* Application Category */}
          <div className="relative">
            <select
              value={filters.applicationCategory}
              onChange={(e) => setFilters((prev) => ({ ...prev, applicationCategory: e.target.value }))}
              className="appearance-none pl-2.5 pr-6 py-1 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] font-medium text-[var(--text-primary)] hover:border-[var(--glass-border-strong)] transition-all shadow-2xs focus:outline-none focus:ring-1 focus:ring-slate-400 dark:focus:ring-slate-500 cursor-pointer text-xs"
            >
              <option value="All Categories">{t.allCategories}</option>
              <option value="Extension of Approval (EoA)">Extension of Approval (EoA)</option>
              <option value="Increase in Intake / New Course">Increase in Intake / New Course</option>
              <option value="New Technical Institution">New Technical Institution</option>
              <option value="Change of Site / Closure">Change of Site / Closure</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--text-faint)]" />
          </div>

          {/* Scrutiny Status */}
          <div className="relative">
            <select
              value={filters.scrutinyStatus}
              onChange={(e) => setFilters((prev) => ({ ...prev, scrutinyStatus: e.target.value }))}
              className="appearance-none pl-2.5 pr-6 py-1 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] font-medium text-[var(--text-primary)] hover:border-[var(--glass-border-strong)] transition-all shadow-2xs focus:outline-none focus:ring-1 focus:ring-slate-400 dark:focus:ring-slate-500 cursor-pointer text-xs"
            >
              <option value="All Statuses">{t.allStatuses}</option>
              <option value="Fatal Fraud Alert">Fatal Fraud Alert (Red Veto)</option>
              <option value="Deficiency Issued">Deficiency Issued (15-Day EVC)</option>
              <option value="Auto-Pre-Cleared">Auto-Pre-Cleared (Fast-Track)</option>
              <option value="Manual Review Required">Manual Review Required</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--text-faint)]" />
          </div>
        </div>

        {/* Right: Matches Count & Reset */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[11px] font-mono text-[var(--text-muted)]">
            Showing <strong className="text-[var(--text-primary)] font-bold">{filteredApplications.length}</strong> Dossiers
          </span>

          {isFiltered && (
            <button
              onClick={resetFilters}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[var(--text-secondary)] hover:text-[var(--text-primary)] bg-[var(--glass-bg)] border border-[var(--glass-border)] hover:border-[var(--glass-border-strong)] text-[10.5px] font-mono font-medium transition-all shadow-2xs cursor-pointer"
            >
              <RotateCcw className="w-2.5 h-2.5" />
              <span>Reset</span>
            </button>
          )}

          <button
            onClick={resetDemoState}
            title="Restore initial 6 flagship institutions and default audit ledger"
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[var(--text-muted)] hover:text-amber-600 dark:hover:text-amber-400 bg-[var(--glass-bg)] border border-[var(--glass-border)] hover:border-amber-500/40 text-[10px] font-mono font-medium transition-all shadow-2xs cursor-pointer"
          >
            <RotateCcw className="w-2.5 h-2.5 text-amber-500" />
            <span>Reset Demo</span>
          </button>
        </div>
      </div>
    </div>
  );
}
