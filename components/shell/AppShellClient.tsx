'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import LeftGlassRail from './LeftGlassRail';
import FloatingTopHeader from './FloatingTopHeader';
import GlobalFilterBar from './GlobalFilterBar';
import CommandPalette from './CommandPalette';

export function AppShellClient({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden selection:bg-sky-500/20 selection:text-sky-700 dark:selection:text-sky-300">
      <LeftGlassRail mobileOpen={mobileMenuOpen} onCloseMobile={() => setMobileMenuOpen(false)} />

      <div className="relative z-10 lg:pl-[300px] lg:pr-5 lg:pt-5 lg:pb-6 min-h-screen flex flex-col gap-6 p-3 sm:p-4 w-full">
        <FloatingTopHeader onOpenMobileMenu={() => setMobileMenuOpen(true)} />
        {pathname === '/applications' && <GlobalFilterBar />}
        <main className="flex-1 w-full min-w-0 animate-glass-in">
          {children}
        </main>
      </div>

      <CommandPalette />
    </div>
  );
}

export default AppShellClient;
