// app/page.tsx - Simple version without Tailwind
'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

interface Appointment {
  patientName: string;
  phoneNumber: string;
  preferredDate: string;
  preferredTime: string;
  symptoms: string;
  createdAt: string;
}

export default function Home() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await axios.get('/api/appointments');
      setAppointments(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setError('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      backgroundColor: '#f3f4f6',
      padding: '2rem',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        padding: '2rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold' }}>🏥 Clinic Dashboard</h1>
          <button
            onClick={fetchAppointments}
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

        {loading && (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            Loading appointments...
          </div>
        )}

        {error && (
          <div style={{ color: '#ef4444', textAlign: 'center', padding: '1rem' }}>
            {error}
          </div>
        )}

        {!loading && !error && appointments.length === 0 && (
          <div style={{ textAlign: 'center', color: '#6b7280', padding: '2rem' }}>
            No appointments yet. Send a message to the WhatsApp bot!
          </div>
        )}

        {!loading && !error && appointments.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {appointments.map((app, index) => (
              <div
                key={index}
                style={{
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '1rem',
                  transition: 'box-shadow 0.2s'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div>
                    <h3 style={{ fontWeight: '600', fontSize: '1.125rem' }}>
                      {app.patientName}
                    </h3>
                    <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                      📞 {app.phoneNumber}
                    </p>
                  </div>
                  <span style={{
                    backgroundColor: '#d1fae5',
                    color: '#065f46',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '9999px',
                    fontSize: '0.875rem'
                  }}>
                    ✅ Confirmed
                  </span>
                </div>
                <div style={{ marginTop: '0.75rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.875rem' }}>
                  <div>📅 {app.preferredDate}</div>
                  <div>⏰ {app.preferredTime}</div>
                  <div style={{ gridColumn: 'span 2' }}>🏥 {app.symptoms}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}