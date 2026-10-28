'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';
import AshokaEmblem from '@/components/brand/AshokaEmblem';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="liquid-glass-card rounded-3xl p-8 max-w-md w-full text-center space-y-4 shadow-xl border border-slate-200/90 dark:border-slate-800/90">
        <div className="flex justify-center">
          <div className="h-14 w-14 rounded-2xl glass-well flex items-center justify-center">
            <AshokaEmblem size={32} />
          </div>
        </div>

        <div className="space-y-1">
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
            Error 404 • Dossier Not Found
          </div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">
            Regulatory Record Unavailable
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            The requested institutional dossier, forensic report, or regulatory notice does not exist in the active APH 2024–27 registry.
          </p>
        </div>

        <div className="pt-2 flex items-center justify-center gap-3">
          <Link
            href="/overview"
            className="btn-liquid-primary px-4 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shadow-sm"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Return to Dashboard</span>
          </Link>
          <Link
            href="/applications"
            className="btn-liquid-secondary px-4 py-2 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 shadow-2xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Registry</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

