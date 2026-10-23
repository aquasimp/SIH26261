// Deterministic Mathematical Formulations of AICTE Approval Process Handbook (APH 2024–2027)

export interface BuiltUpAreaCalculation {
  inaRequiredSqm: number;
  adaRequiredSqm: number;
  amaRequiredSqm: number;
  acaRequiredSqm: number;
  totalBuiltUpRequiredSqm: number;
  landRequiredAcres: number;
  fsiRatioAchieved: number;
  nominalLabSqm: number;
  discountedLabSqm: number;
  labDiscountAppliedSqm: number;
}

export interface FacultyRatioCalculation {
  sug: number;
  spg: number;
  totalStudents: number;
  requiredFacultyTotal: number;
  requiredProfessors: number;
  requiredAssociateProfessors: number;
  requiredAssistantProfessors: number;
  sfrUG: number;
  sfrPG: number;
  ghostFacultyCount: number;
  effectiveLegitimateFaculty: number;
  cadreDeficit: {
    prof: number;
    assoc: number;
    asst: number;
    total: number;
  };
}

export interface CampusPlot {
  id: string;
  name: string;
  lat: number;
  lon: number;
  areaAcres: number;
  khasraNo: string;
  containsAcademicBuiltUp: boolean; // INA, ADA, AMA
  isContiguousToMain: boolean;
}

export interface MultiPlotValidationResult {
  isCompliant: boolean;
  plotCount: number;
  maxDistanceKm: number;
  totalAreaAcres: number;
  violations: string[];
  pairwiseDistances: Array<{ from: string; to: string; distanceKm: number }>;
}

/**
 * Calculates APH Chapter VII Built-up Area norms and Land requirements
 * Formula:
 * TB_req = (INA_req + ADA_req + AMA_req) + ACA_req
 * ACA_req = 0.25 * (INA_req + ADA_req + AMA_req)
 * Allied branch lab sharing discount up to 30%: Lab_req^allied = 0.70 * Lab_nominal
 * Dynamic FSI/FAR Land: L_req = max(TB_req / (Phi_loc * 4046.86), L_legacy_floor)
 */
export function calculateBuiltUpNorms(
  ugIntake: number,
  ugDuration: number = 4,
  pgIntake: number = 0,
  pgDuration: number = 2,
  zoneType: 'Mega/Metro' | 'Urban' | 'Rural' = 'Urban',
  fsiLoc: number = 2.0,
  alliedLabSharingFraction: number = 0.0
): BuiltUpAreaCalculation {
  const totalUG = ugIntake * ugDuration;
  const totalPG = pgIntake * pgDuration;
  const totalStudents = totalUG + totalPG;

  // Instructional Area (INA)
  // Classrooms: 1.0 - 1.1 sqm per student for standard batch load + labs (66 sqm each)
  const baseInaPerStudent = 4.0; // aggregated standard across engineering/tech curricula
  const nominalIna = totalStudents * baseInaPerStudent;
  
  // Lab fraction is ~40% of INA
  const labFraction = 0.40;
  const nominalLabSqm = nominalIna * labFraction;

  // Allied branch lab sharing discount (up to 30% reduction on lab component: Lab_req^allied = 0.70 * Lab_nominal)
  const sharingReduction = Math.min(0.30, Math.max(0, alliedLabSharingFraction));
  const discountedLabSqm = nominalLabSqm * (1.0 - sharingReduction);
  const labDiscountAppliedSqm = nominalLabSqm - discountedLabSqm;

  const inaRequiredSqm = Math.round((nominalIna * (1.0 - labFraction)) + discountedLabSqm);

  // Administrative Area (ADA): Principal, Board Room, Admin, HOD & Faculty Cabins
  const adaRequiredSqm = Math.round(inaRequiredSqm * 0.12);

  // Amenities Area (AMA): Common rooms, PWD barrier-free toilets, cafeteria, first-aid
  const amaRequiredSqm = Math.round(inaRequiredSqm * 0.10);

  // Access and Circulation Area (ACA): Mandated at exactly 25% of carpet area
  // ACA_req = 0.25 * (INA_req + ADA_req + AMA_req)
  const carpetAreaSqm = inaRequiredSqm + adaRequiredSqm + amaRequiredSqm;
  const acaRequiredSqm = Math.round(0.25 * carpetAreaSqm);

  // Total Built-up Required
  const totalBuiltUpRequiredSqm = carpetAreaSqm + acaRequiredSqm;

  // Dynamic Land requirement: L_req = max(TB_req / (Phi_loc * 4046.86), L_legacy_floor)
  // 1 Acre = 4046.86 m^2
  const legacyFloorAcres: Record<string, number> = {
    'Mega/Metro': 1.5,
    'Urban': 2.5,
    'Rural': 7.5,
  };
  const legacyFloor = legacyFloorAcres[zoneType] || 2.5;
  const landByFsiAcres = totalBuiltUpRequiredSqm / (fsiLoc * 4046.86);
  const landRequiredAcres = Math.max(Math.round(landByFsiAcres * 100) / 100, legacyFloor);
  const fsiRatioAchieved = Math.round((totalBuiltUpRequiredSqm / (landRequiredAcres * 4046.86)) * 100) / 100;

  return {
    inaRequiredSqm,
    adaRequiredSqm,
    amaRequiredSqm,
    acaRequiredSqm,
    totalBuiltUpRequiredSqm,
    landRequiredAcres,
    fsiRatioAchieved,
    nominalLabSqm: Math.round(nominalLabSqm),
    discountedLabSqm: Math.round(discountedLabSqm),
    labDiscountAppliedSqm: Math.round(labDiscountAppliedSqm),
  };
}

