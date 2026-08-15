// app/page.tsx - Main landing page with CRM dashboard
'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';

interface Appointment {
  id: string;
  patientName: string;
  phoneNumber: string;
  patientType?: string;
  department?: string;
  preferredDate: string;
  preferredTime: string;
  symptoms: string;
  hasInsurance?: string;
  status: 'confirmed' | 'cancelled' | 'completed' | 'pending';
  createdAt: string;
  updatedAt: string;
}

interface DashboardStats {
  totalAppointments: number;
  todayAppointments: number;
  newPatients: number;
  returningPatients: number;
  appointmentsByDepartment: Record<string, number>;
  recentAppointments: Appointment[];
}

export default function Home() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'appointments'>('dashboard');

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
      setError(null);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      confirmed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      completed: 'bg-blue-100 text-blue-800',
      pending: 'bg-yellow-100 text-yellow-800',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#f3f4f6',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏥</div>
            <p style={{ color: '#6b7280' }}>Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#f3f4f6',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          maxWidth: '500px',
          width: '100%'
        }}>
          <div style={{ color: '#ef4444', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
            <p style={{ marginBottom: '1rem' }}>{error}</p>
            <button
              onClick={fetchDashboardData}
              style={{
                backgroundColor: '#3b82f6',
                color: 'white',
                padding: '0.5rem 1.5rem',
                borderRadius: '4px',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f3f4f6',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Navigation */}
      <nav style={{
        backgroundColor: 'white',
        borderBottom: '1px solid #e5e7eb',
        padding: '0 1rem'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '64px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#111827' }}>
              🏥 Clinic CRM
            </h1>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              onClick={() => setActiveTab('dashboard')}
              style={{
                padding: '0.5rem 1rem',
                border: 'none',
                background: 'transparent',
                color: activeTab === 'dashboard' ? '#2563eb' : '#6b7280',
                borderBottom: activeTab === 'dashboard' ? '2px solid #2563eb' : '2px solid transparent',
                cursor: 'pointer',
                fontWeight: activeTab === 'dashboard' ? '600' : '400'
              }}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('appointments')}
              style={{
                padding: '0.5rem 1rem',
                border: 'none',
                background: 'transparent',
                color: activeTab === 'appointments' ? '#2563eb' : '#6b7280',
                borderBottom: activeTab === 'appointments' ? '2px solid #2563eb' : '2px solid transparent',
                cursor: 'pointer',
                fontWeight: activeTab === 'appointments' ? '600' : '400'
              }}
            >
              Appointments
            </button>
          </div>
          <button
            onClick={fetchDashboardData}
            style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Refresh
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.5rem' }}>
        {activeTab === 'dashboard' ? (
          // Dashboard View
          <div>
            {/* Stats Cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
              marginBottom: '2rem'
            }}>
              <div style={{
                backgroundColor: 'white',
                padding: '1.5rem',
                borderRadius: '8px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Total Appointments</p>
                    <p style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#111827' }}>
                      {stats?.totalAppointments || 0}
                    </p>
                  </div>
                  <div style={{ fontSize: '2rem' }}>📋</div>
                </div>
              </div>

              <div style={{
                backgroundColor: 'white',
                padding: '1.5rem',
                borderRadius: '8px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Today's Appointments</p>
                    <p style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#111827' }}>
                      {stats?.todayAppointments || 0}
                    </p>
                  </div>
                  <div style={{ fontSize: '2rem' }}>📅</div>
                </div>
              </div>

              <div style={{
                backgroundColor: 'white',
                padding: '1.5rem',
                borderRadius: '8px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>New Patients</p>
                    <p style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#111827' }}>
                      {stats?.newPatients || 0}
                    </p>
                  </div>
                  <div style={{ fontSize: '2rem' }}>🆕</div>
                </div>
              </div>

              <div style={{
                backgroundColor: 'white',
                padding: '1.5rem',
                borderRadius: '8px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Returning Patients</p>
                    <p style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#111827' }}>
                      {stats?.returningPatients || 0}
                    </p>
                  </div>
                  <div style={{ fontSize: '2rem' }}>🔄</div>
                </div>
              </div>
            </div>

            {/* Department Breakdown */}
            {stats?.appointmentsByDepartment && Object.keys(stats.appointmentsByDepartment).length > 0 && (
              <div style={{
                backgroundColor: 'white',
                padding: '1.5rem',
                borderRadius: '8px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                marginBottom: '2rem'
              }}>
                <h2 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', color: '#111827' }}>
                  Appointments by Department
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.75rem' }}>
                  {Object.entries(stats.appointmentsByDepartment).map(([dept, count]) => (
                    <div key={dept} style={{
                      backgroundColor: '#f3f4f6',
                      padding: '0.75rem',
                      borderRadius: '4px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <span style={{ fontSize: '0.875rem', color: '#374151' }}>{dept}</span>
                      <span style={{
                        backgroundColor: '#2563eb',
                        color: 'white',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: '600'
                      }}>
                        {count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Appointments */}
            <div style={{
              backgroundColor: 'white',
              padding: '1.5rem',
              borderRadius: '8px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <h2 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', color: '#111827' }}>
                Recent Appointments
              </h2>
              {appointments.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#6b7280', padding: '2rem' }}>
                  No appointments yet. Send a message to the WhatsApp bot!
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f9fafb' }}>
                        <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase' }}>Patient</th>
                        <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase' }}>Department</th>
                        <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase' }}>Date</th>
                        <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase' }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {appointments.slice(0, 10).map((app) => (
                        <tr key={app.id} style={{ borderTop: '1px solid #e5e7eb' }}>
                          <td style={{ padding: '0.75rem', whiteSpace: 'nowrap' }}>
                            <div style={{ fontWeight: '500', color: '#111827' }}>{app.patientName || 'Unknown'}</div>
                            <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{app.phoneNumber}</div>
                          </td>
                          <td style={{ padding: '0.75rem', fontSize: '0.875rem', color: '#374151' }}>
                            {app.department || 'N/A'}
                          </td>
                          <td style={{ padding: '0.75rem', fontSize: '0.875rem', color: '#374151' }}>
                            {formatDate(app.preferredDate)}
                          </td>
                          <td style={{ padding: '0.75rem' }}>
                            <span style={{
                              padding: '0.25rem 0.75rem',
                              borderRadius: '9999px',
                              fontSize: '0.75rem',
                              fontWeight: '600',
                              backgroundColor: getStatusColor(app.status).split(' ')[0],
                              color: getStatusColor(app.status).split(' ')[1]?.replace('text-', '') || '#374151'
                            }}>
                              {getStatusLabel(app.status)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {appointments.length > 10 && (
                    <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                      <button
                        onClick={() => setActiveTab('appointments')}
                        style={{
                          color: '#2563eb',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '0.875rem'
                        }}
                      >
                        View all {appointments.length} appointments →
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          // Appointments View
          <div style={{
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827' }}>
                All Appointments
              </h2>
              <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                Total: {appointments.length}
              </span>
            </div>

            {appointments.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#6b7280', padding: '2rem' }}>
                No appointments yet.
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f9fafb' }}>
                      <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase' }}>Patient</th>
                      <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase' }}>Type</th>
                      <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase' }}>Department</th>
                      <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase' }}>Date & Time</th>
                      <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase' }}>Symptoms</th>
                      <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((app) => (
                      <tr key={app.id} style={{ borderTop: '1px solid #e5e7eb' }}>
                        <td style={{ padding: '0.75rem' }}>
                          <div style={{ fontWeight: '500', color: '#111827' }}>{app.patientName || 'Unknown'}</div>
                          <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{app.phoneNumber}</div>
                        </td>
                        <td style={{ padding: '0.75rem', fontSize: '0.875rem', color: '#374151' }}>
                          {app.patientType || 'N/A'}
                        </td>
                        <td style={{ padding: '0.75rem', fontSize: '0.875rem', color: '#374151' }}>
                          {app.department || 'N/A'}
                        </td>
                        <td style={{ padding: '0.75rem', fontSize: '0.875rem', color: '#374151' }}>
                          <div>{app.preferredDate || 'TBD'}</div>
                          <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{app.preferredTime || 'TBD'}</div>
                        </td>
                        <td style={{ padding: '0.75rem', fontSize: '0.875rem', color: '#374151', maxWidth: '200px', wordBreak: 'break-word' }}>
                          {app.symptoms || 'N/A'}
                        </td>
                        <td style={{ padding: '0.75rem' }}>
                          <span style={{
                            padding: '0.25rem 0.75rem',
                            borderRadius: '9999px',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            backgroundColor: getStatusColor(app.status).split(' ')[0],
                            color: getStatusColor(app.status).split(' ')[1]?.replace('text-', '') || '#374151'
                          }}>
                            {getStatusLabel(app.status)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}