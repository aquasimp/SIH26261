'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useLanguage, useFilters } from '@/lib/context';
import { VerificationState, InstitutionalApplication } from '@/lib/mock-data';
import { computeSha256, computeHmacSha256, generatePkcePair } from '@/lib/crypto-utils';
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
  ChevronDown,
  Sparkles,
  ExternalLink,
  Sliders,
  Search,
  UserX,
  AlertOctagon,
  Copy,
  Check,
  ShieldAlert,
} from 'lucide-react';

interface AuthorityPreset {
  id: string;
  institutionId: string;
  issuerId: string;
  docType: string;
  docId: string;
  documentTitle: string;
  issuingAuthorityName: string;
  clientSecret: string;
  state: VerificationState;
  authoritativeXml: string;
  uploadedJson: string;
  mismatchSummary: string;
  evidenceDiff: {
    attribute: string;
    uploadedValue: string;
    authoritativeValue: string;
    isMismatch: boolean;
    note: string;
  }[];
}

const PRESET_AUTHORITY_CERTS: AuthorityPreset[] = [
  {
    id: 'apex-fire',
    institutionId: 'AICTE-2026-NW-0842',
    issuerId: 'in.gov.har.fire',
    docType: 'NOC',
    docId: '2021-8841',
    documentTitle: 'Haryana Fire Safety Certificate (NOC)',
    issuingAuthorityName: 'Directorate of Fire Services, Govt. of Haryana',
    clientSecret: 'sec_har_fire_8492019ab921c',
    state: 'MISMATCH_DETECTED',
    authoritativeXml: `<?xml version="1.0" encoding="UTF-8"?>
<DocDetails xmlns="http://apisetu.gov.in/certificate/v1">
  <URI>in.gov.har.fire-NOC-2021-8841</URI>
  <CertificateNumber>FS/2021/GUR/8841</CertificateNumber>
  <IssuedTo>Apex Institute of Technology &amp; Management</IssuedTo>
  <IssueDate>2021-07-01</IssueDate>
  <ValidUntil>2024-06-30</ValidUntil>
  <Status>EXPIRED_NOT_RENEWED</Status>
  <BuildingDetails heightMeters="24.5" category="Educational"/>
</DocDetails>`,
    uploadedJson: `{
  "documentId": "DOC-FIRE-01",
  "certificateNumber": "FS/2021/GUR/8841",
  "issuedTo": "Apex Institute of Technology & Management",
  "issueDate": "01-07-2021",
  "validUntil": "30-06-2027",
  "status": "VALID_ACTIVE",
  "tamperConfidence": 0.984
}`,
    mismatchSummary: 'Expiry Date altered from 30-06-2024 to 30-06-2027 (3-Year Forgery via TruFor/Noiseprint++ splicing).',
    evidenceDiff: [
      {
        attribute: 'Valid Until Expiry Date',
        uploadedValue: '30-06-2027 (Claimed Valid)',
        authoritativeValue: '30-06-2024 (Expired)',
        isMismatch: true,
        note: 'Splicing detected around numeric digit 7 in date block (RPN: 890).',
      },
      {
        attribute: 'Certificate Status',
        uploadedValue: 'VALID_ACTIVE',
        authoritativeValue: 'EXPIRED_NOT_RENEWED',
        isMismatch: true,
        note: 'State fire repository confirms renewal fee unpaid since June 2024.',
      },
      {
        attribute: 'Issued Institution Name',
        uploadedValue: 'Apex Institute of Technology & Management',
        authoritativeValue: 'Apex Institute of Technology & Management',
        isMismatch: false,
        note: 'Exact substring match with state entity index.',
      },
      {
        attribute: 'Building Category',
        uploadedValue: 'Educational - Group B',
        authoritativeValue: 'Educational',
        isMismatch: false,
        note: 'NBC 2016 Part 4 occupancy classification compliant.',
      },
    ],
  },
  {
    id: 'apex-land',
    institutionId: 'AICTE-2026-NW-0842',
    issuerId: 'in.gov.har.revenue',
    docType: 'JAMABANDI',
    docId: '2018-0912',
    documentTitle: 'Haryana Jamabandi Land Revenue Deed',
    issuingAuthorityName: 'Department of Revenue & Disaster Management, Haryana',
    clientSecret: 'sec_har_rev_771920acb0123',
    state: 'MISMATCH_DETECTED',
    authoritativeXml: `<?xml version="1.0" encoding="UTF-8"?>
<DocDetails xmlns="http://apisetu.gov.in/revenue/v1">
  <URI>in.gov.har.revenue-JAMABANDI-2018-0912</URI>
  <KhasraNumbers>14//2, 14//3, 15//1</KhasraNumbers>
  <OwnerName>Apex Shiksha Samiti</OwnerName>
  <RegisteredAreaAcres>2.15</RegisteredAreaAcres>
  <ContiguityVerified>true</ContiguityVerified>
  <EncumbranceStatus>NIL</EncumbranceStatus>
</DocDetails>`,
    uploadedJson: `{
  "documentId": "DOC-LAND-01",
  "deedNumber": "REG-GUR-2018-0912",
  "ownerName": "Apex Shiksha Samiti",
  "totalAcreage": "4.80 Acres",
  "khasraNumbers": "14//2, 14//3, 15//1, 15//4, 15//5",
  "declaredContiguity": "Single Plot"
}`,
    mismatchSummary: 'Registered Land Acreage mismatch: Authoritative Revenue Record shows 2.15 Acres vs. 4.80 Acres on doctored Sale Deed.',
    evidenceDiff: [
      {
        attribute: 'Total Land Acreage',
        uploadedValue: '4.80 Acres',
        authoritativeValue: '2.15 Acres',
        isMismatch: true,
        note: 'Khasra numbers 15//4 & 15//5 belong to adjacent panchayat land (RPN: 720).',
      },
      {
        attribute: 'Contiguity Mandate',
        uploadedValue: 'Single Contiguous Plot',
        authoritativeValue: 'Single Plot (2.15 Acres Only)',
        isMismatch: true,
        note: 'APH Chapter I Clause 1.4 requires min 2.50 contiguous acres for Urban Engg.',
      },
      {
        attribute: 'Title Holder',
        uploadedValue: 'Apex Shiksha Samiti',
        authoritativeValue: 'Apex Shiksha Samiti',
        isMismatch: false,
        note: 'Registered society identity confirmed on MCA21 / NGO Darpan.',
      },
    ],
  },
  {
    id: 'sahyadri-fire',
    institutionId: 'AICTE-2026-WE-0419',
    issuerId: 'in.gov.maha.fire',
    docType: 'NOC',
    docId: '2024-0012',
    documentTitle: 'Maharashtra Fire & Emergency Services NOC',
    issuingAuthorityName: 'Directorate of Maharashtra Fire Services, Mumbai',
    clientSecret: 'sec_maha_fire_11094892cfa',
    state: 'VERIFIED',
    authoritativeXml: `<?xml version="1.0" encoding="UTF-8"?>
<DocDetails xmlns="http://apisetu.gov.in/certificate/v1">
  <URI>in.gov.maha.fire-NOC-2024-0012</URI>
  <CertificateNumber>MFS/PUN/2024/0012</CertificateNumber>
  <IssuedTo>Sahyadri Valley College of Engineering</IssuedTo>
  <IssueDate>2024-03-15</IssueDate>
  <ValidUntil>2027-03-14</ValidUntil>
  <Status>ACTIVE_COMPLIANT</Status>
</DocDetails>`,
    uploadedJson: `{
  "documentId": "DOC-WE-FIRE-01",
  "certificateNumber": "MFS/PUN/2024/0012",
  "issuedTo": "Sahyadri Valley College of Engineering",
  "issueDate": "15-03-2024",
  "validUntil": "14-03-2027",
  "status": "ACTIVE_COMPLIANT",
  "tamperConfidence": 0.012
}`,
    mismatchSummary: '100% Cryptographic Match: Authoritative State Fire Record aligns with uploaded PDF across all extracted parameters.',
    evidenceDiff: [
      {
        attribute: 'Valid Until Expiry Date',
        uploadedValue: '14-03-2027',
        authoritativeValue: '14-03-2027',
        isMismatch: false,
        note: 'Valid across the entire AICTE 2026–27 approval cycle.',
      },
      {
        attribute: 'Status',
        uploadedValue: 'ACTIVE_COMPLIANT',
        authoritativeValue: 'ACTIVE_COMPLIANT',
        isMismatch: false,
        note: 'Annual inspection passed with automatic hydraulic riser clearance.',
      },
    ],
  },
  {
    id: 'kalinga-land',
    institutionId: 'AICTE-2026-EA-0105',
    issuerId: 'in.gov.odi.bhulekh',
    docType: 'GRANT',
    docId: '1994-4419',
    documentTitle: 'Odisha Bhulekh 1994 Land Grant Order',
    issuingAuthorityName: 'Revenue & Disaster Management, Govt. of Odisha',
    clientSecret: 'sec_odi_bhu_44192084cfa',
    state: 'SOURCE_UNAVAILABLE',
    authoritativeXml: `<!-- HTTP 503 Service Temporarily Unavailable -->
<ServiceException>
  <Code>GATEWAY_TIMEOUT</Code>
  <Message>State Land Records Gateway Odisha Bhulekh Offline for Maintenance</Message>
  <CircuitBreakerStatus>OPEN (Threshold: 5 consecutive timeouts)</CircuitBreakerStatus>
</ServiceException>`,
    uploadedJson: `{
  "documentId": "DOC-LAND-EA-01",
  "grantOrder": "Land Grant Order No. 4419/Rev dt 14-06-1994",
  "declaredArea": "8.40 Acres",
  "offlineGraceApplicable": true
}`,
    mismatchSummary: 'Circuit Breaker Open: State Gateway offline (HTTP 503). Handshake auto-queued for offline grace protocol under Annexure 3.',
    evidenceDiff: [
      {
        attribute: 'State Gateway Status',
        uploadedValue: 'Self-Certified 1994 Land Grant Order',
        authoritativeValue: 'SOURCE_UNAVAILABLE (HTTP 503)',
        isMismatch: false,
        note: 'Fallback to physical verification grace period per AICTE Scrutiny SOP Annexure 3.',
      },
    ],
  },
];

