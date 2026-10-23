'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage, useFilters } from '@/lib/context';
import { MOCK_APPLICATIONS, InstitutionalApplication, DocumentArtifact } from '@/lib/mock-data';
import { ForensicDocumentCanvas } from '@/components/workbench/ForensicDocumentCanvas';
import { BlueprintVectorViewer } from '@/components/workbench/BlueprintVectorViewer';
import { toast } from 'sonner';
import {
  ShieldAlert,
  ShieldCheck,
  FileCheck,
  AlertOctagon,
  FileText,
  UserX,
  Building,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  ChevronDown,
  Sparkles,
  Layers,
  ArrowRight,
  Send,
  Lock,
} from 'lucide-react';

export default function ScrutinyWorkbenchPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const { t, language } = useLanguage();
  const { applications, updateApplicationStatus } = useFilters();

  // Find target application or fallback to first
  const application = applications.find((a) => a.id === id) || applications[0];

  // Active Document tab index
  const [selectedDocIndex, setSelectedDocIndex] = useState<number>(0);
  const activeDocument: DocumentArtifact = application.documents[selectedDocIndex] || application.documents[0];

  // Active right pane tab
  const [activeInspectorTab, setActiveInspectorTab] = useState<'ENTITIES' | 'APH_NORM' | 'GHOST_FACULTY'>('ENTITIES');

  // Highlighted anomaly from BBox click
  const [activeAnomalyId, setActiveAnomalyId] = useState<string | null>(null);

  // Officer Decision Handler
  const handleOfficerDecision = (decision: 'APPROVE' | 'DEFICIENCY' | 'SHC') => {
    if (decision === 'APPROVE') {
      const note = 'Statutory approval logged in SHA-256 Scrutiny Ledger with Officer DSC sign-off.';
      updateApplicationStatus(application.id, 'Auto-Pre-Cleared', note);
      toast.success(`Extension of Approval (EoA) Approved for ${application.nameEn}`, {
        description: note,
      });
    } else if (decision === 'DEFICIENCY') {
      const note = 'Auto-compiled APH Chapter VII shortfall notice dispatched to institutional portal.';
      updateApplicationStatus(application.id, 'Deficiency Issued', note);
      toast.warning(`15-Day EVC Rectification Notice Generated for ${application.nameEn}`, {
        description: note,
      });
      setTimeout(() => router.push('/deficiencies'), 1000);
    } else {
      const note = 'Fatal fraud flag confirmed via TruFor & API Setu. Hearing summons drafted.';
      updateApplicationStatus(application.id, 'Fatal Fraud Alert', note);
      toast.error(`Escalated to Standing Hearing Committee (SHC) for ${application.nameEn}`, {
        description: note,
      });
      setTimeout(() => router.push('/deficiencies'), 1000);
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Top Workbench Control Bar */}
      <div className="p-4 liquid-glass-card rounded-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-sm">
        {/* Left: Institution Selector & Badges */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <select
              value={application.id}
              onChange={(e) => router.push(`/applications/${e.target.value}`)}
              className="appearance-none pl-3 pr-8 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-bold text-sm text-slate-900 dark:text-white shadow-2xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              {applications.map((app) => (
                <option key={app.id} value={app.id}>
                  {app.id} — {app.nameEn}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          </div>

          {/* ICI Score Pill */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-2xs font-mono text-xs">
            <span className="text-slate-400 font-medium">ICI Score:</span>
            <span
              className={`font-bold text-sm ${
                application.fatalGateTriggered
                  ? 'text-red-600 dark:text-red-400'
                  : application.iciScore >= 90
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-amber-600 dark:text-amber-400'
              }`}
            >
              {application.iciScore.toFixed(1)} / 100
            </span>
            {application.fatalGateTriggered && (
              <span className="px-1.5 py-0.2 rounded bg-red-600 text-white font-bold text-[10px]">
                FATAL VETO
              </span>
            )}
          </div>

          {/* Max RPN Pill */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-2xs font-mono text-xs">
            <span className="text-slate-400 font-medium">Max RPN:</span>
            <span className="font-bold text-sm text-slate-900 dark:text-white">{application.maxRpn}</span>
          </div>
        </div>

        {/* Right: Officer Statutory Decision Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleOfficerDecision('APPROVE')}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-all hover:-translate-y-0.5 inline-flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{t.btnApproveEoA}</span>
          </button>
          <button
            onClick={() => handleOfficerDecision('DEFICIENCY')}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-xs transition-all hover:-translate-y-0.5 inline-flex items-center gap-1.5"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{t.btnIssueDeficiency}</span>
          </button>
          <button
            onClick={() => handleOfficerDecision('SHC')}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white shadow-xs transition-all hover:-translate-y-0.5 inline-flex items-center gap-1.5"
          >
            <AlertOctagon className="w-3.5 h-3.5" />
            <span>{t.btnEscalateShc}</span>
          </button>
        </div>
      </div>

      {/* Document Tab Switcher */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-semibold">
        {application.documents.map((doc, idx) => {
          const isSelected = selectedDocIndex === idx;
          const isMismatch = doc.verificationState === 'MISMATCH_DETECTED';

          return (
            <button
              key={doc.id}
              onClick={() => setSelectedDocIndex(idx)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all shrink-0 ${
                isSelected
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20 font-bold'
                  : 'bg-white/70 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800'
              }`}
            >
              <span>{language === 'hi' ? doc.titleHi : doc.titleEn}</span>
              {doc.tamperAlert && (
                <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${isSelected ? 'bg-white text-red-600' : 'bg-red-500/10 text-red-600'}`}>
                  FLAG
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Synchronized Split-Pane Workstation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 min-h-[750px]">
        {/* Left Pane (7 cols / 55%): Interactive Multi-Spectral Document Viewer / Blueprint CAD */}
        <div className="lg:col-span-7 flex flex-col h-[750px]">
          {activeDocument.docType === 'BLUEPRINT' ? (
            <BlueprintVectorViewer
              rooms={application.blueprintRooms}
              selectedRoomId={activeAnomalyId}
              onSelectRoom={(id) => setActiveAnomalyId(id)}
            />
          ) : (
            <ForensicDocumentCanvas
              document={activeDocument}
              anomalies={application.anomalies}
              activeAnomalyId={activeAnomalyId}
              onSelectAnomaly={(id) => setActiveAnomalyId(id)}
            />
          )}
        </div>

        {/* Right Pane (5 cols / 45%): Evidence-Linked Inspector */}
        <div className="lg:col-span-5 flex flex-col h-[750px] liquid-glass-card rounded-2xl overflow-hidden shadow-sm">
          {/* Right Pane Tabs */}
          <div className="p-2 border-b border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md flex items-center justify-between text-xs font-semibold">
            <div className="inline-flex rounded-xl p-0.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 w-full">
              <button
                onClick={() => setActiveInspectorTab('ENTITIES')}
                className={`flex-1 py-1.5 rounded-lg transition-all text-center ${
                  activeInspectorTab === 'ENTITIES'
                    ? 'bg-white dark:bg-slate-900 text-sky-700 dark:text-sky-300 shadow-2xs font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {t.tabEntities}
              </button>
              <button
                onClick={() => setActiveInspectorTab('APH_NORM')}
                className={`flex-1 py-1.5 rounded-lg transition-all text-center ${
                  activeInspectorTab === 'APH_NORM'
                    ? 'bg-white dark:bg-slate-900 text-sky-700 dark:text-sky-300 shadow-2xs font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {t.tabApmMatrix}
              </button>
              <button
                onClick={() => setActiveInspectorTab('GHOST_FACULTY')}
                className={`flex-1 py-1.5 rounded-lg transition-all text-center ${
                  activeInspectorTab === 'GHOST_FACULTY'
                    ? 'bg-white dark:bg-slate-900 text-red-600 dark:text-red-400 shadow-2xs font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {t.tabGhostFaculty}
              </button>
            </div>
          </div>

          {/* Tab 1: Extracted Entities & DPI Handshake */}
          {activeInspectorTab === 'ENTITIES' && (
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                  Document Attributes &amp; Authority Reconciliation
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Side-by-side LayoutLMv3 extracted tokens vs. authoritative DigiLocker / State registry response
                </p>
              </div>

              {/* Document Metadata Pill */}
              <div className="p-3 rounded-xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/90 dark:border-slate-700 space-y-1.5 font-mono text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400 font-semibold">Issuing Repository:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{activeDocument.issuingAuthority}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400 font-semibold">Canonical URI:</span>
                  <span className="font-bold text-sky-600 dark:text-sky-400 truncate max-w-[220px]">{activeDocument.authorityUri}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400 font-semibold">Verification Status:</span>
                  <span
                    className={`font-bold px-1.5 py-0.2 rounded text-[10px] ${
                      activeDocument.verificationState === 'MISMATCH_DETECTED'
                        ? 'bg-red-500/10 text-red-700 dark:text-red-400 border border-red-500/20'
                        : activeDocument.verificationState === 'VERIFIED'
                        ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20'
                    }`}
                  >
                    {activeDocument.verificationState}
                  </span>
                </div>
              </div>

              {/* Side-by-Side Diff Table */}
              <div className="space-y-2.5">
                {activeDocument.extractedFields.map((field, idx) => {
                  const isHighlighted = activeAnomalyId === field.nameEn;

                  return (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl border transition-all ${
                        isHighlighted ? 'ring-2 ring-sky-500 shadow-md' : ''
                      } ${
                        field.isMismatch
                          ? 'bg-red-50/60 dark:bg-red-950/20 border-red-200 dark:border-red-900/60 shadow-2xs'
                          : 'bg-white/70 dark:bg-slate-800/50 border-slate-200/90 dark:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-slate-900 dark:text-white">
                          {language === 'hi' ? field.nameHi : field.nameEn}
                        </span>
                        <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                          OCR Conf: {Math.round(field.confidence * 100)}%
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                        <div className="p-2 rounded-lg bg-slate-100/90 dark:bg-slate-900/90">
                          <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">Uploaded PDF (OCR)</div>
                          <div className={`font-bold mt-0.5 ${field.isMismatch ? 'text-red-600 dark:text-red-400' : 'text-slate-800 dark:text-slate-200'}`}>
                            {field.ocrValue}
                          </div>
                        </div>

                        <div className="p-2 rounded-lg bg-slate-100/90 dark:bg-slate-900/90">
                          <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">Issuing Authority Record</div>
                          <div className={`font-bold mt-0.5 ${field.isMismatch ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-800 dark:text-slate-200'}`}>
                            {field.authorityValue}
                          </div>
                        </div>
                      </div>

                      {field.isMismatch && (
                        <div className="mt-2 text-[11px] font-medium text-red-700 dark:text-red-400 flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                          <span>Critical Discrepancy: Extracted value contradicts issuing registry record.</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}


          {/* Tab 2: APH 2024–27 Compliance Matrix */}
          {activeInspectorTab === 'APH_NORM' && (
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                  Approval Process Handbook Compliance Math
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Automated verification of FSI/FAR, Instructional Area, and 1:2:6 Cadre distribution
                </p>
              </div>

              {/* Built-up Area Component Grid */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700 space-y-2">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Total Built-up Area ($TB_&#123;req&#125;$) Breakdown
                </div>

                <div className="space-y-1.5 font-mono text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Instructional Area (INA):</span>
                    <span className="font-bold text-slate-900 dark:text-slate-100">
                      {application.landAndBuiltUp.inaAvailableSqm} / {application.landAndBuiltUp.inaRequiredSqm} m²
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Administrative Area (ADA):</span>
                    <span className="font-bold text-slate-900 dark:text-slate-100">
                      {application.landAndBuiltUp.adaAvailableSqm} / {application.landAndBuiltUp.adaRequiredSqm} m²
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Amenities Area (AMA):</span>
                    <span className="font-bold text-slate-900 dark:text-slate-100">
                      {application.landAndBuiltUp.amaAvailableSqm} / {application.landAndBuiltUp.amaRequiredSqm} m²
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Circulation Area (ACA = 0.25 × Carpet):</span>
                    <span className="font-bold text-slate-900 dark:text-slate-100">
                      {application.landAndBuiltUp.acaAvailableSqm} / {application.landAndBuiltUp.acaRequiredSqm} m²
                    </span>
                  </div>
                  <div className="pt-1.5 border-t border-slate-200 dark:border-slate-700 flex justify-between font-bold text-slate-900 dark:text-white">
                    <span>Total Built-up Area:</span>
                    <span>
                      {application.landAndBuiltUp.totalBuiltUpAvailableSqm} / {application.landAndBuiltUp.totalBuiltUpRequiredSqm} m²
                    </span>
                  </div>
                </div>
              </div>

              {/* Faculty Cadre Compliance */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700 space-y-2">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Cadre Ratio 1:2:6 Compliance
                </div>
                <div className="grid grid-cols-3 gap-2 text-center font-mono">
                  <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                    <div className="text-[10px] text-slate-400">Professors</div>
                    <div className="font-bold text-slate-800 dark:text-slate-200 mt-1">
                      {application.facultyMetrics.cadreAvailable.prof} / {application.facultyMetrics.cadreRequired.prof}
                    </div>
                  </div>
                  <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                    <div className="text-[10px] text-slate-400">Assoc. Profs</div>
                    <div className="font-bold text-slate-800 dark:text-slate-200 mt-1">
                      {application.facultyMetrics.cadreAvailable.assoc} / {application.facultyMetrics.cadreRequired.assoc}
                    </div>
                  </div>
                  <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                    <div className="text-[10px] text-slate-400">Asst. Profs</div>
                    <div className="font-bold text-slate-800 dark:text-slate-200 mt-1">
                      {application.facultyMetrics.cadreAvailable.asst} / {application.facultyMetrics.cadreRequired.asst}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Ghost Faculty Deduplication Inspector */}
          {activeInspectorTab === 'GHOST_FACULTY' && (
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-1.5">
                  <UserX className="w-4 h-4 text-red-600 dark:text-red-400" />
                  <span>Cross-Institutional Ghost Faculty Detections</span>
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  RetinaFace 5-point alignment + ArcFace 512-D vector search across 1.2M national faculty index
                </p>
              </div>

              <div className="space-y-3">
                {application.facultyRoster.map((fac) => {
                  const isDual = fac.epfoEcrStatus === 'DUAL_EMPLOYMENT_DETECTED';

                  return (
                    <div
                      key={fac.id}
                      className={`p-3 rounded-xl border transition-all ${
                        isDual
                          ? 'bg-red-50/70 dark:bg-red-950/20 border-red-300 dark:border-red-900/60 shadow-2xs'
                          : 'bg-white/60 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-700'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                            <span>{fac.name}</span>
                            {isDual && (
                              <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-red-600 text-white">
                                GHOST DETECTED
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                            {fac.designation} • {fac.department}
                          </div>
                        </div>

                        <div className="text-right font-mono text-[10px]">
                          <span className="text-slate-400">ArcFace Cosine: </span>
                          <span className={`font-bold ${isDual ? 'text-red-600 dark:text-red-400' : 'text-slate-600 dark:text-slate-300'}`}>
                            {fac.arcFaceSimilarityMax.toFixed(3)}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 mt-2 text-[11px] font-mono">
                        <div className="p-2 rounded bg-slate-100/80 dark:bg-slate-900/80">
                          <span className="text-[10px] text-slate-400 block">PAN & UAN:</span>
                          <span className="font-bold text-slate-800 dark:text-slate-200">{fac.pan}</span>
                          <span className="block text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{fac.uan}</span>
                        </div>
                        <div className="p-2 rounded bg-slate-100/80 dark:bg-slate-900/80">
                          <span className="text-[10px] text-slate-400 block">EPFO Status:</span>
                          <span className={`font-bold ${isDual ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                            {fac.epfoEcrStatus}
                          </span>
                          <span className="block text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                            50% Wage Rule: {fac.wageRule50Compliant ? 'Compliant' : 'VIOLATION'}
                          </span>
                        </div>
                      </div>

                      {isDual && fac.matchedInstitutionName && (
                        <div className="mt-2 p-2 rounded-lg bg-red-100/60 dark:bg-red-900/30 text-[11px] text-red-700 dark:text-red-300">
                          <strong>Active Concurrent Employer:</strong> {fac.matchedInstitutionName} (PID: {fac.matchedInstitutionPid})
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
