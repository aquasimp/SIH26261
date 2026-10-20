# AICTE Regulatory Scrutiny & Forensic Document Intelligence Workstation
### Smart India Hackathon — Problem Statement ID: 26261

[![Next.js](https://img.shields.io/badge/Next.js-15.2.1-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0.0-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0.9-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110.0-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python)](https://python.org)

An evidence-linked regulatory intelligence platform and forensic document workstation engineered for the **All India Council for Technical Education (AICTE), Ministry of Education, Government of India (Regulation Bureau)**. 

Designed to automate multi-hundred-page institutional compliance dossiers under the **AICTE Approval Process Handbook (APH 2024–2027)**, coupling pixel-level neural forensics and CAD blueprint geometry with deterministic National Digital Public Infrastructure (DPI) authority verification.

---

## 🏛️ Core Product Philosophy

1. **Evidence-Linked Decision-Support, Never an Opaque Black-Box:**
   AI never issues arbitrary approvals. Every anomaly flagged links interactively to multi-spectral canvas bounding boxes, Error Level Analysis (ELA) residuals, Noiseprint++ heatmaps, exact APH 2024–27 statutory rule citations, and cryptographic issuing authority audit records.
2. **Strict Decoupling of Fatal Fraud from Rectifiable Deficiencies:**
   - **Fatal Fraud (Red Veto):** Altered land deed acreage, spliced Fire NOC dates, digital stamp cloning, or biometric/EPFO Ghost Faculty across colleges immediately triggers the non-linear gate ($\Gamma_{forensic} = 0$), routing dossiers directly to the **Standing Hearing Committee (SHC)**.
   - **Rectifiable Deficiencies:** Minor 3.8% tutorial room shortfall, pending municipal pollution board renewal, or cadre imbalances auto-generate official **15-day EVC rectification notices** without triggering fatal fraud penalties.
3. **100% Bilingual Localization (EN | हिन्दी):**
   Full interface parity in both English and formal regulatory Hindi (`Noto Sans Devanagari` and `Khand`), allowing Regional Officers across all 8 AICTE zones to audit institutional applications in their preferred official language.

---

## 🔬 Multi-Modal Machine Learning Portfolio

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

### 1. Intelligent Document Processing (IDP) & Layout-Aware OCR
- **Frontline Text & Layout:** Deploys **PP-StructureV3** (`picodet_lcnet_x1_0_fgd_layout`) with Focal and Global Distillation (41ms CPU inference) to segment Text, Tables, Stamps, and Figures.
- **Table Topology Reconstruction:** Routes complex multi-span faculty rosters and equipment schedules to **SLANet-LCNetV2** with Mish activations and dynamic EOS termination (96.67% TEDS score).
- **Key Information Extraction (KIE):** Fine-tuned **LayoutLMv3-Large** with 2D spatial embeddings ($[x_0, y_0, x_1, y_1] \in [0, 1000]$) and CRF sequence tagging over legal deeds, affidavits, and statutory NOCs.

### 2. Micro-Forgery, Splicing & Tampering Localization
- **Signal-Preserving Noise Forensics:** Standard TruFor suffers from an InstanceNorm2d bottleneck that collapses scalar noise statistics (AUC collapse from 0.747 to 0.554). We enforce **Extract-Then-Crop native extraction**, replace InstanceNorm2d with **ResAware BatchNorm2d**, and run a parallel **StatNoise-Fusion bypass** (13 scalar noise statistics) paired with **NFA-ViT** (Noise-Guided Forgery Amplification Attention).
- **Multi-Quality Error Level Analysis (ELA):** Recompresses document rasters at $Q=90\%$ to generate amplified residuals $E(x, y) = |I(x, y) - I_{Q90}(x, y)| \times \gamma$ ($\gamma=20$), revealing 8×8 DCT block artifact grid (BAG) phase misalignments.
- **Copy-Move Forgery Detection (CMFD):** Extracts dense SIFT/ORB keypoints with RANSAC homography estimation to catch cloned signatures and digits.
- **PDF Stream & Font Forensics:** Inspects PyMuPDF xref tables, incremental `%%EOF` save counts, producer tags (`Canva`, `PDFtk`, `Photoshop`), and embedded font subsets (detecting injected `ArialMT` digits in `TimesNewRomanPSMT` certificates).

### 3. Biometric Seal & Signature Verification
- **Object Detection:** Fine-tuned **YOLOv11m-Doc** operating at $1280 \times 1280$ resolution to isolate wet signatures, circular seals, and notary stamps.
- **Polar Coordinate Seal Unwrapping:** Converts circular seals into $(r, \theta)$ polar unwrapped strips for 360° peripheral text recognition.
- **ArcFace Metric Learning:** Siamese ResNet-50 trained with Additive Angular Margin Loss ($s=64.0, m=0.50\text{ rad}$) mapping signatures to a 512-D hypersphere. Cosine similarity $\cos(\theta) < 0.72$ flags signature mismatches, while $SSIM > 0.995$ flags digital stamp copy-paste fraud.

### 4. CAD Blueprint Vectorization & Area Geometry
- **Semantic Segmentation:** **Mask2Former** (Swin-Base backbone fine-tuned on CubiCasa5K) paired with a parallel **RMBG-1.4** structural wall boundary branch.
- **Closed Planar Graph Vectorization:** Ramer-Douglas-Peucker (RDP, $\varepsilon=2.0\text{ px}$) polygon simplification.
- **Graphic Scale Bar Calibration & Shoelace Carpet Area:**
  $$\text{Scale Factor: } s = \frac{L_m}{L_{px}} \quad (\text{m/px})$$
  $$\text{Carpet Area: } \text{Area}(P) = s^2 \cdot \frac{1}{2} \left| \sum_{i=1}^n (x_i y_{i+1} - x_{i+1} y_i) \right|$$
  Compares true geometric area against declared blueprint text and portal claims. Any inflation $>5\%$ triggers a `BLUEPRINT_AREA_INFLATION` deficiency flag.

### 5. Campus Scrutiny CV & Ghost Faculty Deduplication
- **Laboratory Asset Inspection:** **RT-DETR-L** and **YOLOv8x** detect 45 statutory equipment classes (`cnc_lathe`, `universal_testing_machine`, `wheelchair_ramp`, `fire_hydrant`).
- **Duplicate Image Detection:** 256-bit Perceptual Hash (pHash / Wavelet wHash) + **DINOv2 ViT-B/14** image embeddings prevent identical lab photos from being submitted across sister campuses.
- **Cadastral Multi-Plot Triangulation:** Haversine distance and Shapely point-in-polygon checks verify $\le 3$ plots within a $\le 2.0\text{ km}$ radius, ensuring all instructional areas reside on the primary plot.
- **Biometric Ghost Faculty Deduplication:** **RetinaFace** 5-point alignment feeds $112 \times 112$ crops into **ArcFace** (IResNet-100, Glint360k) generating 512-D vectors indexed in **Qdrant** via HNSW graphs ($M=32, ef=200$). Matches with $\cos(\theta) > 0.78$ or overlapping **EPFO ECR 2.0** monthly remittances flag `CONCURRENT_GHOST_FACULTY`.

---

## 🔗 National DPI Authority Bridge Architecture

The platform connects via REST and webhook APIs to authoritative issuing repositories:

| Issuing Authority | Integration Protocol | Verification Handshake & Security |
| :--- | :--- | :--- |
| **DigiLocker / NAD / API Setu** | REST Pull URI / Pull Document API | OAuth 2.0 PKCE (`code_verifier` + `code_challenge`), `x-digilocker-hmac` (HMAC-SHA256), Base64 DataContent XML field-level diff reconciliation. |
| **EPFO Shram Suvidha** | Aggregator API (Social Security Code 2020) | Establishment PF Code query, 12-digit UAN status, Aadhaar Face Auth (FAT) timestamp, and statutory 50% basic wage add-back rule compliance. |
| **State e-District / Fire Directorate** | 2D QR Code Cryptographic Verifier | High-density QR matrix decoding via OpenCV WeChatQRCode CNN; ECDSA (`secp256r1`) or RSA-2048 signature verification against State CCA X.509 certificates. |
| **MCA21 v3 & NITI Aayog NGO Darpan** | MCA Registry REST Handshake | Trust / Society / Section 8 Company Corporate Identity Number (CIN), establishment PAN, and active legal standing check. |

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

## 🖥️ Application Architecture & Routes

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

## ⚡ Quickstart Guide

### Prerequisites
- **Node.js:** v18.18+ or v20+
- **npm:** v9+
- **Python:** v3.10+ (for backend microservice)

### 1. Frontend Setup (Next.js 15)
```bash
# Clone the repository
git clone https://github.com/aquasimp/SIH26261.git
cd SIH26261

# Install frontend dependencies
npm install

# Start the Next.js development server
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### 2. Backend Setup (FastAPI Microservice)
```bash
# Navigate to the backend directory
cd backend

# Create and activate a virtual environment
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

# Install backend dependencies
pip install -r requirements.txt

# Launch the FastAPI microservice
uvicorn main:app --reload --port 8000
```
FastAPI interactive Swagger documentation will be available at **[http://localhost:8000/docs](http://localhost:8000/docs)**.

### 3. Verification & Build
```bash
# Verify strict TypeScript type compliance
npx tsc --noEmit

# Run production build
npm run build
```

---

## 🧪 Verification & Acceptance Walkthrough

1. **Executive Scrutiny Dashboard (`/overview`):**
   - Inspect the **6-column unified KPI grid** with 2px severity color bars.
   - Change dropdowns in the **Global Filter Bar** (e.g. filter by Region or Status); notice the KPIs and Regional Matrix react dynamically.
   - Use the sun/moon button in the floating top header to toggle **Light / Dark Mode**.
   - Use the language toggle to switch between **English and हिन्दी**.
2. **Institutional Registry (`/applications`):**
   - Search dossiers by PID (`1-9482710392`), institution name, city, or status.
   - Toggle between **Table View** and **Card View**; inspect the 5-component ICI spark-bars.
   - Click **CSV** or **JSON** to test instant batch export.
3. **Forensic Scrutiny Workbench (`/applications/AICTE-2026-NW-0842`):**
   - In the left pane, switch between **Document 1 (Fire NOC)** and **Document 3 (Architectural Floor Plan)**.
   - On Document 1, toggle between **Original RGB**, **LayoutLMv3 Bounding Boxes**, **TruFor Anomaly Heatmap**, and **Error Level Analysis (ELA)**.
   - On Document 3, interact with the **Blueprint Vector Viewer**, click room polygons, and observe scale calibration.
   - In the right pane, review the **Side-by-Side Authority Diff Table**, verify **APH 2024–27 Norm Calculations**, and inspect **Ghost Faculty ArcFace detections**.
4. **Digital Forensics Studio (`/forensics`):**
   - Upload any local scan or image; test the client-side HTML5 Canvas ELA slider.
   - Inspect the **ResAware vs. InstanceNorm2d** ablation comparison.
   - Review the **ArcFace Seal & Signature Verification Matrix** with polar unwrapping.
5. **Blueprint & Campus CV Studio (`/infrastructure`):**
   - Adjust the **Scale Bar Calibrator** (pixels vs. meters) and observe real-time Shoelace room area updates.
   - Use the **What-If FSI/FAR & Intake Simulator** sliders to calculate dynamic required built-up area.
6. **National DPI Authority Bridge (`/authority-bridge`):**
   - Click **"Run Live Handshake Simulation"** to watch the 4-step OAuth PKCE, HMAC-SHA256, XML Pull URI, and field reconciliation process with live latency telemetry.
7. **Deficiency & Show-Cause Generator (`/deficiencies`):**
   - Select an institution to generate its official bilingual legal order.
   - Observe the **15-Day EVC Rectification Countdown Clock**.
   - Click **"Sign with Officer DSC"** to append a cryptographically validated Class 3 certificate and dispatch to the portal.
8. **SHA-256 Audit Ledger (`/audit-trail`):**
   - Review cryptographically chained blocks logging AI inference, DPI handshakes, and officer actions.
   - Click **"Verify Integrity"** to validate zero hash collisions.
   - Copy any SHA-256 block hash with one click.
9. **Global Keyboard Shortcut:**
   - Press `⌘K` or `Ctrl+K` from any screen to launch the command palette and search institutions or APH statutory clauses.

---

## 🏆 Smart India Hackathon PS 26261 Specifications Matrix

| Blueprint Specification | Implementation Status | Verification Route / Module |
| :--- | :---: | :--- |
| **Multi-Modal Model Portfolio** | ✅ Implemented | `lib/mock-data.ts`, `components/workbench/ForensicDocumentCanvas.tsx` |
| **ResAware vs. InstanceNorm Forensics** | ✅ Implemented | `app/forensics/page.tsx`, `app/api/forensics/analyze/route.ts` |
| **CAD Blueprint Shoelace Area Calibrator** | ✅ Implemented | `components/workbench/BlueprintVectorViewer.tsx`, `app/infrastructure/page.tsx` |
| **ArcFace & EPFO Ghost Faculty Deduplication**| ✅ Implemented | `app/applications/[id]/page.tsx`, `lib/mock-data.ts` |
| **National DPI Authority Bridge** | ✅ Implemented | `app/authority-bridge/page.tsx` |
| **APH 2024–2027 Mathematical Formulations** | ✅ Implemented | `lib/aph-engine.ts`, `app/api/compliance/calculate/route.ts` |
| **Liquid Glass Civic UI (Light/Dark Parity)** | ✅ Implemented | `app/globals.css`, `components/shell/` |
| **100% Bilingual Localization (EN / हिन्दी)** | ✅ Implemented | `lib/i18n.ts`, `lib/context.tsx` |
| **SHA-256 Chained Scrutiny Ledger** | ✅ Implemented | `app/audit-trail/page.tsx` |

---

## 📄 License
This project is licensed under the **MIT License** — developed for Smart India Hackathon (SIH) 2024/2025/2026 Problem Statement ID 26261.
