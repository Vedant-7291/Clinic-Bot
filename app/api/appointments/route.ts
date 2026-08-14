import { NextRequest, NextResponse } from 'next/server';

// Share the appointments map globally
declare global {
  var appointments: Map<string, any[]>;
}

if (!global.appointments) {
  global.appointments = new Map();
}

export async function GET() {
  try {
    const allApps: any[] = [];
    global.appointments.forEach((value) => {
      allApps.push(...value);
    });
    return NextResponse.json(allApps);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch appointments' },
      { status: 500 }
    );
  }
}