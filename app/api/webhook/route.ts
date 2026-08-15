import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

// ============================================
// IN-MEMORY STORAGE
// ============================================
const userStates = new Map<string, UserState>();
const appointments = new Map<string, AppointmentData[]>();

// ============================================
// TYPES
// ============================================
type StepId =
  | 'GREETING'
  | 'MENU'
  | 'EMERGENCY_CHECK'
  | 'PATIENT_TYPE'
  | 'NAME'
  | 'DEPARTMENT'
  | 'DATE'
  | 'DATE_CUSTOM'
  | 'TIME'
  | 'SYMPTOMS'
  | 'INSURANCE'
  | 'CONFIRMATION';

interface AppointmentData {
  phoneNumber: string;
  patientType?: string;
  patientName?: string;
  department?: string;
  preferredDate?: string;
  preferredTime?: string;
  symptoms?: string;
  hasInsurance?: string;
  createdAt?: string;
}

interface UserState {
  step: StepId;
  data: AppointmentData;
}

type OutgoingMessage =
  | { kind: 'text'; text: string }
  | {
      kind: 'buttons';
      text: string;
      buttons: { id: string; title: string }[];
      header?: string;
      footer?: string;
    }
  | {
      kind: 'list';
      text: string;
      buttonText: string;
      sections: { title?: string; rows: { id: string; title: string; description?: string }[] }[];
      header?: string;
      footer?: string;
    };

// ============================================
// STATIC DATA
// ============================================
const DEPARTMENTS: Record<string, string> = {
  dept_general: 'General Medicine',
  dept_dental: 'Dental Care',
  dept_pediatrics: 'Pediatrics',
  dept_cardiology: 'Cardiology',
  dept_ortho: 'Orthopedics',
  dept_gyno: 'Gynecology',
  dept_ent: 'ENT',
  dept_derma: 'Dermatology',
  dept_other: 'Other / Not sure',
};

const CLINIC_EMERGENCY_PHONE = process.env.CLINIC_EMERGENCY_PHONE || '+91-XXXXXXXXXX';
const CLINIC_NAME = process.env.CLINIC_NAME || 'ABC Clinic';

// A reply can be a single message or a short sequence of them
// (e.g. "Got it 👍" followed by the next question as its own bubble).
type OutgoingReply = OutgoingMessage | OutgoingMessage[];

function toArray(reply: OutgoingReply): OutgoingMessage[] {
  return Array.isArray(reply) ? reply : [reply];
}

