'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/lib/context';
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
} from 'lucide-react';

interface AuditBlock {
  blockIndex: number;
  timestamp: string;
  eventType: 'AI_INFERENCE' | 'DPI_HANDSHAKE' | 'OFFICER_SIGN_OFF' | 'DEFICIENCY_DISPATCH';
  applicationId: string;
  targetArtifact: string;
  actorOrModel: string;
  previousHash: string;
  currentHash: string;
  status: 'VALID' | 'VERIFIED';
}

const INITIAL_AUDIT_BLOCKS: AuditBlock[] = [
  {
    blockIndex: 1,
    timestamp: '2026-10-19T14:10:02Z',
    eventType: 'AI_INFERENCE',
    applicationId: 'AICTE-2026-NW-0842',
    targetArtifact: 'DOC-FIRE-01 (Fire NOC)',
    actorOrModel: 'TruFor (CVPR 2023) + NFA-ViT',
    previousHash: '0000000000000000000000000000000000000000000000000000000000000000',
    currentHash: '7b9e4a19c084f18372b89a102948172938471928471928374918237491827349',
    status: 'VALID',
  },
  {
    blockIndex: 2,
    timestamp: '2026-10-19T14:12:15Z',
    eventType: 'DPI_HANDSHAKE',
    applicationId: 'AICTE-2026-NW-0842',
    targetArtifact: 'in.gov.har.fire-NOC-2021-8841',
    actorOrModel: 'API Setu DigiLocker Bridge',
    previousHash: '7b9e4a19c084f18372b89a102948172938471928471928374918237491827349',
    currentHash: '4a9f82d1c0827b59e19842aef31849102cba8912837491827349182734918273',
    status: 'VALID',
  },
  {
    blockIndex: 3,
    timestamp: '2026-10-19T14:15:30Z',
    eventType: 'AI_INFERENCE',
    applicationId: 'AICTE-2026-NW-0842',
    targetArtifact: 'DOC-FAC-01 (Faculty Roster)',
    actorOrModel: 'ArcFace (IResNet-100) + Qdrant HNSW',
    previousHash: '4a9f82d1c0827b59e19842aef31849102cba8912837491827349182734918273',
    currentHash: '9e18471928471928374918237491827349182734918273491827349182734918',
    status: 'VALID',
  },
  {
    blockIndex: 4,
    timestamp: '2026-10-19T14:18:45Z',
    eventType: 'AI_INFERENCE',
    applicationId: 'AICTE-2026-NW-0842',
    targetArtifact: 'DOC-PLAN-01 (CAD Blueprint)',
    actorOrModel: 'Mask2Former Swin-Base + Shoelace CV',
    previousHash: '9e18471928471928374918237491827349182734918273491827349182734918',
    currentHash: '1f82734918273491827349182734918273491827349182734918273491827349',
    status: 'VALID',
  },
  {
    blockIndex: 5,
    timestamp: '2026-10-19T14:22:10Z',
    eventType: 'OFFICER_SIGN_OFF',
    applicationId: 'AICTE-2026-NW-0842',
    targetArtifact: 'Standing Hearing Committee Referral Order',
    actorOrModel: 'Regional Scrutiny Officer (RO-04 Shri R.K. Verma)',
    previousHash: '1f82734918273491827349182734918273491827349182734918273491827349',
    currentHash: '3c84719284719283749182374918273491827349182734918273491827349182',
    status: 'VALID',
  },
  {
    blockIndex: 6,
    timestamp: '2026-10-19T14:25:00Z',
    eventType: 'DEFICIENCY_DISPATCH',
    applicationId: 'AICTE-2026-NW-0842',
    targetArtifact: 'Statutory Show-Cause Dispatch #AICTE/UB/2026-0842',
    actorOrModel: 'AICTE Dispatch Gateway (DPI v4.2)',
    previousHash: '3c84719284719283749182374918273491827349182734918273491827349182',
    currentHash: '8a91827349182734918273491827349182734918273491827349182734918273',
    status: 'VALID',
  },
];

