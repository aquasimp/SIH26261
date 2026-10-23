'use client';

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useLanguage, useFilters } from '@/lib/context';
import { MOCK_APPLICATIONS, DocumentArtifact } from '@/lib/mock-data';
import { ForensicDocumentCanvas } from '@/components/workbench/ForensicDocumentCanvas';
import { BlueprintVectorViewer } from '@/components/workbench/BlueprintVectorViewer';
import { toast } from 'sonner';
import {
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  UserX,
  ChevronDown,
  BookOpen,
  Table as TableIcon,
  Copy,
  Check,
} from 'lucide-react';

export type DocumentTabKey = 'fire_noc' | 'land_deed' | 'blueprint' | 'faculty_roster' | 'balance_sheet';

const docTypeToTab: Record<string, DocumentTabKey> = {
  FIRE_NOC: 'fire_noc',
  LAND_DEED: 'land_deed',
  BLUEPRINT: 'blueprint',
  FACULTY_ROSTER: 'faculty_roster',
  BALANCE_SHEET: 'balance_sheet',
};

const tabToDocType: Record<DocumentTabKey, string> = {
  fire_noc: 'FIRE_NOC',
  land_deed: 'LAND_DEED',
  blueprint: 'BLUEPRINT',
  faculty_roster: 'FACULTY_ROSTER',
  balance_sheet: 'BALANCE_SHEET',
};

const SLANET_TABLE_DATA = [
  {
    id: 'ROW-1',
    sr: '1',
    name: 'Dr. Rajeshwar Sharma (Prof & HOD, CSE)',
    nameBBox: [42, 120, 260, 142],
    identifier: 'AAAPS1942K',
    identifierBio: 'B-FACULTY_PAN',
    identifierBBox: [280, 120, 390, 142],
    value: '100928174619',
    valueBio: 'B-EPFO_UAN',
    valueBBox: [410, 120, 540, 142],
    confidence: 0.985,
  },
  {
    id: 'ROW-2',
    sr: '2',
    name: 'Tektronix TBS-2000B Digital Oscilloscope (4-Ch)',
    nameBBox: [42, 145, 260, 168],
    identifier: 'INV-2025-TEK-9941',
    identifierBio: 'B-INVOICE_SERIAL',
    identifierBBox: [280, 145, 390, 168],
    value: '₹ 1,84,500',
    valueBio: 'B-EQUIPMENT_COST',
    valueBBox: [410, 145, 540, 168],
    confidence: 0.992,
  },
  {
    id: 'ROW-3',
    sr: '3',
    name: 'Haas MiniMill 5-Axis CNC Milling Center',
    nameBBox: [42, 170, 260, 192],
    identifier: 'INV-2024-HAAS-4412',
    identifierBio: 'B-INVOICE_SERIAL',
    identifierBBox: [280, 170, 390, 192],
    value: '₹ 18,50,000',
    valueBio: 'B-EQUIPMENT_COST',
    valueBBox: [410, 170, 540, 192],
    confidence: 0.978,
  },
  {
    id: 'ROW-4',
    sr: '4',
    name: 'HP Z2 Tower G9 Workstations (x32 Cluster)',
    nameBBox: [42, 195, 260, 218],
    identifier: 'INV-2025-HP-8192',
    identifierBio: 'B-INVOICE_SERIAL',
    identifierBBox: [280, 195, 390, 218],
    value: '₹ 38,40,000',
    valueBio: 'B-EQUIPMENT_COST',
    valueBBox: [410, 195, 540, 218],
    confidence: 0.984,
  },
  {
    id: 'ROW-5',
    sr: '5',
    name: 'Dr. Meenakshi Sundaram (Assoc Prof, ECE)',
    nameBBox: [42, 220, 260, 242],
    identifier: 'BSKPS8821M',
    identifierBio: 'B-FACULTY_PAN',
    identifierBBox: [280, 220, 390, 242],
    value: '100481927361',
    valueBio: 'B-EPFO_UAN',
    valueBBox: [410, 220, 540, 242],
    confidence: 0.967,
  },
];

const SLANET_CELLS_MAP: Record<string, { text: string; bioTag: string; bbox: number[]; confidence: number }> = {
  'ROW-1-name': { text: 'Dr. Rajeshwar Sharma', bioTag: 'B-FACULTY_NAME', bbox: [42, 120, 260, 142], confidence: 0.985 },
  'ROW-1-identifier': { text: 'AAAPS1942K', bioTag: 'B-FACULTY_PAN', bbox: [280, 120, 390, 142], confidence: 0.991 },
  'ROW-1-value': { text: '100928174619', bioTag: 'B-EPFO_UAN', bbox: [410, 120, 540, 142], confidence: 0.982 },
  'ROW-2-name': { text: 'Tektronix TBS-2000B Digital Oscilloscope', bioTag: 'B-EQUIPMENT_NAME', bbox: [42, 145, 260, 168], confidence: 0.992 },
  'ROW-2-identifier': { text: 'INV-2025-TEK-9941', bioTag: 'B-INVOICE_SERIAL', bbox: [280, 145, 390, 168], confidence: 0.994 },
  'ROW-2-value': { text: '₹ 1,84,500', bioTag: 'B-EQUIPMENT_COST', bbox: [410, 145, 540, 168], confidence: 0.988 },
  'ROW-3-name': { text: 'Haas MiniMill 5-Axis CNC Center', bioTag: 'B-EQUIPMENT_NAME', bbox: [42, 170, 260, 192], confidence: 0.978 },
  'ROW-3-identifier': { text: 'INV-2024-HAAS-4412', bioTag: 'B-INVOICE_SERIAL', bbox: [280, 170, 390, 192], confidence: 0.985 },
  'ROW-3-value': { text: '₹ 18,50,000', bioTag: 'B-EQUIPMENT_COST', bbox: [410, 170, 540, 192], confidence: 0.982 },
  'ROW-4-name': { text: 'HP Z2 Tower G9 Workstations (x32 Cluster)', bioTag: 'B-EQUIPMENT_NAME', bbox: [42, 195, 260, 218], confidence: 0.984 },
  'ROW-4-identifier': { text: 'INV-2025-HP-8192', bioTag: 'B-INVOICE_SERIAL', bbox: [280, 195, 390, 218], confidence: 0.989 },
  'ROW-4-value': { text: '₹ 38,40,000', bioTag: 'B-EQUIPMENT_COST', bbox: [410, 195, 540, 218], confidence: 0.986 },
  'ROW-5-name': { text: 'Dr. Meenakshi Sundaram', bioTag: 'B-FACULTY_NAME', bbox: [42, 220, 260, 242], confidence: 0.967 },
  'ROW-5-identifier': { text: 'BSKPS8821M', bioTag: 'B-FACULTY_PAN', bbox: [280, 220, 390, 242], confidence: 0.974 },
  'ROW-5-value': { text: '100481927361', bioTag: 'B-EPFO_UAN', bbox: [410, 220, 540, 242], confidence: 0.971 },
};

