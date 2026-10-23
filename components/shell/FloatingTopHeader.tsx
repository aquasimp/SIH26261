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
    <header className="!sticky sticky top-3 z-30 mx-3 mb-2.5 h-13 flex items-center justify-between px-4 liquid-glass-card rounded-2xl shadow-lg transition-all">
      {/* Left: Breadcrumbs & Telemetry */}
      <div className="flex items-center gap-3.5 min-w-0">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text-primary)]">
          <span className="text-[11px] font-semibold text-[var(--text-faint)] tracking-tight">AICTE / APH-26 /</span>
          <span className="truncate tracking-tight">{getBreadcrumb()}</span>
        </div>

        {/* Live DPI Status Tactile Pill */}
        <div className="hidden md:inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[11px] font-semibold shadow-2xs">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
          </span>
          <span>{t.dpiStatus}</span>
        </div>

        {/* Pipeline run clock */}
        <div className="hidden lg:flex items-center gap-1.5 text-[var(--text-muted)] text-[11px] font-medium">
          <Clock className="w-3.5 h-3.5 text-[var(--text-faint)]" />
          <span>{t.pipelineRun}</span>
        </div>
      </div>

      {/* Right: Quick Search, Language Switcher, Theme Toggle */}
      <div className="flex items-center gap-2.5 shrink-0">
        {/* Command Palette Trigger */}
        <button
          onClick={onOpenCommandPalette}
          className="btn-liquid-secondary flex items-center gap-2 px-3 py-1.5 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-xs shadow-2xs transition-all group cursor-pointer"
          title="Quick search (⌘K / Ctrl+K)"
        >
          <Search className="w-3.5 h-3.5 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors" />
          <span className="hidden sm:inline font-normal">{t.searchPlaceholder.slice(0, 24)}...</span>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-semibold bg-white/40 dark:bg-black/30 border border-[var(--glass-well-border)] rounded-md text-[var(--text-secondary)] shadow-2xs">
            ⌘K
          </kbd>
        </button>

        {/* Bilingual Switcher (EN | हिन्दी) */}
        <div className="glass-well inline-flex rounded-xl p-0.5 text-xs font-semibold shadow-2xs">
          <button
            onClick={() => setLanguage('en')}
            className={`px-2.5 py-1 rounded-lg transition-all text-[11px] cursor-pointer ${
              language === 'en'
                ? 'btn-liquid-primary font-bold shadow-xs'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            EN
          </button>
          <button
            onClick={() => setLanguage('hi')}
            className={`px-2.5 py-1 rounded-lg transition-all text-[11px] cursor-pointer ${
              language === 'hi'
                ? 'btn-liquid-primary font-bold shadow-xs'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            हिन्दी
          </button>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="btn-liquid-secondary p-2 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all shadow-2xs cursor-pointer"
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
