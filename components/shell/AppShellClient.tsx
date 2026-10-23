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
    <div className="flex min-h-screen">
      {/* 256px (w-64) Fixed Left Rail */}
      <LeftGlassRail />

      {/* Main Workspace Area (Offset by 256px / 64 for left rail) */}
      <div className="flex-1 flex flex-col pl-64 min-w-0">
        {/* Floating Top Header */}
        <FloatingTopHeader onOpenCommandPalette={() => setCommandPaletteOpen(true)} />

        {/* Global Contextual Filter Bar */}
        <GlobalFilterBar />

        {/* High-Density Workstation Page Canvas Container */}
        <main className="flex-1 p-3.5 sm:p-4 max-w-[1600px] w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Command Palette Modal */}
      <CommandPalette isOpen={commandPaletteOpen} onClose={() => setCommandPaletteOpen(false)} />
    </div>
  );
}

