'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage, useFilters } from '@/lib/context';
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
} from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const router = useRouter();
  const { t } = useLanguage();
  const {
    applications,
    selectedAppId,
    approveApplicationEoA,
    issueDeficiencyNotice,
    escalateToStandingHearingCommittee,
  } = useFilters();

  const currentApp = applications.find((a) => a.id === selectedAppId) || applications[0];

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const APH_RULES = [
    { code: 'APH Ch VII Clause 2.1', title: 'Mandatory Fire Safety Certification (State NOC)', href: '/applications/AICTE-2026-NW-0842' },
    { code: 'APH Ch I Clause 1.4', title: 'Land Norms & FSI Calculation (Mega/Metro/Urban/Rural)', href: '/infrastructure' },
    { code: 'APH Ch VII Clause 3.4', title: 'Cadre Ratio 1:2:6 & Student-Faculty Ratio 1:20 UG', href: '/applications/AICTE-2026-SO-1104' },
    { code: 'APH Appendix 4', title: 'Total Built-up Area: TB_req = (INA + ADA + AMA) + ACA', href: '/infrastructure' },
    { code: 'EPF Scheme 2026', title: '50% Basic Wage Add-Back Rule & EPFO ECR 2.0 Audit', href: '/authority-bridge' },
    { code: 'DLTS Spec v1.4', title: 'DigiLocker HMAC Pull URI Specification & XML Schema', href: '/authority-bridge' },
  ];

  const filteredApps = applications.filter(
    (app) =>
      app.nameEn.toLowerCase().includes(query.toLowerCase()) ||
      app.pid.toLowerCase().includes(query.toLowerCase()) ||
      app.city.toLowerCase().includes(query.toLowerCase()) ||
      app.id.toLowerCase().includes(query.toLowerCase()) ||
      app.region.toLowerCase().includes(query.toLowerCase())
  );

  const filteredRules = APH_RULES.filter(
    (rule) =>
      rule.code.toLowerCase().includes(query.toLowerCase()) ||
      rule.title.toLowerCase().includes(query.toLowerCase())
  );

  const quickLinks = [
    { label: t.navOverview, href: '/overview', icon: Layers },
    { label: t.navApplications, href: '/applications', icon: Building },
    { label: `Scrutiny Workbench (${currentApp?.nameEn.slice(0, 20)}...)`, href: `/applications/${currentApp?.id}`, icon: FileText },
    { label: t.navForensicsStudio, href: '/forensics', icon: AlertTriangle },
    { label: t.navInfrastructure, href: '/infrastructure', icon: Layers },
    { label: t.navAuthorityBridge, href: '/authority-bridge', icon: Network },
    { label: 'Bilingual Statutory Notice Generator', href: `/deficiencies?appId=${currentApp?.id}`, icon: AlertTriangle },
    { label: t.navAuditTrail, href: '/audit-trail', icon: ShieldCheck },
  ];

  const handleSelect = (href: string) => {
    router.push(href);
    onClose();
  };

  const handleQuickApprove = async () => {
    if (!currentApp) return;
    await approveApplicationEoA(currentApp.id);
    onClose();
  };

  const handleQuickDeficiency = async () => {
    if (!currentApp) return;
    await issueDeficiencyNotice(currentApp.id, 15);
    onClose();
  };

  const handleQuickEscalate = async () => {
    if (!currentApp) return;
    await escalateToStandingHearingCommittee(currentApp.id, 'Escalated via Command Palette Quick Action');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-slate-950/70 animate-in fade-in duration-150 cursor-pointer"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl liquid-glass-card rounded-2xl overflow-hidden shadow-2xl cursor-default animate-glass-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="relative flex items-center px-4 py-3.5 border-b border-[var(--glass-well-border)]">
          <Search className="w-4 h-4 text-[var(--text-muted)] mr-3 shrink-0" />
          <input
            type="text"
            placeholder="Type an Institution Name, PID, Officer Action, or APH Rule..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent text-sm font-medium text-[var(--text-primary)] placeholder:text-[var(--text-faint)] focus:outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')} className="p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)]">
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="ml-2 px-2 py-0.5 text-[10px] font-semibold bg-white/40 dark:bg-black/30 border border-[var(--glass-well-border)] rounded-md text-[var(--text-muted)] shadow-2xs">
            ESC
          </kbd>
        </div>

        {/* Results Container */}
        <div className="max-h-[480px] overflow-y-auto p-3.5 space-y-3.5">
          {/* Quick Officer Mutation Actions for Selected Application */}
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

          {/* Applications Search Results */}
          {query.trim() && (
            <div className="space-y-1">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-faint)] px-2 py-1">
                Matching Institutional Dossiers ({filteredApps.length})
              </div>
              {filteredApps.length === 0 ? (
                <div className="p-3 text-center text-xs text-[var(--text-muted)]">
                  No applications found matching &ldquo;{query}&rdquo;
                </div>
              ) : (
                filteredApps.map((app) => (
                  <button
                    key={app.id}
                    onClick={() => handleSelect(`/applications/${app.id}`)}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-white/40 dark:hover:bg-white/5 border border-transparent hover:border-[var(--glass-well-border)] transition-all text-left group cursor-pointer"
                  >
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-[var(--text-primary)] group-hover:text-sky-700 dark:group-hover:text-sky-400 flex items-center gap-2">
                        <span>{app.nameEn}</span>
                        <span className="font-mono text-[10px] px-2 py-0.5 rounded-md glass-well text-[var(--text-muted)]">
                          {app.pid}
                        </span>
                      </div>
                      <div className="text-[11px] text-[var(--text-muted)] truncate mt-0.5">
                        {app.city}, {app.state} • {app.region} • ICI: <strong className="tabular-nums font-semibold">{app.iciScore}</strong>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
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
                      <ExternalLink className="w-3.5 h-3.5 text-[var(--text-faint)] group-hover:text-sky-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </button>
                ))
              )}
            </div>
          )}

          {/* APH Regulatory Rules Search Results */}
          {query.trim() && filteredRules.length > 0 && (
            <div className="space-y-1">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-faint)] px-2 py-1">
                AICTE APH 2024–27 Statutory Rule Clauses ({filteredRules.length})
              </div>
              {filteredRules.map((rule, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelect(rule.href)}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-white/40 dark:hover:bg-white/5 border border-transparent hover:border-[var(--glass-well-border)] transition-all text-left group cursor-pointer"
                >
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-[var(--text-primary)] group-hover:text-sky-700 dark:group-hover:text-sky-400 flex items-center gap-2">
                      <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-md pill-registry">
                        {rule.code}
                      </span>
                      <span>{rule.title}</span>
                    </div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-[var(--text-faint)] group-hover:text-sky-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          )}

          {/* Quick Nav Links */}
          <div className="space-y-1.5">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-faint)] px-2">
              Quick System Navigation
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {quickLinks.map((link, idx) => {
                const Icon = link.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelect(link.href)}
                    className="flex items-center gap-2.5 p-2 rounded-xl text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/40 dark:hover:bg-white/5 transition-all text-left cursor-pointer"
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
        <div className="px-4 py-2.5 border-t border-[var(--glass-well-border)] bg-[var(--glass-well-bg)] flex items-center justify-between text-[11px] text-[var(--text-muted)]">
          <span>AICTE PS 26261 • Evidence-Linked Scrutiny Engine</span>
          <span>Press Enter to navigate • ESC to dismiss</span>
        </div>
      </div>
    </div>
  );
}
