import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET() {
  // Adjust 'jobs', 'created_at', and field names to your schema
  const { data, error } = await supabase
    .from('jobs')
    .select('company,title,applicants,closesIn')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error || !data) {
    // Fallback if no job found
    return NextResponse.json({
      company: 'acme_corp',
      title: 'React Developer',
      applicants: 45,
      closesIn: '3 days',
    }, { status: 200 });
  }

  return NextResponse.json(data);
}