'use client';

import { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  User, 
  Stethoscope,
  Search,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface Visit {
  id: string;
  patientName: string;
  doctorName: string;
  department: string;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'in-progress';
  type: 'in-person' | 'telehealth';
}

const visits: Visit[] = [
  {
    id: '1',
    patientName: 'Robert Anderson',
    doctorName: 'Dr. Sarah Johnson',
    department: 'Cardiology',
    date: '2026-08-20',
    time: '10:00 AM',
    status: 'scheduled',
    type: 'in-person',
  },
  {
    id: '2',
    patientName: 'Emma Wilson',
    doctorName: 'Dr. Emily Davis',
    department: 'Pediatrics',
    date: '2026-08-20',
    time: '11:30 AM',
    status: 'scheduled',
    type: 'telehealth',
  },
  {
    id: '3',
    patientName: 'James Thompson',
    doctorName: 'Dr. Michael Chen',
    department: 'Neurology',
    date: '2026-08-19',
    time: '2:00 PM',
    status: 'completed',
    type: 'in-person',
  },
  {
    id: '4',
    patientName: 'Olivia Martinez',
    doctorName: 'Dr. Maria Garcia',
    department: 'Cardiology',
    date: '2026-08-21',
    time: '9:30 AM',
    status: 'scheduled',
    type: 'in-person',
  },
  {
    id: '5',
    patientName: 'William Chen',
    doctorName: 'Dr. James Wilson',
    department: 'Orthopedics',
    date: '2026-08-18',
    time: '3:00 PM',
    status: 'cancelled',
    type: 'in-person',
  },
];

export default function VisitsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const getStatusColor = (status: Visit['status']) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-700';
      case 'completed': return 'bg-green-100 text-green-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      case 'in-progress': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: Visit['status']) => {
    switch (status) {
      case 'scheduled': return <Calendar size={14} />;
      case 'completed': return <Clock size={14} />;
      case 'cancelled': return <User size={14} />;
      case 'in-progress': return <Stethoscope size={14} />;
      default: return null;
    }
  };

  const filteredVisits = visits.filter(visit => {
    const matchesSearch = visit.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          visit.doctorName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || visit.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredVisits.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedVisits = filteredVisits.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-[#0A1628]">Scheduled Visits</h1>
          <p className="text-gray-500 text-sm mt-1">View and manage all scheduled appointments</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by patient or doctor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A3A5C] focus:border-transparent"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A3A5C] focus:border-transparent bg-white"
        >
          <option value="all">All Status</option>
          <option value="scheduled">Scheduled</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="space-y-4">
        {paginatedVisits.map((visit) => (
          <div key={visit.id} className="card p-6 hover:shadow-lg transition-shadow">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#0A1628] rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {visit.patientName.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="font-semibold text-[#0A1628]">{visit.patientName}</h3>
                  <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
                    <span>{visit.doctorName}</span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full" />
                    <span className="text-[#1A3A5C] font-medium">{visit.department}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar size={16} className="text-gray-400" />
                  <span>{visit.date}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock size={16} className="text-gray-400" />
                  <span>{visit.time}</span>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize flex items-center gap-1 ${getStatusColor(visit.status)}`}>
                  {getStatusIcon(visit.status)}
                  {visit.status}
                </span>
                <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                  visit.type === 'in-person' ? 'bg-gray-100 text-gray-700' : 'bg-blue-50 text-blue-600'
                }`}>
                  {visit.type === 'in-person' ? 'In Person' : 'Telehealth'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredVisits.length > itemsPerPage && (
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredVisits.length)} of {filteredVisits.length} visits
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  currentPage === i + 1
                    ? 'bg-[#0A1628] text-white'
                    : 'border border-gray-200 hover:bg-gray-50'
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}