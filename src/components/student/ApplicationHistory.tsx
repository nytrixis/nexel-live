'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';
import ApplicationCard from './ApplicationCard';

interface JobApplication {
  id: string;
  job_id: string;
  student_id: string;
  applied_at: string;
  job: {
    id: string;
    title: string;
    description: string;
    location: string;
    deadline: string;
    created_at: string;
  };
}

interface ApplicationHistoryProps {
  userId: string;
}

export default function ApplicationHistory({ userId }: ApplicationHistoryProps) {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'expired'>('all');

  useEffect(() => {
    fetchApplications();
  }, [userId]);

  const fetchApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('job_applications')
        .select(
          `
          *,
          job:jobs (
            id,
            title,
            description,
            location,
            deadline,
            created_at
          )
        `,
        )
        .eq('student_id', userId)
        .order('applied_at', { ascending: false });

      if (error) throw error;

      // Filter out applications where job is null (deleted jobs)
      const validApplications = (data || []).filter((app) => app.job) as JobApplication[];
      setApplications(validApplications);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredApplications = () => {
    const now = new Date();

    switch (filter) {
      case 'active':
        return applications.filter((app) => new Date(app.job.deadline) > now);
      case 'expired':
        return applications.filter((app) => new Date(app.job.deadline) <= now);
      default:
        return applications;
    }
  };

  const filteredApplications = getFilteredApplications();
  const activeCount = applications.filter((app) => new Date(app.job.deadline) > new Date()).length;
  const expiredCount = applications.filter(
    (app) => new Date(app.job.deadline) <= new Date(),
  ).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-[#1e7d6b] text-lg">Loading applications...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#222]">My Applications</h2>
        <div className="text-[#666]">
          {applications.length} total application{applications.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Filter Tabs */}
      <motion.div
        className="bg-white rounded-2xl shadow border border-[#dbe7e3] p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex gap-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'all'
                ? 'bg-[#1e7d6b] text-white'
                : 'bg-[#eaf1ef] text-[#666] hover:bg-[#dbe7e3]'
            }`}
          >
            All ({applications.length})
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'active'
                ? 'bg-[#1e7d6b] text-white'
                : 'bg-[#eaf1ef] text-[#666] hover:bg-[#dbe7e3]'
            }`}
          >
            Active ({activeCount})
          </button>
          <button
            onClick={() => setFilter('expired')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'expired'
                ? 'bg-[#1e7d6b] text-white'
                : 'bg-[#eaf1ef] text-[#666] hover:bg-[#dbe7e3]'
            }`}
          >
            Expired ({expiredCount})
          </button>
        </div>
      </motion.div>

      {/* Applications List */}
      {filteredApplications.length === 0 ? (
        <motion.div
          className="bg-white rounded-2xl shadow border border-[#dbe7e3] p-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="text-[#222] text-lg mb-2">
            {filter === 'all' ? 'No applications yet' : `No ${filter} applications`}
          </div>
          <p className="text-[#666]">
            {filter === 'all'
              ? 'Start applying to jobs to see them here'
              : `You don't have any ${filter} applications`}
          </p>
        </motion.div>
      ) : (
        <div className="grid gap-6">
          {filteredApplications.map((application, index) => (
            <ApplicationCard key={application.id} application={application} index={index} />
          ))}
        </div>
      )}
    </div>
  );
}
