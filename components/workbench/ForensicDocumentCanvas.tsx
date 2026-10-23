'use client';

import React, { useState, useEffect, useRef } from 'react';
import { DocumentArtifact, ForensicAnomaly } from '@/lib/mock-data';
import {
  Layers,
  Flame,
  Scan,
  Grid,
  Sliders,
  Maximize2,
  ZoomIn,
  ZoomOut,
  Info,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

interface ForensicDocumentCanvasProps {
  document: DocumentArtifact;
  anomalies: ForensicAnomaly[];
  activeAnomalyId: string | null;
  onSelectAnomaly: (id: string | null) => void;
}

export function ForensicDocumentCanvas({
  document,
  anomalies,
  activeAnomalyId,
  onSelectAnomaly,
}: ForensicDocumentCanvasProps) {
  const [activeLayer, setActiveLayer] = useState<'RGB' | 'BBOX' | 'TRUFOR' | 'ELA'>('RGB');
  const [jpegQuality, setJpegQuality] = useState<number>(75);
  const [elaGamma, setElaGamma] = useState<number>(20);
  const [showConfidenceMask, setShowConfidenceMask] = useState<boolean>(true);
  const [zoomLevel, setZoomLevel] = useState<number>(100);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Re-draw canvas when layer or ELA parameters change
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Canvas dimensions (A4 aspect ratio: 800 x 1130)
    canvas.width = 800;
    canvas.height = 1130;

    // Draw document base background (paper texture)
    ctx.fillStyle = '#FCFDFE';
    ctx.fillRect(0, 0, 800, 1130);

    // Subtle paper border
    ctx.strokeStyle = '#D1D5DB';
    ctx.lineWidth = 1;
    ctx.strokeRect(20, 20, 760, 1090);

    // Document Type specific layout drawing
    if (document.docType === 'FIRE_NOC') {
      renderFireNocDocument(ctx);
    } else if (document.docType === 'LAND_DEED') {
      renderLandDeedDocument(ctx);
    } else if (document.docType === 'BLUEPRINT') {
      renderBlueprintDoc(ctx);
    } else {
      renderGenericDocument(ctx, document);
    }

    // Apply Forensic Overlays if active
    if (activeLayer === 'TRUFOR') {
      renderTruForOverlay(ctx, showConfidenceMask);
    } else if (activeLayer === 'ELA') {
      renderElaOverlay(ctx, jpegQuality, elaGamma);
    }
  }, [document, activeLayer, jpegQuality, elaGamma, showConfidenceMask, anomalies, activeAnomalyId]);

  // Document Drawing Helpers
  const renderFireNocDocument = (ctx: CanvasRenderingContext2D) => {
    // Official Government Header
    ctx.fillStyle = '#1E3A8A';
    ctx.font = 'bold 16px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('DIRECTORATE OF FIRE SERVICES • GOVERNMENT OF HARYANA', 400, 65);

    ctx.fillStyle = '#4B5563';
    ctx.font = 'bold 12px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('OFFICE OF THE CHIEF FIRE OFFICER, CIRCLE GURUGRAM', 400, 85);
    ctx.font = 'normal 10px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Sector 29, Gurugram - 122002 • Email: cfo.gurugram@hry.gov.in', 400, 102);

    // Divider bar
    ctx.strokeStyle = '#1E3A8A';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(40, 115);
    ctx.lineTo(760, 115);
    ctx.stroke();

    // Reference & Date
    ctx.fillStyle = '#111827';
    ctx.font = 'bold 11px "JetBrains Mono", monospace';
    ctx.textAlign = 'left';
    ctx.fillText('Ref No: FS/2021/8841-EXT', 50, 145);
    ctx.textAlign = 'right';
    ctx.fillText('Dispatch Date: 28-06-2021', 750, 145);

    // Certificate Title Box
    ctx.fillStyle = '#F3F4F6';
    ctx.fillRect(150, 170, 500, 42);
    ctx.strokeStyle = '#9CA3AF';
    ctx.lineWidth = 1;
    ctx.strokeRect(150, 170, 500, 42);

    ctx.fillStyle = '#111827';
    ctx.font = 'bold 14px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('FIRE SAFETY CERTIFICATE / NO OBJECTION CERTIFICATE', 400, 196);

    // Main Certificate Clauses
    ctx.textAlign = 'left';
    ctx.fillStyle = '#374151';
    ctx.font = '12px "Plus Jakarta Sans", sans-serif';
    const lines = [
      'Certified that the educational building occupied by APEX INSTITUTE OF TECHNOLOGY & MANAGEMENT',
      'situated at Khasra No. 114/2 & 115/1, Sector 84, Gurugram, Haryana, comprised of Ground Floor + 3 Upper',
      'Floors, has been inspected by the Fire Safety Officers of this Directorate on 24-06-2021.',
      '',
      'The premise was inspected in presence of the Institutional Authorized Representative and verified that',
      'the campus has complied with the fire prevention and safety requirements under Haryana Fire Service Act,',
      '2009 and National Building Code of India (NBC) Part-IV (Life Safety).',
      '',
      'The institutional management has installed wet riser systems, 50,000-liter underground static water reservoir,',
      'automatic sprinkler heads across all instructional laboratories, and illuminated exit signage throughout corridors.',
    ];

    let y = 250;
    for (const line of lines) {
      ctx.fillText(line, 50, y);
      y += 24;
    }

    // Crucial Statutory Validity Box (Target Spliced ROI)
    ctx.fillStyle = '#EFF6FF';
    ctx.fillRect(50, 520, 700, 95);
    ctx.strokeStyle = '#3B82F6';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(50, 520, 700, 95);

    ctx.fillStyle = '#1E40AF';
    ctx.font = 'bold 13px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('STATUTORY CONDITIONS & PERIOD OF VALIDITY:', 70, 550);

    ctx.fillStyle = '#1F2937';
    ctx.font = '12px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('This No Objection Certificate is valid for institutional operations from 01-07-2021', 70, 575);

    // The Spliced Text (2027 altered from 2024)
    ctx.font = 'bold 14px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('UPTO AND INCLUSIVE OF: ', 70, 598);

    // Highlighted altered font
    ctx.fillStyle = '#DC2626'; // doctored text
    ctx.font = 'bold 14px "JetBrains Mono", monospace';
    ctx.fillText('30-06-2027', 265, 598);

    ctx.fillStyle = '#6B7280';
    ctx.font = 'normal 10px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('(Subject to bi-annual fire pump maintenance and operational pressure tests)', 380, 598);

    // Municipal Stamp & Signatures Area
    // Circular Official Seal
    ctx.strokeStyle = '#2563EB';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(200, 860, 65, 0, Math.PI * 2);
    ctx.stroke();

    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(200, 860, 55, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = '#2563EB';
    ctx.font = 'bold 9px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('DIRECTORATE OF FIRE SERVICES', 200, 825);
    ctx.fillText('GOVT. OF HARYANA', 200, 895);
    ctx.fillText('GURUGRAM CIRCLE', 200, 860);

    // Wet ink signature
    ctx.strokeStyle = '#1E3A8A';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(560, 850);
    ctx.bezierCurveTo(580, 820, 600, 870, 630, 835);
    ctx.bezierCurveTo(650, 810, 680, 840, 710, 820);
    ctx.stroke();

    ctx.fillStyle = '#111827';
    ctx.textAlign = 'center';
    ctx.font = 'bold 12px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Chief Fire Officer', 640, 875);
    ctx.font = 'normal 10px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Circle Gurugram, Haryana', 640, 890);

    // 2D QR Code representation
    ctx.fillStyle = '#000000';
    ctx.fillRect(80, 970, 80, 80);
    // Draw QR pattern simulation
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(90, 980, 20, 20);
    ctx.fillRect(130, 980, 20, 20);
    ctx.fillRect(90, 1020, 20, 20);
    ctx.fillStyle = '#000000';
    ctx.fillRect(95, 985, 10, 10);
    ctx.fillRect(135, 985, 10, 10);
    ctx.fillRect(95, 1025, 10, 10);

    ctx.textAlign = 'left';
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.fillStyle = '#4B5563';
    ctx.fillText('Scan with e-District App to verify digitally', 175, 1005);
    ctx.fillText('SHA-256: 4a9f82d1c0827b59e19842aef31849102cba8912', 175, 1025);
  };

  const renderLandDeedDocument = (ctx: CanvasRenderingContext2D) => {
    // Non-Judicial e-Stamp Header
    ctx.fillStyle = '#B45309';
    ctx.fillRect(50, 50, 700, 120);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 16px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('GOVERNMENT OF HARYANA • NON-JUDICIAL e-STAMP', 400, 90);
    ctx.font = 'bold 13px "JetBrains Mono", monospace';
    ctx.fillText('Certificate No: IN-HR88419201948210P • Stamp Value: ₹ 100', 400, 115);
    ctx.font = 'normal 11px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('ISSUED UNDER THE INDIAN STAMP ACT, 1899', 400, 138);

    // Body
    ctx.fillStyle = '#111827';
    ctx.textAlign = 'left';
    ctx.font = 'bold 14px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('REGISTERED LAND DEED & JAMABANDI MUTATION SCHEDULE', 50, 220);

    ctx.font = '12px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#374151';
    ctx.fillText('Deed of Transfer entered into between Municipal Corporation Gurugram and', 50, 255);
    ctx.fillText('Apex Shiskha & Research Foundation for Technical Campus Establishment.', 50, 280);

    // Declared Area vs Mismatch
    ctx.fillStyle = '#FEF2F2';
    ctx.fillRect(50, 320, 700, 90);
    ctx.strokeStyle = '#DC2626';
    ctx.strokeRect(50, 320, 700, 90);

    ctx.fillStyle = '#991B1B';
    ctx.font = 'bold 13px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('SCHEDULE OF LAND PROPERTY (DISPUTED SURVEY CLAIMS):', 70, 350);

    ctx.fillStyle = '#111827';
    ctx.font = '12px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Total Land Parcel Acreage Declared in Deed: ', 70, 380);

    ctx.fillStyle = '#DC2626';
    ctx.font = 'bold 14px "JetBrains Mono", monospace';
    ctx.fillText('4.80 Acres (19,425 sq.m) - SPLICED/ALTERED', 350, 380);

    // Stamps
    ctx.strokeStyle = '#831843';
    ctx.lineWidth = 2;
    ctx.strokeRect(100, 600, 160, 70);
    ctx.fillStyle = '#831843';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('SUB-REGISTRAR GURUGRAM', 180, 630);
    ctx.fillText('MUTATION #4819', 180, 650);
  };

  const renderBlueprintDoc = (ctx: CanvasRenderingContext2D) => {
    // Blueprint architectural drawing grid
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(40, 40, 720, 1050);

    // Blueprint grid lines
    ctx.strokeStyle = '#1E293B';
    ctx.lineWidth = 1;
    for (let x = 40; x <= 760; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 40);
      ctx.lineTo(x, 1090);
      ctx.stroke();
    }
    for (let y = 40; y <= 1090; y += 40) {
      ctx.beginPath();
      ctx.moveTo(40, y);
      ctx.lineTo(760, y);
      ctx.stroke();
    }

    // Rooms layout
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 14px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('INSTITUTIONAL GROUND FLOOR PLAN - WING B', 400, 70);

    // Classroom 1
    ctx.strokeStyle = '#38BDF8';
    ctx.lineWidth = 2;
    ctx.strokeRect(80, 120, 280, 200);
    ctx.fillStyle = '#38BDF8';
    ctx.fillText('CLASSROOM - 1: 66.0 SQ.M', 220, 220);

    // VLSI Lab (Inflated)
    ctx.strokeStyle = '#F43F5E';
    ctx.lineWidth = 2;
    ctx.strokeRect(400, 120, 280, 200);
    ctx.fillStyle = '#F43F5E';
    ctx.fillText('VLSI LAB - 66.0 SQ.M (TEXT)', 540, 210);
    ctx.font = 'bold 11px "JetBrains Mono", monospace';
    ctx.fillStyle = '#FB7185';
    ctx.fillText('[Actual Shoelace CV: 46.8 SQ.M]', 540, 235);

    // Scale bar
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(100, 1020);
    ctx.lineTo(340, 1020);
    ctx.stroke();
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText('0m', 100, 1040);
    ctx.fillText('5m', 220, 1040);
    ctx.fillText('10m (240px -> s = 0.04167 m/px)', 340, 1040);
  };

  const renderGenericDocument = (ctx: CanvasRenderingContext2D, doc: DocumentArtifact) => {
    ctx.fillStyle = '#111827';
    ctx.font = 'bold 16px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(doc.titleEn.toUpperCase(), 400, 100);

    ctx.font = 'normal 12px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#4B5563';
    ctx.fillText(`Official Repository: ${doc.issuingAuthority}`, 400, 130);
    ctx.fillText(`Verification State: ${doc.verificationState}`, 400, 150);
  };

  // Forensic Heatmap Overlays
  const renderTruForOverlay = (ctx: CanvasRenderingContext2D, suppressPristine: boolean) => {
    // TruFor Plasma / Inferno heatmap on tampered region
    const gradient = ctx.createRadialGradient(310, 598, 10, 310, 598, 130);
    gradient.addColorStop(0, 'rgba(239, 68, 68, 0.95)');   // Core peak anomaly
    gradient.addColorStop(0.3, 'rgba(249, 115, 22, 0.85)'); // High anomaly
    gradient.addColorStop(0.6, 'rgba(234, 179, 8, 0.50)');  // Mid boundary
    gradient.addColorStop(0.9, 'rgba(59, 130, 246, 0.20)');  // Transition
    gradient.addColorStop(1, 'rgba(15, 23, 42, 0.0)');      // Suppressed pristine

    ctx.save();
    ctx.fillStyle = gradient;
    ctx.fillRect(150, 510, 320, 170);

    // Heatmap contour indicator
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.8)';
    ctx.lineWidth = 2;
    ctx.strokeRect(250, 580, 120, 36);

    ctx.fillStyle = '#DC2626';
    ctx.font = 'bold 11px "JetBrains Mono", monospace';
    ctx.fillText('TruFor Anomaly: 0.984 (C_conf: 0.942)', 250, 570);
    ctx.restore();
  };

  const renderElaOverlay = (ctx: CanvasRenderingContext2D, q: number, gamma: number) => {
    // Simulate Error Level Analysis (ELA) high-pass differential
    ctx.save();
    // High pass dark noise over whole canvas
    ctx.fillStyle = 'rgba(15, 23, 42, 0.82)';
    ctx.fillRect(20, 20, 760, 1090);

    // Authentic text subtle noise
    ctx.fillStyle = 'rgba(148, 163, 184, 0.15)';
    ctx.fillRect(50, 200, 700, 300);

    // Spliced patch intense luminance residual spike (gamma * delta)
    const brightness = Math.min(1.0, (gamma / 20) * ((100 - q) / 25));
    ctx.fillStyle = `rgba(255, 255, 255, ${brightness * 0.9})`;
    ctx.fillRect(260, 582, 105, 30);

    // 8x8 DCT Macroblock Grid simulation
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
    ctx.lineWidth = 0.5;
    for (let x = 240; x <= 390; x += 16) {
      ctx.beginPath();
      ctx.moveTo(x, 570);
      ctx.lineTo(x, 630);
      ctx.stroke();
    }
    for (let y = 570; y <= 630; y += 16) {
      ctx.beginPath();
      ctx.moveTo(240, y);
      ctx.lineTo(390, y);
      ctx.stroke();
    }

    ctx.fillStyle = '#38BDF8';
    ctx.font = 'bold 11px "JetBrains Mono", monospace';
    ctx.fillText(`8x8 DCT Phase Shift ((dx,dy)=(3,5)) • Q=${q}% • γ=${gamma}`, 240, 560);

    ctx.restore();
  };

  return (
    <div className="flex flex-col h-full liquid-glass-card rounded-2xl overflow-hidden shadow-sm">
      {/* Top Toolbar */}
      <div className="p-3 border-b border-slate-200/80 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Layer Switcher */}
        <div className="inline-flex rounded-xl p-0.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold">
          <button
            onClick={() => setActiveLayer('RGB')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              activeLayer === 'RGB'
                ? 'bg-white dark:bg-slate-900 text-sky-700 dark:text-sky-400 shadow-2xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Original RGB
          </button>
          <button
            onClick={() => setActiveLayer('BBOX')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              activeLayer === 'BBOX'
                ? 'bg-white dark:bg-slate-900 text-sky-700 dark:text-sky-400 shadow-2xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            LayoutLMv3 BBox
          </button>
          <button
            onClick={() => setActiveLayer('TRUFOR')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              activeLayer === 'TRUFOR'
                ? 'bg-white dark:bg-slate-900 text-red-600 dark:text-red-400 shadow-2xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            TruFor Heatmap
          </button>
          <button
            onClick={() => setActiveLayer('ELA')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              activeLayer === 'ELA'
                ? 'bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-400 shadow-2xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            ELA & DCT Grid
          </button>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1.5 text-slate-500">
          <button
            onClick={() => setZoomLevel((prev) => Math.max(60, prev - 15))}
            className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="font-mono text-[11px] w-12 text-center">{zoomLevel}%</span>
          <button
            onClick={() => setZoomLevel((prev) => Math.min(160, prev + 15))}
            className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Sub-toolbar for ELA & TruFor Controls */}
      {activeLayer === 'ELA' && (
        <div className="px-4 py-2 bg-indigo-50/70 dark:bg-slate-950/70 border-b border-indigo-100 dark:border-slate-800 flex flex-wrap items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="text-slate-500">JPEG Quality (Q):</span>
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
              min="10"
              max="40"
              value={elaGamma}
              onChange={(e) => setElaGamma(Number(e.target.value))}
              className="w-20 accent-indigo-600 cursor-pointer"
            />
            <span className="font-bold text-indigo-600">{elaGamma}x</span>
          </div>
        </div>
      )}

      {activeLayer === 'TRUFOR' && (
        <div className="px-4 py-2 bg-red-50/70 dark:bg-slate-950/70 border-b border-red-100 dark:border-slate-800 flex items-center justify-between text-xs">
          <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700 dark:text-slate-300">
            <input
              type="checkbox"
              checked={showConfidenceMask}
              onChange={(e) => setShowConfidenceMask(e.target.checked)}
              className="rounded accent-red-600"
            />
            <span>Enable Anomaly Confidence Weighting (C_conf &gt; 0.80)</span>
          </label>
          <span className="text-[11px] font-mono font-bold text-red-600 dark:text-red-400">
            Noiseprint++ ResAware Engine Active
          </span>
        </div>
      )}

      {/* Canvas Scrollable Viewport */}
      <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-slate-200/40 dark:bg-slate-950/60">
        <div
          style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
          className="relative transition-transform duration-150 shadow-2xl rounded-lg overflow-hidden"
        >
          {/* HTML5 Canvas */}
          <canvas ref={canvasRef} className="block w-[600px] h-[848px] bg-white" />

          {/* SVG LayoutLMv3 Bounding Box Overlay */}
          {activeLayer === 'BBOX' && (
            <svg
              className="absolute inset-0 w-full h-full pointer-events-auto"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              {document.extractedFields.map((field, fIdx) => {
                const [x0, y0, x1, y1] = field.bbox;
                const isSelected =
                  activeAnomalyId === field.nameEn ||
                  anomalies.some(
                    (a) => a.id === activeAnomalyId && a.boundingBox[0] === x0 && a.boundingBox[1] === y0
                  );

                return (
                  <g key={fIdx} className="cursor-pointer group" onClick={() => onSelectAnomaly(field.nameEn)}>
                    <rect
                      x={x0}
                      y={y0}
                      width={x1 - x0}
                      height={y1 - y0}
                      fill={field.isMismatch ? 'rgba(239, 68, 68, 0.25)' : 'rgba(56, 189, 248, 0.2)'}
                      stroke={field.isMismatch ? '#DC2626' : '#0284C7'}
                      strokeWidth={isSelected ? 1.5 : 0.8}
                      strokeDasharray={field.isMismatch ? '2 1' : 'none'}
                      className="transition-all hover:fill-opacity-50"
                    />
                    <text
                      x={x0}
                      y={Math.max(3, y0 - 1.5)}
                      fontSize="2.5"
                      fontFamily="JetBrains Mono"
                      fontWeight="bold"
                      fill={field.isMismatch ? '#DC2626' : '#0284C7'}
                    >
                      {field.nameEn} ({Math.round(field.confidence * 100)}%)
                    </text>
                  </g>
                );
              })}
            </svg>
          )}
        </div>
      </div>
    </div>
  );
}
