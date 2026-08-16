'use client';

import { 
  TrendingUp, 
  Users, 
  CalendarCheck, 
  XCircle,
  DollarSign,
  Activity,
  PieChart as PieChartIcon
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

const monthlyData = [
  { month: 'Jan', revenue: 45000, appointments: 120 },
  { month: 'Feb', revenue: 52000, appointments: 135 },
  { month: 'Mar', revenue: 48000, appointments: 125 },
  { month: 'Apr', revenue: 61000, appointments: 150 },
  { month: 'May', revenue: 58000, appointments: 140 },
  { month: 'Jun', revenue: 67000, appointments: 165 },
];

const patientData = [
  { name: 'Cardiology', value: 35 },
  { name: 'Neurology', value: 25 },
  { name: 'Pediatrics', value: 20 },
  { name: 'Orthopedics', value: 15 },
  { name: 'Others', value: 5 },
];

const COLORS = ['#1A3A5C', '#2A5A8C', '#3B82F6', '#60A5FA', '#93C5FD'];

const statsCards = [
  {
    title: 'Total Revenue',
    value: '$264,000',
    change: '+12.5%',
    icon: DollarSign,
    color: 'bg-blue-50 text-blue-600',
  },
  {
    title: 'New Patients',
    value: '1,247',
    change: '+8.3%',
    icon: Users,
    color: 'bg-green-50 text-green-600',
  },
  {
    title: 'Total Appointments',
    value: '835',
    change: '+5.7%',
    icon: CalendarCheck,
    color: 'bg-purple-50 text-purple-600',
  },
  {
    title: 'Cancellations',
    value: '42',
    change: '-2.1%',
    icon: XCircle,
    color: 'bg-red-50 text-red-600',
  },
];

export default function StatisticsPage() {
  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-[#0A1628]">Statistics</h1>
        <p className="text-gray-500 text-sm mt-1">Overview of your clinic's performance metrics</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
        {statsCards.map((stat) => {
          const Icon = stat.icon;
          const isPositive = stat.change.startsWith('+');
          return (
            <div key={stat.title} className="card p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.title}</p>
                  <p className="text-2xl font-bold text-[#0A1628] mt-1">{stat.value}</p>
                  <span className={`text-xs font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change} from last month
                  </span>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[#0A1628]">Revenue & Appointments</h2>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-0.5 bg-[#1A3A5C]" />
                <span className="text-gray-500">Revenue</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-0.5 bg-[#3B82F6]" />
                <span className="text-gray-500">Appointments</span>
              </div>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={12} />
                <YAxis yAxisId="left" stroke="#94A3B8" fontSize={12} />
                <YAxis yAxisId="right" orientation="right" stroke="#94A3B8" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="revenue"
                  stroke="#1A3A5C"
                  strokeWidth={2}
                  dot={{ fill: '#1A3A5C' }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="appointments"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  dot={{ fill: '#3B82F6' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-2 mb-4">
            <PieChartIcon size={20} className="text-[#1A3A5C]" />
            <h2 className="text-lg font-semibold text-[#0A1628]">Patient Distribution</h2>
          </div>
          <div className="h-80 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={patientData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {patientData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  formatter={(value) => <span className="text-sm text-gray-700">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-4">
            <Activity size={20} className="text-[#1A3A5C]" />
            <h3 className="font-semibold text-[#0A1628]">Patient Satisfaction</h3>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-[#0A1628]">4.8</span>
            <span className="text-gray-500 mb-1">/ 5.0</span>
          </div>
          <p className="text-sm text-gray-500 mt-1">Based on 847 reviews</p>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp size={20} className="text-[#1A3A5C]" />
            <h3 className="font-semibold text-[#0A1628]">Average Wait Time</h3>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-[#0A1628]">12</span>
            <span className="text-gray-500 mb-1">minutes</span>
          </div>
          <p className="text-sm text-green-600 mt-1">↓ 8% from last month</p>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-3 mb-4">
            <CalendarCheck size={20} className="text-[#1A3A5C]" />
            <h3 className="font-semibold text-[#0A1628]">Appointment Rate</h3>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-[#0A1628]">94%</span>
          </div>
          <p className="text-sm text-gray-500 mt-1">Appointments kept vs scheduled</p>
        </div>
      </div>
    </div>
  );
}