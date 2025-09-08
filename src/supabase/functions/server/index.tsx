import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Initialize admin password in database if not already set
async function initializeAdminPassword() {
  try {
    // Check if password already exists
    const existingPassword = await kv.get('admin_password');
    if (!existingPassword) {
      // Only set initial password if none exists
      const defaultPassword = Deno.env.get('ADMIN_PASSWORD') || 'HermanAdmin2024!';
      await kv.set('admin_password', defaultPassword);
      console.log(`✅ Admin password initialized (${defaultPassword.length} chars)`);
    } else {
      console.log(`✅ Admin password already exists (${existingPassword.length} chars)`);
    }
  } catch (error) {
    console.warn('⚠️ Password init failed:', error);
  }
}

// Initialize on startup
initializeAdminPassword();

// Enhanced application-level cache with LRU eviction and performance metrics
const appCache = new Map<string, { data: any; expiry: number; hits: number; lastAccessed: number }>();
const cacheStats = { hits: 0, misses: 0, sets: 0, evictions: 0 };
const MAX_CACHE_SIZE = 100; // Prevent memory bloat

// Enhanced cache helper functions with performance optimization
function getCachedData(key: string) {
  const cached = appCache.get(key);
  if (cached && Date.now() < cached.expiry) {
    cached.hits++;
    cached.lastAccessed = Date.now();
    cacheStats.hits++;
    console.log(`📦 Cache HIT for ${key} (hits: ${cached.hits})`);
    return cached.data;
  }
  if (cached) {
    appCache.delete(key);
    console.log(`📦 Cache EXPIRED for ${key}`);
  }
  cacheStats.misses++;
  return null;
}

function setCachedData(key: string, data: any, ttlMs: number = 30000) {
  // Implement LRU eviction if cache is full
  if (appCache.size >= MAX_CACHE_SIZE) {
    const oldestKey = [...appCache.entries()]
      .sort((a, b) => a[1].lastAccessed - b[1].lastAccessed)[0][0];
    appCache.delete(oldestKey);
    cacheStats.evictions++;
    console.log(`📦 Cache EVICTED ${oldestKey} (LRU)`);
  }

  appCache.set(key, {
    data,
    expiry: Date.now() + ttlMs,
    hits: 0,
    lastAccessed: Date.now()
  });
  cacheStats.sets++;
  console.log(`📦 Cache SET for ${key} (TTL: ${ttlMs}ms, size: ${appCache.size})`);
}

// Batch KV operations for better performance
const kvBatch = new Map<string, any>();
let batchTimeout: NodeJS.Timeout | null = null;

function queueKvWrite(key: string, data: any) {
  kvBatch.set(key, data);
  
  if (batchTimeout) clearTimeout(batchTimeout);
  batchTimeout = setTimeout(async () => {
    await flushKvBatch();
  }, 100); // Batch writes for 100ms
}

async function flushKvBatch() {
  if (kvBatch.size === 0) return;
  
  const writes = Array.from(kvBatch.entries());
  kvBatch.clear();
  
  console.log(`📝 Flushing KV batch: ${writes.length} operations`);
  
  // Execute all writes in parallel
  await Promise.all(writes.map(([key, data]) => 
    kv.set(key, data).catch(err => 
      console.error(`❌ Batch write failed for ${key}:`, err)
    )
  ));
}

// Request deduplication to prevent duplicate concurrent requests
const pendingRequests = new Map<string, Promise<any>>();

function deduplicateRequest<T>(key: string, requestFn: () => Promise<T>): Promise<T> {
  if (pendingRequests.has(key)) {
    console.log(`🔄 Deduplicating request: ${key}`);
    return pendingRequests.get(key) as Promise<T>;
  }
  
  const promise = requestFn().finally(() => {
    pendingRequests.delete(key);
  });
  
  pendingRequests.set(key, promise);
  return promise;
}

// Cleanup old cache entries and stats periodically
setInterval(() => {
  const now = Date.now();
  let cleaned = 0;
  
  for (const [key, value] of appCache.entries()) {
    if (now >= value.expiry) {
      appCache.delete(key);
      cleaned++;
    }
  }
  
  if (cleaned > 0) {
    console.log(`🧹 Cache cleanup: removed ${cleaned} expired entries`);
  }
  
  // Log cache stats every 5 minutes
  if (Math.floor(now / 300000) % 1 === 0) {
    console.log(`📊 Cache stats - Hits: ${cacheStats.hits}, Misses: ${cacheStats.misses}, Hit Rate: ${(cacheStats.hits / (cacheStats.hits + cacheStats.misses) * 100).toFixed(1)}%`);
  }
}, 60000); // Clean every minute

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

