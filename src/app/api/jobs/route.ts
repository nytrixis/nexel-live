import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET(req: NextRequest) {
  // Get session
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // Get user and role
  const { data: user } = await supabase
    .from('users')
    .select('id, role, college_id')
    .eq('id', session.user.id)
    .single();

  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  let collegeId = req.nextUrl.searchParams.get('college_id');

  // If student, force their own college_id
  if (user.role === 'student') {
    collegeId = user.college_id;
  }

  let query = supabase
    .from('jobs')
    .select('*, job_applications(count), colleges(name), users(name)')
    .order('created_at', { ascending: false });

  if (collegeId) query = query.eq('college_id', collegeId);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Fix applications_count
  const jobs =
    data?.map((job) => ({
      ...job,
      applications_count: job.job_applications?.count ?? 0,
    })) ?? [];

  return NextResponse.json(jobs);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { data, error } = await supabase.from('jobs').insert([body]).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data, { status: 201 });
}
