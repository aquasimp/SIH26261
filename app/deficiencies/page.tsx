'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useLanguage, useFilters } from '@/lib/context';
import { InstitutionalApplication } from '@/lib/mock-data';
import { computeSha256 } from '@/lib/crypto-utils';
import { toast } from 'sonner';
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
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header & Application Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] font-bold text-sky-700 dark:text-sky-400 uppercase tracking-widest">
              AICTE REGULATION &amp; APPROVAL PROCESS BUREAU
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Statutory Notice &amp;{' '}
            <span className="font-serif italic font-normal text-sky-700 dark:text-sky-400">
              Deficiency Generator
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
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
              className="appearance-none pl-3 pr-8 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white shadow-2xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              {applications.map((app) => (
                <option key={app.id} value={app.id}>
                  {app.id} — {app.nameEn}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          </div>
        </div>
      </div>

      {/* Control Strip: Document Type Toggle & Language Selector */}
      <div className="p-4 rounded-2xl liquid-glass-card border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
        {/* Form A / Form B Toggle */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Document Order Type:
          </span>
          <div className="inline-flex rounded-xl p-0.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono">
            <button
              onClick={() => {
                setFormType('FORM_A');
                setIsDscSigned(false);
                setIsDispatched(false);
              }}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                formType === 'FORM_A'
                  ? 'bg-amber-600 text-white font-bold shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
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
              className={`px-3 py-1.5 rounded-lg transition-all ${
                formType === 'FORM_B'
                  ? 'bg-red-600 text-white font-bold shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Form-B: Standing Hearing Committee (SHC) Show-Cause
            </button>
          </div>
        </div>

        {/* Language Toggle */}
        <div className="flex items-center gap-2">
          <Languages className="w-4 h-4 text-slate-400" />
          <div className="inline-flex rounded-xl p-0.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
            <button
              onClick={() => setNoticeLang('en')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                noticeLang === 'en'
                  ? 'bg-white dark:bg-slate-900 text-sky-700 dark:text-sky-400 font-bold shadow-2xs'
                  : 'text-slate-500'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setNoticeLang('hi')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                noticeLang === 'hi'
                  ? 'bg-white dark:bg-slate-900 text-sky-700 dark:text-sky-400 font-bold shadow-2xs'
                  : 'text-slate-500'
              }`}
            >
              हिन्दी (Hindi)
            </button>
            <button
              onClick={() => setNoticeLang('bilingual')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                noticeLang === 'bilingual'
                  ? 'bg-white dark:bg-slate-900 text-sky-700 dark:text-sky-400 font-bold shadow-2xs'
                  : 'text-slate-500'
              }`}
            >
              Bilingual (द्विभाषी)
            </button>
          </div>
        </div>
      </div>

      {/* 15-Day EVC Rectification Countdown Clock */}
      <div
        className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
          isFatal
            ? 'border-red-500/30 bg-red-500/10'
            : 'border-amber-500/30 bg-amber-500/10'
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${
              isFatal
                ? 'bg-red-500/10 border-red-500/20 text-red-700 dark:text-red-400'
                : 'bg-amber-500/10 border-amber-500/20 text-amber-700 dark:text-amber-400'
            }`}
          >
            <Clock className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div
              className={`text-xs font-bold uppercase tracking-wider ${
                isFatal
                  ? 'text-red-800 dark:text-red-300'
                  : 'text-amber-800 dark:text-amber-300'
              }`}
            >
              {isFatal
                ? 'Standing Hearing Committee (SHC) Statutory Summons Window'
                : '15-Day Expert Visit Committee (EVC) Rectification Clock'}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              APH 2024–27 Chapter {isFatal ? 'VIII Clause 8.2' : 'VII Clause 2.1'} Statutory Compliance Deadline: 07-11-2026 23:59 IST
            </div>
          </div>
        </div>

        {/* Big Countdown Numerals */}
        <div className="flex items-center gap-2 font-mono text-center">
          <div className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
            <div className="text-lg font-bold text-slate-900 dark:text-white">{timeLeft.days}</div>
            <div className="text-[9px] uppercase font-semibold text-slate-400">Days</div>
          </div>
          <span className="font-bold text-slate-400">:</span>
          <div className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
            <div className="text-lg font-bold text-slate-900 dark:text-white">{timeLeft.hours}</div>
            <div className="text-[9px] uppercase font-semibold text-slate-400">Hours</div>
          </div>
          <span className="font-bold text-slate-400">:</span>
          <div className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
            <div className="text-lg font-bold text-slate-900 dark:text-white">{timeLeft.minutes}</div>
            <div className="text-[9px] uppercase font-semibold text-slate-400">Mins</div>
          </div>
          <span className="font-bold text-slate-400">:</span>
          <div className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
            <div
              className={`text-lg font-bold ${
                isFatal
                  ? 'text-red-600 dark:text-red-400'
                  : 'text-amber-600 dark:text-amber-400'
              }`}
            >
              {timeLeft.seconds}
            </div>
            <div className="text-[9px] uppercase font-semibold text-slate-400">Secs</div>
          </div>
        </div>
      </div>

      {/* Official Government Order Sheet */}
      <div className="rounded-2xl p-8 sm:p-12 space-y-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl print:border-none print:shadow-none">
        {/* National Emblem & AICTE Official Header */}
        <div className="text-center pb-6 border-b-2 border-slate-900/10 dark:border-slate-100/10 space-y-1">
          {/* Ashoka Lion Emblem Representation */}
          <div className="w-14 h-14 mx-auto rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-800 dark:text-slate-200 mb-2 border border-slate-300 dark:border-slate-700 shadow-xs">
            <Building className="w-7 h-7 text-amber-700 dark:text-amber-400" />
          </div>

          <div className="font-serif font-extrabold text-sm sm:text-base text-slate-900 dark:text-white tracking-wide uppercase">
            {noticeLang !== 'en' && (
              <span className="block font-sans text-xs text-slate-700 dark:text-slate-300 mb-0.5">
                अखिल भारतीय तकनीकी शिक्षा परिषद
              </span>
            )}
            ALL INDIA COUNCIL FOR TECHNICAL EDUCATION
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold tracking-wider">
            {noticeLang !== 'en' && 'शिक्षा मंत्रालय, भारत सरकार • '}
            (A Statutory Body Under Ministry of Education, Govt. of India)
          </p>
          <p className="text-[11px] text-slate-400 font-mono">
            Nelson Mandela Marg, Vasant Kunj, New Delhi - 110070 • Telephone: 011-29581000 • www.aicte-india.org
          </p>
        </div>

        {/* Notice Dispatch Identification Details */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs font-mono text-slate-600 dark:text-slate-400 gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <strong>File No / पत्रांक संख्या:</strong> AICTE/UB/SCRUTINY/{application.id}/2026-27
          </div>
          <div>
            <strong>Date of Dispatch / निर्गमन तिथि:</strong> 23-10-2026
          </div>
        </div>

        {/* Addressee Section */}
        <div className="text-xs text-slate-800 dark:text-slate-200 space-y-0.5">
          <p className="font-bold">To / सेवा में,</p>
          <p className="font-semibold">The Chairman / Secretary / Director / Principal,</p>
          <p className="font-bold text-sm text-slate-900 dark:text-white">
            {application.nameEn}
            {noticeLang !== 'en' && ` (${application.nameHi})`}
          </p>
          <p className="text-slate-500 dark:text-slate-400">
            {application.city}, {application.state} • Permanent Institution ID (PID):{' '}
            <strong className="text-slate-800 dark:text-slate-200 font-mono">{application.pid}</strong>
          </p>
          <p className="text-slate-500 dark:text-slate-400">
            Trust / Society: {application.trustName} • Region: {application.region}
          </p>
        </div>

        {/* Subject Line */}
        <div
          className={`p-3.5 rounded-xl text-xs font-bold leading-relaxed border ${
            isFatal
              ? 'bg-red-50/80 dark:bg-red-950/30 border-red-200 dark:border-red-900/60 text-red-900 dark:text-red-200'
              : 'bg-amber-50/80 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/60 text-amber-900 dark:text-amber-200'
          }`}
        >
          {noticeLang !== 'en' && (
            <div className="mb-1 text-[11.5px] font-sans">
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
        <div className="text-xs text-slate-700 dark:text-slate-300 space-y-3 leading-relaxed">
          <p>Sir / Madam (महोदय/महोदया),</p>
          <p>
            The statutory scrutiny dossier submitted by your institution for Application ID{' '}
            <strong className="font-mono text-slate-900 dark:text-white">{application.id}</strong>{' '}
            has undergone multi-modal neural evidence auditing, forensic tampering localization, computer-vision architectural compliance check, and National DPI Authority Bridge reconciliation under the statutory provisions of the AICTE Approval Process Handbook (APH 2024–2027).
          </p>
          <p>
            {isFatal ? (
              <span className="text-red-700 dark:text-red-400 font-semibold">
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
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 space-y-2"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[11px]">
                  <span className="font-bold text-red-600 dark:text-red-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>
                      Item #{idx + 1}: {anom.category} (Risk Priority Number: {anom.rpnScore})
                    </span>
                  </span>
                  <span className="text-slate-500">
                    Neural Model: {anom.modelUsed} • Tamper Conf: {(anom.tamperProbability * 100).toFixed(1)}%
                  </span>
                </div>

                <div className="font-bold text-xs text-slate-900 dark:text-white">
                  {noticeLang === 'hi'
                    ? anom.titleHi
                    : noticeLang === 'en'
                    ? anom.titleEn
                    : `${anom.titleEn} / ${anom.titleHi}`}
                </div>

                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                  {noticeLang === 'hi'
                    ? anom.descriptionHi
                    : noticeLang === 'en'
                    ? anom.descriptionEn
                    : `${anom.descriptionEn} (${anom.descriptionHi})`}
                </p>

                {/* Evidence Diff Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10.5px] font-mono pt-1">
                  <div className="p-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-400 block text-[9.5px]">Uploaded Value:</span>
                    <span className="text-red-600 dark:text-red-400 font-bold">{anom.extractedValue}</span>
                  </div>
                  <div className="p-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-400 block text-[9.5px]">Authoritative Record / Statutory Norm:</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">{anom.authorityValue}</span>
                  </div>
                </div>

                <div className="text-[10.5px] font-mono text-sky-700 dark:text-sky-400 pt-1">
                  <strong>Statutory Clause Citation:</strong> {anom.aphClause}
                </div>
              </div>
            ))}
          </div>

          {/* Statutory Directives */}
          <div className="p-4 rounded-xl bg-slate-100/60 dark:bg-slate-800/40 text-xs text-slate-800 dark:text-slate-200 space-y-1.5 leading-relaxed">
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
        <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            {isDscSigned ? (
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                <div className="text-xs">
                  <div className="font-bold font-mono">
                    Digitally Signed with Class 3 DSC (eMudhra CCA India)
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                    Signatory: Shri R.K. Verma (RO-04, North-Western Region) • Signed: {dscSigningTime}
                  </div>
                  <div className="text-[9.5px] text-emerald-600 font-mono select-all mt-0.5">
                    Certificate SHA-256: {dscSignatureDigest}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-xs text-slate-500 flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-500" />
                <span>Pending Officer Digital Signature Certificate (Class 3 DSC) Sign-off</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 transition-all shadow-2xs cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Official Order</span>
            </button>

            {!isDscSigned ? (
              <button
                onClick={() => setIsDscModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20 transition-all hover:-translate-y-0.5 cursor-pointer"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Sign with Officer DSC</span>
              </button>
            ) : (
              <button
                onClick={handleDispatch}
                disabled={isDispatched}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-sky-600 hover:bg-sky-700 text-white shadow-md shadow-sky-600/20 transition-all hover:-translate-y-0.5 disabled:opacity-50 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isDispatched ? 'Dispatched & Logged' : 'Dispatch Order to Institution'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Class 3 Officer DSC Signing Modal */}
      {isDscModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150"
          onClick={() => setIsDscModalOpen(false)}
        >
          <div
            className="w-full max-w-lg liquid-glass-card rounded-2xl overflow-hidden shadow-2xl border border-indigo-500/30 bg-white dark:bg-slate-900 p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Class 3 Digital Signature Certificate (DSC) Authentication
                </h3>
              </div>
              <button
                onClick={() => setIsDscModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Certificate Details */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 font-mono text-xs space-y-1.5">
              <div>
                <span className="text-slate-400">Certifying Authority:</span>{' '}
                <strong className="text-slate-800 dark:text-slate-200">
                  eMudhra Sub-CA Class 3 Individual 2024 (CCA India)
                </strong>
              </div>
              <div>
                <span className="text-slate-400">Signatory Officer:</span>{' '}
                <strong className="text-slate-800 dark:text-slate-200">
                  Shri R.K. Verma (Regional Scrutiny Officer, RO-04)
                </strong>
              </div>
              <div>
                <span className="text-slate-400">Crypto Algorithm:</span>{' '}
                <strong className="text-emerald-600">RSA-2048 / SHA-256 Digest</strong>
              </div>
              <div>
                <span className="text-slate-400">Hardware Crypto Token:</span>{' '}
                <span className="text-slate-600 dark:text-slate-300">
                  SafeNet eToken 5110 (FIPS 140-2 Level 3 Validated)
                </span>
              </div>
            </div>

            {/* Token PIN Entry */}
            <div className="space-y-1.5 text-xs">
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Enter USB Crypto Token User PIN:
              </label>
              <input
                type="password"
                maxLength={8}
                value={tokenPin}
                onChange={(e) => setTokenPin(e.target.value)}
                placeholder="Enter 6-digit cryptographic PIN"
                className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono text-sm tracking-widest text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <p className="text-[10.5px] text-slate-400">
                Statutory requirement under Information Technology Act 2000 Section 35.
              </p>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setIsDscModalOpen(false)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDscSign}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20"
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