// Add performance monitoring middleware
app.use('*', async (c, next) => {
  const start = Date.now();
  await next();
  const responseTime = Date.now() - start;
  
  // Add response time header
  c.res.headers.set('X-Response-Time', `${responseTime}ms`);
  
  // Log slow responses
  if (responseTime > 1000) {
    console.warn(`⚠️ Slow response: ${c.req.method} ${c.req.url} took ${responseTime}ms`);
  }
});

// Admin authentication check using token (for authenticated sessions)
const checkAdminAuth = (request: Request) => {
  const adminToken = request.headers.get('X-Admin-Token');
  // Simple token check - you can change this token
  const validAdminToken = 'herman_admin_2024_secure_token';
  return adminToken === validAdminToken;
};

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

// Update admin password endpoint with current password verification
app.post("/make-server-4d80a1b0/admin/update-password", async (c) => {
  if (!checkAdminAuth(c.req.raw)) {
    return c.json({ error: 'Unauthorized access' }, 401);
  }

  try {
    const body = await c.req.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return c.json({ error: "Current password and new password are required" }, 400);
    }

    if (newPassword.length < 8) {
      return c.json({ error: "New password must be at least 8 characters long" }, 400);
    }

    // Verify current password first
    let expectedPassword;
    try {
      const dbPassword = await kv.get('admin_password');
      expectedPassword = dbPassword || Deno.env.get('ADMIN_PASSWORD') || 'HermanAdmin2024!';
    } catch (dbError) {
      console.warn('Failed to fetch current password from database:', dbError);
      expectedPassword = Deno.env.get('ADMIN_PASSWORD') || 'HermanAdmin2024!';
    }

    if (currentPassword.trim() !== expectedPassword.trim()) {
      console.log(`❌ Failed password update attempt - incorrect current password at ${new Date().toISOString()}`);
      return c.json({ error: "Current password is incorrect" }, 401);
    }

    // Validate new password strength
    const hasUpperCase = /[A-Z]/.test(newPassword);
    const hasLowerCase = /[a-z]/.test(newPassword);
    const hasNumbers = /\d/.test(newPassword);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);

    if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
      return c.json({ 
        error: "Password must contain uppercase letters, lowercase letters, numbers, and special characters" 
      }, 400);
    }

    // Update password in database
    await kv.set('admin_password', newPassword);
    
    console.log(`✅ Admin password updated successfully at ${new Date().toISOString()}`);
    
    return c.json({ 
      success: true, 
      message: "Password updated successfully"
    });

  } catch (error) {
    console.error('Password update error:', error);
    return c.json({ error: "Failed to update password" }, 500);
  }
});

// Health check endpoint - FAST
app.get("/make-server-4d80a1b0/health", (c) => {
  return c.json({ 
    status: "ok", 
    timestamp: new Date().toISOString(),
    cache_size: appCache.size,
    uptime: process.uptime ? `${Math.floor(process.uptime())}s` : 'unknown'
  });
});

// Ultra-fast ping endpoint for connectivity tests and warm-up
app.get("/make-server-4d80a1b0/ping", (c) => {
  return c.json({ pong: true, ts: Date.now() });
});

// Fast warm-up endpoint to prevent cold starts
app.get("/make-server-4d80a1b0/warm", (c) => {
  return c.json({ warm: true });
});

