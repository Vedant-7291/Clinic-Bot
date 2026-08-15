// app/dashboard/components/StatsCards.tsx
'use client';

import { DashboardStats } from '../../../lib/types';

interface StatsCardsProps {
  stats: DashboardStats | null;
}

export default function StatsCards({ stats }: StatsCardsProps) {
  if (!stats) return null;

  const cards = [
    {
      title: 'Total Appointments',
      value: stats.totalAppointments,
      icon: '📋',
      color: 'bg-blue-500',
    },
    {
      title: "Today's Appointments",
      value: stats.todayAppointments,
      icon: '📅',
      color: 'bg-green-500',
    },
    {
      title: 'New Patients',
      value: stats.newPatients,
      icon: '🆕',
      color: 'bg-purple-500',
    },
    {
      title: 'Returning Patients',
      value: stats.returningPatients,
      icon: '🔄',
      color: 'bg-orange-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div
          key={card.title}
          className="bg-white rounded-lg shadow p-6 border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{card.title}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {card.value}
              </p>
            </div>
            <div
              className={`w-12 h-12 ${card.color} rounded-lg flex items-center justify-center text-2xl`}
            >
              {card.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}