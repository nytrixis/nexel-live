import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Helper to decode JWT
function parseJwt(token: string) {
  try {
    return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const authHeader = req.headers.get('authorization');
  const jwt = authHeader?.split(' ')[1];
  if (!jwt) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // Decode JWT to get user id
  const payload = parseJwt(jwt);
  const userId = payload?.sub;
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: `Bearer ${jwt}` } },
  });

  // Get user and role using the userId from JWT
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('id, role')
    .eq('id', userId)
    .single();

  if (userError || !user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  let query = supabase
    .from('job_applications')
    .select('*, student:users(id, name, email, college_id)')
    .eq('job_id', id)
    .order('applied_at', { ascending: false });

  if (user.role === 'student') {
    query = query.eq('student_id', user.id);
  }

  const { data, error } = await query;

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data ?? []);
}
