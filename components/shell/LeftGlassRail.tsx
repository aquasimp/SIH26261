'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/lib/context';
import {
  LayoutDashboard,
  Building2,
  FileSearch,
  ScanEye,
  Layers,
  Network,
  AlertTriangle,
  History,
} from 'lucide-react';

export function LeftGlassRail() {
  const pathname = usePathname();
  const { t } = useLanguage();

  const navGroups = [
    {
      label: t.navCore,
      items: [
        {
          href: '/overview',
          label: t.navOverview,
          icon: LayoutDashboard,
          badge: null,
          badgeColor: '',
        },
        {
          href: '/applications',
          label: t.navApplications,
          icon: Building2,
          badge: '4,820',
          badgeColor: 'border border-slate-300 dark:border-slate-700 bg-slate-100/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300',
        },
        {
          href: '/applications/AICTE-2026-NW-0842',
          label: t.navWorkbench,
          icon: FileSearch,
          badge: 'LIVE',
          badgeColor: 'border border-red-500/40 bg-red-500/10 text-red-600 dark:text-red-400 font-bold',
        },
      ],
    },
    {
      label: t.navForensics,
      items: [
        {
          href: '/forensics',
          label: t.navForensicsStudio,
          icon: ScanEye,
          badge: '148',
          badgeColor: 'border border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-400',
        },
        {
          href: '/infrastructure',
          label: t.navInfrastructure,
          icon: Layers,
          badge: '64',
          badgeColor: 'border border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400',
        },
      ],
    },
    {
      label: t.navGovernance,
      items: [
        {
          href: '/authority-bridge',
          label: t.navAuthorityBridge,
          icon: Network,
          badge: '98.4%',
          badgeColor: 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
        },
        {
          href: '/deficiencies',
          label: t.navDeficiencies,
          icon: AlertTriangle,
          badge: null,
          badgeColor: '',
        },
        {
          href: '/audit-trail',
          label: t.navAuditTrail,
          icon: History,
          badge: null,
          badgeColor: '',
        },
      ],
    },
  ];

  return (
    <aside className="w-64 fixed inset-y-0 left-0 z-40 flex flex-col border-r border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-2xl shadow-[var(--glass-shadow)] transition-colors">
      {/* Brand Header */}
      <div className="h-14 px-3.5 border-b border-[var(--glass-border)] flex items-center gap-2.5">
        {/* Emblem: Tactile Obsidian Seal with Specular Rim and Gold AICTE Glyph */}
        <div className="w-8 h-8 rounded-lg bg-slate-950 dark:bg-slate-900 border border-slate-800 dark:border-slate-700/80 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.22),0_1px_3px_rgba(0,0,0,0.3)] flex items-center justify-center shrink-0 text-amber-400">
          <svg viewBox="0 0 48 48" width={18} height={18} className="fill-none stroke-current" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            {/* Emblem stylized Ashok wheel + open book + lamp */}
            <circle cx="24" cy="24" r="18" className="opacity-40" strokeDasharray="3 3" />
            <path d="M12 34C18 31 24 33 24 33C24 33 30 31 36 34" />
            <path d="M12 28C18 25 24 27 24 27C24 27 30 25 36 28" />
            <path d="M24 13V33" />
            <circle cx="24" cy="12" r="3" className="fill-amber-300 stroke-none" />
          </svg>
        </div>
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-xs tracking-tight text-[var(--text-primary)] truncate">
              {t.portalTitle}
            </span>
          </div>
          <span className="text-[9.5px] font-mono tracking-widest font-semibold text-[var(--text-muted)] uppercase truncate">
            {t.portalSubtitle}
          </span>
        </div>
      </div>

      {/* Navigation Groups - Dense Workstation Spacing */}
      <div className="flex-1 overflow-y-auto px-2.5 py-3 space-y-4">
        {navGroups.map((group, gIdx) => (
          <div key={gIdx} className="space-y-0.5">
            <div className="px-2.5 text-[9.5px] font-mono font-semibold uppercase tracking-wider text-[var(--text-faint)] mb-1.5">
              {group.label}
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
                  className={`group relative flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-slate-900 text-white dark:bg-white/12 dark:text-white font-semibold shadow-[inset_0_1px_0_0_rgba(255,255,255,0.18),0_1px_2px_rgba(0,0,0,0.12)] border border-slate-800 dark:border-white/15'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Icon
                      className={`w-3.5 h-3.5 shrink-0 transition-transform ${
                        isActive ? 'text-amber-400 dark:text-sky-300' : 'text-[var(--text-faint)] group-hover:text-[var(--text-secondary)]'
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className={`text-[9.5px] font-mono font-semibold px-1.5 py-0.5 rounded ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      {/* Officer Credential Footer - De-AI-ified, Sharp Typographic Credential */}
      <div className="p-2.5 border-t border-[var(--glass-border)] bg-[var(--glass-bg-subtle)]">
        <div className="flex items-center gap-2 p-1.5 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] shadow-2xs">
          <div className="relative w-7 h-7 rounded-md bg-slate-900 dark:bg-slate-800 text-slate-200 flex items-center justify-center font-mono font-bold text-[10px] shrink-0 border border-slate-700/60 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.15)]">
            RO
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[11px] font-semibold text-[var(--text-primary)] truncate">
              Shri R.K. Verma (RO-04)
            </div>
            <div className="text-[9.5px] font-mono text-[var(--text-muted)] truncate">
              Regional Scrutiny Officer
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
