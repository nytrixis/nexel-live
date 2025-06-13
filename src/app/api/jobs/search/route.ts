import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET(req: NextRequest) {
  // Get the current session
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();
  if (sessionError || !session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Get the student's college_id
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('college_id')
    .eq('id', session.user.id)
    .single();

  if (userError || !user?.college_id) {
    return NextResponse.json({ error: 'User not found or no college assigned' }, { status: 400 });
  }

  // Parse filters from query params
  const { searchParams } = req.nextUrl;
  const title = searchParams.get('title');
  const location = searchParams.get('location');
  const deadline = searchParams.get('deadline');

  let query = supabase
    .from('jobs')
    .select('*, job_applications(count)')
    .eq('college_id', user.college_id);

  if (title) query = query.ilike('title', `%${title}%`);
  if (location) query = query.ilike('location', `%${location}%`);
  if (deadline) query = query.lte('deadline', deadline);

  query = query.order('created_at', { ascending: false });

  const { data: jobs, error: jobsError } = await query;

  if (jobsError) {
    return NextResponse.json({ error: jobsError.message }, { status: 500 });
  }

  const jobsWithCount = jobs.map((job) => ({
    ...job,
    applications_count: job.job_applications?.count ?? 0,
  }));

  return NextResponse.json(jobsWithCount);
}
