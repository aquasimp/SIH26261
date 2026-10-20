'use client';

import React from 'react';
import { useFilters, useLanguage } from '@/lib/context';
import { Filter, RotateCcw, Building, MapPin, Award, Layers, AlertCircle, ChevronDown } from 'lucide-react';

export function GlobalFilterBar() {
  const { filters, setFilters, resetFilters, filteredApplications } = useFilters();
  const { t } = useLanguage();

  const isFiltered =
    filters.academicYear !== '2026-27' ||
    filters.region !== 'All Regions (8)' ||
    filters.institutionType !== 'All Types' ||
    filters.applicationCategory !== 'All Categories' ||
    filters.scrutinyStatus !== 'All Statuses' ||
    filters.searchQuery !== '';

  return (
    <div className="w-full px-6 py-2.5 border-b border-slate-200 dark:border-slate-800 bg-white/75 dark:bg-slate-900/75 backdrop-blur-md">
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Left: Filter dropdown pills */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-[10px] mr-1">
            <Filter className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
            <span>Filters:</span>
          </div>

          {/* Academic Year */}
          <div className="relative">
            <select
              value={filters.academicYear}
              onChange={(e) => setFilters((prev) => ({ ...prev, academicYear: e.target.value }))}
              className="appearance-none pl-2.5 pr-6 py-1 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-slate-800 dark:text-slate-100 hover:border-sky-500/40 transition-colors shadow-2xs focus:outline-none focus:ring-1 focus:ring-sky-500 cursor-pointer text-xs"
            >
              <option value="2026-27">AY 2026-27 (Current)</option>
              <option value="2025-26">AY 2025-26 (Archived)</option>
              <option value="2024-25">AY 2024-25 (Historical)</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          </div>

          {/* AICTE Region */}
          <div className="relative">
            <select
              value={filters.region}
              onChange={(e) => setFilters((prev) => ({ ...prev, region: e.target.value }))}
              className="appearance-none pl-2.5 pr-6 py-1 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-slate-800 dark:text-slate-100 hover:border-sky-500/40 transition-colors shadow-2xs focus:outline-none focus:ring-1 focus:ring-sky-500 cursor-pointer text-xs"
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
            <ChevronDown className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          </div>

          {/* Institution Type */}
          <div className="relative">
            <select
              value={filters.institutionType}
              onChange={(e) => setFilters((prev) => ({ ...prev, institutionType: e.target.value }))}
              className="appearance-none pl-2.5 pr-6 py-1 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-slate-800 dark:text-slate-100 hover:border-sky-500/40 transition-colors shadow-2xs focus:outline-none focus:ring-1 focus:ring-sky-500 cursor-pointer text-xs"
            >
              <option value="All Types">{t.allTypes}</option>
              <option value="Private Self-Financed">Private Self-Financed</option>
              <option value="Government / Aided">Government / Aided</option>
              <option value="Deemed-to-be University">Deemed-to-be University</option>
              <option value="Autonomous">Autonomous</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          </div>

          {/* Application Category */}
          <div className="relative">
            <select
              value={filters.applicationCategory}
              onChange={(e) => setFilters((prev) => ({ ...prev, applicationCategory: e.target.value }))}
              className="appearance-none pl-2.5 pr-6 py-1 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-slate-800 dark:text-slate-100 hover:border-sky-500/40 transition-colors shadow-2xs focus:outline-none focus:ring-1 focus:ring-sky-500 cursor-pointer text-xs"
            >
              <option value="All Categories">{t.allCategories}</option>
              <option value="Extension of Approval (EoA)">Extension of Approval (EoA)</option>
              <option value="Increase in Intake / New Course">Increase in Intake / New Course</option>
              <option value="New Technical Institution">New Technical Institution</option>
              <option value="Change of Site / Closure">Change of Site / Closure</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          </div>

          {/* Scrutiny Status */}
          <div className="relative">
            <select
              value={filters.scrutinyStatus}
              onChange={(e) => setFilters((prev) => ({ ...prev, scrutinyStatus: e.target.value }))}
              className="appearance-none pl-2.5 pr-6 py-1 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-slate-800 dark:text-slate-100 hover:border-sky-500/40 transition-colors shadow-2xs focus:outline-none focus:ring-1 focus:ring-sky-500 cursor-pointer text-xs"
            >
              <option value="All Statuses">{t.allStatuses}</option>
              <option value="Fatal Fraud Alert">Fatal Fraud Alert (Red Veto)</option>
              <option value="Deficiency Issued">Deficiency Issued (15-Day EVC)</option>
              <option value="Auto-Pre-Cleared">Auto-Pre-Cleared (Fast-Track)</option>
              <option value="Manual Review Required">Manual Review Required</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          </div>
        </div>

        {/* Right: Matches Count & Reset */}
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 font-medium">
            Showing <strong className="text-slate-900 dark:text-white font-bold">{filteredApplications.length}</strong> Dossiers
          </span>

          {isFiltered && (
            <button
              onClick={resetFilters}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-200/60 dark:bg-slate-800/60 hover:bg-slate-200 dark:hover:bg-slate-700 text-[11px] font-semibold transition-all"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