const SLANET_HTML_TREE_STRING = `<table class="slanet-reconstructed-dom" teds="0.9667" backbone="Improved_SLANet_LCNetV2_Mish_EOS">
  <thead>
    <tr>
      <th bbox="[42, 90, 80, 115]">#</th>
      <th bbox="[82, 90, 260, 115]" colspan="1">Description / Entity Name</th>
      <th bbox="[280, 90, 390, 115]">Identifier (PAN / Invoice Serial)</th>
      <th bbox="[410, 90, 540, 115]">Value (EPFO UAN / Cost)</th>
      <th bbox="[550, 90, 620, 115]">Confidence</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>1</td>
      <td tag="B-FACULTY_NAME" bbox="[42, 120, 260, 142]">Dr. Rajeshwar Sharma</td>
      <td tag="B-FACULTY_PAN" bbox="[280, 120, 390, 142]">AAAPS1942K</td>
      <td tag="B-EPFO_UAN" bbox="[410, 120, 540, 142]">100928174619</td>
      <td conf="0.985">98.5%</td>
    </tr>
    <tr>
      <td>2</td>
      <td tag="B-EQUIPMENT_NAME" bbox="[42, 145, 260, 168]">Tektronix TBS-2000B Oscilloscope</td>
      <td tag="B-INVOICE_SERIAL" bbox="[280, 145, 390, 168]">INV-2025-TEK-9941</td>
      <td tag="B-EQUIPMENT_COST" bbox="[410, 145, 540, 168]">₹ 1,84,500</td>
      <td conf="0.992">99.2%</td>
    </tr>
    <tr>
      <td>3</td>
      <td tag="B-EQUIPMENT_NAME" bbox="[42, 170, 260, 192]">Haas MiniMill 5-Axis CNC Center</td>
      <td tag="B-INVOICE_SERIAL" bbox="[280, 170, 390, 192]">INV-2024-HAAS-4412</td>
      <td tag="B-EQUIPMENT_COST" bbox="[410, 170, 540, 192]">₹ 18,50,000</td>
      <td conf="0.978">97.8%</td>
    </tr>
    <tr>
      <td>4</td>
      <td tag="B-EQUIPMENT_NAME" bbox="[42, 195, 260, 218]">HP Z2 Tower G9 Workstations (x32)</td>
      <td tag="B-INVOICE_SERIAL" bbox="[280, 195, 390, 218]">INV-2025-HP-8192</td>
      <td tag="B-EQUIPMENT_COST" bbox="[410, 195, 540, 218]">₹ 38,40,000</td>
      <td conf="0.984">98.4%</td>
    </tr>
    <tr>
      <td>5</td>
      <td tag="B-FACULTY_NAME" bbox="[42, 220, 260, 242]">Dr. Meenakshi Sundaram</td>
      <td tag="B-FACULTY_PAN" bbox="[280, 220, 390, 242]">BSKPS8821M</td>
      <td tag="B-EPFO_UAN" bbox="[410, 220, 540, 242]">100481927361</td>
      <td conf="0.967">96.7%</td>
    </tr>
  </tbody>
</table>`;

