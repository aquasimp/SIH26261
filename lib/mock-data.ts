export type VerificationState =
  | 'VERIFIED'
  | 'MISMATCH_DETECTED'
  | 'EXPIRED'
  | 'VERIFICATION_PENDING'
  | 'SOURCE_UNAVAILABLE'
  | 'MANUAL_REVIEW_REQUIRED';

export type SeverityLevel = 'FATAL_FRAUD' | 'MAJOR_DEFICIENCY' | 'MINOR_DEFICIENCY' | 'COMPLIANT';

export interface ForensicAnomaly {
  id: string;
  documentId: string;
  documentTitle: string;
  category: 'FORGERY_SPLICING' | 'STAMP_SIGNATURE' | 'BLUEPRINT_AREA' | 'GHOST_FACULTY' | 'AUTHORITY_MISMATCH' | 'PDF_METADATA';
  severity: SeverityLevel;
  titleEn: string;
  titleHi: string;
  descriptionEn: string;
  descriptionHi: string;
  aphClause: string;
  modelUsed: string;
  tamperProbability: number; // e.g., 0.984
  confidenceScore: number;   // e.g., 0.942
  rpnScore: number;          // Severity * Occurrence * Certainty (1-1000)
  boundingBox: [number, number, number, number]; // Normalized [x0, y0, x1, y1] in %
  extractedValue: string;
  authorityValue: string;
  verificationState: VerificationState;
}

export interface BlueprintRoom {
  id: string;
  name: string;
  category: 'INA' | 'ADA' | 'AMA' | 'ACA';
  svgPolygon: string;        // SVG points or rect coordinates (e.g. "50,50 200,50 200,160 50,160")
  declaredAreaSqm: number;   // Text printed on blueprint
  computedAreaSqm: number;   // Shoelace formula geometric calculation
  aphNormSqm: number;        // APH Chapter VII minimum requirement
  status: 'COMPLIANT' | 'INFLATED_LABEL' | 'UNDERSIZED';
  x?: number;
  y?: number;
  width?: number;
  height?: number;
}

export interface FacultyRecord {
  id: string;
  name: string;
  designation: 'Professor' | 'Associate Professor' | 'Assistant Professor';
  department: string;
  pan: string;
  uan: string;               // 12-digit EPFO UAN
  aadhaarFatVerified: boolean;
  epfoEcrStatus: 'ACTIVE_VERIFIED' | 'DUAL_EMPLOYMENT_DETECTED' | 'NO_REMITTANCE_FOUND';
  wageRule50Compliant: boolean;
  arcFaceSimilarityMax: number; // Cosine similarity against national DB
  matchedInstitutionName?: string;
  matchedInstitutionPid?: string;
  avatarUrl?: string;
  experienceYears?: number;
}

export interface DocumentArtifact {
  id: string;
  titleEn: string;
  titleHi: string;
  docType: 'FIRE_NOC' | 'LAND_DEED' | 'BLUEPRINT' | 'FACULTY_ROSTER' | 'BALANCE_SHEET' | 'PWD_CERT';
  pageCount: number;
  verificationState: VerificationState;
  issuingAuthority: string;
  authorityUri?: string;
  uploadedAt: string;
  truForScore: number;
  elaScore: number;
  tamperAlert: boolean;
  extractedFields: Array<{
    nameEn: string;
    nameHi: string;
    ocrValue: string;
    authorityValue: string;
    confidence: number;
    bbox: [number, number, number, number];
    isMismatch: boolean;
  }>;
}

export interface InstitutionalApplication {
  id: string;                // e.g., "AICTE-2026-NW-0842"
  pid: string;               // e.g., "1-9482710392"
  nameEn: string;
  nameHi: string;
  trustName: string;
  region: 'North-Western' | 'Southern' | 'Western' | 'South-Western' | 'Eastern' | 'Central' | 'Northern' | 'South-Central';
  state: string;
  city: string;
  zoneType: 'Mega/Metro' | 'Urban' | 'Rural';
  institutionType: 'Private Self-Financed' | 'Government / Aided' | 'Deemed-to-be University' | 'Autonomous';
  applicationCategory: 'Extension of Approval (EoA)' | 'Increase in Intake / New Course' | 'New Technical Institution' | 'Change of Site / Closure';
  scrutinyStatus: 'Fatal Fraud Alert' | 'Deficiency Issued' | 'Auto-Pre-Cleared' | 'Manual Review Required';
  academicYear: '2026-27' | '2025-26' | '2024-25';
  submittedAt: string;
  iciScore: number;          // 0-100 Institutional Compliance Index
  fatalGateTriggered: boolean;
  maxRpn: number;
  subScores: {
    infra: number;
    faculty: number;
    legal: number;
    authority: number;
    financial: number;
  };
  landAndBuiltUp: {
    applicableFsi: number;
    totalSanctionedStudentsUG: number;
    totalSanctionedStudentsPG: number;
    inaRequiredSqm: number;
    inaAvailableSqm: number;
    adaRequiredSqm: number;
    adaAvailableSqm: number;
    amaRequiredSqm: number;
    amaAvailableSqm: number;
    acaRequiredSqm: number;
    acaAvailableSqm: number;
    totalBuiltUpRequiredSqm: number;
    totalBuiltUpAvailableSqm: number;
    landRequiredAcres: number;
    landAvailableAcres: number;
    plotCount: number;
    maxInterPlotDistanceKm: number;
  };
  facultyMetrics: {
    requiredTotal: number;
    availableVerified: number;
    ghostFlaggedCount: number;
    cadreRequired: { prof: number; assoc: number; asst: number };
    cadreAvailable: { prof: number; assoc: number; asst: number };
    sfrUG: string;
    sfrPG: string;
  };
  anomalies: ForensicAnomaly[];
  blueprintRooms: BlueprintRoom[];
  facultyRoster: FacultyRecord[];
  documents: DocumentArtifact[];
  officerNote?: string;
}

