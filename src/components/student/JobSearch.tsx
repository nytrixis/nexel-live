'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import JobCard from './JobCard';
import JobFilters from './JobFilters';

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

interface JobSearchProps {
  jobs: Job[];
  appliedJobs: string[];
  onApply: (jobId: string) => void;
  loading: boolean;
  showFilters?: boolean;
}

interface Filters {
  search: string;
  location: string;
  datePosted: string;
  sortBy: string;
}

export default function JobSearch({
  jobs,
  appliedJobs,
  onApply,
  loading,
  showFilters = false,
}: JobSearchProps) {
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [filters, setFilters] = useState<Filters>({
    search: '',
    location: '',
    datePosted: '',
    sortBy: 'newest',
  });

  useEffect(() => {
    applyFilters();
  }, [jobs, filters]);

  const applyFilters = () => {
    let filtered = [...jobs];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(searchLower) ||
          job.description.toLowerCase().includes(searchLower),
      );
    }

    // Location filter
    if (filters.location) {
      filtered = filtered.filter((job) =>
        job.location.toLowerCase().includes(filters.location.toLowerCase()),
      );
    }

    // Date posted filter
    if (filters.datePosted) {
      const now = new Date();
      const filterDate = new Date();

      switch (filters.datePosted) {
        case 'today':
          filterDate.setDate(now.getDate() - 1);
          break;
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          break;
      }

      filtered = filtered.filter((job) => new Date(job.created_at) >= filterDate);
    }

    // Sort
    switch (filters.sortBy) {
      case 'newest':
        filtered.sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        );
        break;
      case 'oldest':
        filtered.sort(
          (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
        );
        break;
      case 'deadline':
        filtered.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
        break;
      case 'title':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }

    setFilteredJobs(filtered);
  };

  const handleFilterChange = (newFilters: Partial<Filters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const activeJobs = filteredJobs.filter((job) => new Date(job.deadline) > new Date());
  const expiredJobs = filteredJobs.filter((job) => new Date(job.deadline) <= new Date());

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <motion.div
        className="bg-white rounded-2xl shadow border border-[#dbe7e3] p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center bg-[#eaf1ef] rounded-full px-6 py-3">
          <svg
            className="w-5 h-5 text-[#b7c7c2] mr-3"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
            <line
              x1="21"
              y1="21"
              x2="16.65"
              y2="16.65"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          <input
            type="text"
            placeholder="Search jobs by title or description..."
            value={filters.search}
            onChange={(e) => handleFilterChange({ search: e.target.value })}
            className="bg-transparent outline-none border-none w-full text-[#222] text-lg"
          />
        </div>
      </motion.div>

      {/* Filters */}
      {showFilters && <JobFilters filters={filters} onFilterChange={handleFilterChange} />}

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#222]">
          {showFilters ? 'Search Results' : 'Available Jobs'}
        </h2>
        <div className="text-[#666]">
          {activeJobs.length} active job{activeJobs.length !== 1 ? 's' : ''} found
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-[#1e7d6b] text-lg">Loading jobs...</div>
        </div>
      ) : (
        <>
          {/* Active Jobs */}
          {activeJobs.length === 0 ? (
            <motion.div
              className="bg-white rounded-2xl shadow border border-[#dbe7e3] p-8 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-[#222] text-lg mb-2">No jobs found</div>
              <p className="text-[#666]">
                {filters.search || filters.location
                  ? 'Try adjusting your search criteria'
                  : 'Check back later for new opportunities'}
              </p>
            </motion.div>
          ) : (
            <div className="grid gap-6">
              {activeJobs.map((job, index) => (
                <JobCard
                  key={job.id}
                  job={job}
                  isApplied={appliedJobs.includes(job.id)}
                  onApply={() => onApply(job.id)}
                  index={index}
                />
              ))}
            </div>
          )}

          {/* Expired Jobs */}
          {expiredJobs.length > 0 && (
            <div className="mt-12">
              <h3 className="text-xl font-bold text-[#666] mb-6">Expired Jobs</h3>
              <div className="grid gap-6">
                {expiredJobs.map((job, index) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    isApplied={appliedJobs.includes(job.id)}
                    onApply={() => onApply(job.id)}
                    index={index}
                    isExpired={true}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
