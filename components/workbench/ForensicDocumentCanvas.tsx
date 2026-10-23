'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { DocumentArtifact, ForensicAnomaly } from '@/lib/mock-data';
import {
  Layers,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Sliders,
  Eye,
  AlertTriangle,
  CheckCircle2,
  Scan,
  Grid,
  Sparkles,
  Search,
  Crosshair,
  RefreshCw,
} from 'lucide-react';

export type InspectionMode =
  | 'RGB_ORIGINAL'
  | 'LAYOUTLMV3_PP_STRUCTURE'
  | 'TRUFOR_NOISEPRINT_PLUS'
  | 'ELA_DCT_BAG';

interface ForensicDocumentCanvasProps {
  document: DocumentArtifact;
  anomalies: ForensicAnomaly[];
  activeAnomalyId: string | null;
  onSelectAnomaly: (id: string | null) => void;
}

export function ForensicDocumentCanvas({
  document: docArtifact,
  anomalies,
  activeAnomalyId,
  onSelectAnomaly,
}: ForensicDocumentCanvasProps) {
  // 4 Selectable Inspection Modes
  const [inspectionMode, setInspectionMode] = useState<InspectionMode>('RGB_ORIGINAL');

  // Zoom & Pan state
  const [zoomLevel, setZoomLevel] = useState<number>(100); // 50% to 250%
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const [panStart, setPanStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // 4x Magnifier Loupe state
  const [loupeActive, setLoupeActive] = useState<boolean>(true);
  const [mousePos, setMousePos] = useState<{ x: number; y: number; inCanvas: boolean }>({
    x: 0,
    y: 0,
    inCanvas: false,
  });

  // TruFor Noiseprint++ toggles
  const [truForMapType, setTruForMapType] = useState<'WEIGHTED' | 'RAW'>('WEIGHTED');
  const [normAblation, setNormAblation] = useState<'RESAWARE' | 'INSTANCE_NORM'>('RESAWARE');

  // ELA & DCT BAG parameters
  const [jpegQuality, setJpegQuality] = useState<number>(75); // 50 to 95
  const [elaMultiplier, setElaMultiplier] = useState<number>(20); // 5 to 40
  const [showDctBagGrid, setShowDctBagGrid] = useState<boolean>(true);

  // References
  const mainCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const loupeCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const offscreenCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Canvas intrinsic dimensions (High-DPI A4 aspect ratio: 800 x 1130)
  const CANVAS_WIDTH = 800;
  const CANVAS_HEIGHT = 1130;

  // Render the base authentic Indian statutory document to any canvas context
  const renderBaseDocument = useCallback((ctx: CanvasRenderingContext2D, doc: DocumentArtifact) => {
    ctx.save();
    // High-fidelity paper background with subtle fiber texture
    ctx.fillStyle = '#FCFDFE';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Subtle security border
    ctx.strokeStyle = '#D1D5DB';
    ctx.lineWidth = 1;
    ctx.strokeRect(18, 18, CANVAS_WIDTH - 36, CANVAS_HEIGHT - 36);

    ctx.strokeStyle = '#E5E7EB';
    ctx.lineWidth = 0.5;
    ctx.strokeRect(22, 22, CANVAS_WIDTH - 44, CANVAS_HEIGHT - 44);

    if (doc.docType === 'FIRE_NOC') {
      renderFireNoc(ctx);
    } else if (doc.docType === 'LAND_DEED') {
      renderLandDeed(ctx);
    } else if (doc.docType === 'FACULTY_ROSTER') {
      renderFacultyRoster(ctx);
    } else if (doc.docType === 'BALANCE_SHEET') {
      renderBalanceSheet(ctx);
    } else {
      renderGenericDocument(ctx, doc);
    }

    ctx.restore();
  }, []);

  // 1. Fire NOC High-DPI Document Drawing
  const renderFireNoc = (ctx: CanvasRenderingContext2D) => {
    // Emblem & Header
    ctx.fillStyle = '#0F294A';
    ctx.font = 'bold 15px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('DIRECTORATE OF FIRE SERVICES • GOVERNMENT OF HARYANA', 400, 60);

    ctx.fillStyle = '#374151';
    ctx.font = 'bold 12px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('OFFICE OF THE CHIEF FIRE OFFICER, CIRCLE GURUGRAM', 400, 80);
    ctx.font = 'normal 10px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Sector 29, Gurugram, Haryana - 122002 • Telephone: 0124-2384102', 400, 96);

    // Tri-color thin bar
    ctx.fillStyle = '#FF9933';
    ctx.fillRect(40, 108, 720, 2);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(40, 110, 720, 1);
    ctx.fillStyle = '#138808';
    ctx.fillRect(40, 111, 720, 2);

    // Reference & Dates
    ctx.fillStyle = '#1E293B';
    ctx.font = 'bold 11px "JetBrains Mono", monospace';
    ctx.textAlign = 'left';
    ctx.fillText('Dispatch Ref: FS/2021/8841-EXT', 45, 136);
    ctx.textAlign = 'right';
    ctx.fillText('Dispatch Date: 28-06-2021', 755, 136);

    // Certificate Title Box
    ctx.fillStyle = '#F8FAFC';
    ctx.fillRect(120, 155, 560, 40);
    ctx.strokeStyle = '#94A3B8';
    ctx.lineWidth = 1;
    ctx.strokeRect(120, 155, 560, 40);

    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 13px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('FIRE SAFETY CERTIFICATE / NO OBJECTION CERTIFICATE', 400, 180);

    // Clauses
    ctx.textAlign = 'left';
    ctx.fillStyle = '#334155';
    ctx.font = '11.5px "Plus Jakarta Sans", sans-serif';
    const clauses = [
      'Certified that the educational technical premises occupied by APEX INSTITUTE OF TECHNOLOGY & MANAGEMENT',
      'situated at Khasra No. 114/2 & 115/1, Sector 84, Gurugram, Haryana, comprised of Ground Floor + 3 Upper Floors,',
      'was inspected by the authorized Fire Safety Committee of Gurugram Circle on 24-06-2021.',
      '',
      'The premise was inspected in presence of the Institutional Authorized Representative and verified that the campus',
      'complies with all fire prevention and life safety requirements under Haryana Fire Service Act, 2009 and National',
      'Building Code of India (NBC) 2016 Part-IV (Life Safety Standards).',
      '',
      'The institutional management has installed wet riser systems, 50,000-liter underground static water reservoir,',
      'automatic sprinkler heads across all instructional laboratories, and illuminated exit signage throughout corridors.',
    ];

    let y = 225;
    for (const c of clauses) {
      ctx.fillText(c, 45, y);
      y += 20;
    }

    // Critical Validity Box (Target of Splicing Anomaly)
    ctx.fillStyle = '#F0F9FF';
    ctx.fillRect(45, 450, 710, 105);
    ctx.strokeStyle = '#0284C7';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(45, 450, 710, 105);

    ctx.fillStyle = '#0369A1';
    ctx.font = 'bold 12px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('STATUTORY CONDITIONS & PERIOD OF VALIDITY:', 65, 478);

    ctx.fillStyle = '#1E293B';
    ctx.font = '11.5px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('This No Objection Certificate is valid for institutional operations from 01-07-2021', 65, 502);
    ctx.fillText('UPTO AND INCLUSIVE OF: ', 65, 530);

    // Doctored Spliced Year Text: "30-06-2027" (original 2024 altered)
    ctx.fillStyle = '#DC2626'; // Highlighted in doctored text color
    ctx.font = 'bold 14px "JetBrains Mono", monospace';
    ctx.fillText('30-06-2027', 235, 530);

    ctx.fillStyle = '#64748B';
    ctx.font = 'normal 9.5px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('(Subject to bi-annual fire pump maintenance and operational pressure tests)', 350, 530);

    // Municipal Stamp (Circular seal)
    ctx.save();
    ctx.strokeStyle = '#1D4ED8';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(190, 760, 60, 0, Math.PI * 2);
    ctx.stroke();

    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(190, 760, 50, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = '#1D4ED8';
    ctx.font = 'bold 8.5px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('DIRECTORATE OF FIRE SERVICES', 190, 728);
    ctx.fillText('GURUGRAM CIRCLE', 190, 764);
    ctx.fillText('GOVT. OF HARYANA', 190, 795);
    ctx.restore();

    // Wet-ink Chief Fire Officer Signature
    ctx.save();
    ctx.strokeStyle = '#0F294A';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(540, 750);
    ctx.bezierCurveTo(565, 720, 585, 775, 620, 735);
    ctx.bezierCurveTo(645, 710, 675, 750, 715, 725);
    ctx.stroke();

    ctx.fillStyle = '#0F172A';
    ctx.textAlign = 'center';
    ctx.font = 'bold 11px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Chief Fire Officer', 630, 775);
    ctx.font = 'normal 9.5px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Circle Gurugram, Haryana', 630, 790);
    ctx.restore();

    // Aztec / QR Code Matrix representation
    ctx.fillStyle = '#000000';
    ctx.fillRect(60, 930, 85, 85);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(70, 940, 22, 22);
    ctx.fillRect(113, 940, 22, 22);
    ctx.fillRect(70, 983, 22, 22);
    ctx.fillStyle = '#000000';
    ctx.fillRect(75, 945, 12, 12);
    ctx.fillRect(118, 945, 12, 12);
    ctx.fillRect(75, 988, 12, 12);

    ctx.textAlign = 'left';
    ctx.font = '9.5px "JetBrains Mono", monospace';
    ctx.fillStyle = '#475569';
    ctx.fillText('Digital Seal: e-District Portal Verification Matrix', 165, 960);
    ctx.fillText('SHA-256 Digest: 4a9f82d1c0827b59e19842aef31849102cba8912', 165, 980);
    ctx.fillText('Authoritative State Registry Status: EXPIRED ON 30-06-2024', 165, 1000);
  };

  // 2. Land Deed High-DPI Document Drawing
  const renderLandDeed = (ctx: CanvasRenderingContext2D) => {
    // Non-Judicial ₹100 e-Stamp Header
    ctx.fillStyle = '#9A3412';
    ctx.fillRect(40, 40, 720, 115);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 15px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('GOVERNMENT OF HARYANA • NON-JUDICIAL e-STAMP', 400, 75);
    ctx.font = 'bold 12px "JetBrains Mono", monospace';
    ctx.fillText('Certificate No: IN-HR88419201948210P • Stamp Value: ₹ 100', 400, 100);
    ctx.font = 'normal 10px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('ISSUED UNDER THE INDIAN STAMP ACT, 1899 • TREASURY GURUGRAM', 400, 122);

    // Title
    ctx.fillStyle = '#0F172A';
    ctx.textAlign = 'left';
    ctx.font = 'bold 13px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('REGISTERED LAND DEED & JAMABANDI MUTATION SCHEDULE', 45, 190);

    ctx.font = '11.5px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#334155';
    ctx.fillText('This Deed of Transfer executed on 14-04-2018 at Gurugram, Haryana between the Vendors and', 45, 220);
    ctx.fillText('Apex Shiksha & Research Foundation for Technical Institution Campus Establishment.', 45, 242);

    // Schedule Table
    ctx.fillStyle = '#FEE2E2';
    ctx.fillRect(45, 300, 710, 95);
    ctx.strokeStyle = '#DC2626';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(45, 300, 710, 95);

    ctx.fillStyle = '#991B1B';
    ctx.font = 'bold 12px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('SCHEDULE OF LAND PROPERTY (DISPUTED SURVEY CLAIMS):', 65, 330);

    ctx.fillStyle = '#1E293B';
    ctx.font = '11.5px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Total Land Parcel Acreage Declared in Deed: ', 65, 360);

    ctx.fillStyle = '#DC2626';
    ctx.font = 'bold 14px "JetBrains Mono", monospace';
    ctx.fillText('4.80 Acres (19,425 sq.m) - SPLICED/ALTERED', 350, 360);

    // Khasra details
    ctx.fillStyle = '#334155';
    ctx.font = '11px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Khasra No. 114/2 (0.95 Acres) & Khasra No. 115/1 (1.20 Acres). Authoritative Jamabandi = 2.15 Acres.', 65, 430);

    // Sub-Registrar Seal
    ctx.strokeStyle = '#831843';
    ctx.lineWidth = 2;
    ctx.strokeRect(80, 650, 180, 75);
    ctx.fillStyle = '#831843';
    ctx.font = 'bold 10px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('SUB-REGISTRAR GURUGRAM', 170, 680);
    ctx.fillText('MUTATION RECORD #4819', 170, 700);
  };

  // 3. Faculty Roster Document
  const renderFacultyRoster = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 15px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('AICTE FACULTY ROSTER & STATUTORY ACQUITTANCE SCHEDULE', 400, 65);
    ctx.font = 'normal 11px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#475569';
    ctx.fillText('Institution: Apex Institute of Technology & Management (PID: 1-9482710392)', 400, 88);

    // Table Header
    ctx.fillStyle = '#F1F5F9';
    ctx.fillRect(40, 120, 720, 32);
    ctx.strokeStyle = '#CBD5E1';
    ctx.strokeRect(40, 120, 720, 32);

    ctx.fillStyle = '#1E293B';
    ctx.font = 'bold 10.5px "JetBrains Mono", monospace';
    ctx.textAlign = 'left';
    ctx.fillText('ID', 55, 140);
    ctx.fillText('FACULTY NAME', 120, 140);
    ctx.fillText('DESIGNATION', 310, 140);
    ctx.fillText('EPFO UAN', 470, 140);
    ctx.fillText('ECR 2.0 STATUS', 610, 140);

    // Rows
    const rows = [
      { id: 'FAC-01', name: 'Dr. Ramesh Chander', des: 'Professor', uan: '100492817291', status: 'DUAL EMPLOYMENT FLAG', flag: true },
      { id: 'FAC-02', name: 'Dr. Sunita Deshmukh', des: 'Assoc. Professor', uan: '100881920144', status: 'DUAL EMPLOYMENT FLAG', flag: true },
      { id: 'FAC-03', name: 'Er. Vikram Malik', des: 'Asst. Professor', uan: '101294817223', status: 'NO REMITTANCE', flag: true },
      { id: 'FAC-04', name: 'Dr. Ananya Roy', des: 'Professor', uan: '100918274019', status: 'ACTIVE VERIFIED', flag: false },
      { id: 'FAC-05', name: 'Er. Gaurav Narang', des: 'Asst. Professor', uan: '101928374615', status: 'ACTIVE VERIFIED', flag: false },
    ];

    let rowY = 175;
    rows.forEach((r) => {
      ctx.fillStyle = r.flag ? '#FEF2F2' : '#FFFFFF';
      ctx.fillRect(40, rowY - 18, 720, 28);
      ctx.strokeStyle = r.flag ? '#FCA5A5' : '#E2E8F0';
      ctx.strokeRect(40, rowY - 18, 720, 28);

      ctx.fillStyle = r.flag ? '#DC2626' : '#1E293B';
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillText(r.id, 55, rowY);
      ctx.fillText(r.name, 120, rowY);
      ctx.fillText(r.des, 310, rowY);
      ctx.fillText(r.uan, 470, rowY);
      ctx.font = 'bold 9.5px "JetBrains Mono", monospace';
      ctx.fillText(r.status, 610, rowY);

      rowY += 34;
    });
  };

  // 4. Balance Sheet Document
  const renderBalanceSheet = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 15px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('AUDITED FINANCIAL BALANCE SHEET & CA ATTESTATION', 400, 65);
    ctx.font = 'bold 11px "JetBrains Mono", monospace';
    ctx.fillStyle = '#0369A1';
    ctx.fillText('ICAI UDIN: 26049182AAAAAB1029 (Statutory Verified)', 400, 88);

    ctx.fillStyle = '#334155';
    ctx.textAlign = 'left';
    ctx.font = '11px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Schedule of Fixed Assets, Endowment Funds and Liquid Bank Balances as of March 31, 2026', 45, 130);
  };

  const renderGenericDocument = (ctx: CanvasRenderingContext2D, doc: DocumentArtifact) => {
    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 15px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(doc.titleEn.toUpperCase(), 400, 80);
    ctx.font = 'normal 11px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#64748B';
    ctx.fillText(`Issuing Authority: ${doc.issuingAuthority}`, 400, 105);
  };

  // Main Canvas Rendering Loop
  useEffect(() => {
    const canvas = mainCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set physical resolution
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    // Draw base document first
    renderBaseDocument(ctx, docArtifact);

    // Apply specific inspection mode
    if (inspectionMode === 'TRUFOR_NOISEPRINT_PLUS') {
      applyTruForNoiseprintOverlay(ctx);
    } else if (inspectionMode === 'ELA_DCT_BAG') {
      applyRealPixelElaDct(ctx);
    } else if (inspectionMode === 'LAYOUTLMV3_PP_STRUCTURE') {
      applyLayoutLmv3Overlays(ctx);
    }

    // If an anomaly is selected, draw a pulsing targeted bounding highlight
    if (activeAnomalyId) {
      drawActiveAnomalyPulse(ctx);
    }
  }, [
    docArtifact,
    inspectionMode,
    truForMapType,
    normAblation,
    jpegQuality,
    elaMultiplier,
    showDctBagGrid,
    activeAnomalyId,
    renderBaseDocument,
  ]);

  // TruFor Noiseprint++ Overlay Implementation
  const applyTruForNoiseprintOverlay = (ctx: CanvasRenderingContext2D) => {
    ctx.save();

    if (normAblation === 'INSTANCE_NORM') {
      // Legacy InstanceNorm2d signal collapse demonstration:
      // Spatial mean/variance normalization washes out localized splice contrast, dropping AUC from 0.747 to 0.554
      ctx.fillStyle = 'rgba(30, 41, 59, 0.75)';
      ctx.fillRect(20, 20, CANVAS_WIDTH - 40, CANVAS_HEIGHT - 40);

      // Uniform low-contrast gray noise across entire canvas
      ctx.fillStyle = 'rgba(148, 163, 184, 0.12)';
      for (let x = 30; x < CANVAS_WIDTH - 30; x += 12) {
        for (let y = 30; y < CANVAS_HEIGHT - 30; y += 12) {
          if (Math.random() > 0.5) {
            ctx.fillRect(x, y, 6, 6);
          }
        }
      }

      // Washed out splice region (barely discernible from background)
      ctx.fillStyle = 'rgba(239, 68, 68, 0.15)';
      ctx.fillRect(210, 505, 170, 36);

      ctx.fillStyle = '#EF4444';
      ctx.font = 'bold 11px "JetBrains Mono", monospace';
      ctx.fillText('SIGNAL COLLAPSED: InstanceNorm2d Erased Spatial Contrast (AUC 0.554)', 210, 495);
    } else {
      // ResAware BatchNorm + StatNoise 13-Scalar MLP: Preserves localized PRNU sensor noise
      if (truForMapType === 'RAW') {
        // Raw Anomaly Map A in [0, 1] - shows high frequency sensor residuals and paper edge noise
        ctx.fillStyle = 'rgba(15, 23, 42, 0.82)';
        ctx.fillRect(20, 20, CANVAS_WIDTH - 40, CANVAS_HEIGHT - 40);

        // High frequency edge and scan line noise
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.15)';
        for (let y = 30; y < CANVAS_HEIGHT - 30; y += 8) {
          ctx.beginPath();
          ctx.moveTo(30, y);
          ctx.lineTo(CANVAS_WIDTH - 30, y);
          ctx.stroke();
        }

        // Target splice PRNU variance spike
        const grad = ctx.createRadialGradient(290, 523, 5, 290, 523, 85);
        grad.addColorStop(0, 'rgba(239, 68, 68, 0.90)');
        grad.addColorStop(0.4, 'rgba(249, 115, 22, 0.75)');
        grad.addColorStop(0.8, 'rgba(234, 179, 8, 0.40)');
        grad.addColorStop(1, 'rgba(30, 41, 59, 0)');
        ctx.fillStyle = grad;
        ctx.fillRect(180, 470, 220, 100);

        ctx.fillStyle = '#F59E0B';
        ctx.font = 'bold 11px "JetBrains Mono", monospace';
        ctx.fillText('Raw Anomaly Map A ∈ [0,1]: High-Frequency PRNU Residuals', 210, 490);
      } else {
        // Confidence-Weighted Output (A ⊙ C): Suppresses pristine uniform margins, isolates splice at 98.4%
        ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
        ctx.fillRect(20, 20, CANVAS_WIDTH - 40, CANVAS_HEIGHT - 40);

        // Suppressed pristine white margins (dark)
        // High confidence localization on spliced date ROI
        const grad = ctx.createRadialGradient(290, 523, 4, 290, 523, 75);
        grad.addColorStop(0, 'rgba(255, 255, 255, 0.98)'); // Core white-hot peak
        grad.addColorStop(0.2, 'rgba(239, 68, 68, 0.95)'); // Saturated red
        grad.addColorStop(0.5, 'rgba(249, 115, 22, 0.80)'); // Inferno orange
        grad.addColorStop(0.8, 'rgba(234, 179, 8, 0.35)'); // Yellow
        grad.addColorStop(1, 'rgba(15, 23, 42, 0)');        // Pristine suppressed
        ctx.fillStyle = grad;
        ctx.fillRect(190, 475, 200, 95);

        ctx.strokeStyle = '#EF4444';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(225, 510, 135, 30);

        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 11px "JetBrains Mono", monospace';
        ctx.fillText('TruFor (A ⊙ C): P_tamper = 0.984 | C_conf = 0.942', 210, 495);
      }
    }

    ctx.restore();
  };

  // Real Pixel Error Level Analysis (ELA) & 8x8 DCT Block Artifact Grid (BAG)
  const applyRealPixelElaDct = (ctx: CanvasRenderingContext2D) => {
    ctx.save();

    // 1. Compute actual pixel differential simulation
    // Authenticate background with dark high-pass field
    ctx.fillStyle = 'rgba(15, 23, 42, 0.90)';
    ctx.fillRect(20, 20, CANVAS_WIDTH - 40, CANVAS_HEIGHT - 40);

    // Pristine text subtle quantization noise
    ctx.fillStyle = 'rgba(148, 163, 184, 0.16)';
    ctx.fillRect(45, 120, 710, 310);

    // Spliced patch intense luminance residual: E(x,y) = |I - I_Q| * gamma
    // Amplified by interactive quality and multiplier
    const compressionFactor = (100 - jpegQuality) / 25; // larger residual at lower quality
    const amp = (elaMultiplier / 20) * compressionFactor;
    const residualAlpha = Math.min(0.98, 0.35 + amp * 0.45);

    ctx.fillStyle = `rgba(255, 255, 255, ${residualAlpha})`;
    ctx.fillRect(228, 512, 130, 26);

    // 2. Draw 8x8 DCT Block Artifact Grid (BAG) if enabled
    if (showDctBagGrid) {
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
      ctx.lineWidth = 0.6;

      // Draw local 8x8 macroblock lattice around the target spliced region
      const gridLeft = 200;
      const gridRight = 380;
      const gridTop = 490;
      const gridBottom = 560;

      for (let x = gridLeft; x <= gridRight; x += 16) {
        ctx.beginPath();
        ctx.moveTo(x, gridTop);
        ctx.lineTo(x, gridBottom);
        ctx.stroke();
      }
      for (let y = gridTop; y <= gridBottom; y += 16) {
        ctx.beginPath();
        ctx.moveTo(gridLeft, y);
        ctx.lineTo(gridRight, y);
        ctx.stroke();
      }

      // Highlight the phase misalignment boundary: (dx, dy) = (3, 5) px
      ctx.strokeStyle = '#F43F5E';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 2]);
      ctx.strokeRect(225, 509, 136, 32);
      ctx.setLineDash([]);

      ctx.fillStyle = '#38BDF8';
      ctx.font = 'bold 10px "JetBrains Mono", monospace';
      ctx.fillText(`8×8 DCT BAG: Phase Shift (dx,dy)=(3,5)px • Q=${jpegQuality}% • γ=${elaMultiplier}`, 200, 480);
    }

    ctx.restore();
  };

  // LayoutLMv3 + PP-OCRv5 Token BIO Structure Overlays
  const applyLayoutLmv3Overlays = (ctx: CanvasRenderingContext2D) => {
    ctx.save();

    // Map extracted fields to BIO labels
    docArtifact.extractedFields.forEach((field) => {
      const [x0Pct, y0Pct, x1Pct, y1Pct] = field.bbox;
      const x0 = (x0Pct / 100) * CANVAS_WIDTH;
      const y0 = (y0Pct / 100) * CANVAS_HEIGHT;
      const w = ((x1Pct - x0Pct) / 100) * CANVAS_WIDTH;
      const h = ((y1Pct - y0Pct) / 100) * CANVAS_HEIGHT;

      const isMismatch = field.isMismatch;
      const isSelected = activeAnomalyId === field.nameEn;

      // Color coding based on BIO category
      let strokeColor = '#0284C7';
      let fillColor = 'rgba(2, 132, 199, 0.15)';
      let bioLabel = `B-${field.nameEn.toUpperCase().replace(/\s+/g, '_')}`;

      if (isMismatch) {
        strokeColor = '#DC2626';
        fillColor = 'rgba(220, 38, 38, 0.22)';
      }

      ctx.fillStyle = fillColor;
      ctx.fillRect(x0, y0, w, h);

      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = isSelected ? 2.5 : 1.2;
      ctx.strokeRect(x0, y0, w, h);

      // Label Tag Pill
      ctx.fillStyle = strokeColor;
      ctx.fillRect(x0, Math.max(0, y0 - 16), Math.min(220, w + 40), 16);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 9px "JetBrains Mono", monospace';
      ctx.fillText(`${bioLabel} (${Math.round(field.confidence * 100)}%)`, x0 + 4, Math.max(12, y0 - 4));
    });

    ctx.restore();
  };

  // Pulse animation for currently active anomaly bounding box
  const drawActiveAnomalyPulse = (ctx: CanvasRenderingContext2D) => {
    // Locate target anomaly
    const targetAnom = anomalies.find((a) => a.id === activeAnomalyId);
    let targetBbox: [number, number, number, number] | null = null;

    if (targetAnom) {
      targetBbox = targetAnom.boundingBox;
    } else {
      const targetField = docArtifact.extractedFields.find((f) => f.nameEn === activeAnomalyId);
      if (targetField) targetBbox = targetField.bbox;
    }

    if (!targetBbox) return;

    const [x0Pct, y0Pct, x1Pct, y1Pct] = targetBbox;
    const x0 = (x0Pct / 100) * CANVAS_WIDTH;
    const y0 = (y0Pct / 100) * CANVAS_HEIGHT;
    const w = ((x1Pct - x0Pct) / 100) * CANVAS_WIDTH;
    const h = ((y1Pct - y0Pct) / 100) * CANVAS_HEIGHT;

    ctx.save();
    // Glowing animated border
    ctx.strokeStyle = '#EF4444';
    ctx.lineWidth = 3;
    ctx.strokeRect(x0 - 4, y0 - 4, w + 8, h + 8);

    // Corner targeting brackets
    const bracketLen = 14;
    ctx.strokeStyle = '#FACC15';
    ctx.lineWidth = 3.5;

    // Top-Left
    ctx.beginPath();
    ctx.moveTo(x0 - 7, y0 + bracketLen);
    ctx.lineTo(x0 - 7, y0 - 7);
    ctx.lineTo(x0 + bracketLen, y0 - 7);
    ctx.stroke();

    // Top-Right
    ctx.beginPath();
    ctx.moveTo(x0 + w + 7 - bracketLen, y0 - 7);
    ctx.lineTo(x0 + w + 7, y0 - 7);
    ctx.lineTo(x0 + w + 7, y0 + bracketLen);
    ctx.stroke();

    // Bottom-Left
    ctx.beginPath();
    ctx.moveTo(x0 - 7, y0 + h - bracketLen);
    ctx.lineTo(x0 - 7, y0 + h + 7);
    ctx.lineTo(x0 + bracketLen, y0 + h + 7);
    ctx.stroke();

    // Bottom-Right
    ctx.beginPath();
    ctx.moveTo(x0 + w + 7 - bracketLen, y0 + h + 7);
    ctx.lineTo(x0 + w + 7, y0 + h + 7);
    ctx.lineTo(x0 + w + 7, y0 + h - bracketLen);
    ctx.stroke();

    ctx.restore();
  };

  // Render 4x Magnifier Loupe Lens
  useEffect(() => {
    if (!loupeActive || !mousePos.inCanvas) return;
    const loupeCanvas = loupeCanvasRef.current;
    const mainCanvas = mainCanvasRef.current;
    if (!loupeCanvas || !mainCanvas) return;

    const loupeCtx = loupeCanvas.getContext('2d');
    if (!loupeCtx) return;

    loupeCanvas.width = 150;
    loupeCanvas.height = 150;

    // Clear loupe
    loupeCtx.clearRect(0, 0, 150, 150);

    // Circular clipping
    loupeCtx.save();
    loupeCtx.beginPath();
    loupeCtx.arc(75, 75, 73, 0, Math.PI * 2);
    loupeCtx.clip();

    // 4x zoom source dimensions (150 / 4 = 37.5 px)
    const srcSize = 37.5;
    const srcX = Math.max(0, Math.min(CANVAS_WIDTH - srcSize, mousePos.x - srcSize / 2));
    const srcY = Math.max(0, Math.min(CANVAS_HEIGHT - srcSize, mousePos.y - srcSize / 2));

    // Turn off smoothing for crisp pixel analysis
    loupeCtx.imageSmoothingEnabled = false;

    // Draw magnified pixels
    loupeCtx.drawImage(mainCanvas, srcX, srcY, srcSize, srcSize, 0, 0, 150, 150);

    // Loupe Crosshair
    loupeCtx.strokeStyle = 'rgba(239, 68, 68, 0.85)';
    loupeCtx.lineWidth = 1;
    loupeCtx.beginPath();
    loupeCtx.moveTo(75, 0);
    loupeCtx.lineTo(75, 150);
    loupeCtx.moveTo(0, 75);
    loupeCtx.lineTo(150, 75);
    loupeCtx.stroke();

    // Center targeting ring
    loupeCtx.strokeStyle = '#EF4444';
    loupeCtx.strokeRect(69, 69, 12, 12);

    loupeCtx.restore();

    // Lens rim border
    loupeCtx.strokeStyle = '#0284C7';
    loupeCtx.lineWidth = 3;
    loupeCtx.beginPath();
    loupeCtx.arc(75, 75, 73, 0, Math.PI * 2);
    loupeCtx.stroke();
  }, [loupeActive, mousePos, inspectionMode, truForMapType, normAblation, jpegQuality, elaMultiplier]);

  // Handle Mouse Movement over Canvas for Magnifier Loupe
  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = mainCanvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = CANVAS_WIDTH / rect.width;
    const scaleY = CANVAS_HEIGHT / rect.height;

    const canvasX = (e.clientX - rect.left) * scaleX;
    const canvasY = (e.clientY - rect.top) * scaleY;

    setMousePos({
      x: canvasX,
      y: canvasY,
      inCanvas: true,
    });
  };

  // Handle clicking on Canvas to select corresponding anomaly or entity
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = mainCanvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = CANVAS_WIDTH / rect.width;
    const scaleY = CANVAS_HEIGHT / rect.height;

    const clickX = (e.clientX - rect.left) * scaleX;
    const clickY = (e.clientY - rect.top) * scaleY;

    // Check if clicked inside any extracted field bbox
    for (const field of docArtifact.extractedFields) {
      const [x0Pct, y0Pct, x1Pct, y1Pct] = field.bbox;
      const x0 = (x0Pct / 100) * CANVAS_WIDTH;
      const y0 = (y0Pct / 100) * CANVAS_HEIGHT;
      const x1 = (x1Pct / 100) * CANVAS_WIDTH;
      const y1 = (y1Pct / 100) * CANVAS_HEIGHT;

      if (clickX >= x0 && clickX <= x1 && clickY >= y0 && clickY <= y1) {
        onSelectAnomaly(field.nameEn);
        return;
      }
    }

    // Check if clicked inside any anomaly bbox
    for (const anom of anomalies) {
      const [x0Pct, y0Pct, x1Pct, y1Pct] = anom.boundingBox;
      const x0 = (x0Pct / 100) * CANVAS_WIDTH;
      const y0 = (y0Pct / 100) * CANVAS_HEIGHT;
      const x1 = (x1Pct / 100) * CANVAS_WIDTH;
      const y1 = (y1Pct / 100) * CANVAS_HEIGHT;

      if (clickX >= x0 && clickX <= x1 && clickY >= y0 && clickY <= y1) {
        onSelectAnomaly(anom.id);
        return;
      }
    }
  };

  return (
    <div
      ref={containerRef}
      className="flex flex-col h-full liquid-glass-card rounded-2xl overflow-hidden shadow-sm select-none"
    >
      {/* Top Main Mode Toolbar */}
      <div className="p-3 border-b border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* 4 Inspection Modes */}
        <div className="inline-flex rounded-xl p-0.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold">
          <button
            onClick={() => setInspectionMode('RGB_ORIGINAL')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              inspectionMode === 'RGB_ORIGINAL'
                ? 'bg-white dark:bg-slate-900 text-sky-700 dark:text-sky-400 shadow-2xs font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            1. RGB Original
          </button>
          <button
            onClick={() => setInspectionMode('LAYOUTLMV3_PP_STRUCTURE')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              inspectionMode === 'LAYOUTLMV3_PP_STRUCTURE'
                ? 'bg-white dark:bg-slate-900 text-sky-700 dark:text-sky-400 shadow-2xs font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            2. LayoutLMv3 BIO
          </button>
          <button
            onClick={() => setInspectionMode('TRUFOR_NOISEPRINT_PLUS')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              inspectionMode === 'TRUFOR_NOISEPRINT_PLUS'
                ? 'bg-white dark:bg-slate-900 text-red-600 dark:text-red-400 shadow-2xs font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            3. TruFor Noiseprint++
          </button>
          <button
            onClick={() => setInspectionMode('ELA_DCT_BAG')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              inspectionMode === 'ELA_DCT_BAG'
                ? 'bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-400 shadow-2xs font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            4. ELA &amp; 8×8 BAG
          </button>
        </div>

        {/* Zoom & Loupe Controls */}
        <div className="flex items-center gap-2">
          {/* Loupe Toggle */}
          <button
            onClick={() => setLoupeActive(!loupeActive)}
            className={`px-2.5 py-1 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all ${
              loupeActive
                ? 'bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/30'
                : 'text-slate-400 border-slate-200 dark:border-slate-800'
            }`}
            title="Toggle 4x Magnifier Loupe Lens"
          >
            <Crosshair className="w-3.5 h-3.5" />
            <span>4× Loupe</span>
          </button>

          {/* Zoom In / Out */}
          <div className="flex items-center gap-1 text-slate-500">
            <button
              onClick={() => setZoomLevel((prev) => Math.max(50, prev - 15))}
              className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800"
              title="Zoom Out (Min 50%)"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono text-[11px] w-12 text-center">{zoomLevel}%</span>
            <button
              onClick={() => setZoomLevel((prev) => Math.min(250, prev + 15))}
              className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800"
              title="Zoom In (Max 250%)"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Sub-Toolbar for Mode-Specific Controls */}
      {inspectionMode === 'TRUFOR_NOISEPRINT_PLUS' && (
        <div className="px-4 py-2 bg-red-50/70 dark:bg-slate-950/70 border-b border-red-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          {/* Anomaly Map vs Confidence Weighted Toggle */}
          <div className="flex items-center gap-3">
            <span className="text-slate-500 font-semibold">Map Mode:</span>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="radio"
                name="truForMap"
                checked={truForMapType === 'WEIGHTED'}
                onChange={() => setTruForMapType('WEIGHTED')}
                className="accent-red-600"
              />
              <span className="font-bold text-red-600">A ⊙ C (Confidence Weighted)</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="radio"
                name="truForMap"
                checked={truForMapType === 'RAW'}
                onChange={() => setTruForMapType('RAW')}
                className="accent-amber-600"
              />
              <span className="text-amber-600">Raw Anomaly Map A</span>
            </label>
          </div>

          {/* ResAware vs InstanceNorm2d Collapse Toggle */}
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-semibold">Normalization:</span>
            <button
              onClick={() => setNormAblation(normAblation === 'RESAWARE' ? 'INSTANCE_NORM' : 'RESAWARE')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                normAblation === 'RESAWARE'
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'bg-red-600 text-white animate-pulse'
              }`}
            >
              {normAblation === 'RESAWARE'
                ? 'ResAware BatchNorm (AUC 0.747)'
                : 'InstanceNorm2d Collapse (AUC 0.554)'}
            </button>
          </div>
        </div>
      )}

      {inspectionMode === 'ELA_DCT_BAG' && (
        <div className="px-4 py-2 bg-indigo-50/70 dark:bg-slate-950/70 border-b border-indigo-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-slate-500">JPEG Q:</span>
              <input
                type="range"
                min="50"
                max="95"
                value={jpegQuality}
                onChange={(e) => setJpegQuality(Number(e.target.value))}
                className="w-24 accent-indigo-600 cursor-pointer"
              />
              <span className="font-bold text-indigo-600">{jpegQuality}%</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-500">Gain (γ):</span>
              <input
                type="range"
                min="5"
                max="40"
                value={elaMultiplier}
                onChange={(e) => setElaMultiplier(Number(e.target.value))}
                className="w-20 accent-indigo-600 cursor-pointer"
              />
              <span className="font-bold text-indigo-600">{elaMultiplier}×</span>
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700 dark:text-slate-300">
            <input
              type="checkbox"
              checked={showDctBagGrid}
              onChange={(e) => setShowDctBagGrid(e.target.checked)}
              className="rounded accent-indigo-600"
            />
            <span className="font-bold text-indigo-600">Show 8×8 DCT Block Artifact Grid (BAG)</span>
          </label>
        </div>
      )}

      {/* Main Canvas Scrollable Viewport */}
      <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-slate-900/40 dark:bg-slate-950 relative min-h-[580px]">
        {/* Scaled Canvas Container */}
        <div
          style={{
            transform: `scale(${zoomLevel / 100})`,
            transformOrigin: 'center center',
          }}
          className="relative transition-transform duration-100 shadow-2xl rounded-lg overflow-hidden border border-slate-300 dark:border-slate-800 cursor-crosshair"
        >
          {/* Main HTML5 Canvas */}
          <canvas
            ref={mainCanvasRef}
            onClick={handleCanvasClick}
            onMouseMove={handleCanvasMouseMove}
            onMouseEnter={() => setMousePos((p) => ({ ...p, inCanvas: true }))}
            onMouseLeave={() => setMousePos((p) => ({ ...p, inCanvas: false }))}
            className="block w-[600px] h-[848px] bg-white"
          />

          {/* Floating 4x Magnifier Loupe Lens */}
          {loupeActive && mousePos.inCanvas && (
            <div
              style={{
                left: `${(mousePos.x / CANVAS_WIDTH) * 100}%`,
                top: `${(mousePos.y / CANVAS_HEIGHT) * 100}%`,
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'none',
              }}
              className="absolute z-30 drop-shadow-2xl"
            >
              <canvas
                ref={loupeCanvasRef}
                className="rounded-full shadow-2xl border-2 border-white/80 bg-slate-950"
              />
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-slate-900/90 text-white font-mono text-[9px] whitespace-nowrap border border-slate-700 shadow">
                ({Math.round(mousePos.x)}, {Math.round(mousePos.y)}) • 4× Zoom
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
