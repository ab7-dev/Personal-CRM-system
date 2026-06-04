'use client';

import React from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { ContactStatus } from '@/types';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  onSearchChange: (query: string) => void;
  onStatusFilterChange: (status: ContactStatus | 'all') => void;
  currentStatus: ContactStatus | 'all';
}

export default function SearchBar({ onSearchChange, onStatusFilterChange, currentStatus }: SearchBarProps) {
  const [query, setQuery] = React.useState('');

  const filterOptions: { label: string; value: ContactStatus | 'all' }[] = [
    { label: 'All Contacts', value: 'all' },
    { label: 'Leads', value: 'lead' },
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
  ];

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    onSearchChange(val);
  };

  const clearQuery = () => {
    setQuery('');
    onSearchChange('');
  };

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between w-full">
      {/* Search Input Box */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input 
          type="text" 
          value={query}
          onChange={handleQueryChange}
          placeholder="Search name, company, email, role..." 
          className="w-full pl-9 pr-9 py-2 text-sm bg-white border border-slate-200 rounded-lg placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-purple-600 focus:border-purple-600 shadow-sm"
        />
        {query && (
          <button 
            onClick={clearQuery}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Filter Tabs / Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
        <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400 mr-1.5 shrink-0 hidden sm:inline" />
        {filterOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onStatusFilterChange(opt.value)}
            className={cn(
              "px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all shrink-0",
              currentStatus === opt.value
                ? "bg-purple-50 text-purple-700 border-purple-200"
                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900"
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
