import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET(req: NextRequest) {
  const collegeId = req.nextUrl.searchParams.get('college_id');
  let query = supabase
    .from('jobs')
    .select('*, job_applications(count), colleges(name), users(name)')
    .order('created_at', { ascending: false });

  if (collegeId) query = query.eq('college_id', collegeId);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Flatten applications_count
  const jobs =
    data?.map((job) => ({
      ...job,
      applications_count: job.job_applications?.length ?? 0,
    })) ?? [];

  return NextResponse.json(jobs);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { data, error } = await supabase.from('jobs').insert([body]).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data, { status: 201 });
}
