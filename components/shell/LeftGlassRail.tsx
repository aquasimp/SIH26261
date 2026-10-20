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
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';

export function LeftGlassRail() {
  const pathname = usePathname();
  const { t, language } = useLanguage();

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
          badgeColor: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border border-indigo-500/20',
        },
        {
          href: '/applications/AICTE-2026-NW-0842',
          label: t.navWorkbench,
          icon: FileSearch,
          badge: 'LIVE',
          badgeColor: 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/25 animate-pulse',
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
          badgeColor: 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/20',
        },
        {
          href: '/infrastructure',
          label: t.navInfrastructure,
          icon: Layers,
          badge: '64',
          badgeColor: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20',
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
          badgeColor: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20',
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
    <aside className="w-64 fixed inset-y-0 left-0 z-40 flex flex-col border-r border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl shadow-sm">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
        {/* Emblem SVG */}
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-600 to-indigo-800 flex items-center justify-center shadow-md shadow-sky-600/20 shrink-0 text-white">
          <svg viewBox="0 0 48 48" width={24} height={24} style={{ width: '24px', height: '24px' }} className="w-6 h-6 fill-none stroke-current" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
            <span className="font-bold text-sm tracking-tight text-slate-900 dark:text-white truncate">
              {t.portalTitle}
            </span>
          </div>
          <span className="text-[10px] font-mono tracking-wider font-semibold text-sky-700 dark:text-sky-400 uppercase truncate">
            {t.portalSubtitle}
          </span>
        </div>
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {navGroups.map((group, gIdx) => (
          <div key={gIdx} className="space-y-1">
            <div className="px-3 text-[10px] font-bold uppercase tracking-[0.08em] text-slate-400 dark:text-slate-500 mb-2">
              {group.label}
            </div>
            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== '/overview' && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group relative flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-sky-500/10 text-sky-800 dark:text-sky-300 font-semibold shadow-xs border border-sky-500/25'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/60 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                        isActive ? 'text-sky-600 dark:text-sky-400' : 'text-slate-400 dark:text-slate-500'
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      {/* Officer Credential Footer */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/60">
        <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-2xs">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[11px] font-semibold text-slate-800 dark:text-slate-200 truncate">
              Shri R.K. Verma (RO-04)
            </div>
            <div className="text-[10px] text-slate-400 dark:text-slate-500 truncate">
              Regional Scrutiny Officer
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
