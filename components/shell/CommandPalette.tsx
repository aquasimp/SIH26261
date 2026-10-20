'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/context';
import { MOCK_APPLICATIONS } from '@/lib/mock-data';
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
} from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const router = useRouter();
  const { t } = useLanguage();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(); // parent handles toggle
      }
      if (e.key === 'Escape' && isOpen) {
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

  const filteredApps = MOCK_APPLICATIONS.filter(
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
    { label: 'Hero Scrutiny Workbench (Apex Tech)', href: '/applications/AICTE-2026-NW-0842', icon: FileText },
    { label: t.navForensicsStudio, href: '/forensics', icon: AlertTriangle },
    { label: t.navInfrastructure, href: '/infrastructure', icon: Layers },
    { label: t.navAuthorityBridge, href: '/authority-bridge', icon: Network },
    { label: t.navDeficiencies, href: '/deficiencies', icon: AlertTriangle },
    { label: t.navAuditTrail, href: '/audit-trail', icon: ShieldCheck },
  ];

  const handleSelect = (href: string) => {
    router.push(href);
    onClose();
  };


  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="w-full max-w-2xl liquid-glass-card rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="relative flex items-center px-4 py-3.5 border-b border-slate-200 dark:border-slate-800">
          <Search className="w-5 h-5 text-slate-400 mr-3 shrink-0" />
          <input
            type="text"
            placeholder="Type an Institution Name, PID, City, or APH Rule Code..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent text-sm font-medium text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="ml-2 px-1.5 py-0.5 text-[10px] font-mono bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-slate-500">
            ESC
          </kbd>
        </div>

        {/* Results Container */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-4">
          {/* Applications Search Results */}
          {query.trim() && (
            <div className="space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1">
                Matching Institutional Dossiers ({filteredApps.length})
              </div>
              {filteredApps.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-500">No applications found matching &ldquo;{query}&rdquo;</div>
              ) : (
                filteredApps.map((app) => (
                  <button
                    key={app.id}
                    onClick={() => handleSelect(`/applications/${app.id}`)}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-sky-50 dark:hover:bg-slate-800/80 transition-colors text-left group"
                  >
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-sky-600 dark:group-hover:text-sky-400 flex items-center gap-2">
                        <span>{app.nameEn}</span>
                        <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                          {app.pid}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 truncate">
                        {app.city}, {app.state} • {app.region} • ICI: {app.iciScore}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          app.scrutinyStatus === 'Fatal Fraud Alert'
                            ? 'bg-red-500/10 text-red-600 border border-red-500/20'
                            : app.scrutinyStatus === 'Auto-Pre-Cleared'
                            ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                        }`}
                      >
                        {app.scrutinyStatus}
                      </span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-sky-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </button>
                ))
              )}
            </div>
          )}

          {/* APH Regulatory Rules Search Results */}
          {query.trim() && filteredRules.length > 0 && (
            <div className="space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1">
                AICTE APH 2024–27 Statutory Rule Clauses ({filteredRules.length})
              </div>
              {filteredRules.map((rule, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelect(rule.href)}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-sky-50 dark:hover:bg-slate-800/80 transition-colors text-left group"
                >
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-sky-600 dark:group-hover:text-sky-400 flex items-center gap-2">
                      <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-700 dark:text-sky-400 border border-sky-500/20">
                        {rule.code}
                      </span>
                      <span>{rule.title}</span>
                    </div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-sky-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          )}

          {/* Quick Nav Links */}
          <div className="space-y-1">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1">
              Quick System Navigation
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {quickLinks.map((link, idx) => {
                const Icon = link.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelect(link.href)}
                    className="flex items-center gap-2.5 p-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left"
                  >
                    <Icon className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
                    <span className="truncate">{link.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 flex items-center justify-between text-[11px] text-slate-400">
          <span>AICTE PS 26261 • Evidence-Linked Scrutiny Engine</span>
          <span>Press Enter to navigate</span>
        </div>
      </div>
    </div>
  );
}
