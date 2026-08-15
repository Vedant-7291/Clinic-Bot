// app/dashboard/page.tsx
'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import StatsCards from './components/StatsCards';
import AppointmentsTable from './components/AppointmentsTable';
import AppointmentModal from './components/AppointmentModal';
import Filters from './components/Filters';
import ExportButton from './components/ExportButton';
import { DashboardStats, Appointment } from '../../lib/types';

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    department: 'all',
    search: '',
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, appointmentsRes] = await Promise.all([
        axios.get('/api/dashboard/stats'),
        axios.get('/api/dashboard/appointments'),
      ]);
      setStats(statsRes.data);
      setAppointments(appointmentsRes.data);
      setFilteredAppointments(appointmentsRes.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...appointments];
    
    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter(a => a.status === filters.status);
    }
    
    if (filters.department && filters.department !== 'all') {
      filtered = filtered.filter(a => a.department === filters.department);
    }
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(a =>
        a.patientName?.toLowerCase().includes(searchLower) ||
        a.phoneNumber.includes(filters.search) ||
        a.department?.toLowerCase().includes(searchLower)
      );
    }
    
    setFilteredAppointments(filtered);
  };

  useEffect(() => {
    applyFilters();
  }, [filters, appointments]);

  const handleUpdateAppointment = async (id: string, updates: Partial<Appointment>) => {
    try {
      await axios.put('/api/dashboard/appointments', { id, ...updates });
      await fetchDashboardData();
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error updating appointment:', err);
      alert('Failed to update appointment');
    }
  };

  const handleDeleteAppointment = async (id: string) => {
    if (!confirm('Are you sure you want to delete this appointment?')) return;
    
    try {
      await axios.delete(`/api/dashboard/appointments?id=${id}`);
      await fetchDashboardData();
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error deleting appointment:', err);
      alert('Failed to delete appointment');
    }
  };

  const handleExport = () => {
    // Export current filtered appointments as CSV
    const headers = ['Patient Name', 'Phone', 'Department', 'Date', 'Time', 'Status', 'Created At'];
    const rows = filteredAppointments.map(a => [
      a.patientName || '',
      a.phoneNumber,
      a.department || '',
      a.preferredDate || '',
      a.preferredTime || '',
      a.status,
      new Date(a.createdAt).toLocaleString(),
    ]);

    const csv = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `appointments_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        {error}
        <button
          onClick={fetchDashboardData}
          className="ml-4 underline hover:text-red-900"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <div className="flex space-x-2">
          <ExportButton onExport={handleExport} />
          <button
            onClick={fetchDashboardData}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      <StatsCards stats={stats} />

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b border-gray-200">
          <Filters filters={filters} setFilters={setFilters} />
        </div>
        <div className="p-4">
          <AppointmentsTable
            appointments={filteredAppointments}
            onViewAppointment={(app) => {
              setSelectedAppointment(app);
              setIsModalOpen(true);
            }}
          />
        </div>
      </div>

      <AppointmentModal
        isOpen={isModalOpen}
        appointment={selectedAppointment}
        onClose={() => setIsModalOpen(false)}
        onUpdate={handleUpdateAppointment}
        onDelete={handleDeleteAppointment}
      />
    </div>
  );
}