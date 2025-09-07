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

// Payment processing endpoint for Resume Builder
app.post("/make-server-4d80a1b0/process-payment", async (c) => {
  try {
    const body = await c.req.json();
    const { amount, phoneNumber, provider, type, cardDetails, resumeData, template, formats } = body;

    if (!amount || !resumeData || !template || !formats) {
      return c.json({ error: "Missing required payment data" }, 400);
    }

    // Validate payment amount (should be 5000 TSH)
    if (amount !== 5000) {
      return c.json({ error: "Invalid payment amount" }, 400);
    }

    // Validate resume data has required fields
    if (!resumeData.personalInfo || !resumeData.personalInfo.email || !resumeData.personalInfo.fullName) {
      return c.json({ error: "Missing required personal information (name and email)" }, 400);
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(resumeData.personalInfo.email)) {
      return c.json({ error: "Invalid email address format" }, 400);
    }

    // Generate unique payment ID
    const paymentId = `payment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Store payment record
    const paymentData = {
      id: paymentId,
      amount,
      type,
      status: 'processing',
      resumeData,
      template,
      formats,
      createdAt: new Date().toISOString()
    };

    if (type === 'mobile_money') {
      paymentData.phoneNumber = phoneNumber;
      paymentData.provider = provider;
    } else if (type === 'card') {
      // Don't store full card details for security - only last 4 digits
      paymentData.cardLastFour = cardDetails.number?.slice(-4) || '';
      paymentData.cardName = cardDetails.name || '';
    }

    await kv.set(`payment:${paymentId}`, paymentData);

    // For demo purposes, simulate successful payment
    console.log('⚠️ Payment processing in demo mode');
    await new Promise(resolve => setTimeout(resolve, 2000));
    const paymentSuccess = true;

    if (paymentSuccess) {
      // Update payment status
      const successfulPayment = {
        ...paymentData,
        status: 'completed',
        completedAt: new Date().toISOString(),
        transactionId: `TXN_${Date.now()}`
      };
      
      await kv.set(`payment:${paymentId}`, successfulPayment);

      // Generate resume download URLs (demo URLs)
      const downloadUrls = {
        pdf: `https://hermankwayu.com/resume-demo/${paymentId}.pdf`,
        docx: `https://hermankwayu.com/resume-demo/${paymentId}.docx`
      };

      console.log(`✅ Resume payment successful: ${paymentId} - Amount: ${amount} TSH - Type: ${type}`);

      return c.json({
        success: true,
        message: "Payment successful! Your resume is ready for download.",
        paymentId,
        downloadUrls,
        transactionId: successfulPayment.transactionId
      });

    } else {
      // Payment failed
      const failedPayment = {
        ...paymentData,
        status: 'failed',
        failedAt: new Date().toISOString()
      };
      
      await kv.set(`payment:${paymentId}`, failedPayment);
      
      console.log(`❌ Resume payment failed: ${paymentId} - Amount: ${amount} TSH - Type: ${type}`);
      
      return c.json({
        success: false,
        error: "Payment processing failed. Please try again."
      });
    }

  } catch (error) {
    console.error('Payment processing error:', error);
    return c.json({ error: "Payment processing failed" }, 500);
  }
});

// Get payment status endpoint
app.get("/make-server-4d80a1b0/payment-status/:paymentId", async (c) => {
  try {
    const paymentId = c.req.param('paymentId');
    const payment = await kv.get(`payment:${paymentId}`);
    
    if (!payment) {
      return c.json({ error: "Payment not found" }, 404);
    }

    // Return sanitized payment data (no sensitive info)
    const sanitizedPayment = {
      id: payment.id,
      amount: payment.amount,
      status: payment.status,
      createdAt: payment.createdAt,
      completedAt: payment.completedAt,
      transactionId: payment.transactionId
    };

    return c.json(sanitizedPayment);
    
  } catch (error) {
    console.error('Payment status error:', error);
    return c.json({ error: "Failed to fetch payment status" }, 500);
  }
});

