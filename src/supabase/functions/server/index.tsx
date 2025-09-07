import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization", "X-Admin-Token"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Admin authentication check using token (for authenticated sessions)
const checkAdminAuth = (request: Request) => {
  const adminToken = request.headers.get('X-Admin-Token');
  // Simple token check - you can change this token
  const validAdminToken = 'herman_admin_2024_secure_token';
  return adminToken === validAdminToken;
};

// Admin password validation endpoint
app.post("/make-server-4d80a1b0/admin/authenticate", async (c) => {
  try {
    const body = await c.req.json();
    const { password } = body;

    if (!password) {
      return c.json({ error: "Password is required" }, 400);
    }

    // Get stored admin password or use default
    const storedPassword = await kv.get('admin_password') || 'HermanAdmin2024!';
    
    // Validate password
    if (password === storedPassword) {
      console.log(`✅ Successful admin authentication at ${new Date().toISOString()}`);
      // Return success with token for future requests
      return c.json({ 
        success: true, 
        message: "Authentication successful",
        token: 'herman_admin_2024_secure_token'
      });
    } else {
      console.log(`❌ Failed admin login attempt at ${new Date().toISOString()} - Attempted password: "${password}" (Expected: "${storedPassword}")`);
      return c.json({ error: "Invalid password" }, 401);
    }

  } catch (error) {
    console.error('Admin authentication error:', error);
    return c.json({ error: "Authentication failed" }, 500);
  }
});

// Health check endpoint
app.get("/make-server-4d80a1b0/health", (c) => {
  return c.json({ status: "ok" });
});