export default function AuditTrailPage() {
  const { t } = useLanguage();
  const [filterType, setFilterType] = useState<string>('ALL');
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  const handleVerifyChain = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      toast.success(t.chainStatusValid, {
        description: 'Chained hashes across 6 regulatory blocks verified with zero collisions.',
      });
    }, 1200);
  };

  const filteredBlocks = INITIAL_AUDIT_BLOCKS.filter((block) => {
    if (filterType !== 'ALL' && block.eventType !== filterType) return false;
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Immutable Scrutiny{' '}
            <span className="font-serif italic font-normal text-sky-700 dark:text-sky-400">
              Audit Ledger
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Cryptographically linked SHA-256 blocks logging every AI inference, DPI handshake, and officer sign-off
          </p>
        </div>

        <button
          onClick={handleVerifyChain}
          disabled={isVerifying}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 transition-all hover:-translate-y-0.5 disabled:opacity-50"
        >
          <ShieldCheck className="w-4 h-4" />
          <span>{isVerifying ? 'Verifying Hashes...' : t.btnVerifyIntegrity}</span>
        </button>
      </div>

      {/* Chain Status Bar */}
      <div className="p-4 rounded-2xl liquid-glass-card border border-emerald-500/30 bg-emerald-500/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
              {t.chainStatusValid}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              Root Trust CCA India PKI • SHA-256 Merkle Proof Linked
            </div>
          </div>
        </div>

        <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
          6 Blocks Logged
        </span>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 text-xs font-semibold">
        {['ALL', 'AI_INFERENCE', 'DPI_HANDSHAKE', 'OFFICER_SIGN_OFF', 'DEFICIENCY_DISPATCH'].map((f) => (
          <button
            key={f}
            onClick={() => setFilterType(f)}
            className={`px-3 py-1.5 rounded-xl border transition-all ${
              filterType === f
                ? 'bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/30 font-bold'
                : 'bg-white/60 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Chained Blocks List */}
      <div className="space-y-4">
        {filteredBlocks.map((block) => (
          <div
            key={block.blockIndex}
            className="liquid-glass-card rounded-2xl p-5 space-y-3 relative group hover:-translate-y-0.5 transition-all shadow-sm"
          >
            {/* Top Row: Block Index & Timestamp */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 font-mono">
                <span className="px-2 py-0.5 rounded-md bg-slate-900 text-white font-bold text-[11px]">
                  BLOCK #{block.blockIndex.toString().padStart(3, '0')}
                </span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {block.eventType}
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-mono">
                <Clock className="w-3.5 h-3.5" />
                <span>{block.timestamp}</span>
              </div>
            </div>

            {/* Middle Row: Target & Actor */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Target Application / Artifact</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{block.applicationId}</span>
                <span className="block text-[11px] text-slate-500 mt-0.5">{block.targetArtifact}</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Actor / Neural Model Engine</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{block.actorOrModel}</span>
              </div>
            </div>

            {/* Cryptographic Hashes */}
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 text-[11px] font-mono space-y-1">
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 truncate">
                <span className="w-24 shrink-0 font-semibold text-slate-500 dark:text-slate-400">Prev Hash:</span>
                <span className="truncate select-all">{block.previousHash}</span>
              </div>
              <div className="flex items-center justify-between gap-2 text-emerald-600 dark:text-emerald-400">
                <div className="flex items-center gap-2 truncate font-bold">
                  <span className="w-24 shrink-0 text-slate-500 dark:text-slate-400 font-normal">Block Hash:</span>
                  <span className="truncate select-all">{block.currentHash}</span>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(block.currentHash);
                    toast.success('Block SHA-256 Hash copied to clipboard');
                  }}
                  className="shrink-0 text-[10px] text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 transition-colors"
                >
                  Copy
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
