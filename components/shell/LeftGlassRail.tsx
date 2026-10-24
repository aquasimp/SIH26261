'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutGrid,
  FolderKanban,
  ScanSearch,
  ShieldAlert,
  Compass,
  Network,
  FileWarning,
  Link2,
  X,
} from 'lucide-react';
import AICTELogo from '@/components/brand/AICTELogo';
import { useFilters, useLanguage } from '@/lib/context';

export interface LeftGlassRailProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export function LeftGlassRail({ mobileOpen = false, onCloseMobile }: LeftGlassRailProps) {
  const pathname = usePathname();
  const { applications } = useFilters();
  const { t, language } = useLanguage();

  const fatalCount = applications.filter((a) => a.scrutinyStatus === 'Fatal Fraud Alert').length;
  const deficiencyCount = applications.filter((a) => a.scrutinyStatus === 'Deficiency Issued').length;

  const navGroups = [
    {
      groupLabel: language === 'hi' ? 'मुख्य इंटेलिजेंस' : 'CORE INTELLIGENCE',
      items: [
        {
          href: '/overview',
          label: t('nav.overview', 'Executive Overview'),
          icon: LayoutGrid,
          badge: null,
          badgeClass: '',
        },
        {
          href: '/applications',
          label: t('nav.applications', 'Institutional Registry'),
          icon: FolderKanban,
          badge: '4,820',
          badgeClass: 'glass-well text-slate-600 dark:text-slate-300',
        },
        {
          href: '/applications/AICTE-2026-NW-0842',
          label: t('nav.workbench', 'Scrutiny Workbench'),
          icon: ScanSearch,
          badge: 'LIVE',
          badgeClass: 'bg-rose-500/12 text-rose-600 dark:text-rose-300 border border-rose-500/25',
        },
      ],
    },
    {
      groupLabel: language === 'hi' ? 'फॉरेंसिक और विज़न' : 'FORENSICS & VISION',
      items: [
        {
          href: '/forensics',
          label: t('nav.forensics', 'Document Forensics'),
          icon: ShieldAlert,
          badge: String(146 + fatalCount),
          badgeClass: 'bg-rose-500/12 text-rose-600 dark:text-rose-300 border border-rose-500/25',
        },
        {
          href: '/infrastructure',
          label: t('nav.infrastructure', 'Blueprint & Campus CV'),
          icon: Compass,
          badge: '64',
          badgeClass: 'bg-amber-500/12 text-amber-700 dark:text-amber-300 border border-amber-500/25',
        },
      ],
    },
    {
      groupLabel: language === 'hi' ? 'गवर्नेंस और डीपीआई' : 'GOVERNANCE & DPI',
      items: [
        {
          href: '/authority-bridge',
          label: t('nav.authority', 'Authority Bridge (DPI)'),
          icon: Network,
          badge: '98.4%',
          badgeClass: 'bg-emerald-500/12 text-emerald-700 dark:text-emerald-300 border border-emerald-500/25',
        },
        {
          href: '/deficiencies',
          label: t('nav.deficiencies', 'Deficiency & EVC Notices'),
          icon: FileWarning,
          badge: deficiencyCount > 0 ? String(deficiencyCount) : null,
          badgeClass: 'bg-amber-500/12 text-amber-700 dark:text-amber-300 border border-amber-500/25',
        },
        {
          href: '/audit-trail',
          label: t('nav.audit', 'SHA-256 Audit Ledger'),
          icon: Link2,
          badge: null,
          badgeClass: '',
        },
      ],
    },
  ];

  return (
    <>
      {/* Mobile & Tablet Backdrop Overlay */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-950/45 backdrop-blur-xs lg:hidden transition-opacity cursor-pointer"
          aria-hidden="true"
        />
      )}

      <aside
        className={`!fixed top-2.5 bottom-2.5 left-2.5 lg:top-3.5 lg:bottom-3.5 lg:left-3.5 w-[248px] z-50 lg:z-30 liquid-glass-card rounded-[20px] flex flex-col justify-between overflow-hidden transition-transform duration-300 ease-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-[110%] lg:translate-x-0'
        }`}
      >
        {/* Top Brand Header */}
        <div>
          <div className="p-3.5 pb-3 border-b border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between gap-2">
            <Link className="flex items-center gap-2.5 min-w-0" href="/overview">
              <div className="h-9 w-9 rounded-xl glass-well flex items-center justify-center shrink-0">
                <AICTELogo className="h-6 w-6" size="sm" variant="icon" />
              </div>
              <div className="min-w-0">
                <div className="text-[13px] font-bold tracking-tight text-slate-900 dark:text-white truncate">
                  AICTE SCRUTINY
                </div>
                <div className="text-[10px] font-mono uppercase tracking-[0.06em] text-slate-500 dark:text-slate-400 truncate">
                  REGULATION BUREAU • v4.2
                </div>
              </div>
            </Link>
            <button
              onClick={onCloseMobile}
              className="lg:hidden glass-well h-7 w-7 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white shrink-0 cursor-pointer"
              aria-label="Close navigation menu"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Navigation Groups */}
          <nav className="p-2.5 space-y-4 overflow-y-auto max-h-[calc(100vh-170px)] no-scrollbar">
            {navGroups.map((group, gIdx) => (
              <div key={gIdx} className="space-y-1">
                <div className="px-2.5 text-[10px] font-bold uppercase tracking-[0.08em] text-slate-400 dark:text-slate-500">
                  {group.groupLabel}
                </div>
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    pathname === item.href ||
                    (item.href !== '/overview' && item.href !== '/applications' && pathname.startsWith(item.href)) ||
                    (item.href.startsWith('/applications/') && pathname.startsWith('/applications/'));

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onCloseMobile}
                      className={`group relative flex items-center justify-between px-2.5 py-2 rounded-xl text-[12.5px] font-medium transition-all duration-150 ${
                        isActive
                          ? 'glass-well font-semibold text-slate-950 dark:text-white'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white hover:bg-slate-900/[0.03] dark:hover:bg-white/[0.04]'
                      }`}
                    >
                      {isActive && (
                        <span className="absolute left-0.5 top-1/2 -translate-y-1/2 h-4 w-1 rounded-full bg-sky-500" />
                      )}
                      <span className="flex items-center gap-2.5 min-w-0 pl-1">
                        <Icon
                          className={`h-4 w-4 shrink-0 ${
                            isActive
                              ? 'text-sky-600 dark:text-sky-400'
                              : 'text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200'
                          }`}
                        />
                        <span className="truncate">{item.label}</span>
                      </span>
                      {item.badge && (
                        <span
                          className={`text-[10px] font-mono font-semibold tabular-nums px-1.5 py-0.5 rounded-full shrink-0 ${item.badgeClass}`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>
        </div>

        {/* Bottom Officer Profile Card */}
        <div className="p-2.5 border-t border-slate-200/80 dark:border-slate-800/80">
          <div className="glass-well rounded-xl p-2.5 flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-xs font-bold text-sky-700 dark:text-sky-300 shrink-0">
              RV
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                Shri R.K. Verma (RO-04)
              </div>
              <div className="text-[10.5px] text-slate-500 dark:text-slate-400 truncate">
                Regional Scrutiny Officer
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export default LeftGlassRail;
