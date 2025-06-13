'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface JobStatusToggleProps {
  status: 'active' | 'inactive';
  onChange: (status: 'active' | 'inactive') => void;
  disabled?: boolean;
}

export default function JobStatusToggle({
  status,
  onChange,
  disabled = false,
}: JobStatusToggleProps) {
  const [isChanging, setIsChanging] = useState(false);

  const handleToggle = async () => {
    if (disabled || isChanging) return;

    setIsChanging(true);
    try {
      const newStatus = status === 'active' ? 'inactive' : 'active';
      await onChange(newStatus);
    } catch (error) {
      console.error('Error changing job status:', error);
    } finally {
      setIsChanging(false);
    }
  };

  const isActive = status === 'active';

  return (
    <div className="flex items-center gap-3">
      <span className={`text-sm font-medium ${isActive ? 'text-[#1e7d6b]' : 'text-[#666]'}`}>
        {isActive ? 'Active' : 'Inactive'}
      </span>

      <button
        onClick={handleToggle}
        disabled={disabled || isChanging}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#1e7d6b] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
          isActive ? 'bg-[#1e7d6b]' : 'bg-gray-300'
        }`}
        aria-label={`Toggle job status. Currently ${status}`}
      >
        <motion.span
          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition-transform ${
            isActive ? 'translate-x-6' : 'translate-x-1'
          }`}
          animate={{ x: isActive ? 24 : 4 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />

        {/* Loading indicator */}
        {isChanging && (
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              className="h-3 w-3 animate-spin text-white"
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
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
        )}
      </button>

      {/* Status indicator with tooltip */}
      <div className="relative group">
        <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-500' : 'bg-gray-400'}`} />

        {/* Tooltip */}
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
          {isActive
            ? 'Job is visible to students and accepting applications'
            : 'Job is hidden from students and not accepting applications'}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-2 border-transparent border-t-gray-800" />
        </div>
      </div>
    </div>
  );
}
