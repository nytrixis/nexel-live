import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET() {
  // Get the most recent job
  const { data: job, error: jobError } = await supabase
    .from('jobs')
    .select('id, title, created_at, deadline')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (jobError || !job) {
    // Fallback if no job found
    return NextResponse.json(
      {
        title: 'React Developer',
        applicants: 45,
        closesIn: '3 days',
      },
      { status: 200 },
    );
  }

  // Count applicants for this job
  const { count: applicants } = await supabase
    .from('job_applications')
    .select('id', { count: 'exact', head: true })
    .eq('job_id', job.id);

  // Calculate closesIn
  const deadline = new Date(job.deadline);
  const now = new Date();
  const diffDays = Math.max(
    0,
    Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)),
  );
  const closesIn = diffDays === 0 ? 'today' : `${diffDays} day${diffDays > 1 ? 's' : ''}`;

  return NextResponse.json({
    title: job.title,
    applicants: applicants ?? 0,
    closesIn,
  });
}
