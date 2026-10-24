'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { Menu, Search, Sun, Moon, Clock } from 'lucide-react';
import { useLanguage } from '@/lib/context';

export interface FloatingTopHeaderProps {
  onOpenMobileMenu?: () => void;
  onOpenCommandPalette?: () => void;
}

export function FloatingTopHeader({ onOpenMobileMenu, onOpenCommandPalette }: FloatingTopHeaderProps) {
  const pathname = usePathname();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getRouteLabel = () => {
    if (pathname.startsWith('/overview')) return t('nav.overview', 'Executive Overview');
    if (pathname.startsWith('/applications/')) return t('nav.workbench', 'Scrutiny Workbench');
    if (pathname.startsWith('/applications')) return t('nav.applications', 'Institutional Registry');
    if (pathname.startsWith('/forensics')) return t('nav.forensics', 'Document Forensics Studio');
    if (pathname.startsWith('/infrastructure')) return t('nav.infrastructure', 'Blueprint & Campus CV');
    if (pathname.startsWith('/authority-bridge')) return t('nav.authority', 'Authority Bridge (DPI)');
    if (pathname.startsWith('/deficiencies')) return t('nav.deficiencies', 'Deficiency & EVC Notices');
    if (pathname.startsWith('/audit-trail')) return t('nav.audit', 'SHA-256 Audit Ledger');
    return 'Executive Overview';
  };

  const triggerCommandPalette = () => {
    if (onOpenCommandPalette) {
      onOpenCommandPalette();
    } else {
      window.dispatchEvent(new CustomEvent('open-command-palette'));
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true, ctrlKey: true }));
    }
  };

  const isDark = mounted && (resolvedTheme === 'dark' || theme === 'dark');

  return (
    <header className="liquid-glass-card rounded-[16px] px-3 py-2 sm:px-4 sm:py-2.5 mb-2.5 flex items-center justify-between gap-2">
      {/* Left: Hamburger + Breadcrumb + DPI Status */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden glass-well h-8 w-8 rounded-xl flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 shrink-0 cursor-pointer"
          aria-label="Open navigation menu"
        >
          <Menu className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-1.5 text-xs min-w-0">
          <span className="hidden sm:inline font-mono text-[11px] text-slate-400 dark:text-slate-500 shrink-0">
            AICTE/APH-26 /
          </span>
          <span className="font-semibold text-slate-900 dark:text-white truncate">
            {getRouteLabel()}
          </span>
        </div>

        <Link
          className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/25 shrink-0"
          href="/authority-bridge"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>DPI Bridge: 6/6 Authorities Online</span>
        </Link>

        <span className="hidden xl:inline-flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 shrink-0">
          <Clock className="h-3 w-3" />
          <span>Pipeline Run: 4 mins ago</span>
        </span>
      </div>

      {/* Right: Command Search + Language Toggle + Theme Toggle */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        <button
          onClick={triggerCommandPalette}
          className="glass-well rounded-xl px-2.5 py-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white inline-flex items-center gap-2 transition-colors cursor-pointer"
          title="Search PID, Institution, UAN, or APH Clause (⌘K)"
        >
          <Search className="h-3.5 w-3.5 shrink-0" />
          <span className="hidden sm:inline text-[11.5px]">Search PID, Institution...</span>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono font-semibold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded border border-slate-200 dark:border-slate-700">
            ⌘K
          </kbd>
        </button>

        {/* Bilingual Segmented Control */}
        <div className="glass-well rounded-xl p-0.5 inline-flex items-center">
          <button
            onClick={() => setLanguage('en')}
            className={`px-2 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
              language === 'en'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            EN
          </button>
          <button
            onClick={() => setLanguage('hi')}
            className={`px-2 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
              language === 'hi'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            हिन्दी
          </button>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(isDark ? 'light' : 'dark')}
          className="glass-well h-8 w-8 rounded-xl flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          aria-label="Toggle theme"
        >
          {mounted ? (
            isDark ? (
              <Sun className="h-4 w-4 text-amber-400" />
            ) : (
              <Moon className="h-4 w-4 text-slate-700" />
            )
          ) : (
            <span className="h-4 w-4" />
          )}
        </button>
      </div>
    </header>
  );
}

export default FloatingTopHeader;
