export type Language = 'en' | 'hi';

export const TRANSLATIONS = {
  en: {
    // Top Shell & Brand
    portalTitle: 'AICTE SCRUTINY',
    portalSubtitle: 'REGULATION BUREAU • DPI v4.2',
    govHeader: 'ALL INDIA COUNCIL FOR TECHNICAL EDUCATION • GOVT. OF INDIA',
    dpiStatus: 'DPI Bridge: 6/6 Authorities Online',
    pipelineRun: 'Pipeline Run: 4 mins ago',
    searchPlaceholder: 'Search PID, Institution, UAN, or APH Rule (⌘K)...',

    // Navigation Groups
    navCore: 'CORE INTELLIGENCE',
    navForensics: 'FORENSICS & VISION',
    navGovernance: 'GOVERNANCE & DPI',

    // Navigation Items
    navOverview: 'Executive Overview',
    navApplications: 'Institutional Dossier Registry',
    navWorkbench: 'Scrutiny Workbench',
    navForensicsStudio: 'Digital Forensics Studio',
    navInfrastructure: 'Blueprint & Campus CV',
    navAuthorityBridge: 'DPI Authority Bridge',
    navDeficiencies: 'Deficiency & Show-Cause Notices',
    navAuditTrail: 'SHA-256 Audit Ledger',

    // Global Filter Bar
    filterAcademicYear: 'Academic Year',
    filterRegion: 'AICTE Region',
    filterInstType: 'Institution Type',
    filterCategory: 'Application Category',
    filterStatus: 'Scrutiny Status',
    allRegions: 'All Regions (8)',
    allTypes: 'All Types',
    allCategories: 'All Categories',
    allStatuses: 'All Statuses',

    // 6-Column KPI Grid
    kpiTotalIngested: 'Total Applications Ingested',
    kpiTotalIngestedSub: 'AY 2026-27 Scrutiny Cycle',
    kpiPreCleared: 'Cleared via Pre-Scrutiny',
    kpiPreClearedSub: 'ICI Score ≥ 90 & Zero Fatal Flags',
    kpiDeficienciesIssued: 'Rectifiable Deficiencies',
    kpiDeficienciesIssuedSub: '15-Day EVC Rectification Window',
    kpiFatalFraud: 'Fatal Forgery Alerts',
    kpiFatalFraudSub: 'Forensic Tamper Conf. ≥ 85%',
    kpiGhostFaculty: 'Cross-Campus Ghost Faculty',
    kpiGhostFacultySub: 'Biometric & EPFO UAN Match',
    kpiAuthorityLive: 'Authority Handshakes',
    kpiAuthorityLiveSub: 'DigiLocker Pull URI • EPFO ECR 2.0',

    // Priority Intervention Banner
    criticalAlertBadge: 'CRITICAL RPN 940 • APH CH-VII VIOLATION',
    criticalAlertTitle: 'Campus Land Deed Survey Alteration & Fire NOC Date Splicing Detected — Apex Institute of Technology & Management (PID: 1-9482710392) — 98.4% TruFor Confidence — Standing Hearing Committee & Physical EVC Recommended',
    btnViewEvidence: 'View Forensic Evidence',
    btnGenerateNotice: 'Generate Show-Cause Notice',

    // Overview Sections
    regionalMatrixTitle: 'Regional Scrutiny & Anomaly Density Matrix',
    regionalMatrixSub: 'Real-time telemetry across all 8 AICTE Regional Committees',
    telemetryTitle: 'Subsystem Anomaly Triggers & Authority Latency',
    telemetrySub: 'System verification & DPI response times',
    highRiskQueueTitle: 'High-Risk Institutional Dossier Queue',
    highRiskQueueSub: 'Ranked by continuous Risk Priority Number (RPN 1-1000)',
    colInstitution: 'Institution & PID',
    colRegion: 'Region & Type',
    colIciScore: 'ICI Score',
    colTopAnomaly: 'Top Forensic Flag',
    colAuthorityState: 'Authority Verification',
    colAction: 'Action',
    btnLaunchWorkbench: 'Launch Workbench →',

    // Workbench Tabs & Controls
    tabEntities: 'Attributes & Verification',
    tabApmMatrix: 'APH Compliance',
    tabGhostFaculty: 'Faculty Cross-Check',
    tabTableExtractor: 'Extracted Tables',
    btnApproveEoA: 'Approve Extension of Approval',
    btnIssueDeficiency: 'Issue 15-Day Deficiency Notice',
    btnEscalateShc: 'Escalate to Standing Hearing Comm.',
    canvasLayerRGB: 'Original Document',
    canvasLayerBBox: 'Extracted Fields',
    canvasLayerTruFor: 'Alteration Heatmap',
    canvasLayerELA: 'Compression Analysis',
    sliderJpegQuality: 'Compression Quality',
    sliderElaGamma: 'Sensitivity Multiplier',
    showConfidenceMask: 'Highlight High-Confidence Regions',

    // Forensic Layers & Analysis
    forensicLayerTruFor: 'Alteration Heatmap',
    forensicLayerDctGrid: 'Compression Grid',
    forensicLayerResAware: 'Sensor Noise Filter',

    // Authority Bridge Statuses
    statusVerified: 'VERIFIED',
    statusMismatchDetected: 'MISMATCH_DETECTED',
    statusExpired: 'EXPIRED',
    statusVerificationPending: 'VERIFY_PENDING',
    statusSourceUnavailable: 'SOURCE_UNAVAIL',
    statusManualReviewRequired: 'MANUAL_REVIEW',

    // Forensics Studio
    forensicsStudioTitle: 'Document Forensics Studio',
    forensicsStudioSub: 'Independent statutory verification: pixel alteration detection, sensor consistency, and seal authentication.',
    uploadPromptTitle: 'Upload Institutional Document or Exhibit',
    uploadPromptSub: 'Supports PDF, PNG, JPEG, and TIFF files up to 50MB',
    ablationTitle: 'Sensor Residual & Alteration Analysis',
    ablationSub: 'High-frequency sensor residual verification and anomaly detection.',
    sealMatrixTitle: 'Institutional Seal & Signature Verification',
    sealMatrixSub: 'Direct optical comparison against verified municipal and statutory authority specimens.',
    xrefTitle: 'Document Stream & Metadata Audit',

    // Infrastructure Studio
    infraStudioTitle: 'Blueprint & Campus Analysis',
    infraStudioSub: 'Architectural CAD room segmentation, scale calibration, and multi-plot land contiguity verification.',
    scaleBarLabel: 'Scale Bar Calibration',
    recomputeShoelace: 'Calculate Room Areas',
    tableDiscrepancyTitle: 'Room Area Compliance & Label Comparison',
    colRoom: 'Room / Facility',
    colCategory: 'Zone',
    colDeclaredArea: 'Blueprint Label',
    colShoelaceArea: 'Calculated Area',
    colNorm: 'APH Norm',
    colVariance: 'Variance',
    whatIfTitle: 'Intake & Built-Up Area Simulator',
    sliderUgIntake: 'UG Annual Intake',
    sliderPgIntake: 'PG Annual Intake',
    sliderFsi: 'Municipal FSI / FAR',
    sliderLabSharing: 'Allied Lab Sharing %',

    // Authority Bridge
    authorityTitle: 'National Authority Verification Bridge',
    authoritySub: 'Real-time statutory verification with DigiLocker, EPFO, MCA21, and State Registries.',
    btnRunSimulation: 'Run Verification Check',
    simulatingHandshake: 'Connecting to Authority Registry...',
    digiLockerHeader: 'DigiLocker Certified Land Registry Record',
    epfoHeader: 'EPFO Active Employment & Payroll Verification',
    qrHeader: 'State e-District Digital Verification',

    // Deficiencies & Notices
    deficiencyTitle: 'Statutory Deficiency & Show-Cause Order Generator',
    deficiencySub: 'Automated legal letterhead generation with exact APH 2024–27 citations and 15-day rectification clock',
    selectApplication: 'Select Target Institution',
    btnSignDsc: 'Sign with Regional Officer DSC',
    btnDispatch: 'Dispatch to College Portal',
    btnPrintPdf: 'Print / Export Statutory Order',
    rectificationCountdown: 'Mandatory Rectification Window Remaining',

    // Audit Trail
    auditTitle: 'Immutable Scrutiny Ledger & Evidence Hash Chain',
    auditSub: 'Cryptographically linked SHA-256 blocks logging every AI inference, DPI handshake, and officer sign-off',
    btnVerifyIntegrity: 'Verify Cryptographic Chain Integrity',
    chainStatusValid: 'SHA-256 Hash Chain: 100% Valid & Tamper-Free',
  },
  hi: {
    // Top Shell & Brand
    portalTitle: 'अखिल भारतीय तकनीकी शिक्षा परिषद',
    portalSubtitle: 'विनियमन ब्यूरो • डीपीआई संस्करण 4.2',
    govHeader: 'अखिल भारतीय तकनीकी शिक्षा परिषद • भारत सरकार',
    dpiStatus: 'डीपीआई ब्रिज: 6/6 प्राधिकरण सक्रिय',
    pipelineRun: 'अंतिम विश्लेषण: 4 मिनट पूर्व',
    searchPlaceholder: 'पीआईडी, संस्थान, यूएएन या नियम खोजें (⌘K)...',

    // Navigation Groups
    navCore: 'मुख्य विश्लेषण प्रणाली',
    navForensics: 'फॉरेंसिक एवं दृष्टि प्रभाग',
    navGovernance: 'प्रशासन एवं डीपीआई सेतु',

    // Navigation Items
    navOverview: 'कार्यकारी सारांश',
    navApplications: 'संस्थागत डोजियर रजिस्ट्री',
    navWorkbench: 'स्क्रूटनी वर्कबेंच',
    navForensicsStudio: 'डिजिटल फॉरेंसिक स्टूडियो',
    navInfrastructure: 'ब्लूप्रिंट और कैंपस सीवी',
    navAuthorityBridge: 'डीपीआई अथॉरिटी ब्रिज',
    navDeficiencies: 'कमी और कारण बताओ नोटिस',
    navAuditTrail: 'SHA-256 ऑडिट लेजर',

    // Global Filter Bar
    filterAcademicYear: 'शैक्षणिक सत्र',
    filterRegion: 'एआईसीटीई क्षेत्रीय कार्यालय',
    filterInstType: 'संस्थान की प्रकृति',
    filterCategory: 'आवेदन श्रेणी',
    filterStatus: 'संवीक्षा स्थिति',
    allRegions: 'सभी क्षेत्र (8)',
    allTypes: 'सभी प्रकार',
    allCategories: 'सभी श्रेणियां',
    allStatuses: 'सभी स्थितियां',

    // 6-Column KPI Grid
    kpiTotalIngested: 'कुल प्राप्त आवेदन',
    kpiTotalIngestedSub: 'शैक्षणिक सत्र 2026-27 चक्र',
    kpiPreCleared: 'स्वतः पूर्व-स्वीकृत आवेदन',
    kpiPreClearedSub: 'आईसीआई स्कोर ≥ 90 एवं शून्य गंभीर त्रुटि',
    kpiDeficienciesIssued: 'सुधार योग्य कमियां जारी',
    kpiDeficienciesIssuedSub: '15-दिवसीय ईवीसी सुधार अवसर',
    kpiFatalFraud: 'गंभीर जालसाजी चेतावनियां',
    kpiFatalFraudSub: 'दस्तावेज़ छेड़छाड़ विश्वास ≥ 85%',
    kpiGhostFaculty: 'चिह्नित छद्म (घोस्ट) फैकल्टी',
    kpiGhostFacultySub: 'बायोमेट्रिक एवं ईपीएफओ मिलान',
    kpiAuthorityLive: 'प्राधिकरण सफल हैंडशेक',
    kpiAuthorityLiveSub: 'डिजीलॉकर पुल यूआरआई • ईसीआर 2.0',

    // Priority Intervention Banner
    criticalAlertBadge: 'अति-गंभीर आरपीएन 940 • एपीएच अध्याय-VII उल्लंघन',
    criticalAlertTitle: 'परिसर भूमि विलेख क्षेत्रफल हेरफेर एवं अग्नि एनओसी तिथि में जालसाजी — एपेक्स इंस्टीट्यूट ऑफ टेक्नोलॉजी (पीआईडी: 1-9482710392) — 98.4% छेड़छाड़ पुष्टि — स्थायी सुनवाई समिति हेतु अनुशंसित',
    btnViewEvidence: 'फोरेंसिक साक्ष्य देखें',
    btnGenerateNotice: 'कारण बताओ नोटिस बनाएं',

    // Overview Sections
    regionalMatrixTitle: 'क्षेत्रीय संवीक्षा एवं विसंगति घनत्व मैट्रिक्स',
    regionalMatrixSub: 'सभी 8 एआईसीटीई क्षेत्रीय समितियों का वास्तविक समय टेलीमेट्री डेटा',
    telemetryTitle: 'उप-प्रणाली विसंगति ट्रिगर एवं प्राधिकरण प्रतिक्रिया समय',
    telemetrySub: 'सिस्टम सत्यापन एवं डीपीआई विलंबता',
    highRiskQueueTitle: 'उच्च-जोखिम संस्थान संवीक्षा कतार',
    highRiskQueueSub: 'जोखिम प्राथमिकता संख्या (आरपीएन 1-1000) द्वारा क्रमबद्ध',
    colInstitution: 'संस्थान एवं पीआईडी',
    colRegion: 'क्षेत्र एवं श्रेणी',
    colIciScore: 'आईसीआई स्कोर',
    colTopAnomaly: 'प्रमुख फोरेंसिक चेतावनी',
    colAuthorityState: 'प्राधिकरण सत्यापन',
    colAction: 'कार्यवाही',
    btnLaunchWorkbench: 'कार्यशाला खोलें →',

    // Workbench Tabs & Controls
    tabEntities: 'फ़ील्ड एवं सत्यापन',
    tabApmMatrix: 'एपीएच अनुपालन',
    tabGhostFaculty: 'संकाय सत्यापन',
    tabTableExtractor: 'निकाली गई सारणियां',
    btnApproveEoA: 'ईओए स्वीकृत करें',
    btnIssueDeficiency: '15-दिवसीय कमी नोटिस जारी करें',
    btnEscalateShc: 'स्थायी सुनवाई समिति को भेजें',
    canvasLayerRGB: 'मूल दस्तावेज़',
    canvasLayerBBox: 'निकाले गए फ़ील्ड',
    canvasLayerTruFor: 'छेड़छाड़ हीटमैप',
    canvasLayerELA: 'कंप्रेशन विश्लेषण',
    sliderJpegQuality: 'कंप्रेशन गुणवत्ता',
    sliderElaGamma: 'संवेदनशीलता गुणक',
    showConfidenceMask: 'उच्च-विश्वास क्षेत्र दिखाएं',

    // Forensic Layers & Ablation
    forensicLayerTruFor: 'छेड़छाड़ हीटमैप',
    forensicLayerDctGrid: 'कंप्रेशन ग्रिड',
    forensicLayerResAware: 'सेंसर नॉइज़ फ़िल्टर',

    // Authority Bridge Statuses
    statusVerified: 'सत्यापित',
    statusMismatchDetected: 'विसंगति पाई गई',
    statusExpired: 'अवधि समाप्त',
    statusVerificationPending: 'सत्यापन लंबित',
    statusSourceUnavailable: 'स्रोत अनुपलब्ध',
    statusManualReviewRequired: 'मैनुअल समीक्षा आवश्यक',

    // Forensics Studio
    forensicsStudioTitle: 'दस्तावेज़ फोरेंसिक स्टूडियो',
    forensicsStudioSub: 'स्वतंत्र सांविधिक सत्यापन: पिक्सेल छेड़छाड़ विश्लेषण, सेंसर निरंतरता एवं मोहर प्रमाणीकरण।',
    uploadPromptTitle: 'संस्थागत दस्तावेज़ या साक्ष्य अपलोड करें',
    uploadPromptSub: 'पीडीएफ, पीएनजी, जेपीईजी एवं टीआईएफएफ फ़ाइलें (अधिकतम 50 एमबी)',
    ablationTitle: 'सेंसर अवशिष्ट एवं विसंगति विश्लेषण',
    ablationSub: 'उच्च-आवृत्ति सेंसर अवशिष्ट सत्यापन एवं विसंगति पहचान।',
    sealMatrixTitle: 'मोहर एवं हस्ताक्षर सत्यापन',
    sealMatrixSub: 'प्राधिकृत नगर निगम एवं सांविधिक नमूनों से प्रत्यक्ष तुलना।',
    xrefTitle: 'दस्तावेज़ स्ट्रीम एवं मेटाडेटा ऑडिट',

    // Infrastructure Studio
    infraStudioTitle: 'ब्लूप्रिंट एवं परिसर विश्लेषण',
    infraStudioSub: 'वास्तुशिल्प सीएडी कक्ष विभाजन, पैमाना अंशांकन एवं भूखंड निकटता सत्यापन।',
    scaleBarLabel: 'पैमाना पट्टी अंशांकन',
    recomputeShoelace: 'कक्ष क्षेत्रफल गणना',
    tableDiscrepancyTitle: 'कक्ष क्षेत्रफल अनुपालन एवं लेबल तुलना',
    colRoom: 'कक्ष / प्रयोगशाला',
    colCategory: 'प्रक्षेत्र',
    colDeclaredArea: 'ब्लूप्रिंट लेबल',
    colShoelaceArea: 'गणना किया गया क्षेत्रफल',
    colNorm: 'एपीएच मानक',
    colVariance: 'भिन्नता',
    whatIfTitle: 'प्रवेश एवं निर्मित क्षेत्रफल सिम्युलेटर',
    sliderUgIntake: 'यूजी वार्षिक प्रवेश संख्या',
    sliderPgIntake: 'पीजी वार्षिक प्रवेश संख्या',
    sliderFsi: 'नगरपालिका एफएसआई / एफएआर',
    sliderLabSharing: 'संबद्ध प्रयोगशाला साझाकरण %',

    // Authority Bridge
    authorityTitle: 'राष्ट्रीय प्राधिकरण सत्यापन ब्रिज',
    authoritySub: 'डिजिलॉकर, ईपीएफओ, एमसीए21 एवं राज्य रजिस्ट्रियों के साथ प्रत्यक्ष सांविधिक सत्यापन।',
    btnRunSimulation: 'सत्यापन जांच चलाएं',
    simulatingHandshake: 'प्राधिकरण रजिस्ट्री से जुड़ रहे हैं...',
    digiLockerHeader: 'डिजिलॉकर प्रमाणित भूमि रजिस्ट्री रिकॉर्ड',
    epfoHeader: 'ईपीएफओ सक्रिय रोजगार एवं वेतन सत्यापन',
    qrHeader: 'राज्य ई-डिस्ट्रिक्ट डिजिटल सत्यापन',

    // Deficiencies & Notices
    deficiencyTitle: 'वैधानिक कमी एवं कारण बताओ आदेश जनरेटर',
    deficiencySub: 'एपीएच 2024-27 नियमों एवं साक्ष्यों सहित स्वचालित आधिकारिक नोटिस एवं 15-दिवसीय समय सीमा',
    selectApplication: 'लक्षित संस्थान का चयन करें',
    btnSignDsc: 'क्षेत्रीय अधिकारी डीएससी से डिजिटल हस्ताक्षर करें',
    btnDispatch: 'संस्थान पोर्टल पर प्रेषित करें',
    btnPrintPdf: 'आधिकारिक आदेश प्रिंट / निर्यात करें',
    rectificationCountdown: 'अनिवार्य सुधार हेतु शेष समय',

    // Audit Trail
    auditTitle: 'अपरिवर्तनीय संवीक्षा बहीखाता एवं साक्ष्य हैश श्रृंखला',
    auditSub: 'प्रत्येक एआई निर्णय, डीपीआई हैंडशेक एवं अधिकारी अनुमोदन को दर्ज करने वाली सुरक्षित एसएचए-256 श्रृंखला',
    btnVerifyIntegrity: 'क्रिप्टोग्राफिक श्रृंखला अखंडता सत्यापित करें',
    chainStatusValid: 'एसएचए-256 हैश श्रृंखला: 100% वैध एवं छेड़छाड़-रहित',
  },
};
