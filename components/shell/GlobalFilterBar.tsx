'use client';

import React, { useState } from 'react';
import { Filter, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react';
import { useFilters } from '@/lib/context';

export function GlobalFilterBar() {
  const {
    academicYear,
    setAcademicYear,
    region,
    setRegion,
    institutionType,
    setInstitutionType,
    category,
    setCategory,
    status,
    setStatus,
    filteredApplications,
    resetFilters,
  } = useFilters();

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const activeFilterCount = [
    region !== 'All' && region !== 'All Regions (8)',
    institutionType !== 'All' && institutionType !== 'All Types',
    category !== 'All' && category !== 'All Categories',
    status !== 'All' && status !== 'All Statuses',
  ].filter(Boolean).length;

  return (
    <div className="liquid-glass-card rounded-[16px] px-3 py-2 sm:px-4 sm:py-2.5 mb-3.5">
      {/* Top Bar Row (Always visible on mobile & desktop) */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        {/* Mobile Filter Drawer Toggle Button */}
        <button
          onClick={() => setMobileFiltersOpen((prev) => !prev)}
          className="sm:hidden glass-well rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 inline-flex items-center gap-1.5 cursor-pointer"
        >
          <Filter className="h-3.5 w-3.5 text-sky-500" />
          <span>Scope & Filters</span>
          {activeFilterCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-sky-500 text-white text-[10px] font-mono">
              {activeFilterCount}
            </span>
          )}
          {mobileFiltersOpen ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
        </button>

        {/* Desktop & Tablet Inline Filter Selects */}
        <div className="hidden sm:flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 inline-flex items-center gap-1 mr-1">
            <Filter className="h-3 w-3" />
            SCOPE:
          </span>

          <select
            value={academicYear}
            onChange={(e) => setAcademicYear(e.target.value)}
            className="glass-well rounded-xl px-2.5 py-1.5 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/30 cursor-pointer"
          >
            <option value="2026-27">AY 2026-27 (Current)</option>
            <option value="2025-26">AY 2025-26</option>
            <option value="2024-25">AY 2024-25</option>
          </select>

          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="glass-well rounded-xl px-2.5 py-1.5 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/30 cursor-pointer"
          >
            <option value="All Regions (8)">All Regions (8)</option>
            <option value="North-Western">North-Western</option>
            <option value="Southern">Southern</option>
            <option value="Western">Western</option>
            <option value="South-Western">South-Western</option>
            <option value="Eastern">Eastern</option>
            <option value="Central">Central</option>
            <option value="Northern">Northern</option>
            <option value="South-Central">South-Central</option>
          </select>

          <select
            value={institutionType}
            onChange={(e) => setInstitutionType(e.target.value)}
            className="glass-well rounded-xl px-2.5 py-1.5 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/30 cursor-pointer"
          >
            <option value="All Types">All Types</option>
            <option value="Private Self-Financed">Private Self-Financed</option>
            <option value="Government / Aided">Government / Aided</option>
            <option value="Deemed-to-be University">Deemed-to-be University</option>
            <option value="Autonomous">Autonomous</option>
          </select>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="glass-well rounded-xl px-2.5 py-1.5 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/30 cursor-pointer"
          >
            <option value="All Categories">All Categories</option>
            <option value="Extension of Approval (EoA)">Extension of Approval (EoA)</option>
            <option value="Increase in Intake / New Course">Increase in Intake / New Course</option>
            <option value="New Technical Institution">New Technical Institution</option>
            <option value="Change of Site / Closure">Change of Site / Closure</option>
          </select>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="glass-well rounded-xl px-2.5 py-1.5 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/30 cursor-pointer"
          >
            <option value="All Statuses">All Statuses</option>
            <option value="Fatal Fraud Alert">Fatal Fraud Alert</option>
            <option value="Deficiency Issued">Deficiency Issued</option>
            <option value="Auto-Pre-Cleared">Auto-Pre-Cleared</option>
            <option value="Manual Review Required">Manual Review Required</option>
          </select>
        </div>

        {/* Right Dossier Counter & Reset */}
        <div className="flex items-center gap-2 ml-auto">
          <div className="glass-well rounded-full px-3 py-1 text-[11.5px] font-medium text-slate-600 dark:text-slate-300">
            Showing <span className="font-bold tabular-nums text-slate-950 dark:text-white">{filteredApplications.length}</span> Dossiers
          </div>
          {activeFilterCount > 0 && (
            <button
              onClick={resetFilters}
              className="btn-liquid-secondary rounded-full px-2.5 py-1 text-[11px] font-semibold inline-flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Collapsible Mobile Filter Grid (< 640px) */}
      {mobileFiltersOpen && (
        <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 pt-2.5 mt-2.5 border-t border-slate-200/80 dark:border-slate-800/80 sm:hidden">
          <select
            value={academicYear}
            onChange={(e) => setAcademicYear(e.target.value)}
            className="glass-well rounded-xl px-2.5 py-2 text-xs font-medium text-slate-800 dark:text-slate-200 w-full"
          >
            <option value="2026-27">AY 2026-27 (Current)</option>
            <option value="2025-26">AY 2025-26</option>
            <option value="2024-25">AY 2024-25</option>
          </select>

          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="glass-well rounded-xl px-2.5 py-2 text-xs font-medium text-slate-800 dark:text-slate-200 w-full"
          >
            <option value="All Regions (8)">All Regions (8)</option>
            <option value="North-Western">North-Western</option>
            <option value="Southern">Southern</option>
            <option value="Western">Western</option>
            <option value="South-Western">South-Western</option>
            <option value="Eastern">Eastern</option>
            <option value="Central">Central</option>
            <option value="Northern">Northern</option>
            <option value="South-Central">South-Central</option>
          </select>

          <select
            value={institutionType}
            onChange={(e) => setInstitutionType(e.target.value)}
            className="glass-well rounded-xl px-2.5 py-2 text-xs font-medium text-slate-800 dark:text-slate-200 w-full"
          >
            <option value="All Types">All Types</option>
            <option value="Private Self-Financed">Private Self-Financed</option>
            <option value="Government / Aided">Government / Aided</option>
            <option value="Deemed-to-be University">Deemed-to-be University</option>
            <option value="Autonomous">Autonomous</option>
          </select>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="glass-well rounded-xl px-2.5 py-2 text-xs font-medium text-slate-800 dark:text-slate-200 w-full"
          >
            <option value="All Categories">All Categories</option>
            <option value="Extension of Approval (EoA)">Extension of Approval (EoA)</option>
            <option value="Increase in Intake / New Course">Increase in Intake / New Course</option>
            <option value="New Technical Institution">New Technical Institution</option>
            <option value="Change of Site / Closure">Change of Site / Closure</option>
          </select>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="glass-well rounded-xl px-2.5 py-2 text-xs font-medium text-slate-800 dark:text-slate-200 w-full xs:col-span-2"
          >
            <option value="All Statuses">All Statuses</option>
            <option value="Fatal Fraud Alert">Fatal Fraud Alert</option>
            <option value="Deficiency Issued">Deficiency Issued</option>
            <option value="Auto-Pre-Cleared">Auto-Pre-Cleared</option>
            <option value="Manual Review Required">Manual Review Required</option>
          </select>
        </div>
      )}
    </div>
  );
}

export default GlobalFilterBar;