/**
 * Calculates Student-Faculty Ratio and 1:2:6 Cadre distribution according to APH 2024–27
 * F_req = ceil(S_UG / 20) + ceil(S_PG / 15)
 * Cadre:
 * F_Prof = floor(F_req / 9)
 * F_Assoc = floor(2 * F_req / 9)
 * F_Asst = F_req - (F_Prof + F_Assoc)
 *
 * Accounts for ghost faculty deduction:
 * F_effective = F_available - CONCURRENT_GHOST_FACULTY
 */
export function calculateFacultyNorms(
  ugIntake: number,
  ugDuration: number = 4,
  pgIntake: number = 0,
  pgDuration: number = 2,
  availableFaculty: { prof: number; assoc: number; asst: number } = { prof: 0, assoc: 0, asst: 0 },
  ghostFacultyCount: number = 0
): FacultyRatioCalculation {
  const sug = ugIntake * ugDuration;
  const spg = pgIntake * pgDuration;
  const totalStudents = sug + spg;

  // F_req = ceil(S_UG / 20) + ceil(S_PG / 15)
  const reqUG = Math.ceil(sug / 20);
  const reqPG = spg > 0 ? Math.ceil(spg / 15) : 0;
  const requiredFacultyTotal = reqUG + reqPG;

  // 1:2:6 Cadre Ratio
  const requiredProfessors = Math.floor(requiredFacultyTotal / 9);
  const requiredAssociateProfessors = Math.floor((2 * requiredFacultyTotal) / 9);
  const requiredAssistantProfessors = requiredFacultyTotal - (requiredProfessors + requiredAssociateProfessors);

  const totalAvailable = availableFaculty.prof + availableFaculty.assoc + availableFaculty.asst;
  const effectiveLegitimateFaculty = Math.max(0, totalAvailable - ghostFacultyCount);

  const cadreDeficit = {
    prof: Math.max(0, requiredProfessors - availableFaculty.prof),
    assoc: Math.max(0, requiredAssociateProfessors - availableFaculty.assoc),
    asst: Math.max(0, requiredAssistantProfessors - availableFaculty.asst),
    total: Math.max(0, requiredFacultyTotal - effectiveLegitimateFaculty),
  };

  return {
    sug,
    spg,
    totalStudents,
    requiredFacultyTotal,
    requiredProfessors,
    requiredAssociateProfessors,
    requiredAssistantProfessors,
    sfrUG: sug > 0 ? 20.0 : 0,
    sfrPG: spg > 0 ? 15.0 : 0,
    ghostFacultyCount,
    effectiveLegitimateFaculty,
    cadreDeficit,
  };
}

/**
 * Computes polygon area in square meters using the exact Shoelace formula:
 * Area_m2(P) = s^2 * 0.5 * |sum_{i=1}^n (x_i y_{i+1} - x_{i+1} y_i)|
 * @param points Array of [x, y] coordinates in pixels
 * @param scaleFactor Linear scale factor in meters per pixel (s = L_m / L_px)
 */
export function calculateShoelaceArea(points: [number, number][], scaleFactor: number): number {
  if (points.length < 3) return 0;
  let sum1 = 0;
  let sum2 = 0;

  for (let i = 0; i < points.length; i++) {
    const nextIdx = (i + 1) % points.length;
    sum1 += points[i][0] * points[nextIdx][1];
    sum2 += points[nextIdx][0] * points[i][1];
  }

  const areaPx = 0.5 * Math.abs(sum1 - sum2);
  const areaSqm = areaPx * (scaleFactor * scaleFactor);
  return Math.round(areaSqm * 10) / 10;
}

/**
 * Computes Great-Circle Haversine distance between two GPS coordinates in kilometers:
 * d = 2 * R * asin(sqrt(sin^2(dLat/2) + cos(lat1)*cos(lat2)*sin^2(dLon/2)))
 */
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371.0; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180.0;
  const dLon = ((lon2 - lon1) * Math.PI) / 180.0;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180.0) *
      Math.cos((lat2 * Math.PI) / 180.0) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 1000) / 1000;
}

/**
 * Multi-Plot Haversine & Contiguity Validator according to APH 2024–27 Chapter I:
 * 1. N_plots <= 3
 * 2. max d_Haversine(Plot_i, Plot_j) <= 2.0 km
 * 3. (INA union ADA union AMA) subset-eq Plot_1 (all core academic/admin areas on Plot 1)
 */