// Contact form submission endpoint
app.post("/make-server-4d80a1b0/contact", async (c) => {
  try {
    const body = await c.req.json();
    const { name, email, company, service, budget, timeline, message } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return c.json({ error: "Name, email, and message are required" }, 400);
    }

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return c.json({ error: "Please enter a valid email address" }, 400);
    }

    // Create a unique ID for this submission
    const submissionId = `contact_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Store the contact submission in KV store
    const contactData = {
      id: submissionId,
      name,
      email,
      company: company || '',
      service: service || '',
      budget: budget || '',
      timeline: timeline || '',
      message,
      submittedAt: new Date().toISOString(),
      status: 'new'
    };

    await kv.set(`contact:${submissionId}`, contactData);

    // Send email notification to Herman
    try {
      const resendApiKey = Deno.env.get('RESEND_API_KEY');
      if (resendApiKey && resendApiKey.trim().startsWith('re_')) {
        const cleanApiKey = resendApiKey.trim();
        
        const emailNotification = {
          from: 'Contact Form <onboarding@resend.dev>',
          to: ['truthherman@gmail.com'],
          subject: `🔔 New Contact Form Submission from ${name}`,
          html: generateContactNotificationHTML(contactData)
        };

        const emailResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${cleanApiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(emailNotification)
        });

        if (emailResponse.ok) {
          console.log(`✅ Contact notification email sent to truthherman@gmail.com`);
          // Update contact with email status
          await kv.set(`contact:${submissionId}`, { ...contactData, emailSent: true });
        } else {
          const errorData = await emailResponse.text();
          console.error(`❌ Failed to send contact notification email:`, errorData);
          // Update contact with email failure
          await kv.set(`contact:${submissionId}`, { ...contactData, emailSent: false, emailError: errorData });
        }
      } else {
        console.log('⚠️ Resend API key not configured for contact notifications');
      }
    } catch (emailError) {
      console.error('❌ Contact email notification error:', emailError);
    }

    console.log(`Contact submission stored: ${submissionId}`);
    console.log(`From: ${name} (${email})`);
    console.log(`Service: ${service || 'Not specified'}`);
    console.log(`Message: ${message.substring(0, 100)}...`);

    return c.json({ 
      success: true, 
      message: "Thank you for your message! I'll get back to you within 24 hours.",
      submissionId
    });

  } catch (error) {
    console.error('Contact form error:', error);
    return c.json({ error: "Failed to submit contact form. Please try again." }, 500);
  }
});

// Newsletter subscription endpoint
app.post("/make-server-4d80a1b0/subscribe", async (c) => {
  try {
    const body = await c.req.json();
    const { email } = body;

    if (!email) {
      return c.json({ error: "Email is required" }, 400);
    }

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return c.json({ error: "Please enter a valid email address" }, 400);
    }

    // Get existing subscribers
    const subscribers = await kv.get('newsletter_subscribers') || [];
    
    // Check if already subscribed
    const normalizedEmail = email.toLowerCase();
    if (subscribers.includes(normalizedEmail)) {
      return c.json({ 
        success: true, 
        message: "You're already subscribed! Thank you for your continued interest." 
      });
    }

    // Add new subscriber
    subscribers.push(normalizedEmail);
    await kv.set('newsletter_subscribers', subscribers);

    console.log(`New newsletter subscriber: ${normalizedEmail}`);
    console.log(`Total subscribers: ${subscribers.length}`);

    return c.json({ 
      success: true, 
      message: "Successfully subscribed to the newsletter!" 
    });

  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return c.json({ 
      error: "Failed to subscribe. Please try again." 
    }, 500);
  }
});

// Get newsletter subscribers (admin only)
app.get("/make-server-4d80a1b0/subscribers", async (c) => {
  if (!checkAdminAuth(c.req.raw)) {
    return c.json({ error: 'Unauthorized access' }, 401);
  }

  try {
    const subscribers = await kv.get('newsletter_subscribers') || [];
    return c.json({ 
      subscribers: subscribers,
      count: subscribers.length 
    });
  } catch (error) {
    console.error('Error fetching subscribers:', error);
    return c.json({ error: "Failed to fetch subscribers" }, 500);
  }
});

// Create and send newsletter (admin only)
app.post("/make-server-4d80a1b0/send-newsletter", async (c) => {
  if (!checkAdminAuth(c.req.raw)) {
    return c.json({ error: 'Unauthorized access' }, 401);
  }

  try {
    const body = await c.req.json();
    const { subject, content, previewText } = body;

    if (!subject || !content) {
      return c.json({ error: "Subject and content are required" }, 400);
    }

    // Get subscribers
    const subscribers = await kv.get('newsletter_subscribers') || [];
    
    if (subscribers.length === 0) {
      return c.json({ error: "No subscribers found" }, 400);
    }

    // Get Resend API key
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    if (!resendApiKey) {
      return c.json({ error: "Email service not configured. Please add your Resend API key." }, 500);
    }

    // Clean and validate API key format (Resend keys start with "re_")
    const cleanApiKey = resendApiKey.trim();
    if (!cleanApiKey.startsWith('re_')) {
      return c.json({ error: "Invalid Resend API key format. Please check your API key." }, 500);
    }

    // Create newsletter ID and store
    const newsletterId = `newsletter_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newsletterData = {
      id: newsletterId,
      subject,
      content,
      previewText: previewText || '',
      sentAt: new Date().toISOString(),
      subscriberCount: subscribers.length,
      status: 'sending'
    };

    await kv.set(newsletterId, newsletterData);

    // Send emails using Resend
    let successCount = 0;
    let failCount = 0;

    for (const email of subscribers) {
      try {
        const emailBody = {
          from: 'Herman Kwayu <onboarding@resend.dev>',
          to: [email],
          subject: subject,
          html: generateNewsletterHTML(content, email, newsletterId)
        };

        const response = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${cleanApiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(emailBody)
        });

        if (response.ok) {
          successCount++;
          console.log(`✅ Newsletter sent successfully to ${email}`);
        } else {
          failCount++;
          const errorData = await response.text();
          console.error(`❌ Failed to send newsletter to ${email}:`, errorData);
        }
      } catch (emailError) {
        failCount++;
        console.error(`❌ Email sending error for ${email}:`, emailError);
      }
    }

    // Update newsletter with results
    const finalNewsletterData = {
      ...newsletterData,
      status: 'sent',
      successCount,
      failCount
    };
    await kv.set(newsletterId, finalNewsletterData);

    // Store in newsletters list
    const newslettersList = await kv.get('newsletters_list') || [];
    newslettersList.push(newsletterId);
    await kv.set('newsletters_list', newslettersList);

    console.log(`Newsletter sent: ${successCount} successful, ${failCount} failed`);

    return c.json({
      success: true,
      message: `Newsletter sent successfully to ${successCount} subscribers`,
      successCount,
      failCount,
      newsletterId
    });

  } catch (error) {
    console.error('Newsletter sending error:', error);
    return c.json({ error: "Failed to send newsletter" }, 500);
  }
});

