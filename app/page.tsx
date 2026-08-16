'use client';

import { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Users, 
  Plus, 
  ChevronLeft, 
  ChevronRight,
} from 'lucide-react';

interface StaffMember {
  id: string;
  name: string;
  role: string;
  department: string;
  status: 'on-duty' | 'off-duty' | 'on-call';
}

const staffMembers: StaffMember[] = [
  { id: '1', name: 'Dr. Sarah Johnson', role: 'Senior Physician', department: 'Cardiology', status: 'on-duty' },
  { id: '2', name: 'Dr. Michael Chen', role: 'Neurologist', department: 'Neurology', status: 'on-duty' },
  { id: '3', name: 'Dr. Emily Davis', role: 'Pediatrician', department: 'Pediatrics', status: 'on-call' },
  { id: '4', name: 'Dr. James Wilson', role: 'Orthopedic Surgeon', department: 'Orthopedics', status: 'off-duty' },
  { id: '5', name: 'Dr. Maria Garcia', role: 'Cardiologist', department: 'Cardiology', status: 'on-duty' },
];

const timeSlots = [
  '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
  '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM',
];

export default function SchedulePage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<number | null>(null);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    return { daysInMonth, firstDayOfMonth };
  };

  const { daysInMonth, firstDayOfMonth } = getDaysInMonth(currentDate);
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getStatusColor = (status: StaffMember['status']) => {
    switch (status) {
      case 'on-duty': return 'bg-green-500';
      case 'off-duty': return 'bg-gray-400';
      case 'on-call': return 'bg-yellow-500';
      default: return 'bg-gray-400';
    }
  };

  const getStatusText = (status: StaffMember['status']) => {
    switch (status) {
      case 'on-duty': return 'On Duty';
      case 'off-duty': return 'Off Duty';
      case 'on-call': return 'On Call';
      default: return 'Unknown';
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-[#0A1628]">Schedule</h1>
          <p className="text-gray-500 text-sm mt-1">Manage appointments and staff shifts</p>
        </div>
        <button className="mt-4 lg:mt-0 btn-accent flex items-center gap-2">
          <Plus size={18} />
          New Appointment
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2 card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-[#0A1628]">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={() => setCurrentDate(new Date())}
                className="px-3 py-1 text-sm bg-[#0A1628] text-white rounded-lg hover:bg-[#1A3A5C] transition-colors"
              >
                Today
              </button>
              <button
                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center text-xs font-semibold text-gray-500 py-2">
                {day}
              </div>
            ))}
            
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square" />
            ))}
            
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNumber = i + 1;
              const isToday = new Date().getDate() === dayNumber &&
                new Date().getMonth() === currentDate.getMonth() &&
                new Date().getFullYear() === currentDate.getFullYear();
              const hasAppointment = [2, 5, 8, 12, 15, 18, 22, 25, 28].includes(dayNumber);
              
              return (
                <button
                  key={dayNumber}
                  onClick={() => setSelectedDate(dayNumber)}
                  className={`
                    aspect-square flex flex-col items-center justify-center rounded-lg
                    transition-all duration-200 relative
                    ${selectedDate === dayNumber ? 'bg-[#1A3A5C] text-white' : ''}
                    ${isToday && selectedDate !== dayNumber ? 'bg-blue-50 border-2 border-[#3B82F6]' : ''}
                    ${!isToday && !selectedDate ? 'hover:bg-gray-50' : ''}
                  `}
                >
                  <span className={`text-sm ${isToday && !selectedDate ? 'font-bold text-[#3B82F6]' : ''}`}>
                    {dayNumber}
                  </span>
                  {hasAppointment && (
                    <div className={`w-1 h-1 rounded-full mt-1 ${selectedDate === dayNumber ? 'bg-white' : 'bg-[#3B82F6]'}`} />
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-4 flex items-center gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#3B82F6] rounded-full" />
              <span>Has appointments</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 border-2 border-[#3B82F6] rounded-full" />
              <span>Today</span>
            </div>
          </div>
        </div>

        {/* Staff on Duty */}
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Users size={20} className="text-[#1A3A5C]" />
            <h2 className="text-lg font-semibold text-[#0A1628]">Staff on Duty</h2>
          </div>
          
          <div className="space-y-3">
            {staffMembers.map((staff) => (
              <div key={staff.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative flex-shrink-0">
                    <div className="w-10 h-10 bg-[#0A1628] rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {staff.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 ${getStatusColor(staff.status)} rounded-full border-2 border-white`} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[#0A1628] truncate">{staff.name}</p>
                    <p className="text-xs text-gray-500 truncate">{staff.role}</p>
                  </div>
                </div>
                <span className="text-xs px-2 py-1 bg-white rounded-full shadow-sm whitespace-nowrap ml-2">
                  {getStatusText(staff.status)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Time Slots */}
        <div className="lg:col-span-3 card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[#0A1628]">Detailed Schedule</h2>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#3B82F6] rounded" />
                <span>Booked</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-200 rounded" />
                <span>Available</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {timeSlots.map((time, index) => {
              const isBooked = [2, 5, 7, 10, 14, 16].includes(index);
              return (
                <div
                  key={time}
                  className={`
                    p-3 rounded-lg text-center transition-all duration-200
                    ${isBooked 
                      ? 'bg-[#1A3A5C] text-white hover:bg-[#2A5A8C] cursor-pointer' 
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100 cursor-pointer'
                    }
                  `}
                >
                  <Clock size={14} className={`mx-auto mb-1 ${isBooked ? 'text-[#3B82F6]' : 'text-gray-400'}`} />
                  <span className="text-xs font-medium">{time}</span>
                  {isBooked && (
                    <div className="mt-1 text-xs text-[#94A3B8]">Booked</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}