'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import JobStatusToggle from './JobStatusToggle';
import { formatToIST } from '@/utils/date';

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

interface JobCardProps {
  job: Job;
  onEdit: (job: Job) => void;
  onDelete: (jobId: string) => void;
  onStatusChange: (jobId: string, status: 'active' | 'inactive') => void;
  onViewApplications: (jobId: string) => void;
  loading?: boolean;
}

export default function JobCard({
  job,
  onEdit,
  onDelete,
  onStatusChange,
  onViewApplications,
  loading = false,
}: JobCardProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const getISTDate = (dateString: string) =>
    new Date(new Date(dateString).toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
  const nowIST = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));

  const isExpired = getISTDate(job.deadline) < nowIST;
  const daysUntilDeadline = Math.ceil(
    (getISTDate(job.deadline).getTime() - nowIST.getTime()) / (1000 * 60 * 60 * 24),
  );

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(job.id);
    } catch (error) {
      console.error('Error deleting job:', error);
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const getStatusColor = () => {
    if (isExpired) return 'bg-gray-100 text-gray-800';
    if (job.status === 'inactive') return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  const getStatusText = () => {
    if (isExpired) return 'Expired';
    if (job.status === 'inactive') return 'Inactive';
    return 'Active';
  };

  return (
    <>
      <motion.div
        className="bg-white rounded-2xl shadow border border-[#dbe7e3] p-6 hover:shadow-lg transition-shadow"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
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
                Posted {formatToIST(job.created_at, { dateStyle: 'medium' })}
              </span>
            </div>
          </div>

          {/* Status Badge */}
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
            {getStatusText()}
          </div>
        </div>
        {/* Description */}
        <p className="text-[#222] mb-4 line-clamp-3">{job.description}</p>

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
            <span className="text-[#222] font-medium">
              Deadline: {formatToIST(job.deadline, { dateStyle: 'medium' })}
            </span>
          </div>
          <span
            className={`text-sm font-medium ${
              isExpired
                ? 'text-red-600'
                : daysUntilDeadline <= 3
                  ? 'text-orange-600'
                  : 'text-[#1e7d6b]'
            }`}
          >
            {isExpired ? 'Expired' : `${daysUntilDeadline} days left`}
          </span>
        </div>

        {/* Applications Count */}
        <div className="flex items-center justify-between mb-6">
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
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <span className="text-[#222] font-medium">
              {job.applications_count || 0} Applications
            </span>
          </div>

          {/* Status Toggle */}
          {!isExpired && (
            <JobStatusToggle
              status={job.status || 'active'}
              onChange={(status) => onStatusChange(job.id, status)}
              disabled={loading}
            />
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => onViewApplications(job.id)}
            className="flex-1 px-4 py-2 rounded-full border border-[#1e7d6b] text-[#1e7d6b] font-semibold hover:bg-[#1e7d6b]/10 transition-colors disabled:opacity-50"
            disabled={loading}
          >
            View Applications
          </button>

          <button
            onClick={() => onEdit(job)}
            className="px-4 py-2 rounded-full bg-[#1e7d6b] text-white font-semibold hover:bg-[#1a6b5a] transition-colors disabled:opacity-50"
            disabled={loading || isExpired}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>

          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="px-4 py-2 rounded-full bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors disabled:opacity-50"
            disabled={loading}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </motion.div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            className="bg-white rounded-2xl p-6 max-w-md w-full"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <div className="text-center">
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
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-[#222] mb-2">Delete Job</h3>
              <p className="text-[#666] mb-6">
                Are you sure you want to delete &quot;{job.title}&quot;? This action cannot be
                undone and will also delete all applications for this job.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-2 rounded-full border border-[#dbe7e3] text-[#666] font-semibold hover:bg-[#f5f5f5] transition-colors"
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 px-4 py-2 rounded-full bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center"
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                      Deleting...
                    </>
                  ) : (
                    'Delete'
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}