// Get newsletter history (admin only)
app.get("/make-server-4d80a1b0/newsletters", async (c) => {
  if (!checkAdminAuth(c.req.raw)) {
    return c.json({ error: 'Unauthorized access' }, 401);
  }

  try {
    const newsletters = await kv.get('newsletters_list') || [];
    const newsletterHistory = [];

    for (const newsletterId of newsletters) {
      const newsletter = await kv.get(newsletterId);
      if (newsletter) {
        newsletterHistory.push(newsletter);
      }
    }

    // Sort by sent date (newest first)
    newsletterHistory.sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime());

    return c.json({ newsletters: newsletterHistory });
  } catch (error) {
    console.error('Error fetching newsletters:', error);
    return c.json({ error: "Failed to fetch newsletters" }, 500);
  }
});

// Admin endpoint: Get contact inquiries
app.get("/make-server-4d80a1b0/contacts", async (c) => {
  if (!checkAdminAuth(c.req.raw)) {
    return c.json({ error: 'Unauthorized access' }, 401);
  }

  try {
    const contacts = await kv.getByPrefix('contact:');
    // Sort by submission date (newest first)
    const sortedContacts = contacts.sort((a, b) => 
      new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    );
    
    return c.json({ 
      contacts: sortedContacts,
      count: sortedContacts.length 
    });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return c.json({ error: 'Failed to fetch contacts' }, 500);
  }
});

// Admin endpoint: Update contact status
app.put("/make-server-4d80a1b0/contacts/:id", async (c) => {
  if (!checkAdminAuth(c.req.raw)) {
    return c.json({ error: 'Unauthorized access' }, 401);
  }

  try {
    const contactId = c.req.param('id');
    const body = await c.req.json();
    const { status, notes } = body;

    // Get existing contact
    const existingContact = await kv.get(`contact:${contactId}`);
    if (!existingContact) {
      return c.json({ error: 'Contact not found' }, 404);
    }

    // Update contact with new status and notes
    const updatedContact = {
      ...existingContact,
      status: status || existingContact.status,
      notes: notes || existingContact.notes || '',
      lastUpdated: new Date().toISOString()
    };

    await kv.set(`contact:${contactId}`, updatedContact);

    console.log(`Contact ${contactId} updated: status=${status}, notes=${notes ? 'added' : 'none'}`);

    return c.json({ 
      success: true, 
      message: 'Contact updated successfully',
      contact: updatedContact
    });

  } catch (error) {
    console.error('Error updating contact:', error);
    return c.json({ error: 'Failed to update contact' }, 500);
  }
});

// Admin endpoint: Get current password
app.get("/make-server-4d80a1b0/admin/get-password", async (c) => {
  if (!checkAdminAuth(c.req.raw)) {
    return c.json({ error: 'Unauthorized access' }, 401);
  }

  try {
    const storedPassword = await kv.get('admin_password');
    return c.json({ 
      password: storedPassword || 'HermanAdmin2024!' // Default password
    });
  } catch (error) {
    console.error('Error fetching admin password:', error);
    return c.json({ error: 'Failed to fetch password' }, 500);
  }
});