export const MOCK_APPLICATIONS: InstitutionalApplication[] = [
  {
    id: "AICTE-2026-NW-0842",
    pid: "1-9482710392",
    nameEn: "Apex Institute of Technology & Management",
    nameHi: "एपेक्स इंस्टीट्यूट ऑफ टेक्नोलॉजी एंड मैनेजमेंट",
    trustName: "Apex Shiskha & Research Foundation",
    region: "North-Western",
    state: "Haryana",
    city: "Gurugram",
    zoneType: "Urban",
    institutionType: "Private Self-Financed",
    applicationCategory: "Extension of Approval (EoA)",
    scrutinyStatus: "Fatal Fraud Alert",
    academicYear: "2026-27",
    submittedAt: "2026-03-28T10:14:22Z",
    iciScore: 31.4,
    fatalGateTriggered: true,
    maxRpn: 940,
    subScores: {
      infra: 48.0,
      faculty: 32.5,
      legal: 18.0,
      authority: 22.0,
      financial: 54.0,
    },
    landAndBuiltUp: {
      applicableFsi: 2.0,
      totalSanctionedStudentsUG: 1440,
      totalSanctionedStudentsPG: 180,
      inaRequiredSqm: 6840,
      inaAvailableSqm: 5120,
      adaRequiredSqm: 850,
      adaAvailableSqm: 890,
      amaRequiredSqm: 720,
      amaAvailableSqm: 680,
      acaRequiredSqm: 2102.5,
      acaAvailableSqm: 1840,
      totalBuiltUpRequiredSqm: 10512.5,
      totalBuiltUpAvailableSqm: 8530,
      landRequiredAcres: 2.5,
      landAvailableAcres: 2.15,
      plotCount: 1,
      maxInterPlotDistanceKm: 0.0,
    },
    facultyMetrics: {
      requiredTotal: 84,
      availableVerified: 54,
      ghostFlaggedCount: 4,
      cadreRequired: { prof: 9, assoc: 18, asst: 57 },
      cadreAvailable: { prof: 3, assoc: 9, asst: 42 },
      sfrUG: "1:26.6",
      sfrPG: "1:20.0",
    },
    anomalies: [
      {
        id: "ANOM-NW-0842-01",
        documentId: "DOC-FIRE-01",
        documentTitle: "Fire Safety No Objection Certificate (NOC)",
        category: "FORGERY_SPLICING",
        severity: "FATAL_FRAUD",
        titleEn: "Doctored Fire NOC Expiry Year (2027 spliced over 2024)",
        titleHi: "अग्नि शमन एनओसी समाप्ति वर्ष में हेरफेर (2024 पर 2027 प्रत्यारोपित)",
        descriptionEn: "TruFor Noiseprint++ and 8x8 DCT BAG analysis localized a 128x32 pixel spliced patch altering validity date from 30-06-2024 to 30-06-2027. Spliced patch exhibits shifted DCT phase grid ((dx,dy)=(3,5)) and elevated ELA residual gamma=20.",
        descriptionHi: "ट्रू-फॉर नॉयसप्रिंट++ और 8x8 डीसीटी बैग विश्लेषण ने वैधता तिथि को 30-06-2024 से 30-06-2027 में बदलने वाले 128x32 पिक्सेल के जाली पैच का पता लगाया।",
        aphClause: "APH 2024-27 Chapter VII & Annexure 16, Clause 2.1 (Mandatory Fire Safety Certification)",
        modelUsed: "TruFor (CVPR 2023) + NFA-ViT + 8x8 DCT BAG",
        tamperProbability: 0.984,
        confidenceScore: 0.942,
        rpnScore: 940,
        boundingBox: [64, 42, 88, 48],
        extractedValue: "Valid Until: 30-06-2027",
        authorityValue: "Haryana Fire Service Portal: Expired 30-06-2024 (Reg: FS/2021/8841)",
        verificationState: "MISMATCH_DETECTED",
      },
      {
        id: "ANOM-NW-0842-02",
        documentId: "DOC-LAND-01",
        documentTitle: "Registered Land Sale & Mutation Deed",
        category: "AUTHORITY_MISMATCH",
        severity: "FATAL_FRAUD",
        titleEn: "Land Area Mismatch against Haryana Jamabandi Revenue Record",
        titleHi: "हरियाणा जमाबंदी राजस्व रिकॉर्ड के विरुद्ध भूमि क्षेत्रफल में विसंगति",
        descriptionEn: "Applicant declared 4.80 Acres across Khasra No. 114/2 & 115/1. DigiLocker API Setu Pull URI handshake with Haryana Land Records (Jamabandi) confirmed authoritative title area is only 2.15 Acres. Deficit of 0.35 Acres below APH Urban Norm (2.50 Acres).",
        descriptionHi: "आवेदक ने खसरा नं. 114/2 और 115/1 पर 4.80 एकड़ घोषित किया। हरियाणा भूमि रिकॉर्ड (जमाबंदी) के साथ डिजीलॉकर एपीआई सेतु हैंडशेक से पुष्टि हुई कि वास्तविक क्षेत्रफल केवल 2.15 एकड़ है।",
        aphClause: "APH 2024-27 Chapter I Clause 1.4 & Appendix 4 (Urban Engineering Land Norm: Min 2.50 Acres)",
        modelUsed: "API Setu Pull URI Bridge (in.gov.har.jamabandi-DEED-2018-9941)",
        tamperProbability: 0.995,
        confidenceScore: 0.998,
        rpnScore: 890,
        boundingBox: [22, 58, 54, 66],
        extractedValue: "4.80 Acres (19,425 sq.m)",
        authorityValue: "2.15 Acres (8,700 sq.m) - Jamabandi Mutation #4819",
        verificationState: "MISMATCH_DETECTED",
      },
      {
        id: "ANOM-NW-0842-03",
        documentId: "DOC-PLAN-01",
        documentTitle: "Approved Municipal Building Floor Plan (Ground & First)",
        category: "BLUEPRINT_AREA",
        severity: "MAJOR_DEFICIENCY",
        titleEn: "Inflated VLSI Design Lab Dimension Label (46.8 m² vs 66.0 m² norm)",
        titleHi: "वीएलएसआई लैब क्षेत्रफल में झूठी वृद्धि (वास्तविक 46.8 वर्ग मी बनाम 66.0 मानक)",
        descriptionEn: "Mask2Former Swin-Base segmentation paired with graphic scale bar calibration (s = 0.04167 m/px) computed true geometric carpet area as 46.8 m² using Shoelace Formula. Blueprint label prints 'VLSI LAB - 66.0 SQ.M', masking a 29.1% shortfall below APH norms.",
        descriptionHi: "मास्क2फॉर्मर विभाजन और स्केल बार कैलिब्रेशन ने शूलेसब सूत्र का उपयोग करके वास्तविक कालीन क्षेत्र 46.8 वर्ग मीटर निकाला। प्रिंटेड लेबल 66.0 वर्ग मीटर दावा करता है।",
        aphClause: "APH 2024-27 Chapter VII Clause 7.1 (Instructional Area - Engineering Laboratory Norm: Min 66 m²)",
        modelUsed: "Mask2Former-Swin-Base + Shoelace Polygon CV",
        tamperProbability: 0.912,
        confidenceScore: 0.895,
        rpnScore: 680,
        boundingBox: [15, 25, 42, 52],
        extractedValue: "Label: 66.0 sq.m (9.0m x 7.33m)",
        authorityValue: "Geometric Shoelace CV: 46.8 sq.m (Deficit: -19.2 sq.m)",
        verificationState: "MISMATCH_DETECTED",
      },
      {
        id: "ANOM-NW-0842-04",
        documentId: "DOC-FAC-01",
        documentTitle: "AICTE Faculty Roster & EPFO Aquittance Roll",
        category: "GHOST_FACULTY",
        severity: "FATAL_FRAUD",
        titleEn: "Concurrent Ghost Faculty Detected Across Delhi-NCR Colleges",
        titleHi: "दिल्ली-एनसीआर कॉलेजों में समवर्ती घोस्ट फैकल्टी का पता चला",
        descriptionEn: "4 faculty members flagged via ArcFace 512-D vector matching (cosine similarity > 0.91) and EPFO UAN checks. Dr. Ramesh Chander (UAN 100492817291) has concurrent active monthly ECR 2.0 contributions from both Apex Inst (Haryana) and Noida Inst of Engg (UP) without Mark Exit.",
        descriptionHi: "आर्कफेस 512-डी वेक्टर मैचिंग और ईपीएफओ यूएएन जांच द्वारा 4 फैकल्टी सदस्यों को चिह्नित किया गया। डॉ. रमेश चंदर के दोनों कॉलेजों से समवर्ती ईसीआर 2.0 अंशदान सक्रिय हैं।",
        aphClause: "APH 2024-27 Chapter VII Clause 7.3 & EPF Act 1952 Scheme 2026 Para 20(1)",
        modelUsed: "ArcFace (IResNet-100) + Qdrant HNSW + EPFO ECR API",
        tamperProbability: 0.978,
        confidenceScore: 0.965,
        rpnScore: 920,
        boundingBox: [10, 35, 90, 48],
        extractedValue: "4 Full-Time Professors claimed exclusively",
        authorityValue: "Active concurrent ECR 2.0 at Establishment UP/NOI/0048192",
        verificationState: "MISMATCH_DETECTED",
      },
    ],
    blueprintRooms: [
      { id: "RM-101", name: "Classroom 1 (UG)", category: "INA", svgPolygon: "30,40 160,40 160,140 30,140", declaredAreaSqm: 66.0, computedAreaSqm: 66.4, aphNormSqm: 66.0, status: "COMPLIANT", x: 30, y: 40, width: 130, height: 100 },
      { id: "RM-102", name: "Classroom 2 (UG)", category: "INA", svgPolygon: "170,40 300,40 300,140 170,140", declaredAreaSqm: 66.0, computedAreaSqm: 65.8, aphNormSqm: 66.0, status: "COMPLIANT", x: 170, y: 40, width: 130, height: 100 },
      { id: "RM-103", name: "VLSI & Embedded Systems Lab", category: "INA", svgPolygon: "310,40 420,40 420,140 310,140", declaredAreaSqm: 66.0, computedAreaSqm: 46.8, aphNormSqm: 66.0, status: "INFLATED_LABEL", x: 310, y: 40, width: 110, height: 100 },
      { id: "RM-104", name: "Computer Center Lab", category: "INA", svgPolygon: "430,40 580,40 580,140 430,140", declaredAreaSqm: 150.0, computedAreaSqm: 148.5, aphNormSqm: 150.0, status: "COMPLIANT", x: 430, y: 40, width: 150, height: 100 },
      { id: "RM-105", name: "Principal Office & Board Room", category: "ADA", svgPolygon: "30,160 160,160 160,240 30,240", declaredAreaSqm: 60.0, computedAreaSqm: 61.2, aphNormSqm: 50.0, status: "COMPLIANT", x: 30, y: 160, width: 130, height: 80 },
      { id: "RM-106", name: "Central Library & Reading Hall", category: "INA", svgPolygon: "170,160 420,160 420,240 170,240", declaredAreaSqm: 400.0, computedAreaSqm: 395.0, aphNormSqm: 400.0, status: "COMPLIANT", x: 170, y: 160, width: 250, height: 80 },
      { id: "RM-107", name: "Boys / Girls Common Room", category: "AMA", svgPolygon: "430,160 520,160 520,240 430,240", declaredAreaSqm: 75.0, computedAreaSqm: 74.0, aphNormSqm: 75.0, status: "COMPLIANT", x: 430, y: 160, width: 90, height: 80 },
      { id: "RM-108", name: "Barrier-Free PWD Restrooms", category: "AMA", svgPolygon: "530,160 580,160 580,240 530,240", declaredAreaSqm: 35.0, computedAreaSqm: 34.8, aphNormSqm: 30.0, status: "COMPLIANT", x: 530, y: 160, width: 50, height: 80 },
    ],
    facultyRoster: [
      {
        id: "FAC-01",
        name: "Dr. Ramesh Chander Sharma",
        designation: "Professor",
        department: "Computer Science & Engg",
        pan: "ABCPS1029K",
        uan: "100492817291",
        aadhaarFatVerified: true,
        epfoEcrStatus: "DUAL_EMPLOYMENT_DETECTED",
        wageRule50Compliant: false,
        arcFaceSimilarityMax: 0.942,
        matchedInstitutionName: "Noida Institute of Engg & Tech (NIET)",
        matchedInstitutionPid: "1-4829104821",
        experienceYears: 18,
      },
      {
        id: "FAC-02",
        name: "Dr. Sunita Deshmukh",
        designation: "Associate Professor",
        department: "Electronics & Comm Engg",
        pan: "BEXPD9412M",
        uan: "100881920144",
        aadhaarFatVerified: true,
        epfoEcrStatus: "DUAL_EMPLOYMENT_DETECTED",
        wageRule50Compliant: true,
        arcFaceSimilarityMax: 0.915,
        matchedInstitutionName: "Delhi Technical Campus, Greater Noida",
        matchedInstitutionPid: "1-3391827411",
        experienceYears: 12,
      },
      {
        id: "FAC-03",
        name: "Er. Vikram Singh Malik",
        designation: "Assistant Professor",
        department: "Mechanical Engineering",
        pan: "CKLPM8172Q",
        uan: "101294817223",
        aadhaarFatVerified: false,
        epfoEcrStatus: "NO_REMITTANCE_FOUND",
        wageRule50Compliant: false,
        arcFaceSimilarityMax: 0.620,
        experienceYears: 4,
      },
      {
        id: "FAC-04",
        name: "Dr. Ananya Roy",
        designation: "Professor",
        department: "Applied Sciences & Math",
        pan: "DLKPJ7412Z",
        uan: "100918274019",
        aadhaarFatVerified: true,
        epfoEcrStatus: "ACTIVE_VERIFIED",
        wageRule50Compliant: true,
        arcFaceSimilarityMax: 0.410,
        experienceYears: 15,
      },
      {
        id: "FAC-05",
        name: "Er. Gaurav Narang",
        designation: "Assistant Professor",
        department: "Computer Science & Engg",
        pan: "EMNPS5512B",
        uan: "101928374615",
        aadhaarFatVerified: true,
        epfoEcrStatus: "ACTIVE_VERIFIED",
        wageRule50Compliant: true,
        arcFaceSimilarityMax: 0.380,
        experienceYears: 6,
      },
    ],
    documents: [
      {
        id: "DOC-FIRE-01",
        titleEn: "Fire Safety No Objection Certificate",
        titleHi: "अग्नि शमन सुरक्षा अनापत्ति प्रमाण पत्र",
        docType: "FIRE_NOC",
        pageCount: 2,
        verificationState: "MISMATCH_DETECTED",
        issuingAuthority: "Directorate of Fire Services, Haryana",
        authorityUri: "in.gov.har.fire-NOC-2021-8841",
        uploadedAt: "2026-03-28T09:15:00Z",
        truForScore: 0.984,
        elaScore: 0.940,
        tamperAlert: true,
        extractedFields: [
          { nameEn: "Certificate Number", nameHi: "प्रमाण पत्र संख्या", ocrValue: "FS/2021/8841-EXT", authorityValue: "FS/2021/8841", confidence: 0.97, bbox: [12, 18, 45, 24], isMismatch: true },
          { nameEn: "Valid Upto Date", nameHi: "वैधता तिथि", ocrValue: "30-06-2027", authorityValue: "30-06-2024", confidence: 0.94, bbox: [64, 42, 88, 48], isMismatch: true },
          { nameEn: "Issuing Authority", nameHi: "जारीकर्ता प्राधिकरण", ocrValue: "CFO Gurugram Circle", authorityValue: "CFO Gurugram Circle", confidence: 0.99, bbox: [14, 82, 48, 88], isMismatch: false },
        ]
      },
      {
        id: "DOC-LAND-01",
        titleEn: "Registered Land Sale Deed & Mutation Record",
        titleHi: "पंजीकृत भूमि विक्रय विलेख एवं नामांतरण",
        docType: "LAND_DEED",
        pageCount: 8,
        verificationState: "MISMATCH_DETECTED",
        issuingAuthority: "Revenue & Disaster Management, Haryana (Jamabandi)",
        authorityUri: "in.gov.har.jamabandi-DEED-2018-9941",
        uploadedAt: "2026-03-28T09:20:00Z",
        truForScore: 0.820,
        elaScore: 0.760,
        tamperAlert: true,
        extractedFields: [
          { nameEn: "Total Area in Acres", nameHi: "कुल क्षेत्रफल एकड़", ocrValue: "4.80 Acres", authorityValue: "2.15 Acres", confidence: 0.96, bbox: [22, 58, 54, 66], isMismatch: true },
          { nameEn: "Khasra / Survey Numbers", nameHi: "खसरा / सर्वे संख्या", ocrValue: "114/2, 115/1", authorityValue: "114/2, 115/1", confidence: 0.98, bbox: [20, 44, 48, 50], isMismatch: false },
          { nameEn: "Title Holder", nameHi: "भूमि स्वामी", ocrValue: "Apex Shiskha Foundation", authorityValue: "Apex Shiskha Foundation", confidence: 0.99, bbox: [18, 30, 62, 36], isMismatch: false },
        ]
      },
      {
        id: "DOC-PLAN-01",
        titleEn: "Architectural Blueprint & Floor Plan CAD",
        titleHi: "वास्तुशिल्प ब्लूप्रिंट एवं फ्लोर प्लान सीएडी",
        docType: "BLUEPRINT",
        pageCount: 4,
        verificationState: "MISMATCH_DETECTED",
        issuingAuthority: "Town and Country Planning Dept, Haryana",
        authorityUri: "in.gov.har.tcpo-BP-2020-4102",
        uploadedAt: "2026-03-28T09:25:00Z",
        truForScore: 0.740,
        elaScore: 0.690,
        tamperAlert: true,
        extractedFields: [
          { nameEn: "VLSI Lab Label", nameHi: "वीएलएसआई लैब लेबल", ocrValue: "66.0 sq.m", authorityValue: "46.8 sq.m (CV)", confidence: 0.91, bbox: [31, 4, 42, 14], isMismatch: true },
          { nameEn: "Total Built-up Area", nameHi: "कुल निर्मित क्षेत्रफल", ocrValue: "10,650 sq.m", authorityValue: "8,530 sq.m (Shoelace)", confidence: 0.95, bbox: [70, 85, 95, 92], isMismatch: true },
        ]
      },
      {
        id: "DOC-FAC-01",
        titleEn: "Faculty Roster & EPFO Aquittance Roll",
        titleHi: "संकाय रोस्टर एवं ईपीएफओ वेतन तालिका",
        docType: "FACULTY_ROSTER",
        pageCount: 12,
        verificationState: "MISMATCH_DETECTED",
        issuingAuthority: "EPFO Unified Shram Suvidha Portal",
        authorityUri: "in.gov.epfindia.ecr-2026-HR-0019284",
        uploadedAt: "2026-03-28T09:30:00Z",
        truForScore: 0.420,
        elaScore: 0.350,
        tamperAlert: true,
        extractedFields: [
          { nameEn: "Total Faculty Count", nameHi: "कुल फैकल्टी संख्या", ocrValue: "84 Claimed", authorityValue: "54 Verified (4 Ghost)", confidence: 0.98, bbox: [10, 15, 40, 22], isMismatch: true },
          { nameEn: "Prof. R.C. Sharma UAN", nameHi: "प्रो. आर.सी. शर्मा यूएएन", ocrValue: "100492817291", authorityValue: "Dual Employment Flag", confidence: 0.99, bbox: [12, 38, 48, 44], isMismatch: true },
        ]
      },
      {
        id: "DOC-FIN-01",
        titleEn: "Audited Balance Sheet & Financial Statements",
        titleHi: "लेखापरीक्षित बैलेंस शीट एवं वित्तीय विवरण",
        docType: "BALANCE_SHEET",
        pageCount: 16,
        verificationState: "VERIFIED",
        issuingAuthority: "Institute of Chartered Accountants of India (ICAI UDIN)",
        authorityUri: "in.org.icai.udin-26049182AAAAAB1029",
        uploadedAt: "2026-03-28T09:35:00Z",
        truForScore: 0.080,
        elaScore: 0.110,
        tamperAlert: false,
        extractedFields: [
          { nameEn: "ICAI UDIN", nameHi: "आईसीएआई यूडीआईएन", ocrValue: "26049182AAAAAB1029", authorityValue: "26049182AAAAAB1029", confidence: 0.99, bbox: [65, 88, 92, 94], isMismatch: false },
          { nameEn: "Corpus Fund Reserve", nameHi: "कॉर्पस फंड रिजर्व", ocrValue: "₹ 1,50,00,000", authorityValue: "₹ 1,50,00,000", confidence: 0.99, bbox: [55, 62, 85, 68], isMismatch: false },
        ]
      }
    ]
  },
  {
    id: "AICTE-2026-SO-1104",
    pid: "1-7728192044",
    nameEn: "Sri Venkateswara College of Engineering & AI",
    nameHi: "श्री वेंकटेश्वर कॉलेज ऑफ इंजीनियरिंग एंड एआई",
    trustName: "Tirupati Educational & Cultural Trust",
    region: "Southern",
    state: "Tamil Nadu",
    city: "Chennai",
    zoneType: "Urban",
    institutionType: "Private Self-Financed",
    applicationCategory: "Extension of Approval (EoA)",
    scrutinyStatus: "Deficiency Issued",
    academicYear: "2026-27",
    submittedAt: "2026-03-24T14:20:10Z",
    iciScore: 76.8,
    fatalGateTriggered: false,
    maxRpn: 420,
    subScores: {
      infra: 82.0,
      faculty: 68.0,
      legal: 75.0,
      authority: 92.0,
      financial: 88.0,
    },
    landAndBuiltUp: {
      applicableFsi: 2.5,
      totalSanctionedStudentsUG: 1200,
      totalSanctionedStudentsPG: 120,
      inaRequiredSqm: 5600,
      inaAvailableSqm: 5420,
      adaRequiredSqm: 750,
      adaAvailableSqm: 820,
      amaRequiredSqm: 650,
      amaAvailableSqm: 710,
      acaRequiredSqm: 1750,
      acaAvailableSqm: 1800,
      totalBuiltUpRequiredSqm: 8750,
      totalBuiltUpAvailableSqm: 8750,
      landRequiredAcres: 2.5,
      landAvailableAcres: 3.10,
      plotCount: 1,
      maxInterPlotDistanceKm: 0.0,
    },
    facultyMetrics: {
      requiredTotal: 68,
      availableVerified: 65,
      ghostFlaggedCount: 0,
      cadreRequired: { prof: 7, assoc: 15, asst: 46 },
      cadreAvailable: { prof: 8, assoc: 11, asst: 46 },
      sfrUG: "1:19.8",
      sfrPG: "1:14.2",
    },
    anomalies: [
      {
        id: "ANOM-SO-1104-01",
        documentId: "DOC-FAC-SO-01",
        documentTitle: "Faculty Cadre Compliance Schedule",
        category: "AUTHORITY_MISMATCH",
        severity: "MAJOR_DEFICIENCY",
        titleEn: "Associate Professor Cadre Shortfall (11 available vs 15 required)",
        titleHi: "एसोसिएट प्रोफेसर काडर में कमी (15 के मुकाबले 11 उपलब्ध)",
        descriptionEn: "Under APH Chapter VII 1:2:6 cadre ratio, 15 Associate Professors are mandated. Only 11 verified positions are currently filled in AICTE aquittance roll, causing a 4-cadre shortfall.",
        descriptionHi: "एपीएच अध्याय VII के 1:2:6 काडर अनुपात के तहत 15 एसोसिएट प्रोफेसर अनिवार्य हैं, जबकि केवल 11 उपलब्ध हैं।",
        aphClause: "APH 2024-27 Chapter VII Clause 7.4 (Cadre Ratio 1:2:6)",
        modelUsed: "APH Rule Engine Cadre Validator",
        tamperProbability: 0.02,
        confidenceScore: 0.99,
        rpnScore: 420,
        boundingBox: [15, 30, 85, 45],
        extractedValue: "Assoc Profs: 11 Available",
        authorityValue: "Required: 15 (Deficit: 4 Positions)",
        verificationState: "MISMATCH_DETECTED",
      },
      {
        id: "ANOM-SO-1104-02",
        documentId: "DOC-PCB-SO-01",
        documentTitle: "TNPCB Consent to Operate (CTO)",
        category: "AUTHORITY_MISMATCH",
        severity: "MINOR_DEFICIENCY",
        titleEn: "State Pollution Control Board Consent Expired by 14 Days",
        titleHi: "राज्य प्रदूषण नियंत्रण बोर्ड अनापत्ति 14 दिन पूर्व समाप्त",
        descriptionEn: "TNPCB Consent to Operate lapsed on 15-03-2026. Renewal application (Ref TNPCB/CHE/2026/0942) is acknowledged as in-flight by state portal.",
        descriptionHi: "टीएनपीसीबी संचालन सहमति 15-03-2026 को समाप्त हो गई। नवीनीकरण आवेदन प्रक्रियाधीन है।",
        aphClause: "APH 2024-27 Annexure 16 (Statutory Environmental Clearances)",
        modelUsed: "State e-District API Bridge",
        tamperProbability: 0.04,
        confidenceScore: 0.98,
        rpnScore: 280,
        boundingBox: [55, 60, 85, 70],
        extractedValue: "Expired: 15-03-2026",
        authorityValue: "Renewal Pending (e-ACK #99214)",
        verificationState: "EXPIRED",
      }
    ],
    blueprintRooms: [
      { id: "SO-RM-01", name: "Tutorial Room 1", category: "INA", svgPolygon: "20,20 120,20 120,100 20,100", declaredAreaSqm: 33.0, computedAreaSqm: 31.6, aphNormSqm: 33.0, status: "UNDERSIZED", x: 20, y: 20, width: 100, height: 80 },
      { id: "SO-RM-02", name: "AI & Robotics Lab", category: "INA", svgPolygon: "130,20 280,20 280,100 130,100", declaredAreaSqm: 90.0, computedAreaSqm: 89.2, aphNormSqm: 66.0, status: "COMPLIANT", x: 130, y: 20, width: 150, height: 80 },
    ],
    facultyRoster: [
      { id: "FAC-SO-01", name: "Dr. K. Swaminathan", designation: "Professor", department: "Computer Science", pan: "AAAPK1928F", uan: "100291827419", aadhaarFatVerified: true, epfoEcrStatus: "ACTIVE_VERIFIED", wageRule50Compliant: true, arcFaceSimilarityMax: 0.35, experienceYears: 20 },
      { id: "FAC-SO-02", name: "Dr. R. Meenakshi", designation: "Associate Professor", department: "Artificial Intelligence", pan: "BBBPK2918G", uan: "100291827420", aadhaarFatVerified: true, epfoEcrStatus: "ACTIVE_VERIFIED", wageRule50Compliant: true, arcFaceSimilarityMax: 0.28, experienceYears: 14 },
    ],
    documents: [
      {
        id: "DOC-FIRE-SO-01",
        titleEn: "Fire Safety Certificate",
        titleHi: "अग्नि शमन प्रमाण पत्र",
        docType: "FIRE_NOC",
        pageCount: 2,
        verificationState: "VERIFIED",
        issuingAuthority: "Tamil Nadu Fire and Rescue Services",
        authorityUri: "in.gov.tn.fire-NOC-2025-1029",
        uploadedAt: "2026-03-24T12:00:00Z",
        truForScore: 0.012,
        elaScore: 0.024,
        tamperAlert: false,
        extractedFields: [
          { nameEn: "Valid Upto", nameHi: "वैधता", ocrValue: "31-12-2027", authorityValue: "31-12-2027", confidence: 0.99, bbox: [60, 40, 85, 48], isMismatch: false },
        ]
      }
    ]
  },
  {
    id: "AICTE-2026-WE-0319",
    pid: "1-5519284019",
    nameEn: "Sahyadri Autonomous Institute of Information Technology",
    nameHi: "सह्याद्री स्वायत्त सूचना प्रौद्योगिकी संस्थान",
    trustName: "Sahyadri Advanced Education Society",
    region: "Western",
    state: "Maharashtra",
    city: "Pune",
    zoneType: "Mega/Metro",
    institutionType: "Autonomous",
    applicationCategory: "Extension of Approval (EoA)",
    scrutinyStatus: "Auto-Pre-Cleared",
    academicYear: "2026-27",
    submittedAt: "2026-03-20T11:45:00Z",
    iciScore: 96.4,
    fatalGateTriggered: false,
    maxRpn: 24,
    subScores: {
      infra: 98.0,
      faculty: 95.0,
      legal: 96.0,
      authority: 98.0,
      financial: 95.0,
    },
    landAndBuiltUp: {
      applicableFsi: 2.5,
      totalSanctionedStudentsUG: 1800,
      totalSanctionedStudentsPG: 360,
      inaRequiredSqm: 8800,
      inaAvailableSqm: 9400,
      adaRequiredSqm: 1100,
      adaAvailableSqm: 1250,
      amaRequiredSqm: 950,
      amaAvailableSqm: 1100,
      acaRequiredSqm: 2712.5,
      acaAvailableSqm: 2950,
      totalBuiltUpRequiredSqm: 13562.5,
      totalBuiltUpAvailableSqm: 14700,
      landRequiredAcres: 1.5,
      landAvailableAcres: 2.20,
      plotCount: 1,
      maxInterPlotDistanceKm: 0.0,
    },
    facultyMetrics: {
      requiredTotal: 114,
      availableVerified: 118,
      ghostFlaggedCount: 0,
      cadreRequired: { prof: 12, assoc: 25, asst: 77 },
      cadreAvailable: { prof: 14, assoc: 28, asst: 76 },
      sfrUG: "1:18.2",
      sfrPG: "1:13.8",
    },
    anomalies: [],
    blueprintRooms: [
      { id: "WE-RM-01", name: "High Performance Computing Lab", category: "INA", svgPolygon: "20,20 180,20 180,120 20,120", declaredAreaSqm: 120.0, computedAreaSqm: 121.5, aphNormSqm: 66.0, status: "COMPLIANT", x: 20, y: 20, width: 160, height: 100 },
      { id: "WE-RM-02", name: "Smart Auditorium / Seminar Hall", category: "INA", svgPolygon: "190,20 380,20 380,120 190,120", declaredAreaSqm: 200.0, computedAreaSqm: 201.2, aphNormSqm: 132.0, status: "COMPLIANT", x: 190, y: 20, width: 190, height: 100 },
    ],
    facultyRoster: [
      { id: "FAC-WE-01", name: "Dr. Sandeep Kulkarni", designation: "Professor", department: "Computer Technology", pan: "CPPK9812A", uan: "100118274910", aadhaarFatVerified: true, epfoEcrStatus: "ACTIVE_VERIFIED", wageRule50Compliant: true, arcFaceSimilarityMax: 0.22, experienceYears: 24 },
      { id: "FAC-WE-02", name: "Dr. Priyamvada Joshi", designation: "Associate Professor", department: "Data Science", pan: "DPPK9812B", uan: "100118274911", aadhaarFatVerified: true, epfoEcrStatus: "ACTIVE_VERIFIED", wageRule50Compliant: true, arcFaceSimilarityMax: 0.19, experienceYears: 16 },
    ],
    documents: [
      {
        id: "DOC-WE-FIRE-01",
        titleEn: "Maharashtra Fire Services NOC",
        titleHi: "महाराष्ट्र अग्निशमन सेवा एनओसी",
        docType: "FIRE_NOC",
        pageCount: 3,
        verificationState: "VERIFIED",
        issuingAuthority: "Pune Municipal Corporation Fire Dept",
        authorityUri: "in.gov.maha.fire-NOC-2026-4412",
        uploadedAt: "2026-03-20T10:00:00Z",
        truForScore: 0.005,
        elaScore: 0.010,
        tamperAlert: false,
        extractedFields: [
          { nameEn: "Valid Upto", nameHi: "वैधता", ocrValue: "31-03-2029", authorityValue: "31-03-2029", confidence: 0.99, bbox: [62, 38, 86, 46], isMismatch: false },
        ]
      }
    ]
  },
  {
    id: "AICTE-2026-SW-0592",
    pid: "1-6649182731",
    nameEn: "Deccan Academy of Robotics & Architecture",
    nameHi: "डेक्कन एकेडमी ऑफ रोबोटिक्स एंड आर्किटेक्चर",
    trustName: "Deccan Technical Education Trust",
    region: "South-Western",
    state: "Karnataka",
    city: "Bengaluru",
    zoneType: "Urban",
    institutionType: "Private Self-Financed",
    applicationCategory: "Increase in Intake / New Course",
    scrutinyStatus: "Fatal Fraud Alert",
    academicYear: "2026-27",
    submittedAt: "2026-03-25T16:10:30Z",
    iciScore: 38.0,
    fatalGateTriggered: true,
    maxRpn: 880,
    subScores: {
      infra: 52.0,
      faculty: 45.0,
      legal: 24.0,
      authority: 30.0,
      financial: 60.0,
    },
    landAndBuiltUp: {
      applicableFsi: 2.0,
      totalSanctionedStudentsUG: 960,
      totalSanctionedStudentsPG: 60,
      inaRequiredSqm: 4600,
      inaAvailableSqm: 4100,
      adaRequiredSqm: 650,
      adaAvailableSqm: 680,
      amaRequiredSqm: 550,
      amaAvailableSqm: 540,
      acaRequiredSqm: 1450,
      acaAvailableSqm: 1200,
      totalBuiltUpRequiredSqm: 7250,
      totalBuiltUpAvailableSqm: 6520,
      landRequiredAcres: 2.5,
      landAvailableAcres: 2.60,
      plotCount: 2,
      maxInterPlotDistanceKm: 3.8, // Violates max 2.0 km rule!
    },
    facultyMetrics: {
      requiredTotal: 52,
      availableVerified: 38,
      ghostFlaggedCount: 2,
      cadreRequired: { prof: 5, assoc: 11, asst: 36 },
      cadreAvailable: { prof: 2, assoc: 6, asst: 30 },
      sfrUG: "1:24.5",
      sfrPG: "1:20.0",
    },
    anomalies: [
      {
        id: "ANOM-SW-0592-01",
        documentId: "DOC-AFF-SW-01",
        documentTitle: "AICTE APH Format-1 Notarized Affidavit",
        category: "STAMP_SIGNATURE",
        severity: "FATAL_FRAUD",
        titleEn: "Digital Signature & Seal Cloning (SSIM = 0.998 across 9 pages)",
        titleHi: "डिजिटल हस्ताक्षर एवं मोहर क्लोनिंग (9 पृष्ठों पर एसएसआईएम = 0.998)",
        descriptionEn: "YOLOv11m-Doc stamp localization and Siamese ArcFace comparison revealed the exact same transparent PNG signature and notary stamp pasted across 9 affidavits with identical pixel-level alpha artifacts and 0.0 degree angle variance.",
        descriptionHi: "योलो-11 डॉक स्टाम्प लोकलाइजेशन ने 9 हलफनामों में एक ही पारदर्शी पीएनजी हस्ताक्षर और नोटरी मोहर चिपकाए जाने का खुलासा किया।",
        aphClause: "AICTE APH 2024-27 Affidavit Requirements & Indian Notaries Act 1952",
        modelUsed: "YOLOv11m-Doc + Siamese ResNet-50 ArcFace (SSIM > 0.995)",
        tamperProbability: 0.992,
        confidenceScore: 0.988,
        rpnScore: 880,
        boundingBox: [60, 75, 90, 92],
        extractedValue: "Bit-exact Signature Clone (SSIM 0.998)",
        authorityValue: "Physical Wet Ink Required under APH Format-1",
        verificationState: "MISMATCH_DETECTED",
      },
      {
        id: "ANOM-SW-0592-02",
        documentId: "DOC-LAND-SW-01",
        documentTitle: "Campus Land Survey Map & GIS Cadastral Data",
        category: "AUTHORITY_MISMATCH",
        severity: "FATAL_FRAUD",
        titleEn: "Non-Contiguous Campus Plots Exceeding 2.0 km Haversine Distance",
        titleHi: "गैर-सन्निकट परिसर भूखंड 2.0 किमी की अधिकतम दूरी सीमा से अधिक",
        descriptionEn: "Shapely cadastral GIS analysis detected Plot 1 and Plot 2 are separated by 3.82 km (Haversine distance between 12.9716°N, 77.5946°E and 12.9421°N, 77.6214°E), directly violating APH Chapter I contiguity limits.",
        descriptionHi: "शेपली जीआईएस विश्लेषण ने पता लगाया कि भूखंड 1 और भूखंड 2 के बीच की दूरी 3.82 किमी है, जो अधिकतम 2.0 किमी की अनुमति से अधिक है।",
        aphClause: "APH 2024-27 Chapter I Clause 1.4 (Campus Plots Contiguity: Max 3 plots within 2.0 km)",
        modelUsed: "Cadastral Polygon Triangulation & Haversine Distance Engine",
        tamperProbability: 0.999,
        confidenceScore: 0.999,
        rpnScore: 860,
        boundingBox: [20, 20, 80, 80],
        extractedValue: "Plot Separation: 3.82 km",
        authorityValue: "Statutory Cap: Max 2.0 km inter-plot distance",
        verificationState: "MISMATCH_DETECTED",
      }
    ],
    blueprintRooms: [
      { id: "SW-RM-01", name: "Robotics Kinematics Lab", category: "INA", svgPolygon: "20,20 180,20 180,120 20,120", declaredAreaSqm: 80.0, computedAreaSqm: 78.5, aphNormSqm: 66.0, status: "COMPLIANT", x: 20, y: 20, width: 160, height: 100 },
    ],
    facultyRoster: [
      { id: "FAC-SW-01", name: "Dr. Chetan Gowda", designation: "Professor", department: "Robotics & Automation", pan: "FGHKP1029X", uan: "100392817422", aadhaarFatVerified: true, epfoEcrStatus: "DUAL_EMPLOYMENT_DETECTED", wageRule50Compliant: true, arcFaceSimilarityMax: 0.912, matchedInstitutionName: "Bangalore Institute of Tech", matchedInstitutionPid: "1-1029481721", experienceYears: 16 },
    ],
    documents: [
      {
        id: "DOC-AFF-SW-01",
        titleEn: "Format-1 Statutory Affidavit",
        titleHi: "प्रारूप-1 वैधानिक शपथ पत्र",
        docType: "FIRE_NOC",
        pageCount: 9,
        verificationState: "MISMATCH_DETECTED",
        issuingAuthority: "Notary Public Bangalore Urban",
        authorityUri: "in.gov.kar.notary-AFF-2026-102",
        uploadedAt: "2026-03-25T15:00:00Z",
        truForScore: 0.940,
        elaScore: 0.890,
        tamperAlert: true,
        extractedFields: [
          { nameEn: "Chairman Signature", nameHi: "अध्यक्ष के हस्ताक्षर", ocrValue: "Cloned Vector Object", authorityValue: "Physical Wet Ink Required", confidence: 0.98, bbox: [60, 75, 90, 92], isMismatch: true },
        ]
      }
    ]
  },
  {
    id: "AICTE-2026-EA-0715",
    pid: "1-8819203912",
    nameEn: "Kalinga Regional Institute of Polytechnic & Engineering",
    nameHi: "कलिंगा क्षेत्रीय पॉलिटेक्निक एवं इंजीनियरिंग संस्थान",
    trustName: "Utkal Technical Education Mission",
    region: "Eastern",
    state: "Odisha",
    city: "Bhubaneswar",
    zoneType: "Rural",
    institutionType: "Government / Aided",
    applicationCategory: "Extension of Approval (EoA)",
    scrutinyStatus: "Manual Review Required",
    academicYear: "2026-27",
    submittedAt: "2026-03-22T09:12:45Z",
    iciScore: 81.2,
    fatalGateTriggered: false,
    maxRpn: 310,
    subScores: {
      infra: 84.0,
      faculty: 86.0,
      legal: 72.0,
      authority: 78.0,
      financial: 86.0,
    },
    landAndBuiltUp: {
      applicableFsi: 1.5,
      totalSanctionedStudentsUG: 720,
      totalSanctionedStudentsPG: 0,
      inaRequiredSqm: 3800,
      inaAvailableSqm: 4100,
      adaRequiredSqm: 500,
      adaAvailableSqm: 560,
      amaRequiredSqm: 450,
      amaAvailableSqm: 480,
      acaRequiredSqm: 1187.5,
      acaAvailableSqm: 1250,
      totalBuiltUpRequiredSqm: 5937.5,
      totalBuiltUpAvailableSqm: 6390,
      landRequiredAcres: 7.5,
      landAvailableAcres: 8.40,
      plotCount: 1,
      maxInterPlotDistanceKm: 0.0,
    },
    facultyMetrics: {
      requiredTotal: 36,
      availableVerified: 37,
      ghostFlaggedCount: 0,
      cadreRequired: { prof: 4, assoc: 8, asst: 24 },
      cadreAvailable: { prof: 4, assoc: 8, asst: 25 },
      sfrUG: "1:19.4",
      sfrPG: "N/A",
    },
    anomalies: [
      {
        id: "ANOM-EA-0715-01",
        documentId: "DOC-LAND-EA-01",
        documentTitle: "Government Land Grant Order (1994 Archive)",
        category: "AUTHORITY_MISMATCH",
        severity: "MINOR_DEFICIENCY",
        titleEn: "State Revenue Server HTTP 503 Gateway Timeout (Source Unavailable)",
        titleHi: "राज्य राजस्व सर्वर एचटीटीपी 503 गेटवे टाइमआउट (स्रोत अनुपलब्ध)",
        descriptionEn: "API Setu handshake to Odisha Bhulekh portal timed out after 3 retries (2s, 4s, 8s). Document is a pre-digitization 1994 physical grant deed with OCR confidence 0.68. Assigned to Regional Officer manual scrutiny queue without penalty.",
        descriptionHi: "ओडिशा भुलेख पोर्टल पर एपीआई सेतु हैंडशेक 3 पुनः प्रयासों के बाद टाइमआउट हो गया। 1994 का भौतिक विलेख बिना दंड के क्षेत्रीय अधिकारी की कतार में भेजा गया।",
        aphClause: "AICTE Scrutiny SOP Annexure 3 (Offline / Legacy Archives Grace Protocol)",
        modelUsed: "Authority Bridge Circuit Breaker",
        tamperProbability: 0.05,
        confidenceScore: 0.68,
        rpnScore: 310,
        boundingBox: [15, 20, 85, 80],
        extractedValue: "Land Grant Order No. 4419/Rev dt 14-06-1994",
        authorityValue: "SOURCE_UNAVAILABLE (HTTP 503) - Handshake Queued",
        verificationState: "SOURCE_UNAVAILABLE",
      }
    ],
    blueprintRooms: [
      { id: "EA-RM-01", name: "Survey & Geomatics Lab", category: "INA", svgPolygon: "20,20 160,20 160,100 20,100", declaredAreaSqm: 90.0, computedAreaSqm: 91.0, aphNormSqm: 66.0, status: "COMPLIANT", x: 20, y: 20, width: 140, height: 80 },
    ],
    facultyRoster: [
      { id: "FAC-EA-01", name: "Prof. Bijoy Mohanty", designation: "Professor", department: "Civil Engineering", pan: "OPPK9182C", uan: "100441928410", aadhaarFatVerified: true, epfoEcrStatus: "ACTIVE_VERIFIED", wageRule50Compliant: true, arcFaceSimilarityMax: 0.15, experienceYears: 22 },
    ],
    documents: [
      {
        id: "DOC-LAND-EA-01",
        titleEn: "1994 Land Grant Order",
        titleHi: "1994 भूमि आवंटन आदेश",
        docType: "LAND_DEED",
        pageCount: 4,
        verificationState: "SOURCE_UNAVAILABLE",
        issuingAuthority: "Revenue & Disaster Management, Govt of Odisha",
        authorityUri: "in.gov.odi.bhulekh-GRANT-1994-4419",
        uploadedAt: "2026-03-22T08:00:00Z",
        truForScore: 0.040,
        elaScore: 0.050,
        tamperAlert: false,
        extractedFields: [
          { nameEn: "Allotment Area", nameHi: "आवंटन क्षेत्र", ocrValue: "8.40 Acres", authorityValue: "SOURCE_UNAVAILABLE", confidence: 0.68, bbox: [20, 45, 55, 55], isMismatch: false },
        ]
      }
    ]
  },
  {
    id: "AICTE-2026-CE-0928",
    pid: "1-4491029381",
    nameEn: "Vindhya Valley Technical Campus",
    nameHi: "विंध्य वैली टेक्निकल कैंपस",
    trustName: "Vindhyanchal Educational Society",
    region: "Central",
    state: "Madhya Pradesh",
    city: "Bhopal",
    zoneType: "Rural",
    institutionType: "Private Self-Financed",
    applicationCategory: "Increase in Intake / New Course",
    scrutinyStatus: "Deficiency Issued",
    academicYear: "2026-27",
    submittedAt: "2026-03-27T13:40:15Z",
    iciScore: 72.5,
    fatalGateTriggered: false,
    maxRpn: 490,
    subScores: {
      infra: 70.0,
      faculty: 68.0,
      legal: 78.0,
      authority: 74.0,
      financial: 72.0,
    },
    landAndBuiltUp: {
      applicableFsi: 1.5,
      totalSanctionedStudentsUG: 1080,
      totalSanctionedStudentsPG: 60,
      inaRequiredSqm: 5200,
      inaAvailableSqm: 4950,
      adaRequiredSqm: 700,
      adaAvailableSqm: 720,
      amaRequiredSqm: 600,
      amaAvailableSqm: 610,
      acaRequiredSqm: 1625,
      acaAvailableSqm: 1650,
      totalBuiltUpRequiredSqm: 8125,
      totalBuiltUpAvailableSqm: 7930,
      landRequiredAcres: 7.5,
      landAvailableAcres: 7.60,
      plotCount: 1,
      maxInterPlotDistanceKm: 0.0,
    },
    facultyMetrics: {
      requiredTotal: 58,
      availableVerified: 54,
      ghostFlaggedCount: 0,
      cadreRequired: { prof: 6, assoc: 12, asst: 40 },
      cadreAvailable: { prof: 5, assoc: 10, asst: 39 },
      sfrUG: "1:21.0",
      sfrPG: "1:15.0",
    },
    anomalies: [
      {
        id: "ANOM-CE-0928-01",
        documentId: "DOC-LAB-PHOTO-01",
        documentTitle: "AI & Data Science Laboratory Inspection Photos",
        category: "FORGERY_SPLICING",
        severity: "MAJOR_DEFICIENCY",
        titleEn: "Reused Computer Lab Photographs Detected via DINOv2 / pHash",
        titleHi: "डीआईएनओ-वी2/पी-हैश द्वारा पुनः उपयोग की गई कंप्यूटर लैब तस्वीरों का पता चला",
        descriptionEn: "Perceptual Hash (wHash distance = 2) and DINOv2 ViT-B/14 feature cosine similarity (0.982) matched 2 submitted Computer Workstation photos with photos submitted in 2024 for the Mechanical CAD Lab.",
        descriptionHi: "परसेप्चुअल हैश और डीआईएनओ-वी2 फीचर तुलना ने पुष्टि की कि 2 कंप्यूटर वर्कस्टेशन तस्वीरें 2024 में मैकेनिकल सीएडी लैब के लिए जमा की गई तस्वीरों की समान प्रतियां हैं।",
        aphClause: "AICTE APH 2024-27 Chapter II (Physical Readiness of Emerging Course Laboratories)",
        modelUsed: "DINOv2 ViT-B/14 + Perceptual wHash Index",
        tamperProbability: 0.962,
        confidenceScore: 0.940,
        rpnScore: 490,
        boundingBox: [10, 10, 90, 90],
        extractedValue: "Photo Hash Duplicate (Distance: 2)",
        authorityValue: "Unique Untampered Physical Lab Setup Required",
        verificationState: "MISMATCH_DETECTED",
      },
      {
        id: "ANOM-CE-0928-02",
        documentId: "DOC-FAC-CE-01",
        documentTitle: "EPFO ECR 2.0 Monthly Remittance Sheet",
        category: "AUTHORITY_MISMATCH",
        severity: "MAJOR_DEFICIENCY",
        titleEn: "3 Faculty Violating 50% Basic Wage Add-Back Rule under 2026 Norms",
        titleHi: "2026 नियमों के तहत 3 संकाय 50% मूल वेतन नियम का उल्लंघन कर रहे हैं",
        descriptionEn: "EPFO wage analysis revealed Basic Wage reported as ₹ 18,000 against Gross Remuneration of ₹ 65,000 (27.6% of gross). Under EPF 2026 Social Security Code, basic wage cannot be less than 50% of total remuneration.",
        descriptionHi: "ईपीएफओ वेतन विश्लेषण से पता चला कि ₹65,000 के सकल वेतन के मुकाबले मूल वेतन ₹18,000 दिखाया गया है (27.6%), जो अनिवार्य 50% नियम का उल्लंघन है।",
        aphClause: "EPF Scheme 2026 Para 28(3) & APH Chapter VII Faculty Salary Norms",
        modelUsed: "EPFO Wage Add-Back Audit Engine",
        tamperProbability: 0.08,
        confidenceScore: 0.99,
        rpnScore: 360,
        boundingBox: [20, 50, 80, 65],
        extractedValue: "Reported Basic Wage: 27.6% of Gross",
        authorityValue: "Mandatory Minimum Basic: 50.0% of Gross Remuneration",
        verificationState: "MISMATCH_DETECTED",
      }
    ],
    blueprintRooms: [
      { id: "CE-RM-01", name: "AI & Data Science Lab", category: "INA", svgPolygon: "20,20 180,20 180,120 20,120", declaredAreaSqm: 66.0, computedAreaSqm: 66.0, aphNormSqm: 66.0, status: "COMPLIANT", x: 20, y: 20, width: 160, height: 100 },
    ],
    facultyRoster: [
      { id: "FAC-CE-01", name: "Dr. Alok Verma", designation: "Professor", department: "Computer Science", pan: "MNOKP1928D", uan: "100551928410", aadhaarFatVerified: true, epfoEcrStatus: "ACTIVE_VERIFIED", wageRule50Compliant: false, arcFaceSimilarityMax: 0.20, experienceYears: 17 },
    ],
    documents: [
      {
        id: "DOC-LAB-PHOTO-01",
        titleEn: "Lab Inspection Photo Register",
        titleHi: "प्रयोगशाला निरीक्षण फोटो रजिस्टर",
        docType: "FIRE_NOC",
        pageCount: 6,
        verificationState: "MISMATCH_DETECTED",
        issuingAuthority: "Institute Self-Declaration & Geotag",
        uploadedAt: "2026-03-27T12:00:00Z",
        truForScore: 0.910,
        elaScore: 0.880,
        tamperAlert: true,
        extractedFields: [
          { nameEn: "AI Lab Equipment Photo", nameHi: "एआई लैब फोटो", ocrValue: "Workstation Row A", authorityValue: "Duplicate of 2024 Mech Lab", confidence: 0.94, bbox: [15, 20, 85, 80], isMismatch: true },
        ]
      }
    ]
  }
];

