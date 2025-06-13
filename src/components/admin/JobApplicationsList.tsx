'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';
import ApplicantCard from './ApplicantCard';
import { formatToIST } from '@/utils/date';

interface Application {
  id: string;
  applied_at: string;
  student: {
    id: string;
    name: string;
    email: string;
    college_id: string;
  };
}

interface Job {
  id: string;
  title: string;
  location: string;
  deadline: string;
}

interface JobApplicationsListProps {
  jobId: string;
  onClose: () => void;
}

export default function JobApplicationsList({ jobId, onClose }: JobApplicationsListProps) {
  const [applications, setApplications] = useState<Application[]>([]);
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchJobAndApplications();
  }, [jobId]);

  const fetchJobAndApplications = async () => {
    setLoading(true);
    setError('');
    try {
      // Fetch job details (same as before)
      const { data: jobData, error: jobError } = await supabase
        .from('jobs')
        .select('id, title, location, deadline')
        .eq('id', jobId)
        .single();

      if (jobError) throw jobError;
      setJob(jobData);

      // Fetch applications via API route
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const accessToken = session?.access_token;
      console.log(accessToken);
      const res = await fetch(`/api/jobs/${jobId}/applications`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const applicationsData = await res.json();
      if (!Array.isArray(applicationsData)) {
        setApplications([]);
        setError(applicationsData?.error || 'Failed to load applications');
      } else {
        setApplications(applicationsData);
      }
    } catch (err: any) {
      console.error('Error fetching applications:', err);
      setError(err.message || 'Failed to load applications');
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-hidden">
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center gap-3">
              <svg
                className="animate-spin h-8 w-8 text-[#1e7d6b]"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span className="text-[#222] font-medium">Loading applications...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        {/* Header */}
        <div className="p-6 border-b border-[#dbe7e3]">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-[#222] mb-2">
                Applications for &quot;{job?.title}&quot;
              </h2>
              <div className="flex items-center gap-4 text-sm text-[#666]">
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  {job?.location}
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Deadline:{' '}
                  {job && formatToIST(job.deadline, { dateStyle: 'medium', timeStyle: 'short' })}
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  {applications.length} Applications
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-[#666] hover:text-[#222] transition-colors p-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {error ? (
            <div className="text-center py-12">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <svg
                  className="h-6 w-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-[#222] mb-2">Error Loading Applications</h3>
              <p className="text-[#666] mb-4">{error}</p>
              <button
                onClick={fetchJobAndApplications}
                className="px-4 py-2 rounded-full bg-[#1e7d6b] text-white font-semibold hover:bg-[#1a6b5a] transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : applications.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-[#eaf1ef] mb-4">
                <svg
                  className="h-6 w-6 text-[#1e7d6b]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-[#222] mb-2">No Applications Yet</h3>
              <p className="text-[#666]">This job hasn&apos;t received any applications yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {applications.map((application, index) => (
                <ApplicantCard key={application.id} application={application} index={index} />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {applications.length > 0 && (
          <div className="p-6 border-t border-[#dbe7e3] bg-[#eaf1ef]">
            <div className="flex items-center justify-between">
              <div className="text-sm text-[#666]">
                Total: {applications.length} application{applications.length !== 1 ? 's' : ''}
              </div>
              <button
                onClick={onClose}
                className="px-6 py-2 rounded-full bg-[#1e7d6b] text-white font-semibold hover:bg-[#1a6b5a] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
