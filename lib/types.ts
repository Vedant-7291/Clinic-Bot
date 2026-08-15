// lib/types.ts
export interface Appointment {
  id: string;
  phoneNumber: string;
  patientType?: string;
  patientName?: string;
  department?: string;
  preferredDate?: string;
  preferredTime?: string;
  symptoms?: string;
  hasInsurance?: string;
  status: 'confirmed' | 'cancelled' | 'completed' | 'pending';
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalAppointments: number;
  todayAppointments: number;
  newPatients: number;
  returningPatients: number;
  appointmentsByDepartment: Record<string, number>;
  recentAppointments: Appointment[];
}

export interface FilterOptions {
  status?: string;
  department?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}