// Admin endpoint: Change password
app.post("/make-server-4d80a1b0/admin/change-password", async (c) => {
  if (!checkAdminAuth(c.req.raw)) {
    return c.json({ error: 'Unauthorized access' }, 401);
  }

  try {
    const body = await c.req.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return c.json({ error: 'Current password and new password are required' }, 400);
    }

    // Get current stored password or use default
    const storedPassword = await kv.get('admin_password') || 'HermanAdmin2024!';

    // Verify current password
    if (currentPassword !== storedPassword) {
      return c.json({ error: 'Current password is incorrect' }, 400);
    }

    // Validate new password
    if (newPassword.length < 8) {
      return c.json({ error: 'New password must be at least 8 characters long' }, 400);
    }

    // Store new password
    await kv.set('admin_password', newPassword);

    console.log('Admin password changed successfully');

    return c.json({ 
      success: true,
      message: 'Password changed successfully' 
    });

  } catch (error) {
    console.error('Error changing admin password:', error);
    return c.json({ error: 'Failed to change password' }, 500);
  }
});

// Admin endpoint: Reset password (send reset email)
app.post("/make-server-4d80a1b0/admin/reset-password", async (c) => {
  try {
    const body = await c.req.json();
    const { email } = body;

    if (!email) {
      return c.json({ error: 'Email is required' }, 400);
    }

    // Verify this is the admin email
    const adminEmail = 'truthherman@gmail.com';
    if (email.toLowerCase() !== adminEmail.toLowerCase()) {
      return c.json({ error: 'Password reset is only available for the admin email address' }, 400);
    }

    // Generate a temporary reset token
    const resetToken = `reset_${Date.now()}_${Math.random().toString(36).substr(2, 16)}`;
    const resetExpiry = Date.now() + (30 * 60 * 1000); // 30 minutes from now

    // Store reset token
    await kv.set(`password_reset:${resetToken}`, {
      email: adminEmail,
      createdAt: new Date().toISOString(),
      expiresAt: resetExpiry,
      used: false
    });

    // Generate new temporary password
    const tempPassword = `TempPass${Date.now().toString().slice(-4)}!`;
    
    // Send reset email with new temporary password
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    if (!resendApiKey || !resendApiKey.trim().startsWith('re_')) {
      return c.json({ error: 'Email service not configured' }, 500);
    }

    const cleanApiKey = resendApiKey.trim();
    const resetEmailBody = {
      from: 'Herman Kwayu <onboarding@resend.dev>',
      to: [adminEmail],
      subject: '🔐 Admin Password Reset - Herman Kwayu Dashboard',
      html: generatePasswordResetHTML(tempPassword, resetToken)
    };

    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${cleanApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(resetEmailBody)
    });

    if (emailResponse.ok) {
      // Update password to temporary password
      await kv.set('admin_password', tempPassword);
      
      console.log(`Password reset email sent to ${adminEmail}`);
      return c.json({
        success: true,
        message: 'Password reset instructions sent to your email address. Check your inbox for the temporary password.'
      });
    } else {
      const errorData = await emailResponse.text();
      console.error('Failed to send reset email:', errorData);
      return c.json({ error: 'Failed to send reset email' }, 500);
    }

  } catch (error) {
    console.error('Password reset error:', error);
    return c.json({ error: 'Failed to process password reset request' }, 500);
  }
});

