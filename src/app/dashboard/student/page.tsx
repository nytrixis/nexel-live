'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { Sidebar, SidebarBody, SidebarLink } from '@/components/ui/sidebar';
import {
  IconBriefcase,
  IconSearch,
  IconHistory,
  IconLogout,
  IconDashboard,
} from '@tabler/icons-react';
import { cn } from '@/lib/utils';

interface Job {
  id: string;
  title: string;
  description: string;
  location: string;
  deadline: string;
  created_at: string;
  has_applied?: boolean;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  college_id: string;
}

export default function StudentDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeView, setActiveView] = useState('dashboard');
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (user) {
      fetchJobs();
      fetchAppliedJobs();
    }
  }, [user]);

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

    if (!userData || userData.role !== 'student') {
      router.push('/auth?tab=login');
      return;
    }

    setUser(userData);
    setLoading(false);
  };

  const fetchJobs = async () => {
    if (!user?.college_id) return;

    const { data: jobsData } = await supabase
      .from('jobs')
      .select('*')
      .eq('college_id', user.college_id)
      .order('created_at', { ascending: false });

    if (jobsData) {
      setJobs(jobsData);
    }
  };

  const fetchAppliedJobs = async () => {
    if (!user?.id) return;

    const { data: applications } = await supabase
      .from('job_applications')
      .select('job_id')
      .eq('student_id', user.id);

    if (applications) {
      setAppliedJobs(applications.map((app) => app.job_id));
    }
  };

  const handleApply = async (jobId: string) => {
    if (!user?.id) return;

    const { error } = await supabase.from('job_applications').insert([
      {
        job_id: jobId,
        student_id: user.id,
      },
    ]);

    if (!error) {
      setAppliedJobs([...appliedJobs, jobId]);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const activeJobs = filteredJobs.filter((job) => new Date(job.deadline) > new Date());
  const expiredJobs = filteredJobs.filter((job) => new Date(job.deadline) <= new Date());

  const links = [
    {
      label: 'Dashboard',
      href: '#',
      icon: <IconDashboard className="h-5 w-5 shrink-0 text-[#1e7d6b]" />,
    },
    {
      label: 'Browse Jobs',
      href: '#',
      icon: <IconBriefcase className="h-5 w-5 shrink-0 text-[#1e7d6b]" />,
    },
    {
      label: 'Search',
      href: '#',
      icon: <IconSearch className="h-5 w-5 shrink-0 text-[#1e7d6b]" />,
    },
    {
      label: 'My Applications',
      href: '#',
      icon: <IconHistory className="h-5 w-5 shrink-0 text-[#1e7d6b]" />,
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
    <div className={cn('flex w-full h-screen overflow-hidden bg-[#eaf1ef]')}>
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
                    if (link.label === 'Browse Jobs') setActiveView('jobs');
                    if (link.label === 'Search') setActiveView('search');
                    if (link.label === 'My Applications') setActiveView('applications');
                    if (link.label === 'Logout') handleLogout();
                  }}
                />
              ))}
            </div>
          </div>
          <div>
            <SidebarLink
              link={{
                label: user?.name || 'Student',
                href: '#',
                icon: (
                  <div className="h-7 w-7 shrink-0 rounded-full bg-[#1e7d6b] flex items-center justify-center text-white font-bold">
                    {user?.name?.charAt(0) || 'S'}
                  </div>
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        <div className="flex h-full w-full flex-1 flex-col gap-2 bg-[#eaf1ef] p-4 md:p-8 overflow-y-auto">
          {/* Header */}
          <div className="bg-white rounded-2xl shadow border border-[#dbe7e3] p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-[#222]">Student Dashboard</h1>
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
              <div className="text-3xl font-bold text-[#1e7d6b] mb-2">{activeJobs.length}</div>
              <div className="text-[#222] font-medium">Available Jobs</div>
            </motion.div>
            <motion.div
              className="bg-white rounded-2xl shadow border border-[#dbe7e3] p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="text-3xl font-bold text-[#1e7d6b] mb-2">{appliedJobs.length}</div>
              <div className="text-[#222] font-medium">Applications Sent</div>
            </motion.div>
            <motion.div
              className="bg-white rounded-2xl shadow border border-[#dbe7e3] p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="text-3xl font-bold text-[#1e7d6b] mb-2">{jobs.length}</div>
              <div className="text-[#222] font-medium">Total Jobs</div>
            </motion.div>
          </div>

          {/* Search Bar */}
          {(activeView === 'search' || activeView === 'jobs' || activeView === 'dashboard') && (
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="bg-white rounded-2xl shadow border border-[#dbe7e3] p-6">
                <div className="flex items-center bg-[#eaf1ef] rounded-full px-6 py-3">
                  <IconSearch className="w-5 h-5 text-[#b7c7c2] mr-3" />
                  <input
                    type="text"
                    placeholder="Search jobs by title, description, or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-transparent outline-none border-none w-full text-[#222] text-lg"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Content based on active view */}
          {activeView === 'applications' ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h2 className="text-2xl font-bold text-[#222] mb-6">My Applications</h2>
              {appliedJobs.length === 0 ? (
                <div className="bg-white rounded-2xl shadow border border-[#dbe7e3] p-8 text-center">
                  <div className="text-[#222] text-lg">No applications yet</div>
                  <p className="text-[#666] mt-2">Start applying to jobs to see them here</p>
                </div>
              ) : (
                <div className="grid gap-6">
                  {jobs
                    .filter((job) => appliedJobs.includes(job.id))
                    .map((job, index) => (
                      <motion.div
                        key={job.id}
                        className="bg-white rounded-2xl shadow border border-[#dbe7e3] p-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-[#222] mb-2">{job.title}</h3>
                            <p className="text-[#222] mb-4 line-clamp-3">{job.description}</p>
                            <div className="flex gap-4 text-sm text-[#1e7d6b] mb-4">
                              <span>📍 {job.location}</span>
                              <span>
                                📅 Deadline: {new Date(job.deadline).toLocaleDateString()}
                              </span>
                              <span>
                                🕒 Applied: {new Date(job.created_at).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <div className="ml-6">
                            <div className="px-6 py-3 rounded-full bg-green-100 text-green-800 font-semibold">
                              Applied ✓
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                </div>
              )}
            </motion.div>
          ) : (
            <>
              {/* Active Jobs */}
              <motion.div
                className="mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <h2 className="text-2xl font-bold text-[#222] mb-6">Available Jobs</h2>
                {activeJobs.length === 0 ? (
                  <div className="bg-white rounded-2xl shadow border border-[#dbe7e3] p-8 text-center">
                    <div className="text-[#222] text-lg">No active jobs available</div>
                    <p className="text-[#666] mt-2">Check back later for new opportunities</p>
                  </div>
                ) : (
                  <div className="grid gap-6">
                    {activeJobs.map((job, index) => (
                      <motion.div
                        key={job.id}
                        className="bg-white rounded-2xl shadow border border-[#dbe7e3] p-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-[#222] mb-2">{job.title}</h3>
                            <p className="text-[#222] mb-4 line-clamp-3">{job.description}</p>
                            <div className="flex gap-4 text-sm text-[#1e7d6b] mb-4">
                              <span>📍 {job.location}</span>
                              <span>
                                📅 Deadline: {new Date(job.deadline).toLocaleDateString()}
                              </span>
                              <span>
                                🕒 Posted: {new Date(job.created_at).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <div className="ml-6">
                            {appliedJobs.includes(job.id) ? (
                              <div className="px-6 py-3 rounded-full bg-green-100 text-green-800 font-semibold">
                                Applied ✓
                              </div>
                            ) : (
                              <button
                                onClick={() => handleApply(job.id)}
                                className="px-6 py-3 rounded-full bg-[#1e7d6b] text-white font-semibold shadow hover:scale-105 transition-all duration-200"
                              >
                                Apply Now
                              </button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>

              {/* Expired Jobs */}
              {expiredJobs.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <h2 className="text-2xl font-bold text-[#222] mb-6">Expired Jobs</h2>
                  <div className="grid gap-6">
                    {expiredJobs.map((job, index) => (
                      <motion.div
                        key={job.id}
                        className="bg-white/50 rounded-2xl shadow border border-[#dbe7e3] p-6 opacity-60"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 0.6, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-[#222] mb-2">{job.title}</h3>
                            <p className="text-[#222] mb-4 line-clamp-3">{job.description}</p>
                            <div className="flex gap-4 text-sm text-[#666] mb-4">
                              <span>📍 {job.location}</span>
                              <span>
                                📅 Deadline: {new Date(job.deadline).toLocaleDateString()}
                              </span>
                              <span>
                                🕒 Posted: {new Date(job.created_at).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <div className="ml-6">
                            <div className="px-6 py-3 rounded-full bg-red-100 text-red-800 font-semibold">
                              Expired
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
