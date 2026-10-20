'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/lib/context';
import { useTheme } from 'next-themes';
import {
  Search,
  Sun,
  Moon,
  Globe,
  Radio,
  Clock,
  Sparkles,
} from 'lucide-react';

interface FloatingTopHeaderProps {
  onOpenCommandPalette?: () => void;
}

export function FloatingTopHeader({ onOpenCommandPalette }: FloatingTopHeaderProps) {
  const pathname = usePathname();
  const { t, language, setLanguage } = useLanguage();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && (resolvedTheme === 'dark' || theme === 'dark');

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  // Compute breadcrumbs
  const getBreadcrumb = () => {
    if (pathname === '/overview') return t.navOverview;
    if (pathname === '/applications') return t.navApplications;
    if (pathname.startsWith('/applications/')) return `${t.navWorkbench} • ${pathname.split('/')[2]}`;
    if (pathname === '/forensics') return t.navForensicsStudio;
    if (pathname === '/infrastructure') return t.navInfrastructure;
    if (pathname === '/authority-bridge') return t.navAuthorityBridge;
    if (pathname === '/deficiencies') return t.navDeficiencies;
    if (pathname === '/audit-trail') return t.navAuditTrail;
    return 'Scrutiny Portal';
  };

  return (
    <header className="sticky top-0 z-30 h-16 w-full flex items-center justify-between px-6 border-b border-slate-200 dark:border-slate-800 bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl shadow-xs">
      {/* Left: Breadcrumbs & Telemetry */}
      <div className="flex items-center gap-4 min-w-0">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-slate-100">
          <span className="text-slate-400 dark:text-slate-500 font-normal">AICTE PS 26261 /</span>
          <span className="truncate">{getBreadcrumb()}</span>
        </div>

        {/* Live DPI Status Pulse */}
        <div className="hidden md:inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-[11px] font-medium">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span>{t.dpiStatus}</span>
        </div>

        {/* Pipeline run clock */}
        <div className="hidden lg:flex items-center gap-1.5 text-slate-400 dark:text-slate-500 text-[11px]">
          <Clock className="w-3.5 h-3.5" />
          <span>{t.pipelineRun}</span>
        </div>
      </div>

      {/* Right: Quick Search, Language Switcher, Theme Toggle */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Command Palette Trigger */}
        <button
          onClick={onOpenCommandPalette}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 text-xs hover:border-sky-500/40 hover:text-slate-900 dark:hover:text-white transition-all shadow-2xs group"
          title="Quick search (⌘K / Ctrl+K)"
        >
          <Search className="w-3.5 h-3.5 group-hover:text-sky-500 transition-colors" />
          <span className="hidden sm:inline">{t.searchPlaceholder.slice(0, 24)}...</span>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono font-semibold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded text-slate-500 dark:text-slate-400">
            ⌘K
          </kbd>
        </button>

        {/* Bilingual Switcher (EN | हिन्दी) */}
        <div className="inline-flex rounded-xl p-0.5 bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-semibold">
          <button
            onClick={() => setLanguage('en')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              language === 'en'
                ? 'bg-white dark:bg-slate-900 text-sky-700 dark:text-sky-400 shadow-2xs font-bold'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            EN
          </button>
          <button
            onClick={() => setLanguage('hi')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              language === 'hi'
                ? 'bg-white dark:bg-slate-900 text-sky-700 dark:text-sky-400 shadow-2xs font-bold'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            हिन्दी
          </button>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 transition-all shadow-2xs cursor-pointer"
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          aria-label="Toggle Theme"
        >
          {isDark ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-sky-700" />
          )}
        </button>
      </div>
    </header>
  );
}