const SLANET_JSON_GRAPH_STRING = `{
  "subsystem": "PP-StructureV3 + Improved SLANet-LCNetV2 (Mish + EOS)",
  "metrics": {
    "teds_score": 0.9667,
    "tree_edit_distance": 0.0333,
    "kie_sequence_f1": 0.942,
    "eos_dynamic_steps": 28
  },
  "tokens": [
    { "id": "tok_1", "text": "AAAPS1942K", "bio_tag": "B-FACULTY_PAN", "bbox": [120, 280, 142, 390], "confidence": 0.991 },
    { "id": "tok_2", "text": "100928174619", "bio_tag": "B-EPFO_UAN", "bbox": [120, 410, 142, 540], "confidence": 0.982 },
    { "id": "tok_3", "text": "INV-2025-TEK-9941", "bio_tag": "B-INVOICE_SERIAL", "bbox": [145, 280, 168, 390], "confidence": 0.994 },
    { "id": "tok_4", "text": "1,84,500", "bio_tag": "B-EQUIPMENT_COST", "bbox": [145, 410, 168, 540], "confidence": 0.976 },
    { "id": "tok_5", "text": "INV-2024-HAAS-4412", "bio_tag": "B-INVOICE_SERIAL", "bbox": [170, 280, 192, 390], "confidence": 0.978 },
    { "id": "tok_6", "text": "18,50,000", "bio_tag": "B-EQUIPMENT_COST", "bbox": [170, 410, 192, 540], "confidence": 0.982 },
    { "id": "tok_7", "text": "INV-2025-HP-8192", "bio_tag": "B-INVOICE_SERIAL", "bbox": [195, 280, 218, 390], "confidence": 0.989 },
    { "id": "tok_8", "text": "38,40,000", "bio_tag": "B-EQUIPMENT_COST", "bbox": [195, 410, 218, 540], "confidence": 0.986 },
    { "id": "tok_9", "text": "BSKPS8821M", "bio_tag": "B-FACULTY_PAN", "bbox": [220, 280, 242, 390], "confidence": 0.974 },
    { "id": "tok_10", "text": "100481927361", "bio_tag": "B-EPFO_UAN", "bbox": [220, 410, 242, 540], "confidence": 0.971 }
  ],
  "graph_edges": [
    { "head": "tok_1", "tail": "tok_2", "type": "FACULTY_EPFO_CROSS_RECORD" },
    { "head": "tok_3", "tail": "tok_4", "type": "INVOICE_EQUIPMENT_COST_LINK" },
    { "head": "tok_5", "tail": "tok_6", "type": "INVOICE_EQUIPMENT_COST_LINK" },
    { "head": "tok_7", "tail": "tok_8", "type": "INVOICE_EQUIPMENT_COST_LINK" },
    { "head": "tok_9", "tail": "tok_10", "type": "FACULTY_EPFO_CROSS_RECORD" }
  ]
}`;

