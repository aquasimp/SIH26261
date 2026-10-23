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
    kpiFatalFraudSub: 'TruFor Noiseprint++ Conf. ≥ 85%',
    kpiGhostFaculty: 'Cross-Campus Ghost Faculty',
    kpiGhostFacultySub: 'ArcFace 512-D & EPFO UAN Match',
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
    telemetrySub: 'Neural detection breakdown & DPI response times',
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
    tabEntities: '1. Extracted Entities & DPI Handshake',
    tabApmMatrix: '2. APH 2024–27 Compliance Matrix',
    tabGhostFaculty: '3. Ghost Faculty Biometric Inspector',
    tabTableExtractor: '4. SLANet Table & LayoutLMv3 KIE',
    btnApproveEoA: 'Approve Extension of Approval',
    btnIssueDeficiency: 'Issue 15-Day Deficiency Notice',
    btnEscalateShc: 'Escalate to Standing Hearing Comm.',
    canvasLayerRGB: 'Original RGB',
    canvasLayerBBox: 'LayoutLMv3 Bounding Boxes',
    canvasLayerTruFor: 'TruFor Noiseprint++ Heatmap',
    canvasLayerELA: 'Error Level Analysis (ELA)',
    sliderJpegQuality: 'JPEG Quality (Q)',
    sliderElaGamma: 'Gain Multiplier (γ)',
    showConfidenceMask: 'Show Anomaly Confidence Suppression',

    // Forensic Layers & Ablation
    forensicLayerTruFor: 'TruFor Noiseprint++ Heatmap',
    forensicLayerDctGrid: '8×8 DCT Block Grid',
    forensicLayerResAware: 'ResAware BatchNorm vs InstanceNorm2d',

    // Authority Bridge Statuses
    statusVerified: 'VERIFIED',
    statusMismatchDetected: 'MISMATCH_DETECTED',
    statusExpired: 'EXPIRED',
    statusVerificationPending: 'VERIFY_PENDING',
    statusSourceUnavailable: 'SOURCE_UNAVAIL',
    statusManualReviewRequired: 'MANUAL_REVIEW',

    // Forensics Studio
    forensicsStudioTitle: 'Multi-Spectral Document Forensics Studio',
    forensicsStudioSub: 'Pixel-level tampering localization, Noiseprint++ ResAware ablation, and Siamese seal verification',
    uploadPromptTitle: 'Drag & Drop Institutional Scan or Local Test Image',
    uploadPromptSub: 'Supports PNG, JPEG, TIFF, and PDF scans up to 50MB',
    ablationTitle: 'Noiseprint++ Architectural Bottleneck & ResAware Ablation',
    ablationSub: 'InstanceNorm2d scalar erasure (AUC 0.554) vs. ResAware BatchNorm + StatNoise Fusion (AUC 0.747)',
    sealMatrixTitle: 'Siamese ArcFace Seal & Signature Verification Matrix',
    sealMatrixSub: 'Polar coordinate unwrap, cosine similarity, and SSIM clone thresholding',
    xrefTitle: 'PDF Cross-Reference (xref) & Font Subset Stream Forensics',

    // Infrastructure Studio
    infraStudioTitle: 'Architectural Blueprint & Campus CV Studio',
    infraStudioSub: 'Mask2Former CAD polygon vectorization, scale bar calibration, Shoelace area audit, and GPS cadastral checks',
    scaleBarLabel: 'Scale Bar Calibration',
    recomputeShoelace: 'Recompute Geometric Areas (Shoelace)',
    tableDiscrepancyTitle: 'Cross-Modal Area Discrepancy & Inflation Analysis',
    colRoom: 'Room / Facility',
    colCategory: 'Zone',
    colDeclaredArea: 'Blueprint Text Label',
    colShoelaceArea: 'CV Shoelace Area',
    colNorm: 'APH Ch-VII Norm',
    colVariance: 'Variance %',
    whatIfTitle: 'Interactive What-If FSI/FAR & Intake Simulator',
    sliderUgIntake: 'UG Annual Intake',
    sliderPgIntake: 'PG Annual Intake',
    sliderFsi: 'Municipal FSI / FAR',
    sliderLabSharing: 'Allied Lab Sharing %',

    // Authority Bridge
    authorityTitle: 'National Digital Public Infrastructure (DPI) Monitor',
    authoritySub: 'Real-time mutual TLS & OAuth 2.0 PKCE handshakes with DigiLocker, EPFO USSP, MCA21, and State e-NOCs',
    btnRunSimulation: 'Run Live Handshake Simulation',
    simulatingHandshake: 'Executing DPI Token Handshake...',
    digiLockerHeader: 'DigiLocker / NAD Pull URI Protocol (x-digilocker-hmac)',
    epfoHeader: 'EPFO Unified Shram Suvidha & ECR 2.0 Real-Time Verifier',
    qrHeader: 'State e-District Cryptographic QR Verifier (ECDSA / RSA-2048)',

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
    kpiFatalFraudSub: 'ट्रू-फॉर नॉयसप्रिंट++ विश्वास ≥ 85%',
    kpiGhostFaculty: 'चिह्नित छद्म (घोस्ट) फैकल्टी',
    kpiGhostFacultySub: 'आर्कफेस 512-डी एवं ईपीएफओ मिलान',
    kpiAuthorityLive: 'प्राधिकरण सफल हैंडशेक',
    kpiAuthorityLiveSub: 'डिजीलॉकर पुल यूआरआई • ईसीआर 2.0',

    // Priority Intervention Banner
    criticalAlertBadge: 'अति-गंभीर आरपीएन 940 • एपीएच अध्याय-VII उल्लंघन',
    criticalAlertTitle: 'परिसर भूमि विलेख क्षेत्रफल हेरफेर एवं अग्नि एनओसी तिथि में जालसाजी — एपेक्स इंस्टीट्यूट ऑफ टेक्नोलॉजी (पीआईडी: 1-9482710392) — 98.4% ट्रू-फॉर विश्वास — स्थायी सुनवाई समिति हेतु अनुशंसित',
    btnViewEvidence: 'फोरेंसिक साक्ष्य देखें',
    btnGenerateNotice: 'कारण बताओ नोटिस बनाएं',

    // Overview Sections
    regionalMatrixTitle: 'क्षेत्रीय संवीक्षा एवं विसंगति घनत्व मैट्रिक्स',
    regionalMatrixSub: 'सभी 8 एआईसीटीई क्षेत्रीय समितियों का वास्तविक समय टेलीमेट्री डेटा',
    telemetryTitle: 'उप-प्रणाली विसंगति ट्रिगर एवं प्राधिकरण प्रतिक्रिया समय',
    telemetrySub: 'तंत्रिका पहचान विश्लेषण एवं डीपीआई विलंबता',
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
    tabEntities: '1. निकाली गई जानकारी एवं डीपीआई मिलान',
    tabApmMatrix: '2. एपीएच 2024-27 अनुपालन मैट्रिक्स',
    tabGhostFaculty: '3. छद्म फैकल्टी बायोमेट्रिक निरीक्षक',
    tabTableExtractor: '4. एसएलए-नेट सारणी एवं केआईई',
    btnApproveEoA: 'ईओए स्वीकृत करें',
    btnIssueDeficiency: '15-दिवसीय कमी नोटिस जारी करें',
    btnEscalateShc: 'स्थायी सुनवाई समिति को भेजें',
    canvasLayerRGB: 'मूल आरजीबी छवि',
    canvasLayerBBox: 'लेआउट-एलएमवी3 सीमा बॉक्स',
    canvasLayerTruFor: 'TruFor नॉइज़प्रिंट++ हीटमैप',
    canvasLayerELA: 'एरर लेवल एनालिसिस (ईएलए)',
    sliderJpegQuality: 'जेपीईजी गुणवत्ता (Q)',
    sliderElaGamma: 'वृद्धि गुणक (γ)',
    showConfidenceMask: 'विसंगति विश्वास आवरण दिखाएं',

    // Forensic Layers & Ablation
    forensicLayerTruFor: 'TruFor नॉइज़प्रिंट++ हीटमैप',
    forensicLayerDctGrid: '8×8 डीसीटी ब्लॉक ग्रिड',
    forensicLayerResAware: 'ResAware बैचनॉर्म बनाम InstanceNorm2d',

    // Authority Bridge Statuses
    statusVerified: 'सत्यापित',
    statusMismatchDetected: 'विसंगति पाई गई',
    statusExpired: 'अवधि समाप्त',
    statusVerificationPending: 'सत्यापन लंबित',
    statusSourceUnavailable: 'स्रोत अनुपलब्ध',
    statusManualReviewRequired: 'मैनुअल समीक्षा आवश्यक',

    // Forensics Studio
    forensicsStudioTitle: 'मल्टी-स्पेक्ट्रल डिजिटल दस्तावेज़ फोरेंसिक लैब',
    forensicsStudioSub: 'पिक्सेल-स्तरीय छेड़छाड़ पहचान, नॉयसप्रिंट++ रेस-अवेयर संशोधन एवं आर्कफेस मोहर सत्यापन',
    uploadPromptTitle: 'संस्थागत स्कैन या स्थानीय परीक्षण छवि खींचें एवं छोड़ें',
    uploadPromptSub: 'पीएनजी, जेपीईजी, टीआईएफएफ एवं पीडीएफ स्कैन (अधिकतम 50 एमबी)',
    ablationTitle: 'नॉयसप्रिंट++ वास्तुशिल्प संकुचन एवं रेस-अवेयर विश्लेषण',
    ablationSub: 'इंस्टेंस-नॉर्म2डी स्केलर विलोपन (एयूसी 0.554) बनाम रेस-अवेयर बैच-नॉर्म + स्टैटनॉयस (एयूसी 0.747)',
    sealMatrixTitle: 'सियामी आर्कफेस मोहर एवं हस्ताक्षर सत्यापन मैट्रिक्स',
    sealMatrixSub: 'ध्रुवीय निर्देशांक विस्तार, कोसाइन समानता एवं एसएसआईएम क्लोन पहचान',
    xrefTitle: 'पीडीएफ क्रॉस-रेफरेंस (xref) एवं फॉन्ट सबसेट विश्लेषण',

    // Infrastructure Studio
    infraStudioTitle: 'वास्तुशिल्प ब्लूप्रिंट एवं परिसर कंप्यूटर विजन',
    infraStudioSub: 'मास्क2फॉर्मर सीएडी बहुभुज वैश्वीकरण, पैमाना अंशांकन, शूलेसब सूत्र एवं जीपीएस सत्यापन',
    scaleBarLabel: 'पैमाना पट्टी अंशांकन (Scale Bar)',
    recomputeShoelace: 'ज्यामितीय क्षेत्रफल पुनः गणना (शूलेसब)',
    tableDiscrepancyTitle: 'क्रॉस-मॉडल क्षेत्रफल विसंगति एवं कृत्रिम वृद्धि विश्लेषण',
    colRoom: 'कक्ष / प्रयोगशाला',
    colCategory: 'प्रक्षेत्र',
    colDeclaredArea: 'प्रिंटेड ब्लूप्रिंट लेबल',
    colShoelaceArea: 'सीवी शूलेसब क्षेत्रफल',
    colNorm: 'एपीएच मानक',
    colVariance: 'भिन्नता %',
    whatIfTitle: 'इंटरैक्टिव एफएसआई/एफएआर एवं प्रवेश क्षमता सिम्युलेटर',
    sliderUgIntake: 'यूजी वार्षिक प्रवेश संख्या',
    sliderPgIntake: 'पीजी वार्षिक प्रवेश संख्या',
    sliderFsi: 'नगरपालिका एफएसआई / एफएआर',
    sliderLabSharing: 'संबद्ध प्रयोगशाला साझाकरण %',

    // Authority Bridge
    authorityTitle: 'राष्ट्रीय डिजिटल सार्वजनिक अवसंरचना (डीपीआई) निगरानी',
    authoritySub: 'डिजीलॉकर, ईपीएफओ, एमसीए21 एवं राज्य ई-एनओसी पोर्टल्स के साथ सुरक्षित हैंडशेक',
    btnRunSimulation: 'सीधा हैंडशेक सिमुलेशन चलाएं',
    simulatingHandshake: 'डीपीआई टोकन हैंडशेक निष्पादित हो रहा है...',
    digiLockerHeader: 'डिजीलॉकर / एनएडी पुल यूआरआई प्रोटोकॉल (x-digilocker-hmac)',
    epfoHeader: 'ईपीएफओ श्रम सुविधा एवं ईसीआर 2.0 वास्तविक समय सत्यापन',
    qrHeader: 'राज्य ई-डिस्ट्रिक्ट 2डी क्यूआर क्रिप्टोग्राफिक सत्यापन (ईसीडीएसए)',

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