// Secure password status endpoint (no password exposure)
app.get("/make-server-4d80a1b0/admin/password-status", async (c) => {
  if (!checkAdminAuth(c.req.raw)) {
    return c.json({ error: 'Unauthorized access' }, 401);
  }

  try {
    const dbPassword = await kv.get('admin_password');
    return c.json({ 
      status: 'ok',
      hasPassword: !!dbPassword,
      passwordLength: dbPassword ? dbPassword.length : 0,
      source: dbPassword ? 'database' : 'none',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return c.json({ 
      status: 'error',
      error: error.message 
    }, 500);
  }
});



// Emergency password reset endpoint (no auth required for emergency access)
app.post("/make-server-4d80a1b0/admin/emergency-reset", async (c) => {
  try {
    const body = await c.req.json();
    const { emergencyKey, newPassword } = body;
    
    // Simple emergency key check
    if (emergencyKey !== 'herman_emergency_2024') {
      return c.json({ error: 'Invalid emergency key' }, 401);
    }
    
    if (!newPassword || newPassword.length < 8) {
      return c.json({ error: 'New password must be at least 8 characters' }, 400);
    }
    
    await kv.set('admin_password', newPassword);
    console.log(`🔄 Emergency password reset completed at ${new Date().toISOString()}`);
    
    return c.json({
      success: true,
      message: 'Password reset successfully. You can now login with the new password.',
      newPasswordLength: newPassword.length
    });
  } catch (error) {
    console.error('❌ Emergency reset failed:', error);
    return c.json({ error: 'Reset failed' }, 500);
  }
});

// Secure password reset endpoint (admin only)
app.post("/make-server-4d80a1b0/admin/reset-password", async (c) => {
  if (!checkAdminAuth(c.req.raw)) {
    return c.json({ error: 'Unauthorized access' }, 401);
  }

  try {
    const body = await c.req.json();
    const { newPassword } = body;

    if (!newPassword || newPassword.length < 8) {
      return c.json({
        error: 'New password must be at least 8 characters long'
      }, 400);
    }

    await kv.set('admin_password', newPassword);
    console.log(`✅ Admin password reset completed at ${new Date().toISOString()}`);
    
    return c.json({
      success: true,
      message: 'Password reset completed successfully'
    });
  } catch (error) {
    console.error('❌ Password reset failed:', error);
    return c.json({
      success: false,
      error: 'Reset failed'
    }, 500);
  }
});

// ULTRA FAST batch endpoint to get all admin data in one request
app.get("/make-server-4d80a1b0/admin/dashboard-data", async (c) => {
  if (!checkAdminAuth(c.req.raw)) {
    return c.json({ error: 'Unauthorized access' }, 401);
  }

  return deduplicateRequest('dashboard-batch', async () => {
    const startTime = Date.now();
    
    try {
      console.log('📊 Starting batch dashboard data fetch');
      
      // Check if we have all data cached
      const cachedSubscribers = getCachedData('subscribers');
      const cachedNewsletters = getCachedData('newsletters');
      const cachedContacts = getCachedData('contacts');
      
      if (cachedSubscribers && cachedNewsletters && cachedContacts) {
        const batchResult = {
          subscribers: cachedSubscribers,
          newsletters: cachedNewsletters,
          contacts: cachedContacts,
          lastUpdated: new Date().toISOString(),
          source: 'cache'
        };
        
        c.res.headers.set('X-Cache', 'HIT');
        c.res.headers.set('X-Response-Time', `${Date.now() - startTime}ms`);
        
        console.log(`📊 Returned full dashboard data from cache (${Date.now() - startTime}ms)`);
        return c.json(batchResult);
      }
      
      console.log('📊 Cache miss - fetching fresh dashboard data');
      
      // Fetch all data in parallel for maximum speed
      const [subscribersResult, newslettersResult, contactsResult] = await Promise.allSettled([
        // Subscribers
        (async () => {
          if (cachedSubscribers) return cachedSubscribers;
          
          const subscribers = await kv.get('newsletter_subscribers') || [];
          const result = { 
            subscribers: subscribers,
            count: subscribers.length,
            lastUpdated: new Date().toISOString()
          };
          setCachedData('subscribers', result, 120000);
          return result;
        })(),
        
        // Newsletters
        (async () => {
          if (cachedNewsletters) return cachedNewsletters;
          
          const newsletters = await kv.get('newsletters_list') || [];
          if (newsletters.length === 0) {
            const result = { newsletters: [], count: 0, lastUpdated: new Date().toISOString() };
            setCachedData('newsletters', result, 300000);
            return result;
          }
          
          // Batch fetch recent newsletters
          const recentNewsletters = newsletters.slice(-10);
          let newsletterHistory;
          
          try {
            newsletterHistory = await kv.mget(recentNewsletters);
          } catch {
            const promises = recentNewsletters.map(id => kv.get(id).catch(() => null));
            newsletterHistory = await Promise.all(promises);
          }
          
          const validNewsletters = newsletterHistory
            .filter(n => n && n.sentAt)
            .sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime());
          
          const result = { 
            newsletters: validNewsletters,
            count: validNewsletters.length,
            lastUpdated: new Date().toISOString()
          };
          setCachedData('newsletters', result, 180000);
          return result;
        })(),
        
        // Contacts
        (async () => {
          if (cachedContacts) return cachedContacts;
          
          let contacts = [];
          try {
            contacts = await kv.getByPrefix('contact:');
          } catch {
            // Fallback to individual fetching
            const contactIds = await kv.get('contact_ids') || [];
            const promises = contactIds.slice(-50).map(id => kv.get(`contact:${id}`).catch(() => null));
            contacts = (await Promise.all(promises)).filter(c => c);
          }
          
          const validContacts = contacts
            .filter(c => c && c.submittedAt)
            .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
          
          const result = { 
            contacts: validContacts,
            count: validContacts.length,
            lastUpdated: new Date().toISOString()
          };
          setCachedData('contacts', result, 90000);
          return result;
        })()
      ]);
      
      // Process results
      const batchResult = {
        subscribers: subscribersResult.status === 'fulfilled' ? subscribersResult.value : { subscribers: [], count: 0, error: 'Failed to fetch' },
        newsletters: newslettersResult.status === 'fulfilled' ? newslettersResult.value : { newsletters: [], count: 0, error: 'Failed to fetch' },
        contacts: contactsResult.status === 'fulfilled' ? contactsResult.value : { contacts: [], count: 0, error: 'Failed to fetch' },
        lastUpdated: new Date().toISOString(),
        source: 'batch-fetch',
        errors: [
          subscribersResult.status === 'rejected' ? subscribersResult.reason : null,
          newslettersResult.status === 'rejected' ? newslettersResult.reason : null,
          contactsResult.status === 'rejected' ? contactsResult.reason : null
        ].filter(Boolean)
      };
      
      const duration = Date.now() - startTime;
      c.res.headers.set('X-Cache', 'MISS');
      c.res.headers.set('X-Response-Time', `${duration}ms`);
      
      console.log(`📊 Completed batch dashboard fetch (${duration}ms)`);
      
      return c.json(batchResult);
      
    } catch (error) {
      console.error('Error in batch dashboard fetch:', error);
      
      // Return any cached data we have
      const batchResult = {
        subscribers: getCachedData('subscribers') || { subscribers: [], count: 0 },
        newsletters: getCachedData('newsletters') || { newsletters: [], count: 0 },
        contacts: getCachedData('contacts') || { contacts: [], count: 0 },
        lastUpdated: new Date().toISOString(),
        source: 'fallback-cache',
        error: error.message
      };
      
      c.res.headers.set('X-Cache', 'ERROR-FALLBACK');
      return c.json(batchResult);
    }
  });
});

// Removed - password should never be exposed via API

// Health check for admin endpoints
app.get("/make-server-4d80a1b0/admin/health", (c) => {
  const adminToken = c.req.header('X-Admin-Token');
  const isAuthorized = adminToken === 'herman_admin_2024_secure_token';
  
  return c.json({ 
    status: "ok",
    authorized: isAuthorized,
    timestamp: new Date().toISOString()
  });
});

// Performance stats endpoint (admin only)
app.get("/make-server-4d80a1b0/admin/stats", async (c) => {
  if (!checkAdminAuth(c.req.raw)) {
    return c.json({ error: 'Unauthorized access' }, 401);
  }

  try {
    // Quick stats without heavy operations
    const stats = {
      cache_entries: appCache.size,
      timestamp: new Date().toISOString(),
      memory_usage: 'available', // Deno doesn't expose detailed memory stats
      uptime: process.uptime ? `${Math.floor(process.uptime())}s` : 'unknown',
      environment: Deno.env.get('ENVIRONMENT') || 'development'
    };

    return c.json(stats);
  } catch (error) {
    console.error('Stats endpoint error:', error);
    return c.json({ error: 'Failed to fetch stats' }, 500);
  }
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

    // Use batched write for better performance
    queueKvWrite(`contact:${submissionId}`, contactData);
    
    // Update contact IDs list for fallback fetching
    const contactIds = await kv.get('contact_ids') || [];
    contactIds.push(submissionId);
    queueKvWrite('contact_ids', contactIds.slice(-200)); // Keep last 200 contact IDs
    
    // Invalidate contacts cache
    appCache.delete('contacts');

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
    
    // Invalidate cache
    appCache.delete('subscribers');

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

// Get newsletter subscribers (admin only) - ULTRA OPTIMIZED
app.get("/make-server-4d80a1b0/subscribers", async (c) => {
  if (!checkAdminAuth(c.req.raw)) {
    return c.json({ error: 'Unauthorized access' }, 401);
  }

  return deduplicateRequest('subscribers', async () => {
    const startTime = Date.now();
    
    try {
      // Check cache first with longer TTL
      const cached = getCachedData('subscribers');
      if (cached) {
        c.res.headers.set('X-Cache', 'HIT');
        c.res.headers.set('X-Response-Time', `${Date.now() - startTime}ms`);
        console.log(`👥 Returned ${cached.subscribers?.length || 0} subscribers from cache (${Date.now() - startTime}ms)`);
        return c.json(cached);
      }
      
      console.log('👥 Cache miss - fetching subscribers from KV store');
      const subscribers = await kv.get('newsletter_subscribers') || [];
      
      const result = { 
        subscribers: subscribers,
        count: subscribers.length,
        lastUpdated: new Date().toISOString()
      };
      
      // Longer cache for relatively static data
      setCachedData('subscribers', result, 120000); // 2 minutes
      
      const duration = Date.now() - startTime;
      c.res.headers.set('X-Cache', 'MISS');
      c.res.headers.set('X-Response-Time', `${duration}ms`);
      
      console.log(`👥 Fetched ${subscribers.length} subscribers and cached (${duration}ms)`);
      
      return c.json(result);
    } catch (error) {
      console.error('Error fetching subscribers:', error);
      
      // Return stale cache if available during errors
      const staleCache = appCache.get('subscribers');
      if (staleCache) {
        console.log('👥 Returning stale cache due to error');
        c.res.headers.set('X-Cache', 'STALE');
        return c.json(staleCache.data);
      }
      
      return c.json({ error: "Failed to fetch subscribers" }, 500);
    }
  });
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
    
    // Invalidate newsletters cache
    appCache.delete('newsletters');

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

// Get newsletter history (admin only) - ULTRA OPTIMIZED WITH BATCHING
app.get("/make-server-4d80a1b0/newsletters", async (c) => {
  if (!checkAdminAuth(c.req.raw)) {
    return c.json({ error: 'Unauthorized access' }, 401);
  }

  return deduplicateRequest('newsletters', async () => {
    const startTime = Date.now();
    
    try {
      // Check cache first with aggressive caching
      const cached = getCachedData('newsletters');
      if (cached) {
        c.res.headers.set('X-Cache', 'HIT');
        c.res.headers.set('X-Response-Time', `${Date.now() - startTime}ms`);
        console.log(`📄 Returned ${cached.newsletters?.length || 0} newsletters from cache (${Date.now() - startTime}ms)`);
        return c.json(cached);
      }
      
      console.log('📄 Cache miss - fetching newsletters from KV store');
      
      // Get newsletters list with error handling
      const newsletters = await kv.get('newsletters_list') || [];
      
      if (newsletters.length === 0) {
        const result = { 
          newsletters: [], 
          count: 0,
          lastUpdated: new Date().toISOString()
        };
        setCachedData('newsletters', result, 300000); // Cache empty result for 5 minutes
        
        const duration = Date.now() - startTime;
        c.res.headers.set('X-Cache', 'MISS');
        c.res.headers.set('X-Response-Time', `${duration}ms`);
        
        console.log(`📄 No newsletters found, cached empty result (${duration}ms)`);
        return c.json(result);
      }

      // Optimize batch fetching - limit and use mget if available
      const recentNewsletters = newsletters.slice(-15); // Increased limit slightly
      console.log(`📄 Fetching ${recentNewsletters.length} recent newsletters`);
      
      // Try to use batch get operation if available
      let newsletterHistory;
      try {
        // Use mget for better performance if supported
        newsletterHistory = await kv.mget(recentNewsletters);
        console.log(`📄 Used batch mget operation for ${recentNewsletters.length} newsletters`);
      } catch (mgetError) {
        console.log(`📄 mget not available, falling back to Promise.all`);
        // Fallback to individual gets
        const newsletterPromises = recentNewsletters.map(async (newsletterId) => {
          try {
            return await kv.get(newsletterId);
          } catch (err) {
            console.warn(`Failed to fetch newsletter ${newsletterId}:`, err);
            return null;
          }
        });

        newsletterHistory = await Promise.all(newsletterPromises);
      }

      // Filter out nulls and sort by sent date (newest first)
      const validNewsletters = newsletterHistory
        .filter(newsletter => newsletter !== null && newsletter.sentAt)
        .sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime());

      const result = { 
        newsletters: validNewsletters,
        count: validNewsletters.length,
        totalCount: newsletters.length,
        lastUpdated: new Date().toISOString()
      };
      
      // Aggressive caching for newsletters (they don't change often)
      setCachedData('newsletters', result, 180000); // 3 minutes

      const duration = Date.now() - startTime;
      c.res.headers.set('X-Cache', 'MISS');
      c.res.headers.set('X-Response-Time', `${duration}ms`);
      
      console.log(`📄 Fetched ${validNewsletters.length} newsletters in batch and cached (${duration}ms)`);

      return c.json(result);
    } catch (error) {
      console.error('Error fetching newsletters:', error);
      
      // Return stale cache if available during errors
      const staleCache = appCache.get('newsletters');
      if (staleCache) {
        console.log('📄 Returning stale cache due to error');
        c.res.headers.set('X-Cache', 'STALE');
        return c.json(staleCache.data);
      }
      
      return c.json({ error: "Failed to fetch newsletters" }, 500);
    }
  });
});

// Admin endpoint: Get contact inquiries - ULTRA OPTIMIZED WITH AGGRESSIVE CACHING
app.get("/make-server-4d80a1b0/contacts", async (c) => {
  if (!checkAdminAuth(c.req.raw)) {
    return c.json({ error: 'Unauthorized access' }, 401);
  }

  return deduplicateRequest('contacts', async () => {
    const startTime = Date.now();
    
    try {
      // Check cache first with longer TTL for better performance
      const cached = getCachedData('contacts');
      if (cached) {
        c.res.headers.set('X-Cache', 'HIT');
        c.res.headers.set('X-Response-Time', `${Date.now() - startTime}ms`);
        console.log(`📬 Returned ${cached.contacts?.length || 0} contacts from cache (${Date.now() - startTime}ms)`);
        return c.json(cached);
      }
      
      console.log('📬 Cache miss - fetching contacts from KV store');
      
      // Enhanced contacts fetching with better error handling
      let contacts;
      try {
        contacts = await kv.getByPrefix('contact:');
        console.log(`📬 Retrieved ${contacts.length} raw contacts from KV store`);
      } catch (kvError) {
        console.error('📬 KV getByPrefix failed:', kvError);
        
        // Fallback: try to get a cached list of contact IDs and fetch individually
        const contactIds = await kv.get('contact_ids') || [];
        if (contactIds.length > 0) {
          console.log(`📬 Fallback: fetching ${contactIds.length} contacts individually`);
          const contactPromises = contactIds.slice(-50).map(async (id: string) => {
            try {
              return await kv.get(`contact:${id}`);
            } catch (err) {
              console.warn(`Failed to fetch contact ${id}:`, err);
              return null;
            }
          });
          contacts = (await Promise.all(contactPromises)).filter(c => c !== null);
        } else {
          contacts = [];
        }
      }
      
      // Enhanced filtering and sorting with better error handling
      const validContacts = contacts
        .filter(contact => {
          if (!contact) return false;
          if (typeof contact !== 'object') return false;
          if (!contact.submittedAt) {
            console.warn('Contact missing submittedAt:', contact.id);
            return false;
          }
          return true;
        })
        .map(contact => ({
          ...contact,
          // Ensure all required fields exist
          status: contact.status || 'new',
          notes: contact.notes || '',
          emailSent: contact.emailSent || false
        }));
      
      // Optimized sorting with try-catch for each comparison
      const sortedContacts = validContacts.sort((a, b) => {
        try {
          const dateA = new Date(a.submittedAt).getTime();
          const dateB = new Date(b.submittedAt).getTime();
          
          if (isNaN(dateA) || isNaN(dateB)) {
            console.warn('Invalid date in contact:', { a: a.submittedAt, b: b.submittedAt });
            return 0;
          }
          
          return dateB - dateA; // Newest first
        } catch (err) {
          console.warn('Error comparing contact dates:', err);
          return 0;
        }
      });
      
      // Calculate additional analytics
      const statusCounts = sortedContacts.reduce((acc, contact) => {
        acc[contact.status] = (acc[contact.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      const result = { 
        contacts: sortedContacts,
        count: sortedContacts.length,
        statusCounts,
        lastUpdated: new Date().toISOString(),
        cacheTimestamp: Date.now()
      };
      
      // Longer cache for contacts (they don't change that frequently)
      setCachedData('contacts', result, 90000); // 1.5 minutes
      
      const duration = Date.now() - startTime;
      c.res.headers.set('X-Cache', 'MISS');
      c.res.headers.set('X-Response-Time', `${duration}ms`);
      
      console.log(`📬 Fetched and processed ${sortedContacts.length} contacts (${duration}ms)`);
      
      return c.json(result);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      
      // Return stale cache if available during errors
      const staleCache = appCache.get('contacts');
      if (staleCache) {
        console.log('📬 Returning stale cache due to error');
        c.res.headers.set('X-Cache', 'STALE');
        const staleResult = {
          ...staleCache.data,
          isStale: true,
          error: 'Using cached data due to server error'
        };
        return c.json(staleResult);
      }
      
      return c.json({ 
        error: 'Failed to fetch contacts',
        contacts: [],
        count: 0
      }, 500);
    }
  });
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
    
    // Invalidate contacts cache
    appCache.delete('contacts');

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

// Admin endpoint: Get current password - ULTRA FAST
app.get("/make-server-4d80a1b0/admin/get-password", async (c) => {
  if (!checkAdminAuth(c.req.raw)) {
    return c.json({ error: 'Unauthorized access' }, 401);
  }

  try {
    // Get the actual current password from database
    const dbPassword = await kv.get('admin_password');
    const currentPassword = dbPassword || Deno.env.get('ADMIN_PASSWORD') || 'HermanAdmin2024!';
    
    console.log(`🔑 Current password fetched from: ${dbPassword ? 'database' : 'environment/default'}`);
    
    return c.json({ 
      password: currentPassword,
      source: dbPassword ? 'database' : 'fallback',
      timestamp: new Date().toISOString()
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

// Test email service endpoint (admin only) - OPTIMIZED
app.post("/make-server-4d80a1b0/test-email", async (c) => {
  if (!checkAdminAuth(c.req.raw)) {
    return c.json({ error: 'Unauthorized access' }, 401);
  }

  try {
    console.time('email-test');
    
    const resendApiKey = Deno.env.get('RESEND_API_KEY');

    if (!resendApiKey) {
      console.timeEnd('email-test');
      return c.json({ 
        success: false, 
        error: "RESEND_API_KEY environment variable not set" 
      });
    }

    // Trim whitespace and validate
    const cleanApiKey = resendApiKey.trim();
    if (!cleanApiKey.startsWith('re_')) {
      console.timeEnd('email-test');
      return c.json({ 
        success: false, 
        error: `Invalid Resend API key format. Expected to start with 're_' but got: '${cleanApiKey.substring(0, 10)}...'` 
      });
    }

    // Faster validation - just check API key format without sending actual email
    console.timeEnd('email-test');
    console.log('📧 Email service configuration validated');
    
    return c.json({ 
      success: true, 
      message: "✅ Resend API key is valid and configured correctly.",
      configCheck: true
    });

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
          body { margin: 0; padding: 0; }
          .resume-container { box-shadow: none; padding: 20px; }
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
              <div class="school">${edu.institution || edu.school || ''}</div>
              <div class="date-range">${edu.startDate || ''} ${edu.startDate && edu.endDate ? ' - ' : ''}${edu.endDate || ''}</div>
              ${edu.gpa ? `<div class="description">GPA: ${edu.gpa}</div>` : ''}
            </div>
          `).join('')}
        </div>
        ` : ''}

        ${skills && skills.length > 0 ? `
        <div class="section">
          <div class="section-title">Skills</div>
          ${skills.map(skillGroup => `
            <div class="skill-category">
              <h4 style="color: ${style.primaryColor}; margin-bottom: 10px;">${skillGroup.category || ''}</h4>
              <div class="skills-grid">
                ${(skillGroup.items || []).map(skill => `
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
              ${project.description ? `<div class="description">${project.description.replace(/\n/g, '<br>')}</div>` : ''}
              ${project.technologies && project.technologies.length > 0 ? `
                <div class="technologies" style="margin-top: 10px;">
                  <strong>Technologies:</strong> ${project.technologies.join(', ')}
                </div>
              ` : ''}
              ${project.url ? `<div class="project-url"><a href="${project.url}" target="_blank">${project.url}</a></div>` : ''}
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

        <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #64748b; font-size: 12px;">
          Professional Resume generated by Herman Kwayu Resume Builder
        </div>
      </div>
    </body>
    </html>
  `;
}

// Analytics endpoint
app.post("/make-server-4d80a1b0/analytics", async (c) => {
  try {
    const body = await c.req.json();
    const { events, session } = body;

    if (!events || !Array.isArray(events)) {
      return c.json({ error: "Events array is required" }, 400);
    }

    // Store each event in the analytics data
    for (const event of events) {
      if (!event.event || !event.timestamp || !event.sessionId) {
        continue; // Skip invalid events
      }

      const analyticsKey = `analytics:${event.sessionId}:${event.timestamp}:${Math.random().toString(36).substr(2, 6)}`;
      
      // Store the complete event with session context
      const analyticsData = {
        ...event,
        sessionData: session,
        storedAt: new Date().toISOString()
      };

      await kv.set(analyticsKey, analyticsData);
    }

    console.log(`📊 Stored ${events.length} analytics events for session: ${session?.sessionId}`);

    return c.json({ 
      success: true, 
      message: `Stored ${events.length} analytics events`,
      eventsStored: events.length
    });

  } catch (error) {
    console.error('Analytics storage error:', error);
    return c.json({ error: "Failed to store analytics data" }, 500);
  }
});

// Get analytics data (admin only)
app.get("/make-server-4d80a1b0/analytics", async (c) => {
  if (!checkAdminAuth(c.req.raw)) {
    return c.json({ error: 'Unauthorized access' }, 401);
  }

  try {
    // Get all analytics events
    const analyticsEvents = await kv.getByPrefix('analytics:');
    
    // Sort by timestamp (newest first)
    const sortedEvents = analyticsEvents.sort((a, b) => b.timestamp - a.timestamp);

    // Calculate basic metrics
    const totalEvents = analyticsEvents.length;
    const uniqueSessions = new Set(analyticsEvents.map(event => event.sessionId)).size;
    
    // Calculate resume builder metrics
    const resumeBuilderVisits = analyticsEvents.filter(event => 
      event.event === 'resume_builder_visited'
    ).length;
    
    const resumeTemplateSelections = analyticsEvents.filter(event => 
      event.event === 'resume_template_selected'
    ).length;
    
    const resumeCreations = analyticsEvents.filter(event => 
      event.event === 'resume_created'
    ).length;
    
    const resumeDownloads = analyticsEvents.filter(event => 
      event.event === 'resume_downloaded'
    ).length;

    // Calculate conversion funnel
    const conversionFunnel = {
      totalVisitors: uniqueSessions,
      resumeBuilderVisitors: resumeBuilderVisits,
      resumeCreators: resumeCreations,
      resumeDownloaders: resumeDownloads,
      conversionRates: {
        visitorToBuilder: uniqueSessions > 0 ? (resumeBuilderVisits / uniqueSessions) * 100 : 0,
        builderToCreator: resumeBuilderVisits > 0 ? (resumeCreations / resumeBuilderVisits) * 100 : 0,
        creatorToDownloader: resumeCreations > 0 ? (resumeDownloads / resumeCreations) * 100 : 0,
        visitorToDownloader: uniqueSessions > 0 ? (resumeDownloads / uniqueSessions) * 100 : 0
      }
    };

    // Get template performance
    const templateEvents = analyticsEvents.filter(event => 
      event.event === 'resume_template_selected'
    );
    
    const templateStats = {};
    templateEvents.forEach(event => {
      const templateId = event.properties?.templateId || 'unknown';
      templateStats[templateId] = (templateStats[templateId] || 0) + 1;
    });

    // Get traffic sources
    const trafficSources = {};
    analyticsEvents.forEach(event => {
      if (event.sessionData?.source) {
        const source = event.sessionData.source;
        trafficSources[source] = (trafficSources[source] || 0) + 1;
      }
    });

    // Get recent activity (last 24 hours)
    const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
    const recentEvents = analyticsEvents.filter(event => 
      event.timestamp > oneDayAgo
    ).slice(0, 50); // Limit to 50 recent events

    return c.json({
      success: true,
      data: {
        totalEvents,
        uniqueSessions,
        conversionFunnel,
        templateStats,
        trafficSources,
        recentEvents: recentEvents.map(event => ({
          event: event.event,
          timestamp: event.timestamp,
          properties: event.properties,
          sessionId: event.sessionId
        }))
      }
    });

  } catch (error) {
    console.error('Error fetching analytics data:', error);
    return c.json({ error: 'Failed to fetch analytics data' }, 500);
  }
});

// Server startup
Deno.serve(app.fetch);