// app/dashboard/components/Filters.tsx
'use client';

import { FilterOptions } from '../../../lib/types';

interface FiltersProps {
  filters: any;
  setFilters: (filters: any) => void;
}

const DEPARTMENTS = [
  'General Medicine',
  'Dental Care',
  'Pediatrics',
  'Cardiology',
  'Orthopedics',
  'Gynecology',
  'ENT',
  'Dermatology',
];

export default function Filters({ filters, setFilters }: FiltersProps) {
  return (
    <div className="flex flex-wrap gap-4 items-center">
      <div className="flex-1 min-w-[200px]">
        <input
          type="text"
          placeholder="Search by name, phone, or department..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="all">All Status</option>
          <option value="confirmed">Confirmed</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div>
        <select
          value={filters.department}
          onChange={(e) => setFilters({ ...filters, department: e.target.value })}
          className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="all">All Departments</option>
          {DEPARTMENTS.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={() => setFilters({ status: 'all', department: 'all', search: '' })}
        className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
      >
        Clear Filters
      </button>
    </div>
  );
}