import { NextResponse } from 'next/server';
import {
  MOCK_APPLICATIONS,
  REGIONAL_STATS,
  InstitutionalApplication,
  ForensicAnomaly,
  DocumentArtifact,
  FacultyRecord,
  BlueprintRoom,
} from '@/lib/mock-data';
import {
  calculateBuiltUpNorms,
  calculateFacultyNorms,
  calculateIciScore,
} from '@/lib/aph-engine';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const region = searchParams.get('region');
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const institutionType = searchParams.get('institutionType');
    const search = searchParams.get('search') || searchParams.get('q');

    let results = [...MOCK_APPLICATIONS];

    if (region && region !== 'All Regions (8)') {
      results = results.filter((a) => a.region === region);
    }

    if (status && status !== 'All Statuses') {
      results = results.filter((a) => a.scrutinyStatus === status);
    }

    if (category && category !== 'All Categories') {
      results = results.filter((a) => a.applicationCategory === category);
    }

    if (institutionType && institutionType !== 'All Types') {
      results = results.filter((a) => a.institutionType === institutionType);
    }

    if (search && search.trim() !== '') {
      const q = search.toLowerCase().trim();
      results = results.filter(
        (a) =>
          a.nameEn.toLowerCase().includes(q) ||
          a.nameHi.includes(q) ||
          a.pid.toLowerCase().includes(q) ||
          a.id.toLowerCase().includes(q) ||
          a.city.toLowerCase().includes(q) ||
          a.state.toLowerCase().includes(q) ||
          a.trustName.toLowerCase().includes(q)
      );
    }

    // Regional Aggregation Telemetry
    const totalIngested = results.length;
    const autoPreClearedCount = results.filter((a) => a.scrutinyStatus === 'Auto-Pre-Cleared').length;
    const deficiencyIssuedCount = results.filter((a) => a.scrutinyStatus === 'Deficiency Issued').length;
    const fatalFraudCount = results.filter((a) => a.scrutinyStatus === 'Fatal Fraud Alert').length;
    const manualReviewCount = results.filter((a) => a.scrutinyStatus === 'Manual Review Required').length;

    const avgIci =
      totalIngested > 0
        ? Math.round((results.reduce((acc, a) => acc + a.iciScore, 0) / totalIngested) * 10) / 10
        : 0;

    const maxRpn = results.reduce((max, a) => Math.max(max, a.maxRpn), 0);

    const regionalDistribution = REGIONAL_STATS.map((reg) => {
      const matchingInRegion = results.filter((a) => a.region === reg.region);
      return {
        region: reg.region,
        totalInRegion: matchingInRegion.length,
        compliant: matchingInRegion.filter((a) => a.scrutinyStatus === 'Auto-Pre-Cleared').length,
        deficiencies: matchingInRegion.filter((a) => a.scrutinyStatus === 'Deficiency Issued').length,
        fatalFraud: matchingInRegion.filter((a) => a.scrutinyStatus === 'Fatal Fraud Alert').length,
      };
    });

    return NextResponse.json({
      success: true,
      totalCount: totalIngested,
      filteredApplications: results,
      regionalStats: REGIONAL_STATS,
      telemetry: {
        totalIngested,
        autoPreClearedCount,
        deficiencyIssuedCount,
        fatalFraudCount,
        manualReviewCount,
        averageIciScore: avgIci,
        maxRpnAcrossRegistry: maxRpn,
        handshakeSuccessRate: '98.4%',
        activeDpiAuthorities: 6,
        regionalDistribution,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

/**
 * Ingest new synthetic institutional dossier conforming to AICTE-SynDoc-10K schema
 */
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const id = body.id || `AICTE-2026-SYN-${randomSuffix}`;
    const pid = body.pid || `1-${Math.floor(1000000000 + Math.random() * 9000000000)}`;

    const nameEn = body.nameEn || `Aryabhata Institute of Engineering & Research (Campus ${randomSuffix})`;
    const nameHi = body.nameHi || `आर्यभट्ट अभियांत्रिकी एवं अनुसंधान संस्थान (${randomSuffix})`;
    const trustName = body.trustName || 'Aryabhata Educational & Charitable Foundation';
    const region = body.region || 'North-Western';
    const state = body.state || 'Haryana';
    const city = body.city || 'Gurugram';
    const zoneType = body.zoneType || 'Urban';
    const institutionType = body.institutionType || 'Private Self-Financed';
    const applicationCategory = body.applicationCategory || 'Extension of Approval (EoA)';
    const academicYear = body.academicYear || '2026-27';

    // Student Intake
    const ugIntake = body.ugIntake || 360;
    const pgIntake = body.pgIntake || 60;
    const ugDuration = body.ugDuration || 4;
    const pgDuration = body.pgDuration || 2;

    // Mathematical APH Norms Calculation
    const builtUp = calculateBuiltUpNorms(
      ugIntake,
      ugDuration,
      pgIntake,
      pgDuration,
      zoneType,
      2.0,
      0.30
    );

    const faculty = calculateFacultyNorms(
      ugIntake,
      ugDuration,
      pgIntake,
      pgDuration,
      {
        prof: Math.floor(ugIntake / 60),
        assoc: Math.floor(ugIntake / 30),
        asst: Math.floor(ugIntake / 15),
      },
      body.ghostFacultyCount || 0
    );

    // Anomalies
    const isFatal = body.isFatalAnomaly !== undefined ? body.isFatalAnomaly : Math.random() > 0.6;
    const anomalies: ForensicAnomaly[] = body.anomalies || [
      {
        id: `ANOM-${id}-01`,
        documentId: `DOC-${id}-FIRE`,
        documentTitle: 'Haryana State Fire NOC',
        category: isFatal ? 'FORGERY_SPLICING' : 'BLUEPRINT_AREA',
        severity: isFatal ? 'FATAL_FRAUD' : 'MAJOR_DEFICIENCY',
        titleEn: isFatal
          ? 'TruFor Noiseprint++ Spliced Validity Date (2024 Altered to 2027)'
          : 'CAD Shoelace Area Deficit in Thermal Engineering Laboratory',
        titleHi: isFatal
          ? 'ट्रू-फॉर नॉयसप्रिंट++ जाली वैधता तिथि (2024 को 2027 में बदला गया)'
          : 'थर्मल इंजीनियरिंग प्रयोगशाला में सीएडी शूलेसब क्षेत्रफल कमी',
        descriptionEn: isFatal
          ? 'Adversarial splice localized at date text block with 98.4% TruFor confidence and phase shift (dx,dy)=(3,5).'
          : 'Blueprint label claims 120 sqm whereas geometric Shoelace vector calculation yields only 84.5 sqm.',
        descriptionHi: isFatal
          ? 'तारीख ब्लॉक पर 98.4% विश्वास के साथ जाली पैच चिह्नित किया गया।'
          : 'ब्लूप्रिंट लेबल 120 वर्ग मीटर दर्शाता है जबकि ज्यामितीय गणना केवल 84.5 वर्ग मीटर है।',
        aphClause: isFatal ? 'APH Clause 1.4 & Ch-VIII' : 'APH Clause 7.2 & Table 7.1',
        modelUsed: isFatal ? 'TruFor (CVPR 2023) + NFA-ViT' : 'Mask2Former Swin-Base + Shoelace Area CV',
        tamperProbability: isFatal ? 0.984 : 0.21,
        confidenceScore: isFatal ? 0.942 : 0.88,
        rpnScore: isFatal ? 940 : 420,
        boundingBox: [42, 120, 85, 145],
        extractedValue: isFatal ? '30-06-2027' : '120.0 sqm',
        authorityValue: isFatal ? '30-06-2024' : '84.5 sqm',
        verificationState: isFatal ? 'MISMATCH_DETECTED' : 'VERIFIED',
      },
    ];

    const subScores = body.subScores || {
      infra: isFatal ? 62 : 88,
      faculty: 84,
      legal: isFatal ? 35 : 92,
      authority: isFatal ? 40 : 96,
      financial: 85,
    };

    const iciCalc = calculateIciScore(subScores, anomalies);

    const scrutinyStatus = iciCalc.fatalGateTriggered
      ? 'Fatal Fraud Alert'
      : iciCalc.iciScore >= 90
      ? 'Auto-Pre-Cleared'
      : 'Deficiency Issued';

    const newApplication: InstitutionalApplication = {
      id,
      pid,
      nameEn,
      nameHi,
      trustName,
      region,
      state,
      city,
      zoneType,
      institutionType,
      applicationCategory,
      scrutinyStatus,
      academicYear,
      submittedAt: new Date().toISOString(),
      iciScore: iciCalc.iciScore,
      fatalGateTriggered: iciCalc.fatalGateTriggered,
      maxRpn: iciCalc.maxRpn,
      subScores,
      landAndBuiltUp: {
        applicableFsi: 2.0,
        totalSanctionedStudentsUG: ugIntake * ugDuration,
        totalSanctionedStudentsPG: pgIntake * pgDuration,
        inaRequiredSqm: builtUp.inaRequiredSqm,
        inaAvailableSqm: Math.round(builtUp.inaRequiredSqm * (isFatal ? 0.85 : 1.05)),
        adaRequiredSqm: builtUp.adaRequiredSqm,
        adaAvailableSqm: builtUp.adaRequiredSqm,
        amaRequiredSqm: builtUp.amaRequiredSqm,
        amaAvailableSqm: builtUp.amaRequiredSqm,
        acaRequiredSqm: builtUp.acaRequiredSqm,
        acaAvailableSqm: builtUp.acaRequiredSqm,
        totalBuiltUpRequiredSqm: builtUp.totalBuiltUpRequiredSqm,
        totalBuiltUpAvailableSqm: Math.round(builtUp.totalBuiltUpRequiredSqm * (isFatal ? 0.88 : 1.04)),
        landRequiredAcres: builtUp.landRequiredAcres,
        landAvailableAcres: builtUp.landRequiredAcres + 0.5,
        plotCount: 1,
        maxInterPlotDistanceKm: 0.0,
      },
      facultyMetrics: {
        requiredTotal: faculty.requiredFacultyTotal,
        availableVerified: faculty.effectiveLegitimateFaculty,
        ghostFlaggedCount: faculty.ghostFacultyCount,
        cadreRequired: {
          prof: faculty.requiredProfessors,
          assoc: faculty.requiredAssociateProfessors,
          asst: faculty.requiredAssistantProfessors,
        },
        cadreAvailable: {
          prof: faculty.requiredProfessors,
          assoc: faculty.requiredAssociateProfessors,
          asst: faculty.requiredAssistantProfessors,
        },
        sfrUG: '1:20',
        sfrPG: '1:15',
      },
      facultyRoster: [],
      blueprintRooms: [],
      documents: body.documents || [
        {
          id: `DOC-${id}-FIRE`,
          titleEn: 'State Fire Safety NOC (2024–2027)',
          titleHi: 'राज्य अग्निशमन सुरक्षा अनापत्ति प्रमाण पत्र',
          docType: 'FIRE_NOC',
          pageCount: 3,
          verificationState: isFatal ? 'MISMATCH_DETECTED' : 'VERIFIED',
          issuingAuthority: `Directorate of Fire Services, Govt. of ${state}`,
          authorityUri: `in.gov.${state.toLowerCase()}.fire-NOC-2026`,
          uploadedAt: '2026-03-01T10:30:00Z',
          truForScore: isFatal ? 0.984 : 0.04,
          elaScore: isFatal ? 0.912 : 0.08,
          tamperAlert: isFatal,
          extractedFields: [
            {
              nameEn: 'Validity Period End Date',
              nameHi: 'वैधता समाप्ति तिथि',
              ocrValue: isFatal ? '30-06-2027' : '30-06-2026',
              authorityValue: isFatal ? '30-06-2024' : '30-06-2026',
              confidence: 0.985,
              bbox: [42, 120, 85, 145],
              isMismatch: isFatal,
            },
          ],
        },
      ],
      anomalies,
    };

    return NextResponse.json({
      success: true,
      message: `AICTE-SynDoc-10K: Successfully ingested synthetic institutional dossier ${id}`,
      application: newApplication,
      telemetry: {
        id,
        iciScore: iciCalc.iciScore,
        maxRpn: iciCalc.maxRpn,
        fatalGateTriggered: iciCalc.fatalGateTriggered,
        gammaForensic: iciCalc.gammaForensic,
        scrutinyStatus,
        region,
        builtUpNormsSqm: builtUp.totalBuiltUpRequiredSqm,
        landNormsAcres: builtUp.landRequiredAcres,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
