'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
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

interface ApplicantCardProps {
  application: Application;
  index: number;
}

export default function ApplicantCard({ application, index }: ApplicantCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  const formatDate = (dateString: string) => {
    // Convert both dates to IST
    const date = new Date(
      new Date(dateString).toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }),
    );
    const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));

    // Compare calendar days in IST
    const dateDay = date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate();
    const nowDay = now.getFullYear() + '-' + now.getMonth() + '-' + now.getDate();

    if (dateDay === nowDay) return 'Today';

    // Calculate difference in days
    const diffTime = now.setHours(0, 0, 0, 0) - date.setHours(0, 0, 0, 0);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return formatToIST(dateString, { dateStyle: 'medium' });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvatarColor = (name: string) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-yellow-500',
      'bg-red-500',
      'bg-teal-500',
    ];
    const index = name.length % colors.length;
    return colors[index];
  };

  return (
    <motion.div
      className="bg-white rounded-xl border border-[#dbe7e3] p-4 hover:shadow-md transition-shadow"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div
            className={`w-12 h-12 rounded-full ${getAvatarColor(application.student.name)} flex items-center justify-center text-white font-bold`}
          >
            {getInitials(application.student.name)}
          </div>

          {/* Student Info */}
          <div>
            <h4 className="font-semibold text-[#222] text-lg">{application.student.name}</h4>
            <p className="text-[#666] text-sm">{application.student.email}</p>
            <p className="text-[#1e7d6b] text-xs font-medium">
              Applied {formatDate(application.applied_at)}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="px-4 py-2 rounded-full border border-[#1e7d6b] text-[#1e7d6b] font-medium hover:bg-[#1e7d6b]/10 transition-colors text-sm"
          >
            {showDetails ? 'Hide Details' : 'View Details'}
          </button>

          {/* Contact Button */}
          <a
            href={`mailto:${application.student.email}?subject=Regarding Your Job Application`}
            className="px-4 py-2 rounded-full bg-[#1e7d6b] text-white font-medium hover:bg-[#1a6b5a] transition-colors text-sm flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            Contact
          </a>
        </div>
      </div>

      {/* Expanded Details */}
      {showDetails && (
        <motion.div
          className="mt-4 pt-4 border-t border-[#dbe7e3]"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Application Details */}
            <div className="space-y-3">
              <h5 className="font-semibold text-[#222] text-sm">Application Details</h5>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#666]">Application ID:</span>
                  <span className="text-[#222] font-mono text-xs">
                    {application.id.slice(0, 8)}...
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-[#666]">Applied On:</span>
                  <span className="text-[#222]">
                    {formatToIST(application.applied_at, {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-[#666]">Student ID:</span>
                  <span className="text-[#222] font-mono text-xs">
                    {application.student.id.slice(0, 8)}...
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-3">
              <h5 className="font-semibold text-[#222] text-sm">Quick Actions</h5>

              <div className="space-y-2">
                <button className="w-full px-3 py-2 rounded-lg border border-[#dbe7e3] text-[#222] text-sm hover:bg-[#eaf1ef] transition-colors flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    />
                  </svg>
                  Add Notes
                </button>

                <button className="w-full px-3 py-2 rounded-lg border border-[#dbe7e3] text-[#222] text-sm hover:bg-[#eaf1ef] transition-colors flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a1 1 0 011 1v9a1 1 0 01-1 1H5a1 1 0 01-1-1V8a1 1 0 011-1h3z"
                    />
                  </svg>
                  View Resume
                </button>

                <button className="w-full px-3 py-2 rounded-lg border border-green-300 text-green-700 text-sm hover:bg-green-50 transition-colors flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Mark as Reviewed
                </button>
              </div>
            </div>
          </div>

          {/* Application Timeline */}
          <div className="mt-4 pt-4 border-t border-[#dbe7e3]">
            <h5 className="font-semibold text-[#222] text-sm mb-3">Application Timeline</h5>
            <div className="space-y-2">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 rounded-full bg-[#1e7d6b]"></div>
                <span className="text-[#666]">
                  Application submitted on{' '}
                  {formatToIST(application.applied_at, { dateStyle: 'medium' })}
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                <span className="text-[#666]">Pending review</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
