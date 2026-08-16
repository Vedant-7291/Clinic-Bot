'use client';

import { 
  FileText, 
  Download, 
  Calendar,
  Filter,
  TrendingUp,
  Users,
  DollarSign
} from 'lucide-react';

const reports = [
  {
    id: '1',
    title: 'Monthly Revenue Report',
    description: 'Detailed breakdown of revenue by department',
    date: '2026-08-01',
    type: 'Financial',
    downloads: 45,
    size: '2.4 MB',
  },
  {
    id: '2',
    title: 'Patient Growth Analysis',
    description: 'Monthly patient acquisition and retention metrics',
    date: '2026-08-15',
    type: 'Analytics',
    downloads: 32,
    size: '1.8 MB',
  },
  {
    id: '3',
    title: 'Appointment Statistics',
    description: 'Appointment trends and cancellation rates',
    date: '2026-08-10',
    type: 'Analytics',
    downloads: 28,
    size: '3.1 MB',
  },
  {
    id: '4',
    title: 'Department Performance',
    description: 'Performance metrics by medical department',
    date: '2026-08-05',
    type: 'Performance',
    downloads: 19,
    size: '2.7 MB',
  },
];

const quickStats = [
  { label: 'Total Reports', value: 24, change: '+3' },
  { label: 'Downloads', value: 124, change: '+12%' },
  { label: 'Categories', value: 8, change: '+1' },
];

export default function ReportsPage() {
  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-[#0A1628]">Reports</h1>
          <p className="text-gray-500 text-sm mt-1">Generate and manage clinic reports</p>
        </div>
        <button className="mt-4 lg:mt-0 btn-accent flex items-center gap-2">
          <FileText size={18} />
          Generate Report
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {quickStats.map((stat) => (
          <div key={stat.label} className="card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold text-[#0A1628]">{stat.value}</p>
              </div>
              <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="card overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-gray-400" />
            <select className="px-3 py-1 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3A5C]">
              <option>All Types</option>
              <option>Financial</option>
              <option>Analytics</option>
              <option>Performance</option>
            </select>
            <div className="flex items-center gap-2">
              <Calendar size={18} className="text-gray-400" />
              <input
                type="date"
                className="px-3 py-1 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3A5C]"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="btn-secondary text-sm flex items-center gap-2">
              <Download size={16} />
              Export All
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="table-header">Report</th>
                <th className="table-header hidden md:table-cell">Type</th>
                <th className="table-header hidden lg:table-cell">Date</th>
                <th className="table-header hidden sm:table-cell">Downloads</th>
                <th className="table-header hidden lg:table-cell">Size</th>
                <th className="table-header text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50 transition-colors">
                  <td className="table-cell">
                    <div>
                      <p className="font-medium text-[#0A1628]">{report.title}</p>
                      <p className="text-xs text-gray-500">{report.description}</p>
                    </div>
                  </td>
                  <td className="table-cell hidden md:table-cell">
                    <span className="px-2 py-1 bg-[#0A1628] text-white text-xs rounded-lg">
                      {report.type}
                    </span>
                  </td>
                  <td className="table-cell hidden lg:table-cell">{report.date}</td>
                  <td className="table-cell hidden sm:table-cell">{report.downloads}</td>
                  <td className="table-cell hidden lg:table-cell">{report.size}</td>
                  <td className="table-cell text-center">
                    <button className="p-2 bg-[#1A3A5C] text-white rounded-lg hover:bg-[#2A5A8C] transition-colors inline-flex items-center gap-1">
                      <Download size={16} />
                      <span className="text-xs hidden sm:inline">Download</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}