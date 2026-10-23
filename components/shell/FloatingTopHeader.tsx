'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/lib/context';
import { useTheme } from 'next-themes';
import {
  Search,
  Sun,
  Moon,
  Clock,
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
    <header className="sticky top-0 z-30 h-13 w-full flex items-center justify-between px-4 border-b border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-2xl shadow-[var(--glass-shadow)] transition-colors">
      {/* Left: Breadcrumbs & Telemetry */}
      <div className="flex items-center gap-3.5 min-w-0">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text-primary)]">
          <span className="font-mono text-[11px] text-[var(--text-faint)] tracking-tight">AICTE/APH-26 /</span>
          <span className="truncate tracking-tight">{getBreadcrumb()}</span>
        </div>

        {/* Live DPI Status Tactile Pill */}
        <div className="hidden md:inline-flex items-center gap-2 px-2 py-0.5 rounded-full border border-emerald-500/30 bg-emerald-500/8 text-emerald-700 dark:text-emerald-400 text-[10.5px] font-mono font-medium shadow-[inset_0_1px_0_0_rgba(255,255,255,0.35)]">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
          </span>
          <span>{t.dpiStatus}</span>
        </div>

        {/* Pipeline run clock */}
        <div className="hidden lg:flex items-center gap-1 text-[var(--text-muted)] font-mono text-[10.5px]">
          <Clock className="w-3 h-3 text-[var(--text-faint)]" />
          <span>{t.pipelineRun}</span>
        </div>
      </div>

      {/* Right: Quick Search, Language Switcher, Theme Toggle */}
      <div className="flex items-center gap-2.5 shrink-0">
        {/* Command Palette Trigger */}
        <button
          onClick={onOpenCommandPalette}
          className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-[var(--glass-bg-subtle)] border border-[var(--glass-border)] text-[var(--text-muted)] hover:border-[var(--glass-border-strong)] hover:text-[var(--text-primary)] text-xs shadow-2xs transition-all group cursor-pointer"
          title="Quick search (⌘K / Ctrl+K)"
        >
          <Search className="w-3.5 h-3.5 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors" />
          <span className="hidden sm:inline font-normal">{t.searchPlaceholder.slice(0, 24)}...</span>
          <kbd className="hidden sm:inline-block px-1.5 py-0.2 text-[9.5px] font-mono font-semibold bg-[var(--glass-bg-elevated)] border border-[var(--glass-border)] rounded text-[var(--text-secondary)]">
            ⌘K
          </kbd>
        </button>

        {/* Bilingual Switcher (EN | हिन्दी) */}
        <div className="inline-flex rounded-lg p-0.5 bg-[var(--glass-bg-subtle)] border border-[var(--glass-border)] text-xs font-semibold">
          <button
            onClick={() => setLanguage('en')}
            className={`px-2 py-0.5 rounded-md transition-all text-[11px] cursor-pointer ${
              language === 'en'
                ? 'bg-slate-900 text-white dark:bg-white/15 dark:text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.18),0_1px_2px_rgba(0,0,0,0.1)] font-bold'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            EN
          </button>
          <button
            onClick={() => setLanguage('hi')}
            className={`px-2 py-0.5 rounded-md transition-all text-[11px] cursor-pointer ${
              language === 'hi'
                ? 'bg-slate-900 text-white dark:bg-white/15 dark:text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.18),0_1px_2px_rgba(0,0,0,0.1)] font-bold'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            हिन्दी
          </button>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-1.5 rounded-lg bg-[var(--glass-bg-subtle)] border border-[var(--glass-border)] text-[var(--text-secondary)] hover:bg-[var(--glass-bg-elevated)] hover:border-[var(--glass-border-strong)] transition-all shadow-2xs cursor-pointer"
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          aria-label="Toggle Theme"
        >
          {isDark ? (
            <Sun className="w-3.5 h-3.5 text-amber-400" />
          ) : (
            <Moon className="w-3.5 h-3.5 text-slate-700 dark:text-slate-200" />
          )}
        </button>
      </div>
    </header>
  );
}
