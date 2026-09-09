import { NextResponse } from 'next/server';
import { getDocs } from '@/lib/adminStore';
export const dynamic = 'force-dynamic';
export async function GET() {
 try {
  const d = await getDocs(['studio', 'analytics', 'studio-sync']);
  return NextResponse.json({ studio: d.studio, analytics: d.analytics, sync: d['studio-sync'] || {} }, { headers: { 'Cache-Control': 'no-store' } });
 } catch {
  return NextResponse.json({ error: 'statistiques indisponibles' }, { status: 503 });
 }
}
