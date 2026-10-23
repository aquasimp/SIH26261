import { NextResponse } from 'next/server';
import {
  calculateBuiltUpNorms,
  calculateFacultyNorms,
  validateMultiPlotContiguity,
  calculateIciScore,
  calculateAnomalyRpn,
  CampusPlot,
} from '@/lib/aph-engine';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));

    // 1. Intake & Zone Parameters
    const ugIntake = Number(body.ugIntake ?? 360);
    const ugDuration = Number(body.ugDuration ?? 4);
    const pgIntake = Number(body.pgIntake ?? 60);
    const pgDuration = Number(body.pgDuration ?? 2);
    const zoneType = (body.zoneType as 'Mega/Metro' | 'Urban' | 'Rural') || 'Urban';
    const fsiLoc = Number(body.fsiLoc ?? 2.0);
    // 30% allied lab sharing reduction default or custom up to 0.30
    const alliedLabSharingFraction = Math.min(0.30, Math.max(0, Number(body.alliedLabSharingFraction ?? 0.30)));

    // Compute Built-Up and Dynamic Land Norms
    // TB_req = (INA_req + ADA_req + AMA_req) * 1.25
    // L_req = max(TB_req / (Phi_loc * 4046.86), L_legacy_floor)
    const builtUp = calculateBuiltUpNorms(
      ugIntake,
      ugDuration,
      pgIntake,
      pgDuration,
      zoneType,
      fsiLoc,
      alliedLabSharingFraction
    );

    // 2. Multi-Plot Haversine Contiguity Validation
    // N_plots <= 3, max d_Haversine <= 2.0 km, core academic on Plot 1
    const defaultPlots: CampusPlot[] = [
      {
        id: 'plot-1',
        name: 'Plot 1 (Main Academic & Admin Campus)',
        lat: 28.4595,
        lon: 77.0266,
        areaAcres: builtUp.landRequiredAcres >= 3.0 ? 3.5 : 2.5,
        khasraNo: '14//2, 14//3',
        containsAcademicBuiltUp: true,
        isContiguousToMain: true,
      },
      {
        id: 'plot-2',
        name: 'Plot 2 (Sports & Hostel Ground)',
        lat: 28.4650,
        lon: 77.0310,
        areaAcres: 1.5,
        khasraNo: '15//1',
        containsAcademicBuiltUp: false,
        isContiguousToMain: false,
      },
    ];

    const plots: CampusPlot[] = Array.isArray(body.plots) && body.plots.length > 0 ? body.plots : defaultPlots;
    const multiPlotValidation = validateMultiPlotContiguity(plots);

    // 3. Faculty SFR & 1:2:6 Cadre Ratio with Ghost Faculty Deduction
    const availableFaculty = body.availableFaculty || {
      prof: Math.ceil((ugIntake * ugDuration + pgIntake * pgDuration) / 180),
      assoc: Math.ceil((ugIntake * ugDuration + pgIntake * pgDuration) / 90),
      asst: Math.ceil((ugIntake * ugDuration + pgIntake * pgDuration) / 30),
    };
    const ghostFacultyCount = Number(body.ghostFacultyCount ?? (body.concurrentGhostFaculty ?? 0));

    const faculty = calculateFacultyNorms(
      ugIntake,
      ugDuration,
      pgIntake,
      pgDuration,
      availableFaculty,
      ghostFacultyCount
    );

    // 4. Non-Linear Forensic Integrity Gate & ICI Computation
    const subScores = body.subScores || {
      infra: 82,
      faculty: 78,
      legal: 85,
      authority: 90,
      financial: 84,
    };

    const rawAnomalies = Array.isArray(body.anomalies)
      ? body.anomalies
      : [
          {
            severity: 'FATAL_FRAUD',
            tamperProbability: 0.984,
            confidenceScore: 0.942,
            occurrence: 9,
            title: 'Fire NOC Expiry Splicing',
          },
          {
            severity: 'MAJOR_DEFICIENCY',
            tamperProbability: 0.22,
            confidenceScore: 0.85,
            occurrence: 5,
            title: 'Chemistry Lab Area Undersized',
          },
        ];

    // Compute RPN per anomaly
    const anomaliesWithRpn = rawAnomalies.map((anom: any) => {
      const rpn = calculateAnomalyRpn(
        anom.severity || 'MINOR_DEFICIENCY',
        anom.occurrence ?? 5,
        anom.confidenceScore ?? anom.tamperProbability ?? 0.8
      );
      return {
        ...anom,
        rpnScore: rpn,
      };
    });

    const ici = calculateIciScore(subScores, anomaliesWithRpn);

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      statutoryHandbook: 'AICTE Approval Process Handbook (APH 2024–2027)',
      formulations: {
        totalBuiltUpRequiredFormula: 'TB_req = (INA_req + ADA_req + AMA_req) * 1.25 (with 30% allied lab sharing discount)',
        dynamicLandFormula: 'L_req = max(TB_req / (Phi_loc * 4046.86), L_legacy_floor)',
        multiPlotConstraint: 'N_plots <= 3, max d_Haversine <= 2.0 km, (INA union ADA union AMA) subseteq Plot_1',
        facultySfrNorm: 'UG 1:20, PG 1:15 with 1:2:6 Cadre distribution and ghost faculty deduction',
        forensicIntegrityGate: 'Gamma_forensic = prod (1 - I(P_tamper >= 0.85 and C_conf >= 0.80)), ICI capped at 38.0 if Gamma == 0',
      },
      builtUpNorms: {
        ...builtUp,
        circulationAreaFactor: 1.25,
        alliedLabSharingReductionPercent: `${(alliedLabSharingFraction * 100).toFixed(0)}%`,
      },
      multiPlotValidation,
      facultyNorms: {
        ...faculty,
        concurrentGhostFacultyDeducted: ghostFacultyCount,
      },
      complianceIndex: {
        ...ici,
        perAnomalyRpn: anomaliesWithRpn,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ugIntake = Number(searchParams.get('ugIntake') ?? 360);
  const pgIntake = Number(searchParams.get('pgIntake') ?? 60);
  const zoneType = (searchParams.get('zoneType') as 'Mega/Metro' | 'Urban' | 'Rural') || 'Urban';
  const fsiLoc = Number(searchParams.get('fsiLoc') ?? 2.0);

  const builtUp = calculateBuiltUpNorms(ugIntake, 4, pgIntake, 2, zoneType, fsiLoc, 0.30);
  const faculty = calculateFacultyNorms(ugIntake, 4, pgIntake, 2, { prof: 6, assoc: 12, asst: 36 }, 0);
  const ici = calculateIciScore({ infra: 85, faculty: 80, legal: 88, authority: 92, financial: 85 }, []);

  return NextResponse.json({
    success: true,
    message: 'AICTE APH 2024-27 Deterministic Compliance Engine Active',
    sampleCalculation: {
      builtUpNorms: builtUp,
      facultyNorms: faculty,
      complianceIndex: ici,
    },
  });
}