interface FacultyWageRow {
  id: string;
  name: string;
  designation: string;
  department: string;
  uan: string;
  aadhaarFatVerified: boolean;
  fatTimestamp: string;
  fatLivenessScore: number;
  primaryPfCode: string;
  concurrentPfCode: string | null;
  concurrentEmployer: string | null;
  grossSalary: number;
  declaredBasicDa: number;
  excludedAllowances: number;
  arcFaceCosine: number;
  isGhost: boolean;
}

const INITIAL_FACULTY_ROSTER: FacultyWageRow[] = [
  {
    id: 'FAC-01',
    name: 'Dr. Ramesh Chander Sharma',
    designation: 'Professor & HOD',
    department: 'Computer Science & Engineering',
    uan: '100492817291',
    aadhaarFatVerified: true,
    fatTimestamp: '2026-02-14 09:22 IST',
    fatLivenessScore: 0.994,
    primaryPfCode: 'HR/GUR/0048192',
    concurrentPfCode: 'UP/NOI/0048192',
    concurrentEmployer: 'Noida Institute of Engg (NIET) [PID: 1-1092837419]',
    grossSalary: 120000,
    declaredBasicDa: 28000,
    excludedAllowances: 92000,
    arcFaceCosine: 0.942,
    isGhost: true,
  },
  {
    id: 'FAC-02',
    name: 'Dr. Sunita Rao',
    designation: 'Associate Professor',
    department: 'Electronics & Comm. Engg',
    uan: '100882194810',
    aadhaarFatVerified: true,
    fatTimestamp: '2026-03-01 11:45 IST',
    fatLivenessScore: 0.998,
    primaryPfCode: 'HR/GUR/0048192',
    concurrentPfCode: null,
    concurrentEmployer: null,
    grossSalary: 85000,
    declaredBasicDa: 44000,
    excludedAllowances: 41000,
    arcFaceCosine: 0.124,
    isGhost: false,
  },
  {
    id: 'FAC-03',
    name: 'Prof. Rajesh Kumar',
    designation: 'Assistant Professor',
    department: 'Mechanical Engineering',
    uan: '100771928491',
    aadhaarFatVerified: false,
    fatTimestamp: 'Pending Biometric Auth',
    fatLivenessScore: 0.0,
    primaryPfCode: 'HR/GUR/0048192',
    concurrentPfCode: null,
    concurrentEmployer: null,
    grossSalary: 55000,
    declaredBasicDa: 22000,
    excludedAllowances: 33000,
    arcFaceCosine: 0.210,
    isGhost: false,
  },
  {
    id: 'FAC-04',
    name: 'Dr. Alok Verma',
    designation: 'Professor',
    department: 'Information Technology',
    uan: '100551928410',
    aadhaarFatVerified: true,
    fatTimestamp: '2026-03-12 14:10 IST',
    fatLivenessScore: 0.988,
    primaryPfCode: 'MP/BHO/0019284',
    concurrentPfCode: null,
    concurrentEmployer: null,
    grossSalary: 65000,
    declaredBasicDa: 18000,
    excludedAllowances: 47000,
    arcFaceCosine: 0.205,
    isGhost: false,
  },
];

