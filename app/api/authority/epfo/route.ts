import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      uan = '100492817291',
      grossSalary = 120000,
      declaredBasicDa = 28000,
      primaryPfCode = 'HR/GUR/0048192',
    } = body;

    const excludedAllowances = Math.max(0, grossSalary - declaredBasicDa);
    const maxPermissibleAllowances = 0.5 * grossSalary;
    const deemedWageAddBack = Math.max(0, excludedAllowances - maxPermissibleAllowances);

    // Section 2(88) Social Security Code 2026:
    // Statutory EPF wage base cannot be less than 50% of gross remuneration
    const statutoryEpfBase = declaredBasicDa + deemedWageAddBack;
    const statutory12PctRemittance = Math.round(0.12 * statutoryEpfBase);
    const actual12PctRemitted = Math.round(0.12 * declaredBasicDa);
    const remittanceShortfall = Math.max(0, statutory12PctRemittance - actual12PctRemitted);

    const isWageRuleViolated = deemedWageAddBack > 0;

    // Check known dual employment records
    const hasConcurrentEmployment = uan === '100492817291';

    return NextResponse.json({
      success: true,
      uan,
      grossSalary,
      declaredBasicDa,
      excludedAllowances,
      maxPermissibleAllowances,
      deemedWageAddBack,
      statutoryEpfBase,
      statutory12PctRemittance,
      actual12PctRemitted,
      remittanceShortfall,
      isWageRuleViolated,
      hasConcurrentEmployment,
      concurrentDetails: hasConcurrentEmployment
        ? {
            establishmentCode: 'UP/NOI/0048192',
            establishmentName: 'Noida Institute of Engg & Tech (NIET)',
            pid: '1-1092837419',
            arcFaceCosineSimilarity: 0.942,
            flag: 'CONCURRENT_GHOST_FACULTY',
          }
        : null,
      statutoryReference: 'Social Security Code 2026 Sec 2(88) & EPF Scheme 2026 Para 28(3)',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
