// Deterministic Mathematical Formulations of AICTE Approval Process Handbook (APH 2024–2027)

export interface BuiltUpAreaCalculation {
  inaRequiredSqm: number;
  adaRequiredSqm: number;
  amaRequiredSqm: number;
  acaRequiredSqm: number;
  totalBuiltUpRequiredSqm: number;
  landRequiredAcres: number;
  fsiRatioAchieved: number;
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
}

/**
 * Calculates APH Chapter VII Built-up Area norms and Land requirements
 * @param ugIntake Total annual UG intake
 * @param ugDuration UG course duration (typically 4 years for B.Tech)
 * @param pgIntake Total annual PG intake
 * @param pgDuration PG course duration (typically 2 years for M.Tech/MBA)
 * @param zoneType 'Mega/Metro' | 'Urban' | 'Rural'
 * @param fsiLoc Applicable municipal FSI / FAR
 * @param alliedLabSharingFraction Fraction of lab space shared across allied branches (max 0.30)
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
  const baseInaPerStudent = 4.0; // aggregated standard across curricula
  let nominalIna = totalStudents * baseInaPerStudent;
  
  // Allied branch lab sharing discount (up to 30% reduction on lab component)
  const sharingReduction = Math.min(0.30, alliedLabSharingFraction);
  const labFractionOfIna = 0.40;
  nominalIna = nominalIna * (1.0 - labFractionOfIna * sharingReduction);
  const inaRequiredSqm = Math.round(nominalIna);

  // Administrative Area (ADA): Principal, Board Room, Admin, HOD & Faculty Cabins
  const adaRequiredSqm = Math.round(inaRequiredSqm * 0.12);

  // Amenities Area (AMA): Common rooms, PWD barrier-free toilets, cafeteria, first-aid
  const amaRequiredSqm = Math.round(inaRequiredSqm * 0.10);

  // Access and Circulation Area (ACA): Mandated at 25% of total carpet area
  // ACA = 0.25 * (INA + ADA + AMA)
  const acaRequiredSqm = Math.round(0.25 * (inaRequiredSqm + adaRequiredSqm + amaRequiredSqm));

  // Total Built-up Required
  const totalBuiltUpRequiredSqm = inaRequiredSqm + adaRequiredSqm + amaRequiredSqm + acaRequiredSqm;

  // Land calculation: L_req = max(TB_req / (FSI * 4046.86), L_legacy_floor)
  const legacyFloorAcres: Record<string, number> = {
    'Mega/Metro': 1.5,
    'Urban': 2.5,
    'Rural': 7.5,
  };
  const legacyFloor = legacyFloorAcres[zoneType] || 2.5;
  const landByFsiAcres = totalBuiltUpRequiredSqm / (fsiLoc * 4046.86);
  const landRequiredAcres = Math.max(Math.round(landByFsiAcres * 100) / 100, legacyFloor);
  const fsiRatioAchieved = fsiLoc;

  return {
    inaRequiredSqm,
    adaRequiredSqm,
    amaRequiredSqm,
    acaRequiredSqm,
    totalBuiltUpRequiredSqm,
    landRequiredAcres,
    fsiRatioAchieved,
  };
}

/**
 * Calculates Student-Faculty Ratio and 1:2:6 Cadre distribution
 */
export function calculateFacultyNorms(
  ugIntake: number,
  ugDuration: number = 4,
  pgIntake: number = 0,
  pgDuration: number = 2
): FacultyRatioCalculation {
  const sug = ugIntake * ugDuration;
  const spg = pgIntake * pgDuration;
  const totalStudents = sug + spg;

  // F_req = ceil(S_UG / 20) + ceil(S_PG / 15)
  const reqUG = Math.ceil(sug / 20);
  const reqPG = spg > 0 ? Math.ceil(spg / 15) : 0;
  const requiredFacultyTotal = reqUG + reqPG;

  // 1:2:6 Cadre Ratio
  // F_Prof = floor(F_req / 9)
  // F_Assoc = floor(2 * F_req / 9)
  // F_Asst = F_req - (F_Prof + F_Assoc)
  const requiredProfessors = Math.floor(requiredFacultyTotal / 9);
  const requiredAssociateProfessors = Math.floor((2 * requiredFacultyTotal) / 9);
  const requiredAssistantProfessors = requiredFacultyTotal - (requiredProfessors + requiredAssociateProfessors);

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
  };
}

/**
 * Computes polygon area in square meters using Shoelace formula
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
 * Computes Haversine distance between two GPS coordinates in kilometers
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
  return Math.round(R * c * 100) / 100;
}

/**
 * Evaluates the Institutional Compliance Index (ICI) and Fatal Fraud Veto Gate
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
): { iciScore: number; fatalGateTriggered: boolean; maxRpn: number } {
  // Check fatal fraud gate:
  // Gamma_forensic = prod(1 - I(P_tamper >= 0.85 and C_conf >= 0.80))
  let fatalGateTriggered = false;
  for (const anom of anomalies) {
    if (anom.severity === 'FATAL_FRAUD' && anom.tamperProbability >= 0.85 && anom.confidenceScore >= 0.80) {
      fatalGateTriggered = true;
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

  // If fatal fraud gate is triggered, score is sharply capped/penalized to reflect unverified integrity
  const finalIci = fatalGateTriggered ? Math.min(weightedSum * 0.45, 38.0) : weightedSum;

  return {
    iciScore: Math.round(finalIci * 10) / 10,
    fatalGateTriggered,
    maxRpn: fatalGateTriggered ? 940 : 420,
  };
}

/**
 * Computes Risk Priority Number (RPN) for a given anomaly
 * RPN = Severity * Occurrence * Detection/Certainty in [1, 1000]
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
