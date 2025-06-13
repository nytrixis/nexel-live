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
  IconUser,
} from '@tabler/icons-react';
import { cn } from '@/lib/utils';
import JobSearch from '@/components/student/JobSearch';
import ApplicationHistory from '@/components/student/ApplicationHistory';

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
  const [activeView, setActiveView] = useState('dashboard');
  const [open, setOpen] = useState(false);
  const [stats, setStats] = useState({
    totalApplications: 0,
    activeJobs: 0,
    recentApplications: 0,
  });
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (user) {
      fetchJobs();
      fetchAppliedJobs();
      fetchStats();
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
      .gte('deadline', new Date().toISOString().split('T')[0])
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

  const fetchStats = async () => {
    if (!user?.id || !user?.college_id) return;

    try {
      // Get total applications by this student
      const { data: applications } = await supabase
        .from('job_applications')
        .select('*')
        .eq('student_id', user.id);

      // Get active jobs in college
      const { data: activeJobsData } = await supabase
        .from('jobs')
        .select('id')
        .eq('college_id', user.college_id)
        .gte('deadline', new Date().toISOString().split('T')[0]);

      // Get recent applications (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const { data: recentApps } = await supabase
        .from('job_applications')
        .select('*')
        .eq('student_id', user.id)
        .gte('applied_at', sevenDaysAgo.toISOString());

      setStats({
        totalApplications: applications?.length || 0,
        activeJobs: activeJobsData?.length || 0,
        recentApplications: recentApps?.length || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleApply = async (jobId: string) => {
    if (!user?.id) return;

    try {
      const { error } = await supabase.from('job_applications').insert([
        {
          job_id: jobId,
          student_id: user.id,
        },
      ]);

      if (!error) {
        setAppliedJobs([...appliedJobs, jobId]);
        fetchStats(); // Refresh stats
      } else {
        alert('Failed to apply for job. Please try again.');
      }
    } catch (error) {
      console.error('Error applying for job:', error);
      alert('Failed to apply for job. Please try again.');
    }
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
      label: 'Browse Jobs',
      href: '#',
      icon: <IconBriefcase className="h-5 w-5 shrink-0 text-[#1e7d6b]" />,
    },
    {
      label: 'Search Jobs',
      href: '#',
      icon: <IconSearch className="h-5 w-5 shrink-0 text-[#1e7d6b]" />,
    },
    {
      label: 'My Applications',
      href: '#',
      icon: <IconHistory className="h-5 w-5 shrink-0 text-[#1e7d6b]" />,
    },
    {
      label: 'Profile',
      href: '#',
      icon: <IconUser className="h-5 w-5 shrink-0 text-[#1e7d6b]" />,
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
                    if (link.label === 'Browse Jobs') setActiveView('browse');
                    if (link.label === 'Search Jobs') setActiveView('search');
                    if (link.label === 'My Applications') setActiveView('applications');
                    if (link.label === 'Profile') setActiveView('profile');
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

          {/* Stats Cards - Show on Dashboard and Browse */}
          {(activeView === 'dashboard' || activeView === 'browse') && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <motion.div
                className="bg-white rounded-2xl shadow border border-[#dbe7e3] p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="text-3xl font-bold text-[#1e7d6b] mb-2">{stats.activeJobs}</div>
                <div className="text-[#222] font-medium">Available Jobs</div>
              </motion.div>
              <motion.div
                className="bg-white rounded-2xl shadow border border-[#dbe7e3] p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className="text-3xl font-bold text-[#1e7d6b] mb-2">
                  {stats.totalApplications}
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
                  {stats.recentApplications}
                </div>
                <div className="text-[#222] font-medium">Recent Applications</div>
              </motion.div>
            </div>
          )}

          {/* Content based on active view */}
          {(activeView === 'dashboard' || activeView === 'browse') && (
            <JobSearch
              jobs={jobs}
              appliedJobs={appliedJobs}
              onApply={handleApply}
              loading={loading}
            />
          )}

          {activeView === 'search' && (
            <JobSearch
              jobs={jobs}
              appliedJobs={appliedJobs}
              onApply={handleApply}
              loading={loading}
              showFilters={true}
            />
          )}

          {activeView === 'applications' && user && <ApplicationHistory userId={user.id} />}

          {activeView === 'profile' && (
            <motion.div
              className="bg-white rounded-2xl shadow border border-[#dbe7e3] p-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl font-bold text-[#222] mb-4">Profile</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#666] mb-1">Name</label>
                  <div className="text-[#222] font-medium">{user?.name}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#666] mb-1">Email</label>
                  <div className="text-[#222] font-medium">{user?.email}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#666] mb-1">Role</label>
                  <div className="text-[#222] font-medium capitalize">{user?.role}</div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