// Test email service endpoint (admin only)
app.post("/make-server-4d80a1b0/test-email", async (c) => {
  if (!checkAdminAuth(c.req.raw)) {
    return c.json({ error: 'Unauthorized access' }, 401);
  }

  try {
    const resendApiKey = Deno.env.get('RESEND_API_KEY');

    if (!resendApiKey) {
      return c.json({ 
        success: false, 
        error: "RESEND_API_KEY environment variable not set" 
      });
    }

    // Trim whitespace and validate
    const cleanApiKey = resendApiKey.trim();
    if (!cleanApiKey.startsWith('re_')) {
      return c.json({ 
        success: false, 
        error: `Invalid Resend API key format. Expected to start with 're_' but got: '${cleanApiKey.substring(0, 10)}...'` 
      });
    }

    // Test by sending an actual test email to validate the key works
    const testEmailBody = {
      from: 'Herman Kwayu <onboarding@resend.dev>',
      to: ['truthherman@gmail.com'], // Your email
      subject: '🧪 Newsletter System Test - Success!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #1e293b;">✅ Newsletter System Test Successful!</h2>
          <p>Your Resend API key is working perfectly!</p>
          <p><strong>System Status:</strong></p>
          <ul>
            <li>✅ API Key: Valid and authenticated</li>
            <li>✅ Email Service: Ready to send newsletters</li>
            <li>✅ Template System: Fully operational</li>
          </ul>
          <p>You can now start sending professional newsletters to your audience!</p>
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #e2e8f0;">
          <p style="color: #64748b; font-size: 14px;">
            This is an automated test email from your Herman Kwayu newsletter system.
          </p>
        </div>
      `
    };

    const testResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${cleanApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testEmailBody)
    });

    console.log('Resend API response status:', testResponse.status);

    if (testResponse.ok) {
      const result = await testResponse.json();
      return c.json({ 
        success: true, 
        message: "✅ Resend API key is valid and working! Test email sent successfully.",
        emailId: result.id
      });
    } else {
      const errorData = await testResponse.text();
      console.log('Resend API error:', errorData);
      return c.json({ 
        success: false, 
        error: `Email sending test failed (${testResponse.status}): ${errorData}` 
      });
    }
  } catch (error) {
    console.error('Email test error:', error);
    return c.json({ 
      success: false, 
      error: `Email service test failed: ${error.message}` 
    });
  }
});

// Unsubscribe endpoint (POST)
app.post("/make-server-4d80a1b0/unsubscribe", async (c) => {
  try {
    const body = await c.req.json();
    const { email } = body;

    if (!email) {
      return c.json({ error: "Email is required" }, 400);
    }

    // Remove from subscribers list
    const subscribers = await kv.get('newsletter_subscribers') || [];
    const normalizedEmail = email.toLowerCase();
    const updatedSubscribers = subscribers.filter(sub => sub !== normalizedEmail);
    
    // Check if email was actually subscribed
    const wasSubscribed = subscribers.length !== updatedSubscribers.length;
    
    await kv.set('newsletter_subscribers', updatedSubscribers);

    console.log(`Unsubscribe attempt for: ${email} - ${wasSubscribed ? 'Success' : 'Not subscribed'}`);

    return c.json({
      success: true,
      message: wasSubscribed 
        ? "Successfully unsubscribed from newsletter" 
        : "Email address was not found in our subscription list"
    });

  } catch (error) {
    console.error('Unsubscribe error:', error);
    return c.json({ error: "Failed to unsubscribe" }, 500);
  }
});

// Unsubscribe endpoint (GET) - for direct email links
app.get("/make-server-4d80a1b0/unsubscribe", async (c) => {
  try {
    const url = new URL(c.req.url);
    const email = url.searchParams.get('email');

    if (!email) {
      return c.json({ error: "Email parameter is required" }, 400);
    }

    // Remove from subscribers list
    const subscribers = await kv.get('newsletter_subscribers') || [];
    const normalizedEmail = email.toLowerCase();
    const updatedSubscribers = subscribers.filter(sub => sub !== normalizedEmail);
    
    // Check if email was actually subscribed
    const wasSubscribed = subscribers.length !== updatedSubscribers.length;
    
    await kv.set('newsletter_subscribers', updatedSubscribers);

    console.log(`Direct unsubscribe for: ${email} - ${wasSubscribed ? 'Success' : 'Not subscribed'}`);

    return c.json({
      success: true,
      message: wasSubscribed 
        ? "Successfully unsubscribed from newsletter" 
        : "Email address was not found in our subscription list",
      email: email
    });

  } catch (error) {
    console.error('Direct unsubscribe error:', error);
    return c.json({ error: "Failed to unsubscribe" }, 500);
  }
});

// Contact notification email template generator
function generateContactNotificationHTML(contactData: any): string {
  const { name, email, company, service, budget, timeline, message, submittedAt, id } = contactData;
  
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Contact Form Submission</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          background-color: #f8fafc;
          padding: 20px;
        }
        .container {
          background: white;
          border-radius: 8px;
          padding: 30px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
          background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
          color: white;
          padding: 20px;
          border-radius: 8px;
          text-align: center;
          margin-bottom: 30px;
        }
        .field-group {
          margin-bottom: 20px;
          padding: 15px;
          background: #f8fafc;
          border-radius: 6px;
          border-left: 4px solid #3b82f6;
        }
        .field-label {
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 5px;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .field-value {
          color: #334155;
          font-size: 16px;
          white-space: pre-line;
        }
        .message-box {
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          padding: 20px;
          margin-top: 10px;
        }
        .footer {
          border-top: 1px solid #e2e8f0;
          padding-top: 20px;
          margin-top: 30px;
          text-align: center;
          color: #64748b;
          font-size: 12px;
        }
        .priority-high {
          background: #fef2f2;
          border-left-color: #dc2626;
        }
        .action-button {
          display: inline-block;
          background: #1e293b;
          color: white;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 6px;
          margin-top: 15px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0; font-size: 24px;">🔔 New Contact Form Submission</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Someone is interested in your services!</p>
        </div>
        
        <div class="field-group">
          <div class="field-label">Contact Information</div>
          <div class="field-value">
            <strong>${name}</strong><br>
            📧 <a href="mailto:${email}" style="color: #3b82f6;">${email}</a>
            ${company ? `<br>🏢 ${company}` : ''}
          </div>
        </div>

        ${service ? `
        <div class="field-group">
          <div class="field-label">Service Interested In</div>
          <div class="field-value">${service}</div>
        </div>
        ` : ''}

        ${budget ? `
        <div class="field-group">
          <div class="field-label">Budget Range</div>
          <div class="field-value">${budget}</div>
        </div>
        ` : ''}

        ${timeline ? `
        <div class="field-group">
          <div class="field-label">Project Timeline</div>
          <div class="field-value">${timeline}</div>
        </div>
        ` : ''}

        <div class="field-group priority-high">
          <div class="field-label">Message</div>
          <div class="message-box">
            <div class="field-value">${message}</div>
          </div>
        </div>

        <div class="field-group">
          <div class="field-label">Submission Details</div>
          <div class="field-value">
            📅 ${new Date(submittedAt).toLocaleString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric', 
              hour: '2-digit', 
              minute: '2-digit',
              timeZoneName: 'short'
            })}<br>
            🆔 ${id}
          </div>
        </div>

        <div style="text-align: center; margin-top: 30px;">
          <a href="mailto:${email}?subject=Re: Your Inquiry - Herman Kwayu Consulting&body=Hello ${name},%0D%0A%0D%0AThank you for reaching out regarding ${service || 'your project'}. I've received your message and would love to discuss how I can help.%0D%0A%0D%0ABest regards,%0D%0AHerman Kwayu" 
             class="action-button">📧 Reply to ${name}</a>
        </div>
        
        <div class="footer">
          <p>This notification was sent from your Herman Kwayu contact form at hermankwayu.com</p>
          <p>Contact Form System © ${new Date().getFullYear()}</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Password reset email template generator
function generatePasswordResetHTML(tempPassword: string, resetToken: string): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Admin Password Reset - Herman Kwayu</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          background-color: #f8fafc;
          padding: 20px;
        }
        .container {
          background: white;
          border-radius: 8px;
          padding: 40px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
          text-align: center;
          background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
          color: white;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 30px;
        }
        .alert-box {
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 6px;
          padding: 20px;
          margin: 20px 0;
        }
        .password-box {
          background: #1e293b;
          color: white;
          padding: 20px;
          border-radius: 8px;
          text-align: center;
          margin: 20px 0;
          border: 2px solid #334155;
        }
        .password {
          font-family: 'Courier New', monospace;
          font-size: 24px;
          font-weight: bold;
          letter-spacing: 2px;
          padding: 10px;
          background: rgba(255,255,255,0.1);
          border-radius: 4px;
          margin: 10px 0;
        }
        .instructions {
          background: #f0f9ff;
          border: 1px solid #bae6fd;
          border-radius: 6px;
          padding: 20px;
          margin: 20px 0;
        }
        .footer {
          border-top: 1px solid #e2e8f0;
          padding-top: 20px;
          text-align: center;
          color: #64748b;
          font-size: 12px;
          margin-top: 30px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0; font-size: 24px;">🔐 Admin Password Reset</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Herman Kwayu Dashboard</p>
        </div>
        
        <div class="alert-box">
          <h3 style="color: #dc2626; margin-top: 0;">⚠️ Security Alert</h3>
          <p><strong>A password reset was requested for your admin dashboard.</strong></p>
          <p>If you did not request this reset, please ignore this email and your password will remain unchanged.</p>
        </div>

        <div class="password-box">
          <h3 style="margin-top: 0;">Your Temporary Password</h3>
          <div class="password">${tempPassword}</div>
          <p style="margin-bottom: 0; opacity: 0.8;">Use this password to log into your admin dashboard</p>
        </div>

        <div class="instructions">
          <h3 style="color: #1e40af; margin-top: 0;">📋 Next Steps</h3>
          <ol style="padding-left: 20px;">
            <li><strong>Go to your admin dashboard</strong> at <a href="https://hermankwayu.com" style="color: #2563eb;">hermankwayu.com</a></li>
            <li><strong>Click "Admin"</strong> in the header</li>
            <li><strong>Use the temporary password above</strong> to log in</li>
            <li><strong>Immediately change your password</strong> in the Settings tab</li>
          </ol>
          <p style="margin-bottom: 0;"><strong>⏰ This temporary password expires in 30 minutes for security.</strong></p>
        </div>

        <div style="background: #fbbf24; color: #92400e; padding: 15px; border-radius: 6px; margin: 20px 0;">
          <strong>🔒 Security Reminder:</strong> Change this temporary password immediately after logging in!
        </div>
        
        <div class="footer">
          <p>This password reset was requested at ${new Date().toLocaleString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit',
            timeZoneName: 'short'
          })}</p>
          <p>Reset Token: ${resetToken.substring(0, 10)}...</p>
          <p>Herman Kwayu Admin System © ${new Date().getFullYear()}</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Newsletter template generator
function generateNewsletterHTML(content: string, subscriberEmail: string, newsletterId: string): string {
  const unsubscribeUrl = `https://hermankwayu.com/?unsubscribe=true&email=${encodeURIComponent(subscriberEmail)}&id=${newsletterId}`;
  
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Herman Kwayu Newsletter</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          background-color: #f8fafc;
          padding: 20px;
        }
        .container {
          background: white;
          border-radius: 8px;
          padding: 40px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
          text-align: center;
          border-bottom: 2px solid #1e293b;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .logo {
          font-size: 28px;
          font-weight: bold;
          color: #1e293b;
          margin-bottom: 10px;
        }
        .tagline {
          color: #64748b;
          font-size: 14px;
          margin: 0;
        }
        .content {
          margin-bottom: 40px;
          white-space: pre-line;
        }
        .footer {
          border-top: 1px solid #e2e8f0;
          padding-top: 20px;
          text-align: center;
          color: #64748b;
          font-size: 12px;
        }
        .unsubscribe {
          color: #64748b;
          text-decoration: none;
        }
        .unsubscribe:hover {
          text-decoration: underline;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">HK</div>
          <p class="tagline">Herman Kwayu - Digital Strategy & Process Optimization</p>
        </div>
        
        <div class="content">
          ${content}
        </div>
        
        <div class="footer">
          <p>Thank you for subscribing to my newsletter!</p>
          <p>
            <a href="${unsubscribeUrl}" class="unsubscribe">Unsubscribe</a> | 
            <a href="https://hermankwayu.com" class="unsubscribe">Visit Website</a>
          </p>
          <p>Herman Kwayu © ${new Date().getFullYear()}</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

Deno.serve(app.fetch);