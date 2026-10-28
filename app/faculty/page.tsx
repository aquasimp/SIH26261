'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useLanguage, useFilters } from '@/lib/context';
import { FacultyRecord, InstitutionalApplication } from '@/lib/mock-data';
import { toast } from 'sonner';
import {
  Users,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  UserX,
  ShieldCheck,
  Building,
  CreditCard,
  FileSpreadsheet,
  Download,
  ExternalLink,
  ChevronRight,
  Eye,
  RefreshCw,
  Scale,
} from 'lucide-react';

export default function FacultyVerificationPage() {
  const { t, language } = useLanguage();
  const { applications, selectedAppId, setSelectedAppId } = useFilters();

  const currentApp: InstitutionalApplication =
    applications.find((a) => a.id === selectedAppId) || applications[0];

  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'ALL' | 'FLAGGED' | 'WAGE_DEFICIT' | 'VERIFIED'>('ALL');
  const [selectedFaculty, setSelectedFaculty] = useState<FacultyRecord | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  // Faculty roster from current application with robust defaults
  const roster: FacultyRecord[] = useMemo(() => {
    return currentApp?.facultyRoster && currentApp.facultyRoster.length > 0
      ? currentApp.facultyRoster
      : [
          {
            id: 'FAC-01',
            name: 'Dr. Ramesh Chander Sharma',
            designation: 'Professor',
            department: 'Computer Science & Engineering',
            pan: 'AAAPS4920K',
            uan: '100928374829',
            aadhaarFatVerified: true,
            epfoEcrStatus: 'DUAL_EMPLOYMENT_DETECTED',
            wageRule50Compliant: false,
            arcFaceSimilarityMax: 0.942,
            matchedInstitutionName: 'Noida Institute of Engg & Tech (NIET)',
            matchedInstitutionPid: '1-1092837419',
            avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
            experienceYears: 18,
          },
          {
            id: 'FAC-02',
            name: 'Dr. Sunita Deshmukh',
            designation: 'Professor',
            department: 'Information Technology',
            pan: 'BKPSD8192M',
            uan: '100817294012',
            aadhaarFatVerified: true,
            epfoEcrStatus: 'DUAL_EMPLOYMENT_DETECTED',
            wageRule50Compliant: true,
            arcFaceSimilarityMax: 0.891,
            matchedInstitutionName: 'Galgotias Educational Campus',
            matchedInstitutionPid: '1-4820194821',
            avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
            experienceYears: 14,
          },
          {
            id: 'FAC-03',
            name: 'Prof. Alok Nath Verma',
            designation: 'Associate Professor',
            department: 'Mechanical Engineering',
            pan: 'CJLPV1094P',
            uan: '100748291038',
            aadhaarFatVerified: true,
            epfoEcrStatus: 'ACTIVE_VERIFIED',
            wageRule50Compliant: false,
            arcFaceSimilarityMax: 0.12,
            avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
            experienceYears: 11,
          },
          {
            id: 'FAC-04',
            name: 'Dr. Meenakshi Sundaram',
            designation: 'Associate Professor',
            department: 'Electronics & Communication',
            pan: 'DMNPS7721L',
            uan: '100693820194',
            aadhaarFatVerified: true,
            epfoEcrStatus: 'ACTIVE_VERIFIED',
            wageRule50Compliant: true,
            arcFaceSimilarityMax: 0.15,
            avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
            experienceYears: 9,
          },
          {
            id: 'FAC-05',
            name: 'Er. Rajesh Kumar Singh',
            designation: 'Assistant Professor',
            department: 'Computer Science & Engineering',
            pan: 'EPQRS3391N',
            uan: '100582910394',
            aadhaarFatVerified: true,
            epfoEcrStatus: 'ACTIVE_VERIFIED',
            wageRule50Compliant: true,
            arcFaceSimilarityMax: 0.08,
            avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
            experienceYears: 5,
          },
        ];
  }, [currentApp]);

  // Filter & Search
  const filteredRoster = useMemo(() => {
    return roster.filter((fac) => {
      if (filterMode === 'FLAGGED' && fac.epfoEcrStatus !== 'DUAL_EMPLOYMENT_DETECTED') return false;
      if (filterMode === 'WAGE_DEFICIT' && fac.wageRule50Compliant) return false;
      if (filterMode === 'VERIFIED' && fac.epfoEcrStatus !== 'ACTIVE_VERIFIED') return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const mName = fac.name.toLowerCase().includes(q);
        const mDept = fac.department.toLowerCase().includes(q);
        const mPan = fac.pan.toLowerCase().includes(q);
        const mUan = fac.uan.includes(q);
        if (!mName && !mDept && !mPan && !mUan) return false;
      }
      return true;
    });
  }, [roster, filterMode, searchQuery]);

  // Aggregate Metrics
  const totalCount = roster.length;
  const flaggedCount = roster.filter((f) => f.epfoEcrStatus === 'DUAL_EMPLOYMENT_DETECTED').length;
  const wageDeficitCount = roster.filter((f) => !f.wageRule50Compliant).length;
  const verifiedCount = roster.filter((f) => f.epfoEcrStatus === 'ACTIVE_VERIFIED').length;

  const handleRunReVerification = () => {
    setIsVerifying(true);
    toast.info('Initiating national faculty biometric and EPFO cross-check...');
    setTimeout(() => {
      setIsVerifying(false);
      toast.success('Cross-institutional faculty verification completed', {
        description: `Verified ${totalCount} records against EPFO payroll gateway & national faculty registry.`,
      });
    }, 1200);
  };

  const handleExportRoster = () => {
    const csvContent = [
      ['ID', 'Name', 'Designation', 'Department', 'PAN', 'UAN', 'Status', 'Wage Rule 50%', 'Biometric Match'].join(','),
      ...roster.map((f) =>
        [
          f.id,
          `"${f.name}"`,
          `"${f.designation}"`,
          `"${f.department}"`,
          f.pan,
          f.uan,
          f.epfoEcrStatus,
          f.wageRule50Compliant ? 'COMPLIANT' : 'DEFICIT',
          f.arcFaceSimilarityMax,
        ].join(',')
      ),
    ].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Faculty_Verification_${currentApp.id}_${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('Exported faculty verification roster to CSV');
  };

  return (
    <div className="space-y-6 animate-glass-in">
      {/* Page Title & Institution Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-1 px-1">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[12px] font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider">
              AICTE National Faculty Integrity Bureau
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--text-primary)]">
            National Faculty{' '}
            <span className="font-extrabold text-sky-600 dark:text-sky-400">
              Verification Console
            </span>
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1 max-w-3xl leading-relaxed">
            Biometric identity reconciliation, cross-campus concurrent employment detection, and EPFO social security payroll compliance under APH Chapter VII.
          </p>
        </div>

        {/* Institution Selector & Controls */}
        <div className="flex items-center gap-3 flex-wrap">
          <select
            value={currentApp.id}
            onChange={(e) => setSelectedAppId(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl glass-well text-xs font-semibold text-[var(--text-primary)] cursor-pointer focus:outline-none"
          >
            {applications.map((app) => (
              <option key={app.id} value={app.id}>
                {app.id} — {app.nameEn.slice(0, 32)}...
              </option>
            ))}
          </select>

          <button
            onClick={handleRunReVerification}
            disabled={isVerifying}
            className="btn-liquid-primary cursor-pointer px-4 py-2.5 rounded-xl text-xs font-semibold inline-flex items-center gap-2 shadow-sm disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isVerifying ? 'animate-spin' : ''}`} />
            <span>{isVerifying ? 'Verifying...' : 'Run National Cross-Check'}</span>
          </button>

          <button
            onClick={handleExportRoster}
            className="btn-liquid-secondary cursor-pointer px-3.5 py-2.5 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 shadow-2xs"
          >
            <Download className="w-4 h-4 text-[var(--text-muted)]" />
            <span>Export Roster (CSV)</span>
          </button>
        </div>
      </div>

      {/* Top 4 KPI Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Metric 1 */}
        <div className="liquid-glass-card rounded-[20px] p-5 space-y-2 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
          <div className="flex items-center justify-between text-xs font-medium text-[var(--text-muted)]">
            <span className="uppercase tracking-wider font-semibold">Total Faculty Roster</span>
            <Users className="w-4.5 h-4.5 text-blue-500" />
          </div>
          <div className="text-3xl font-extrabold text-[var(--text-primary)]">
            {totalCount}
          </div>
          <div className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{verifiedCount} Cleanly Verified with EPFO</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="liquid-glass-card rounded-[20px] p-5 space-y-2 border border-rose-500/25 bg-rose-500/5 shadow-sm">
          <div className="flex items-center justify-between text-xs font-medium text-rose-700 dark:text-rose-300">
            <span className="uppercase tracking-wider font-semibold">Concurrent Dual-Appointments</span>
            <UserX className="w-4.5 h-4.5 text-rose-500" />
          </div>
          <div className="text-3xl font-extrabold text-rose-600 dark:text-rose-400">
            {flaggedCount}
          </div>
          <div className="text-xs text-rose-700 dark:text-rose-300 font-medium">
            Active in multiple institutions simultaneously
          </div>
        </div>

        {/* Metric 3 */}
        <div className="liquid-glass-card rounded-[20px] p-5 space-y-2 border border-amber-500/25 bg-amber-500/5 shadow-sm">
          <div className="flex items-center justify-between text-xs font-medium text-amber-700 dark:text-amber-300">
            <span className="uppercase tracking-wider font-semibold">Basic Wage Rule Violations</span>
            <CreditCard className="w-4.5 h-4.5 text-amber-500" />
          </div>
          <div className="text-3xl font-extrabold text-amber-600 dark:text-amber-400">
            {wageDeficitCount}
          </div>
          <div className="text-xs text-amber-700 dark:text-amber-300 font-medium">
            Basic pay &lt; 50% of gross allowances
          </div>
        </div>

        {/* Metric 4 */}
        <div className="liquid-glass-card rounded-[20px] p-5 space-y-2 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
          <div className="flex items-center justify-between text-xs font-medium text-[var(--text-muted)]">
            <span className="uppercase tracking-wider font-semibold">Student-Faculty Ratio (SFR)</span>
            <Scale className="w-4.5 h-4.5 text-indigo-500" />
          </div>
          <div className="text-3xl font-extrabold text-[var(--text-primary)]">
            {currentApp.facultyMetrics?.sfrUG || '1:20.5'}
          </div>
          <div className="text-xs text-[var(--text-muted)] font-medium">
            Statutory Norm: 1:20 (Engineering UG)
          </div>
        </div>
      </div>

      {/* Filter Tabs and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="inline-flex rounded-xl p-1 glass-well text-xs font-medium overflow-x-auto no-scrollbar">
          {[
            { id: 'ALL', label: `All Faculty (${totalCount})` },
            { id: 'FLAGGED', label: `Dual-Employment (${flaggedCount})` },
            { id: 'WAGE_DEFICIT', label: `Wage Deficit (${wageDeficitCount})` },
            { id: 'VERIFIED', label: `Verified Active (${verifiedCount})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterMode(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-lg transition-all shrink-0 cursor-pointer ${
                filterMode === tab.id
                  ? 'btn-liquid-primary shadow-xs font-semibold'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative min-w-[280px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Search faculty name, department, PAN..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 rounded-xl glass-well text-xs text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>
      </div>

      {/* Main Faculty Table */}
      <div className="liquid-glass-card rounded-[22px] overflow-hidden shadow-sm">
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[920px] text-left border-collapse text-xs">
            <thead className="glass-well text-[11px] uppercase tracking-wider text-[var(--text-muted)] font-semibold border-b border-[var(--glass-border)]">
              <tr>
                <th className="py-3.5 px-4">Faculty Member</th>
                <th className="py-3.5 px-4">Designation &amp; Dept</th>
                <th className="py-3.5 px-4">Statutory Identifiers</th>
                <th className="py-3.5 px-4">Biometric Verification</th>
                <th className="py-3.5 px-4">EPFO Status</th>
                <th className="py-3.5 px-4">Wage Rule 50%</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--glass-border)]">
              {filteredRoster.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-xs text-[var(--text-muted)]">
                    No faculty records match the selected filter query.
                  </td>
                </tr>
              ) : (
                filteredRoster.map((fac) => {
                  const isFlagged = fac.epfoEcrStatus === 'DUAL_EMPLOYMENT_DETECTED';

                  return (
                    <tr
                      key={fac.id}
                      className={`transition-colors ${
                        isFlagged
                          ? 'bg-rose-500/10 hover:bg-rose-500/15'
                          : 'hover:bg-slate-900/[0.03] dark:hover:bg-white/[0.03]'
                      }`}
                    >
                      {/* Name & Avatar */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={fac.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'}
                            alt={fac.name}
                            className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700 shadow-2xs"
                          />
                          <div>
                            <div className="font-semibold text-[var(--text-primary)] text-sm">
                              {fac.name}
                            </div>
                            <div className="text-[11px] text-[var(--text-muted)] font-mono">
                              ID: {fac.id} • {fac.experienceYears || 10}+ yrs exp
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Designation & Dept */}
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-[var(--text-primary)]">
                          {fac.designation}
                        </div>
                        <div className="text-[11px] text-[var(--text-muted)]">
                          {fac.department}
                        </div>
                      </td>

                      {/* Identifiers */}
                      <td className="py-3.5 px-4 font-mono text-xs">
                        <div className="text-[var(--text-secondary)]">
                          PAN: <span className="font-semibold select-all">{fac.pan.slice(0, 5)}****{fac.pan.slice(-1)}</span>
                        </div>
                        <div className="text-[11px] text-[var(--text-muted)] mt-0.5">
                          UAN: <span className="select-all">{fac.uan}</span>
                        </div>
                      </td>

                      {/* Biometric Similarity */}
                      <td className="py-3.5 px-4">
                        {fac.arcFaceSimilarityMax > 0.75 ? (
                          <div className="space-y-1">
                            <span className="pill-fatal inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                              <AlertTriangle className="w-3 h-3" />
                              <span>{Math.round(fac.arcFaceSimilarityMax * 100)}% Match</span>
                            </span>
                            <div className="text-[10.5px] text-rose-700 dark:text-rose-400 font-semibold block truncate max-w-[180px]">
                              {fac.matchedInstitutionName}
                            </div>
                          </div>
                        ) : (
                          <span className="pill-verified inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Unique (0.12)</span>
                          </span>
                        )}
                      </td>

                      {/* EPFO ECR Status */}
                      <td className="py-3.5 px-4">
                        {fac.epfoEcrStatus === 'DUAL_EMPLOYMENT_DETECTED' ? (
                          <span className="px-2.5 py-1 rounded-full text-[10.5px] font-bold bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/30">
                            Dual-Remittance
                          </span>
                        ) : fac.epfoEcrStatus === 'ACTIVE_VERIFIED' ? (
                          <span className="px-2.5 py-1 rounded-full text-[10.5px] font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                            Active Verified
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full text-[10.5px] font-bold bg-slate-500/15 text-slate-700 dark:text-slate-300 border border-slate-500/30">
                            No Remittance
                          </span>
                        )}
                      </td>

                      {/* Wage Rule 50% */}
                      <td className="py-3.5 px-4">
                        {fac.wageRule50Compliant ? (
                          <span className="text-emerald-600 dark:text-emerald-400 font-medium text-xs flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Compliant</span>
                          </span>
                        ) : (
                          <span className="text-amber-600 dark:text-amber-400 font-semibold text-xs flex items-center gap-1">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            <span>Deficit Rule 28</span>
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setSelectedFaculty(fac)}
                          className="btn-liquid-secondary cursor-pointer px-3 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                          <span>Inspect</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Faculty Inspection Modal / Detail Drawer */}
      {selectedFaculty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-glass-in">
          <div className="liquid-glass-card rounded-[24px] max-w-2xl w-full p-6 space-y-5 shadow-2xl border border-white/20">
            <div className="flex items-center justify-between border-b border-[var(--glass-border)] pb-3">
              <div className="flex items-center gap-3">
                <img
                  src={selectedFaculty.avatarUrl}
                  alt={selectedFaculty.name}
                  className="w-12 h-12 rounded-full object-cover border border-slate-300 dark:border-slate-700"
                />
                <div>
                  <h3 className="text-lg font-bold text-[var(--text-primary)]">
                    {selectedFaculty.name}
                  </h3>
                  <p className="text-xs text-[var(--text-muted)]">
                    {selectedFaculty.designation} • {selectedFaculty.department}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedFaculty(null)}
                className="btn-liquid-secondary p-2 rounded-xl text-xs cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            {/* Concurrent Alert Notice */}
            {selectedFaculty.epfoEcrStatus === 'DUAL_EMPLOYMENT_DETECTED' && (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-800 dark:text-rose-200 text-xs space-y-2">
                <div className="font-bold flex items-center gap-1.5 text-rose-600 dark:text-rose-400">
                  <UserX className="w-4 h-4" />
                  <span>CONCURRENT FULL-TIME EMPLOYMENT FLAGGED</span>
                </div>
                <p className="leading-relaxed">
                  National biometric face search matched this faculty member against{' '}
                  <strong>{selectedFaculty.matchedInstitutionName}</strong> with an identity confidence score of{' '}
                  <strong>{Math.round(selectedFaculty.arcFaceSimilarityMax * 100)}%</strong>. Both institutions have actively filed concurrent EPFO remittances under the same UAN in the current quarter.
                </p>
              </div>
            )}

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl glass-well space-y-1">
                <span className="text-[10.5px] uppercase tracking-wider text-[var(--text-muted)] font-semibold block">
                  Income Tax PAN
                </span>
                <span className="font-mono font-bold text-[var(--text-primary)] text-sm">
                  {selectedFaculty.pan}
                </span>
              </div>

              <div className="p-3.5 rounded-xl glass-well space-y-1">
                <span className="text-[10.5px] uppercase tracking-wider text-[var(--text-muted)] font-semibold block">
                  EPFO Universal Account No (UAN)
                </span>
                <span className="font-mono font-bold text-[var(--text-primary)] text-sm">
                  {selectedFaculty.uan}
                </span>
              </div>

              <div className="p-3.5 rounded-xl glass-well space-y-1">
                <span className="text-[10.5px] uppercase tracking-wider text-[var(--text-muted)] font-semibold block">
                  Aadhaar Biometric Verification
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Digitally Validated with UIDAI Gateway</span>
                </span>
              </div>

              <div className="p-3.5 rounded-xl glass-well space-y-1">
                <span className="text-[10.5px] uppercase tracking-wider text-[var(--text-muted)] font-semibold block">
                  APH Cadre Compliance
                </span>
                <span className="font-semibold text-[var(--text-primary)]">
                  Approved 1:2:6 Cadre Schedule
                </span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[var(--glass-border)]">
              <Link
                href={`/deficiencies?appId=${currentApp.id}&form=B`}
                className="btn-liquid-danger cursor-pointer px-4 py-2 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5"
              >
                <span>Issue Form-B Show Cause Summons</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

