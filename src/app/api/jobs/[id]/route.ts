import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const { data, error } = await supabase.from('jobs').select('*').eq('id', params.id).single();

  if (error || !data)
    return NextResponse.json({ error: error?.message || 'Not found' }, { status: 404 });
  return NextResponse.json(data);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  const { error } = await supabase.from('jobs').update(body).eq('id', params.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ success: true });
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  // Optionally, delete job_applications first if you want to enforce referential integrity manually
  await supabase.from('job_applications').delete().eq('job_id', params.id);
  const { error } = await supabase.from('jobs').delete().eq('id', params.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ success: true });
}
