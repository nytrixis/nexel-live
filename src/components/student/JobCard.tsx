'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { formatToIST } from '@/utils/date';

interface Job {
  id: string;
  title: string;
  description: string;
  location: string;
  deadline: string;
  created_at: string;
}

interface JobCardProps {
  job: Job;
  isApplied: boolean;
  onApply: () => void;
  index: number;
  isExpiredIST?: boolean;
}

export default function JobCard({ job, isApplied, onApply, index }: JobCardProps) {
  const [isApplying, setIsApplying] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

  const handleApply = async () => {
    if (isApplied || isExpiredIST || isApplying) return;

    setIsApplying(true);
    try {
      await onApply();
    } catch (error) {
      console.error('Error applying:', error);
    } finally {
      setIsApplying(false);
    }
  };

  const getISTDate = (dateString: string) =>
    new Date(new Date(dateString).toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
  const nowIST = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));

  const getDaysUntilDeadline = () => {
    const deadline = getISTDate(job.deadline);
    const today = nowIST;
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const formatDate = (dateString: string) => {
    return formatToIST(dateString, { dateStyle: 'medium' });
  };

  const isExpiredIST = getISTDate(job.deadline) < nowIST;

  const daysLeft = getDaysUntilDeadline();
  const isUrgent = daysLeft <= 3 && daysLeft > 0;

  return (
    <motion.div
      className={`bg-white rounded-2xl shadow border border-[#dbe7e3] p-6 hover:shadow-lg transition-shadow ${
        isExpiredIST ? 'opacity-60' : ''
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isExpiredIST ? 0.6 : 1, y: 0 }}
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
                  d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a1 1 0 011 1v9a1 1 0 01-1 1H5a1 1 0 01-1-1V8a1 1 0 011-1h3z"
                />
              </svg>
              Posted {formatDate(job.created_at)}
            </span>
          </div>
        </div>

        {/* Status Badge */}
        {isExpiredIST ? (
          <div className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            Expired
          </div>
        ) : isApplied ? (
          <div className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Applied ✓
          </div>
        ) : isUrgent ? (
          <div className="px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
            Urgent
          </div>
        ) : (
          <div className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            Open
          </div>
        )}
      </div>

      {/* Description */}
      <div className="mb-4">
        <p className={`text-[#222] ${showFullDescription ? '' : 'line-clamp-3'}`}>
          {job.description}
        </p>
        {job.description.length > 150 && (
          <button
            onClick={() => setShowFullDescription(!showFullDescription)}
            className="text-[#1e7d6b] text-sm font-medium mt-2 hover:underline"
          >
            {showFullDescription ? 'Show less' : 'Show more'}
          </button>
        )}
      </div>

      {/* Deadline Info */}
      <div className="flex items-center justify-between mb-4 p-3 bg-[#eaf1ef] rounded-xl">
        <div className="flex items-center gap-2">
          <svg
            className="w-5 h-5 text-[#1e7d6b]"
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
          <span className="text-[#222] font-medium">Deadline: {formatDate(job.deadline)}</span>
        </div>
        <span
          className={`text-sm font-medium ${
            isExpiredIST ? 'text-red-600' : isUrgent ? 'text-orange-600' : 'text-[#1e7d6b]'
          }`}
        >
          {isExpiredIST
            ? 'Expired'
            : daysLeft === 0
              ? 'Today'
              : daysLeft === 1
                ? '1 day left'
                : `${daysLeft} days left`}
        </span>
      </div>

      {/* Action Button */}
      <div className="flex justify-end">
        {isApplied ? (
          <div className="px-6 py-3 rounded-full bg-green-100 text-green-800 font-semibold flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            Applied
          </div>
        ) : isExpiredIST ? (
          <div className="px-6 py-3 rounded-full bg-gray-100 text-gray-600 font-semibold">
            Expired
          </div>
        ) : (
          <button
            onClick={handleApply}
            disabled={isApplying}
            className="px-6 py-3 rounded-full bg-[#1e7d6b] text-white font-semibold hover:bg-[#1a6b5a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isApplying ? (
              <>
                <svg
                  className="animate-spin h-4 w-4"
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
                Applying...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Apply Now
              </>
            )}
          </button>
        )}
      </div>
    </motion.div>
  );
}
