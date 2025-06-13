'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { Sidebar, SidebarBody, SidebarLink } from '@/components/ui/sidebar';
import { IconBriefcase, IconPlus, IconUsers, IconLogout, IconDashboard } from '@tabler/icons-react';
import { cn } from '@/lib/utils';
import JobPostingForm from '@/components/admin/JobPostingForm';
import JobCard from '@/components/admin/JobCard';
import JobApplicationsList from '@/components/admin/JobApplicationsList';

interface Job {
  id: string;
  title: string;
  description: string;
  location: string;
  deadline: string;
  created_at: string;
  college_id: string;
  posted_by: string;
  status?: 'active' | 'inactive';
  applications_count?: number;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  college_id: string;
}

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [showJobForm, setShowJobForm] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [activeView, setActiveView] = useState('dashboard');
  const [open, setOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
    fetchJobs();
  }, []);

  const checkAuth = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      router.push('/auth?tab=login');
      return;
    }

    const { data: userData } = await supabase
      .from('users')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (!userData || userData.role !== 'admin') {
      router.push('/auth?tab=login');
      return;
    }

    setUser(userData);
    setLoading(false);
  };

  const fetchJobs = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) return;

    const { data: userData } = await supabase
      .from('users')
      .select('college_id')
      .eq('id', session.user.id)
      .single();

    if (!userData?.college_id) return;

    const { data: jobsData } = await supabase
      .from('jobs')
      .select(
        `
        *,
        job_applications(count)
      `,
      )
      .eq('college_id', userData.college_id)
      .order('created_at', { ascending: false });

    if (jobsData) {
      const jobsWithCount = jobsData.map((job) => ({
        ...job,
        applications_count: job.job_applications?.count || 0,
        status: job.status || 'active',
      }));
      setJobs(jobsWithCount);
    }
  };

  const handleJobSubmit = async (jobData: Partial<Job>) => {
    setFormLoading(true);
    try {
      if (editingJob) {
        const { error } = await supabase.from('jobs').update(jobData).eq('id', editingJob.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('jobs')
          .insert([{ ...jobData, created_at: new Date().toISOString() }]);

        if (error) throw error;
      }

      setShowJobForm(false);
      setEditingJob(null);
      await fetchJobs();
    } catch (error) {
      console.error('Error submitting job:', error);
      alert('Failed to save job. Please try again.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditJob = (job: Job) => {
    setEditingJob(job);
    setShowJobForm(true);
  };

  const handleDeleteJob = async (jobId: string) => {
    try {
      const { error: applicationsError } = await supabase
        .from('job_applications')
        .delete()
        .eq('job_id', jobId);

      if (applicationsError) throw applicationsError;

      const { error: jobError } = await supabase.from('jobs').delete().eq('id', jobId);

      if (jobError) throw jobError;

      await fetchJobs();
    } catch (error) {
      console.error('Error deleting job:', error);
      alert('Failed to delete job. Please try again.');
    }
  };

  const handleStatusChange = async (jobId: string, status: 'active' | 'inactive') => {
    try {
      const { error } = await supabase.from('jobs').update({ status }).eq('id', jobId);

      if (error) throw error;

      await fetchJobs();
    } catch (error) {
      console.error('Error updating job status:', error);
      throw error;
    }
  };

  const handleViewApplications = (jobId: string) => {
    setSelectedJobId(jobId);
  };

  const handleCancelForm = () => {
    setShowJobForm(false);
    setEditingJob(null);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const links = [
    {
      label: 'Dashboard',
      href: '#',
      icon: <IconDashboard className="h-5 w-5 shrink-0 text-[#1e7d6b]" />,
    },
    {
      label: 'All Jobs',
      href: '#',
      icon: <IconBriefcase className="h-5 w-5 shrink-0 text-[#1e7d6b]" />,
    },
    {
      label: 'Post Job',
      href: '#',
      icon: <IconPlus className="h-5 w-5 shrink-0 text-[#1e7d6b]" />,
    },
    {
      label: 'Applications',
      href: '#',
      icon: <IconUsers className="h-5 w-5 shrink-0 text-[#1e7d6b]" />,
    },
    {
      label: 'Logout',
      href: '#',
      icon: <IconLogout className="h-5 w-5 shrink-0 text-[#1e7d6b]" />,
    },
  ];

  const Logo = () => {
    return (
      <div className="flex items-center space-x-2 py-1">
        <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-[#1e7d6b]" />
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="font-extrabold text-xl tracking-tight text-[#222]"
        >
          NEXEL
        </motion.span>
      </div>
    );
  };

  const LogoIcon = () => {
    return (
      <div className="flex items-center space-x-2 py-1">
        <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-[#1e7d6b]" />
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#eaf1ef] flex items-center justify-center">
        <div className="text-[#1e7d6b] text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className={cn('flex w-full h-screen overflow-x-hidden bg-[#eaf1ef]')}>
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink
                  key={idx}
                  link={link}
                  onClick={() => {
                    if (link.label === 'Dashboard') setActiveView('dashboard');
                    if (link.label === 'All Jobs') setActiveView('jobs');
                    if (link.label === 'Post Job') {
                      setEditingJob(null);
                      setShowJobForm(true);
                    }
                    if (link.label === 'Applications') setActiveView('applications');
                    if (link.label === 'Logout') handleLogout();
                  }}
                />
              ))}
            </div>
          </div>
          <div>
            <SidebarLink
              link={{
                label: user?.name || 'Admin',
                href: '#',
                icon: (
                  <div className="h-7 w-7 shrink-0 rounded-full bg-[#1e7d6b] flex items-center justify-center text-white font-bold">
                    {user?.name?.charAt(0) || 'A'}
                  </div>
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        <div className="flex h-full w-full flex-1 flex-col gap-2 bg-[#eaf1ef] p-4 md:p-8 overflow-y-auto overflow-x-hidden">
          {/* Header */}
          <div className="bg-white rounded-2xl shadow border border-[#dbe7e3] p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-[#222]">Admin Dashboard</h1>
                <p className="text-[#666]">Welcome back, {user?.name}</p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <motion.div
              className="bg-white rounded-2xl shadow border border-[#dbe7e3] p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-3xl font-bold text-[#1e7d6b] mb-2">{jobs.length}</div>
              <div className="text-[#222] font-medium">Total Jobs Posted</div>
            </motion.div>
            <motion.div
              className="bg-white rounded-2xl shadow border border-[#dbe7e3] p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="text-3xl font-bold text-[#1e7d6b] mb-2">
                {jobs.reduce((sum, job) => sum + (job.applications_count || 0), 0)}
              </div>
              <div className="text-[#222] font-medium">Total Applications</div>
            </motion.div>
            <motion.div
              className="bg-white rounded-2xl shadow border border-[#dbe7e3] p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="text-3xl font-bold text-[#1e7d6b] mb-2">
                {jobs.filter((job) => new Date(job.deadline) > new Date()).length}
              </div>
              <div className="text-[#222] font-medium">Active Jobs</div>
            </motion.div>
          </div>

          {/* Job Form Modal */}
          {showJobForm && user && (
            <JobPostingForm
              job={editingJob}
              onSubmit={handleJobSubmit}
              onCancel={handleCancelForm}
              loading={formLoading}
              userId={user.id}
              collegeId={user.college_id}
            />
          )}

          {/* Jobs List */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h2 className="text-2xl font-bold text-[#222]">Posted Jobs</h2>
            {jobs.length === 0 ? (
              <div className="bg-white rounded-2xl shadow border border-[#dbe7e3] p-8 text-center">
                <div className="text-[#222] text-lg">No jobs posted yet</div>
                <button
                  onClick={() => setShowJobForm(true)}
                  className="mt-4 px-6 py-2 rounded-full bg-[#1e7d6b] text-white font-semibold hover:bg-[#1a6b5a] transition-colors"
                >
                  Post Your First Job
                </button>
              </div>
            ) : (
              <div className="grid gap-6">
                {jobs.map((job, index) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    onEdit={handleEditJob}
                    onDelete={handleDeleteJob}
                    onStatusChange={handleStatusChange}
                    onViewApplications={handleViewApplications}
                    loading={loading}
                  />
                ))}
              </div>
            )}
          </motion.div>

          {/* Job Applications Modal */}
          {selectedJobId && (
            <JobApplicationsList jobId={selectedJobId} onClose={() => setSelectedJobId(null)} />
          )}
        </div>
      </div>
    </div>
  );
}