export interface RegionalStats {
  region: string;
  applications: number;
  avgIci: number;
  fatalFraudCount: number;
  rectifiableCount: number;
  ghostFacultyCount: number;
  compliantCount: number;
}

export const REGIONAL_STATS: RegionalStats[] = [
  { region: "North-Western", applications: 840, avgIci: 71.2, fatalFraudCount: 38, rectifiableCount: 240, ghostFacultyCount: 78, compliantCount: 484 },
  { region: "Southern", applications: 1120, avgIci: 84.6, fatalFraudCount: 16, rectifiableCount: 220, ghostFacultyCount: 32, compliantCount: 852 },
  { region: "Western", applications: 910, avgIci: 88.1, fatalFraudCount: 12, rectifiableCount: 160, ghostFacultyCount: 24, compliantCount: 714 },
  { region: "South-Western", applications: 780, avgIci: 76.4, fatalFraudCount: 32, rectifiableCount: 190, ghostFacultyCount: 64, compliantCount: 494 },
  { region: "Eastern", applications: 340, avgIci: 79.8, fatalFraudCount: 14, rectifiableCount: 95, ghostFacultyCount: 28, compliantCount: 203 },
  { region: "Central", applications: 390, avgIci: 74.5, fatalFraudCount: 18, rectifiableCount: 115, ghostFacultyCount: 36, compliantCount: 221 },
  { region: "Northern", applications: 280, avgIci: 69.4, fatalFraudCount: 12, rectifiableCount: 92, ghostFacultyCount: 22, compliantCount: 154 },
  { region: "South-Central", applications: 160, avgIci: 81.0, fatalFraudCount: 6, rectifiableCount: 70, ghostFacultyCount: 12, compliantCount: 72 },
];

