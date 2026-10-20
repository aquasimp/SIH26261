'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/lib/context';
import { toast } from 'sonner';
import {
  Network,
  Play,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Server,
  Lock,
  FileCode,
  ShieldCheck,
  Globe,
  Radio,
  Clock,
} from 'lucide-react';

export default function AuthorityBridgePage() {
  const { t, language } = useLanguage();

  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simulationStep, setSimulationStep] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'DIGILOCKER' | 'EPFO' | 'QR_CRYPTO'>('DIGILOCKER');

  // Trigger live handshake simulation
  const handleRunSimulation = () => {
    setIsSimulating(true);
    setSimulationStep(1);
    toast.info('Initiating OAuth 2.0 PKCE Handshake with API Setu Gateway...', { duration: 1500 });

    setTimeout(() => {
      setSimulationStep(2);
      toast.info('Computed x-digilocker-hmac SHA-256 digest with timestamp token', { duration: 1500 });
    }, 1200);

    setTimeout(() => {
      setSimulationStep(3);
      toast.info('Received Pull URI Response XML; decoding Base64 DataContent payload', { duration: 1500 });
    }, 2400);

    setTimeout(() => {
      setSimulationStep(4);
      setIsSimulating(false);
      toast.success('DPI Handshake Reconciled: 1 Mismatch Detected in Haryana Fire NOC Expiry Date', {
        description: 'Uploaded: 30-06-2027 vs Authoritative Record: 30-06-2024.',
      });
    }, 3600);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Title & Trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            National DPI{' '}
            <span className="font-serif italic font-normal text-sky-700 dark:text-sky-400">
              Authority Bridge
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time mutual TLS & OAuth 2.0 PKCE handshakes with DigiLocker, EPFO USSP, MCA21, and State e-NOCs
          </p>
        </div>

        <button
          onClick={handleRunSimulation}
          disabled={isSimulating}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-sky-600 hover:bg-sky-700 text-white shadow-md shadow-sky-600/20 transition-all hover:-translate-y-0.5 disabled:opacity-50"
        >
          {isSimulating ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>{t.simulatingHandshake}</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5" />
              <span>{t.btnRunSimulation}</span>
            </>
          )}
        </button>
      </div>

      {/* Live Handshake Simulation Stepper */}
      {simulationStep > 0 && (
        <div className="liquid-glass-card rounded-2xl p-4 border border-sky-500/30 bg-sky-500/5 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <RefreshCw className={`w-3.5 h-3.5 text-sky-600 ${isSimulating ? 'animate-spin' : ''}`} />
              <span>DPI Handshake Protocol Execution Pipeline</span>
            </span>
            <span className="font-mono text-[11px] font-bold text-sky-600 dark:text-sky-400">
              {simulationStep === 4 ? 'Handshake Complete (142ms total)' : `Step ${simulationStep} of 4 Active`}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs font-mono">
            <div className={`p-2.5 rounded-xl border transition-all ${
              simulationStep >= 1 ? 'bg-sky-500/10 border-sky-500/30 text-sky-800 dark:text-sky-200 font-bold' : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400'
            }`}>
              <div className="text-[10px] text-slate-400">Step 1</div>
              <div>OAuth 2.0 PKCE Challenge</div>
            </div>

            <div className={`p-2.5 rounded-xl border transition-all ${
              simulationStep >= 2 ? 'bg-sky-500/10 border-sky-500/30 text-sky-800 dark:text-sky-200 font-bold' : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400'
            }`}>
              <div className="text-[10px] text-slate-400">Step 2</div>
              <div>HMAC-SHA256 Token Digest</div>
            </div>

            <div className={`p-2.5 rounded-xl border transition-all ${
              simulationStep >= 3 ? 'bg-sky-500/10 border-sky-500/30 text-sky-800 dark:text-sky-200 font-bold' : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400'
            }`}>
              <div className="text-[10px] text-slate-400">Step 3</div>
              <div>Pull URI XML Decryption</div>
            </div>

            <div className={`p-2.5 rounded-xl border transition-all ${
              simulationStep >= 4 ? 'bg-red-500/10 border-red-500/30 text-red-700 dark:text-red-300 font-bold' : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400'
            }`}>
              <div className="text-[10px] text-slate-400">Step 4</div>
              <div>Field Reconciliation: Mismatch</div>
            </div>
          </div>
        </div>
      )}

      {/* 6-State Finite State Machine Indicator Pill Grid */}
      <div className="liquid-glass-card rounded-2xl p-4">
        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
          Deterministic Six-State Verification Protocol
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs font-mono text-center">
          <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-bold">
            VERIFIED
          </div>
          <div className="p-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-700 dark:text-red-400 font-bold">
            MISMATCH_DETECTED
          </div>
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 font-bold">
            EXPIRED
          </div>
          <div className="p-2 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-700 dark:text-sky-400 font-bold">
            VERIFICATION_PENDING
          </div>
          <div className="p-2 rounded-xl bg-slate-500/10 border border-slate-500/20 text-slate-700 dark:text-slate-300 font-bold">
            SOURCE_UNAVAILABLE
          </div>
          <div className="p-2 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-700 dark:text-violet-400 font-bold">
            MANUAL_REVIEW_REQ
          </div>
        </div>
      </div>


      {/* Main Console & Protocol Tabs */}
      <div className="liquid-glass-card rounded-2xl overflow-hidden shadow-sm">
        {/* Protocol Tabs */}
        <div className="p-3 border-b border-slate-200/80 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md flex flex-wrap items-center justify-between gap-3 text-xs font-semibold">
          <div className="inline-flex rounded-xl p-0.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setActiveTab('DIGILOCKER')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'DIGILOCKER'
                  ? 'bg-white dark:bg-slate-900 text-sky-700 dark:text-sky-400 shadow-2xs font-bold'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              DigiLocker / NAD Pull URI
            </button>
            <button
              onClick={() => setActiveTab('EPFO')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'EPFO'
                  ? 'bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-400 shadow-2xs font-bold'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              EPFO Shram Suvidha & ECR 2.0
            </button>
            <button
              onClick={() => setActiveTab('QR_CRYPTO')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'QR_CRYPTO'
                  ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-2xs font-bold'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              State e-District QR Verifier
            </button>
          </div>

          <div className="flex items-center gap-2 font-mono text-[11px] text-emerald-600 dark:text-emerald-400">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>mTLS 1.3 Established</span>
          </div>
        </div>

        {/* Console Content */}
        <div className="p-5 space-y-4">
          {activeTab === 'DIGILOCKER' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  Target URI: in.gov.maha.fire-NOC-2021-8841 (Haryana Directorate of Fire Services)
                </span>
                <span className="font-mono text-[11px] text-slate-400">Response Latency: 118ms</span>
              </div>

              {/* Live Payload Display */}
              <div className="p-4 rounded-xl bg-slate-950 text-slate-200 font-mono text-xs overflow-x-auto space-y-2 border border-slate-800">
                <div className="text-slate-500">
                  // Request Header: HMAC-SHA256 authenticated request payload
                </div>
                <div className="text-sky-400">
                  POST /pulldoc/v1/xml HTTP/1.1
                </div>
                <div className="text-slate-400">
                  Host: apisetu.gov.in
                  <br />
                  x-digilocker-hmac: 9b2d8471e9812903847291048172938471928471928374918237491827349182
                  <br />
                  x-digilocker-timestamp: 2026-10-19T14:15:22.091Z
                </div>
                <div className="text-slate-500 pt-2">
                  // Response Payload (Decoded DataContent XML)
                </div>
                <div className="text-emerald-400">
                  &lt;DocDetails&gt;
                  <br />
                  &nbsp;&nbsp;&lt;URI&gt;in.gov.har.fire-NOC-2021-8841&lt;/URI&gt;
                  <br />
                  &nbsp;&nbsp;&lt;IssuedTo&gt;Apex Institute of Technology & Management&lt;/IssuedTo&gt;
                  <br />
                  &nbsp;&nbsp;&lt;ValidUntil&gt;<span className="bg-red-900/60 text-red-200 px-1 rounded">30-06-2024</span>&lt;/ValidUntil&gt;
                  <br />
                  &nbsp;&nbsp;&lt;Status&gt;EXPIRED_NOT_RENEWED&lt;/Status&gt;
                  <br />
                  &lt;/DocDetails&gt;
                </div>
              </div>

              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 text-xs text-red-700 dark:text-red-300">
                <strong>Reconciliation Result:</strong> MISMATCH_DETECTED. The uploaded PDF claimed validity until 30-06-2027 (spliced), but authoritative state repository indicates statutory expiration on 30-06-2024.
              </div>
            </div>
          )}

          {activeTab === 'EPFO' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  Establishment Code: HR/GUR/0048192 (Apex Shikha Foundation)
                </span>
                <span className="font-mono text-[11px] text-slate-400">ECR 2.0 Real-time Bridge (164ms)</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 text-slate-200 font-mono text-xs overflow-x-auto space-y-2 border border-slate-800">
                <div className="text-slate-500">// EPFO Member Profile Query: UAN 100492817291 (Dr. Ramesh Chander Sharma)</div>
                <div className="text-sky-400">GET /epfo/v2/member/remittance-history/100492817291</div>
                <div className="text-emerald-400">
                  {`{
  "uan": "100492817291",
  "aadhaarFatVerified": true,
  "fatTimestamp": "2026-02-14T09:22:11Z",
  "activeRemittances": [
    {
      "establishmentCode": "HR/GUR/0048192",
      "establishmentName": "Apex Institute of Tech",
      "remittedMonths": ["2026-01", "2026-02"],
      "wageRule50Compliance": false
    },
    {
      "establishmentCode": "UP/NOI/0048192",
      "establishmentName": "Noida Institute of Engg (NIET)",
      "remittedMonths": ["2026-01", "2026-02"],
      "markExitDate": null
    }
  ]
}`}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 text-xs text-red-700 dark:text-red-300">
                <strong>EPF Scheme 2026 Para 20(1) Violation:</strong> Dual active concurrent remittances without Mark Exit recorded in e-SEWA portal. Flags CONCURRENT_GHOST_FACULTY across Haryana and UP institutions.
              </div>
            </div>
          )}

          {activeTab === 'QR_CRYPTO' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  2D QR Payload: Cryptographic Digital Signature Verification
                </span>
                <span className="font-mono text-[11px] text-slate-400">ECDSA secp256r1 (88ms)</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 text-slate-200 font-mono text-xs overflow-x-auto space-y-2 border border-slate-800">
                <div className="text-slate-500">// Public Key Infrastructure (PKI) X.509 State Root Trust Verification</div>
                <div className="text-emerald-400">
                  Signature Algorithm: ECDSA with SHA-256 (secp256r1)
                  <br />
                  Certificate Subject: CN=State e-District Signing Authority, O=Govt of Haryana
                  <br />
                  Public Key Fingerprint (SHA-256): e8:41:99:a2:10:44:81:72:91:04:22:81:99
                  <br />
                  Signature Status: VALID (Tamper-Free Cryptographic Payload)
                  <br />
                  FQDN Domain Check: edistrict.haryana.gov.in (Official Whitelist Match - NO SPOOFING)
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 text-xs text-emerald-700 dark:text-emerald-300">
                <strong>Cryptographic Integrity:</strong> The 2D QR matrix contains an authentic state signature confirming the original certificate issuance, but comparison with PDF body text reveals the document body text was doctored after export.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
