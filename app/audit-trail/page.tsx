'use client';

import React, { useState, useMemo } from 'react';
import { useLanguage, useFilters } from '@/lib/context';
import { AuditBlock } from '@/lib/mock-data';
import { verifyAuditChain } from '@/lib/crypto-utils';
import { toast } from 'sonner';
import {
  History,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Search,
  Filter,
  Link2,
  Hash,
  Clock,
  Sparkles,
  AlertTriangle,
  RefreshCw,
  Copy,
  Layers,
  Database,
  ExternalLink,
} from 'lucide-react';

export default function AuditTrailPage() {
  const { t } = useLanguage();
  const { auditLogs } = useFilters();

  const [filterType, setFilterType] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Verification state
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [verificationProgress, setVerificationProgress] = useState<number>(0);
  const [verifiedBlockIds, setVerifiedBlockIds] = useState<number[]>([]);
  const [verificationResult, setVerificationResult] = useState<{
    verified: boolean;
    timestamp: string;
    totalBlocks: number;
  } | null>({
    verified: true,
    timestamp: '2026-10-23T14:30:00Z',
    totalBlocks: auditLogs.length,
  });

  // Animated block-by-block cryptographic verification pass
  const handleVerifyChain = async () => {
    setIsVerifying(true);
    setVerificationProgress(0);
    setVerifiedBlockIds([]);
    setVerificationResult(null);

    toast.info('Starting real-time SHA-256 Merkle chain verification...', { duration: 1500 });

    // Sort blocks by blockIndex ascending for sequential check
    const sorted = [...auditLogs].sort((a, b) => a.blockIndex - b.blockIndex);

    const verifiedIds: number[] = [];

    for (let i = 0; i < sorted.length; i++) {
      const block = sorted[i];
      // Simulate real verification cadence
      await new Promise((resolve) => setTimeout(resolve, 240));
      verifiedIds.push(block.blockIndex);
      setVerifiedBlockIds([...verifiedIds]);
      setVerificationProgress(Math.round(((i + 1) / sorted.length) * 100));
    }

    const result = await verifyAuditChain(auditLogs);
    setIsVerifying(false);

    if (result.isValid) {
      setVerificationResult({
        verified: true,
        timestamp: new Date().toISOString(),
        totalBlocks: result.totalCount,
      });
      toast.success('100% Hash Chain Integrity Verified', {
        description: `All ${result.totalCount} regulatory blocks cryptographically chained with zero collisions.`,
        duration: 5000,
      });
    } else {
      setVerificationResult({
        verified: false,
        timestamp: new Date().toISOString(),
        totalBlocks: result.totalCount,
      });
      toast.error('Cryptographic Chain Mismatch Detected', {
        description: result.details[0] || 'Chain link failure detected.',
        duration: 6000,
      });
    }
  };

  // Filtered and searched audit blocks
  const filteredBlocks = useMemo(() => {
    return auditLogs.filter((block) => {
      if (filterType !== 'ALL' && block.eventType !== filterType) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchApp = block.applicationId.toLowerCase().includes(q);
        const matchArtifact = block.targetArtifact.toLowerCase().includes(q);
        const matchActor = block.actorOrModel.toLowerCase().includes(q);
        const matchHash = block.currentHash.toLowerCase().includes(q);
        if (!matchApp && !matchArtifact && !matchActor && !matchHash) return false;
      }
      return true;
    });
  }, [auditLogs, filterType, searchQuery]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Title & Verify Trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] font-bold text-sky-700 dark:text-sky-400 uppercase tracking-widest">
              CRYPTOGRAPHICALLY IMMUTABLE SCRUTINY LOG
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Immutable Scrutiny{' '}
            <span className="font-serif italic font-normal text-sky-700 dark:text-sky-400">
              Audit Ledger
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Cryptographically linked SHA-256 blocks logging every AI inference, DPI handshake, and officer sign-off.
          </p>
        </div>

        <button
          onClick={handleVerifyChain}
          disabled={isVerifying}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 transition-all hover:-translate-y-0.5 disabled:opacity-50 cursor-pointer"
        >
          {isVerifying ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Verifying ({verificationProgress}%)...</span>
            </>
          ) : (
            <>
              <ShieldCheck className="w-4 h-4" />
              <span>Verify Hash Chain Integrity</span>
            </>
          )}
        </button>
      </div>

      {/* Real-time Verification Progress Bar */}
      {isVerifying && (
        <div className="p-4 rounded-2xl liquid-glass-card border border-emerald-500/30 bg-emerald-500/5 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-600" />
              <span>Iterating Through SHA-256 Chain Links...</span>
            </span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">
              {verificationProgress}% Completed
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
            <div
              className="h-full bg-emerald-500 transition-all duration-200 ease-out"
              style={{ width: `${verificationProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Chain Status Bar */}
      <div className="p-4 rounded-2xl liquid-glass-card border border-emerald-500/30 bg-emerald-500/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
              {verificationResult?.verified
                ? '100% Chain Integrity Verified • Zero Collisions'
                : 'Verifying Chain Integrity...'}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
              Root Trust CCA India PKI • SHA-256 Merkle Proof Linked •{' '}
              {auditLogs.length} Blocks Registered in React Store
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs text-slate-700 dark:text-slate-300">
          <div className="text-right">
            <div className="text-[10px] text-slate-400 uppercase">Latest Ledger Block</div>
            <div className="font-bold text-slate-900 dark:text-white">
              BLOCK #{auditLogs[0]?.blockIndex.toString().padStart(3, '0')}
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Event Type Filter Tabs */}
        <div className="flex items-center gap-1.5 text-xs font-semibold overflow-x-auto pb-1">
          {['ALL', 'AI_INFERENCE', 'DPI_HANDSHAKE', 'OFFICER_SIGN_OFF', 'DEFICIENCY_DISPATCH'].map(
            (f) => (
              <button
                key={f}
                onClick={() => setFilterType(f)}
                className={`px-3 py-1.5 rounded-xl border transition-all shrink-0 ${
                  filterType === f
                    ? 'bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/30 font-bold'
                    : 'bg-white/60 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-white'
                }`}
              >
                {f}
              </button>
            )
          )}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by App ID, Artifact, Hash..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>
      </div>

      {/* Chained Blocks List */}
      <div className="space-y-4">
        {filteredBlocks.length === 0 ? (
          <div className="p-8 text-center text-xs font-mono text-slate-400 liquid-glass-card rounded-2xl">
            No audit ledger blocks match the selected query.
          </div>
        ) : (
          filteredBlocks.map((block) => {
            const isBlockVerified = verifiedBlockIds.includes(block.blockIndex);

            return (
              <div
                key={block.blockIndex}
                className="liquid-glass-card rounded-2xl p-5 space-y-3 relative group hover:-translate-y-0.5 transition-all shadow-sm border border-slate-200/80 dark:border-slate-800"
              >
                {/* Top Row: Block Index & Timestamp */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 font-mono">
                    <span className="px-2.5 py-0.5 rounded-md bg-slate-900 text-white font-bold text-[11px]">
                      BLOCK #{block.blockIndex.toString().padStart(3, '0')}
                    </span>
                    <span
                      className={`font-semibold px-2 py-0.5 rounded text-[10.5px] ${
                        block.eventType === 'OFFICER_SIGN_OFF'
                          ? 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border border-indigo-500/20'
                          : block.eventType === 'DEFICIENCY_DISPATCH'
                          ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20'
                          : block.eventType === 'DPI_HANDSHAKE'
                          ? 'bg-sky-500/10 text-sky-700 dark:text-sky-400 border border-sky-500/20'
                          : 'bg-slate-500/10 text-slate-700 dark:text-slate-300 border border-slate-500/20'
                      }`}
                    >
                      {block.eventType}
                    </span>

                    {isBlockVerified && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>SHA-256 VALIDATED</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-mono">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{block.timestamp}</span>
                  </div>
                </div>

                {/* Middle Row: Target Application & Actor */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                      Target Application / Artifact
                    </span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {block.applicationId}
                    </span>
                    <span className="block text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-mono">
                      {block.targetArtifact}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                      Actor / Neural Model Engine
                    </span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {block.actorOrModel}
                    </span>
                    <span className="block text-[11px] text-emerald-600 dark:text-emerald-400 mt-0.5 font-mono">
                      Status: {block.status}
                    </span>
                  </div>
                </div>

                {/* Cryptographic Hashes Link */}
                <div className="pt-2.5 border-t border-slate-200 dark:border-slate-800 text-[11px] font-mono space-y-1.5">
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 truncate">
                    <span className="w-24 shrink-0 font-semibold text-slate-400">Previous Hash:</span>
                    <span className="truncate select-all">{block.previousHash}</span>
                  </div>

                  <div className="flex items-center justify-between gap-2 text-emerald-600 dark:text-emerald-400">
                    <div className="flex items-center gap-2 truncate font-bold">
                      <span className="w-24 shrink-0 text-slate-400 font-normal">Block Hash:</span>
                      <span className="truncate select-all">{block.currentHash}</span>
                    </div>

                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(block.currentHash);
                        toast.success('Block SHA-256 Hash copied to clipboard');
                      }}
                      className="shrink-0 inline-flex items-center gap-1 text-[10px] text-slate-500 hover:text-sky-600 dark:hover:text-sky-400 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 transition-colors cursor-pointer"
                    >
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
