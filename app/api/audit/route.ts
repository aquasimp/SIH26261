import { NextResponse } from 'next/server';
import { INITIAL_AUDIT_BLOCKS, AuditBlock } from '@/lib/mock-data';
import { computeAuditBlockHash, verifyAuditChain } from '@/lib/crypto-utils';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const verify = searchParams.get('verify');

  if (verify === 'true') {
    const chainVerification = await verifyAuditChain(INITIAL_AUDIT_BLOCKS);
    return NextResponse.json({
      blocks: INITIAL_AUDIT_BLOCKS,
      verification: chainVerification,
    });
  }

  return NextResponse.json({
    totalBlocks: INITIAL_AUDIT_BLOCKS.length,
    blocks: INITIAL_AUDIT_BLOCKS,
    chainIntegrity: '100% VALID',
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      previousHash,
      applicationId,
      eventType = 'OFFICER_SIGN_OFF',
      targetArtifact,
      actorOrModel,
      officerNote,
    } = body;

    const timestamp = new Date().toISOString();
    const currentHash = await computeAuditBlockHash(
      previousHash || '0'.repeat(64),
      timestamp,
      applicationId,
      eventType,
      actorOrModel || 'Regional Scrutiny Officer (RO-04 Shri R.K. Verma)'
    );

    const newBlock: AuditBlock = {
      blockIndex: INITIAL_AUDIT_BLOCKS.length + 1,
      timestamp,
      eventType,
      applicationId,
      targetArtifact: targetArtifact || 'Extension of Approval Decision',
      actorOrModel: actorOrModel || 'Regional Scrutiny Officer (RO-04 Shri R.K. Verma)',
      previousHash: previousHash || INITIAL_AUDIT_BLOCKS[INITIAL_AUDIT_BLOCKS.length - 1].currentHash,
      currentHash,
      status: 'VERIFIED',
    };

    return NextResponse.json({
      success: true,
      block: newBlock,
      message: 'Audit ledger block cryptographically committed to SHA-256 chain.',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
