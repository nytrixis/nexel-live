'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Job {
  id?: string;
  title: string;
  description: string;
  location: string;
  deadline: string;
  college_id: string;
  posted_by: string;
}

interface JobPostingFormProps {
  job?: Job | null;
  onSubmit: (jobData: Omit<Job, 'id'>) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
  userId: string;
  collegeId: string;
}

export default function JobPostingForm({
  job,
  onSubmit,
  onCancel,
  loading = false,
  userId,
  collegeId,
}: JobPostingFormProps) {
  const [formData, setFormData] = useState<Omit<Job, 'id'>>({
    title: '',
    description: '',
    location: '',
    deadline: '',
    college_id: collegeId,
    posted_by: userId,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (job) {
      setFormData({
        title: job.title,
        description: job.description,
        location: job.location,
        deadline: job.deadline,
        college_id: job.college_id,
        posted_by: job.posted_by,
      });
    }
  }, [job]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Job title is required';
    } else if (formData.title.length < 3) {
      newErrors.title = 'Job title must be at least 3 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Job description is required';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Job description must be at least 10 characters';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    if (!formData.deadline) {
      newErrors.deadline = 'Deadline is required';
    } else {
      const deadlineDate = new Date(formData.deadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (deadlineDate <= today) {
        newErrors.deadline = 'Deadline must be in the future';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Get minimum date (tomorrow)
  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-lg border border-[#dbe7e3] p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#222]">{job ? 'Edit Job' : 'Post New Job'}</h2>
        <button
          onClick={onCancel}
          className="text-[#666] hover:text-[#222] transition-colors p-2"
          disabled={loading}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Job Title */}
        <div>
          <label htmlFor="title" className="block text-[#222] font-medium mb-2">
            Job Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 rounded-xl border ${
              errors.title ? 'border-red-500' : 'border-[#dbe7e3]'
            } focus:outline-none focus:border-[#1e7d6b] transition-colors`}
            placeholder="e.g. Frontend Developer, Marketing Intern"
            disabled={loading}
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
        </div>

        {/* Job Description */}
        <div>
          <label htmlFor="description" className="block text-[#222] font-medium mb-2">
            Job Description *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={6}
            className={`w-full px-4 py-3 rounded-xl border ${
              errors.description ? 'border-red-500' : 'border-[#dbe7e3]'
            } focus:outline-none focus:border-[#1e7d6b] transition-colors resize-vertical`}
            placeholder="Describe the job responsibilities, requirements, and qualifications..."
            disabled={loading}
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          <p className="text-[#666] text-sm mt-1">{formData.description.length} characters</p>
        </div>

        {/* Location */}
        <div>
          <label htmlFor="location" className="block text-[#222] font-medium mb-2">
            Location *
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 rounded-xl border ${
              errors.location ? 'border-red-500' : 'border-[#dbe7e3]'
            } focus:outline-none focus:border-[#1e7d6b] transition-colors`}
            placeholder="e.g. New York, NY / Remote / Hybrid"
            disabled={loading}
          />
          {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
        </div>

        {/* Deadline */}
        <div>
          <label htmlFor="deadline" className="block text-[#222] font-medium mb-2">
            Application Deadline *
          </label>
          <input
            type="date"
            id="deadline"
            name="deadline"
            value={formData.deadline}
            onChange={handleInputChange}
            min={getMinDate()}
            className={`w-full px-4 py-3 rounded-xl border ${
              errors.deadline ? 'border-red-500' : 'border-[#dbe7e3]'
            } focus:outline-none focus:border-[#1e7d6b] transition-colors`}
            disabled={loading}
          />
          {errors.deadline && <p className="text-red-500 text-sm mt-1">{errors.deadline}</p>}
        </div>

        {/* Form Actions */}
        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-6 py-3 rounded-full border border-[#dbe7e3] text-[#666] font-semibold hover:bg-[#f5f5f5] transition-colors disabled:opacity-50"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 px-6 py-3 rounded-full bg-[#1e7d6b] text-white font-semibold hover:bg-[#1a6b5a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                {job ? 'Updating...' : 'Posting...'}
              </>
            ) : job ? (
              'Update Job'
            ) : (
              'Post Job'
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
}
