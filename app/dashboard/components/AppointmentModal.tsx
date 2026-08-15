// app/dashboard/components/AppointmentModal.tsx
'use client';

import { useState } from 'react';
import { Appointment } from '../../../lib/types';
import { formatDate, getStatusColor, getStatusLabel } from '../../../lib/utils';

interface AppointmentModalProps {
  isOpen: boolean;
  appointment: Appointment | null;
  onClose: () => void;
  onUpdate: (id: string, updates: Partial<Appointment>) => void;
  onDelete: (id: string) => void;
}

export default function AppointmentModal({
  isOpen,
  appointment,
  onClose,
  onUpdate,
  onDelete,
}: AppointmentModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Appointment>>({});

  if (!isOpen || !appointment) return null;

  const handleStatusChange = (status: string) => {
    onUpdate(appointment.id, { status: status as Appointment['status'] });
  };

  const handleSave = () => {
    onUpdate(appointment.id, formData);
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              Appointment Details
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          {!isEditing ? (
            // View Mode
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Patient Name</label>
                  <p className="text-gray-900">{appointment.patientName || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Phone Number</label>
                  <p className="text-gray-900">{appointment.phoneNumber}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Patient Type</label>
                  <p className="text-gray-900">{appointment.patientType || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Department</label>
                  <p className="text-gray-900">{appointment.department || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Date</label>
                  <p className="text-gray-900">{appointment.preferredDate || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Time</label>
                  <p className="text-gray-900">{appointment.preferredTime || 'N/A'}</p>
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium text-gray-500">Symptoms</label>
                  <p className="text-gray-900">{appointment.symptoms || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Insurance</label>
                  <p className="text-gray-900">{appointment.hasInsurance || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                      appointment.status
                    )}`}
                  >
                    {getStatusLabel(appointment.status)}
                  </span>
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium text-gray-500">Created At</label>
                  <p className="text-gray-900">{formatDate(appointment.createdAt)}</p>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 flex flex-wrap gap-2 justify-between">
                <div className="space-x-2">
                  <button
                    onClick={() => handleStatusChange('confirmed')}
                    className="px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => handleStatusChange('completed')}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                  >
                    Complete
                  </button>
                  <button
                    onClick={() => handleStatusChange('cancelled')}
                    className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
                  >
                    Cancel
                  </button>
                </div>
                <div className="space-x-2">
                  <button
                    onClick={() => {
                      setIsEditing(true);
                      setFormData(appointment);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(appointment.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ) : (
            // Edit Mode
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Patient Name</label>
                  <input
                    type="text"
                    value={formData.patientName || ''}
                    onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Patient Type</label>
                  <select
                    value={formData.patientType || ''}
                    onChange={(e) => setFormData({ ...formData, patientType: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">Select</option>
                    <option value="New Patient">New Patient</option>
                    <option value="Returning Patient">Returning Patient</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Department</label>
                  <input
                    type="text"
                    value={formData.department || ''}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date</label>
                  <input
                    type="date"
                    value={formData.preferredDate || ''}
                    onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Time</label>
                  <input
                    type="text"
                    value={formData.preferredTime || ''}
                    onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                    placeholder="e.g., Morning (9 AM - 12 PM)"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Symptoms</label>
                  <textarea
                    value={formData.symptoms || ''}
                    onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Insurance</label>
                  <select
                    value={formData.hasInsurance || ''}
                    onChange={(e) => setFormData({ ...formData, hasInsurance: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">Select</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <select
                    value={formData.status || ''}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as Appointment['status'] })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="confirmed">Confirmed</option>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 flex justify-end space-x-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}