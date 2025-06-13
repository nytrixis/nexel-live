import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdminClient';

export async function GET() {
  const { count, error } = await supabaseAdmin
    .from('users')
    .select('*', { count: 'exact', head: true })
    .eq('role', 'admin');

  if (error) {
    return NextResponse.json({ count: 0 }, { status: 500 });
  }

  return NextResponse.json({ count: count ?? 0 });
}
