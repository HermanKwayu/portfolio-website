import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Admin authentication check using token (for authenticated sessions)
const checkAdminAuth = (c: any) => {
  try {
    // In Hono, use c.req.header() to get headers
    const adminToken = c.req.header('X-Admin-Token');
    const validAdminToken = 'herman_admin_2024_secure_token';
    return adminToken === validAdminToken;
  } catch (error) {
    console.error('❌ Auth check error:', error);
    return false;
  }
};

// Enable logger with performance timing
app.use('*', logger((message, ...rest) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${message}`, ...rest);
}));

// Enable CORS for all routes and methods with performance headers
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization", "X-Admin-Token"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length", "X-Response-Time"],
    maxAge: 600,
  }),
);

// Ultra-fast admin authentication endpoint
app.post("/make-server-4d80a1b0/admin/authenticate", async (c) => {
  try {
    const body = await c.req.json();
    const { password } = body;

    // Immediate validation
    if (!password) {
      console.log('❌ No password provided');
      return c.json({ error: "Password is required" }, 400);
    }

    // Get expected password from database
    let expectedPassword;
    try {
      expectedPassword = await kv.get('admin_password');
      if (!expectedPassword) {
        // Fallback to environment variable
        expectedPassword = Deno.env.get('ADMIN_PASSWORD') || 'HermanAdmin2024!';
        // Store it in database for future use
        await kv.set('admin_password', expectedPassword);
      }
    } catch (dbError) {
      console.error('❌ Failed to fetch password from database:', dbError);
      expectedPassword = Deno.env.get('ADMIN_PASSWORD') || 'HermanAdmin2024!';
    }

    // Secure logging (no password exposure)
    console.log(`🔐 Auth attempt - received length: ${password.length}, expected length: ${expectedPassword.length}`);

    // Normalize both passwords (trim whitespace)
    const normalizedInput = password.trim();
    const normalizedExpected = expectedPassword.trim();

    // Direct comparison with multiple checks
    const isMatch = normalizedInput === normalizedExpected;
    
    console.log(`🔐 Password comparison - lengths: input(${normalizedInput.length}) vs expected(${normalizedExpected.length}), match: ${isMatch}`);

    if (isMatch) {
      console.log('✅ Authentication successful');
      return c.json({ 
        success: true, 
        message: "Authentication successful",
        token: 'herman_admin_2024_secure_token'
      });
    } else {
      console.log('❌ Authentication failed - password mismatch detected');
      console.log(`🔍 Debug info - first 3 chars: input="${normalizedInput.substring(0, 3)}..." expected="${normalizedExpected.substring(0, 3)}..."`);
      return c.json({ 
        error: "Invalid password"
      }, 401);
    }

  } catch (error) {
    console.error('❌ Authentication error:', error);
    return c.json({ error: "Authentication failed" }, 500);
  }
});

// Admin health check endpoint for session validation
app.get("/make-server-4d80a1b0/admin/health", async (c) => {
  try {
    if (checkAdminAuth(c)) {
      return c.json({ 
        authorized: true, 
        status: 'healthy',
        timestamp: new Date().toISOString()
      });
    } else {
      return c.json({ authorized: false }, 401);
    }
  } catch (error) {
    console.error('❌ Admin health check error:', error);
    return c.json({ error: "Health check failed" }, 500);
  }
});

// Warm-up endpoint for performance optimization
app.get("/make-server-4d80a1b0/warm", async (c) => {
  return c.json({ 
    status: 'warm',
    timestamp: new Date().toISOString(),
    message: 'Server is warmed up and ready'
  });
});

// Admin dashboard batch data endpoint
app.get("/make-server-4d80a1b0/admin/dashboard-data", async (c) => {
  try {
    if (!checkAdminAuth(c)) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    console.log('📊 Loading batch dashboard data...');
    
    // Load all data in parallel for better performance
    const [subscribersData, newslettersData, contactsData] = await Promise.all([
      loadSubscribersData(),
      loadNewslettersData(), 
      loadContactsData()
    ]);

    return c.json({
      subscribers: subscribersData,
      newsletters: newslettersData,
      contacts: contactsData,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Dashboard batch data error:', error);
    return c.json({ error: "Failed to load dashboard data" }, 500);
  }
});

// Individual endpoints for fallback
app.get("/make-server-4d80a1b0/subscribers", async (c) => {
  try {
    if (!checkAdminAuth(c)) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const data = await loadSubscribersData();
    return c.json(data);
  } catch (error) {
    console.error('❌ Subscribers endpoint error:', error);
    return c.json({ error: "Failed to load subscribers" }, 500);
  }
});

app.get("/make-server-4d80a1b0/newsletters", async (c) => {
  try {
    if (!checkAdminAuth(c)) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const data = await loadNewslettersData();
    return c.json(data);
  } catch (error) {
    console.error('❌ Newsletters endpoint error:', error);
    return c.json({ error: "Failed to load newsletters" }, 500);
  }
});

app.get("/make-server-4d80a1b0/contacts", async (c) => {
  try {
    if (!checkAdminAuth(c)) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const data = await loadContactsData();
    return c.json(data);
  } catch (error) {
    console.error('❌ Contacts endpoint error:', error);
    return c.json({ error: "Failed to load contacts" }, 500);
  }
});

// Email service test endpoint
app.post("/make-server-4d80a1b0/test-email", async (c) => {
  try {
    if (!checkAdminAuth(c)) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Test email service (Resend API)
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    if (!resendApiKey) {
      return c.json({ 
        success: false, 
        error: "Email service not configured - missing API key" 
      });
    }

    // Simple test - just validate the API key is present
    return c.json({ 
      success: true, 
      message: "Email service is configured and ready",
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Email test error:', error);
    return c.json({ 
      success: false, 
      error: "Email service test failed" 
    });
  }
});

// Password status check endpoint
app.get("/make-server-4d80a1b0/admin/password-status", async (c) => {
  try {
    if (!checkAdminAuth(c)) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const password = await kv.get('admin_password');
    const hasPassword = !!password;
    const passwordLength = password ? password.length : 0;

    return c.json({
      hasPassword,
      passwordLength,
      source: hasPassword ? 'database' : 'environment'
    });
  } catch (error) {
    console.error('❌ Password status error:', error);
    return c.json({ error: "Failed to check password status" }, 500);
  }
});

// Password reset endpoint
app.post("/make-server-4d80a1b0/admin/reset-password", async (c) => {
  try {
    const body = await c.req.json();
    const { newPassword } = body;

    if (!newPassword || newPassword.length < 8) {
      return c.json({ error: "Password must be at least 8 characters long" }, 400);
    }

    // Store the new password in the database
    await kv.set('admin_password', newPassword);
    
    console.log('🔐 Admin password updated successfully');
    return c.json({ 
      success: true, 
      message: "Password updated successfully" 
    });

  } catch (error) {
    console.error('❌ Password reset error:', error);
    return c.json({ error: "Failed to reset password" }, 500);
  }
});

// Newsletter management endpoints
app.post("/make-server-4d80a1b0/send-newsletter", async (c) => {
  try {
    if (!checkAdminAuth(c)) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const body = await c.req.json();
    const { subject, content, previewText } = body;

    if (!subject || !content) {
      return c.json({ error: "Subject and content are required" }, 400);
    }

    // Get subscribers
    const subscribersData = await loadSubscribersData();
    const subscribers = subscribersData.subscribers || [];

    if (subscribers.length === 0) {
      return c.json({ error: "No subscribers found" }, 400);
    }

    // Send newsletter using Resend API
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    if (!resendApiKey) {
      return c.json({ error: "Email service not configured" }, 500);
    }

    let successCount = 0;
    let failCount = 0;

    // Send to each subscriber
    for (const email of subscribers) {
      try {
        const response = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Herman Kwayu <herman@truthherman.com>',
            to: [email],
            subject: subject,
            html: content,
            text: content.replace(/<[^>]*>/g, ''), // Strip HTML for text version
          }),
        });

        if (response.ok) {
          successCount++;
        } else {
          failCount++;
          console.error(`Failed to send to ${email}:`, await response.text());
        }
      } catch (error) {
        failCount++;
        console.error(`Error sending to ${email}:`, error);
      }
    }

    // Store newsletter in history
    const newsletterId = `newsletter_${Date.now()}`;
    const newsletterRecord = {
      id: newsletterId,
      subject,
      content,
      previewText: previewText || '',
      sentAt: new Date().toISOString(),
      subscriberCount: subscribers.length,
      successCount,
      failCount,
      status: failCount === 0 ? 'success' : (successCount === 0 ? 'failed' : 'partial')
    };

    const existingNewsletters = await kv.get('newsletter_history') || [];
    existingNewsletters.unshift(newsletterRecord);
    await kv.set('newsletter_history', existingNewsletters.slice(0, 50)); // Keep last 50

    return c.json({
      success: true,
      message: `Newsletter sent successfully to ${successCount} subscribers`,
      successCount,
      failCount,
      totalSubscribers: subscribers.length
    });

  } catch (error) {
    console.error('❌ Newsletter send error:', error);
    return c.json({ error: "Failed to send newsletter" }, 500);
  }
});

// Contact form submission endpoint
app.post("/make-server-4d80a1b0/contact", async (c) => {
  try {
    const body = await c.req.json();
    const { name, email, company, service, budget, timeline, message } = body;

    if (!name || !email || !message) {
      return c.json({ error: "Name, email, and message are required" }, 400);
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return c.json({ error: "Invalid email format" }, 400);
    }

    // Create contact submission
    const contactId = `contact_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    const contactSubmission = {
      id: contactId,
      name,
      email,
      company: company || '',
      service: service || '',
      budget: budget || '',
      timeline: timeline || '',
      message,
      submittedAt: new Date().toISOString(),
      status: 'new',
      emailSent: false
    };

    // Store contact submission
    const existingContacts = await kv.get('contact_submissions') || [];
    existingContacts.unshift(contactSubmission);
    await kv.set('contact_submissions', existingContacts);

    // Send notification email to admin
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    if (resendApiKey) {
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Contact Form <noreply@truthherman.com>',
            to: ['truthherman@gmail.com'],
            subject: `New Contact Form Submission from ${name}`,
            html: `
              <h2>New Contact Form Submission</h2>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Company:</strong> ${company || 'Not provided'}</p>
              <p><strong>Service:</strong> ${service || 'Not provided'}</p>
              <p><strong>Budget:</strong> ${budget || 'Not provided'}</p>
              <p><strong>Timeline:</strong> ${timeline || 'Not provided'}</p>
              <p><strong>Message:</strong></p>
              <p>${message.replace(/\n/g, '<br>')}</p>
              <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
            `,
          }),
        });
      } catch (emailError) {
        console.error('Failed to send admin notification:', emailError);
      }
    }

    return c.json({
      success: true,
      message: "Contact form submitted successfully",
      contactId
    });

  } catch (error) {
    console.error('❌ Contact form error:', error);
    return c.json({ error: "Failed to submit contact form" }, 500);
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

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return c.json({ error: "Invalid email format" }, 400);
    }

    // Get existing subscribers
    const subscribers = await kv.get('newsletter_subscribers') || [];
    
    // Check if already subscribed
    if (subscribers.includes(email)) {
      return c.json({ error: "Email is already subscribed" }, 400);
    }

    // Add new subscriber
    subscribers.push(email);
    await kv.set('newsletter_subscribers', subscribers);

    // Send welcome email
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    if (resendApiKey) {
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Herman Kwayu <herman@truthherman.com>',
            to: [email],
            subject: 'Welcome to Herman Kwayu\'s Newsletter!',
            html: `
              <h2>Welcome to my newsletter!</h2>
              <p>Thank you for subscribing to my newsletter. You'll receive valuable insights about business strategy, digital transformation, and consulting expertise.</p>
              <p>I promise to only send valuable content and respect your time.</p>
              <p>Best regards,<br>Herman Kwayu</p>
              <p><small>You can unsubscribe at any time by clicking <a href="https://truthherman.com/unsubscribe?email=${encodeURIComponent(email)}">here</a>.</small></p>
            `,
          }),
        });
      } catch (emailError) {
        console.error('Failed to send welcome email:', emailError);
      }
    }

    return c.json({
      success: true,
      message: "Successfully subscribed to newsletter"
    });

  } catch (error) {
    console.error('❌ Newsletter subscription error:', error);
    return c.json({ error: "Failed to subscribe" }, 500);
  }
});

