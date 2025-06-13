'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface Job {
  id: string;
  title: string;
  description: string;
  location: string;
  deadline: string;
  created_at: string;
  college_id: string;
  posted_by: string;
}

export function useJobs(collegeId: string) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('jobs')
        .select('*')
        .eq('college_id', collegeId)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setJobs(data || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  }, [collegeId]);

  useEffect(() => {
    if (collegeId) {
      fetchJobs();
    }
  }, [collegeId, fetchJobs]);

  const refetch = useCallback(() => {
    fetchJobs();
  }, [fetchJobs]);

  return { jobs, loading, error, refetch };
}
