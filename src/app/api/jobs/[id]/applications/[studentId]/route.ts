import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET(req: NextRequest, { params }: { params: { studentId: string } }) {
  // Get the current session
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();
  if (sessionError || !session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Only allow students to view their own applications
  if (session.user.id !== params.studentId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { data, error } = await supabase
    .from('job_applications')
    .select(
      `
      *,
      job:jobs(
        id, title, description, location, deadline, created_at, status
      )
    `,
    )
    .eq('student_id', params.studentId)
    .order('applied_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