// Newsletter unsubscribe endpoint
app.post("/make-server-4d80a1b0/unsubscribe", async (c) => {
  try {
    const body = await c.req.json();
    const { email } = body;

    if (!email) {
      return c.json({ error: "Email is required" }, 400);
    }

    // Get existing subscribers
    const subscribers = await kv.get('newsletter_subscribers') || [];
    
    // Remove subscriber
    const updatedSubscribers = subscribers.filter(sub => sub !== email);
    await kv.set('newsletter_subscribers', updatedSubscribers);

    return c.json({
      success: true,
      message: "Successfully unsubscribed from newsletter"
    });

  } catch (error) {
    console.error('❌ Newsletter unsubscribe error:', error);
    return c.json({ error: "Failed to unsubscribe" }, 500);
  }
});

// Initialize basic data for testing (admin only)
app.post("/make-server-4d80a1b0/admin/init-data", async (c) => {
  try {
    if (!checkAdminAuth(c)) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Initialize with some basic data if none exists
    const subscribers = await kv.get('newsletter_subscribers') || [];
    const contacts = await kv.get('contact_submissions') || [];
    const newsletters = await kv.get('newsletter_history') || [];

    if (subscribers.length === 0) {
      await kv.set('newsletter_subscribers', ['demo@example.com']);
    }

    if (contacts.length === 0) {
      const demoContact = {
        id: `contact_${Date.now()}`,
        name: 'Demo Contact',
        email: 'demo@example.com',
        company: 'Demo Company',
        service: 'strategic-planning',
        budget: '10k-25k',
        timeline: '1-month',
        message: 'This is a demo contact submission for testing.',
        submittedAt: new Date().toISOString(),
        status: 'new',
        emailSent: false
      };
      await kv.set('contact_submissions', [demoContact]);
    }

    if (newsletters.length === 0) {
      const demoNewsletter = {
        id: `newsletter_${Date.now()}`,
        subject: 'Welcome to the Newsletter',
        content: 'This is a demo newsletter for testing.',
        previewText: 'Demo newsletter preview',
        sentAt: new Date().toISOString(),
        subscriberCount: 1,
        successCount: 1,
        failCount: 0,
        status: 'success'
      };
      await kv.set('newsletter_history', [demoNewsletter]);
    }

    return c.json({
      success: true,
      message: "Basic data initialized successfully",
      data: {
        subscribers: await kv.get('newsletter_subscribers'),
        contacts: await kv.get('contact_submissions'),
        newsletters: await kv.get('newsletter_history')
      }
    });

  } catch (error) {
    console.error('❌ Data initialization error:', error);
    return c.json({ error: "Failed to initialize data" }, 500);
  }
});

