import { NextResponse } from 'next/server';
import { MOCK_APPLICATIONS, REGIONAL_STATS } from '@/lib/mock-data';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const region = searchParams.get('region');
  const status = searchParams.get('status');
  const query = searchParams.get('q');

  let results = [...MOCK_APPLICATIONS];

  if (region && region !== 'All Regions (8)') {
    results = results.filter((a) => a.region === region);
  }

  if (status && status !== 'All Statuses') {
    results = results.filter((a) => a.scrutinyStatus === status);
  }

  if (query) {
    const q = query.toLowerCase();
    results = results.filter(
      (a) =>
        a.nameEn.toLowerCase().includes(q) ||
        a.pid.toLowerCase().includes(q) ||
        a.id.toLowerCase().includes(q) ||
        a.city.toLowerCase().includes(q)
    );
  }

  return NextResponse.json({
    totalCount: results.length,
    applications: results,
    regionalStats: REGIONAL_STATS,
  });
}
