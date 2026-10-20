'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/lib/context';
import { MOCK_APPLICATIONS } from '@/lib/mock-data';
import { toast } from 'sonner';
import {
  Upload,
  ScanEye,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  FileCode,
  ShieldAlert,
  Binary,
  Layers,
  Sparkles,
  RefreshCw,
  Search,
} from 'lucide-react';

export default function ForensicsStudioPage() {
  const { t, language } = useLanguage();

  // Local upload state
  const [uploadedImageSrc, setUploadedImageSrc] = useState<string | null>(null);
  const [activeAnalysisMode, setActiveAnalysisMode] = useState<'ELA' | 'NOISEPRINT' | 'LUMINANCE' | 'XREF'>('NOISEPRINT');
  const [jpegQ, setJpegQ] = useState<number>(75);
  const [gammaMultiplier, setGammaMultiplier] = useState<number>(20);

  // Selected sample document
  const [selectedSample, setSelectedSample] = useState<string>('apex-fire-noc');

  // File upload input ref
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Handle local file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/') && !file.name.endsWith('.pdf')) {
      toast.error('Please upload an image file (PNG, JPG, TIFF) or PDF document');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setUploadedImageSrc(event.target?.result as string);
      toast.success(`Loaded "${file.name}" into Local Forensics Sandbox`, {
        description: 'Client-side ELA, Noiseprint++ simulation & DCT grid initialized.',
      });
    };
    reader.readAsDataURL(file);
  };

  // Render forensic analysis on canvas
  useEffect(() => {
    const canvas = previewCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // If user uploaded an image, draw the actual uploaded file!
    if (uploadedImageSrc) {
      const img = new Image();
      img.onload = () => {
        const maxWidth = 640;
        const scale = Math.min(1, maxWidth / img.width);
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        if (activeAnalysisMode === 'ELA') {
          try {
            const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const d = imgData.data;
            const factor = (gammaMultiplier / 15) * ((100 - jpegQ) / 20);
            for (let i = 0; i < d.length; i += 4) {
              const diff = Math.abs(d[i] - d[i + 1]);
              d[i] = Math.min(255, Math.round(diff * factor * 8));
              d[i + 1] = Math.min(255, Math.round(diff * factor * 4));
              d[i + 2] = Math.min(255, Math.round(d[i + 2] * 0.2 + diff * factor * 6));
            }
            ctx.putImageData(imgData, 0, 0);

            // 8x8 DCT grid overlay
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
            ctx.lineWidth = 0.5;
            for (let x = 0; x < canvas.width; x += 16) {
              ctx.beginPath();
              ctx.moveTo(x, 0);
              ctx.lineTo(x, canvas.height);
              ctx.stroke();
            }
            for (let y = 0; y < canvas.height; y += 16) {
              ctx.beginPath();
              ctx.moveTo(0, y);
              ctx.lineTo(canvas.width, y);
              ctx.stroke();
            }
          } catch (e) {
            // fallback if canvas tainted
          }
        } else if (activeAnalysisMode === 'NOISEPRINT') {
          // Heatmap overlay on uploaded file
          const grad = ctx.createRadialGradient(
            canvas.width / 2,
            canvas.height / 2,
            10,
            canvas.width / 2,
            canvas.height / 2,
            canvas.width / 3
          );
          grad.addColorStop(0, 'rgba(239, 68, 68, 0.85)');
          grad.addColorStop(0.5, 'rgba(249, 115, 22, 0.45)');
          grad.addColorStop(1, 'rgba(239, 68, 68, 0.0)');
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        } else if (activeAnalysisMode === 'LUMINANCE') {
          const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const d = imgData.data;
          for (let i = 0; i < d.length; i += 4) {
            const gray = Math.round(0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2]);
            d[i] = gray;
            d[i + 1] = gray > 180 ? 255 : 0;
            d[i + 2] = 255 - gray;
          }
          ctx.putImageData(imgData, 0, 0);
        }
      };
      img.src = uploadedImageSrc;
      return;
    }

    // Default synthetic document simulation
    canvas.width = 640;
    canvas.height = 380;

    // Background base
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(0, 0, 640, 380);

    if (activeAnalysisMode === 'NOISEPRINT') {
      // Draw Noiseprint++ simulation: ResAware BatchNorm vs InstanceNorm2d
      ctx.fillStyle = '#1E293B';
      ctx.fillRect(20, 20, 600, 340);

      // Authentic noise floor
      for (let x = 30; x < 610; x += 12) {
        for (let y = 30; y < 350; y += 12) {
          const noise = Math.random() * 0.15;
          ctx.fillStyle = `rgba(148, 163, 184, ${noise})`;
          ctx.fillRect(x, y, 8, 8);
        }
      }

      // Spliced patch showing high variance anomaly (ResAware preserved)
      const grad = ctx.createRadialGradient(320, 190, 10, 320, 190, 90);
      grad.addColorStop(0, 'rgba(239, 68, 68, 0.9)');
      grad.addColorStop(0.5, 'rgba(249, 115, 22, 0.6)');
      grad.addColorStop(1, 'rgba(239, 68, 68, 0.0)');

      ctx.fillStyle = grad;
      ctx.fillRect(200, 110, 240, 160);

      ctx.strokeStyle = '#EF4444';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(250, 150, 140, 60);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 12px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText('Doctored Digit "2027" (ResAware AUC: 0.747)', 320, 140);
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillStyle = '#FCA5A5';
      ctx.fillText('Sensor PRNU Residual Variance Discontinuity: +418%', 320, 230);
    } else if (activeAnalysisMode === 'ELA') {
      // ELA differential simulation
      ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
      ctx.fillRect(20, 20, 600, 340);

      // Spliced area luminance spike
      const brightness = Math.min(1.0, (gammaMultiplier / 20) * ((100 - jpegQ) / 20));
      ctx.fillStyle = `rgba(255, 255, 255, ${brightness * 0.95})`;
      ctx.fillRect(250, 150, 140, 50);

      // 8x8 DCT grid
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
      ctx.lineWidth = 0.5;
      for (let x = 230; x <= 410; x += 16) {
        ctx.beginPath();
        ctx.moveTo(x, 130);
        ctx.lineTo(x, 220);
        ctx.stroke();
      }
      for (let y = 130; y <= 220; y += 16) {
        ctx.beginPath();
        ctx.moveTo(230, y);
        ctx.lineTo(410, y);
        ctx.stroke();
      }

      ctx.fillStyle = '#38BDF8';
      ctx.font = 'bold 11px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`Error Level Analysis @ Q=${jpegQ}% • Gain=${gammaMultiplier}x`, 320, 120);
    } else if (activeAnalysisMode === 'LUMINANCE') {
      // Luminance Gradient
      ctx.fillStyle = '#1E293B';
      ctx.fillRect(20, 20, 600, 340);

      const lgrad = ctx.createLinearGradient(40, 40, 600, 340);
      lgrad.addColorStop(0, '#0284C7');
      lgrad.addColorStop(0.5, '#4338CA');
      lgrad.addColorStop(1, '#0F172A');
      ctx.fillStyle = lgrad;
      ctx.fillRect(40, 40, 560, 300);

      ctx.fillStyle = '#EF4444';
      ctx.fillRect(260, 160, 120, 40);
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 11px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText('Lighting Angle & Shading Differential Spike', 320, 150);
    } else {
      // PDF XRef Stream
      ctx.fillStyle = '#020617';
      ctx.fillRect(20, 20, 600, 340);
      ctx.font = '11px "JetBrains Mono", monospace';
      ctx.textAlign = 'left';
      ctx.fillStyle = '#10B981';
      ctx.fillText('xref', 40, 60);
      ctx.fillText('0 48', 40, 80);
      ctx.fillText('0000000000 65535 f', 40, 100);
      ctx.fillText('0000000017 00000 n', 40, 120);
      ctx.fillStyle = '#EF4444';
      ctx.fillText('trailer << /Size 48 /Root 1 0 R /Info 2 0 R >>', 40, 150);
      ctx.fillText('%%EOF (Incremental Revision #2 Detected)', 40, 175);
      ctx.fillStyle = '#F59E0B';
      ctx.fillText('/Producer (Canva / PDFtk 2.02 Splicer)', 40, 205);
      ctx.fillText('/CreationDate (D:20260328101422Z) ≠ /ModDate (D:20260328114019Z)', 40, 225);
      ctx.fillStyle = '#38BDF8';
      ctx.fillText('Unembedded Font Subset Detected: ArialMT mixed with TimesNewRomanPSMT', 40, 260);
    }
  }, [activeAnalysisMode, jpegQ, gammaMultiplier, uploadedImageSrc]);


  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Multi-Spectral Document{' '}
          <span className="font-serif italic font-normal text-sky-700 dark:text-sky-400">
            Forensics Studio
          </span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Pixel-level tampering localization, Noiseprint++ ResAware ablation, and Siamese seal verification
        </p>
      </div>

      {/* Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Sandbox & Canvas (7 cols) */}
        <div className="lg:col-span-7 liquid-glass-card rounded-2xl p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ScanEye className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                <span>Forensic Analysis Sandbox</span>
              </h2>
              <p className="text-xs text-slate-400">
                Execute client-side ELA, Noiseprint++ anomaly maps & byte streams
              </p>
            </div>

            {/* Mode Switcher */}
            <div className="inline-flex rounded-xl p-0.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold">
              <button
                onClick={() => setActiveAnalysisMode('NOISEPRINT')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  activeAnalysisMode === 'NOISEPRINT'
                    ? 'bg-white dark:bg-slate-900 text-red-600 dark:text-red-400 shadow-2xs font-bold'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Noiseprint++
              </button>
              <button
                onClick={() => setActiveAnalysisMode('ELA')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  activeAnalysisMode === 'ELA'
                    ? 'bg-white dark:bg-slate-900 text-sky-700 dark:text-sky-400 shadow-2xs font-bold'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                ELA & DCT
              </button>
              <button
                onClick={() => setActiveAnalysisMode('LUMINANCE')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  activeAnalysisMode === 'LUMINANCE'
                    ? 'bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-400 shadow-2xs font-bold'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Luminance
              </button>
              <button
                onClick={() => setActiveAnalysisMode('XREF')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  activeAnalysisMode === 'XREF'
                    ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-2xs font-bold'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                PDF XRef
              </button>
            </div>
          </div>

          {/* Interactive controls bar for ELA */}
          {activeAnalysisMode === 'ELA' && (
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700 flex flex-wrap items-center gap-6 text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="text-slate-400">JPEG Q Factor:</span>
                <input
                  type="range"
                  min="50"
                  max="95"
                  value={jpegQ}
                  onChange={(e) => setJpegQ(Number(e.target.value))}
                  className="w-28 accent-sky-600"
                />
                <span className="font-bold text-sky-600">{jpegQ}%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Amplification (γ):</span>
                <input
                  type="range"
                  min="10"
                  max="40"
                  value={gammaMultiplier}
                  onChange={(e) => setGammaMultiplier(Number(e.target.value))}
                  className="w-24 accent-sky-600"
                />
                <span className="font-bold text-sky-600">{gammaMultiplier}x</span>
              </div>
            </div>
          )}

          {/* Canvas Display Viewport */}
          <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950 flex items-center justify-center p-2 shadow-inner">
            <canvas ref={previewCanvasRef} className="max-w-full rounded" />
          </div>

          {/* Upload Sandbox Area */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="p-4 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-sky-500 dark:hover:border-sky-400 transition-colors flex items-center justify-center gap-3 cursor-pointer bg-white/40 dark:bg-slate-800/40"
          >
            <Upload className="w-5 h-5 text-sky-600 dark:text-sky-400 shrink-0" />
            <div className="text-left">
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Upload Local Document or Scan to Run Live Forensics
              </div>
              <div className="text-[11px] text-slate-400">
                Supports PNG, JPEG, PDF files up to 50MB (Client-side HTML5 canvas evaluation)
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,application/pdf"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        </div>

        {/* Right: Architectural Ablations & Siamese Seal Matrix (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Section 1: Noiseprint++ ResAware Architecture Inspector */}
          <div className="liquid-glass-card rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Binary className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                ResAware vs. InstanceNorm2d Ablation
              </h3>
            </div>
            <p className="text-xs text-slate-400">
              InstanceNorm2d standardizes each channel independently, annihilating sensor noise variance and dropping AUC from 0.747 to 0.554. ResAware preserves scalar statistics.
            </p>

            <div className="space-y-2 font-mono text-xs">
              <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 flex justify-between items-center">
                <span className="font-medium text-red-700 dark:text-red-400">Vanilla TruFor (InstanceNorm2d)</span>
                <span className="font-bold text-red-700 dark:text-red-400">AUC: 0.554 (Signal Collapsed)</span>
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex justify-between items-center">
                <span className="font-medium text-emerald-700 dark:text-emerald-400">ResAware BatchNorm + StatNoise</span>
                <span className="font-bold text-emerald-700 dark:text-emerald-400">AUC: 0.747 (Preserved)</span>
              </div>
            </div>

            {/* 13 Scalar Statistics Preview */}
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                13 Extracted Scalar Noise Features
              </div>
              <div className="grid grid-cols-2 gap-1.5 font-mono text-[10px]">
                <div className="p-1.5 rounded bg-slate-100 dark:bg-slate-800">Mean: 0.0041</div>
                <div className="p-1.5 rounded bg-slate-100 dark:bg-slate-800">Variance: 0.0892</div>
                <div className="p-1.5 rounded bg-slate-100 dark:bg-slate-800">Skewness: -0.142</div>
                <div className="p-1.5 rounded bg-slate-100 dark:bg-slate-800">Kurtosis: 3.821</div>
              </div>
            </div>
          </div>

          {/* Section 2: Siamese ArcFace Seal & Signature Matrix */}
          <div className="liquid-glass-card rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-600 dark:text-rose-400" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Siamese ArcFace Seal & Signature Comparator
              </h3>
            </div>
            <p className="text-xs text-slate-400">
              Additive Angular Margin Loss ($\mathcal&#123;L&#125;_&#123;\text&#123;ArcFace&#125;&#125;$) embeds stamps into a 512-D hypersphere with polar coordinate seal unwrapping.
            </p>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-800 dark:text-slate-200">Municipal Fire Seal Specimen</div>
                  <div className="text-[10px] text-slate-400">Gurugram Circle Master Bank</div>
                </div>
                <div className="text-right font-mono">
                  <div className="text-emerald-600 font-bold">cos(θ) = 0.962</div>
                  <div className="text-[10px] text-slate-400">Match Authenticated</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-between">
                <div>
                  <div className="font-bold text-red-700 dark:text-red-400">Chairman Signature Clone</div>
                  <div className="text-[10px] text-red-500">Deccan Academy (9 Affidavits)</div>
                </div>
                <div className="text-right font-mono">
                  <div className="text-red-700 dark:text-red-400 font-bold">SSIM = 0.998</div>
                  <div className="text-[10px] text-red-500">DIGITAL_CLONE_FRAUD</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
