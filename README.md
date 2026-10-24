# 🏛️ AICTE Regulatory Scrutiny & Forensic Document Intelligence Workstation
### Smart India Hackathon — Problem Statement ID: 26261

[![Live Platform](https://img.shields.io/badge/Production%20Live-aicte--scrutiny.vercel.app-0284c7?style=for-the-badge&logo=vercel&logoColor=white)](https://aicte-scrutiny.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-15.5.28-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0.0-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0.9-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald?style=for-the-badge)](https://opensource.org/licenses/MIT)

> **Official Live Production URL:**  
> 👉 **[https://aicte-scrutiny.vercel.app](https://aicte-scrutiny.vercel.app)**

---

## 📌 Executive Summary

Every academic year, the **All India Council for Technical Education (AICTE)**, under the Ministry of Education, Government of India, scrutinizes tens of thousands of institutional compliance dossiers for Extension of Approval (EoA), new program approvals, and intake variations. Today, regulatory scrutiny officers are burdened with thousands of pages of submitted certificates, land titles, building plans, and faculty rosters.

The **AICTE Regulatory Scrutiny & Forensic Document Intelligence Workstation (PS 26261)** is an evidence-linked regulatory cockpit engineered specifically for AICTE Regional Scrutiny Officers and Bureau Officials. Rather than acting as an opaque black box that auto-approves or auto-rejects, the system acts as a **forensic decision-support co-pilot**: every single anomaly, deficiency, or fraud alert is linked directly to pixel-level forensic evidence, mathematical calculations from the **Approval Process Handbook (APH 2024–2027)**, and cryptographic cross-checks with National Digital Public Infrastructure (DPI) databases.

---

## 🌟 What Makes This Platform Different?

1. **Evidence-Linked Decision Support, Never a Black Box**  
   Every flagged anomaly links to interactive multi-spectral canvas bounding boxes, Error Level Analysis (ELA) residuals, Noiseprint++ heatmaps, exact APH statutory rule citations, and cryptographic issuing authority audit records. Officers retain ultimate discretionary authority, backed by undeniable forensic proof.

2. **Strict Decoupling of Fatal Fraud from Rectifiable Deficiencies**  
   - **Fatal Fraud (Red Veto):** Altered land deed acreage, spliced Fire NOC issue dates, digital stamp cloning, or biometric/EPFO Ghost Faculty across colleges immediately triggers the non-linear gate ($\Gamma_{forensic} = 0$), routing dossiers directly to the **Standing Hearing Committee (SHC)**.
   - **Rectifiable Deficiencies:** Minor 3.8% tutorial room shortfall, pending municipal pollution board renewal, or cadre imbalances auto-generate official **15-day EVC rectification notices** without unfairly penalizing the institution with fraud sanctions.

3. **100% Bilingual Localization (English & हिन्दी)**  
   Full interface parity in both English and formal regulatory Hindi (`Noto Sans Devanagari` and `Khand`), allowing Regional Officers across all 8 AICTE zones to audit institutional applications in their preferred official language.

4. **Cryptographic Integrity & Non-Repudiation**  
   Every AI inference, DPI handshake, and officer decision is logged into an immutable **SHA-256 Merkle-tree chained audit ledger**, verifiable with one click and exportable as signed JSON.

---

## 🧭 Complete Interactive Walkthrough & Module Guide

Every single page and button across the platform is functional and interactive. Here is how each module works:

### 1. Executive Scrutiny Overview (`/overview`)
- **Interactive KPI Grid:** Real-time breakdown of Total Dossiers, Fatal Fraud alerts, Rectifiable Deficiencies, Approved EoAs, DPI Verified rate, and Mean Turnaround time.
- **Priority Intervention Banner:** Pinpoints the highest-risk dossier in the nation; clicking **"Open Scrutiny Workbench"** jumps straight into the deep-dive workstation, while **"Quick-Look Evidence"** displays an instant multi-attribute inspection modal.
- **Dynamic Scope & Regional Filtering:** Filter all dossiers and stats across Academic Years (2026–27, 2025–26, 2024–25), 8 AICTE Regions (North-West, Northern, Western, Central, Eastern, Southern, South-West, South-Central), Institution Types, and Statuses.
- **AI Scrutiny Engine Distribution:** Frequency breakdown of anomaly detections across PaddleOCR LayoutLMv3, TruFor Splicing, CAD Shoelace Area, ArcFace Ghost Faculty, and DPI Bridge—each linking directly into its respective module.
- **National DPI Telemetry Cards:** Live ping status of 6 national registries (DigiLocker, EPFO, State e-District, MCA21, Land Revenue, AICTE Cadastral GIS).
- **High-Risk Intervention Queue:** Clickable table rows with instant evidence quick-looks, direct workbench routing, and 1-click deficiency notice drafts.

### 2. Searchable Institutional Registry (`/applications`)
- **Table vs. Card Layout:** Instantly toggle between dense tabular view and visual glassmorphism cards with 5-component ICI compliance spark-bars.
- **Multi-Factor Sorting:** Sort on the fly by Risk Priority Number (RPN), Institutional Compliance Index (ICI), Submission Date, or Institution Name.
- **Simulate SynDoc-10K Ingestion:** Click **"Simulate Ingestion"** to trigger a real-time animated batch ingestion of synthetic institutional dossiers.
- **Batch Data Export:** Instant 1-click **Export CSV** and **Export JSON** of filtered compliance records.
- **Side-by-Side Institution Comparison:** Select two institutions to open the comprehensive dual-column comparison modal inspecting land size, carpet area, faculty ratios, and forensic risk scores.

### 3. Forensic Scrutiny Workbench (`/applications/[id]`)
- **Dual-Pane Split-Screen Workspace:** Left pane hosts the deep forensic document canvas; right pane contains the multi-tab inspector.
- **Multi-Document Tabs:** Switch between Document 1 (Fire Safety NOC), Document 2 (Land Revenue Jamabandi Deed), Document 3 (Architectural CAD Floor Plan), and Document 4 (Teaching Faculty & Staff Roster).
- **Multi-Spectral Forensic Overlays:**
  - **Original RGB:** Clean scan visualization.
  - **LayoutLMv3 (KIE):** Visual 2D spatial bounding boxes around extracted key fields.
  - **TruFor Heatmap:** RGB anomaly colormap revealing spliced text and re-saved regions.
  - **Error Level Analysis (ELA):** Recompression residual view highlighting manipulated text blocks.
  - **8×8 DCT BAG:** Discrete Cosine Transform block artifact grid alignment inspector.
  - **Interactive 3× Loupe Magnifier:** Real-time cursor loupe zoom for examining microscopic pixel edges.
- **Authority Reconciliation Tab:** Side-by-side comparison of applicant claims against authoritative DigiLocker / State Fire portal records with color-coded diff highlights.
- **APH Math Verifier Tab:** Interactive sliders for student intake, land size, and faculty roster with real-time recalculation of statutory requirements under APH Chapter VII.
- **Ghost Faculty Biometric Radar:** ArcFace 512-D cosine similarity matching and EPFO UAN deduplication across sister colleges.
- **SLANet Table Topology Inspector:** View complex tabular data in Visual, Clean HTML DOM, or Token Graph format.
- **Executive Action Bar:** 1-click decision dispatch to **Approve EoA**, **Issue 15-Day Deficiency Notice**, or **Escalate to Standing Hearing Committee (SHC)**.

### 4. Digital Forensics Studio (`/forensics`)
- **Local File Upload Sandbox:** Drag and drop or browse any local PDF or image scan to test live client-side forensics.
- **Adjustable ELA Engine:** Custom sliders for JPEG recompression quality factor (50%–100%) and amplification multiplier scale ($\gamma = 5\times\text{--}50\times$) with instantaneous HTML5 canvas rendering.
- **Noise Analysis Ablation Test:** Interactive comparison of ResAware BatchNorm2d vs. traditional InstanceNorm2d, illustrating how scalar noise statistics are preserved.
- **Seal & Signature Verification Lab:** 360° polar unwrapping of circular stamps to linear strips for OCR reading, paired with Siamese ArcFace cosine similarity thresholds.
- **PDF Stream & Font Forensics:** Detailed breakdown of PyMuPDF xref tables, `%%EOF` save counts, producer software tags, and embedded font subset discrepancies (e.g. injected ArialMT digits inside TimesNewRoman text).

### 5. Blueprint & Campus CV Studio (`/infrastructure`)
- **Interactive Architectural CAD Viewer:** SVG floor plan viewer with clickable room polygons, hover tooltips, and occupancy classifications.
- **Graphic Scale Bar Calibrator:** Interactive slider adjusting pixels-to-meters calibration ($s = L_m / L_{px}$), dynamically updating Shoelace carpet areas in real time.
- **What-If FSI / FAR & Intake Simulator:** Dynamic sliders for student intake and municipal Floor Space Index (1.5–3.5) computing built-up area sufficiency under APH norms.
- **Multi-Plot Cadastral Contiguity Validator:** Visual verification that up to 3 campus land parcels fall within the statutory $\le 2.0\text{ km}$ Haversine radius, with instructional facilities confined to the main plot.

### 6. National DPI Authority Bridge (`/authority-bridge`)
- **Cryptographic Handshake Simulator:** Click **"Execute Cryptographic DPI Handshake"** to trigger an animated 4-stage live stepper (OAuth 2.0 PKCE, HMAC-SHA256, XML Pull URI, and Field Diff Reconciliation) with realistic millisecond latency telemetry.
- **Deterministic Six-State Regulatory Protocol:** Interactive toggle buttons for all 6 regulatory states (`VERIFIED`, `MISMATCH_DETECTED`, `EXPIRED`, `VERIFY_PENDING`, `SOURCE_UNAVAIL`, `MANUAL_REVIEW`) with toast notifications and active state styling.
- **Institutional Certificate Presets:** 4 pre-configured presets:
  - *Fire NOC (HR • Tampered)*: Simulates certificate issue date mismatch against Haryana Fire Service.
  - *Jamabandi Deed (HR • Spliced)*: Simulates land area alteration against Haryana Revenue Department.
  - *Fire NOC (MH • Verified)*: Demonstrates a 100% verified handshake with Maharashtra Fire Directorate.
  - *Bhulekh Grant (OD • 503 Retry)*: Demonstrates API Setu gateway failover and retry mechanisms.
- **EPFO ECR 2.0 & 50% Basic Wage Rule:** Live interactive salary add-back calculator testing compliance with the Supreme Court 2019 ruling and Social Security Code 2020.
- **High-Density QR Code Cryptographic Verifier:** Simulates 2D QR decoding and ECDSA/RSA-2048 public key verification against state root certificates.

### 7. Statutory Deficiency & Show-Cause Generator (`/deficiencies`)
- **Statutory Order Formats:** Toggle between **Form-A (15-Day EVC Deficiency Notice)** for rectifiable discrepancies and **Form-B (Immediate SHC Summons)** for fatal fraud alerts.
- **Language Mode Parity:** Read notices in English, formal Rajbhasha Hindi, or side-by-side bilingual dual-column layout.
- **15-Day Countdown Clock:** Live countdown timer down to the second tracking the institutional compliance window.
- **Officer Class-3 DSC USB Token Signing Modal:** Click **"Sign with Officer Class-3 DSC"** to open the interactive digital signature dialog, select an e-token, compute the SHA-256 digest, and embed the cryptographic seal.
- **Print & Dispatch:** Built-in clean print formatting (`window.print`) and simulated portal dispatch with SMS notification alerts.

### 8. Immutable SHA-256 Scrutiny Ledger (`/audit-trail`)
- **Cryptographically Chained Blocks:** Chronological Merkle chain logging AI model inference, DPI handshakes, and officer actions with parent hash validation.
- **Verify Hash Chain Integrity:** Click **"Verify Hash Chain Integrity"** to trigger a real-time verification sequence confirming 0 collisions across all blocks.
- **1-Click SHA-256 Hash Copying:** Click any block's hash badge to copy the full 64-character hex string to clipboard.
- **Ledger Export:** Download the entire tamper-evident scrutiny ledger as a formatted `.json` file for statutory retention.

### 9. Productivity & Shell Controls
- **Global Command Palette (`⌘K` or `Ctrl+K`):** Accessible from anywhere in the application or by clicking the top search bar. Instant jump search across institutions, PIDs, UANs, and APH statutory clauses.
- **Liquid Glass Civic Design System:** Ultra-crisp typography, subtle borders, high-contrast dark/light mode parity, and zero subpixel text blurring.
- **Responsive Mobile Drawer:** Smooth slide-out navigation rail for tablet and mobile viewports with quick-close backdrop.

---

## 🔬 Multi-Modal Machine Learning Architecture

```
                           ┌───────────────────────────────────────────────┐
                           │          Institutional Dossier (PDF)          │
                           └───────────────────────┬───────────────────────┘
                                                   │
                   ┌───────────────────────────────┼──────────────────────────────┐
                   ▼                               ▼                              ▼
        ┌─────────────────────┐        ┌──────────────────────┐        ┌──────────────────────┐
        │   Layout-Aware IDP  │        │   Forensic Splicing  │        │   CAD Floor Plan CV  │
        │  PaddleOCR + SLANet │        │  TruFor + NFA-ViT    │        │  Mask2Former + RMBG  │
        │  LayoutLMv3 (KIE)   │        │  ResAware + ELA/BAG  │        │  Shoelace Calibrator │
        └──────────┬──────────┘        └──────────┬───────────┘        └──────────┬───────────┘
                   │                               │                              │
                   └───────────────────────────────┼──────────────────────────────┘
                                                   │
                                                   ▼
                                 ┌───────────────────────────────────┐
                                 │   National DPI Authority Bridge   │
                                 │  DigiLocker • EPFO ECR • MCA21    │
                                 └─────────────────┬─────────────────┘
                                                   │
                                                   ▼
                                 ┌───────────────────────────────────┐
                                 │      APH 2024-27 Rule Engine      │
                                 │    ICI Index & RPN Risk Scoring   │
                                 └─────────────────┬─────────────────┘
                                                   │
                                                   ▼
                                 ┌───────────────────────────────────┐
                                 │    Officer Scrutiny Workbench     │
                                 │  & SHA-256 Chained Audit Ledger   │
                                 └───────────────────────────────────┘
```

1. **Intelligent Document Processing (IDP):**  
   - **PP-StructureV3** (`picodet_lcnet_x1_0_fgd_layout`) with Focal and Global Distillation (41ms CPU inference) to segment Text, Tables, Stamps, and Figures.
   - **SLANet-LCNetV2** with dynamic EOS termination achieving a 96.67% TEDS table reconstruction score.
   - **LayoutLMv3-Large** with 2D spatial coordinates ($[x_0, y_0, x_1, y_1] \in [0, 1000]$) and sequence tagging over legal deeds and affidavits.

2. **Micro-Forgery & Splicing Localization:**  
   - Resolves the TruFor InstanceNorm2d bottleneck using **Extract-Then-Crop** native extraction and **ResAware BatchNorm2d**, recovering AUC from 0.554 back to 0.747+.
   - **Multi-Quality Error Level Analysis (ELA)** recompressing rasters at $Q=90\%$ to isolate amplified residuals $E(x, y) = |I(x, y) - I_{Q90}(x, y)| \times \gamma$.
   - **Copy-Move Forgery Detection (CMFD)** using dense SIFT/ORB keypoints with RANSAC homography estimation.

3. **Biometric Stamp & Signature Verification:**  
   - **YOLOv11m-Doc** operating at $1280 \times 1280$ isolating wet signatures and notary seals.
   - **Polar Coordinate Seal Unwrapping** converting circular seals into $(r, \theta)$ strips for 360° text inspection.
   - **ArcFace Metric Learning** (Siamese ResNet-50, Additive Angular Margin $s=64.0, m=0.50\text{ rad}$) mapping signatures to a 512-D hypersphere.

4. **CAD Blueprint Vectorization & Area Geometry:**  
   - **Mask2Former** (Swin-Base backbone) paired with **RMBG-1.4** structural wall boundary branch.
   - **Graphic Scale Bar Calibration & Shoelace Carpet Area:**
     $$s = \frac{L_m}{L_{px}} \quad (\text{m/px}), \qquad \text{Area}(P) = s^2 \cdot \frac{1}{2} \left| \sum_{i=1}^n (x_i y_{i+1} - x_{i+1} y_i) \right|$$

5. **Campus Scrutiny & Ghost Faculty Deduplication:**  
   - **RetinaFace** 5-point alignment feeding $112 \times 112$ crops into **ArcFace** (IResNet-100) generating 512-D vectors indexed in **Qdrant** via HNSW graphs ($M=32, ef=200$).
   - Flags concurrent teaching appointments across disparate colleges and cross-references **EPFO ECR 2.0** monthly provident fund contributions.

---

## 📐 Deterministic APH 2024–2027 Mathematical Formulations

### 1. Built-Up Area Requirement ($TB_{req}$)
$$TB_{req} = (INA_{req} + ADA_{req} + AMA_{req}) + ACA_{req}$$
$$\text{where } ACA_{req} = 0.25 \times (INA_{req} + ADA_{req} + AMA_{req})$$
- **Instructional Carpet Area ($INA$):** Classrooms ($1.0\text{--}1.1\text{ m}^2/\text{student}$), Tutorial Rooms ($25\%$ of classrooms), Laboratories ($66\text{ m}^2/\text{lab}$ with up to $30\%$ sharing for allied branches: $\text{Lab}_{allied} = 0.70 \times \text{Lab}_{nominal}$).
- **Administrative Carpet Area ($ADA$):** Principal Office, Board Room, Department Offices, Faculty Cabins.
- **Amenities Carpet Area ($AMA$):** Toilets (Boys, Girls, PWD), Cafeteria, First-Aid Room, Stationery Store.

### 2. Location-Specific Land Area Norms ($L_{req}$)
$$L_{req} = \max\left(\frac{TB_{req}}{\Phi_{loc}}, L_{legacy}(Zone, Year_{est})\right)$$
where $\Phi_{loc}$ is the prevailing municipal Floor Space Index (FSI/FAR) across Mega, Metro, Urban, or Rural classifications.

### 3. Student-Faculty Ratio & 1:2:6 Cadre Distribution
$$F_{req} = \left\lceil \frac{S_{UG}}{20} \right\rceil + \left\lceil \frac{S_{PG}}{15} \right\rceil$$
$$F_{Prof} = \left\lfloor \frac{1}{9} F_{req} \right\rfloor, \quad F_{Assoc} = \left\lfloor \frac{2}{9} F_{req} \right\rfloor, \quad F_{Asst} = F_{req} - (F_{Prof} + F_{Assoc})$$

### 4. Institutional Compliance Index (ICI) & Risk Priority Number (RPN)
$$ICI = \Gamma_{forensic} \times \sum_{k=1}^5 w_k S_k$$
$$\Gamma_{forensic} = \prod_{m \in M_{fatal}} \left(1 - \mathbb{I}(P_{tamper}(m) \ge 0.85 \land C_{conf}(m) \ge 0.80)\right)$$
$$RPN(a_i) = \text{Severity}(a_i) \times \text{Occurrence}(a_i) \times \text{ForensicCertainty}(a_i) \in [1, 1000]$$

---

## 💻 Tech Stack & Project Structure

| Layer | Technologies |
| :--- | :--- |
| **Frontend Framework** | **Next.js 15.5.28** (App Router, Server & Client Components) |
| **Core UI Library** | **React 19.0.0** |
| **Styling & Theme** | **Tailwind CSS v4.0.9** + Custom Liquid Glass Civic Tokens |
| **Type Safety** | **TypeScript 5.8.2** (Strict Mode) |
| **Icons & Graphics** | **Lucide React**, Custom SVG Blueprint Planar Graphs |
| **Theme Management** | **next-themes** (Smooth Light / Dark mode persistence) |
| **Bilingual Engine** | Pure React Context with complete EN/HI localized dictionary |
| **Hosting & CDN** | **Vercel Edge Network** ([https://aicte-scrutiny.vercel.app](https://aicte-scrutiny.vercel.app)) |
| **Backend Microservice** | **Python 3.11+**, **FastAPI 0.110.0**, **PyMuPDF**, **OpenCV** |

```
app/
├── (routes)
│   ├── overview/page.tsx         # Unified 6-Column KPI Grid, Priority Intervention Banner, Regional Matrix
│   ├── applications/page.tsx     # Searchable Institutional Registry (Table / Card view, 5-comp sparkbars)
│   ├── applications/[id]/page.tsx# Dual-Pane Forensic Scrutiny Workbench (Canvas/CAD + Extracted diffs + APH math)
│   ├── forensics/page.tsx        # Digital Forensics Studio (Live client-side Canvas ELA, ResAware ablation, ArcFace)
│   ├── infrastructure/page.tsx   # Blueprint & Campus CV Studio (Scale bar calibration, Shoelace area, What-If FSI)
│   ├── authority-bridge/page.tsx # National DPI Handshake Monitor (DigiLocker, EPFO, e-District QR simulation)
│   ├── deficiencies/page.tsx     # Bilingual Statutory Deficiency Notice Generator & 15-Day Countdown Tracker
│   ├── audit-trail/page.tsx      # Immutable SHA-256 Chained Scrutiny Ledger with Merkle hash verification
│   └── api/                      # Next.js Route Handlers for applications, compliance calculation, and forensics
components/
├── shell/                        # Persistent LeftGlassRail, FloatingTopHeader, GlobalFilterBar, CommandPalette
├── brand/                        # Official AICTE Emblem & Regulatory Bureau SVG Vectors
└── workbench/                    # ForensicDocumentCanvas (HTML5 Canvas ELA/TruFor), BlueprintVectorViewer (CAD SVG)
lib/
├── aph-engine.ts                 # Pure mathematical formulas implementing APH Chapter VII, SFR, Cadre, and ICI
├── mock-data.ts                  # 6 comprehensive institutional dossiers spanning all AICTE regions & fraud types
├── context.tsx                   # React Contexts for Theme, Filters, and Language
└── i18n.ts                       # 100% complete bilingual English and Hindi translation dictionary
backend/
├── main.py                       # FastAPI microservice for ELA, Shoelace CV, and authority reconciliation
└── requirements.txt              # Python microservice dependencies
```

---

## ⚡ Local Development Setup

### Prerequisites
- **Node.js:** v18.18+ or v20+
- **npm:** v9+
- **Python:** v3.10+ (optional, for running the local Python microservice)

### 1. Frontend Setup
```bash
# Clone the repository
git clone https://github.com/aquasimp/SIH26261.git
cd SIH26261

# Install dependencies
npm install

# Run development server
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### 2. Production Build Verification
```bash
# Verify strict TypeScript type compliance
npx tsc --noEmit

# Run Next.js production build
npm run build
```

---

## 📜 Compliance & Regulatory References
- **AICTE Approval Process Handbook (APH 2024–2027)**, Ministry of Education, Govt. of India.
- **National Data Empowerment and Protection Architecture (DEPA)** / API Setu.
- **Employees' Provident Fund Organisation (EPFO)**, Ministry of Labour & Employment.
- **National Building Code of India (NBC 2016)** for educational institutional occupancy norms.

---

## 📄 License
This project is licensed under the **MIT License** — developed for Smart India Hackathon (SIH) Problem Statement ID 26261.
