import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Admin authentication check using token (for authenticated sessions)
const checkAdminAuth = (request: Request) => {
  const adminToken = request.headers.get('X-Admin-Token');
  // Simple token check - you can change this token
  const validAdminToken = 'herman_admin_2024_secure_token';
  return adminToken === validAdminToken;
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

// Health check endpoint
app.get("/make-server-4d80a1b0/health", async (c) => {
  return c.json({ 
    status: "healthy", 
    timestamp: new Date().toISOString(),
    message: "Server is running properly" 
  });
});

// Free resume generation endpoint (no payment required)
app.post("/make-server-4d80a1b0/generate-resume", async (c) => {
  try {
    console.log('📄 Resume generation request received');
    
    const body = await c.req.json();
    console.log('📋 Request body parsed successfully');
    
    const { resumeData, template, format } = body;

    if (!resumeData || !template || !format) {
      console.log('❌ Missing required data:', { 
        hasResumeData: !!resumeData, 
        hasTemplate: !!template, 
        hasFormat: !!format 
      });
      return c.json({ error: "Missing required data (resumeData, template, format)" }, 400);
    }

    // Validate resume data has required fields
    if (!resumeData.personalInfo || !resumeData.personalInfo.email || !resumeData.personalInfo.fullName) {
      console.log('❌ Missing personal info:', {
        hasPersonalInfo: !!resumeData.personalInfo,
        hasEmail: !!resumeData.personalInfo?.email,
        hasFullName: !!resumeData.personalInfo?.fullName
      });
      return c.json({ error: "Missing required personal information (name and email)" }, 400);
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(resumeData.personalInfo.email)) {
      console.log('❌ Invalid email format:', resumeData.personalInfo.email);
      return c.json({ error: "Invalid email address format" }, 400);
    }

    // Validate format
    if (!['pdf', 'docx'].includes(format)) {
      console.log('❌ Invalid format:', format);
      return c.json({ error: "Invalid format. Must be 'pdf' or 'docx'" }, 400);
    }

    console.log(`📄 Generating free resume: ${format} for ${resumeData.personalInfo.fullName}`);

    // Generate resume content
    console.log('🔄 Calling generateResumeContent...');
    const resumeContent = generateResumeContent(resumeData, template);
    console.log('✅ Resume content generated successfully');
    
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
    console.error('❌ [Supabase] Free resume generation error:', error);
    console.error('❌ Error stack:', error.stack);
    console.error('❌ Error name:', error.name);
    console.error('❌ Error message:', error.message);
    return c.json({ 
      error: "Resume generation failed. Please try again.",
      details: error.message,
      timestamp: new Date().toISOString()
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

// Start the server
Deno.serve(app.fetch);