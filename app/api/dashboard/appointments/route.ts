// app/api/dashboard/appointments/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../lib/db';
import { FilterOptions } from '../../../../lib/types';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const department = searchParams.get('department');
    const search = searchParams.get('search');
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');

    let appointments = db.getAllAppointments();

    // Apply filters
    if (status && status !== 'all') {
      appointments = appointments.filter(a => a.status === status);
    }

    if (department && department !== 'all') {
      appointments = appointments.filter(a => a.department === department);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      appointments = appointments.filter(a =>
        a.patientName?.toLowerCase().includes(searchLower) ||
        a.phoneNumber.includes(search) ||
        a.department?.toLowerCase().includes(searchLower)
      );
    }

    if (dateFrom) {
      appointments = appointments.filter(a => a.preferredDate >= dateFrom);
    }

    if (dateTo) {
      appointments = appointments.filter(a => a.preferredDate <= dateTo);
    }

    return NextResponse.json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch appointments' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Appointment ID is required' },
        { status: 400 }
      );
    }

    const updated = db.updateAppointment(id, updates);
    if (!updated) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating appointment:', error);
    return NextResponse.json(
      { error: 'Failed to update appointment' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Appointment ID is required' },
        { status: 400 }
      );
    }

    const deleted = db.deleteAppointment(id);
    if (!deleted) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting appointment:', error);
    return NextResponse.json(
      { error: 'Failed to delete appointment' },
      { status: 500 }
    );
  }
}