'use client';

import { motion } from 'framer-motion';
import { formatToIST } from '@/utils/date';

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

interface ApplicationCardProps {
  application: JobApplication;
  index: number;
}

export default function ApplicationCard({ application, index }: ApplicationCardProps) {
  const { job } = application;

  const formatDate = (dateString: string) => {
    return formatToIST(dateString, { dateStyle: 'medium' });
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
    const date = new Date(
      new Date(dateString).toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }),
    );
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30)
      return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`;
    return formatDate(dateString);
  };

  const getISTDate = (dateString: string) =>
    new Date(new Date(dateString).toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
  const nowIST = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));

  const isExpired = getISTDate(job.deadline) <= nowIST;
  const getDaysUntilDeadline = () => {
    const deadline = getISTDate(job.deadline);
    const today = nowIST;
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  const daysLeft = getDaysUntilDeadline();

  return (
    <motion.div
      className={`bg-white rounded-2xl shadow border border-[#dbe7e3] p-6 ${
        isExpired ? 'opacity-75' : ''
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isExpired ? 0.75 : 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-[#222] mb-2">{job.title}</h3>
          <div className="flex items-center gap-4 text-sm text-[#666] mb-3">
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
              {job.location}
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
              Applied {getTimeAgo(application.applied_at)}
            </span>
          </div>
        </div>

        {/* Status Badge */}
        {isExpired ? (
          <div className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            Expired
          </div>
        ) : (
          <div className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Applied ✓
          </div>
        )}
      </div>

      {/* Description */}
      <p className="text-[#222] mb-4 line-clamp-2">{job.description}</p>

      {/* Application Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="p-3 bg-[#eaf1ef] rounded-xl">
          <div className="flex items-center gap-2 mb-1">
            <svg
              className="w-4 h-4 text-[#1e7d6b]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a1 1 0 011 1v9a1 1 0 01-1 1H5a1 1 0 01-1-1V8a1 1 0 011-1h3z"
              />
            </svg>
            <span className="text-sm font-medium text-[#222]">Application Date</span>
          </div>
          <div className="text-sm text-[#666]">{formatDate(application.applied_at)}</div>
        </div>

        <div className="p-3 bg-[#eaf1ef] rounded-xl">
          <div className="flex items-center gap-2 mb-1">
            <svg
              className="w-4 h-4 text-[#1e7d6b]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-sm font-medium text-[#222]">Deadline</span>
          </div>
          <div
            className={`text-sm ${
              isExpired ? 'text-red-600' : daysLeft <= 3 ? 'text-orange-600' : 'text-[#666]'
            }`}
          >
            {formatDate(job.deadline)}
            {!isExpired && (
              <span className="ml-2">
                (
                {daysLeft === 0 ? 'Today' : daysLeft === 1 ? '1 day left' : `${daysLeft} days left`}
                )
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Application Status Timeline */}
      <div className="border-t border-[#dbe7e3] pt-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-sm text-[#222] font-medium">Application Submitted</span>
          </div>
          <div className="flex-1 h-px bg-[#dbe7e3]"></div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-300"></div>
            <span className="text-sm text-[#666]">Under Review</span>
          </div>
        </div>
        <div className="mt-2 text-xs text-[#666]">
          Application ID: {application.id.slice(0, 8)}...
        </div>
      </div>
    </motion.div>
  );
}