export default function ScrutinyWorkbenchPage() {
  const router = useRouter();
  const routeParams = useParams<{ id: string }>();
  const id = routeParams?.id || 'AICTE-2026-NW-0842';

  const { t, language } = useLanguage();
  const {
    applications,
    approveApplicationEoA,
    issueDeficiencyNotice,
    escalateToStandingHearingCommittee,
  } = useFilters();

  // Find target application or fallback to first
  const application = applications.find((a) => a.id === id) || applications[0] || MOCK_APPLICATIONS[0];

  // Active Document Tab state
  const [activeDocumentTab, setActiveDocumentTab] = useState<DocumentTabKey>('fire_noc');

  // Find corresponding document from active tab
  const activeDocType = tabToDocType[activeDocumentTab];
  const activeDocument: DocumentArtifact =
    application.documents.find((d) => d.docType === activeDocType) || application.documents[0];

  // Active right pane tab
  const [activeInspectorTab, setActiveInspectorTab] = useState<'ENTITIES' | 'APH_NORM' | 'GHOST_FACULTY' | 'SLANET_TABLE'>('ENTITIES');
  const [slanetViewMode, setSlanetViewMode] = useState<'VISUAL' | 'HTML_DOM' | 'TOKEN_GRAPH'>('VISUAL');
  const [selectedCellId, setSelectedCellId] = useState<string | null>(null);
  const [copiedType, setCopiedType] = useState<string | null>(null);

  // Selected anomaly or entity ID for bidirectional synchronization
  const [selectedAnomalyId, setSelectedAnomalyId] = useState<string | null>('Valid Upto Date');

  // Active APH Citation banner
  const [activeAphCitation, setActiveAphCitation] = useState<{
    clause: string;
    description: string;
    rule: string;
  } | null>({
    clause: 'APH 2024–27 Chapter VII & Annexure 16, Clause 2.1',
    description: 'Mandatory Fire Safety Certification Validity Window',
    rule: 'Educational buildings must possess a non-expired Fire NOC with verifiable e-District registration.',
  });

  // Handle BBox click on ForensicDocumentCanvas
  const handleSelectAnomalyFromCanvas = (identifier: string | null) => {
    setSelectedAnomalyId(identifier);

    if (!identifier) return;

    setActiveInspectorTab('ENTITIES');

    const matchingAnomaly = application.anomalies.find(
      (a) => a.id === identifier || a.extractedValue.includes(identifier) || a.titleEn.includes(identifier)
    );

    const matchingField = activeDocument.extractedFields.find((f) => f.nameEn === identifier);

    if (matchingAnomaly) {
      setActiveAphCitation({
        clause: matchingAnomaly.aphClause,
        description: matchingAnomaly.titleEn,
        rule: matchingAnomaly.descriptionEn,
      });
    } else if (matchingField) {
      if (matchingField.nameEn.includes('Valid') || matchingField.nameEn.includes('Date')) {
        setActiveAphCitation({
          clause: 'APH 2024–27 Chapter VII & Annexure 16, Clause 2.1',
          description: 'Mandatory Fire Safety Certification Validity Window',
          rule: 'Validity must extend through entire current academic scrutiny cycle.',
        });
      } else if (matchingField.nameEn.includes('Area') || matchingField.nameEn.includes('Acres')) {
        setActiveAphCitation({
          clause: 'APH 2024–27 Chapter I Clause 1.4 & Appendix 4',
          description: 'Minimum Land Acreage & Contiguity Mandate',
          rule: 'Urban engineering technical institutions require min 2.50 contiguous acres verified against revenue records.',
        });
      } else if (matchingField.nameEn.includes('Lab') || matchingField.nameEn.includes('Built-up')) {
        setActiveAphCitation({
          clause: 'APH 2024–27 Chapter VII Clause 7.1',
          description: 'Instructional Area Standards for Engineering Laboratories',
          rule: 'Specialized laboratories mandate 66.0 m² carpet area minimum computed via architectural boundaries.',
        });
      }
    }

    setTimeout(() => {
      const sanitizedId = identifier.replace(/[^a-zA-Z0-9_-]/g, '_');
      const el = document.getElementById(`entity-row-${sanitizedId}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  const handleSelectFieldFromInspector = (fieldName: string, docType?: string) => {
    setSelectedAnomalyId(fieldName);

    if (docType && docTypeToTab[docType]) {
      setActiveDocumentTab(docTypeToTab[docType]);
    } else {
      const foundDoc = application.documents.find((d) =>
        d.extractedFields.some((f) => f.nameEn === fieldName)
      );
      if (foundDoc && docTypeToTab[foundDoc.docType]) {
        setActiveDocumentTab(docTypeToTab[foundDoc.docType]);
      }
    }

    const matchingAnomaly = application.anomalies.find((a) => a.titleEn.includes(fieldName) || a.extractedValue.includes(fieldName));
    if (matchingAnomaly) {
      setActiveAphCitation({
        clause: matchingAnomaly.aphClause,
        description: matchingAnomaly.titleEn,
        rule: matchingAnomaly.descriptionEn,
      });
    }
  };

  const handleOfficerDecision = async (decision: 'APPROVE' | 'DEFICIENCY' | 'SHC') => {
    if (decision === 'APPROVE') {
      await approveApplicationEoA(
        application.id,
        'Statutory approval for EoA 2026–27 granted with Class-3 Officer DSC sign-off.'
      );
    } else if (decision === 'DEFICIENCY') {
      await issueDeficiencyNotice(
        application.id,
        15,
        'Auto-compiled APH Chapter VII shortfall notice dispatched to institutional portal.'
      );
    } else {
      await escalateToStandingHearingCommittee(
        application.id,
        'Fatal fraud flag confirmed via TruFor & API Setu. Hearing summons drafted under APH Chapter VIII.'
      );
    }
  };

  return (
    <div className="space-y-4 animate-glass-in">
      {/* Top Workbench Control Bar */}
      <div className="p-4 sm:p-5 liquid-glass-card rounded-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-md">
        {/* Left: Institution Selector & Badges */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <select
              value={application.id}
              onChange={(e) => router.push(`/applications/${e.target.value}`)}
              className="appearance-none pl-3.5 pr-9 py-2 rounded-xl glass-well font-bold text-xs sm:text-sm text-[var(--text-primary)] shadow-2xs cursor-pointer focus:outline-none"
            >
              {applications.map((app) => (
                <option key={app.id} value={app.id}>
                  {app.id} — {app.nameEn}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-faint)]" />
          </div>

          {/* ICI Score Pill */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl glass-well shadow-2xs text-xs font-semibold">
            <span className="text-[var(--text-muted)] font-medium">ICI Score:</span>
            <span className="font-bold text-sm tabular-nums text-[var(--text-primary)]">
              {application.iciScore.toFixed(1)} / 100
            </span>
            {application.fatalGateTriggered && (
              <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white font-bold text-[10px]">
                FATAL VETO
              </span>
            )}
          </div>

          {/* Max RPN Pill */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl glass-well shadow-2xs text-xs font-semibold">
            <span className="text-[var(--text-muted)] font-medium">Max RPN:</span>
            <span className="font-bold text-sm tabular-nums text-[var(--text-primary)]">{application.maxRpn}</span>
          </div>
        </div>

        {/* Right: Officer Statutory Decision Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => handleOfficerDecision('APPROVE')}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all hover:-translate-y-0.5 inline-flex items-center gap-1.5 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{t.btnApproveEoA}</span>
          </button>
          <button
            onClick={() => handleOfficerDecision('DEFICIENCY')}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-sm transition-all hover:-translate-y-0.5 inline-flex items-center gap-1.5 cursor-pointer"
          >
            <AlertTriangle className="w-4 h-4" />
            <span>{t.btnIssueDeficiency}</span>
          </button>
          <button
            onClick={() => handleOfficerDecision('SHC')}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-sm transition-all hover:-translate-y-0.5 inline-flex items-center gap-1.5 cursor-pointer"
          >
            <AlertOctagon className="w-4 h-4" />
            <span>{t.btnEscalateShc}</span>
          </button>
        </div>
      </div>

      {/* AICTE APH 2024–27 Citation Banner */}
      {activeAphCitation && (
        <div className="p-3.5 rounded-2xl glass-well flex items-start gap-3 shadow-xs">
          <BookOpen className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
          <div className="text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sky-900 dark:text-sky-200">{activeAphCitation.clause}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-200/80 dark:bg-sky-900/60 text-sky-800 dark:text-sky-300 font-bold uppercase tracking-wider">
                Statutory Citation
              </span>
            </div>
            <p className="text-[var(--text-primary)] font-semibold mt-0.5">
              {activeAphCitation.description}
            </p>
            <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
              {activeAphCitation.rule}
            </p>
          </div>
        </div>
      )}

      {/* Document Tab Switcher */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-semibold">
        {application.documents.map((doc) => {
          const tabKey = docTypeToTab[doc.docType] || 'fire_noc';
          const isSelected = activeDocumentTab === tabKey;

          return (
            <button
              key={doc.id}
              onClick={() => {
                setActiveDocumentTab(tabKey);
                if (doc.extractedFields.length > 0) {
                  setSelectedAnomalyId(doc.extractedFields[0].nameEn);
                }
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all shrink-0 cursor-pointer ${
                isSelected
                  ? 'btn-liquid-primary shadow-sm font-bold'
                  : 'btn-liquid-secondary'
              }`}
            >
              <span>{language === 'hi' ? doc.titleHi : doc.titleEn}</span>
              {doc.tamperAlert && (
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isSelected ? 'bg-white text-rose-600' : 'bg-rose-500/15 text-rose-600 dark:text-rose-400'
                  }`}
                >
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
              selectedRoomId={selectedAnomalyId}
              onSelectRoom={(id) => handleSelectAnomalyFromCanvas(id)}
            />
          ) : (
            <ForensicDocumentCanvas
              document={activeDocument}
              anomalies={application.anomalies}
              activeAnomalyId={selectedAnomalyId}
              onSelectAnomaly={handleSelectAnomalyFromCanvas}
            />
          )}
        </div>

        {/* Right Pane (5 cols / 45%): Evidence-Linked Inspector */}
        <div className="lg:col-span-5 flex flex-col h-[750px] liquid-glass-card rounded-2xl overflow-hidden shadow-md">
          {/* Right Pane Tabs */}
          <div className="p-2 border-b border-[var(--glass-well-border)] flex items-center justify-between text-xs font-semibold">
            <div className="glass-well inline-flex rounded-xl p-0.5 w-full text-[11px]">
              <button
                onClick={() => setActiveInspectorTab('ENTITIES')}
                className={`flex-1 py-1.5 rounded-lg transition-all text-center cursor-pointer ${
                  activeInspectorTab === 'ENTITIES'
                    ? 'btn-liquid-primary shadow-xs font-bold'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
                title="Extracted Document Attributes & Authority Reconciliation"
              >
                {t.tabEntities}
              </button>
              <button
                onClick={() => setActiveInspectorTab('APH_NORM')}
                className={`flex-1 py-1.5 rounded-lg transition-all text-center cursor-pointer ${
                  activeInspectorTab === 'APH_NORM'
                    ? 'btn-liquid-primary shadow-xs font-bold'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
                title="Approval Process Handbook Chapter VII Deterministic Math"
              >
                {t.tabApmMatrix}
              </button>
              <button
                onClick={() => setActiveInspectorTab('GHOST_FACULTY')}
                className={`flex-1 py-1.5 rounded-lg transition-all text-center cursor-pointer ${
                  activeInspectorTab === 'GHOST_FACULTY'
                    ? 'btn-liquid-primary shadow-xs font-bold'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
                title="Cross-Institutional RetinaFace / ArcFace Ghost Faculty Search"
              >
                {t.tabGhostFaculty}
              </button>
              <button
                onClick={() => setActiveInspectorTab('SLANET_TABLE')}
                className={`flex-1 py-1.5 rounded-lg transition-all text-center cursor-pointer ${
                  activeInspectorTab === 'SLANET_TABLE'
                    ? 'btn-liquid-primary shadow-xs font-bold'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
                title="PP-StructureV3 + Improved SLANet Table DOM & LayoutLMv3 KIE"
              >
                {t.tabTableExtractor}
              </button>
            </div>
          </div>

          {/* Tab 1: Extracted Entities & DPI Handshake */}
          {activeInspectorTab === 'ENTITIES' && (
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
              <div>
                <h3 className="font-bold text-[var(--text-primary)] text-sm">
                  Document Attributes &amp; Authority Reconciliation
                </h3>
                <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                  Click any row to switch document and highlight corresponding bounding box on canvas
                </p>
              </div>

              {/* Document Metadata Pill */}
              <div className="p-3.5 rounded-xl glass-well space-y-1.5 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-[var(--text-muted)] font-semibold">Issuing Repository:</span>
                  <span className="font-bold text-[var(--text-primary)]">{activeDocument.issuingAuthority}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-muted)] font-semibold">Canonical URI:</span>
                  <span className="font-mono font-bold text-sky-600 dark:text-sky-400 truncate max-w-[220px]">
                    {activeDocument.authorityUri}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-muted)] font-semibold">Verification Status:</span>
                  <span
                    className={`font-bold px-2 py-0.5 rounded-full text-[10px] ${
                      activeDocument.verificationState === 'MISMATCH_DETECTED'
                        ? 'pill-fatal'
                        : activeDocument.verificationState === 'VERIFIED'
                        ? 'pill-verified'
                        : 'pill-deficiency'
                    }`}
                  >
                    {activeDocument.verificationState}
                  </span>
                </div>
              </div>

              {/* Side-by-Side Diff Table */}
              <div className="space-y-2.5">
                {activeDocument.extractedFields.map((field, idx) => {
                  const sanitizedId = field.nameEn.replace(/[^a-zA-Z0-9_-]/g, '_');
                  const isHighlighted = selectedAnomalyId === field.nameEn;

                  return (
                    <div
                      key={idx}
                      id={`entity-row-${sanitizedId}`}
                      onClick={() => handleSelectFieldFromInspector(field.nameEn, activeDocument.docType)}
                      className={`p-3.5 rounded-xl transition-all cursor-pointer ${
                        isHighlighted ? 'ring-2 ring-sky-500 shadow-md bg-sky-500/10' : ''
                      } ${
                        field.isMismatch
                          ? 'bg-rose-500/10 border border-rose-500/30'
                          : 'glass-well'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                          {isHighlighted && <span className="w-2 h-2 rounded-full bg-sky-500 animate-ping" />}
                          <span>{language === 'hi' ? field.nameHi : field.nameEn}</span>
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full glass-well text-[var(--text-muted)]">
                          OCR Conf: {Math.round(field.confidence * 100)}%
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                        <div className="p-2.5 rounded-xl bg-white/40 dark:bg-black/20 border border-[var(--glass-well-border)]">
                          <div className="text-[10px] text-[var(--text-muted)] uppercase font-semibold">
                            Uploaded PDF (OCR)
                          </div>
                          <div
                            className={`font-bold mt-0.5 ${
                              field.isMismatch ? 'text-rose-600 dark:text-rose-400' : 'text-[var(--text-primary)]'
                            }`}
                          >
                            {field.ocrValue}
                          </div>
                        </div>

                        <div className="p-2.5 rounded-xl bg-white/40 dark:bg-black/20 border border-[var(--glass-well-border)]">
                          <div className="text-[10px] text-[var(--text-muted)] uppercase font-semibold">
                            Issuing Authority Record
                          </div>
                          <div
                            className={`font-bold mt-0.5 ${
                              field.isMismatch
                                ? 'text-emerald-700 dark:text-emerald-400'
                                : 'text-[var(--text-primary)]'
                            }`}
                          >
                            {field.authorityValue}
                          </div>
                        </div>
                      </div>

                      {field.isMismatch && (
                        <div className="mt-2 text-[11px] font-medium text-rose-700 dark:text-rose-400 flex items-center gap-1.5">
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
                <h3 className="font-bold text-[var(--text-primary)] text-sm">
                  Approval Process Handbook Compliance Math
                </h3>
                <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                  Automated verification of FSI/FAR, Instructional Area, and 1:2:6 Cadre distribution
                </p>
              </div>

              {/* Built-up Area Component Grid */}
              <div className="p-3.5 rounded-xl glass-well space-y-2">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-faint)]">
                  Total Built-up Area ($TB_&#123;req&#125;$) Breakdown
                </div>

                <div className="space-y-1.5 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-[var(--text-muted)]">Instructional Area (INA):</span>
                    <span className="font-bold tabular-nums text-[var(--text-primary)]">
                      {application.landAndBuiltUp.inaAvailableSqm} / {application.landAndBuiltUp.inaRequiredSqm} m²
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-muted)]">Administrative Area (ADA):</span>
                    <span className="font-bold tabular-nums text-[var(--text-primary)]">
                      {application.landAndBuiltUp.adaAvailableSqm} / {application.landAndBuiltUp.adaRequiredSqm} m²
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-muted)]">Amenities Area (AMA):</span>
                    <span className="font-bold tabular-nums text-[var(--text-primary)]">
                      {application.landAndBuiltUp.amaAvailableSqm} / {application.landAndBuiltUp.amaRequiredSqm} m²
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-muted)]">Circulation Area (ACA = 0.25 × Carpet):</span>
                    <span className="font-bold tabular-nums text-[var(--text-primary)]">
                      {application.landAndBuiltUp.acaAvailableSqm} / {application.landAndBuiltUp.acaRequiredSqm} m²
                    </span>
                  </div>
                  <div className="pt-2 border-t border-[var(--glass-well-border)] flex justify-between font-bold text-[var(--text-primary)]">
                    <span>Total Built-up Area:</span>
                    <span className="tabular-nums">
                      {application.landAndBuiltUp.totalBuiltUpAvailableSqm} / {application.landAndBuiltUp.totalBuiltUpRequiredSqm} m²
                    </span>
                  </div>
                </div>
              </div>

              {/* Faculty Cadre Compliance */}
              <div className="p-3.5 rounded-xl glass-well space-y-2">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-faint)]">
                  Cadre Ratio 1:2:6 Compliance
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2.5 rounded-xl bg-white/40 dark:bg-black/20 border border-[var(--glass-well-border)]">
                    <div className="text-[10px] text-[var(--text-faint)] font-semibold">Professors</div>
                    <div className="font-bold text-[var(--text-primary)] mt-1 tabular-nums">
                      {application.facultyMetrics.cadreAvailable.prof} / {application.facultyMetrics.cadreRequired.prof}
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/40 dark:bg-black/20 border border-[var(--glass-well-border)]">
                    <div className="text-[10px] text-[var(--text-faint)] font-semibold">Assoc. Profs</div>
                    <div className="font-bold text-[var(--text-primary)] mt-1 tabular-nums">
                      {application.facultyMetrics.cadreAvailable.assoc} / {application.facultyMetrics.cadreRequired.assoc}
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/40 dark:bg-black/20 border border-[var(--glass-well-border)]">
                    <div className="text-[10px] text-[var(--text-faint)] font-semibold">Asst. Profs</div>
                    <div className="font-bold text-[var(--text-primary)] mt-1 tabular-nums">
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
                <h3 className="font-bold text-[var(--text-primary)] text-sm flex items-center gap-1.5">
                  <UserX className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                  <span>Cross-Institutional Ghost Faculty Detections</span>
                </h3>
                <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                  RetinaFace 5-point alignment + ArcFace 512-D vector search across 1.2M national faculty index
                </p>
              </div>

              <div className="space-y-3">
                {application.facultyRoster.map((fac) => {
                  const isDual = fac.epfoEcrStatus === 'DUAL_EMPLOYMENT_DETECTED';

                  return (
                    <div
                      key={fac.id}
                      onClick={() => handleSelectFieldFromInspector(fac.name, 'FACULTY_ROSTER')}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                        isDual
                          ? 'bg-rose-500/10 border-rose-500/30'
                          : 'glass-well'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                            <span>{fac.name}</span>
                            {isDual && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-600 text-white">
                                GHOST DETECTED
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-[var(--text-muted)] mt-0.5">
                            {fac.designation} • {fac.department}
                          </div>
                        </div>

                        <div className="text-right text-[10px]">
                          <span className="text-[var(--text-faint)]">ArcFace Cosine: </span>
                          <span className={`font-bold tabular-nums ${isDual ? 'text-rose-600 dark:text-rose-400' : 'text-[var(--text-secondary)]'}`}>
                            {fac.arcFaceSimilarityMax.toFixed(3)}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 mt-2 text-[11px]">
                        <div className="p-2 rounded-xl bg-white/40 dark:bg-black/20 border border-[var(--glass-well-border)]">
                          <span className="text-[10px] text-[var(--text-faint)] block uppercase font-semibold">PAN &amp; UAN:</span>
                          <span className="font-mono font-bold text-[var(--text-primary)]">{fac.pan}</span>
                          <span className="block font-mono text-[10px] text-[var(--text-muted)] mt-0.5">{fac.uan}</span>
                        </div>
                        <div className="p-2 rounded-xl bg-white/40 dark:bg-black/20 border border-[var(--glass-well-border)]">
                          <span className="text-[10px] text-[var(--text-faint)] block uppercase font-semibold">EPFO Status:</span>
                          <span className={`font-bold ${isDual ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-700 dark:text-emerald-400'}`}>
                            {fac.epfoEcrStatus}
                          </span>
                          <span className="block text-[10px] text-[var(--text-muted)] mt-0.5">
                            50% Wage Rule: {fac.wageRule50Compliant ? 'Compliant' : 'VIOLATION'}
                          </span>
                        </div>
                      </div>

                      {isDual && fac.matchedInstitutionName && (
                        <div className="mt-2 p-2 rounded-xl bg-rose-500/15 text-[11px] text-rose-700 dark:text-rose-300">
                          <strong>Active Concurrent Employer:</strong> {fac.matchedInstitutionName} (PID: <span className="font-mono">{fac.matchedInstitutionPid}</span>)
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tab 4: PP-StructureV3 + Improved SLANet Table Topology & KIE Inspector */}
          {activeInspectorTab === 'SLANET_TABLE' && (
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
              {/* Telemetry Header Badge */}
              <div className="p-3.5 rounded-xl glass-well space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-indigo-700 dark:text-indigo-400 flex items-center gap-1.5 text-xs">
                    <TableIcon className="w-4 h-4 text-indigo-600" />
                    <span>PP-StructureV3 + Improved SLANet-LCNetV2</span>
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 font-bold border border-indigo-500/20">
                    TEDS: 96.67%
                  </span>
                </div>
                <p className="text-[11px] text-[var(--text-muted)]">
                  Mish activation + EOS dynamic termination &amp; LayoutLMv3 Token BIO sequence labeling
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1 text-[10px]">
                  <span className="px-2 py-0.5 rounded-lg bg-white/40 dark:bg-black/20 border border-[var(--glass-well-border)]">
                    Doc: <strong>{activeDocument.titleEn.substring(0, 24)}...</strong>
                  </span>
                  <span className="px-2 py-0.5 rounded-lg bg-white/40 dark:bg-black/20 border border-[var(--glass-well-border)]">
                    LayoutLMv3 F1: <strong>94.2%</strong>
                  </span>
                  <span className="px-2 py-0.5 rounded-lg bg-white/40 dark:bg-black/20 border border-[var(--glass-well-border)]">
                    Topology: <strong>Closed Manifold 5×5</strong>
                  </span>
                </div>
              </div>

              {/* View Mode Switcher */}
              <div className="flex items-center justify-between gap-2">
                <div className="glass-well inline-flex rounded-xl p-0.5 text-xs font-semibold">
                  <button
                    onClick={() => setSlanetViewMode('VISUAL')}
                    className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                      slanetViewMode === 'VISUAL'
                        ? 'btn-liquid-primary shadow-xs font-bold'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    Visual Table DOM
                  </button>
                  <button
                    onClick={() => setSlanetViewMode('HTML_DOM')}
                    className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                      slanetViewMode === 'HTML_DOM'
                        ? 'btn-liquid-primary shadow-xs font-bold'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    HTML DOM Tree
                  </button>
                  <button
                    onClick={() => setSlanetViewMode('TOKEN_GRAPH')}
                    className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                      slanetViewMode === 'TOKEN_GRAPH'
                        ? 'btn-liquid-primary shadow-xs font-bold'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    LayoutLMv3 JSON
                  </button>
                </div>

                {slanetViewMode !== 'VISUAL' && (
                  <button
                    onClick={() => {
                      const textToCopy = slanetViewMode === 'HTML_DOM' ? SLANET_HTML_TREE_STRING : SLANET_JSON_GRAPH_STRING;
                      navigator.clipboard.writeText(textToCopy);
                      setCopiedType(slanetViewMode);
                      toast.success(`Copied ${slanetViewMode === 'HTML_DOM' ? 'HTML DOM Tree' : 'LayoutLMv3 JSON Graph'} to clipboard`);
                      setTimeout(() => setCopiedType(null), 2000);
                    }}
                    className="btn-liquid-secondary px-2.5 py-1 rounded-xl text-xs font-semibold inline-flex items-center gap-1 cursor-pointer shrink-0 shadow-2xs"
                  >
                    {copiedType ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-[var(--text-muted)]" />}
                    <span>{copiedType ? 'Copied!' : 'Copy'}</span>
                  </button>
                )}
              </div>

              {/* View Mode 1: Visual Table DOM */}
              {slanetViewMode === 'VISUAL' && (
                <div className="space-y-3">
                  {selectedCellId && (
                    <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-xs space-y-1">
                      <div className="flex items-center justify-between text-indigo-700 dark:text-indigo-300 font-bold">
                        <span>Selected Cell: {selectedCellId}</span>
                        <button
                          onClick={() => setSelectedCellId(null)}
                          className="text-[11px] text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
                        >
                          Clear
                        </button>
                      </div>
                      <div className="text-[11px] text-[var(--text-secondary)]">
                        {SLANET_CELLS_MAP[selectedCellId] ? (
                          <div>
                            <div>Token Text: <strong>&ldquo;{SLANET_CELLS_MAP[selectedCellId].text}&rdquo;</strong></div>
                            <div className="flex gap-3 mt-1 font-mono text-[10px]">
                              <span>BIO Tag: <strong className="text-indigo-600">{SLANET_CELLS_MAP[selectedCellId].bioTag}</strong></span>
                              <span>BBox: <strong>[{SLANET_CELLS_MAP[selectedCellId].bbox.join(', ')}]</strong></span>
                              <span>Conf: <strong>{(SLANET_CELLS_MAP[selectedCellId].confidence * 100).toFixed(1)}%</strong></span>
                            </div>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  )}

                  {/* Reconstructed HTML Table */}
                  <div className="rounded-xl glass-well overflow-x-auto shadow-xs">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-[var(--glass-well-border)] text-[10px] uppercase text-[var(--text-muted)] font-bold">
                          <th className="py-2.5 px-3 w-8">#</th>
                          <th className="py-2.5 px-3">Name / Description</th>
                          <th className="py-2.5 px-3">PAN / Invoice Serial</th>
                          <th className="py-2.5 px-3">EPFO UAN / Cost</th>
                          <th className="py-2.5 px-3">Confidence</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[var(--glass-well-border)]">
                        {SLANET_TABLE_DATA.map((row) => (
                          <tr
                            key={row.id}
                            className={`hover:bg-white/40 dark:hover:bg-white/5 transition-colors ${
                              selectedCellId?.startsWith(row.id) ? 'bg-indigo-500/10' : ''
                            }`}
                          >
                            <td className="py-2.5 px-3 text-[var(--text-muted)]">{row.sr}</td>

                            <td
                              onClick={() => setSelectedCellId(`${row.id}-name`)}
                              className="py-2.5 px-3 font-bold text-[var(--text-primary)] cursor-pointer hover:text-indigo-600"
                            >
                              <div>{row.name}</div>
                              <div className="text-[10px] text-[var(--text-muted)] font-mono font-normal">
                                BBox: [{row.nameBBox.join(', ')}]
                              </div>
                            </td>

                            <td
                              onClick={() => setSelectedCellId(`${row.id}-identifier`)}
                              className="py-2.5 px-3 cursor-pointer hover:text-indigo-600"
                            >
                              <div className="font-mono font-bold text-[var(--text-primary)]">{row.identifier}</div>
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 font-bold">
                                {row.identifierBio}
                              </span>
                            </td>

                            <td
                              onClick={() => setSelectedCellId(`${row.id}-value`)}
                              className="py-2.5 px-3 cursor-pointer hover:text-indigo-600"
                            >
                              <div className="font-mono font-bold text-[var(--text-primary)]">{row.value}</div>
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-bold">
                                {row.valueBio}
                              </span>
                            </td>

                            <td className="py-2.5 px-3">
                              <span className="text-[10px] px-2 py-0.5 rounded-full glass-well text-[var(--text-secondary)] font-semibold">
                                {(row.confidence * 100).toFixed(1)}%
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="text-[11px] text-[var(--text-muted)] font-medium">
                    * Click any cell to inspect LayoutLMv3 BIO sequence tokens, normalized coordinates [x0, y0, x1, y1], and sub-word OCR confidence.
                  </div>
                </div>
              )}

              {/* View Mode 2: Raw Reconstructed HTML DOM Tree */}
              {slanetViewMode === 'HTML_DOM' && (
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-slate-200 font-mono text-[11px] overflow-x-auto space-y-2">
                  <div className="text-[10px] text-indigo-400 uppercase font-bold border-b border-slate-800 pb-1.5 flex justify-between">
                    <span>Reconstructed HTML DOM Structure (PP-StructureV3 SLANet)</span>
                    <span>TEDS: 96.67%</span>
                  </div>
                  <pre className="whitespace-pre text-slate-300 leading-relaxed font-mono">
                    {SLANET_HTML_TREE_STRING}
                  </pre>
                </div>
              )}

              {/* View Mode 3: LayoutLMv3 JSON Token Graph */}
              {slanetViewMode === 'TOKEN_GRAPH' && (
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-slate-200 font-mono text-[11px] overflow-x-auto space-y-2">
                  <div className="text-[10px] text-indigo-400 uppercase font-bold border-b border-slate-800 pb-1.5 flex justify-between">
                    <span>LayoutLMv3 Multimodal Token Graph (BIO Sequence Tagging)</span>
                    <span>Tokens: 10 • F1: 94.2%</span>
                  </div>
                  <pre className="whitespace-pre text-slate-300 leading-relaxed font-mono">
                    {SLANET_JSON_GRAPH_STRING}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