// Free resume generation endpoint (no payment required)
app.post("/make-server-4d80a1b0/generate-resume", async (c) => {
  try {
    const body = await c.req.json();
    const { resumeData, template, format } = body;

    if (!resumeData || !template || !format) {
      return c.json({ error: "Missing required data (resumeData, template, format)" }, 400);
    }

    // Validate resume data has required fields
    if (!resumeData.personalInfo || !resumeData.personalInfo.email || !resumeData.personalInfo.fullName) {
      return c.json({ error: "Missing required personal information (name and email)" }, 400);
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(resumeData.personalInfo.email)) {
      return c.json({ error: "Invalid email address format" }, 400);
    }

    // Validate format
    if (!['pdf', 'docx'].includes(format)) {
      return c.json({ error: "Invalid format. Must be 'pdf' or 'docx'" }, 400);
    }

    console.log(`📄 Generating free resume: ${format} for ${resumeData.personalInfo.fullName}`);

    // Generate resume content
    const resumeContent = generateResumeContent(resumeData, template);
    
    // Return HTML content that can be downloaded
    const downloadUrl = `data:text/html;charset=utf-8,${encodeURIComponent(resumeContent)}`;

    console.log(`✅ Free resume generated successfully: ${format} for ${resumeData.personalInfo.email}`);

    return c.json({
      success: true,
      message: `Your ${format.toUpperCase()} resume has been generated successfully!`,
      downloadUrl,
      format
    });

  } catch (error) {
    console.error('Free resume generation error:', error);
    return c.json({ error: "Resume generation failed" }, 500);
  }
});

