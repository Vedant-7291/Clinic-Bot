// lib/db.ts
import fs from 'fs';
import path from 'path';

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

class Database {
  private appointments: Map<string, Appointment[]> = new Map();
  private dataFile: string;

  constructor() {
    this.dataFile = path.join(process.cwd(), 'appointments-data.json');
    this.loadFromFile();
  }

  private loadFromFile() {
    try {
      if (fs.existsSync(this.dataFile)) {
        const data = fs.readFileSync(this.dataFile, 'utf-8');
        const parsed = JSON.parse(data);
        Object.entries(parsed).forEach(([key, value]) => {
          this.appointments.set(key, value as Appointment[]);
        });
        console.log('✅ Data loaded from file');
      }
    } catch (error) {
      console.error('Error loading data from file:', error);
    }
  }

  private saveToFile() {
    try {
      const data: Record<string, Appointment[]> = {};
      this.appointments.forEach((value, key) => {
        data[key] = value;
      });
      fs.writeFileSync(this.dataFile, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('Error saving data to file:', error);
    }
  }

  getAppointments(phoneNumber: string): Appointment[] {
    return this.appointments.get(phoneNumber) || [];
  }

  getAllAppointments(): Appointment[] {
    const all: Appointment[] = [];
    this.appointments.forEach((value) => {
      all.push(...value);
    });
    return all.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  addAppointment(phoneNumber: string, data: Partial<Appointment>): Appointment {
    const appointment: Appointment = {
      id: `app_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      phoneNumber,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...data,
    };

    if (!this.appointments.has(phoneNumber)) {
      this.appointments.set(phoneNumber, []);
    }
    this.appointments.get(phoneNumber)!.push(appointment);
    this.saveToFile();
    return appointment;
  }

  updateAppointment(id: string, updates: Partial<Appointment>): Appointment | null {
    let found = null;
    this.appointments.forEach((appointments) => {
      const index = appointments.findIndex(a => a.id === id);
      if (index !== -1) {
        appointments[index] = {
          ...appointments[index],
          ...updates,
          updatedAt: new Date().toISOString()
        };
        found = appointments[index];
      }
    });
    if (found) this.saveToFile();
    return found;
  }

  deleteAppointment(id: string): boolean {
    let deleted = false;
    this.appointments.forEach((appointments, key) => {
      const filtered = appointments.filter(a => a.id !== id);
      if (filtered.length !== appointments.length) {
        this.appointments.set(key, filtered);
        deleted = true;
      }
    });
    if (deleted) this.saveToFile();
    return deleted;
  }

  getStats(): DashboardStats {
    const all = this.getAllAppointments();
    const today = new Date().toISOString().split('T')[0];
    
    const todayAppointments = all.filter(a => 
      a.preferredDate === today && a.status !== 'cancelled'
    );

    const newPatients = all.filter(a => 
      a.patientType === 'New Patient'
    );

    const returningPatients = all.filter(a => 
      a.patientType === 'Returning Patient'
    );

    const appointmentsByDepartment: Record<string, number> = {};
    all.forEach(a => {
      if (a.department) {
        appointmentsByDepartment[a.department] = (appointmentsByDepartment[a.department] || 0) + 1;
      }
    });

    return {
      totalAppointments: all.length,
      todayAppointments: todayAppointments.length,
      newPatients: newPatients.length,
      returningPatients: returningPatients.length,
      appointmentsByDepartment,
      recentAppointments: all.slice(0, 10),
    };
  }

  clearAll() {
    this.appointments.clear();
    this.saveToFile();
  }
}

export const db = new Database();

// For backwards compatibility with existing webhook
export const appointments = db;