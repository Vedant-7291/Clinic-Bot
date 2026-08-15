// app/dashboard/components/AppointmentsTable.tsx
'use client';

import { Appointment } from '../../../lib/types';
import { formatDateShort, getStatusColor, getStatusLabel } from '../../../lib/utils';

interface AppointmentsTableProps {
  appointments: Appointment[];
  onViewAppointment: (appointment: Appointment) => void;
}

export default function AppointmentsTable({
  appointments,
  onViewAppointment,
}: AppointmentsTableProps) {
  if (appointments.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No appointments found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Patient
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Department
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date & Time
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Created
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {appointments.map((app) => (
            <tr key={app.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {app.patientName || 'Unknown'}
                </div>
                <div className="text-sm text-gray-500">{app.phoneNumber}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {app.department || 'Not specified'}
                </div>
                <div className="text-xs text-gray-500">
                  {app.patientType || 'N/A'}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {app.preferredDate || 'TBD'}
                </div>
                <div className="text-sm text-gray-500">
                  {app.preferredTime || 'TBD'}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                    app.status
                  )}`}
                >
                  {getStatusLabel(app.status)}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatDateShort(app.createdAt)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => onViewAppointment(app)}
                  className="text-blue-600 hover:text-blue-900 mr-3"
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}