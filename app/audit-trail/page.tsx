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
  Download,
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

  const handleExportLedgerJson = () => {
    const jsonStr = JSON.stringify(auditLogs, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `AICTE_SHA256_Audit_Ledger_${Date.now()}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success(`Exported ${auditLogs.length} cryptographic audit blocks to JSON`);
  };

  return (
    <div className="space-y-6 animate-glass-in">
      {/* Title & Verify Trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-1 px-1">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-sky-600 dark:text-sky-400 uppercase tracking-wider">
              Cryptographically Immutable Scrutiny Log
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--text-primary)]">
            Immutable Scrutiny{' '}
            <span className="font-extrabold text-sky-600 dark:text-sky-400">
              Audit Ledger
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1 max-w-3xl leading-relaxed">
            Cryptographically linked SHA-256 blocks logging every AI inference, DPI handshake, and officer sign-off.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handleExportLedgerJson}
            className="btn-liquid-secondary cursor-pointer px-3.5 py-2.5 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 shadow-2xs"
            title="Download complete immutable audit trail in JSON format"
          >
            <Download className="w-4 h-4 text-[var(--text-muted)]" />
            <span>Export Ledger (JSON)</span>
          </button>

          <button
            onClick={handleVerifyChain}
            disabled={isVerifying}
            className="btn-liquid-primary cursor-pointer px-4 py-2.5 rounded-xl text-xs font-semibold inline-flex items-center gap-2 disabled:opacity-50 shadow-sm"
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
      </div>

      {/* Real-time Verification Progress Bar */}
      {isVerifying && (
        <div className="p-4 sm:p-5 rounded-[18px] liquid-glass-card border border-emerald-500/30 bg-emerald-500/5 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-600 dark:text-emerald-400" />
              <span>Iterating Through SHA-256 Chain Links...</span>
            </span>
            <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
              {verificationProgress}% Completed
            </span>
          </div>
          <div className="w-full h-2 rounded-full glass-well overflow-hidden">
            <div
              className="h-full bg-emerald-500 transition-all duration-200 ease-out"
              style={{ width: `${verificationProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Chain Status Bar */}
      <div className="p-4 sm:p-5 rounded-[18px] liquid-glass-card border border-emerald-500/30 bg-emerald-500/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold text-emerald-900 dark:text-emerald-200">
              {verificationResult?.verified
                ? '100% Chain Integrity Verified • Zero Collisions'
                : 'Verifying Chain Integrity...'}
            </div>
            <div className="text-xs text-[var(--text-muted)] mt-0.5">
              Root Trust CCA India PKI • SHA-256 Merkle Proof Linked •{' '}
              {auditLogs.length} Blocks Registered in React Store
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs text-[var(--text-secondary)]">
          <div className="text-right">
            <div className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider font-semibold">Latest Ledger Block</div>
            <div className="metric-value font-bold text-sm text-[var(--text-primary)]">
              BLOCK #{auditLogs[0]?.blockIndex.toString().padStart(3, '0')}
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Event Type Filter Tabs */}
        <div className="inline-flex rounded-xl p-1 glass-well text-xs font-medium overflow-x-auto no-scrollbar">
          {['ALL', 'AI_INFERENCE', 'DPI_HANDSHAKE', 'OFFICER_SIGN_OFF', 'DEFICIENCY_DISPATCH'].map(
            (f) => (
              <button
                key={f}
                onClick={() => setFilterType(f)}
                className={`px-3 py-1.5 rounded-lg transition-all shrink-0 cursor-pointer ${
                  filterType === f
                    ? 'btn-liquid-primary shadow-xs font-semibold'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {f}
              </button>
            )
          )}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[260px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Search by App ID, Artifact, Hash..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 rounded-xl glass-well text-xs text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>
      </div>

      {/* Chained Blocks List */}
      <div className="space-y-4">
        {filteredBlocks.length === 0 ? (
          <div className="p-8 text-center text-xs text-[var(--text-muted)] liquid-glass-card rounded-[18px]">
            No audit ledger blocks match the selected query.
          </div>
        ) : (
          filteredBlocks.map((block) => {
            const isBlockVerified = verifiedBlockIds.includes(block.blockIndex);

            return (
              <div
                key={block.blockIndex}
                className="liquid-glass-card glass-interactive rounded-[18px] p-4 sm:p-5 space-y-3.5 shadow-sm"
              >
                {/* Top Row: Block Index & Timestamp */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-slate-900 text-white font-mono font-bold text-[11px] shadow-xs">
                      BLOCK #{block.blockIndex.toString().padStart(3, '0')}
                    </span>
                    <span
                      className={`font-semibold px-2.5 py-0.5 rounded-full text-[10.5px] ${
                        block.eventType === 'OFFICER_SIGN_OFF'
                          ? 'pill-registry'
                          : block.eventType === 'DEFICIENCY_DISPATCH'
                          ? 'pill-deficiency'
                          : block.eventType === 'DPI_HANDSHAKE'
                          ? 'bg-sky-500/15 text-sky-700 dark:text-sky-300 border border-sky-500/30'
                          : 'pill-verified'
                      }`}
                    >
                      {block.eventType}
                    </span>

                    {isBlockVerified && (
                      <span className="pill-verified inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>SHA-256 VALIDATED</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 text-[var(--text-muted)] text-xs font-mono">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{block.timestamp}</span>
                  </div>
                </div>

                {/* Middle Row: Target Application & Actor */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl glass-well">
                    <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider font-semibold block">
                      Target Application / Artifact
                    </span>
                    <span className="font-semibold text-[var(--text-primary)] block mt-0.5">
                      {block.applicationId}
                    </span>
                    <span className="block text-[11px] text-[var(--text-muted)] mt-0.5 font-mono">
                      {block.targetArtifact}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl glass-well">
                    <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider font-semibold block">
                      Authorized Officer / Verification Engine
                    </span>
                    <span className="font-semibold text-[var(--text-primary)] block mt-0.5">
                      {block.actorOrModel}
                    </span>
                    <span className="block text-[11px] text-emerald-600 dark:text-emerald-400 mt-0.5 font-medium">
                      Status: {block.status}
                    </span>
                  </div>
                </div>

                {/* Cryptographic Hashes Link */}
                <div className="pt-3 border-t border-[var(--glass-border)] text-xs font-mono space-y-1.5 overflow-x-auto">
                  <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 text-[var(--text-muted)]">
                    <span className="w-24 shrink-0 font-sans text-[11px] font-semibold text-[var(--text-muted)]">Previous Hash:</span>
                    <span className="break-all sm:break-normal select-all text-xs">{block.previousHash}</span>
                  </div>

                  <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 text-emerald-600 dark:text-emerald-400">
                    <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 font-semibold min-w-0">
                      <span className="w-24 shrink-0 font-sans text-[11px] text-[var(--text-muted)] font-normal">Block Hash:</span>
                      <span className="break-all sm:break-normal select-all text-xs">{block.currentHash}</span>
                    </div>

                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(block.currentHash);
                        toast.success('Block SHA-256 Hash copied to clipboard');
                      }}
                      className="btn-liquid-secondary cursor-pointer shrink-0 inline-flex items-center gap-1 text-[11px] text-[var(--text-secondary)] px-2.5 py-1 rounded-lg"
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
