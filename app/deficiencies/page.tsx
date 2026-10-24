'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useLanguage, useFilters } from '@/lib/context';
import { InstitutionalApplication } from '@/lib/mock-data';
import { computeSha256 } from '@/lib/crypto-utils';
import GroupChat, { ChatMessage } from '@/components/ui/group-chat';
import { toast } from 'sonner';
import { AICTELogo } from '@/components/brand/AICTELogo';
import {
  FileWarning,
  Printer,
  Send,
  Lock,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Building,
  ChevronDown,
  FileText,
  AlertOctagon,
  Languages,
  KeyRound,
  X,
  ExternalLink,
  ShieldAlert,
  MessageSquare,
} from 'lucide-react';

function DeficienciesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t, language } = useLanguage();
  const {
    applications,
    selectedAppId,
    setSelectedAppId,
    issueDeficiencyNotice,
    escalateToStandingHearingCommittee,
  } = useFilters();

  // Read target appId from URL param or fallback to selectedAppId in store
  const paramAppId = searchParams.get('appId');
  const targetAppId = paramAppId || selectedAppId || applications[0]?.id;

  const application: InstitutionalApplication =
    applications.find((a) => a.id === targetAppId) || applications[0];

  // Document Type Form-A vs Form-B Toggle
  const [formType, setFormType] = useState<'FORM_A' | 'FORM_B'>(
    application.fatalGateTriggered ? 'FORM_B' : 'FORM_A'
  );

  // Sync formType when application changes
  useEffect(() => {
    if (application.fatalGateTriggered) {
      setFormType('FORM_B');
    } else {
      setFormType('FORM_A');
    }
  }, [application.fatalGateTriggered]);

  // Dynamic Deliberation Stream Seeding based on Institution Anomalies
  const getDeliberationMessages = (app: InstitutionalApplication, currentFormType: 'FORM_A' | 'FORM_B'): ChatMessage[] => {
    const topAnom = app.anomalies[0];
    const isFatal = app.fatalGateTriggered || currentFormType === 'FORM_B';
    const hasGhost = app.facultyMetrics.ghostFlaggedCount > 0;

    return [
      {
        name: 'trufor-sentinel',
        title: 'TruFor AI Sentinel',
        text: topAnom
          ? `[FORENSIC EVIDENCE] Tamper localization confirmed on ${topAnom.documentTitle} with ${(topAnom.tamperProbability * 100).toFixed(1)}% confidence. ${topAnom.modelUsed} identified adversarial splice window altering dates.`
          : `[FORENSIC EVIDENCE] Multi-spectral validation complete: Zero tampering detected. All uploaded credentials match issuing repository hash.`,
        time: '09:42 AM',
      },
      {
        name: 'dpi-auditor',
        title: 'API Setu / EPFO Auditor',
        text: hasGhost
          ? `[DPI AUDIT] DigiLocker URI & EPFO gateway reconciliation completed. Flagged ${app.facultyMetrics.ghostFlaggedCount} ghost faculty entries with concurrent EPFO payroll in other institutes.`
          : `[DPI AUDIT] DigiLocker pull URI handshake verified. Land sale deed acreage verified at ${app.landAndBuiltUp.landAvailableAcres} acres with Jamabandi GIS.`,
        time: '09:48 AM',
      },
      {
        name: 'evc-sharma',
        title: 'Dr. A. Sharma (EVC)',
        text: isFatal
          ? `Physical inspection concurs with TruFor Sentinel. Institutional trust has failed to produce original non-expired NOC. Immediate SHC summons is mandatory.`
          : `15-day rectification window is sufficient for institution to rectify CAD instructional area shortfalls and file verified faculty affidavit under APH Chapter VII.`,
        time: '09:55 AM',
      },
      {
        name: 'ro-verma',
        title: 'Shri R.K. Verma (RO-04)',
        text: isFatal
          ? `Drafting Form-B Standing Hearing Committee Show-Cause Order under APH Chapter VIII. Ready for cryptographic Class-3 DSC endorsement.`
          : `Drafting Form-A 15-Day EVC Rectification Notice under APH Chapter VII Clause 2.1. Ready for cryptographic Class-3 DSC endorsement.`,
        time: '10:05 AM',
      },
    ];
  };

  const [deliberationMessages, setDeliberationMessages] = useState<ChatMessage[]>(() =>
    getDeliberationMessages(application, formType)
  );
  const [deliberationInput, setDeliberationInput] = useState<string>('');

  useEffect(() => {
    setDeliberationMessages(getDeliberationMessages(application, formType));
  }, [application.id, formType]);

  const handleAddDeliberationNote = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!deliberationInput.trim()) return;

    const note = deliberationInput.trim();
    const timeStr = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

    setDeliberationMessages((prev) => [
      ...prev,
      {
        name: 'ro-verma',
        title: 'Shri R.K. Verma (RO-04)',
        text: note,
        time: timeStr,
      },
    ]);
    setDeliberationInput('');

    const digest = await computeSha256(
      `DELIBERATION_ENDORSEMENT|${application.id}|${formType}|${note}|${new Date().toISOString()}`
    );
    toast.success('Deliberation Endorsement Appended to SHC Record', {
      description: `Cryptographic SHA-256 certificate (${digest.slice(0, 16)}...) attached to official scrutiny dossier.`,
    });
  };

  // Notice Language Toggle ('en' | 'hi' | 'bilingual')
  const [noticeLang, setNoticeLang] = useState<'en' | 'hi' | 'bilingual'>('bilingual');

  // Officer DSC Signing State & Modal
  const [isDscModalOpen, setIsDscModalOpen] = useState<boolean>(false);
  const [tokenPin, setTokenPin] = useState<string>('849201');
  const [isDscSigned, setIsDscSigned] = useState<boolean>(false);
  const [dscSignatureDigest, setDscSignatureDigest] = useState<string>('');
  const [dscSigningTime, setDscSigningTime] = useState<string>('');
  const [isDispatched, setIsDispatched] = useState<boolean>(false);

  // 15-Day EVC Countdown Timer
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({
    days: 14,
    hours: 23,
    minutes: 58,
    seconds: 40,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Handle Signing with Class 3 DSC Modal
  const handleConfirmDscSign = async () => {
    if (tokenPin.length < 4) {
      toast.error('Please enter valid 6-digit USB Token Cryptographic PIN');
      return;
    }

    const timestamp = new Date().toISOString();
    const signPayload = `DSC-CLASS3|${application.id}|${formType}|Shri R.K. Verma|${timestamp}`;
    const digest = await computeSha256(signPayload);

    setDscSignatureDigest(digest);
    setDscSigningTime(timestamp);
    setIsDscSigned(true);
    setIsDscModalOpen(false);

    toast.success('Digitally Signed with Class 3 DSC (Officer: Shri R.K. Verma, RO-04)', {
      description: `Cryptographic SHA-256 certificate appended: ${digest.slice(0, 16)}...`,
    });
  };

  // Dispatch Notice & Trigger Closed-Loop Store Mutation
  const handleDispatch = async () => {
    if (!isDscSigned) {
      toast.error('Mandatory Step: Sign notice with Officer DSC before dispatching order.');
      return;
    }

    setIsDispatched(true);

    if (formType === 'FORM_A') {
      await issueDeficiencyNotice(
        application.id,
        15,
        'Form-A 15-Day EVC Rectification Notice dispatched via AICTE Gateway with Officer DSC.'
      );
    } else {
      await escalateToStandingHearingCommittee(
        application.id,
        'Form-B Standing Hearing Committee Show-Cause Order dispatched via AICTE Gateway with Officer DSC.'
      );
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const isFatal = formType === 'FORM_B';

  return (
    <div className="space-y-6 animate-glass-in">
      {/* Top Header & Application Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-sky-600 dark:text-sky-400 uppercase tracking-wider">
              AICTE Regulation &amp; Approval Process Bureau
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--text-primary)]">
            Statutory Notice &amp;{' '}
            <span className="title-serif-italic text-sky-600 dark:text-sky-400">
              Deficiency Generator
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1 max-w-3xl leading-relaxed">
            Bilingual Government of India official orders with itemized APH 2024–27 citations, Class-3 DSC, and 15-day statutory clock.
          </p>
        </div>

        {/* Institution Dropdown */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <select
              value={application.id}
              onChange={(e) => {
                setSelectedAppId(e.target.value);
                setIsDscSigned(false);
                setIsDispatched(false);
                router.push(`/deficiencies?appId=${e.target.value}`);
              }}
              className="appearance-none pl-3.5 pr-9 py-2 rounded-xl glass-well text-xs font-semibold text-[var(--text-primary)] cursor-pointer focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-xs"
            >
              {applications.map((app) => (
                <option key={app.id} value={app.id}>
                  {app.id} — {app.nameEn}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
          </div>
        </div>
      </div>

      {/* Control Strip: Document Type Toggle & Language Selector */}
      <div className="p-4 sm:p-5 rounded-[18px] liquid-glass-card flex flex-wrap items-center justify-between gap-3 shadow-xs">
        {/* Form A / Form B Toggle */}
        <div className="flex items-center gap-2.5">
          <span className="text-xs font-semibold text-[var(--text-secondary)]">
            Document Order Type:
          </span>
          <div className="inline-flex rounded-xl p-1 glass-well text-xs">
            <button
              onClick={() => {
                setFormType('FORM_A');
                setIsDscSigned(false);
                setIsDispatched(false);
              }}
              className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                formType === 'FORM_A'
                  ? 'bg-amber-600 text-white font-semibold shadow-xs'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              Form-A: 15-Day EVC Rectifiable Notice
            </button>
            <button
              onClick={() => {
                setFormType('FORM_B');
                setIsDscSigned(false);
                setIsDispatched(false);
              }}
              className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                formType === 'FORM_B'
                  ? 'bg-rose-600 text-white font-semibold shadow-xs'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              Form-B: Standing Hearing Committee (SHC) Show-Cause
            </button>
          </div>
        </div>

        {/* Language Toggle */}
        <div className="flex items-center gap-2">
          <Languages className="w-4 h-4 text-[var(--text-muted)]" />
          <div className="inline-flex rounded-xl p-1 glass-well text-xs font-medium">
            <button
              onClick={() => setNoticeLang('en')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                noticeLang === 'en'
                  ? 'btn-liquid-primary shadow-xs font-semibold'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setNoticeLang('hi')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                noticeLang === 'hi'
                  ? 'btn-liquid-primary shadow-xs font-semibold'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              हिन्दी (Hindi)
            </button>
            <button
              onClick={() => setNoticeLang('bilingual')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                noticeLang === 'bilingual'
                  ? 'btn-liquid-primary shadow-xs font-semibold'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              Bilingual (द्विभाषी)
            </button>
          </div>
        </div>
      </div>

      {/* 15-Day EVC Rectification Countdown Clock */}
      <div
        className={`p-4 sm:p-5 rounded-[18px] liquid-glass-card flex flex-col sm:flex-row sm:items-center justify-between gap-4 border ${
          isFatal
            ? 'border-rose-500/30'
            : 'border-amber-500/30'
        }`}
      >
        <div className="flex items-center gap-3.5">
          <div
            className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 ${
              isFatal
                ? 'bg-rose-500/15 border-rose-500/30 text-rose-600 dark:text-rose-400'
                : 'bg-amber-500/15 border-amber-500/30 text-amber-600 dark:text-amber-400'
            }`}
          >
            <Clock className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div
              className={`text-xs font-semibold uppercase tracking-wider ${
                isFatal
                  ? 'text-rose-700 dark:text-rose-300'
                  : 'text-amber-700 dark:text-amber-300'
              }`}
            >
              {isFatal
                ? 'Standing Hearing Committee (SHC) Statutory Summons Window'
                : '15-Day Expert Visit Committee (EVC) Rectification Clock'}
            </div>
            <div className="text-xs text-[var(--text-muted)] mt-0.5">
              APH 2024–27 Chapter {isFatal ? 'VIII Clause 8.2' : 'VII Clause 2.1'} Statutory Compliance Deadline: 07-11-2026 23:59 IST
            </div>
          </div>
        </div>

        {/* Big Countdown Numerals */}
        <div className="flex items-center gap-2 text-center">
          <div className="px-3.5 py-2 rounded-xl glass-well min-w-[56px]">
            <div className="metric-value text-xl font-bold">{timeLeft.days}</div>
            <div className="text-[10px] uppercase font-semibold text-[var(--text-muted)] mt-0.5">Days</div>
          </div>
          <span className="font-bold text-[var(--text-muted)] text-base">:</span>
          <div className="px-3.5 py-2 rounded-xl glass-well min-w-[56px]">
            <div className="metric-value text-xl font-bold">{timeLeft.hours}</div>
            <div className="text-[10px] uppercase font-semibold text-[var(--text-muted)] mt-0.5">Hours</div>
          </div>
          <span className="font-bold text-[var(--text-muted)] text-base">:</span>
          <div className="px-3.5 py-2 rounded-xl glass-well min-w-[56px]">
            <div className="metric-value text-xl font-bold">{timeLeft.minutes}</div>
            <div className="text-[10px] uppercase font-semibold text-[var(--text-muted)] mt-0.5">Mins</div>
          </div>
          <span className="font-bold text-[var(--text-muted)] text-base">:</span>
          <div className="px-3.5 py-2 rounded-xl glass-well min-w-[56px]">
            <div className="metric-value text-xl font-bold">
              {timeLeft.seconds}
            </div>
            <div className="text-[10px] uppercase font-semibold text-[var(--text-muted)] mt-0.5">Secs</div>
          </div>
        </div>
      </div>

      {/* 2-Column Responsive Workspace: Committee Deliberation Log alongside Official Order Sheet */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left Column (xl:col-span-4): Live Committee Deliberation Stream */}
        <div className="xl:col-span-4 space-y-4 print:hidden">
          <div className="liquid-glass-card rounded-[18px] p-4 space-y-3.5 shadow-md border border-[var(--glass-border)]">
            <div className="border-b border-[var(--glass-well-border)] pb-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-sky-700 dark:text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Statutory Deliberation Record
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 font-bold">
                  #shc-{application.id.toLowerCase()}
                </span>
              </div>
              <h3 className="font-bold text-sm text-[var(--text-primary)] mt-1 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-sky-600" />
                <span>Committee Forensic Stream</span>
              </h3>
              <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                Pre-sign deliberation transcript between Regional Officer, EVC Chair, TruFor Sentinel, and API Setu Auditor
              </p>
            </div>

            {/* Deliberation GroupChat Feed */}
            <div className="max-h-[560px] overflow-y-auto pr-1">
              <GroupChat
                channel={`shc-${application.id.toLowerCase()}`}
                members={["ro-verma", "evc-sharma", "trufor-sentinel", "dpi-auditor"]}
                extra={3}
                messages={deliberationMessages}
                className="bg-transparent border-0 shadow-none p-0"
              />
            </div>

            {/* Officer Deliberation Endorsement Input */}
            <div className="pt-3 border-t border-[var(--glass-well-border)] space-y-2">
              <form onSubmit={handleAddDeliberationNote} className="flex items-center gap-2">
                <input
                  type="text"
                  value={deliberationInput}
                  onChange={(e) => setDeliberationInput(e.target.value)}
                  placeholder="Record officer endorsement note before DSC signing..."
                  className="flex-1 px-3 py-2 rounded-xl glass-well text-xs font-medium text-[var(--text-primary)] placeholder:text-[var(--text-faint)] focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
                <button
                  type="submit"
                  disabled={!deliberationInput.trim()}
                  className="btn-liquid-primary px-3 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-2xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Post</span>
                </button>
              </form>
              <div className="flex items-center justify-between text-[10px] text-[var(--text-muted)] px-0.5">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  Signatory: <strong>Shri R.K. Verma (RO-04)</strong>
                </span>
                <span className="font-mono">SHA-256 Ledger Chained</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (xl:col-span-8): Official Government Order Sheet */}
        <div className="xl:col-span-8 space-y-6">
          {/* Official Government Order Sheet */}
          <div className="rounded-[18px] p-5 sm:p-10 space-y-6 liquid-glass-card shadow-2xl print:border-none print:shadow-none">
        {/* National Emblem & AICTE Official Header */}
        <div className="text-center pb-6 border-b border-[var(--glass-border)] space-y-1.5">
          {/* Official AICTE Emblem Insignia */}
          <div className="flex justify-center mb-3">
            <AICTELogo variant="badge" size="xl" showStatusDot={false} interactive={false} />
          </div>

          <div className="font-serif font-extrabold text-sm sm:text-base text-[var(--text-primary)] tracking-wide uppercase">
            {noticeLang !== 'en' && (
              <span className="block font-sans text-xs text-[var(--text-secondary)] mb-0.5">
                अखिल भारतीय तकनीकी शिक्षा परिषद
              </span>
            )}
            ALL INDIA COUNCIL FOR TECHNICAL EDUCATION
          </div>

          <p className="text-xs text-[var(--text-secondary)] font-medium tracking-wider">
            {noticeLang !== 'en' && 'शिक्षा मंत्रालय, भारत सरकार • '}
            (A Statutory Body Under Ministry of Education, Govt. of India)
          </p>
          <p className="text-[11px] text-[var(--text-muted)] font-mono">
            Nelson Mandela Marg, Vasant Kunj, New Delhi - 110070 • Telephone: 011-29581000 • www.aicte-india.org
          </p>
        </div>

        {/* Notice Dispatch Identification Details */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-[var(--text-muted)] gap-2 border-b border-[var(--glass-border)] pb-3">
          <div>
            <strong>File No / पत्रांक संख्या:</strong> <span className="font-mono">AICTE/UB/SCRUTINY/{application.id}/2026-27</span>
          </div>
          <div>
            <strong>Date of Dispatch / निर्गमन तिथि:</strong> <span className="font-mono">23-10-2026</span>
          </div>
        </div>

        {/* Addressee Section */}
        <div className="text-xs text-[var(--text-secondary)] space-y-1">
          <p className="font-semibold text-[var(--text-primary)]">To / सेवा में,</p>
          <p className="font-medium">The Chairman / Secretary / Director / Principal,</p>
          <p className="font-bold text-sm text-[var(--text-primary)]">
            {application.nameEn}
            {noticeLang !== 'en' && ` (${application.nameHi})`}
          </p>
          <p className="text-[var(--text-muted)]">
            {application.city}, {application.state} • Permanent Institution ID (PID):{' '}
            <strong className="text-[var(--text-primary)] font-mono">{application.pid}</strong>
          </p>
          <p className="text-[var(--text-muted)]">
            Trust / Society: {application.trustName} • Region: {application.region}
          </p>
        </div>

        {/* Subject Line */}
        <div
          className={`p-4 rounded-xl text-xs font-semibold leading-relaxed border ${
            isFatal
              ? 'bg-rose-500/10 border-rose-500/30 text-rose-900 dark:text-rose-200'
              : 'bg-amber-500/10 border-amber-500/30 text-amber-900 dark:text-amber-200'
          }`}
        >
          {noticeLang !== 'en' && (
            <div className="mb-1 text-xs">
              {isFatal
                ? 'विषय: एआईसीटीई अनुमोदन प्रक्रिया पुस्तिका (APH 2024–27) के अध्याय VIII के तहत स्थायी सुनवाई समिति (SHC) हेतु कारण बताओ नोटिस — प्रमाणित दस्तावेजी जालसाजी एवं फर्जी संकाय भर्ती।'
                : 'विषय: एआईसीटीई अनुमोदन प्रक्रिया पुस्तिका (APH 2024–27) के अध्याय VII के तहत 15-दिवसीय ई०वी०सी० त्रुटि निवारण सूचना पत्र (शैक्षणिक सत्र 2026–27 अनुमोदन विस्तार)।'}
            </div>
          )}
          {noticeLang !== 'hi' && (
            <div className="text-xs">
              {isFatal
                ? 'SUBJECT: STATUTORY SHOW-CAUSE NOTICE FOR ESCALATION TO STANDING HEARING COMMITTEE (SHC) UNDER AICTE APPROVAL PROCESS HANDBOOK (APH 2024–27 CHAPTER VIII) — CONFIRMED DOCUMENTARY FORGERY AND FRAUDULENT ENROLLMENT.'
                : 'SUBJECT: STATUTORY 15-DAY DEFICIENCY RECTIFICATION NOTICE UNDER AICTE APPROVAL PROCESS HANDBOOK (APH 2024–27 CHAPTER VII) FOR EXTENSION OF APPROVAL (EoA) 2026–27.'}
            </div>
          )}
        </div>

        {/* Formal Legal Body */}
        <div className="text-xs text-[var(--text-secondary)] space-y-3.5 leading-relaxed">
          <p>Sir / Madam (महोदय/महोदया),</p>
          <p>
            The statutory scrutiny dossier submitted by your institution for Application ID{' '}
            <strong className="font-mono text-[var(--text-primary)]">{application.id}</strong>{' '}
            has undergone multi-modal neural evidence auditing, forensic tampering localization, computer-vision architectural compliance check, and National DPI Authority Bridge reconciliation under the statutory provisions of the AICTE Approval Process Handbook (APH 2024–2027).
          </p>
          <p>
            {isFatal ? (
              <span className="text-rose-700 dark:text-rose-400 font-semibold">
                The automated forensic scrutiny pipeline and DigiLocker/EPFO Authority verification have detected FATAL FRAUDULENT TAMPERING and/or GHOST FACULTY ENROLLMENTS violating APH Chapter VIII Clause 8.2 and Bharatiya Nyaya Sanhita (BNS) provisions.
              </span>
            ) : (
              <span>
                The automated scrutiny engine has identified the following itemized shortfalls and statutory non-compliances requiring mandatory rectification within the statutory 15-day rectification window:
              </span>
            )}
          </p>

          {/* Itemized Deficiency & Evidence Summary Table */}
          <div className="space-y-3 pt-2">
            {application.anomalies.map((anom, idx) => (
              <div
                key={anom.id}
                className="p-4 rounded-xl glass-well space-y-2.5"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>
                      Item #{idx + 1}: {anom.category} (Risk Priority Number: {anom.rpnScore})
                    </span>
                  </span>
                  <span className="text-[var(--text-muted)] text-[11px]">
                    Neural Model: <span className="font-mono">{anom.modelUsed}</span> • Tamper Conf: {(anom.tamperProbability * 100).toFixed(1)}%
                  </span>
                </div>

                <div className="font-semibold text-xs text-[var(--text-primary)]">
                  {noticeLang === 'hi'
                    ? anom.titleHi
                    : noticeLang === 'en'
                    ? anom.titleEn
                    : `${anom.titleEn} / ${anom.titleHi}`}
                </div>

                <p className="text-[11.5px] text-[var(--text-secondary)] leading-relaxed">
                  {noticeLang === 'hi'
                    ? anom.descriptionHi
                    : noticeLang === 'en'
                    ? anom.descriptionEn
                    : `${anom.descriptionEn} (${anom.descriptionHi})`}
                </p>

                {/* Evidence Diff Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono pt-1">
                  <div className="p-2.5 rounded-lg bg-black/5 dark:bg-white/5 border border-[var(--glass-border)]">
                    <span className="text-[var(--text-muted)] block text-[10px] font-sans">Uploaded Value:</span>
                    <span className="text-rose-600 dark:text-rose-400 font-bold">{anom.extractedValue}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-black/5 dark:bg-white/5 border border-[var(--glass-border)]">
                    <span className="text-[var(--text-muted)] block text-[10px] font-sans">Authoritative Record / Statutory Norm:</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">{anom.authorityValue}</span>
                  </div>
                </div>

                <div className="text-xs text-sky-600 dark:text-sky-400 pt-1 font-medium">
                  <strong>Statutory Clause Citation:</strong> <span className="font-mono">{anom.aphClause}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Statutory Directives */}
          <div className="p-4 rounded-xl glass-well text-xs text-[var(--text-primary)] space-y-1.5 leading-relaxed">
            {isFatal ? (
              <p>
                <strong>DIRECTIVE:</strong> You are hereby summoned to appear before the Standing Hearing Committee (SHC) at AICTE Headquarters, New Delhi within <strong>15 days</strong> of this notice, failing which an ex-parte decision shall be passed placing the institution under <em>NO ADMISSION STATUS</em> and initiating criminal proceedings under relevant statutory provisions.
              </p>
            ) : (
              <p>
                <strong>DIRECTIVE:</strong> You are hereby afforded a statutory period of <strong>15 days</strong> to submit certified documentary evidence and rectified compliance certificates through the National AICTE Portal. Non-rectification shall lead to proportional intake reduction or withdrawal of Extension of Approval (EoA 2026–27).
              </p>
            )}
          </div>
        </div>

        {/* Digital Signature Certificate (DSC) & Officer Verification Block */}
        <div className="pt-6 border-t border-[var(--glass-border)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            {isDscSigned ? (
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-900 dark:text-emerald-200 flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <div className="text-xs">
                  <div className="font-semibold">
                    Digitally Signed with Class 3 DSC (eMudhra CCA India)
                  </div>
                  <div className="text-[11px] text-[var(--text-muted)] mt-0.5">
                    Signatory: Shri R.K. Verma (RO-04, North-Western Region) • Signed: {dscSigningTime}
                  </div>
                  <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono select-all mt-0.5">
                    Certificate SHA-256: {dscSignatureDigest}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-xs text-[var(--text-muted)] flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-500" />
                <span>Pending Officer Digital Signature Certificate (Class 3 DSC) Sign-off</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="btn-liquid-secondary cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-[var(--text-primary)]"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Official Order</span>
            </button>

            {!isDscSigned ? (
              <button
                onClick={() => setIsDscModalOpen(true)}
                className="btn-liquid-primary cursor-pointer inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Sign with Officer DSC</span>
              </button>
            ) : (
              <button
                onClick={handleDispatch}
                disabled={isDispatched}
                className="btn-liquid-primary cursor-pointer inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isDispatched ? 'Dispatched & Logged' : 'Dispatch Order to Institution'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
        </div>
      </div>

      {/* Class 3 Officer DSC Signing Modal */}
      {isDscModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 animate-glass-in"
          onClick={() => setIsDscModalOpen(false)}
        >
          <div
            className="w-full max-w-lg liquid-glass-card rounded-[18px] overflow-hidden shadow-2xl p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[var(--glass-border)] pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <h3 className="font-semibold text-sm text-[var(--text-primary)]">
                  Class 3 Digital Signature Certificate (DSC) Authentication
                </h3>
              </div>
              <button
                onClick={() => setIsDscModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-[var(--text-muted)] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Certificate Details */}
            <div className="p-4 rounded-xl glass-well text-xs space-y-2">
              <div>
                <span className="text-[var(--text-muted)]">Certifying Authority:</span>{' '}
                <strong className="text-[var(--text-primary)]">
                  eMudhra Sub-CA Class 3 Individual 2024 (CCA India)
                </strong>
              </div>
              <div>
                <span className="text-[var(--text-muted)]">Signatory Officer:</span>{' '}
                <strong className="text-[var(--text-primary)]">
                  Shri R.K. Verma (Regional Scrutiny Officer, RO-04)
                </strong>
              </div>
              <div>
                <span className="text-[var(--text-muted)]">Crypto Algorithm:</span>{' '}
                <strong className="text-emerald-600 dark:text-emerald-400 font-mono">RSA-2048 / SHA-256 Digest</strong>
              </div>
              <div>
                <span className="text-[var(--text-muted)]">Hardware Crypto Token:</span>{' '}
                <span className="text-[var(--text-secondary)]">
                  SafeNet eToken 5110 (FIPS 140-2 Level 3 Validated)
                </span>
              </div>
            </div>

            {/* Token PIN Entry */}
            <div className="space-y-1.5 text-xs">
              <label className="font-semibold text-[var(--text-secondary)]">
                Enter USB Crypto Token User PIN:
              </label>
              <input
                type="password"
                maxLength={8}
                value={tokenPin}
                onChange={(e) => setTokenPin(e.target.value)}
                placeholder="Enter 6-digit cryptographic PIN"
                className="w-full px-3.5 py-2.5 rounded-xl glass-well font-mono text-sm tracking-widest text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <p className="text-[11px] text-[var(--text-muted)]">
                Statutory requirement under Information Technology Act 2000 Section 35.
              </p>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[var(--glass-border)]">
              <button
                onClick={() => setIsDscModalOpen(false)}
                className="btn-liquid-secondary cursor-pointer px-3.5 py-2 rounded-xl text-xs font-semibold text-[var(--text-secondary)]"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDscSign}
                className="btn-liquid-primary cursor-pointer px-4 py-2 rounded-xl text-xs font-semibold"
              >
                Sign &amp; Attach Digital Certificate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DeficienciesPage() {
  return (
    <Suspense fallback={<div className="p-8 font-mono text-xs text-slate-500">Loading Statutory Notice Engine...</div>}>
      <DeficienciesContent />
    </Suspense>
  );
}
