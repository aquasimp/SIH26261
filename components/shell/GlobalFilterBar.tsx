'use client';

import React, { useState } from 'react';
import { Filter, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react';
import { useFilters, useLanguage } from '@/lib/context';

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

  const { language } = useLanguage();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const activeFilterCount = [
    region !== 'All' && region !== 'All Regions (8)',
    institutionType !== 'All' && institutionType !== 'All Types',
    category !== 'All' && category !== 'All Categories',
    status !== 'All' && status !== 'All Statuses',
  ].filter(Boolean).length;

  return (
    <div className="liquid-glass-card rounded-[18px] px-4 py-3 sm:px-5 sm:py-3 shadow-xs">
      {/* Top Bar Row */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        {/* Mobile Filter Drawer Toggle Button */}
        <button
          onClick={() => setMobileFiltersOpen((prev) => !prev)}
          className="sm:hidden glass-well rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 inline-flex items-center gap-1.5 cursor-pointer"
        >
          <Filter className="h-3.5 w-3.5 text-sky-500" />
          <span>{language === 'hi' ? 'दायरा और फ़िल्टर' : 'Scope & Filters'}</span>
          {activeFilterCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-blue-600 text-white text-[10px] font-mono">
              {activeFilterCount}
            </span>
          )}
          {mobileFiltersOpen ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
        </button>

        {/* Desktop & Tablet Inline Filter Selects */}
        <div className="hidden sm:flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 inline-flex items-center gap-1.5 mr-1">
            <Filter className="h-3.5 w-3.5 text-blue-600 dark:text-sky-400" />
            <span>SCOPE:</span>
          </span>

          <select
            value={academicYear}
            onChange={(e) => setAcademicYear(e.target.value)}
            className="glass-well rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 cursor-pointer"
          >
            <option value="2026-27">AY 2026-27 (Current)</option>
            <option value="2025-26">AY 2025-26</option>
            <option value="2024-25">AY 2024-25</option>
          </select>

          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="glass-well rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 cursor-pointer"
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
            className="glass-well rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 cursor-pointer"
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
            className="glass-well rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 cursor-pointer"
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
            className="glass-well rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 cursor-pointer"
          >
            <option value="All Statuses">All Statuses</option>
            <option value="Fatal Fraud Alert">Fatal Fraud Alert</option>
            <option value="Deficiency Issued">Deficiency Issued</option>
            <option value="Auto-Pre-Cleared">Auto-Pre-Cleared</option>
            <option value="Manual Review Required">Manual Review Required</option>
          </select>
        </div>

        {/* Right Info & Reset Action */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 hidden lg:inline">
            Showing <strong className="text-slate-900 dark:text-white tabular-nums">{filteredApplications.length}</strong> matching dossiers
          </span>

          {activeFilterCount > 0 && (
            <button
              onClick={resetFilters}
              className="glass-well hover:border-slate-400 dark:hover:border-slate-600 rounded-xl px-2.5 py-1 text-xs font-semibold text-rose-600 dark:text-rose-400 inline-flex items-center gap-1 cursor-pointer transition-colors"
              title="Reset all active filters"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Drawer (Expandable) */}
      {mobileFiltersOpen && (
        <div className="sm:hidden grid grid-cols-1 gap-2 pt-3 mt-3 border-t border-slate-200 dark:border-slate-800 animate-glass-in">
          <select
            value={academicYear}
            onChange={(e) => setAcademicYear(e.target.value)}
            className="glass-well rounded-xl p-2 text-xs font-semibold text-slate-800 dark:text-slate-200"
          >
            <option value="2026-27">AY 2026-27 (Current)</option>
            <option value="2025-26">AY 2025-26</option>
            <option value="2024-25">AY 2024-25</option>
          </select>

          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="glass-well rounded-xl p-2 text-xs font-semibold text-slate-800 dark:text-slate-200"
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
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="glass-well rounded-xl p-2 text-xs font-semibold text-slate-800 dark:text-slate-200"
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
