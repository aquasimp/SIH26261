'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Sparkles, SlidersHorizontal, Sun, Moon } from 'lucide-react';

export type LogoSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
export type LogoMode = 'auto' | 'light' | 'dark';
export type LogoVariant = 'icon' | 'badge' | 'full' | 'compact' | 'letterhead';

export interface AICTELogoProps {
  size?: LogoSize;
  mode?: LogoMode;
  variant?: LogoVariant;
  showStatusDot?: boolean;
  interactive?: boolean;
  className?: string;
  title?: string;
  subtitle?: string;
  onSizeChange?: (size: LogoSize) => void;
  onModeChange?: (mode: LogoMode) => void;
}

const SIZE_MAP: Record<string, number> = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 48,
  xl: 64,
};

export function AICTELogo({
  size = 'md',
  mode = 'auto',
  variant = 'badge',
  showStatusDot = true,
  interactive = false,
  className = '',
  title = 'AICTE SCRUTINY',
  subtitle = 'REGULATION BUREAU • DPI V4.2',
  onSizeChange,
  onModeChange,
}: AICTELogoProps) {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [currentSize, setCurrentSize] = useState<LogoSize>(size);
  const [currentMode, setCurrentMode] = useState<LogoMode>(mode);
  const [showAdjuster, setShowAdjuster] = useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!showAdjuster) return;
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowAdjuster(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [showAdjuster]);

  useEffect(() => {
    setCurrentSize(size);
  }, [size]);

  useEffect(() => {
    setCurrentMode(mode);
  }, [mode]);

  // Determine actual effective theme (light vs dark)
  const isDark =
    currentMode === 'dark' ||
    (currentMode === 'auto' && mounted && (resolvedTheme === 'dark' || theme === 'dark'));

  // Calculate pixel size
  const pixelSize = typeof currentSize === 'number' ? currentSize : (SIZE_MAP[currentSize] || 40);

  // Unique ID prefix to avoid gradient collisions
  const uid = React.useId().replace(/:/g, '');

  const handleSizeSelect = (newSize: LogoSize, e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentSize(newSize);
    if (onSizeChange) onSizeChange(newSize);
  };

  const handleModeSelect = (newMode: LogoMode, e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentMode(newMode);
    if (newMode !== 'auto') {
      setTheme(newMode);
    }
    if (onModeChange) onModeChange(newMode);
  };

  // Render raw vector SVG emblem
  const renderEmblem = () => (
    <svg
      viewBox="0 0 64 64"
      width={pixelSize}
      height={pixelSize}
      className="shrink-0 transition-all duration-300"
      style={{ width: `${pixelSize}px`, height: `${pixelSize}px` }}
      aria-label="AICTE Official Insignia"
    >
      <defs>
        {/* Dynamic Gradients adapting to Light vs Dark Mode */}
        <linearGradient id={`${uid}-bg`} x1="0%" y1="0%" x2="100%" y2="100%">
          {isDark ? (
            <>
              <stop offset="0%" stopColor="#0B132B" />
              <stop offset="60%" stopColor="#090D16" />
              <stop offset="100%" stopColor="#020617" />
            </>
          ) : (
            <>
              <stop offset="0%" stopColor="#0F172A" />
              <stop offset="60%" stopColor="#1E293B" />
              <stop offset="100%" stopColor="#0B1528" />
            </>
          )}
        </linearGradient>

        <linearGradient id={`${uid}-gold`} x1="0%" y1="0%" x2="100%" y2="100%">
          {isDark ? (
            <>
              <stop offset="0%" stopColor="#FEF08A" />
              <stop offset="45%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#D97706" />
            </>
          ) : (
            <>
              <stop offset="0%" stopColor="#FDE047" />
              <stop offset="50%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#B45309" />
            </>
          )}
        </linearGradient>

        <linearGradient id={`${uid}-wings`} x1="0%" y1="0%" x2="100%" y2="100%">
          {isDark ? (
            <>
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#0284C7" />
            </>
          ) : (
            <>
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#0284C7" />
            </>
          )}
        </linearGradient>

        <filter id={`${uid}-glow`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation={isDark ? "2.5" : "1.2"} result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Rounded Medallion Shield Base */}
      <rect
        x="2"
        y="2"
        width="60"
        height="60"
        rx="15"
        fill={`url(#${uid}-bg)`}
        stroke={isDark ? '#334155' : '#1E293B'}
        strokeWidth="1.8"
      />

      {/* Specular Inner Rim */}
      <rect
        x="3"
        y="3"
        width="58"
        height="58"
        rx="14"
        fill="none"
        stroke={isDark ? '#38BDF8' : '#F59E0B'}
        strokeWidth="1"
        strokeOpacity={isDark ? '0.35' : '0.45'}
      />

      {/* Outer Dharma Chakra Ring with 24 Radial Dots / Ashoka Wheel */}
      <circle
        cx="32"
        cy="32"
        r="22.5"
        fill="none"
        stroke={isDark ? '#64748B' : '#94A3B8'}
        strokeWidth="1.2"
        strokeDasharray="2 3.8"
        strokeOpacity={isDark ? '0.75' : '0.85'}
      />

      {/* Open Wings of Wisdom / Open Book Motif */}
      <path
        d="M16 43 C22 39, 27 41, 32 44 C37 41, 42 39, 48 43"
        fill="none"
        stroke={`url(#${uid}-wings)`}
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <path
        d="M16 36 C22 32, 27 34, 32 37 C37 34, 42 32, 48 36"
        fill="none"
        stroke={isDark ? '#E2E8F0' : '#F1F5F9'}
        strokeWidth="2.2"
        strokeLinecap="round"
      />

      {/* Central Pillar of Science & Technology */}
      <path
        d="M32 20 L32 42"
        stroke={`url(#${uid}-gold)`}
        strokeWidth="2.6"
        strokeLinecap="round"
      />

      {/* Sacred AICTE Jyoti (Flame of Enlightenment) */}
      <path
        d="M32 11 C34.5 14, 36 17, 34 20 C33 21.5, 31 21.5, 30 20 C28 17, 29.5 14, 32 11 Z"
        fill={`url(#${uid}-gold)`}
        filter={`url(#${uid}-glow)`}
      />
      <circle
        cx="32"
        cy="18"
        r="1.6"
        fill={isDark ? '#FFFFFF' : '#FEF08A'}
      />

      {/* Live DPI Authority Pip (Top-Right Live Green Indicator) */}
      {showStatusDot && (
        <g>
          <circle cx="51" cy="13" r="4.5" fill="#10B981" />
          <circle cx="51" cy="13" r="1.8" fill="#FFFFFF" />
        </g>
      )}
    </svg>
  );

  // Variant: Icon Only
  if (variant === 'icon') {
    return (
      <div className={`relative inline-flex items-center justify-center shrink-0 ${className}`}>
        {renderEmblem()}
      </div>
    );
  }

  // Variant: Badge (Encapsulated in tactile medallion)
  if (variant === 'badge') {
    return (
      <div ref={containerRef} className={`relative inline-flex items-center ${className}`}>
        <div
          onClick={interactive ? () => setShowAdjuster(!showAdjuster) : undefined}
          className={`relative rounded-xl flex items-center justify-center shrink-0 transition-all duration-200 ${
            interactive ? 'cursor-pointer hover:scale-105 active:scale-95 group' : ''
          }`}
          style={{ width: `${pixelSize}px`, height: `${pixelSize}px` }}
          title={interactive ? "Click to adjust AICTE logo size & theme mode" : "AICTE Regulatory Insignia"}
        >
          {renderEmblem()}

          {/* Interactive Adjuster Badge Hint */}
          {interactive && (
            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity shadow-xs">
              <SlidersHorizontal className="w-2 h-2" />
            </div>
          )}
        </div>

        {/* Adjuster Popover Tool */}
        {interactive && showAdjuster && (
          <div
            className="absolute top-full left-0 mt-2 z-50 p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl min-w-[200px] text-xs space-y-2 animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between font-semibold text-slate-800 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-1.5">
              <span className="flex items-center gap-1.5 text-[11px]">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Logo Adjuster
              </span>
              <button
                onClick={() => setShowAdjuster(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 px-1 py-0.5 rounded text-[10px]"
              >
                ✕
              </button>
            </div>

            {/* Size Selector */}
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 mb-1">
                Size / आकार
              </div>
              <div className="grid grid-cols-4 gap-1">
                {(['sm', 'md', 'lg', 'xl'] as const).map((s) => (
                  <button
                    key={s}
                    onClick={(e) => handleSizeSelect(s, e)}
                    className={`px-1.5 py-1 rounded text-[10px] font-semibold uppercase transition-all ${
                      currentSize === s
                        ? 'bg-amber-500 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Theme Mode Selector */}
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 mb-1">
                Theme / मोड
              </div>
              <div className="grid grid-cols-3 gap-1">
                {(['auto', 'light', 'dark'] as const).map((m) => (
                  <button
                    key={m}
                    onClick={(e) => handleModeSelect(m, e)}
                    className={`flex items-center justify-center gap-1 px-1.5 py-1 rounded text-[10px] font-semibold capitalize transition-all ${
                      currentMode === m
                        ? 'bg-sky-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {m === 'light' && <Sun className="w-2.5 h-2.5 text-amber-400" />}
                    {m === 'dark' && <Moon className="w-2.5 h-2.5 text-sky-300" />}
                    {m}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Variant: Compact (Logo + Title)
  if (variant === 'compact') {
    return (
      <div className={`inline-flex items-center gap-2.5 ${className}`}>
        {renderEmblem()}
        <span className="font-bold text-sm tracking-tight text-[var(--text-primary)]">
          {title}
        </span>
      </div>
    );
  }

  // Variant: Letterhead (Centered Official Stationery Header for Orders & Notices)
  if (variant === 'letterhead') {
    return (
      <div className={`text-center space-y-2.5 ${className}`}>
        <div className="flex justify-center">
          <div
            className="rounded-2xl p-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md inline-block"
            style={{ width: `${pixelSize + 8}px`, height: `${pixelSize + 8}px` }}
          >
            {renderEmblem()}
          </div>
        </div>
        <div className="space-y-1">
          <div className="font-sans font-bold text-xs sm:text-sm text-slate-700 dark:text-slate-300 tracking-wider">
            अखिल भारतीय तकनीकी शिक्षा परिषद
          </div>
          <div className="font-serif font-extrabold text-sm sm:text-lg text-[var(--text-primary)] tracking-wide uppercase">
            ALL INDIA COUNCIL FOR TECHNICAL EDUCATION
          </div>
          <p className="text-xs text-[var(--text-secondary)] font-medium tracking-wide">
            (A Statutory Body Under Ministry of Education, Govt. of India)
          </p>
          <p className="text-[11px] text-[var(--text-muted)] font-mono">
            Nelson Mandela Marg, Vasant Kunj, New Delhi - 110070 • Telephone: 011-29581000 • www.aicte-india.org
          </p>
        </div>
      </div>
    );
  }

  // Default Variant: Full (Badge + Title + Subtitle)
  return (
    <div ref={containerRef} className={`relative flex items-center gap-2.5 min-w-0 ${className}`}>
      {/* Interactive / Static Emblem Badge */}
      <div
        onClick={interactive ? () => setShowAdjuster(!showAdjuster) : undefined}
        className={`relative shrink-0 rounded-xl transition-all duration-200 ${
          interactive ? 'cursor-pointer hover:scale-105 active:scale-95 group' : ''
        }`}
        style={{ width: `${pixelSize}px`, height: `${pixelSize}px` }}
        title={interactive ? "Click to adjust AICTE logo size & theme mode" : "AICTE Regulatory Insignia"}
      >
        {renderEmblem()}

        {/* Mini interactive icon */}
        {interactive && (
          <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity shadow-xs">
            <SlidersHorizontal className="w-2 h-2" />
          </div>
        )}
      </div>

      {/* Typography */}
      <div className="flex flex-col min-w-0">
        <span className="font-bold text-xs tracking-tight text-[var(--text-primary)] truncate">
          {title}
        </span>
        <span className="text-[10px] tracking-wider font-semibold text-[var(--text-muted)] uppercase truncate">
          {subtitle}
        </span>
      </div>

      {/* Adjuster Popover Tool */}
      {interactive && showAdjuster && (
        <div
          className="absolute top-full left-0 mt-2 z-50 p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl min-w-[200px] text-xs space-y-2 animate-in fade-in zoom-in-95 duration-150"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between font-semibold text-slate-800 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-1.5">
            <span className="flex items-center gap-1.5 text-[11px]">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Adjust Logo & Mode
            </span>
            <button
              onClick={() => setShowAdjuster(false)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 px-1 py-0.5 rounded text-[10px]"
            >
              ✕
            </button>
          </div>

          {/* Size Selector */}
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 mb-1">
              Logo Size
            </div>
            <div className="grid grid-cols-4 gap-1">
              {(['sm', 'md', 'lg', 'xl'] as const).map((s) => (
                <button
                  key={s}
                  onClick={(e) => handleSizeSelect(s, e)}
                  className={`px-1.5 py-1 rounded text-[10px] font-semibold uppercase transition-all ${
                    currentSize === s
                      ? 'bg-amber-500 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Theme Mode Selector */}
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 mb-1">
              Color Mode
            </div>
            <div className="grid grid-cols-3 gap-1">
              {(['auto', 'light', 'dark'] as const).map((m) => (
                <button
                  key={m}
                  onClick={(e) => handleModeSelect(m, e)}
                  className={`flex items-center justify-center gap-1 px-1.5 py-1 rounded text-[10px] font-semibold capitalize transition-all ${
                    currentMode === m
                      ? 'bg-sky-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {m === 'light' && <Sun className="w-2.5 h-2.5 text-amber-400" />}
                  {m === 'dark' && <Moon className="w-2.5 h-2.5 text-sky-300" />}
                  {m}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AICTELogo;
