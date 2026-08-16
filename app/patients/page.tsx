'use client';

import { useState } from 'react';
import { 
  Search, 
  Eye, 
  ChevronLeft, 
  ChevronRight,
  User,
  Calendar,
  Phone,
  Mail,
  MapPin,
  FileText,
  Clock
} from 'lucide-react';

interface Patient {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'pending';
  lastVisit: string;
  nextVisit: string;
  balance: number;
  phone: string;
  email: string;
  address: string;
  dob: string;
  gender: string;
  medicalHistory: string[];
}

const patients: Patient[] = [
  {
    id: '1',
    name: 'Robert Anderson',
    status: 'active',
    lastVisit: '2026-08-10',
    nextVisit: '2026-08-25',
    balance: 150.00,
    phone: '+1 (555) 111-2233',
    email: 'robert.anderson@email.com',
    address: '123 Main St, New York, NY 10001',
    dob: '1975-06-15',
    gender: 'Male',
    medicalHistory: ['Hypertension', 'Diabetes Type 2'],
  },
  {
    id: '2',
    name: 'Emma Wilson',
    status: 'active',
    lastVisit: '2026-08-08',
    nextVisit: '2026-08-20',
    balance: 0.00,
    phone: '+1 (555) 222-3344',
    email: 'emma.wilson@email.com',
    address: '456 Oak Ave, Los Angeles, CA 90001',
    dob: '1988-11-22',
    gender: 'Female',
    medicalHistory: ['Asthma', 'Allergies'],
  },
  {
    id: '3',
    name: 'James Thompson',
    status: 'pending',
    lastVisit: '2026-07-28',
    nextVisit: '2026-09-01',
    balance: 275.50,
    phone: '+1 (555) 333-4455',
    email: 'james.thompson@email.com',
    address: '789 Pine Rd, Chicago, IL 60601',
    dob: '1962-03-10',
    gender: 'Male',
    medicalHistory: ['Coronary Artery Disease', 'Hyperlipidemia'],
  },
  {
    id: '4',
    name: 'Olivia Martinez',
    status: 'active',
    lastVisit: '2026-08-05',
    nextVisit: '2026-08-30',
    balance: 0.00,
    phone: '+1 (555) 444-5566',
    email: 'olivia.martinez@email.com',
    address: '321 Elm St, Houston, TX 77001',
    dob: '1995-09-18',
    gender: 'Female',
    medicalHistory: ['Migraine', 'Anxiety'],
  },
  {
    id: '5',
    name: 'William Chen',
    status: 'inactive',
    lastVisit: '2026-06-15',
    nextVisit: '2026-09-15',
    balance: 50.00,
    phone: '+1 (555) 555-6677',
    email: 'william.chen@email.com',
    address: '654 Maple Dr, Phoenix, AZ 85001',
    dob: '1980-12-05',
    gender: 'Male',
    medicalHistory: ['None'],
  },
];

export default function PatientsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredPatients = patients.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPatients = filteredPatients.slice(startIndex, startIndex + itemsPerPage);

  const getStatusColor = (status: Patient['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'inactive': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-[#0A1628]">Patients</h1>
          <p className="text-gray-500 text-sm mt-1">Manage patient records and appointments</p>
        </div>
      </div>

      <div className="relative max-w-md mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search patients..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A3A5C] focus:border-transparent"
        />
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="table-header">Patient</th>
                <th className="table-header hidden md:table-cell">Status</th>
                <th className="table-header hidden lg:table-cell">Last Visit</th>
                <th className="table-header hidden lg:table-cell">Next Visit</th>
                <th className="table-header">Balance</th>
                <th className="table-header text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedPatients.map((patient) => (
                <tr key={patient.id} className="hover:bg-gray-50 transition-colors">
                  <td className="table-cell">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#0A1628] rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                        {patient.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-medium text-[#0A1628]">{patient.name}</p>
                        <p className="text-xs text-gray-500">{patient.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="table-cell hidden md:table-cell">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(patient.status)}`}>
                      {patient.status}
                    </span>
                  </td>
                  <td className="table-cell hidden lg:table-cell">{patient.lastVisit}</td>
                  <td className="table-cell hidden lg:table-cell">{patient.nextVisit}</td>
                  <td className="table-cell">
                    <span className={`font-medium ${patient.balance > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                      ${patient.balance.toFixed(2)}
                    </span>
                  </td>
                  <td className="table-cell text-center">
                    <button
                      onClick={() => setSelectedPatient(patient)}
                      className="p-2 bg-[#0A1628] text-white rounded-lg hover:bg-[#1A3A5C] transition-colors inline-flex items-center gap-1"
                    >
                      <Eye size={16} />
                      <span className="text-xs hidden sm:inline">View</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredPatients.length > itemsPerPage && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredPatients.length)} of {filteredPatients.length} patients
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

      {/* Patient Profile Modal */}
      {selectedPatient && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-[#0A1628] rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {selectedPatient.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#0A1628]">{selectedPatient.name}</h2>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(selectedPatient.status)}`}>
                    {selectedPatient.status}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedPatient(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Phone size={18} className="text-[#1A3A5C]" />
                  <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="text-sm font-medium">{selectedPatient.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Mail size={18} className="text-[#1A3A5C]" />
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm font-medium truncate">{selectedPatient.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Calendar size={18} className="text-[#1A3A5C]" />
                  <div>
                    <p className="text-xs text-gray-500">Date of Birth</p>
                    <p className="text-sm font-medium">{selectedPatient.dob}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <User size={18} className="text-[#1A3A5C]" />
                  <div>
                    <p className="text-xs text-gray-500">Gender</p>
                    <p className="text-sm font-medium">{selectedPatient.gender}</p>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-start gap-3">
                  <MapPin size={18} className="text-[#1A3A5C] mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Address</p>
                    <p className="text-sm font-medium">{selectedPatient.address}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-[#0A1628] mb-3 flex items-center gap-2">
                  <FileText size={18} className="text-[#1A3A5C]" />
                  Medical History
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedPatient.medicalHistory.map((condition, index) => (
                    <span key={index} className="px-3 py-1 bg-[#0A1628] text-white text-sm rounded-lg">
                      {condition}
                    </span>
                  ))}
                  {selectedPatient.medicalHistory.length === 0 && (
                    <span className="text-sm text-gray-500">No medical history recorded</span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg text-center">
                  <Clock size={20} className="mx-auto text-[#1A3A5C] mb-1" />
                  <p className="text-xs text-gray-500">Last Visit</p>
                  <p className="text-sm font-medium">{selectedPatient.lastVisit}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg text-center">
                  <Calendar size={20} className="mx-auto text-[#1A3A5C] mb-1" />
                  <p className="text-xs text-gray-500">Next Visit</p>
                  <p className="text-sm font-medium">{selectedPatient.nextVisit}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}