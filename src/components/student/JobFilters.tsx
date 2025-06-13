'use client';

import { motion } from 'framer-motion';

interface Filters {
  search: string;
  location: string;
  datePosted: string;
  sortBy: string;
}

interface JobFiltersProps {
  filters: Filters;
  onFilterChange: (filters: Partial<Filters>) => void;
}

export default function JobFilters({ filters, onFilterChange }: JobFiltersProps) {
  const clearFilters = () => {
    onFilterChange({
      search: '',
      location: '',
      datePosted: '',
      sortBy: 'newest',
    });
  };

  const hasActiveFilters = filters.location || filters.datePosted || filters.sortBy !== 'newest';

  return (
    <motion.div
      className="bg-white rounded-2xl shadow border border-[#dbe7e3] p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-[#222]">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-[#1e7d6b] text-sm font-medium hover:underline"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Location Filter */}
        <div>
          <label className="block text-sm font-medium text-[#666] mb-2">Location</label>
          <input
            type="text"
            placeholder="Enter location..."
            value={filters.location}
            onChange={(e) => onFilterChange({ location: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-[#dbe7e3] focus:outline-none focus:border-[#1e7d6b] text-sm"
          />
        </div>

        {/* Date Posted Filter */}
        <div>
          <label className="block text-sm font-medium text-[#666] mb-2">Date Posted</label>
          <select
            value={filters.datePosted}
            onChange={(e) => onFilterChange({ datePosted: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-[#dbe7e3] focus:outline-none focus:border-[#1e7d6b] text-sm"
          >
            <option value="">Any time</option>
            <option value="today">Today</option>
            <option value="week">Past week</option>
            <option value="month">Past month</option>
          </select>
        </div>

        {/* Sort By */}
        <div>
          <label className="block text-sm font-medium text-[#666] mb-2">Sort by</label>
          <select
            value={filters.sortBy}
            onChange={(e) => onFilterChange({ sortBy: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-[#dbe7e3] focus:outline-none focus:border-[#1e7d6b] text-sm"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="deadline">Deadline (urgent first)</option>
            <option value="title">Title (A-Z)</option>
          </select>
        </div>

        {/* Quick Filters */}
        <div>
          <label className="block text-sm font-medium text-[#666] mb-2">Quick Filters</label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onFilterChange({ location: 'Remote' })}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                filters.location.toLowerCase().includes('remote')
                  ? 'bg-[#1e7d6b] text-white border-[#1e7d6b]'
                  : 'bg-white text-[#666] border-[#dbe7e3] hover:border-[#1e7d6b]'
              }`}
            >
              Remote
            </button>
            <button
              onClick={() => onFilterChange({ datePosted: 'week' })}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                filters.datePosted === 'week'
                  ? 'bg-[#1e7d6b] text-white border-[#1e7d6b]'
                  : 'bg-white text-[#666] border-[#dbe7e3] hover:border-[#1e7d6b]'
              }`}
            >
              This Week
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