// Admin endpoint to clear all data (for testing)
app.post("/make-server-4d80a1b0/admin/clear-data", async (c) => {
  try {
    if (!checkAdminAuth(c)) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    await Promise.all([
      kv.set('newsletter_subscribers', []),
      kv.set('contact_submissions', []),
      kv.set('newsletter_history', [])
    ]);

    return c.json({
      success: true,
      message: "All data cleared successfully"
    });

  } catch (error) {
    console.error('❌ Data clearing error:', error);
    return c.json({ error: "Failed to clear data" }, 500);
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
    
    // Create a proper filename
    const safeFileName = resumeData.personalInfo.fullName
      .replace(/[^a-zA-Z0-9]/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_|_$/g, '');

    // For HTML format (can be saved as PDF by browser)
    if (format === 'pdf') {
      // Create a blob URL for the HTML content that can be printed to PDF
      const htmlBlob = `data:text/html;charset=utf-8,${encodeURIComponent(resumeContent)}`;
      
      console.log(`✅ Free PDF resume generated successfully for ${resumeData.personalInfo.email}`);
      
      return c.json({
        success: true,
        message: "Your PDF resume has been generated successfully! It will open in a new tab where you can print or save as PDF.",
        downloadUrl: htmlBlob,
        fileName: `${safeFileName}_Resume.html`,
        format: 'pdf',
        instructions: "The resume will open in a new tab. Use your browser's print function and select 'Save as PDF' to download the PDF version."
      });
    }
    
    // For DOCX format, return HTML that can be saved and opened in Word
    if (format === 'docx') {
      // Create Word-compatible HTML
      const wordContent = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word'>
        <head>
          <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
          <title>${resumeData.personalInfo.fullName} - Resume</title>
          <!--[if gte mso 9]>
          <xml>
            <w:WordDocument>
              <w:View>Print</w:View>
              <w:Zoom>90</w:Zoom>
              <w:DoNotPromptForConvert/>
              <w:DoNotShowMarkupExtensions/>
            </w:WordDocument>
          </xml>
          <![endif]-->
        </head>
        <body>
          ${resumeContent.replace(/<html[^>]*>|<\/html>|<head[^>]*>.*?<\/head>|<body[^>]*>|<\/body>/gis, '')}
        </body>
        </html>
      `;
      
      const docBlob = `data:application/msword;charset=utf-8,${encodeURIComponent(wordContent)}`;
      
      console.log(`✅ Free DOCX resume generated successfully for ${resumeData.personalInfo.email}`);
      
      return c.json({
        success: true,
        message: "Your Word document resume has been generated successfully!",
        downloadUrl: docBlob,
        fileName: `${safeFileName}_Resume.doc`,
        format: 'docx',
        instructions: "The resume will download as a Word document that you can open and edit in Microsoft Word or Google Docs."
      });
    }

    return c.json({ error: "Unsupported format" }, 400);

  } catch (error) {
    console.error('Free resume generation error:', error);
    return c.json({ 
      error: "Resume generation failed. Please try again.",
      details: error.message 
    }, 500);
  }
});

function generateResumeContent(resumeData: any, template: string): string {
  const { personalInfo, experience, education, skills, projects, certifications } = resumeData;
  
  // Template-specific styles
  const templateStyles = {
    modern: {
      primaryColor: '#3b82f6',
      backgroundColor: '#f8fafc',
      headerBackground: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)'
    },
    classic: {
      primaryColor: '#1e293b',
      backgroundColor: '#ffffff',
      headerBackground: '#1e293b'
    },
    creative: {
      primaryColor: '#8b5cf6',
      backgroundColor: '#faf5ff',
      headerBackground: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)'
    },
    minimal: {
      primaryColor: '#059669',
      backgroundColor: '#f0fdf4',
      headerBackground: '#059669'
    }
  };

  const style = templateStyles[template] || templateStyles.modern;
  
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Professional Resume - ${personalInfo.fullName}</title>
      <style>
        @media print {
          @page {
            margin: 0.5in;
            border: 2px solid ${style.primaryColor};
          }
          body { margin: 0; padding: 0; }
          .resume-container { 
            box-shadow: none; 
            padding: 20px; 
            border: 2px solid ${style.primaryColor};
            page-break-inside: avoid;
          }
        }
        
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          margin: 0;
          padding: 20px;
          background: ${style.backgroundColor};
        }
        .resume-container {
          max-width: 800px;
          margin: 0 auto;
          background: white;
          padding: 40px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
          border-radius: 8px;
          border: 2px solid ${style.primaryColor};
          position: relative;
        }
        .professional-border {
          position: absolute;
          top: 10px;
          left: 10px;
          right: 10px;
          bottom: 10px;
          border: 1px solid ${style.primaryColor}40;
          border-radius: 4px;
          pointer-events: none;
        }
        .header {
          text-align: center;
          background: ${style.headerBackground};
          color: white;
          padding: 30px;
          border-radius: 8px;
          margin-bottom: 30px;
        }
        .name {
          font-size: 36px;
          font-weight: bold;
          margin-bottom: 10px;
        }
        .contact-info {
          font-size: 16px;
          opacity: 0.9;
        }
        .contact-info a {
          color: inherit;
          text-decoration: none;
        }
        .section {
          margin-bottom: 30px;
          page-break-inside: avoid;
        }
        .section-title {
          font-size: 24px;
          font-weight: bold;
          color: ${style.primaryColor};
          border-bottom: 2px solid ${style.primaryColor};
          padding-bottom: 10px;
          margin-bottom: 20px;
        }
        .experience-item, .education-item, .project-item, .certification-item {
          margin-bottom: 20px;
          page-break-inside: avoid;
        }
        .job-title, .degree, .project-name, .cert-name {
          font-size: 18px;
          font-weight: bold;
          color: #1e293b;
        }
        .company, .school, .cert-issuer {
          font-size: 16px;
          color: ${style.primaryColor};
          margin-bottom: 5px;
          font-weight: 500;
        }
        .date-range {
          font-size: 14px;
          color: #64748b;
          margin-bottom: 10px;
          font-style: italic;
        }
        .description {
          color: #374151;
          line-height: 1.6;
        }
        .skills-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 8px;
          margin-bottom: 15px;
        }
        .skill-item {
          background: ${style.backgroundColor === '#ffffff' ? '#f1f5f9' : style.backgroundColor};
          padding: 6px 12px;
          border-radius: 6px;
          color: #334155;
          font-weight: 500;
          text-align: center;
          border: 1px solid ${style.primaryColor}20;
        }
        .skill-category {
          margin-bottom: 20px;
        }
        .skill-category h4 {
          margin: 0 0 10px 0;
          font-size: 16px;
        }
        .professional-summary {
          background: ${style.backgroundColor === '#ffffff' ? '#f8fafc' : style.backgroundColor};
          padding: 20px;
          border-radius: 8px;
          border-left: 4px solid ${style.primaryColor};
          margin-bottom: 30px;
        }
        .technologies {
          font-size: 14px;
          color: #64748b;
          font-style: italic;
        }
        .project-url, .cert-url {
          font-size: 14px;
          margin-top: 5px;
        }
        .project-url a, .cert-url a {
          color: ${style.primaryColor};
          text-decoration: none;
        }
        .project-url a:hover, .cert-url a:hover {
          text-decoration: underline;
        }
        @media print {
          .resume-container {
            box-shadow: none;
            padding: 20px;
            border: 2px solid ${style.primaryColor};
          }
          .header {
            background: ${style.primaryColor} !important;
            -webkit-print-color-adjust: exact;
            color-adjust: exact;
          }
          .section-title {
            color: ${style.primaryColor} !important;
            -webkit-print-color-adjust: exact;
            color-adjust: exact;
          }
          .professional-border {
            border: 1px solid ${style.primaryColor} !important;
            -webkit-print-color-adjust: exact;
            color-adjust: exact;
          }
        }
      </style>
    </head>
    <body>
      <div class="resume-container">
        <div class="professional-border"></div>
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
              <div class="job-title">${exp.position || exp.title || ''}</div>
              <div class="company">${exp.company || ''}</div>
              <div class="date-range">${exp.startDate || ''} ${exp.startDate && exp.endDate ? ' - ' : ''}${exp.current ? 'Present' : (exp.endDate || '')}</div>
              ${exp.description ? `<div class="description">${exp.description.replace(/\n/g, '<br>')}</div>` : ''}
            </div>
          `).join('')}
        </div>
        ` : ''}

        ${education && education.length > 0 ? `
        <div class="section">
          <div class="section-title">Education</div>
          ${education.map(edu => `
            <div class="education-item">
              <div class="degree">${edu.degree || ''} ${edu.field ? `in ${edu.field}` : ''}</div>
              <div class="school">${edu.institution || ''}</div>
              <div class="date-range">${edu.startDate || ''} ${edu.startDate && edu.endDate ? ' - ' : ''}${edu.endDate || ''}</div>
              ${edu.gpa ? `<div class="description">GPA: ${edu.gpa}</div>` : ''}
            </div>
          `).join('')}
        </div>
        ` : ''}

        ${skills && skills.length > 0 ? `
        <div class="section">
          <div class="section-title">Skills</div>
          ${skills.map(skillCategory => `
            <div class="skill-category">
              ${skillCategory.category ? `<h4>${skillCategory.category}</h4>` : ''}
              <div class="skills-grid">
                ${skillCategory.items.map(skill => `
                  <div class="skill-item">${skill}</div>
                `).join('')}
              </div>
            </div>
          `).join('')}
        </div>
        ` : ''}

        ${projects && projects.length > 0 ? `
        <div class="section">
          <div class="section-title">Projects</div>
          ${projects.map(project => `
            <div class="project-item">
              <div class="project-name">${project.name || ''}</div>
              ${project.description ? `<div class="description">${project.description}</div>` : ''}
              ${project.technologies && project.technologies.length > 0 ? `<div class="technologies">Technologies: ${project.technologies.join(', ')}</div>` : ''}
              ${project.url ? `<div class="project-url"><a href="${project.url}" target="_blank">View Project</a></div>` : ''}
            </div>
          `).join('')}
        </div>
        ` : ''}

        ${certifications && certifications.length > 0 ? `
        <div class="section">
          <div class="section-title">Certifications</div>
          ${certifications.map(cert => `
            <div class="certification-item">
              <div class="cert-name">${cert.name || ''}</div>
              <div class="cert-issuer">${cert.issuer || ''}</div>
              <div class="date-range">${cert.date || ''}</div>
              ${cert.url ? `<div class="cert-url"><a href="${cert.url}" target="_blank">View Certificate</a></div>` : ''}
            </div>
          `).join('')}
        </div>
        ` : ''}
      </div>
    </body>
    </html>
  `;
}

// Helper functions for loading data
async function loadSubscribersData() {
  try {
    const subscribers = await kv.get('newsletter_subscribers') || [];
    return {
      subscribers,
      count: subscribers.length,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('❌ Error loading subscribers:', error);
    return { subscribers: [], count: 0, timestamp: new Date().toISOString() };
  }
}

async function loadNewslettersData() {
  try {
    const newsletters = await kv.get('newsletter_history') || [];
    return {
      newsletters,
      count: newsletters.length,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('❌ Error loading newsletters:', error);
    return { newsletters: [], count: 0, timestamp: new Date().toISOString() };
  }
}

async function loadContactsData() {
  try {
    const contacts = await kv.get('contact_submissions') || [];
    return {
      contacts,
      count: contacts.length,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('❌ Error loading contacts:', error);
    return { contacts: [], count: 0, timestamp: new Date().toISOString() };
  }
}

// Start the server
Deno.serve(app.fetch);