export function validateMultiPlotContiguity(plots: CampusPlot[]): MultiPlotValidationResult {
  const plotCount = plots.length;
  const violations: string[] = [];
  const pairwiseDistances: Array<{ from: string; to: string; distanceKm: number }> = [];
  let maxDistanceKm = 0;
  let totalAreaAcres = 0;

  plots.forEach((p) => {
    totalAreaAcres += p.areaAcres;
  });

  // Rule 1: Max 3 plots permitted
  if (plotCount > 3) {
    violations.push(
      `APH Chapter I Norm Violation: Maximum 3 discrete land parcels permitted (found ${plotCount} plots).`
    );
  }

  // Calculate all pairwise Haversine distances
  for (let i = 0; i < plots.length; i++) {
    for (let j = i + 1; j < plots.length; j++) {
      const dist = calculateHaversineDistance(
        plots[i].lat,
        plots[i].lon,
        plots[j].lat,
        plots[j].lon
      );
      pairwiseDistances.push({
        from: plots[i].name,
        to: plots[j].name,
        distanceKm: dist,
      });
      if (dist > maxDistanceKm) {
        maxDistanceKm = dist;
      }
      // Rule 2: Max distance between any two plots <= 2.0 km
      if (dist > 2.0) {
        violations.push(
          `APH Clause 1.4 Distance Exceeded: Haversine distance between ${plots[i].name} and ${plots[j].name} is ${dist.toFixed(2)} km (statutory maximum is 2.0 km).`
        );
      }
    }
  }

  // Rule 3: All academic and administrative built-up on Plot 1
  for (let i = 1; i < plots.length; i++) {
    if (plots[i].containsAcademicBuiltUp) {
      violations.push(
        `APH Clause 1.4 Zone Placement Shortfall: Plot #${i + 1} (${plots[i].name}) contains academic built-up. Mandate requires (INA ∪ ADA ∪ AMA) ⊆ Plot 1.`
      );
    }
  }

  return {
    isCompliant: violations.length === 0,
    plotCount,
    maxDistanceKm: Math.round(maxDistanceKm * 100) / 100,
    totalAreaAcres: Math.round(totalAreaAcres * 100) / 100,
    violations,
    pairwiseDistances,
  };
}

/**
 * Evaluates the Institutional Compliance Index (ICI) and Non-Linear Fatal Fraud Veto Gate:
 * Gamma_forensic = prod_{i} (1 - I(P_tamper,i >= 0.85 and C_conf,i >= 0.80))
 * If Gamma_forensic == 0:
 * ICI = min(WeightedSum * 0.40, 38.0)
 */
export function calculateIciScore(
  subScores: {
    infra: number;
    faculty: number;
    legal: number;
    authority: number;
    financial: number;
  },
  anomalies: Array<{
    severity: string;
    tamperProbability: number;
    confidenceScore: number;
  }>
): {
  iciScore: number;
  rawWeightedScore: number;
  fatalGateTriggered: boolean;
  gammaForensic: number;
  maxRpn: number;
} {
  // Check fatal fraud gate:
  // Gamma_forensic = prod(1 - I(P_tamper >= 0.85 and C_conf >= 0.80))
  let fatalGateTriggered = false;
  let gammaForensic = 1.0;

  for (const anom of anomalies) {
    if (
      anom.severity === 'FATAL_FRAUD' &&
      anom.tamperProbability >= 0.85 &&
      anom.confidenceScore >= 0.80
    ) {
      fatalGateTriggered = true;
      gammaForensic = 0.0;
      break;
    }
  }

  // Category weights: Infra 0.25, Faculty 0.25, Legal 0.20, Authority 0.15, Financial 0.15
  const weightedSum =
    0.25 * subScores.infra +
    0.25 * subScores.faculty +
    0.20 * subScores.legal +
    0.15 * subScores.authority +
    0.15 * subScores.financial;

  // Non-linear gate penalty: If Gamma_forensic == 0, score is capped at 38.0
  const finalIci = fatalGateTriggered ? Math.min(weightedSum * 0.40, 38.0) : weightedSum;

  return {
    iciScore: Math.round(finalIci * 10) / 10,
    rawWeightedScore: Math.round(weightedSum * 10) / 10,
    fatalGateTriggered,
    gammaForensic,
    maxRpn: fatalGateTriggered ? 940 : 420,
  };
}

/**
 * Computes Risk Priority Number (RPN) for a given anomaly:
 * RPN = Severity * Occurrence * ForensicCertainty in [1, 1000]
 */
export function calculateAnomalyRpn(
  severity: 'FATAL_FRAUD' | 'MAJOR_DEFICIENCY' | 'MINOR_DEFICIENCY' | 'COMPLIANT',
  occurrence: number, // 1-10
  certaintyScore: number // 0-1
): number {
  const sevMap = {
    FATAL_FRAUD: 10,
    MAJOR_DEFICIENCY: 7,
    MINOR_DEFICIENCY: 4,
    COMPLIANT: 1,
  };
  const s = sevMap[severity] || 5;
  const o = Math.max(1, Math.min(10, occurrence));
  const c = Math.max(1, Math.min(10, Math.round(certaintyScore * 10)));
  return Math.min(1000, s * o * c);
}

