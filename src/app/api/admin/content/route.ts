import { NextResponse } from 'next/server';
import { getDocs } from '@/lib/adminStore';
import { readEditorial } from '@/lib/contentPlan';
export const dynamic = 'force-dynamic';
export async function GET() {
 try {
  const editorial = readEditorial((await getDocs(['editorial'])).editorial);
  return NextResponse.json({ editorial }, { headers: { 'Cache-Control': 'no-store' } });
 } catch {
  return NextResponse.json({ error: 'propositions indisponibles' }, { status: 503 });
 }
}