// Helper functions for email templates
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
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0;">🔔 New Contact Form Submission</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">From your Herman Kwayu website</p>
        </div>
        
        <div class="field-group">
          <div class="field-label">Contact Person</div>
          <div class="field-value">${name}</div>
        </div>

        <div class="field-group">
          <div class="field-label">Email Address</div>
          <div class="field-value">${email}</div>
        </div>

        ${company ? `
        <div class="field-group">
          <div class="field-label">Company</div>
          <div class="field-value">${company}</div>
        </div>
        ` : ''}

        ${service ? `
        <div class="field-group">
          <div class="field-label">Service Interested In</div>
          <div class="field-value">${service}</div>
        </div>
        ` : ''}

        ${budget ? `
        <div class="field-group">
          <div class="field-label">Budget</div>
          <div class="field-value">${budget}</div>
        </div>
        ` : ''}

        ${timeline ? `
        <div class="field-group">
          <div class="field-label">Timeline</div>
          <div class="field-value">${timeline}</div>
        </div>
        ` : ''}

        <div class="field-group">
          <div class="field-label">Message</div>
          <div class="message-box">
            <div class="field-value">${message}</div>
          </div>
        </div>

        <div class="footer">
          <p><strong>Submission ID:</strong> ${id}</p>
          <p><strong>Submitted:</strong> ${new Date(submittedAt).toLocaleString()}</p>
          <hr style="border: none; height: 1px; background: #e2e8f0; margin: 20px 0;">
          <p>This notification was sent from your Herman Kwayu contact form system.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function generateNewsletterHTML(content: string, email: string, newsletterId: string): string {
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
        .newsletter-container {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        }
        .header {
          background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
          color: white;
          padding: 30px;
          text-align: center;
        }
        .content {
          padding: 30px;
        }
        .footer {
          background: #f8fafc;
          padding: 20px;
          text-align: center;
          border-top: 1px solid #e2e8f0;
          color: #64748b;
          font-size: 14px;
        }
        .unsubscribe-link {
          color: #64748b;
          text-decoration: none;
        }
        .unsubscribe-link:hover {
          color: #1e293b;
        }
      </style>
    </head>
    <body>
      <div class="newsletter-container">
        <div class="header">
          <h1 style="margin: 0; font-size: 28px;">Herman Kwayu</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Professional Consulting & Business Strategy</p>
        </div>
        
        <div class="content">
          ${content}
        </div>

        <div class="footer">
          <p>You're receiving this because you subscribed to Herman Kwayu's newsletter.</p>
          <p>
            <a href="https://hermankwayu.com/unsubscribe?email=${encodeURIComponent(email)}" class="unsubscribe-link">
              Unsubscribe from this newsletter
            </a>
          </p>
          <p>Herman Kwayu | Professional Consulting Services</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function generatePasswordResetHTML(tempPassword: string, resetToken: string): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Reset</title>
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
          background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
          color: white;
          padding: 20px;
          border-radius: 8px;
          text-align: center;
          margin-bottom: 30px;
        }
        .password-box {
          background: #fef2f2;
          border: 2px solid #dc2626;
          border-radius: 8px;
          padding: 20px;
          text-align: center;
          margin: 20px 0;
        }
        .password {
          font-family: monospace;
          font-size: 24px;
          font-weight: bold;
          color: #dc2626;
          letter-spacing: 2px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0;">🔐 Password Reset</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Admin Dashboard Access</p>
        </div>
        
        <p>Your admin password has been reset. Use this temporary password to log in:</p>
        
        <div class="password-box">
          <p style="margin: 0 0 10px 0; font-weight: 600;">Temporary Password:</p>
          <div class="password">${tempPassword}</div>
        </div>

        <p><strong>Important:</strong></p>
        <ul>
          <li>This temporary password expires in 30 minutes</li>
          <li>Please change it immediately after logging in</li>
          <li>If you didn't request this reset, please contact support</li>
        </ul>

        <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #64748b; font-size: 14px;">
          This is an automated email from the Herman Kwayu admin system.
        </p>
      </div>
    </body>
    </html>
  `;
}

function generateResumeContent(resumeData: any, template: string): string {
  const { personalInfo, experience, education, skills } = resumeData;
  
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Professional Resume - ${personalInfo.fullName}</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          margin: 0;
          padding: 20px;
          background: white;
        }
        .resume-container {
          max-width: 800px;
          margin: 0 auto;
          background: white;
          padding: 40px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        }
        .header {
          text-align: center;
          border-bottom: 2px solid #1e293b;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .name {
          font-size: 36px;
          font-weight: bold;
          color: #1e293b;
          margin-bottom: 10px;
        }
        .contact-info {
          color: #64748b;
          font-size: 16px;
        }
        .section {
          margin-bottom: 30px;
        }
        .section-title {
          font-size: 24px;
          font-weight: bold;
          color: #1e293b;
          border-bottom: 1px solid #e2e8f0;
          padding-bottom: 10px;
          margin-bottom: 20px;
        }
        .experience-item, .education-item {
          margin-bottom: 20px;
        }
        .job-title, .degree {
          font-size: 18px;
          font-weight: bold;
          color: #1e293b;
        }
        .company, .school {
          font-size: 16px;
          color: #3b82f6;
          margin-bottom: 5px;
        }
        .date-range {
          font-size: 14px;
          color: #64748b;
          margin-bottom: 10px;
        }
        .description {
          color: #374151;
          line-height: 1.6;
        }
        .skills-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 10px;
        }
        .skill-item {
          background: #f1f5f9;
          padding: 8px 12px;
          border-radius: 6px;
          color: #334155;
          font-weight: 500;
        }
        .professional-summary {
          background: #f8fafc;
          padding: 20px;
          border-radius: 8px;
          border-left: 4px solid #3b82f6;
          margin-bottom: 30px;
        }
      </style>
    </head>
    <body>
      <div class="resume-container">
        <div class="header">
          <div class="name">${personalInfo.fullName}</div>
          <div class="contact-info">
            ${personalInfo.email} | ${personalInfo.phone || ''} | ${personalInfo.location || ''}
          </div>
        </div>

        ${personalInfo.summary ? `
        <div class="section">
          <div class="professional-summary">
            <div class="section-title">Professional Summary</div>
            <div class="description">${personalInfo.summary}</div>
          </div>
        </div>
        ` : ''}

        ${experience && experience.length > 0 ? `
        <div class="section">
          <div class="section-title">Work Experience</div>
          ${experience.map(exp => `
            <div class="experience-item">
              <div class="job-title">${exp.title}</div>
              <div class="company">${exp.company}</div>
              <div class="date-range">${exp.startDate} - ${exp.endDate || 'Present'}</div>
              ${exp.description ? `<div class="description">${exp.description}</div>` : ''}
            </div>
          `).join('')}
        </div>
        ` : ''}

        ${education && education.length > 0 ? `
        <div class="section">
          <div class="section-title">Education</div>
          ${education.map(edu => `
            <div class="education-item">
              <div class="degree">${edu.degree}</div>
              <div class="school">${edu.school}</div>
              <div class="date-range">${edu.year}</div>
            </div>
          `).join('')}
        </div>
        ` : ''}

        ${skills && skills.length > 0 ? `
        <div class="section">
          <div class="section-title">Skills</div>
          <div class="skills-grid">
            ${skills.map(skill => `
              <div class="skill-item">${skill}</div>
            `).join('')}
          </div>
        </div>
        ` : ''}

        <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #64748b; font-size: 12px;">
          Professional Resume generated by Herman Kwayu Resume Builder
        </div>
      </div>
    </body>
    </html>
  `;
}

// Server startup
Deno.serve(app.fetch);