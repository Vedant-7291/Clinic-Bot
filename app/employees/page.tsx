'use client';

import { useState } from 'react';
import { 
  Search, 
  Mail, 
  Phone, 
  Calendar, 
  User,
  Users,
  Heart,
  Brain,
  Baby,
  MoreVertical
} from 'lucide-react';

interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  phone: string;
  specialization: string;
}

const employees: Employee[] = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    role: 'Senior Physician',
    department: 'Cardiology',
    email: 'sarah.johnson@clinic.com',
    phone: '+1 (555) 123-4567',
    specialization: 'Interventional Cardiology',
  },
  {
    id: '2',
    name: 'Dr. Michael Chen',
    role: 'Neurologist',
    department: 'Neurology',
    email: 'michael.chen@clinic.com',
    phone: '+1 (555) 234-5678',
    specialization: 'Stroke & Vascular Neurology',
  },
  {
    id: '3',
    name: 'Dr. Emily Davis',
    role: 'Pediatrician',
    department: 'Pediatrics',
    email: 'emily.davis@clinic.com',
    phone: '+1 (555) 345-6789',
    specialization: 'General Pediatrics',
  },
  {
    id: '4',
    name: 'Dr. James Wilson',
    role: 'Orthopedic Surgeon',
    department: 'Orthopedics',
    email: 'james.wilson@clinic.com',
    phone: '+1 (555) 456-7890',
    specialization: 'Sports Medicine',
  },
  {
    id: '5',
    name: 'Dr. Maria Garcia',
    role: 'Cardiologist',
    department: 'Cardiology',
    email: 'maria.garcia@clinic.com',
    phone: '+1 (555) 567-8901',
    specialization: 'Heart Failure',
  },
];

const departments = ['All Staff', 'Cardiology', 'Neurology', 'Pediatrics'];

export default function EmployeesPage() {
  const [selectedDepartment, setSelectedDepartment] = useState('All Staff');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEmployees = employees.filter(emp => {
    const matchesDept = selectedDepartment === 'All Staff' || emp.department === selectedDepartment;
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          emp.role.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesDept && matchesSearch;
  });

  const getDepartmentIcon = (dept: string) => {
    switch (dept) {
      case 'Cardiology': return Heart;
      case 'Neurology': return Brain;
      case 'Pediatrics': return Baby;
      default: return User;
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-[#0A1628]">Staff Directory</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your medical staff and their schedules</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search staff..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A3A5C] focus:border-transparent"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {departments.map((dept) => {
            const isActive = selectedDepartment === dept;
            const Icon = dept === 'All Staff' ? Users : getDepartmentIcon(dept);
            return (
              <button
                key={dept}
                onClick={() => setSelectedDepartment(dept)}
                className={`
                  px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 text-sm font-medium
                  ${isActive 
                    ? 'bg-[#0A1628] text-white shadow-lg' 
                    : 'bg-white text-[#0A1628] border border-gray-200 hover:bg-gray-50'
                  }
                `}
              >
                <Icon size={16} />
                {dept}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredEmployees.map((employee) => {
          const DeptIcon = getDepartmentIcon(employee.department);
          return (
            <div key={employee.id} className="card p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-[#0A1628] rounded-full flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                    {employee.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#0A1628]">{employee.name}</h3>
                    <p className="text-sm text-gray-500">{employee.role}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <DeptIcon size={14} className="text-[#1A3A5C]" />
                      <span className="text-xs text-[#1A3A5C] font-medium">{employee.department}</span>
                    </div>
                  </div>
                </div>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <MoreVertical size={18} className="text-gray-400" />
                </button>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail size={14} className="text-gray-400 flex-shrink-0" />
                  <span className="truncate">{employee.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone size={14} className="text-gray-400 flex-shrink-0" />
                  <span>{employee.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-1.5 h-1.5 bg-[#3B82F6] rounded-full flex-shrink-0" />
                  <span className="text-xs text-gray-500">{employee.specialization}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2">
                <button className="flex-1 btn-secondary text-sm flex items-center justify-center gap-2">
                  <User size={14} />
                  Profile
                </button>
                <button className="flex-1 btn-primary text-sm flex items-center justify-center gap-2">
                  <Calendar size={14} />
                  Schedule
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredEmployees.length === 0 && (
        <div className="text-center py-12">
          <Users size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">No staff members found matching your criteria</p>
        </div>
      )}
    </div>
  );
}