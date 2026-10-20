import { NextResponse } from 'next/server';
import { calculateBuiltUpNorms, calculateFacultyNorms, calculateIciScore } from '@/lib/aph-engine';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const {
      ugIntake = 360,
      ugDuration = 4,
      pgIntake = 60,
      pgDuration = 2,
      zoneType = 'Urban',
      fsiLoc = 2.0,
      alliedLabSharingFraction = 0.15,
      subScores = { infra: 80, faculty: 75, legal: 85, authority: 90, financial: 80 },
      anomalies = [],
    } = body;

    const builtUp = calculateBuiltUpNorms(
      ugIntake,
      ugDuration,
      pgIntake,
      pgDuration,
      zoneType,
      fsiLoc,
      alliedLabSharingFraction
    );

    const faculty = calculateFacultyNorms(ugIntake, ugDuration, pgIntake, pgDuration);
    const ici = calculateIciScore(subScores, anomalies);

    return NextResponse.json({
      builtUpNorms: builtUp,
      facultyNorms: faculty,
      complianceIndex: ici,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