export interface AuditBlock {
  blockIndex: number;
  timestamp: string;
  eventType: 'AI_INFERENCE' | 'DPI_HANDSHAKE' | 'OFFICER_SIGN_OFF' | 'DEFICIENCY_DISPATCH';
  applicationId: string;
  targetArtifact: string;
  actorOrModel: string;
  previousHash: string;
  currentHash: string;
  status: 'VALID' | 'VERIFIED';
}

export const INITIAL_AUDIT_BLOCKS: AuditBlock[] = [
  {
    blockIndex: 1,
    timestamp: '2026-10-19T14:10:02Z',
    eventType: 'AI_INFERENCE',
    applicationId: 'AICTE-2026-NW-0842',
    targetArtifact: 'DOC-FIRE-01 (Fire NOC)',
    actorOrModel: 'TruFor (CVPR 2023) + NFA-ViT',
    previousHash: '0000000000000000000000000000000000000000000000000000000000000000',
    currentHash: 'b88518640fb090d14a6bba97e8cc84cdcd1ee444ef41325b028944b5ed29925f',
    status: 'VALID',
  },
  {
    blockIndex: 2,
    timestamp: '2026-10-19T14:12:15Z',
    eventType: 'DPI_HANDSHAKE',
    applicationId: 'AICTE-2026-NW-0842',
    targetArtifact: 'in.gov.har.fire-NOC-2021-8841',
    actorOrModel: 'API Setu DigiLocker Bridge',
    previousHash: 'b88518640fb090d14a6bba97e8cc84cdcd1ee444ef41325b028944b5ed29925f',
    currentHash: '3c74d2912dd950ac7cf4b0b658521ea82f51b4c87b80c2858fbaa80949866de7',
    status: 'VALID',
  },
  {
    blockIndex: 3,
    timestamp: '2026-10-19T14:15:30Z',
    eventType: 'AI_INFERENCE',
    applicationId: 'AICTE-2026-NW-0842',
    targetArtifact: 'DOC-FAC-01 (Faculty Roster)',
    actorOrModel: 'ArcFace (IResNet-100) + Qdrant HNSW',
    previousHash: '3c74d2912dd950ac7cf4b0b658521ea82f51b4c87b80c2858fbaa80949866de7',
    currentHash: '3768e75a1983398367d78111a39465d5eacd374d29c7f264b355f48cb375289b',
    status: 'VALID',
  },
  {
    blockIndex: 4,
    timestamp: '2026-10-19T14:18:45Z',
    eventType: 'AI_INFERENCE',
    applicationId: 'AICTE-2026-NW-0842',
    targetArtifact: 'DOC-PLAN-01 (CAD Blueprint)',
    actorOrModel: 'Mask2Former Swin-Base + Shoelace CV',
    previousHash: '3768e75a1983398367d78111a39465d5eacd374d29c7f264b355f48cb375289b',
    currentHash: 'ad70ae23afc4768c9516ed12575ab962eb3118f90f60d7246016153c27259870',
    status: 'VALID',
  },
  {
    blockIndex: 5,
    timestamp: '2026-10-19T14:22:10Z',
    eventType: 'OFFICER_SIGN_OFF',
    applicationId: 'AICTE-2026-NW-0842',
    targetArtifact: 'Standing Hearing Committee Referral Order',
    actorOrModel: 'Regional Scrutiny Officer (RO-04 Shri R.K. Verma)',
    previousHash: 'ad70ae23afc4768c9516ed12575ab962eb3118f90f60d7246016153c27259870',
    currentHash: '0ff1d872b91b194ee27921cec2ad069de26f79f524ff6a5c8481648950206144',
    status: 'VALID',
  },
  {
    blockIndex: 6,
    timestamp: '2026-10-19T14:25:00Z',
    eventType: 'DEFICIENCY_DISPATCH',
    applicationId: 'AICTE-2026-NW-0842',
    targetArtifact: 'Statutory Show-Cause Dispatch #AICTE/UB/2026-0842',
    actorOrModel: 'AICTE Dispatch Gateway (DPI v4.2)',
    previousHash: '0ff1d872b91b194ee27921cec2ad069de26f79f524ff6a5c8481648950206144',
    currentHash: '7832895952fc7eb51b61ea95cc48274ec4b0d6f998993a6911298facd0b08fa4',
    status: 'VALID',
  },
];

