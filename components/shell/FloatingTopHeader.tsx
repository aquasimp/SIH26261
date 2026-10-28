'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import {
  Menu,
  Search,
  Sun,
  Moon,
  Bell,
  ChevronDown,
  ShieldCheck,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useLanguage } from '@/lib/context';
import AshokaEmblem from '@/components/brand/AshokaEmblem';

export interface FloatingTopHeaderProps {
  onOpenMobileMenu?: () => void;
  onOpenCommandPalette?: () => void;
}

export function FloatingTopHeader({ onOpenMobileMenu, onOpenCommandPalette }: FloatingTopHeaderProps) {
  const pathname = usePathname();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [showNotificationMenu, setShowNotificationMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getRouteLabel = () => {
    if (pathname.startsWith('/overview')) return t('nav.overview', 'Dashboard');
    if (pathname.startsWith('/applications/')) return t('nav.workbench', 'Scrutiny Workbench');
    if (pathname.startsWith('/applications')) return t('nav.applications', 'Institutional Dossiers');
    if (pathname.startsWith('/forensics')) return t('nav.forensics', 'Document Forensics Studio');
    if (pathname.startsWith('/infrastructure')) return t('nav.infrastructure', 'Blueprint & Campus Analysis');
    if (pathname.startsWith('/faculty')) return language === 'hi' ? 'संकाय सत्यापन' : 'Faculty Verification';
    if (pathname.startsWith('/authority-bridge')) return t('nav.authority', 'Authority Bridge (DPI)');
    if (pathname.startsWith('/deficiencies')) return t('nav.deficiencies', 'Deficiency & Show-Cause');
    if (pathname.startsWith('/audit-trail')) return t('nav.audit', 'SHA-256 Audit Ledger');
    if (pathname.startsWith('/reports')) return language === 'hi' ? 'रिपोर्ट और एनालिटिक्स' : 'Reports & Analytics';
    return 'Dashboard';
  };

  const triggerCommandPalette = () => {
    if (onOpenCommandPalette) {
      onOpenCommandPalette();
    } else {
      window.dispatchEvent(new CustomEvent('open-command-palette'));

    }
  };

  const isDark = mounted && (resolvedTheme === 'dark' || theme === 'dark');

  return (
    <header className="liquid-glass-card rounded-[18px] px-4 py-3 sm:px-5 sm:py-3 flex items-center justify-between gap-3 shadow-sm relative z-20">
      {/* Left: Mobile Toggle + Ashoka Emblem + AICTE Brand Title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden glass-well h-9 w-9 rounded-xl flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 shrink-0 cursor-pointer transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="h-4 w-4" />
        </button>

        <Link href="/overview" className="flex items-center gap-2.5 group">
          <div className="h-10 w-9 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <AshokaEmblem size={28} />
          </div>
          <div className="min-w-0 hidden sm:block">
            <div className="flex items-center gap-1.5 leading-none">
              <span className="font-extrabold tracking-tight text-sm text-slate-900 dark:text-white">
                AICTE
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold bg-sky-500/10 dark:bg-sky-500/20 text-sky-700 dark:text-sky-300 border border-sky-500/20">
                APH 2024–27
              </span>
            </div>
            <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate mt-0.5">
              Regulatory Scrutiny Workstation
            </div>
          </div>
        </Link>

        {/* Current Active Breadcrumb for Mobile / Tablet */}
        <div className="sm:hidden flex items-center text-xs font-semibold text-slate-800 dark:text-slate-200 truncate pl-1 border-l border-slate-200 dark:border-slate-800">
          {getRouteLabel()}
        </div>
      </div>

      {/* Center: Search Omnibar matching Image 2 */}
      <div className="flex-1 max-w-xl mx-2 hidden md:block">
        <button
          onClick={triggerCommandPalette}
          className="w-full glass-well hover:border-sky-500/40 rounded-xl px-3.5 py-2 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 flex items-center justify-between transition-all cursor-pointer shadow-inner"
          title="Search by Institution Name, PID, AISHE Code... (Ctrl K)"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <Search className="h-4 w-4 text-slate-400 dark:text-slate-500 shrink-0" />
            <span className="truncate text-[12px]">
              {language === 'hi'
                ? 'संस्थान का नाम, PID, AISHE कोड से खोजें...'
                : 'Search by Institution Name, PID, AISHE Code...'}
            </span>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <kbd className="px-1.5 py-0.5 text-[10.5px] font-mono font-bold bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded border border-slate-200 dark:border-slate-700 shadow-2xs">
              Ctrl K
            </kbd>
          </div>
        </button>
      </div>

      {/* Right: Notifications + Language + Theme Toggle + User Officer Profile */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Mobile Search Button */}
        <button
          onClick={triggerCommandPalette}
          className="md:hidden glass-well h-9 w-9 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
          title="Search"
        >
          <Search className="h-4 w-4" />
        </button>

        {/* Notification Bell with Badge */}
        <div className="relative">
          <button
            onClick={() => setShowNotificationMenu((p) => !p)}
            className="glass-well h-9 w-9 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer relative"
            aria-label="Statutory alerts and notices"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900 animate-pulse" />
          </button>

          {showNotificationMenu && (
            <div
              className="absolute right-0 mt-2 w-72 rounded-2xl liquid-glass-card border border-slate-200/90 dark:border-slate-800/90 p-3 shadow-xl z-50 text-xs animate-glass-in"
              onMouseLeave={() => setShowNotificationMenu(false)}
            >
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200/80 dark:border-slate-800/80">
                <span className="font-bold text-slate-900 dark:text-white">Recent Regulatory Alerts</span>
                <span className="text-[10px] font-semibold text-rose-600 dark:text-rose-400">3 Unresolved</span>
              </div>
              <div className="space-y-2">
                <Link
                  href="/applications/AICTE-2026-NW-0842"
                  onClick={() => setShowNotificationMenu(false)}
                  className="block p-2 rounded-xl glass-well hover:border-rose-500/40 transition-colors"
                >
                  <div className="font-semibold text-rose-600 dark:text-rose-400 flex items-center justify-between">
                    <span>Fatal Forgery Alert</span>
                    <span className="text-[10px] text-slate-400 font-mono">2h ago</span>
                  </div>
                  <div className="text-[11px] text-slate-700 dark:text-slate-300 font-medium truncate mt-0.5">
                    Apex Institute of Technology
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                    Fire NOC expiry year altered (2027 over 2024)
                  </div>
                </Link>
                <Link
                  href="/infrastructure"
                  onClick={() => setShowNotificationMenu(false)}
                  className="block p-2 rounded-xl glass-well hover:border-amber-500/40 transition-colors"
                >
                  <div className="font-semibold text-amber-600 dark:text-amber-400 flex items-center justify-between">
                    <span>Area Deficit</span>
                    <span className="text-[10px] text-slate-400 font-mono">4h ago</span>
                  </div>
                  <div className="text-[11px] text-slate-700 dark:text-slate-300 font-medium truncate mt-0.5">
                    Shivam College of Engineering
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                    Lab area 47.8 m² vs claimed 66 m²
                  </div>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Bilingual Segmented Control */}
        <div className="glass-well rounded-xl p-0.5 inline-flex items-center">
          <button
            onClick={() => setLanguage('en')}
            className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
              language === 'en'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            EN
          </button>
          <button
            onClick={() => setLanguage('hi')}
            className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
              language === 'hi'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            हिन्दी
          </button>
        </div>

        {/* Theme Toggle (Sun/Moon with clear feedback) */}
        <button
          onClick={() => setTheme(isDark ? 'light' : 'dark')}
          className="glass-well h-9 w-9 rounded-xl flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          aria-label="Toggle dark/light theme"
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {mounted ? (
            isDark ? (
              <Sun className="h-4 w-4 text-amber-400 animate-spin-once" />
            ) : (
              <Moon className="h-4 w-4 text-slate-700" />
            )
          ) : (
            <span className="h-4 w-4" />
          )}
        </button>

        {/* Officer Profile Badge matching Image 2 */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu((p) => !p)}
            className="glass-well hover:border-slate-300 dark:hover:border-slate-700 rounded-xl p-1 sm:pr-2.5 flex items-center gap-2 cursor-pointer transition-colors"
          >
            <div className="h-7 w-7 rounded-lg bg-blue-600 flex items-center justify-center text-white text-xs font-bold shadow-xs shrink-0">
              RV
            </div>
            <div className="text-left hidden lg:block leading-tight">
              <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1">
                <span>Shri R.K. Verma (RO-04)</span>
                <ChevronDown className="h-3 w-3 text-slate-400 shrink-0" />
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                Regional Scrutiny Officer
              </div>
            </div>
          </button>

          {showProfileMenu && (
            <div
              className="absolute right-0 mt-2 w-56 rounded-2xl liquid-glass-card border border-slate-200/90 dark:border-slate-800/90 p-3 shadow-xl z-50 text-xs animate-glass-in space-y-2"
              onMouseLeave={() => setShowProfileMenu(false)}
            >
              <div className="pb-2 border-b border-slate-200/80 dark:border-slate-800/80">
                <div className="font-bold text-slate-900 dark:text-white">Shri R.K. Verma</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">RO-04 (North-Western Region)</div>
                <div className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>DPI Cryptographic Key: Active</span>
                </div>
              </div>
              <div className="space-y-1">
                <Link
                  href="/overview"
                  onClick={() => setShowProfileMenu(false)}
                  className="block px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium"
                >
                  Executive Dashboard
                </Link>
                <Link
                  href="/audit-trail"
                  onClick={() => setShowProfileMenu(false)}
                  className="block px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium"
                >
                  My Signed Audit Blocks
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default FloatingTopHeader;
