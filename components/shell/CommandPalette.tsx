'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage, useFilters } from '@/lib/context';
import { AICTELogo } from '@/components/brand/AICTELogo';
import { InstitutionalApplication, FacultyRecord } from '@/lib/mock-data';
import {
  Search,
  Building,
  FileText,
  AlertTriangle,
  Layers,
  Network,
  ShieldCheck,
  X,
  ExternalLink,
  CheckCircle2,
  AlertOctagon,
  Zap,
  Users,
  BarChart3,
  BookOpen,
  ArrowRight,
} from 'lucide-react';

interface CommandPaletteProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function CommandPalette({ isOpen: externalIsOpen, onClose: externalOnClose }: CommandPaletteProps = {}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalOpen;

  const handleClose = useCallback(() => {
    if (externalOnClose) {
      externalOnClose();
    } else {
      setInternalOpen(false);
    }
  }, [externalOnClose]);

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { t, language } = useLanguage();
  const {
    applications,
    selectedAppId,
    setSelectedAppId,
    approveApplicationEoA,
    issueDeficiencyNotice,
    escalateToStandingHearingCommittee,
  } = useFilters();

  const currentApp = applications.find((a) => a.id === selectedAppId) || applications[0];

  // Auto-focus input when palette opens, clear query & selection when closed
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 50);
      return () => clearTimeout(timer);
    } else {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Fallback keyboard & custom-event listener for uncontrolled usage
  useEffect(() => {
    if (externalIsOpen !== undefined) return;

    const handleOpen = () => setInternalOpen(true);
    window.addEventListener('open-command-palette', handleOpen);

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setInternalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('open-command-palette', handleOpen);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [externalIsOpen]);

  const APH_RULES = useMemo(
    () => [
      { code: 'APH Ch VII Clause 2.1', title: 'Mandatory Fire Safety Certification (State NOC)', href: '/applications/AICTE-2026-NW-0842' },
      { code: 'APH Ch I Clause 1.4', title: 'Land Norms & FSI Calculation (Mega/Metro/Urban/Rural)', href: '/infrastructure' },
      { code: 'APH Ch VII Clause 3.4', title: 'Cadre Ratio 1:2:6 & Student-Faculty Ratio 1:20 UG', href: '/applications/AICTE-2026-SO-1104' },
      { code: 'APH Appendix 4', title: 'Total Built-up Area: TB_req = (INA + ADA + AMA) + ACA', href: '/infrastructure' },
      { code: 'EPF Scheme 2026', title: '50% Basic Wage Add-Back Rule & EPFO ECR 2.0 Audit', href: '/authority-bridge' },
      { code: 'DLTS Spec v1.4', title: 'DigiLocker HMAC Pull URI Specification & XML Schema', href: '/authority-bridge' },
    ],
    []
  );

  const q = query.trim().toLowerCase();

  // Search filtered applications
  const filteredApps = useMemo(() => {
    if (!q) return applications;
    return applications.filter((app) => {
      const matchName = app.nameEn.toLowerCase().includes(q) || (app.nameHi && app.nameHi.includes(q));
      const matchPid = app.pid.toLowerCase().includes(q) || app.id.toLowerCase().includes(q);
      const matchAishe = app.aisheCode ? app.aisheCode.toLowerCase().includes(q) : false;
      const matchCity = app.city.toLowerCase().includes(q) || app.state.toLowerCase().includes(q);
      const matchTrust = app.trustName.toLowerCase().includes(q);
      const matchRegion = app.region.toLowerCase().includes(q);
      const matchType = app.institutionType.toLowerCase().includes(q);
      const matchCategory = app.applicationCategory.toLowerCase().includes(q);
      const matchStatus = app.scrutinyStatus.toLowerCase().includes(q);
      return (
        matchName ||
        matchPid ||
        matchAishe ||
        matchCity ||
        matchTrust ||
        matchRegion ||
        matchType ||
        matchCategory ||
        matchStatus
      );
    });
  }, [applications, q]);

  // Search filtered faculty members across all applications
  const filteredFaculty = useMemo(() => {
    if (!q || q.length < 2) return [];
    const matches: Array<{ faculty: FacultyRecord; app: InstitutionalApplication }> = [];
    applications.forEach((app) => {
      app.facultyRoster?.forEach((fac) => {
        const matchName = fac.name.toLowerCase().includes(q);
        const matchDept = fac.department.toLowerCase().includes(q);
        const matchPan = fac.pan.toLowerCase().includes(q);
        const matchUan = fac.uan.includes(q);
        const matchDesig = fac.designation.toLowerCase().includes(q);
        if (matchName || matchDept || matchPan || matchUan || matchDesig) {
          matches.push({ faculty: fac, app });
        }
      });
    });
    return matches.slice(0, 4);
  }, [applications, q]);

  // Search filtered rules
  const filteredRules = useMemo(() => {
    if (!q) return APH_RULES.slice(0, 2);
    return APH_RULES.filter(
      (rule) =>
        rule.code.toLowerCase().includes(q) ||
        rule.title.toLowerCase().includes(q)
    );
  }, [APH_RULES, q]);

  // Quick navigation links
  const quickLinks = useMemo(
    () => [
      { label: t.navOverview || 'Dashboard', href: '/overview', icon: Layers },
      { label: t.navApplications || 'Institutional Dossiers', href: '/applications', icon: Building },
      {
        label: `Scrutiny Workbench (${currentApp?.nameEn.slice(0, 18)}...)`,
        href: `/applications/${currentApp?.id}`,
        icon: FileText,
      },
      { label: t.navForensicsStudio || 'Digital Forensics Studio', href: '/forensics', icon: AlertTriangle },
      { label: t.navInfrastructure || 'Blueprint & Campus CV', href: '/infrastructure', icon: Layers },
      { label: language === 'hi' ? 'संकाय सत्यापन' : 'Faculty Verification', href: '/faculty', icon: Users },
      { label: t.navAuthorityBridge || 'DPI Authority Bridge', href: '/authority-bridge', icon: Network },
      { label: 'Bilingual Statutory Notices', href: `/deficiencies?appId=${currentApp?.id}`, icon: AlertTriangle },
      { label: t.navAuditTrail || 'SHA-256 Audit Ledger', href: '/audit-trail', icon: ShieldCheck },
      { label: language === 'hi' ? 'रिपोर्ट और एनालिटिक्स' : 'Reports & Analytics', href: '/reports', icon: BarChart3 },
    ],
    [t, currentApp, language]
  );

  // Filtered navigation links if query matches
  const filteredLinks = useMemo(() => {
    if (!q) return quickLinks;
    return quickLinks.filter((link) => link.label.toLowerCase().includes(q));
  }, [quickLinks, q]);

  // Flattened actionable list for keyboard navigation
  const flatNavList = useMemo(() => {
    const list: Array<{ type: string; href: string; action?: () => void; appId?: string }> = [];

    // 1. Applications
    filteredApps.forEach((app) => {
      list.push({
        type: 'app',
        href: `/applications/${app.id}`,
        appId: app.id,
      });
    });

    // 2. Faculty
    filteredFaculty.forEach((item) => {
      list.push({
        type: 'faculty',
        href: `/faculty`,
        appId: item.app.id,
      });
    });

    // 3. Rules
    filteredRules.forEach((rule) => {
      list.push({
        type: 'rule',
        href: rule.href,
      });
    });

    // 4. Links
    filteredLinks.forEach((link) => {
      list.push({
        type: 'link',
        href: link.href,
      });
    });

    return list;
  }, [filteredApps, filteredFaculty, filteredRules, filteredLinks]);

  const handleSelect = useCallback(
    (href: string, appId?: string) => {
      if (appId) {
        setSelectedAppId(appId);
      }
      router.push(href);
      handleClose();
    },
    [router, setSelectedAppId, handleClose]
  );

  // Keyboard navigation listener (ESC, Enter, Up/Down)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (flatNavList.length > 0 ? (prev + 1) % flatNavList.length : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) =>
          flatNavList.length > 0 ? (prev - 1 + flatNavList.length) % flatNavList.length : 0
        );
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (flatNavList.length > 0 && selectedIndex < flatNavList.length) {
          const item = flatNavList[selectedIndex];
          if (item) {
            handleSelect(item.href, item.appId);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, flatNavList, selectedIndex, handleClose, handleSelect]);

  const handleQuickApprove = async () => {
    if (!currentApp) return;
    await approveApplicationEoA(currentApp.id);
    handleClose();
  };

  const handleQuickDeficiency = async () => {
    if (!currentApp) return;
    await issueDeficiencyNotice(currentApp.id, 15);
    handleClose();
  };

  const handleQuickEscalate = async () => {
    if (!currentApp) return;
    await escalateToStandingHearingCommittee(currentApp.id, 'Escalated via Command Palette Quick Action');
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-12 sm:pt-16 px-3 sm:px-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150 cursor-pointer"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-2xl liquid-glass-card rounded-2xl overflow-hidden shadow-2xl cursor-default animate-glass-in border border-slate-200/80 dark:border-slate-800/80"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="relative flex items-center px-4 py-3.5 border-b border-[var(--glass-well-border)] bg-white/40 dark:bg-slate-900/40">
          <Search className="w-4 h-4 text-sky-500 mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder={
              language === 'hi'
                ? 'संस्थान का नाम, PID, AISHE कोड, संकाय, या APH नियम से खोजें...'
                : 'Search by Institution Name, PID, AISHE Code, Faculty, or APH Rule...'
            }
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            className="w-full bg-transparent text-sm font-medium text-[var(--text-primary)] placeholder:text-[var(--text-faint)] focus:outline-none"
          />
          {query && (
            <button
              onClick={() => {
                setQuery('');
                inputRef.current?.focus();
              }}
              className="p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer mr-1"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="px-2 py-0.5 text-[10px] font-mono font-semibold bg-white/50 dark:bg-black/40 border border-[var(--glass-well-border)] rounded-md text-[var(--text-muted)] shadow-2xs">
            ESC
          </kbd>
        </div>

        {/* Results Container */}
        <div className="max-h-[500px] overflow-y-auto p-3.5 space-y-3.5 scrollbar-thin">
          {/* Closed-Loop Officer Quick Actions for Selected Application */}
          {!q && (
            <div className="space-y-2 p-2.5 rounded-xl glass-well">
              <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-wider text-[var(--text-faint)] px-1">
                <span className="flex items-center gap-1.5 text-sky-700 dark:text-sky-400">
                  <Zap className="w-3.5 h-3.5" />
                  <span>Closed-Loop Officer Quick Actions ({currentApp?.id})</span>
                </span>
                <span className="text-[var(--text-muted)] font-normal truncate max-w-[200px]">
                  {currentApp?.nameEn}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  onClick={handleQuickApprove}
                  className="flex items-center gap-2 p-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/25 text-emerald-800 dark:text-emerald-300 text-xs font-semibold text-left transition-colors cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
                  <span className="truncate">Approve EoA 2026–27</span>
                </button>

                <button
                  onClick={handleQuickDeficiency}
                  className="flex items-center gap-2 p-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/25 text-amber-800 dark:text-amber-300 text-xs font-semibold text-left transition-colors cursor-pointer"
                >
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-600" />
                  <span className="truncate">Issue 15-Day EVC Notice</span>
                </button>

                <button
                  onClick={handleQuickEscalate}
                  className="flex items-center gap-2 p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/25 text-red-800 dark:text-red-300 text-xs font-semibold text-left transition-colors cursor-pointer"
                >
                  <AlertOctagon className="w-3.5 h-3.5 shrink-0 text-red-600" />
                  <span className="truncate">Escalate to SHC Summons</span>
                </button>
              </div>
            </div>
          )}

          {/* Applications Search Results */}
          <div className="space-y-1">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-faint)] px-2 py-1 flex items-center justify-between">
              <span>
                {q
                  ? `Matching Institutional Dossiers (${filteredApps.length})`
                  : `Flagship Institutional Dossiers (${filteredApps.length})`}
              </span>
              <span className="text-[10px] font-normal lowercase text-slate-400">
                Click or press enter to inspect
              </span>
            </div>

            {filteredApps.length === 0 ? (
              <div className="p-3 text-center text-xs text-[var(--text-muted)]">
                No institutions found matching &ldquo;{query}&rdquo;
              </div>
            ) : (
              filteredApps.map((app, idx) => {
                const isSelected = selectedIndex === idx;
                return (
                  <button
                    key={app.id}
                    onClick={() => handleSelect(`/applications/${app.id}`, app.id)}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl transition-all text-left group cursor-pointer ${
                      isSelected
                        ? 'bg-sky-500/15 border border-sky-500/40 shadow-xs'
                        : 'hover:bg-white/40 dark:hover:bg-white/5 border border-transparent hover:border-[var(--glass-well-border)]'
                    }`}
                  >
                    <div className="min-w-0 pr-2">
                      <div className="text-xs font-semibold text-[var(--text-primary)] group-hover:text-sky-700 dark:group-hover:text-sky-400 flex flex-wrap items-center gap-2">
                        <span>{app.nameEn}</span>
                        <span className="font-mono text-[10px] px-2 py-0.5 rounded-md glass-well text-[var(--text-muted)]">
                          PID: {app.pid}
                        </span>
                        {app.aisheCode && (
                          <span className="font-mono text-[10px] px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20">
                            AISHE: {app.aisheCode}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-[var(--text-muted)] truncate mt-0.5">
                        {app.city}, {app.state} • {app.region} • {app.institutionType} • ICI:{' '}
                        <strong className="tabular-nums font-semibold">{app.iciScore}</strong>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${
                          app.scrutinyStatus === 'Fatal Fraud Alert'
                            ? 'pill-fatal'
                            : app.scrutinyStatus === 'Auto-Pre-Cleared'
                            ? 'pill-verified'
                            : 'pill-deficiency'
                        }`}
                      >
                        {app.scrutinyStatus}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-sky-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Faculty Results */}
          {q && filteredFaculty.length > 0 && (
            <div className="space-y-1">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-faint)] px-2 py-1">
                Matching Faculty Members ({filteredFaculty.length})
              </div>
              {filteredFaculty.map((item, idx) => {
                const facIndex = filteredApps.length + idx;
                const isSelected = selectedIndex === facIndex;
                return (
                  <button
                    key={item.faculty.id}
                    onClick={() => handleSelect('/faculty', item.app.id)}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl transition-all text-left group cursor-pointer ${
                      isSelected
                        ? 'bg-sky-500/15 border border-sky-500/40 shadow-xs'
                        : 'hover:bg-white/40 dark:hover:bg-white/5 border border-transparent hover:border-[var(--glass-well-border)]'
                    }`}
                  >
                    <div className="min-w-0 pr-2">
                      <div className="text-xs font-semibold text-[var(--text-primary)] group-hover:text-sky-700 dark:group-hover:text-sky-400 flex items-center gap-2">
                        <Users className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                        <span>{item.faculty.name}</span>
                        <span className="font-mono text-[10px] px-1.5 py-0.5 rounded-md glass-well text-[var(--text-muted)]">
                          {item.faculty.designation}
                        </span>
                        <span className="text-[10px] text-slate-400">({item.faculty.department})</span>
                      </div>
                      <div className="text-[11px] text-[var(--text-muted)] truncate mt-0.5">
                        Campus: {item.app.nameEn} • PAN: {item.faculty.pan} • UAN: {item.faculty.uan}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          item.faculty.epfoEcrStatus === 'DUAL_EMPLOYMENT_DETECTED'
                            ? 'pill-fatal'
                            : 'pill-verified'
                        }`}
                      >
                        {item.faculty.epfoEcrStatus === 'DUAL_EMPLOYMENT_DETECTED'
                          ? 'Dual Employment Flag'
                          : 'EPFO Verified'}
                      </span>
                      <ExternalLink className="w-3.5 h-3.5 text-sky-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* APH Regulatory Rules Search Results */}
          {filteredRules.length > 0 && (
            <div className="space-y-1">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-faint)] px-2 py-1">
                AICTE APH 2024–27 Statutory Rule Clauses ({filteredRules.length})
              </div>
              {filteredRules.map((rule, idx) => {
                const ruleIndex = filteredApps.length + filteredFaculty.length + idx;
                const isSelected = selectedIndex === ruleIndex;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelect(rule.href)}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl transition-all text-left group cursor-pointer ${
                      isSelected
                        ? 'bg-sky-500/15 border border-sky-500/40 shadow-xs'
                        : 'hover:bg-white/40 dark:hover:bg-white/5 border border-transparent hover:border-[var(--glass-well-border)]'
                    }`}
                  >
                    <div className="min-w-0 pr-2">
                      <div className="text-xs font-semibold text-[var(--text-primary)] group-hover:text-sky-700 dark:group-hover:text-sky-400 flex items-center gap-2">
                        <BookOpen className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                        <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-md pill-registry">
                          {rule.code}
                        </span>
                        <span className="truncate">{rule.title}</span>
                      </div>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-sky-500 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                  </button>
                );
              })}
            </div>
          )}

          {/* Quick Nav Links */}
          <div className="space-y-1.5">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-faint)] px-2">
              Quick System Navigation ({filteredLinks.length})
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {filteredLinks.map((link, idx) => {
                const linkIndex =
                  filteredApps.length + filteredFaculty.length + filteredRules.length + idx;
                const isSelected = selectedIndex === linkIndex;
                const Icon = link.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelect(link.href)}
                    className={`flex items-center gap-2.5 p-2 rounded-xl text-xs font-medium transition-all text-left cursor-pointer ${
                      isSelected
                        ? 'bg-sky-500/15 border border-sky-500/40 text-sky-800 dark:text-sky-300'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/40 dark:hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 text-[var(--text-muted)] shrink-0" />
                    <span className="truncate">{link.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 border-t border-[var(--glass-well-border)] bg-[var(--glass-well-bg)] flex flex-wrap items-center justify-between gap-2 text-[11px] text-[var(--text-muted)]">
          <div className="flex items-center gap-2">
            <AICTELogo variant="badge" size="xs" showStatusDot={false} />
            <span className="truncate">AICTE PS 26261 • Evidence-Linked Scrutiny Engine</span>
          </div>
          <div className="flex items-center gap-3 font-mono text-[10px]">
            <span>↑↓ to navigate</span>
            <span>↵ to select</span>
            <span>ESC to dismiss</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CommandPalette;
