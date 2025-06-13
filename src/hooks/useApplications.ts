'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface JobApplication {
  id: string;
  job_id: string;
  student_id: string;
  applied_at: string;
}

export function useApplications(studentId: string) {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [appliedJobIds, setAppliedJobIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (studentId) {
      fetchApplications();
    }
  }, [studentId]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('job_applications')
        .select('*')
        .eq('student_id', studentId)
        .order('applied_at', { ascending: false });

      if (fetchError) throw fetchError;

      const apps = data || [];
      setApplications(apps);
      setAppliedJobIds(apps.map((app) => app.job_id));
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching applications:', err);
    } finally {
      setLoading(false);
    }
  };

  const applyToJob = async (jobId: string) => {
    try {
      const { error } = await supabase
        .from('job_applications')
        .insert([{ job_id: jobId, student_id: studentId }]);

      if (error) throw error;

      // Update local state
      setAppliedJobIds((prev) => [...prev, jobId]);
      await fetchApplications(); // Refresh full data

      return { success: true };
    } catch (err: any) {
      console.error('Error applying to job:', err);
      return { success: false, error: err.message };
    }
  };

  const refetch = () => {
    fetchApplications();
  };

  return {
    applications,
    appliedJobIds,
    loading,
    error,
    applyToJob,
    refetch,
  };
}
