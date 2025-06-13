import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  // Get session
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // Get user and role
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('id, role')
    .eq('id', session.user.id)
    .single();

  if (userError || !user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  let query = supabase
    .from('job_applications')
    .select('*, student:users(id, name, email, college_id)')
    .eq('job_id', params.id)
    .order('applied_at', { ascending: false });

  // If student, filter by their own application only
  if (user.role === 'student') {
    query = query.eq('student_id', user.id);
  }

  const { data, error } = await query;

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}
