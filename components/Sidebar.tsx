'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  CalendarDays, 
  Users, 
  UserPlus, 
  CalendarCheck, 
  BarChart3, 
  FileText, 
  DollarSign,
  Stethoscope,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { icon: CalendarDays, label: 'Schedule', href: '/' },
  { icon: Users, label: 'Employees', href: '/employees' },
  { icon: UserPlus, label: 'Patients', href: '/patients' },
  { icon: CalendarCheck, label: 'Scheduled Visits', href: '/visits' },
  { icon: BarChart3, label: 'Statistics', href: '/statistics' },
  { icon: FileText, label: 'Reports', href: '/reports' },
  { icon: DollarSign, label: 'Price', href: '/price' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-[#0A1628] text-white rounded-lg shadow-lg"
      >
        {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-40
        w-64 bg-[#0A1628] text-white
        transform transition-transform duration-300 ease-in-out
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        flex flex-col shadow-2xl
      `}>
        {/* Brand */}
        <div className="p-6 border-b border-[#1A3A5C]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#1A3A5C] rounded-lg flex items-center justify-center">
              <Stethoscope size={24} className="text-[#3B82F6]" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Clinic CRM</h1>
              <p className="text-xs text-[#94A3B8]">Medical Management</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                  ${isActive 
                    ? 'bg-[#1A3A5C] text-white shadow-lg' 
                    : 'text-[#94A3B8] hover:bg-[#1A3A5C] hover:text-white'
                  }
                `}
              >
                <item.icon size={20} className={isActive ? 'text-[#3B82F6]' : ''} />
                <span className="font-medium text-sm">{item.label}</span>
                {isActive && (
                  <div className="ml-auto w-1 h-8 bg-[#3B82F6] rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-[#1A3A5C]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#1A3A5C] rounded-full flex items-center justify-center">
              <span className="text-xs font-bold">AD</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">Admin User</p>
              <p className="text-xs text-[#94A3B8] truncate">Administrator</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}