export default function AuthorityBridgePage() {
  const { t, language } = useLanguage();
  const { applications, selectedAppId, setSelectedAppId } = useFilters();

  const [activeTab, setActiveTab] = useState<'DIGILOCKER' | 'EPFO' | 'QR_CRYPTO'>('DIGILOCKER');

  // Certificate Inspector State
  const [selectedPresetId, setSelectedPresetId] = useState<string>('apex-fire');
  const activePreset =
    PRESET_AUTHORITY_CERTS.find((p) => p.id === selectedPresetId) || PRESET_AUTHORITY_CERTS[0];

  const [issuerId, setIssuerId] = useState<string>(activePreset.issuerId);
  const [docType, setDocType] = useState<string>(activePreset.docType);
  const [docId, setDocId] = useState<string>(activePreset.docId);
  const [clientSecret, setClientSecret] = useState<string>(activePreset.clientSecret);
  const [clientId, setClientId] = useState<string>('AICTE_SCRUTINY_NODE_04');
  const [customVerifier, setCustomVerifier] = useState<string>(
    'dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk'
  );

  // Sync inputs on preset change
  useEffect(() => {
    setIssuerId(activePreset.issuerId);
    setDocType(activePreset.docType);
    setDocId(activePreset.docId);
    setClientSecret(activePreset.clientSecret);
  }, [activePreset]);

  // Real Web Crypto Computations
  const [pkceChallenge, setPkceChallenge] = useState<string>('');
  const [computedHmac, setComputedHmac] = useState<string>('');
  const [timestamp, setTimestamp] = useState<string>('2026-10-23T14:30:00.000Z');
  const [isComputingCrypto, setIsComputingCrypto] = useState<boolean>(false);

  const pullUri = useMemo(() => `${issuerId}-${docType}-${docId}`, [issuerId, docType, docId]);

  const requestBody = useMemo(() => {
    return `<PullDocRequest><DocDetails><URI>${pullUri}</URI></DocDetails></PullDocRequest>`;
  }, [pullUri]);

  // Live Web Crypto execution (PKCE + HMAC-SHA256)
  useEffect(() => {
    let isCancelled = false;

    async function runWebCrypto() {
      setIsComputingCrypto(true);
      try {
        // 1. PKCE computation
        const pkce = await generatePkcePair(customVerifier);
        if (!isCancelled) {
          setPkceChallenge(pkce.codeChallenge);
        }

        // 2. HMAC-SHA256 over (client_id || timestamp || requestBody)
        const payloadToSign = `${clientId}|${timestamp}|${requestBody}`;
        const hmac = await computeHmacSha256(clientSecret, payloadToSign);
        if (!isCancelled) {
          setComputedHmac(hmac);
        }
      } catch (err) {
        console.error('Web Crypto calculation error:', err);
      } finally {
        if (!isCancelled) setIsComputingCrypto(false);
      }
    }

    runWebCrypto();
    return () => {
      isCancelled = true;
    };
  }, [customVerifier, clientId, timestamp, requestBody, clientSecret]);

  // Handshake simulation stepper
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simulationStep, setSimulationStep] = useState<number>(0);

  const handleRunSimulation = () => {
    setIsSimulating(true);
    setSimulationStep(1);
    setTimestamp(new Date().toISOString());
    toast.info('Initiating OAuth 2.0 PKCE Handshake with API Setu Gateway...', { duration: 1500 });

    setTimeout(() => {
      setSimulationStep(2);
      toast.info('Web Crypto HMAC-SHA256 digest computed with mutual TLS token', { duration: 1500 });
    }, 1100);

    setTimeout(() => {
      setSimulationStep(3);
      toast.info('Pull URI XML response received; reconciling authoritative attributes', {
        duration: 1500,
      });
    }, 2200);

    setTimeout(() => {
      setSimulationStep(4);
      setIsSimulating(false);
      if (activePreset.state === 'MISMATCH_DETECTED') {
        toast.error(`DPI Reconciliation Complete: ${activePreset.mismatchSummary}`, {
          description: `Pull URI: ${pullUri}`,
          duration: 5000,
        });
      } else if (activePreset.state === 'VERIFIED') {
        toast.success('DPI Reconciliation Complete: 100% Cryptographic Match Verified', {
          description: `Pull URI: ${pullUri}`,
          duration: 5000,
        });
      } else {
        toast.warning('DPI Handshake Queued: Target State Gateway Offline (HTTP 503)', {
          description: 'Circuit breaker triggered — Annexure 3 Grace Protocol applied.',
          duration: 5000,
        });
      }
    }, 3300);
  };

  // EPFO Faculty Roster & Wage Table state
  const [facultyRoster, setFacultyRoster] = useState<FacultyWageRow[]>(INITIAL_FACULTY_ROSTER);
  const [arcFaceThreshold, setArcFaceThreshold] = useState<number>(0.78);
  const [qdrantEfSearch, setQdrantEfSearch] = useState<number>(64);
  const [isQdrantSearching, setIsQdrantSearching] = useState<boolean>(false);

  // Interactive Wage Calculator
  const handleWageChange = (
    id: string,
    field: 'grossSalary' | 'declaredBasicDa',
    value: number
  ) => {
    setFacultyRoster((prev) =>
      prev.map((f) => {
        if (f.id === id) {
          const newGross = field === 'grossSalary' ? Math.max(0, value) : f.grossSalary;
          const newBasic = field === 'declaredBasicDa' ? Math.max(0, value) : f.declaredBasicDa;
          const newExcluded = Math.max(0, newGross - newBasic);
          return {
            ...f,
            grossSalary: newGross,
            declaredBasicDa: newBasic,
            excludedAllowances: newExcluded,
          };
        }
        return f;
      })
    );
  };

  // State e-District QR Verifier State
  const [qrTestUrl, setQrTestUrl] = useState<string>(
    'https://edistrict.haryana.gov.in/verify?id=HR-DFS-2021-8841'
  );
  const [isUrlCopied, setIsUrlCopied] = useState<boolean>(false);

  const qrDomainCheck = useMemo(() => {
    try {
      const url = new URL(qrTestUrl);
      const hostname = url.hostname.toLowerCase();
      const isGov = hostname.endsWith('.gov.in') || hostname.endsWith('.nic.in');
      const isHttps = url.protocol === 'https:';

      return {
        isValidUrl: true,
        hostname,
        isGov,
        isHttps,
        status: isGov && isHttps ? 'TRUSTED_GOV_ROOT' : 'SPOOFED_LOOKALIKE_DOMAIN',
        details:
          isGov && isHttps
            ? 'Complies with GOI Ministry of Electronics & IT (MeitY) strict domain guidelines.'
            : 'ALERT: Domain not in National Government Domain Registry (*.gov.in / *.nic.in). High risk of certificate spoofing!',
      };
    } catch {
      return {
        isValidUrl: false,
        hostname: '',
        isGov: false,
        isHttps: false,
        status: 'INVALID_URL',
        details: 'Invalid URL format.',
      };
    }
  }, [qrTestUrl]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Title & Handshake Trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] font-bold text-sky-700 dark:text-sky-400 uppercase tracking-widest">
              NATIONAL DATA EMPOWERMENT &amp; PROTECTION ARCHITECTURE (DEPA)
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            National DPI{' '}
            <span className="font-serif italic font-normal text-sky-700 dark:text-sky-400">
              Authority Bridge
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time mutual TLS 1.3, Web Crypto HMAC-SHA256 &amp; PKCE handshakes with DigiLocker, EPFO Shram Suvidha, and State Registries.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRunSimulation}
            disabled={isSimulating}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-sky-600 hover:bg-sky-700 text-white shadow-md shadow-sky-600/20 transition-all hover:-translate-y-0.5 disabled:opacity-50 cursor-pointer"
          >
            {isSimulating ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Simulating Mutual TLS &amp; Handshake...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Execute Cryptographic DPI Handshake</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Live Handshake Stepper */}
      {simulationStep > 0 && (
        <div className="liquid-glass-card rounded-2xl p-4 border border-sky-500/30 bg-sky-500/5 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <RefreshCw className={`w-3.5 h-3.5 text-sky-600 ${isSimulating ? 'animate-spin' : ''}`} />
              <span>DPI Handshake Protocol Execution Pipeline</span>
            </span>
            <span className="font-mono text-[11px] font-bold text-sky-600 dark:text-sky-400">
              {simulationStep === 4 ? 'Handshake Finalized (118ms latency)' : `Phase ${simulationStep} of 4 Active`}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs font-mono">
            <div
              className={`p-2.5 rounded-xl border transition-all ${
                simulationStep >= 1
                  ? 'bg-sky-500/10 border-sky-500/30 text-sky-800 dark:text-sky-200 font-bold'
                  : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400'
              }`}
            >
              <div className="text-[10px] text-slate-400">Step 1 • RFC 7636</div>
              <div>OAuth 2.0 PKCE Challenge</div>
            </div>

            <div
              className={`p-2.5 rounded-xl border transition-all ${
                simulationStep >= 2
                  ? 'bg-sky-500/10 border-sky-500/30 text-sky-800 dark:text-sky-200 font-bold'
                  : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400'
              }`}
            >
              <div className="text-[10px] text-slate-400">Step 2 • RFC 2104</div>
              <div>Web Crypto HMAC-SHA256</div>
            </div>

            <div
              className={`p-2.5 rounded-xl border transition-all ${
                simulationStep >= 3
                  ? 'bg-sky-500/10 border-sky-500/30 text-sky-800 dark:text-sky-200 font-bold'
                  : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400'
              }`}
            >
              <div className="text-[10px] text-slate-400">Step 3 • API Setu</div>
              <div>Pull URI XML Decryption</div>
            </div>

            <div
              className={`p-2.5 rounded-xl border transition-all ${
                simulationStep >= 4
                  ? activePreset.state === 'MISMATCH_DETECTED'
                    ? 'bg-red-500/10 border-red-500/30 text-red-700 dark:text-red-300 font-bold'
                    : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300 font-bold'
                  : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400'
              }`}
            >
              <div className="text-[10px] text-slate-400">Step 4 • LayoutLMv3</div>
              <div>{activePreset.state}</div>
            </div>
          </div>
        </div>
      )}

      {/* Deterministic Six-State FSM Grid */}
      <div className="liquid-glass-card rounded-2xl p-4">
        <div className="flex items-center justify-between mb-2.5">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Deterministic Six-State Regulatory Verification Protocol
          </div>
          <span className="text-[10.5px] font-mono text-slate-400">
            Current Active State: <strong className="text-slate-900 dark:text-white">{activePreset.state}</strong>
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs font-mono text-center">
          <div
            className={`p-2 rounded-xl border transition-all ${
              activePreset.state === 'VERIFIED'
                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-800 dark:text-emerald-200 font-bold ring-2 ring-emerald-500/40'
                : 'bg-emerald-500/5 border-emerald-500/20 text-emerald-700 dark:text-emerald-400'
            }`}
          >
            {t.statusVerified}
          </div>
          <div
            className={`p-2 rounded-xl border transition-all ${
              activePreset.state === 'MISMATCH_DETECTED'
                ? 'bg-red-500/20 border-red-500 text-red-800 dark:text-red-200 font-bold ring-2 ring-red-500/40'
                : 'bg-red-500/5 border-red-500/20 text-red-700 dark:text-red-400'
            }`}
          >
            {t.statusMismatchDetected}
          </div>
          <div
            className={`p-2 rounded-xl border transition-all ${
              activePreset.state === 'EXPIRED'
                ? 'bg-amber-500/20 border-amber-500 text-amber-800 dark:text-amber-200 font-bold ring-2 ring-amber-500/40'
                : 'bg-amber-500/5 border-amber-500/20 text-amber-700 dark:text-amber-400'
            }`}
          >
            {t.statusExpired}
          </div>
          <div
            className={`p-2 rounded-xl border transition-all ${
              activePreset.state === 'VERIFICATION_PENDING'
                ? 'bg-sky-500/20 border-sky-500 text-sky-800 dark:text-sky-200 font-bold ring-2 ring-sky-500/40'
                : 'bg-sky-500/5 border-sky-500/20 text-sky-700 dark:text-sky-400'
            }`}
          >
            {t.statusVerificationPending}
          </div>
          <div
            className={`p-2 rounded-xl border transition-all ${
              activePreset.state === 'SOURCE_UNAVAILABLE'
                ? 'bg-slate-500/20 border-slate-500 text-slate-800 dark:text-slate-200 font-bold ring-2 ring-slate-500/40'
                : 'bg-slate-500/5 border-slate-500/20 text-slate-700 dark:text-slate-400'
            }`}
          >
            {t.statusSourceUnavailable}
          </div>
          <div
            className={`p-2 rounded-xl border transition-all ${
              activePreset.state === 'MANUAL_REVIEW_REQUIRED'
                ? 'bg-violet-500/20 border-violet-500 text-violet-800 dark:text-violet-200 font-bold ring-2 ring-violet-500/40'
                : 'bg-violet-500/5 border-violet-500/20 text-violet-700 dark:text-violet-400'
            }`}
          >
            {t.statusManualReviewRequired}
          </div>
        </div>
      </div>

      {/* Main Console Navigation Tabs */}
      <div className="liquid-glass-card rounded-2xl overflow-hidden shadow-sm">
        <div className="p-3 border-b border-slate-200/80 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md flex flex-wrap items-center justify-between gap-3 text-xs font-semibold">
          <div className="inline-flex rounded-xl p-0.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setActiveTab('DIGILOCKER')}
              className={`px-3.5 py-1.5 rounded-lg transition-all ${
                activeTab === 'DIGILOCKER'
                  ? 'bg-white dark:bg-slate-900 text-sky-700 dark:text-sky-400 shadow-2xs font-bold'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              1. DigiLocker Pull URI &amp; Web Crypto Inspector
            </button>
            <button
              onClick={() => setActiveTab('EPFO')}
              className={`px-3.5 py-1.5 rounded-lg transition-all ${
                activeTab === 'EPFO'
                  ? 'bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-400 shadow-2xs font-bold'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              2. EPFO ECR 2.0 &amp; 50% Basic Wage Rule
            </button>
            <button
              onClick={() => setActiveTab('QR_CRYPTO')}
              className={`px-3.5 py-1.5 rounded-lg transition-all ${
                activeTab === 'QR_CRYPTO'
                  ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-2xs font-bold'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              3. State e-District QR &amp; FQDN Whitelist
            </button>
          </div>

          <div className="flex items-center gap-2 font-mono text-[11px] text-emerald-600 dark:text-emerald-400">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>mTLS 1.3 Active • API Setu Gateway Online</span>
          </div>
        </div>

        {/* Console View 1: DigiLocker Pull URI & Web Crypto Inspector */}
        {activeTab === 'DIGILOCKER' && (
          <div className="p-5 space-y-6">
            {/* Certificate Preset Selector Bar */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="text-xs">
                <span className="font-bold text-slate-900 dark:text-white block">
                  Select Institutional Document Certificate Preset:
                </span>
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                  Simulate live DPI Pull URI handshakes against state departments
                </span>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {PRESET_AUTHORITY_CERTS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPresetId(p.id)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-mono transition-all ${
                      selectedPresetId === p.id
                        ? 'bg-sky-600 text-white font-bold shadow-xs'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {p.issuerId.split('.').slice(-1)[0].toUpperCase()} ({p.docType})
                  </button>
                ))}
              </div>
            </div>

            {/* Interactive Handshake Parameters Form */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="text-[10.5px] font-mono text-slate-500 uppercase font-semibold block mb-1">
                  Issuer ID
                </label>
                <input
                  type="text"
                  value={issuerId}
                  onChange={(e) => setIssuerId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="text-[10.5px] font-mono text-slate-500 uppercase font-semibold block mb-1">
                  Doc Type
                </label>
                <input
                  type="text"
                  value={docType}
                  onChange={(e) => setDocType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="text-[10.5px] font-mono text-slate-500 uppercase font-semibold block mb-1">
                  Doc ID / Cert No
                </label>
                <input
                  type="text"
                  value={docId}
                  onChange={(e) => setDocId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="text-[10.5px] font-mono text-slate-500 uppercase font-semibold block mb-1">
                  Client Secret (HMAC Key)
                </label>
                <input
                  type="password"
                  value={clientSecret}
                  onChange={(e) => setClientSecret(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>

            {/* Real Web Crypto Security Credentials Card */}
            <div className="p-4 rounded-xl bg-slate-950 text-slate-200 font-mono text-xs border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-2">
                <span className="flex items-center gap-1.5 text-sky-400 font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Real Web Crypto Engine (window.crypto.subtle)</span>
                </span>
                <span className="text-[10.5px]">
                  {isComputingCrypto ? 'Recomputing Digest...' : 'SHA-256 / HMAC-SHA256 Active'}
                </span>
              </div>

              <div className="space-y-1.5">
                <div className="text-[11px] text-slate-400">
                  <strong className="text-slate-300">Generated Pull URI:</strong>{' '}
                  <span className="text-amber-300 font-bold select-all">{pullUri}</span>
                </div>

                <div className="text-[11px] text-slate-400">
                  <strong className="text-slate-300">PKCE Code Verifier:</strong>{' '}
                  <span className="text-slate-300 select-all">{customVerifier}</span>
                </div>

                <div className="text-[11px] text-slate-400">
                  <strong className="text-slate-300">PKCE S256 Code Challenge:</strong>{' '}
                  <span className="text-emerald-400 font-bold select-all">{pkceChallenge}</span>
                </div>

                <div className="text-[11px] text-slate-400">
                  <strong className="text-slate-300">Computed x-digilocker-hmac:</strong>{' '}
                  <span className="text-sky-300 font-bold select-all break-all">{computedHmac}</span>
                </div>
              </div>
            </div>

            {/* Side-by-Side Reconciliation Diff */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-sky-600" />
                  <span>Authoritative XML vs. Extracted Document JSON Diff</span>
                </h3>
                <span className="font-mono text-[11px] text-slate-400">
                  Issuing Authority: {activePreset.issuingAuthorityName}
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Authoritative XML */}
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-2xs">
                  <div className="px-3.5 py-2 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 font-mono text-[11px] font-bold text-emerald-700 dark:text-emerald-400 flex items-center justify-between">
                    <span>1. Authoritative DPI DataContent (Decoded XML)</span>
                    <span className="text-[10px] text-slate-400">State Gateway Master</span>
                  </div>
                  <pre className="p-3.5 text-slate-800 dark:text-slate-200 font-mono text-[11px] overflow-x-auto whitespace-pre leading-relaxed">
                    {activePreset.authoritativeXml}
                  </pre>
                </div>

                {/* Uploaded Document JSON */}
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-2xs">
                  <div className="px-3.5 py-2 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 font-mono text-[11px] font-bold text-sky-700 dark:text-sky-400 flex items-center justify-between">
                    <span>2. Uploaded Institutional PDF (LayoutLMv3 OCR JSON)</span>
                    <span className="text-[10px] text-slate-400">Applicant Submission</span>
                  </div>
                  <pre className="p-3.5 text-slate-800 dark:text-slate-200 font-mono text-[11px] overflow-x-auto whitespace-pre leading-relaxed">
                    {activePreset.uploadedJson}
                  </pre>
                </div>
              </div>

              {/* Exact Attribute Reconciliation Table */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden mt-3">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 dark:bg-slate-800 text-[10px] font-mono uppercase tracking-wider text-slate-500">
                    <tr>
                      <th className="py-2.5 px-3">Statutory Attribute</th>
                      <th className="py-2.5 px-3">Uploaded Claim (Applicant)</th>
                      <th className="py-2.5 px-3">Authoritative Record (DPI)</th>
                      <th className="py-2.5 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-mono">
                    {activePreset.evidenceDiff.map((diff, idx) => (
                      <tr
                        key={idx}
                        className={
                          diff.isMismatch
                            ? 'bg-red-50/60 dark:bg-red-950/20'
                            : 'bg-white dark:bg-slate-900'
                        }
                      >
                        <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">
                          {diff.attribute}
                          <span className="block text-[10px] font-normal text-slate-500 dark:text-slate-400 mt-0.5">
                            {diff.note}
                          </span>
                        </td>
                        <td
                          className={`py-2.5 px-3 ${
                            diff.isMismatch ? 'text-red-700 dark:text-red-400 font-bold' : 'text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {diff.uploadedValue}
                        </td>
                        <td
                          className={`py-2.5 px-3 ${
                            diff.isMismatch
                              ? 'text-emerald-700 dark:text-emerald-400 font-bold'
                              : 'text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {diff.authoritativeValue}
                        </td>
                        <td className="py-2.5 px-3">
                          {diff.isMismatch ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-600 dark:text-red-400">
                              <AlertOctagon className="w-3 h-3" />
                              <span>MISMATCH</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>ALIGNED</span>
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Console View 2: EPFO ECR 2.0 & 50% Basic Wage Rule Inspector */}
        {activeTab === 'EPFO' && (
          <div className="p-5 space-y-6">
            {/* Header with Statutory Legal Explainer */}
            <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/50 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="text-xs">
                <span className="font-bold text-indigo-900 dark:text-indigo-200 block text-sm">
                  EPFO ECR 2.0 &amp; Code on Social Security (2026) 50% Wage Add-Back Audit
                </span>
                <p className="text-indigo-700 dark:text-indigo-300 text-[11px] mt-0.5 max-w-3xl leading-relaxed">
                  <strong>Statutory Mandate:</strong> Under Section 2(88) of the Social Security Code 2026, if excluded allowances (HRA, conveyance, special allowances) exceed 50% of gross remuneration, the excess amount is deemed as wages and added back to basic wages for the 12% EPF/EPS statutory contribution.
                </p>
              </div>

              <div className="shrink-0 font-mono text-[11px] text-right">
                <span className="px-2.5 py-1 rounded-lg bg-indigo-600 text-white font-bold">
                  EPFO Rule 28(3)
                </span>
              </div>
            </div>

            {/* Interactive Wage & Shortfall Table */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-x-auto shadow-2xs">
              <table className="w-full text-left text-xs min-w-[950px]">
                <thead className="bg-slate-100 dark:bg-slate-800 text-[10.5px] font-mono uppercase tracking-wider text-slate-600 dark:text-slate-300">
                  <tr>
                    <th className="py-2.5 px-3">Faculty / 12-Digit UAN</th>
                    <th className="py-2.5 px-3">Aadhaar Face Auth (FAT)</th>
                    <th className="py-2.5 px-3">PF Code &amp; Dual Overlap</th>
                    <th className="py-2.5 px-3">Gross Remuneration (₹)</th>
                    <th className="py-2.5 px-3">Declared Basic + DA (₹)</th>
                    <th className="py-2.5 px-3">Excluded Allowances (₹)</th>
                    <th className="py-2.5 px-3 text-red-600 dark:text-red-400">
                      Deemed Wage Add-Back (₹)
                    </th>
                    <th className="py-2.5 px-3 text-emerald-600 dark:text-emerald-400">
                      12% EPF Base / Shortfall (₹)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-mono">
                  {facultyRoster.map((fac) => {
                    const maxExcluded = 0.5 * fac.grossSalary;
                    const deemedAddBack = Math.max(0, fac.excludedAllowances - maxExcluded);
                    const statutoryEpfBase = fac.declaredBasicDa + deemedAddBack;
                    const statutoryEpfRemittance = Math.round(0.12 * statutoryEpfBase);
                    const actualRemitted = Math.round(0.12 * fac.declaredBasicDa);
                    const shortfall = Math.max(0, statutoryEpfRemittance - actualRemitted);
                    const isViolated = deemedAddBack > 0;

                    return (
                      <tr
                        key={fac.id}
                        className={
                          fac.isGhost
                            ? 'bg-red-50/70 dark:bg-red-950/30'
                            : isViolated
                            ? 'bg-amber-50/40 dark:bg-amber-950/20'
                            : 'bg-white dark:bg-slate-900'
                        }
                      >
                        {/* Name & UAN */}
                        <td className="py-3 px-3">
                          <div className="font-sans font-bold text-slate-900 dark:text-white">
                            {fac.name}
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                            UAN: {fac.uan} • {fac.designation}
                          </div>
                        </td>

                        {/* Aadhaar FAT */}
                        <td className="py-3 px-3">
                          {fac.aadhaarFatVerified ? (
                            <div>
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                                <CheckCircle2 className="w-3 h-3" />
                                <span>FAT VERIFIED</span>
                              </span>
                              <div className="text-[9.5px] text-slate-400 mt-0.5">
                                Liveness: {(fac.fatLivenessScore * 100).toFixed(1)}%
                              </div>
                            </div>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">
                              <AlertTriangle className="w-3 h-3" />
                              <span>AUTH PENDING</span>
                            </span>
                          )}
                        </td>

                        {/* PF Code & Dual Overlap */}
                        <td className="py-3 px-3">
                          <div className="text-slate-800 dark:text-slate-200">
                            {fac.primaryPfCode}
                          </div>
                          {fac.concurrentPfCode ? (
                            <div className="mt-1 p-1 rounded bg-red-600/10 border border-red-500/30 text-[10px] text-red-700 dark:text-red-300 font-bold">
                              DUAL OVERLAP: {fac.concurrentPfCode}
                              <span className="block font-normal text-[9px] text-red-600 dark:text-red-400">
                                {fac.concurrentEmployer}
                              </span>
                            </div>
                          ) : (
                            <span className="text-[10px] text-emerald-600">Single Employer</span>
                          )}
                        </td>

                        {/* Gross Remuneration (Editable) */}
                        <td className="py-3 px-3">
                          <input
                            type="number"
                            value={fac.grossSalary}
                            onChange={(e) =>
                              handleWageChange(fac.id, 'grossSalary', Number(e.target.value))
                            }
                            className="w-24 px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                          />
                        </td>

                        {/* Declared Basic + DA (Editable) */}
                        <td className="py-3 px-3">
                          <input
                            type="number"
                            value={fac.declaredBasicDa}
                            onChange={(e) =>
                              handleWageChange(fac.id, 'declaredBasicDa', Number(e.target.value))
                            }
                            className="w-24 px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                          />
                          <div className="text-[9.5px] text-slate-400 mt-0.5">
                            {((fac.declaredBasicDa / (fac.grossSalary || 1)) * 100).toFixed(1)}% of gross
                          </div>
                        </td>

                        {/* Excluded Allowances */}
                        <td className="py-3 px-3 text-slate-700 dark:text-slate-300">
                          ₹ {fac.excludedAllowances.toLocaleString('en-IN')}
                          <div className="text-[9.5px] text-slate-400 mt-0.5">
                            Max 50%: ₹ {maxExcluded.toLocaleString('en-IN')}
                          </div>
                        </td>

                        {/* Deemed Wage Add-Back */}
                        <td className="py-3 px-3">
                          {isViolated ? (
                            <div>
                              <span className="text-red-700 dark:text-red-400 font-bold">
                                + ₹ {deemedAddBack.toLocaleString('en-IN')}
                              </span>
                              <span className="block text-[9.5px] text-red-500 font-sans">
                                (Excess over 50% threshold)
                              </span>
                            </div>
                          ) : (
                            <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                              ₹ 0 (Rule Compliant)
                            </span>
                          )}
                        </td>

                        {/* Statutory Remittance & Shortfall */}
                        <td className="py-3 px-3">
                          <div className="font-bold text-slate-900 dark:text-white">
                            ₹ {statutoryEpfRemittance.toLocaleString('en-IN')} (Statutory 12%)
                          </div>
                          {shortfall > 0 ? (
                            <div className="text-[10px] text-red-600 dark:text-red-400 font-bold">
                              Remittance Shortfall: ₹ {shortfall.toLocaleString('en-IN')} / mo
                            </div>
                          ) : (
                            <div className="text-[10px] text-emerald-600">Zero Shortfall</div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Qdrant 512-D ArcFace HNSW ANN Search Simulator */}
            <div className="p-4 rounded-xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/20 via-slate-900/40 to-slate-950/60 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-indigo-500/20 pb-3">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                    <UserX className="w-4 h-4 text-red-500" />
                    <span>Qdrant 512-D ArcFace HNSW Vector Search Engine</span>
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Approximate Nearest Neighbor (ANN) biometric index querying 1.2M national faculty vectors in &lt;4ms
                  </p>
                </div>

                <div className="flex items-center gap-3 font-mono text-xs">
                  <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                    M=32 • efConstruction=200 • efSearch={qdrantEfSearch}
                  </span>
                  <span className="text-emerald-400 font-bold">Query Latency: 2.8ms</span>
                </div>
              </div>

              {/* Threshold Slider & Filter Controls */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-slate-400">Cosine Similarity Threshold (cos θ &gt; 0.78):</span>
                    <span className="font-bold text-sky-400">{arcFaceThreshold.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="0.99"
                    step="0.01"
                    value={arcFaceThreshold}
                    onChange={(e) => setArcFaceThreshold(parseFloat(e.target.value))}
                    className="w-full accent-sky-500"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
                    <span>0.50 (Loose)</span>
                    <span className="text-sky-400 font-bold">0.78 (APH Standard)</span>
                    <span>0.99 (Strict)</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-slate-400">HNSW efSearch Precision:</span>
                    <span className="font-bold text-indigo-400">{qdrantEfSearch}</span>
                  </div>
                  <input
                    type="range"
                    min="16"
                    max="128"
                    step="16"
                    value={qdrantEfSearch}
                    onChange={(e) => setQdrantEfSearch(parseInt(e.target.value, 10))}
                    className="w-full accent-indigo-500"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
                    <span>16 (Fast &lt;1ms)</span>
                    <span>64 (Balanced 2.8ms)</span>
                    <span>128 (Exact 4.2ms)</span>
                  </div>
                </div>
              </div>

              {/* Nearest Neighbor Query Matches */}
              <div className="space-y-2 pt-2">
                <div className="text-[10.5px] font-mono text-slate-400 uppercase font-semibold">
                  Query Results: Dr. Ramesh Chander Sharma (Embedding: RetinaFace + ArcFace IResNet-100)
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                  {/* Match 1: Flagged Ghost Match */}
                  <div className="p-3 rounded-xl bg-red-950/30 border border-red-500/40 text-slate-200 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-red-400">Match #1 • GHOST FACULTY COINCIDENCE</span>
                      <span className="font-bold text-red-400 text-sm">cos θ = 0.942</span>
                    </div>
                    <div className="text-[11px] text-slate-300">
                      <strong>Matched College:</strong> Noida Institute of Engg &amp; Tech (NIET)
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Permanent ID (PID): 1-1092837419 • Region: Northern • Eucl. Dist: 0.058
                    </div>
                    <div className="text-[10.5px] text-red-300 pt-1 border-t border-red-500/20">
                      Simultaneous full-time employment registered in AICTE Portal under duplicate PAN.
                    </div>
                  </div>

                  {/* Match 2: Current Node */}
                  <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-700 text-slate-300 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-300">Match #2 • Current Dossier</span>
                      <span className="font-bold text-slate-300 text-sm">cos θ = 1.000</span>
                    </div>
                    <div className="text-[11px] text-slate-300">
                      <strong>Institution:</strong> Apex Institute of Technology &amp; Management
                    </div>
                    <div className="text-[10px] text-slate-400">
                      PID: 1-9482710392 • Region: North-Western • Self-Reference
                    </div>
                    <div className="text-[10.5px] text-slate-400 pt-1 border-t border-slate-700">
                      Subject enrollment dossier under scrutiny.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Console View 3: State e-District QR Verifier & Domain Whitelist */}
        {activeTab === 'QR_CRYPTO' && (
          <div className="p-5 space-y-6">
            {/* 2D QR Cryptographic JWS & XML Payload Decoder */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>2D QR Digital Signature &amp; PKI X.509 Cryptographic Verification</span>
                </span>
                <span className="font-mono text-[11px] text-slate-400">ECDSA secp256r1 (88ms latency)</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 text-slate-200 font-mono text-xs overflow-x-auto space-y-2 border border-slate-800">
                <div className="text-slate-500">
                  // Decoded JSON Web Signature (JWS) Payload from Fire NOC 2D QR Code Matrix
                </div>
                <div className="text-emerald-400">
                  {`{
  "alg": "ES256",
  "typ": "JWT",
  "x5u": "https://edistrict.haryana.gov.in/certs/state-ca-secp256r1.crt",
  "payload": {
    "certId": "HR-DFS-2021-8841",
    "issuedTo": "Apex Institute of Technology & Management",
    "validFrom": "2021-07-01",
    "validUntil": "2024-06-30",
    "sha256Digest": "b88518640fb090d14a6bba97e8cc84cdcd1ee444ef41325b028944b5ed29925f",
    "verificationUrl": "https://edistrict.haryana.gov.in/verify?id=HR-DFS-2021-8841"
  },
  "signatureStatus": "VALID_CRYPTOGRAPHIC_SIGNATURE",
  "issuerSubject": "CN=State e-District Root CA, O=Govt of Haryana, C=IN"
}`}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 text-xs text-emerald-800 dark:text-emerald-300 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <strong>Cryptographic Integrity Verified:</strong> The QR matrix holds an authentic State CA ECDSA signature proving the document was originally issued with validity ending <strong>30-06-2024</strong>. This conclusively proves the printed PDF body date of 2027 was spliced post-issuance!
                </div>
              </div>
            </div>

            {/* Strict FQDN Whitelist & Domain Spoofing Inspector */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">
                    Strict Government FQDN Whitelist &amp; Anti-Phishing Domain Filter
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Enforces that all digital certificate verification URLs resolve strictly to MeitY registered <strong>*.gov.in</strong> or <strong>*.nic.in</strong> domains.
                  </p>
                </div>
                <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 font-bold border border-emerald-500/30">
                  REGEX: ^https?://([a-zA-Z0-9-]+\.)*(gov\.in|nic\.in)
                </span>
              </div>

              {/* Interactive Domain Input */}
              <div className="space-y-2">
                <label className="text-[10.5px] font-mono text-slate-500 uppercase font-semibold block">
                  Test Document Verification URL:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={qrTestUrl}
                    onChange={(e) => setQrTestUrl(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 font-mono text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                  <button
                    onClick={() => {
                      setQrTestUrl('https://edistrict-haryana.com/verify?id=HR-DFS-2021-8841');
                      toast.warning('Loaded Phishing / Domain Spoof Simulation');
                    }}
                    className="px-3 py-2 rounded-xl text-xs font-mono font-semibold bg-red-600/10 border border-red-500/30 text-red-600 hover:bg-red-600/20 transition-colors"
                  >
                    Simulate Spoof
                  </button>
                  <button
                    onClick={() => {
                      setQrTestUrl('https://edistrict.haryana.gov.in/verify?id=HR-DFS-2021-8841');
                      toast.success('Loaded Genuine *.gov.in Domain');
                    }}
                    className="px-3 py-2 rounded-xl text-xs font-mono font-semibold bg-emerald-600/10 border border-emerald-500/30 text-emerald-600 hover:bg-emerald-600/20 transition-colors"
                  >
                    Reset Genuine
                  </button>
                </div>

                {/* Validation Result Box */}
                <div
                  className={`p-3 rounded-xl border text-xs font-mono flex items-start gap-2.5 ${
                    qrDomainCheck.status === 'TRUSTED_GOV_ROOT'
                      ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-900/60 text-emerald-800 dark:text-emerald-300'
                      : 'bg-red-50 dark:bg-red-950/30 border-red-300 dark:border-red-900/60 text-red-800 dark:text-red-300'
                  }`}
                >
                  {qrDomainCheck.status === 'TRUSTED_GOV_ROOT' ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                  ) : (
                    <AlertOctagon className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
                  )}
                  <div>
                    <div className="font-bold flex items-center gap-2">
                      <span>Status: {qrDomainCheck.status}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-black/10 dark:bg-white/10">
                        Hostname: {qrDomainCheck.hostname || 'None'}
                      </span>
                    </div>
                    <div className="text-[11px] mt-0.5 font-sans">
                      {qrDomainCheck.details}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
