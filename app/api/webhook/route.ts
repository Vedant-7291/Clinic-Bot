import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

// ============================================
// IN-MEMORY STORAGE
// ============================================
const userStates = new Map();
const appointments = new Map();

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

    // Check if verify token is configured
    if (!process.env.VERIFY_TOKEN) {
      console.error('❌ VERIFY_TOKEN not set in environment variables');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Verify the webhook
    if (mode === 'subscribe' && token === process.env.VERIFY_TOKEN) {
      console.log('✅ Webhook verified successfully!');
      // Return challenge as plain text
      return new NextResponse(challenge, {
        status: 200,
        headers: {
          'Content-Type': 'text/plain',
        },
      });
    } else {
      console.error('❌ Verification failed');
      return NextResponse.json(
        { error: 'Verification failed' },
        { status: 403 }
      );
    }
  } catch (error) {
    console.error('❌ Error in webhook verification:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ============================================
// HANDLE INCOMING MESSAGES - POST
// ============================================
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('📨 Webhook received:', JSON.stringify(body, null, 2));

    // Check if it's a WhatsApp message
    if (body.object !== 'whatsapp_business_account') {
      return NextResponse.json({ status: 'ignored' });
    }

    // Process messages
    for (const entry of body.entry || []) {
      for (const change of entry.changes || []) {
        const value = change.value;

        // Handle status updates
        if (value.statuses && value.statuses.length > 0) {
          console.log('📊 Status update:', value.statuses[0].status);
          continue;
        }

        // Handle messages
        if (value.messages && value.messages.length > 0) {
          const message = value.messages[0];
          const from = message.from;
          const text = message.text?.body;

          if (text) {
            console.log(`📨 From ${from}: ${text}`);
            
            // Process the message
            const reply = await processMessage(from, text);
            
            // Send reply
            await sendWhatsAppMessage(from, reply);
          }
        }
      }
    }

    return NextResponse.json({ status: 'success' });
  } catch (error) {
    console.error('❌ Webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ============================================
// BOT LOGIC
// ============================================
async function processMessage(userId: string, message: string): Promise<string> {
  const lowerMessage = message.toLowerCase().trim();

  // Get or create user state
  if (!userStates.has(userId)) {
    userStates.set(userId, {
      step: 'GREETING',
      data: { phoneNumber: userId }
    });
  }

  const state = userStates.get(userId);

  // Handle commands
  if (lowerMessage === 'cancel' || lowerMessage === 'exit') {
    userStates.delete(userId);
    return "❌ Cancelled. Type 'hello' to start over.";
  }

  if (lowerMessage === 'help') {
    return getHelpMessage();
  }

  if (lowerMessage === 'list') {
    return listAppointments(userId);
  }

  // Handle conversation flow
  switch (state.step) {
    case 'GREETING':
      if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || 
          lowerMessage.includes('book') || lowerMessage.includes('appointment')) {
        state.step = 'NAME';
        return "👋 Welcome! What's your full name?";
      }
      return "👋 Hello! Type 'hello' to book an appointment or 'help' for options.";

    case 'NAME':
      if (message.length < 2) {
        return "Please enter a valid name (at least 2 characters).";
      }
      state.data.patientName = message;
      state.step = 'DATE';
      return `Nice to meet you, ${message}! 📅 What date would you prefer? (e.g., 'tomorrow' or '2026-08-20')`;

    case 'DATE':
      if (message.length < 2) {
        return "Please enter a valid date.";
      }
      state.data.preferredDate = message;
      state.step = 'TIME';
      return "⏰ What time? (e.g., '10:30 AM' or 'morning')";

    case 'TIME':
      state.data.preferredTime = message;
      state.step = 'SYMPTOMS';
      return "🏥 Please describe your symptoms or type 'skip'.";

    case 'SYMPTOMS':
      state.data.symptoms = message.toLowerCase() === 'skip' ? 'Not provided' : message;
      state.step = 'CONFIRMATION';
      
      const appointment = state.data;
      return "📋 Confirm your appointment:\n\n" +
             `👤 Name: ${appointment.patientName}\n` +
             `📅 Date: ${appointment.preferredDate}\n` +
             `⏰ Time: ${appointment.preferredTime}\n` +
             `🏥 Symptoms: ${appointment.symptoms}\n\n` +
             "Type 'yes' to confirm or 'no' to cancel.";

    case 'CONFIRMATION':
      if (lowerMessage === 'yes' || lowerMessage === 'confirm') {
        // Save appointment
        if (!appointments.has(userId)) {
          appointments.set(userId, []);
        }
        appointments.get(userId).push({
          ...state.data,
          createdAt: new Date().toISOString()
        });

        userStates.delete(userId);
        return "✅ APPOINTMENT CONFIRMED!\n\n" +
               "Thank you! We'll see you soon. 🙏\n\n" +
               "Type 'list' to view all appointments.";
      } else if (lowerMessage === 'no' || lowerMessage === 'cancel') {
        userStates.delete(userId);
        return "❌ Cancelled. Type 'hello' to start over.";
      }
      return "Please type 'yes' or 'no'.";

    default:
      return "I didn't understand. Type 'help' for options.";
  }
}

// ============================================
// HELPER FUNCTIONS
// ============================================
function getHelpMessage(): string {
  return "🤖 Commands:\n" +
         "• 'hello' - Book appointment\n" +
         "• 'list' - View appointments\n" +
         "• 'cancel' - Cancel\n" +
         "• 'help' - This message";
}

function listAppointments(userId: string): string {
  const userApps = appointments.get(userId) || [];
  if (userApps.length === 0) {
    return "📋 No appointments found. Type 'hello' to book one!";
  }

  let msg = "📋 YOUR APPOINTMENTS:\n\n";
  userApps.forEach((app: any, i: number) => {
    msg += `${i+1}. ${app.patientName}\n`;
    msg += `   📅 ${app.preferredDate} at ${app.preferredTime}\n\n`;
  });
  return msg;
}

// ============================================
// WHATSAPP API
// ============================================
async function sendWhatsAppMessage(to: string, message: string) {
  try {
    const url = `https://graph.facebook.com/v18.0/${process.env.PHONE_NUMBER_ID}/messages`;
    
    const data = {
      messaging_product: 'whatsapp',
      to: to,
      type: 'text',
      text: { body: message }
    };

    const response = await axios.post(url, data, {
      headers: {
        'Authorization': `Bearer ${process.env.WHATSAPP_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Message sent');
    return response.data;
  } catch (error) {
    console.error('❌ Error sending message:', error);
    throw error;
  }
}