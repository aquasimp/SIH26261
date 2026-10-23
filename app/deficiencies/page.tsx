'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage, useFilters } from '@/lib/context';
import { MOCK_APPLICATIONS, InstitutionalApplication } from '@/lib/mock-data';
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
} from 'lucide-react';

export default function DeficienciesPage() {
  const { t, language } = useLanguage();
  const { applications } = useFilters();

  // Selected application
  const [selectedAppId, setSelectedAppId] = useState<string>('AICTE-2026-NW-0842');
  const application = applications.find((a) => a.id === selectedAppId) || applications[0];

  // Officer DSC signing state
  const [isDscSigned, setIsDscSigned] = useState<boolean>(false);
  const [isDispatched, setIsDispatched] = useState<boolean>(false);

  // 15-Day countdown timer simulation
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number }>({
    days: 14,
    hours: 18,
    minutes: 42,
    seconds: 15,
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

  const handleSignDsc = () => {
    setIsDscSigned(true);
    toast.success('Digitally Signed with Class 3 DSC (Officer: Shri R.K. Verma, RO-04)', {
      description: 'SHA-256 digital certificate appended to statutory dispatch notice.',
    });
  };

  const handleDispatch = () => {
    if (!isDscSigned) {
      toast.error('Mandatory Step: Sign with Officer DSC before dispatching order.');
      return;
    }
    setIsDispatched(true);
    toast.success(`Statutory Notice Dispatched to ${application.nameEn}`, {
      description: '15-day rectification clock commenced in institutional portal.',
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const isFatal = application.scrutinyStatus === 'Fatal Fraud Alert';

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Title & Target Institution Dropdown */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Statutory Notice &{' '}
            <span className="font-serif italic font-normal text-sky-700 dark:text-sky-400">
              Deficiency Generator
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Automated legal letterhead generation with exact APH 2024–27 citations and 15-day rectification clock
          </p>
        </div>

        {/* Institution Dropdown */}
        <div className="relative">
          <select
            value={selectedAppId}
            onChange={(e) => {
              setSelectedAppId(e.target.value);
              setIsDscSigned(false);
              setIsDispatched(false);
            }}
            className="appearance-none pl-3 pr-8 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white shadow-2xs cursor-pointer focus:outline-none"
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

      {/* 15-Day EVC Rectification Countdown Clock */}
      <div className="p-4 rounded-2xl border border-amber-500/30 bg-amber-500/10 dark:bg-amber-500/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
              {t.rectificationCountdown}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              APH 2024–27 Chapter VII Statutory Compliance Deadline: 05-04-2026 23:59 IST
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
            <div className="text-lg font-bold text-amber-600 dark:text-amber-400">{timeLeft.seconds}</div>
            <div className="text-[9px] uppercase font-semibold text-slate-400">Secs</div>
          </div>
        </div>
      </div>

      {/* Official Government Order Sheet */}
      <div className="rounded-2xl p-8 sm:p-10 space-y-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl">
        {/* Official Header */}
        <div className="text-center pb-6 border-b border-slate-200 dark:border-slate-800 space-y-1">
          <div className="w-12 h-12 mx-auto rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-800 dark:text-slate-200 mb-2">
            <Building className="w-6 h-6" />
          </div>
          <h2 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white tracking-tight uppercase">
            All India Council for Technical Education
          </h2>
          <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
            (A Statutory Body Under Ministry of Education, Govt. of India)
          </p>
          <p className="text-[11px] text-slate-400">
            Nelson Mandela Marg, Vasant Kunj, New Delhi - 110070 • www.aicte-india.org
          </p>
        </div>

        {/* Notice Dispatch Details */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs font-mono text-slate-600 dark:text-slate-400 gap-2">
          <div>
            <strong>File No:</strong> AICTE/UB/SCRUTINY/{application.id}/2026-27
          </div>
          <div>
            <strong>Date of Dispatch:</strong> 19-10-2026
          </div>
        </div>

        {/* Addressee */}
        <div className="text-xs text-slate-800 dark:text-slate-200 space-y-0.5">
          <p className="font-bold">To,</p>
          <p className="font-semibold">The Chairman / Secretary / Principal,</p>
          <p className="font-bold text-sm text-slate-900 dark:text-white">{application.nameEn}</p>
          <p className="text-slate-500">{application.city}, {application.state} • Permanent ID (PID): {application.pid}</p>
        </div>

        {/* Subject */}
        <div className="p-3 rounded-xl bg-slate-100/70 dark:bg-slate-800/70 text-xs font-bold text-slate-900 dark:text-white leading-relaxed">
          {isFatal ? (
            <span className="text-red-700 dark:text-red-400">
              SUBJECT: SHOW-CAUSE NOTICE FOR ESCLATION TO STANDING HEARING COMMITTEE (SHC) — CONFIRMED DOCUMENTARY FORGERY AND FRAUDULENT ENROLLMENT UNDER AICTE APPROVAL PROCESS HANDBOOK (APH 2024–27).
            </span>
          ) : (
            <span className="text-amber-800 dark:text-amber-300">
              SUBJECT: DEFICIENCY RECTIFICATION NOTICE UNDER AICTE APPROVAL PROCESS HANDBOOK (APH 2024–27) FOR ACADEMIC YEAR 2026–27 EXTENSION OF APPROVAL.
            </span>
          )}
        </div>

        {/* Order Body */}
        <div className="text-xs text-slate-700 dark:text-slate-300 space-y-3 leading-relaxed">
          <p>Sir/Madam,</p>
          <p>
            The institutional dossier submitted by your institution under Application ID <strong>{application.id}</strong> has undergone automated multi-modal evidence scrutiny, computer-vision architectural compliance audit, and National DPI Authority Bridge reconciliation under the provisions of the AICTE Approval Process Handbook (APH 2024–2027).
          </p>
          <p>
            The automated pre-scrutiny engine has identified the following statutory anomalies and compliance variances requiring immediate intervention:
          </p>

          {/* Anomaly Checklist */}
          <div className="space-y-3 pt-2">
            {application.anomalies.map((anom, idx) => (
              <div
                key={anom.id}
                className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 space-y-1.5"
              >
                <div className="flex items-center justify-between font-mono text-[11px]">
                  <span className="font-bold text-red-600 dark:text-red-400">
                    Deficiency Item #{idx + 1} ({anom.category})
                  </span>
                  <span className="text-slate-400">RPN: {anom.rpnScore}</span>
                </div>
                <div className="font-bold text-xs text-slate-900 dark:text-white">
                  {language === 'hi' ? anom.titleHi : anom.titleEn}
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400">
                  {language === 'hi' ? anom.descriptionHi : anom.descriptionEn}
                </p>
                <div className="text-[10px] font-mono text-sky-700 dark:text-sky-400">
                  {language === 'hi' ? 'वैधानिक नियम संदर्भ: ' : 'Statutory Rule Citation: '}{anom.aphClause}
                </div>
              </div>
            ))}
          </div>

          <p className="pt-2">
            You are hereby afforded a statutory period of <strong>15 days</strong> from the date of dispatch of this communication to submit rectified evidence or appear before the Standing Hearing Committee (SHC). Failure to rectify the cited deficiencies shall result in penal action, including reduction in approved intake, no-admission status, or withdrawal of approval.
          </p>
        </div>

        {/* DSC Signature Section */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            {isDscSigned ? (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5" />
                <div className="text-xs">
                  <div className="font-bold font-mono">Digitally Signed by Shri R.K. Verma</div>
                  <div className="text-[10px] text-emerald-600 dark:text-emerald-500">
                    Class 3 DSC • Controller of Certifying Authorities (CCA India)
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-xs text-slate-400 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" />
                <span>Pending Officer DSC Digital Signature</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 transition-all shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Official PDF</span>
            </button>

            {!isDscSigned ? (
              <button
                onClick={handleSignDsc}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-all hover:-translate-y-0.5"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Sign with Officer DSC</span>
              </button>
            ) : (
              <button
                onClick={handleDispatch}
                disabled={isDispatched}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-sky-600 hover:bg-sky-700 text-white shadow-xs transition-all hover:-translate-y-0.5 disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isDispatched ? 'Dispatched to Portal' : 'Dispatch to Institution'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
