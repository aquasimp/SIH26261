'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutGrid,
  FileText,
  ScanSearch,
  Fingerprint,
  Compass,
  Users,
  Network,
  AlertTriangle,
  Link2,
  BarChart3,
  X,
  Radio,
} from 'lucide-react';
import AshokaEmblem from '@/components/brand/AshokaEmblem';
import { useFilters, useLanguage } from '@/lib/context';

export interface LeftGlassRailProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export function LeftGlassRail({ mobileOpen = false, onCloseMobile }: LeftGlassRailProps) {
  const pathname = usePathname();
  const { applications } = useFilters();
  const { t, language } = useLanguage();

  const deficiencyCount = applications.filter((a) => a.scrutinyStatus === 'Deficiency Issued').length;

  const navItems = [
    {
      href: '/overview',
      label: language === 'hi' ? 'डैशबोर्ड' : 'Dashboard',
      icon: LayoutGrid,
      badge: null,
      badgeClass: '',
    },
    {
      href: '/applications',
      label: language === 'hi' ? 'संस्थागत डोजियर' : 'Institutional Dossiers',
      icon: FileText,
      badge: '4,820',
      badgeClass: 'glass-well text-slate-700 dark:text-slate-300 font-mono font-semibold',
    },
    {
      href: '/applications/AICTE-2026-NW-0842',
      label: language === 'hi' ? 'जांच कार्यक्षेत्र' : 'Scrutiny Workbench',
      icon: ScanSearch,
      badge: 'LIVE',
      badgeClass: 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30 font-bold',
    },
    {
      href: '/forensics',
      label: language === 'hi' ? 'फॉरेंसिक विश्लेषण' : 'Forensic Analysis',
      icon: Fingerprint,
      badge: null,
      badgeClass: '',
    },
    {
      href: '/infrastructure',
      label: language === 'hi' ? 'ब्लूप्रिंट विश्लेषण' : 'Blueprint Analysis',
      icon: Compass,
      badge: null,
      badgeClass: '',
    },
    {
      href: '/faculty',
      label: language === 'hi' ? 'संकाय सत्यापन' : 'Faculty Verification',
      icon: Users,
      badge: null,
      badgeClass: '',
    },
    {
      href: '/authority-bridge',
      label: language === 'hi' ? 'अथॉरिटी ब्रिज' : 'Authority Bridge',
      icon: Network,
      badge: null,
      badgeClass: '',
    },
    {
      href: '/deficiencies',
      label: language === 'hi' ? 'कमी सूचनाएं' : 'Deficiency Notices',
      icon: AlertTriangle,
      badge: String(deficiencyCount || 12),
      badgeClass: 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30 font-mono font-bold',
    },
    {
      href: '/audit-trail',
      label: language === 'hi' ? 'ऑडिट लेजर' : 'Audit Ledger',
      icon: Link2,
      badge: null,
      badgeClass: '',
    },
    {
      href: '/reports',
      label: language === 'hi' ? 'रिपोर्ट और एनालिटिक्स' : 'Reports & Analytics',
      icon: BarChart3,
      badge: null,
      badgeClass: '',
    },
  ];

  // Single deterministic source of truth for active navigation item
  const getActiveHref = (path: string): string => {
    if (!path || path === '/' || path === '/overview') return '/overview';
    if (path === '/applications') return '/applications';
    if (path.startsWith('/applications/')) return '/applications/AICTE-2026-NW-0842';
    if (path.startsWith('/forensics')) return '/forensics';
    if (path.startsWith('/infrastructure')) return '/infrastructure';
    if (path.startsWith('/faculty')) return '/faculty';
    if (path.startsWith('/authority-bridge')) return '/authority-bridge';
    if (path.startsWith('/deficiencies')) return '/deficiencies';
    if (path.startsWith('/audit-trail')) return '/audit-trail';
    if (path.startsWith('/reports')) return '/reports';
    return '';
  };

  const activeHref = getActiveHref(pathname);

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs lg:hidden transition-opacity cursor-pointer"
          aria-hidden="true"
        />
      )}

      <aside
        className={`!fixed top-3 bottom-3 left-3 sm:top-4 sm:bottom-4 sm:left-4 lg:top-5 lg:bottom-5 lg:left-5 w-[260px] z-50 lg:z-30 liquid-glass-card rounded-[22px] flex flex-col justify-between overflow-hidden transition-transform duration-300 ease-out shadow-lg ${
          mobileOpen ? 'translate-x-0' : '-translate-x-[110%] lg:translate-x-0'
        }`}
      >
        {/* Top Brand Header */}
        <div>
          <div className="p-4 pb-3.5 border-b border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between gap-2">
            <Link className="flex items-center gap-2.5 min-w-0 group" href="/overview">
              <div className="h-9.5 w-9.5 rounded-xl glass-well flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <AshokaEmblem size={26} />
              </div>
              <div className="min-w-0">
                <div className="text-[13.5px] font-extrabold tracking-tight text-slate-900 dark:text-white truncate">
                  AICTE SCRUTINY
                </div>
                <div className="text-[10px] font-mono uppercase tracking-[0.06em] text-slate-500 dark:text-slate-400 truncate">
                  REGULATION BUREAU • APH-26
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

          {/* Navigation Items with Guaranteed Single-Selection */}
          <nav className="p-2.5 space-y-1 overflow-y-auto max-h-[calc(100vh-250px)] no-scrollbar">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.href === activeHref;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onCloseMobile}
                  className={`group relative flex items-center justify-between px-3 py-2.5 rounded-xl text-[13.5px] font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-blue-600/10 text-blue-700 dark:text-sky-400 dark:bg-sky-500/10 font-bold border border-blue-500/25 dark:border-sky-500/25 shadow-2xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white hover:bg-slate-900/[0.04] dark:hover:bg-white/[0.05]'
                  }`}
                >
                  {isActive && (
                    <span className="absolute left-1 top-1/2 -translate-y-1/2 h-5 w-1 rounded-full bg-blue-600 dark:bg-sky-400" />
                  )}
                  <span className="flex items-center gap-2.5 min-w-0 pl-1">
                    <Icon
                      className={`h-4.5 w-4.5 shrink-0 transition-colors ${
                        isActive
                          ? 'text-blue-600 dark:text-sky-400'
                          : 'text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200'
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </span>
                  {item.badge && (
                    <span
                      className={`text-[10.5px] tabular-nums px-2 py-0.5 rounded-full shrink-0 ${item.badgeClass}`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom System Status Section */}
        <div className="p-3 border-t border-slate-200/80 dark:border-slate-800/80 space-y-2">
          <div className="glass-well rounded-xl p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                System Status
              </span>
              <span className="inline-flex items-center gap-1.5 text-[11.5px] font-bold text-emerald-600 dark:text-emerald-400">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                Online
              </span>
            </div>

            <div className="text-[11.5px] text-slate-700 dark:text-slate-300 font-medium">
              DPI Bridge (Simulated)
            </div>
            <div className="text-[11px] font-mono font-semibold text-emerald-600 dark:text-emerald-400">
              6/6 Connected
            </div>

            <div className="pt-1.5 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between text-[10.5px] text-slate-400 dark:text-slate-500">
              <span>Last Sync 2 mins ago</span>
              <span className="font-mono">v4.2.0</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export default LeftGlassRail;