// ============================================
// WEBHOOK VERIFICATION - GET
// ============================================
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const mode = searchParams.get('hub.mode');
    const token = searchParams.get('hub.verify_token');
    const challenge = searchParams.get('hub.challenge');

    console.log('🔍 Webhook Verification:');
    console.log('  Mode:', mode);
    console.log('  Token:', token);
    console.log('  Expected Token:', process.env.VERIFY_TOKEN);

    if (!process.env.VERIFY_TOKEN) {
      console.error('❌ VERIFY_TOKEN not set in environment variables');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    if (mode === 'subscribe' && token === process.env.VERIFY_TOKEN) {
      console.log('✅ Webhook verified successfully!');
      return new NextResponse(challenge, {
        status: 200,
        headers: { 'Content-Type': 'text/plain' },
      });
    } else {
      console.error('❌ Verification failed');
      return NextResponse.json({ error: 'Verification failed' }, { status: 403 });
    }
  } catch (error) {
    console.error('❌ Error in webhook verification:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// ============================================
// HANDLE INCOMING MESSAGES - POST
// ============================================
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('📨 Webhook received:', JSON.stringify(body, null, 2));

    if (body.object !== 'whatsapp_business_account') {
      return NextResponse.json({ status: 'ignored' });
    }

    for (const entry of body.entry || []) {
      for (const change of entry.changes || []) {
        const value = change.value;

        if (value.statuses && value.statuses.length > 0) {
          console.log('📊 Status update:', value.statuses[0].status);
          continue;
        }

        if (value.messages && value.messages.length > 0) {
          const message = value.messages[0];
          const from = message.from;

          // Normalize the incoming message into either a free-text input
          // or a button/list press (both carry an `id` + `title`).
          let input: { type: 'text'; text: string } | { type: 'button'; id: string; title: string } | null = null;

          if (message.type === 'text' && message.text?.body) {
            input = { type: 'text', text: message.text.body };
          } else if (message.type === 'interactive') {
            const interactive = message.interactive;
            if (interactive.type === 'button_reply') {
              input = { type: 'button', id: interactive.button_reply.id, title: interactive.button_reply.title };
            } else if (interactive.type === 'list_reply') {
              input = { type: 'button', id: interactive.list_reply.id, title: interactive.list_reply.title };
            }
          }

          if (!input) {
            await sendWhatsAppMessage(from, {
              kind: 'text',
              text: "Sorry, I can only understand text messages or menu taps. Type 'hello' to get started.",
            });
            continue;
          }

          console.log(`📨 From ${from}:`, input);
          const reply = processMessage(from, input);
          for (const msg of toArray(reply)) {
            await sendWhatsAppMessage(from, msg);
          }
        }
      }
    }

    return NextResponse.json({ status: 'success' });
  } catch (error) {
    console.error('❌ Webhook error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// ============================================
// STATE HELPERS
// ============================================
function getState(userId: string): UserState {
  if (!userStates.has(userId)) {
    userStates.set(userId, { step: 'GREETING', data: { phoneNumber: userId } });
  }
  return userStates.get(userId)!;
}

function resetToBooking(userId: string): UserState {
  const state: UserState = { step: 'EMERGENCY_CHECK', data: { phoneNumber: userId } };
  userStates.set(userId, state);
  return state;
}

function field(value: string | undefined): string {
  return value && value.trim().length > 0 ? value : 'Not provided';
}

// ============================================
// BOT LOGIC (entry point)
// ============================================
function processMessage(
  userId: string,
  input: { type: 'text'; text: string } | { type: 'button'; id: string; title: string }
): OutgoingReply {
  const state = getState(userId);

  if (input.type === 'button') {
    return handleButtonPress(userId, state, input.id);
  }

  return handleTextMessage(userId, state, input.text);
}

// ============================================
// BUTTON / LIST ROUTER
// ============================================
// IMPORTANT: This switches purely on the button/list ID, never on the
// user's current step. That means a button tapped from ANY earlier message
// in the chat (even one from a previous, already-abandoned flow) still
// does exactly what it says and moves the conversation forward from there.
function handleButtonPress(userId: string, state: UserState, id: string): OutgoingReply {
  // Global menu buttons
  if (id === 'main_book' || id === 'book_another') {
    resetToBooking(userId);
    return emergencyCheckMessage();
  }
  if (id === 'main_list' || id === 'view_list') {
    return listAppointmentsMessage(userId);
  }
  if (id === 'main_help') {
    return helpMessage();
  }

  // Emergency check
  if (id === 'emergency_yes') {
    userStates.delete(userId);
    return {
      kind: 'buttons',
      text:
        `🚨 If this is a medical emergency, please call us immediately at ${CLINIC_EMERGENCY_PHONE} or go to your nearest emergency room.\n\n` +
        `This chat is for scheduling non-emergency appointments only.`,
      buttons: [{ id: 'main_menu', title: 'Main Menu' }],
    };
  }
  if (id === 'emergency_no') {
    state.step = 'PATIENT_TYPE';
    return [{ kind: 'text', text: '👍 Good to hear.' }, patientTypeMessage()];
  }

  // Patient type
  if (id === 'ptype_new' || id === 'ptype_returning') {
    state.data.patientType = id === 'ptype_new' ? 'New Patient' : 'Returning Patient';
    state.step = 'NAME';
    return { kind: 'text', text: "Got it 👍. What's your full name?" };
  }

  // Department (list)
  if (id.startsWith('dept_')) {
    state.data.department = DEPARTMENTS[id] || 'Other / Not sure';
    state.step = 'DATE';
    return [{ kind: 'text', text: `Noted — ${state.data.department}. 🏥` }, dateMessage()];
  }

  // Date
  if (id === 'date_today' || id === 'date_tomorrow') {
    state.data.preferredDate = formatRelativeDate(id === 'date_today' ? 0 : 1);
    state.step = 'TIME';
    return [{ kind: 'text', text: `📅 Noted: ${state.data.preferredDate}.` }, timeMessage()];
  }
  if (id === 'date_other') {
    state.step = 'DATE_CUSTOM';
    return { kind: 'text', text: "📅 Please type your preferred date (e.g. '2026-08-20')." };
  }

  // Time
  if (id === 'time_morning' || id === 'time_afternoon' || id === 'time_evening') {
    state.data.preferredTime =
      id === 'time_morning' ? 'Morning (9 AM - 12 PM)' : id === 'time_afternoon' ? 'Afternoon (12 PM - 4 PM)' : 'Evening (4 PM - 7 PM)';
    state.step = 'SYMPTOMS';
    return [{ kind: 'text', text: `⏰ Noted: ${state.data.preferredTime}.` }, symptomsMessage()];
  }

  // Symptoms
  if (id === 'symptoms_skip') {
    state.data.symptoms = 'Not provided';
    state.step = 'INSURANCE';
    return insuranceMessage();
  }

  // Insurance
  if (id === 'insurance_yes' || id === 'insurance_no') {
    state.data.hasInsurance = id === 'insurance_yes' ? 'Yes' : 'No';
    state.step = 'CONFIRMATION';
    return [{ kind: 'text', text: 'Thanks! Almost done. 🙏' }, confirmationMessage(state.data)];
  }

  // Confirmation
  if (id === 'confirm_yes') {
    if (!appointments.has(userId)) appointments.set(userId, []);
    appointments.get(userId)!.push({ ...state.data, createdAt: new Date().toISOString() });
    userStates.delete(userId);
    return {
      kind: 'buttons',
      text: '✅ APPOINTMENT CONFIRMED!\n\nThank you! We look forward to seeing you. 🙏',
      buttons: [
        { id: 'view_list', title: 'View Appointments' },
        { id: 'book_another', title: 'Book Another' },
      ],
    };
  }
  if (id === 'confirm_no') {
    userStates.delete(userId);
    return {
      kind: 'buttons',
      text: '❌ Booking cancelled. No worries — you can start again anytime.',
      buttons: [{ id: 'main_book', title: 'Book Appointment' }],
    };
  }

  // Main menu fallback (from "Main Menu" button after emergency, etc.)
  if (id === 'main_menu') {
    userStates.delete(userId);
    return mainMenuMessage();
  }

  // Unrecognized button id
  return {
    kind: 'buttons',
    text: "Sorry, I didn't recognize that option. Here's the main menu:",
    buttons: mainMenuButtons(),
  };
}

// ============================================
// TEXT MESSAGE HANDLER
// ============================================
function handleTextMessage(userId: string, state: UserState, message: string): OutgoingReply {
  const lowerMessage = message.toLowerCase().trim();

  // Global commands, available at any step
  if (lowerMessage === 'cancel' || lowerMessage === 'exit') {
    userStates.delete(userId);
    return {
      kind: 'buttons',
      text: '❌ Cancelled.',
      buttons: [{ id: 'main_book', title: 'Book Appointment' }],
    };
  }
  if (lowerMessage === 'help') {
    return helpMessage();
  }
  if (lowerMessage === 'list') {
    return listAppointmentsMessage(userId);
  }

  switch (state.step) {
    case 'GREETING':
      state.step = 'MENU';
      return [
        {
          kind: 'text',
          text: `🏥 *Welcome to ${CLINIC_NAME}!* 👋\n\nI'm your virtual assistant, here to help you book an appointment quickly and easily.`,
        },
        { kind: 'buttons', text: 'How can I help you today?', buttons: mainMenuButtons() },
      ];

    case 'MENU':
      return {
        kind: 'buttons',
        text: 'Please choose one of the options below 👇',
        buttons: mainMenuButtons(),
      };

    case 'NAME':
      if (message.trim().length < 2) {
        return { kind: 'text', text: 'Please enter a valid name (at least 2 characters).' };
      }
      state.data.patientName = message.trim();
      state.step = 'DEPARTMENT';
      return [{ kind: 'text', text: `Nice to meet you, ${state.data.patientName}! 🙏` }, departmentMessage()];

    case 'DATE_CUSTOM':
      if (message.trim().length < 2) {
        return { kind: 'text', text: 'Please enter a valid date.' };
      }
      state.data.preferredDate = message.trim();
      state.step = 'TIME';
      return timeMessage();

    case 'SYMPTOMS':
      state.data.symptoms = message.trim();
      state.step = 'INSURANCE';
      return insuranceMessage();

    // Steps that expect a button/list tap, not free text
    case 'EMERGENCY_CHECK':
      return emergencyCheckMessage();
    case 'PATIENT_TYPE':
      return patientTypeMessage();
    case 'DEPARTMENT':
      return departmentMessage();
    case 'DATE':
      return dateMessage();
    case 'TIME':
      return timeMessage();
    case 'INSURANCE':
      return insuranceMessage();
    case 'CONFIRMATION':
      return confirmationMessage(state.data);

    default:
      userStates.delete(userId);
      return { kind: 'buttons', text: "I didn't understand that. Let's start fresh 👇", buttons: mainMenuButtons() };
  }
}

// ============================================
// MESSAGE BUILDERS (one per step)
// ============================================
function mainMenuButtons() {
  return [
    { id: 'main_book', title: 'Book Appointment' },
    { id: 'main_list', title: 'My Appointments' },
    { id: 'main_help', title: 'Help' },
  ];
}

function mainMenuMessage(): OutgoingMessage {
  return { kind: 'buttons', text: 'What would you like to do?', buttons: mainMenuButtons() };
}

function emergencyCheckMessage(): OutgoingMessage {
  return {
    kind: 'buttons',
    text: '🏥 Before we begin — is this a medical emergency?',
    buttons: [
      { id: 'emergency_yes', title: 'Yes, Emergency' },
      { id: 'emergency_no', title: 'No, Not Urgent' },
    ],
  };
}

function patientTypeMessage(): OutgoingMessage {
  return {
    kind: 'buttons',
    text: 'Are you a new or returning patient?',
    buttons: [
      { id: 'ptype_new', title: 'New Patient' },
      { id: 'ptype_returning', title: 'Returning Patient' },
    ],
  };
}

function departmentMessage(): OutgoingMessage {
  return {
    kind: 'list',
    text: '🏥 Which department would you like to visit?',
    buttonText: 'Select Department',
    sections: [
      {
        title: 'Departments',
        rows: Object.entries(DEPARTMENTS).map(([id, title]) => ({ id, title })),
      },
    ],
  };
}

function dateMessage(): OutgoingMessage {
  return {
    kind: 'buttons',
    text: '📅 What date would you prefer?',
    buttons: [
      { id: 'date_today', title: 'Today' },
      { id: 'date_tomorrow', title: 'Tomorrow' },
      { id: 'date_other', title: 'Pick a Date' },
    ],
  };
}

function timeMessage(): OutgoingMessage {
  return {
    kind: 'buttons',
    text: '⏰ What time works best?',
    buttons: [
      { id: 'time_morning', title: 'Morning' },
      { id: 'time_afternoon', title: 'Afternoon' },
      { id: 'time_evening', title: 'Evening' },
    ],
  };
}

function symptomsMessage(): OutgoingMessage {
  return {
    kind: 'buttons',
    text: "🩺 Please briefly describe your symptoms or reason for the visit (type it below), or tap Skip.",
    buttons: [{ id: 'symptoms_skip', title: 'Skip' }],
  };
}

function insuranceMessage(): OutgoingMessage {
  return {
    kind: 'buttons',
    text: '💳 Do you have health insurance you plan to use for this visit?',
    buttons: [
      { id: 'insurance_yes', title: 'Yes' },
      { id: 'insurance_no', title: 'No' },
    ],
  };
}

function confirmationMessage(data: AppointmentData): OutgoingMessage {
  return {
    kind: 'buttons',
    text:
      '📋 Please confirm your appointment details:\n\n' +
      `👤 Name: ${field(data.patientName)}\n` +
      `🏷️ Patient Type: ${field(data.patientType)}\n` +
      `🏥 Department: ${field(data.department)}\n` +
      `📅 Date: ${field(data.preferredDate)}\n` +
      `⏰ Time: ${field(data.preferredTime)}\n` +
      `🩺 Symptoms: ${field(data.symptoms)}\n` +
      `💳 Insurance: ${field(data.hasInsurance)}\n\n` +
      'Is this correct?',
    buttons: [
      { id: 'confirm_yes', title: 'Confirm' },
      { id: 'confirm_no', title: 'Cancel' },
    ],
  };
}

function helpMessage(): OutgoingMessage {
  return {
    kind: 'buttons',
    text:
      '🤖 Here is how I can help:\n\n' +
      "• Tap 'Book Appointment' to schedule a visit\n" +
      "• Tap 'My Appointments' to see your bookings\n" +
      "• Type 'cancel' anytime to stop the current booking",
    buttons: [
      { id: 'main_book', title: 'Book Appointment' },
      { id: 'main_list', title: 'My Appointments' },
    ],
  };
}

function listAppointmentsMessage(userId: string): OutgoingMessage {
  const userApps = appointments.get(userId) || [];
  if (userApps.length === 0) {
    return {
      kind: 'buttons',
      text: '📋 You have no appointments yet.',
      buttons: [{ id: 'main_book', title: 'Book Appointment' }],
    };
  }

  let msg = '📋 YOUR APPOINTMENTS:\n\n';
  userApps.forEach((app, i) => {
    msg += `${i + 1}. ${field(app.patientName)} — ${field(app.department)}\n`;
    msg += `   📅 ${field(app.preferredDate)} at ${field(app.preferredTime)}\n\n`;
  });

  return {
    kind: 'buttons',
    text: msg.trim(),
    buttons: [{ id: 'main_book', title: 'Book Another' }],
  };
}

// ============================================
// SMALL UTILITIES
// ============================================
function formatRelativeDate(daysFromToday: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysFromToday);
  return d.toISOString().split('T')[0];
}

function truncate(text: string, max: number): string {
  return text.length > max ? text.slice(0, max - 1) + '…' : text;
}

// ============================================
// WHATSAPP API
// ============================================
async function sendWhatsAppMessage(to: string, message: OutgoingMessage) {
  try {
    const url = `https://graph.facebook.com/v18.0/${process.env.PHONE_NUMBER_ID}/messages`;
    let data: Record<string, unknown>;

    if (message.kind === 'text') {
      data = {
        messaging_product: 'whatsapp',
        to,
        type: 'text',
        text: { body: message.text },
      };
    } else if (message.kind === 'buttons') {
      data = {
        messaging_product: 'whatsapp',
        to,
        type: 'interactive',
        interactive: {
          type: 'button',
          ...(message.header ? { header: { type: 'text', text: truncate(message.header, 60) } } : {}),
          body: { text: message.text },
          ...(message.footer ? { footer: { text: message.footer } } : {}),
          action: {
            buttons: message.buttons.slice(0, 3).map((b) => ({
              type: 'reply',
              reply: { id: b.id, title: truncate(b.title, 20) },
            })),
          },
        },
      };
    } else {
      data = {
        messaging_product: 'whatsapp',
        to,
        type: 'interactive',
        interactive: {
          type: 'list',
          ...(message.header ? { header: { type: 'text', text: truncate(message.header, 60) } } : {}),
          body: { text: message.text },
          ...(message.footer ? { footer: { text: message.footer } } : {}),
          action: {
            button: truncate(message.buttonText, 20),
            sections: message.sections.map((s) => ({
              ...(s.title ? { title: truncate(s.title, 24) } : {}),
              rows: s.rows.slice(0, 10).map((r) => ({
                id: r.id,
                title: truncate(r.title, 24),
                ...(r.description ? { description: truncate(r.description, 72) } : {}),
              })),
            })),
          },
        },
      };
    }

    const response = await axios.post(url, data, {
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('✅ Message sent');
    return response.data;
  } catch (error) {
    console.error('❌ Error sending message:', error);
    throw error;
  }
}