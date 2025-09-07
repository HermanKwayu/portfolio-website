import { projectId, publicAnonKey } from '../utils/supabase/info';

interface EventData {
  title: string;
  description: string;
  type: string;
  date: string;
  time: string;
  venue: string;
  address: string;
  dresscode: string;
  maxGuests: number;
  rsvpDeadline: string;
  settings: {
    allowPlusOnes: boolean;
    requireRSVP: boolean;
    enableQRScanning: boolean;
    sendReminders: boolean;
    collectDietaryInfo: boolean;
    enablePhotoSharing: boolean;
  };
}

interface GuestData {
  name: string;
  email: string;
  phone: string;
  category: 'regular' | 'vip' | 'speaker' | 'staff';
  plusOnes: number;
  dietaryRestrictions: string;
}

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-4d80a1b0`;

class EventManagerAPI {
  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'API request failed');
    }

    return response.json();
  }

  async createEvent(eventData: EventData) {
    return this.makeRequest('/events', {
      method: 'POST',
      body: JSON.stringify(eventData),
    });
  }

  async getEvents() {
    return this.makeRequest('/events');
  }

  async getEvent(eventId: string) {
    return this.makeRequest(`/events/${eventId}`);
  }

  async addGuest(eventId: string, guestData: GuestData) {
    return this.makeRequest(`/events/${eventId}/guests`, {
      method: 'POST',
      body: JSON.stringify(guestData),
    });
  }

  async sendInvitations(eventId: string, channels: string[]) {
    return this.makeRequest(`/events/${eventId}/invitations`, {
      method: 'POST',
      body: JSON.stringify({ channels }),
    });
  }

  async checkInGuest(eventId: string, guestId: string, qrCode?: string) {
    return this.makeRequest(`/events/${eventId}/checkin`, {
      method: 'POST',
      body: JSON.stringify({ guestId, qrCode }),
    });
  }

  async getEventAnalytics(eventId: string) {
    return this.makeRequest(`/events/${eventId}/analytics`);
  }

  // Generate WhatsApp message link
  generateWhatsAppLink(phone: string, message: string) {
    const cleanPhone = phone.replace(/[^\d+]/g, '');
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
  }

  // Generate invitation message template
  generateInvitationMessage(eventData: any, guestName: string, qrCode: string) {
    return `🎉 You're Invited! 

Hi ${guestName}!

You're cordially invited to:
📅 *${eventData.title}*
📍 ${eventData.venue}
🕐 ${new Date(eventData.date).toLocaleDateString()} at ${eventData.time}

${eventData.description}

Your personal invitation code: ${qrCode}

Please confirm your attendance by ${new Date(eventData.rsvpDeadline).toLocaleDateString()}.

Best regards,
${eventData.organizer || 'Event Organizer'}`;
  }

  // Generate email invitation HTML
  generateEmailInvitation(eventData: any, guestName: string, qrCode: string) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
        .content { padding: 30px; }
        .event-details { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .qr-section { background: #e8f4f8; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0; }
        .cta-button { display: inline-block; background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🎉 You're Invited!</h1>
        <p>${eventData.title}</p>
      </div>
      
      <div class="content">
        <h2>Hello ${guestName}!</h2>
        <p>You're cordially invited to join us for this special event.</p>
        
        <div class="event-details">
          <h3>📅 Event Details</h3>
          <p><strong>Event:</strong> ${eventData.title}</p>
          <p><strong>Date:</strong> ${new Date(eventData.date).toLocaleDateString()}</p>
          <p><strong>Time:</strong> ${eventData.time}</p>
          <p><strong>Venue:</strong> ${eventData.venue}</p>
          <p><strong>Address:</strong> ${eventData.address}</p>
          ${eventData.dresscode ? `<p><strong>Dress Code:</strong> ${eventData.dresscode}</p>` : ''}
        </div>

        <div class="qr-section">
          <h3>🎫 Your Personal Invitation</h3>
          <p>Use this code for entry: <strong>${qrCode}</strong></p>
          <p style="font-size: 12px; color: #666;">Show this email at the entrance or scan your QR code</p>
        </div>

        <div style="text-align: center;">
          <a href="#" class="cta-button">Confirm Attendance</a>
        </div>

        <p><strong>RSVP by:</strong> ${new Date(eventData.rsvpDeadline).toLocaleDateString()}</p>
        
        <hr style="margin: 30px 0;">
        <p style="font-size: 14px; color: #666;">
          This invitation was sent by Herman Kwayu Event Management System.<br>
          For questions, please contact the event organizer.
        </p>
      </div>
    </body>
    </html>`;
  }

  // Analytics helpers
  calculateEventStats(events: any[]) {
    const stats = {
      totalEvents: events.length,
      totalGuests: 0,
      totalConfirmed: 0,
      totalCheckedIn: 0,
      avgResponseRate: 0,
      avgCheckInRate: 0,
      eventTypes: {} as Record<string, number>,
    };

    events.forEach(event => {
      const guests = event.guests || [];
      stats.totalGuests += guests.length;
      stats.totalConfirmed += guests.filter((g: any) => g.status === 'confirmed').length;
      stats.totalCheckedIn += guests.filter((g: any) => g.status === 'checked-in').length;
      
      stats.eventTypes[event.type] = (stats.eventTypes[event.type] || 0) + 1;
    });

    if (events.length > 0) {
      stats.avgResponseRate = Math.round((stats.totalConfirmed / stats.totalGuests) * 100) || 0;
      stats.avgCheckInRate = Math.round((stats.totalCheckedIn / stats.totalGuests) * 100) || 0;
    }

    return stats;
  }

  // Validation helpers
  validateEventData(eventData: Partial<EventData>): string[] {
    const errors: string[] = [];

    if (!eventData.title?.trim()) errors.push('Event title is required');
    if (!eventData.date) errors.push('Event date is required');
    if (!eventData.time) errors.push('Event time is required');
    if (!eventData.venue?.trim()) errors.push('Venue is required');
    if (!eventData.address?.trim()) errors.push('Address is required');
    if (!eventData.rsvpDeadline) errors.push('RSVP deadline is required');
    if (eventData.maxGuests && eventData.maxGuests < 1) errors.push('Maximum guests must be at least 1');

    // Date validations
    if (eventData.date && new Date(eventData.date) < new Date()) {
      errors.push('Event date cannot be in the past');
    }

    if (eventData.rsvpDeadline && eventData.date && new Date(eventData.rsvpDeadline) >= new Date(eventData.date)) {
      errors.push('RSVP deadline must be before the event date');
    }

    return errors;
  }

  validateGuestData(guestData: Partial<GuestData>): string[] {
    const errors: string[] = [];

    if (!guestData.name?.trim()) errors.push('Guest name is required');
    if (!guestData.email?.trim() && !guestData.phone?.trim()) {
      errors.push('Either email or phone number is required');
    }

    // Email validation
    if (guestData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestData.email)) {
      errors.push('Invalid email format');
    }

    // Phone validation (basic)
    if (guestData.phone && !/^[\+]?[\d\s\-\(\)]{10,}$/.test(guestData.phone)) {
      errors.push('Invalid phone number format');
    }

    if (guestData.plusOnes && guestData.plusOnes < 0) {
      errors.push('Plus ones cannot be negative');
    }

    return errors;
  }
}

export const eventAPI = new EventManagerAPI();
export type { EventData, GuestData };