'use client';

import React, { useState, useEffect } from 'react';
import { LeftGlassRail } from './LeftGlassRail';
import { FloatingTopHeader } from './FloatingTopHeader';
import { GlobalFilterBar } from './GlobalFilterBar';
import { CommandPalette } from './CommandPalette';

export function AppShellClient({ children }: { children: React.ReactNode }) {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="relative min-h-screen w-full selection:bg-sky-500/20 selection:text-sky-600 dark:selection:text-sky-300">
      {/* Ambient Optical Refraction Orbs Behind All Glass Surfaces */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-28 left-[18%] h-[460px] w-[680px] rounded-full bg-sky-400/15 dark:bg-sky-500/12 blur-[120px]" />
        <div className="absolute top-[28%] -right-24 h-[420px] w-[540px] rounded-full bg-indigo-500/12 dark:bg-indigo-500/12 blur-[130px]" />
        <div className="absolute -bottom-24 left-[35%] h-[380px] w-[580px] rounded-full bg-emerald-400/10 dark:bg-emerald-500/10 blur-[120px]" />
      </div>

      {/* Detached Floating Left Glass Dock */}
      <LeftGlassRail />

      {/* Main Spatial Workspace */}
      <div className="relative z-10 lg:pl-[268px] min-h-screen flex flex-col p-2.5 sm:p-3.5 lg:pr-4 lg:py-3.5">
        <FloatingTopHeader onOpenCommandPalette={() => setCommandPaletteOpen(true)} />
        <GlobalFilterBar />
        <main className="flex-1 animate-glass-in px-3 pb-8 max-w-[1600px] w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Command Palette Modal */}
      <CommandPalette isOpen={commandPaletteOpen} onClose={() => setCommandPaletteOpen(false)} />
    </div>
  );
}
