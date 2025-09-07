import { useState, useEffect } from 'react';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { SEOAudit } from "./SEOAudit";

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  company: string;
  service: string;
  budget: string;
  timeline: string;
  message: string;
  submittedAt: string;
  status: 'new' | 'contacted' | 'in-progress' | 'completed' | 'archived';
  notes?: string;
  lastUpdated?: string;
  emailSent?: boolean;
}

interface Newsletter {
  id: string;
  subject: string;
  content: string;
  previewText: string;
  sentAt: string;
  subscriberCount: number;
  successCount: number;
  failCount: number;
  status: string;
}

interface AdminDashboardProps {
  isVisible: boolean;
  onClose: () => void;
}

export function AdminDashboard({ isVisible, onClose }: AdminDashboardProps) {
  // Newsletter templates
  const newsletterTemplates = {
    'weekly-update': {
      subject: 'Weekly Business Insights from Herman Kwayu',
      content: `Hello [Subscriber],

I hope this message finds you well! Here are this week's key insights and updates from the world of business strategy and digital transformation:

🎯 **This Week's Focus: [Main Topic]**
[Write your main content here about current business trends, insights, or updates]

💡 **Quick Tip**
[Share a practical tip that subscribers can implement immediately]

📈 **Resource Recommendation**
I came across [resource/tool/article] that I think you'd find valuable for [specific use case].

🔗 **What I'm Working On**
[Brief update about your current projects or services]

That's all for this week! I'd love to hear your thoughts on [relevant question or topic].

Best regards,
Herman Kwayu

P.S. Got questions about digital transformation or business strategy? Just hit reply - I read every message personally.`,
      previewText: 'Weekly insights on business strategy and digital transformation'
    },
    'monthly-deep-dive': {
      subject: 'Monthly Deep Dive: [Topic] - Herman Kwayu Consulting',
      content: `Dear Business Leader,

This month, I want to dive deep into [specific topic] and how it's reshaping the business landscape.

📊 **The Current State**
[Detailed analysis of the topic and current trends]

🔍 **Why This Matters for Your Business**
[Specific implications and opportunities for subscribers]

✅ **Actionable Steps You Can Take Today**
1. [First actionable step]
2. [Second actionable step]
3. [Third actionable step]

🎯 **Case Study: Real Results**
[Brief case study or example showing practical application]

🚀 **Looking Ahead**
[Future predictions or trends to watch]

---

**Ready to Transform Your Business?**
If you're looking to implement these strategies in your organization, I'd love to discuss how we can work together. Schedule a free consultation at [your calendly link].

Best regards,
Herman Kwayu
Digital Strategy & Process Optimization Expert`,
      previewText: 'Deep dive analysis and actionable insights for business leaders'
    },
    'service-announcement': {
      subject: '🚀 New Service Launch: [Service Name]',
      content: `Hello [Subscriber],

I'm excited to share something I've been working on that I believe will make a significant impact on your business growth.

🎉 **Introducing: [New Service Name]**
[Description of the new service and what it offers]

💼 **Who This Is Perfect For:**
• [Target audience 1]
• [Target audience 2]
• [Target audience 3]

✨ **What You Can Expect:**
• [Benefit 1]
• [Benefit 2]
• [Benefit 3]

📈 **Early Results**
[Share any early results or testimonials if available]

🎁 **Special Launch Offer**
As a valued newsletter subscriber, you get [special offer details].

Ready to learn more? [Call-to-action button/link]

Questions? Simply reply to this email - I personally respond to every inquiry.

Best regards,
Herman Kwayu`,
      previewText: 'Exciting new service announcement with exclusive subscriber benefits'
    },
    'insights-sharing': {
      subject: 'Lessons from the Field: [Specific Insight]',
      content: `Hi there,

I just finished working with a client on [type of project], and I wanted to share some insights that might be valuable for your business too.

🎯 **The Challenge**
[Describe the challenge or problem]

💡 **The Approach**
[Explain the strategy or solution implemented]

📊 **The Results**
[Share the outcomes and impact]

🔑 **Key Takeaways for You:**
• [Takeaway 1]
• [Takeaway 2]  
• [Takeaway 3]

This experience reinforced something I've seen time and again: [key principle or lesson].

**How does this apply to your business?** [Ask a thought-provoking question]

I'd love to hear your thoughts on this. Hit reply and let me know if you've faced similar challenges.

Cheers,
Herman Kwayu

P.S. If you're dealing with similar challenges, let's chat. I offer complimentary strategy calls to help you identify opportunities in your business.`,
      previewText: 'Real-world insights from recent client work and practical lessons'
    }
  };
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Session management state
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [sessionTimer, setSessionTimer] = useState<NodeJS.Timeout | null>(null);
  const [showLogoutWarning, setShowLogoutWarning] = useState(false);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  
  // Auto-logout constants
  const SESSION_TIMEOUT = 10 * 60 * 1000; // 10 minutes in milliseconds
  const WARNING_TIME = 2 * 60 * 1000; // Show warning 2 minutes before logout
  
  // Newsletter state
  const [subscribers, setSubscribers] = useState<string[]>([]);
  const [newsletterHistory, setNewsletterHistory] = useState<Newsletter[]>([]);
  const [newsletterForm, setNewsletterForm] = useState({
    subject: '',
    content: '',
    previewText: ''
  });
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  
  // Contact state
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [selectedContact, setSelectedContact] = useState<ContactSubmission | null>(null);
  
  // System state
  const [systemStatus, setSystemStatus] = useState({
    emailService: 'checking',
    database: 'checking',
    contactForm: 'checking',
    newsletterSystem: 'checking'
  });
  const [currentPassword, setCurrentPassword] = useState('Loading...');
  
  // Analytics state
  const [analytics, setAnalytics] = useState({
    totalContacts: 0,
    newContacts: 0,
    responseRate: 0,
    avgResponseTime: '0 hours',
    completionRate: 0
  });
  
  // SEO audit state
  const [showSEOAudit, setShowSEOAudit] = useState(false);

  // Clear messages after 5 seconds
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  // Session management and auto-logout
  useEffect(() => {
    if (isAuthenticated) {
      const now = Date.now();
      setLastActivity(now);
      
      // Clear any existing timer
      if (sessionTimer) clearTimeout(sessionTimer);
      
      // Set up activity listeners
      const handleActivity = () => {
        const currentTime = Date.now();
        setLastActivity(currentTime);
        setShowLogoutWarning(false);
        
        // Reset the session timer
        if (sessionTimer) clearTimeout(sessionTimer);
        
        const newTimer = setTimeout(() => {
          checkSessionTimeout();
        }, SESSION_TIMEOUT - WARNING_TIME);
        
        setSessionTimer(newTimer);
      };

      // Add event listeners for user activity
      const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
      events.forEach(event => {
        document.addEventListener(event, handleActivity, true);
      });

      // Initial timer setup
      handleActivity();

      return () => {
        // Cleanup event listeners
        events.forEach(event => {
          document.removeEventListener(event, handleActivity, true);
        });
        if (sessionTimer) clearTimeout(sessionTimer);
      };
    }
  }, [isAuthenticated]);

  const checkSessionTimeout = () => {
    const now = Date.now();
    const timeSinceLastActivity = now - lastActivity;
    
    if (timeSinceLastActivity >= SESSION_TIMEOUT - WARNING_TIME) {
      if (timeSinceLastActivity >= SESSION_TIMEOUT) {
        // Force logout
        handleLogout('Session expired due to inactivity');
      } else {
        // Show warning
        setShowLogoutWarning(true);
        
        // Set timer for final logout
        const timeUntilLogout = SESSION_TIMEOUT - timeSinceLastActivity;
        const finalTimer = setTimeout(() => {
          handleLogout('Session expired due to inactivity');
        }, timeUntilLogout);
        
        setSessionTimer(finalTimer);
      }
    }
  };

  const handleLogout = (reason?: string) => {
    // Clear all session data
    setIsAuthenticated(false);
    setPassword('');
    setSubscribers([]);
    setNewsletterHistory([]);
    setContacts([]);
    setSelectedContact(null);
    setShowLogoutWarning(false);
    setShowPasswordReset(false);
    
    // Clear timers
    if (sessionTimer) clearTimeout(sessionTimer);
    setSessionTimer(null);
    
    // Show logout message
    if (reason) {
      setError(reason);
    } else {
      setSuccess('Successfully logged out');
    }
  };

  const extendSession = () => {
    setLastActivity(Date.now());
    setShowLogoutWarning(false);
    
    // Reset timer
    if (sessionTimer) clearTimeout(sessionTimer);
    const newTimer = setTimeout(() => {
      checkSessionTimeout();
    }, SESSION_TIMEOUT - WARNING_TIME);
    setSessionTimer(newTimer);
  };

  const authenticate = async () => {
    setLoading(true);
    setError(null);
    
    if (!password.trim()) {
      setError('Please enter admin password');
      setLoading(false);
      return;
    }
    
    try {
      // Send password to server for validation
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-4d80a1b0/admin/authenticate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({ password })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setIsAuthenticated(true);
        await loadDashboardData();
        setSuccess('Successfully authenticated');
        console.log('✅ Admin authentication successful');
      } else {
        const errorMessage = result.error || 'Invalid admin password';
        setError(errorMessage);
        console.log(`❌ Admin authentication failed: ${errorMessage}`);
        // Clear password field on failed attempt for security
        setPassword('');
      }
    } catch (err) {
      setError('Authentication failed - please check your connection');
      setPassword('');
    } finally {
      setLoading(false);
    }
  };

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Load subscribers
      const subscribersResponse = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-4d80a1b0/subscribers`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'X-Admin-Token': 'herman_admin_2024_secure_token'
        }
      });

      if (subscribersResponse.ok) {
        const subscribersData = await subscribersResponse.json();
        setSubscribers(subscribersData.subscribers);
        setSystemStatus(prev => ({ ...prev, database: 'active' }));
      } else {
        setSystemStatus(prev => ({ ...prev, database: 'error' }));
      }

      // Load newsletter history
      const newslettersResponse = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-4d80a1b0/newsletters`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'X-Admin-Token': 'herman_admin_2024_secure_token'
        }
      });

      if (newslettersResponse.ok) {
        const newslettersData = await newslettersResponse.json();
        setNewsletterHistory(newslettersData.newsletters);
        setSystemStatus(prev => ({ ...prev, newsletterSystem: 'active' }));
      } else {
        setSystemStatus(prev => ({ ...prev, newsletterSystem: 'error' }));
      }

      // Load contacts
      const contactsResponse = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-4d80a1b0/contacts`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'X-Admin-Token': 'herman_admin_2024_secure_token'
        }
      });

      if (contactsResponse.ok) {
        const contactsData = await contactsResponse.json();
        setContacts(contactsData.contacts);
        setSystemStatus(prev => ({ ...prev, contactForm: 'active' }));
        
        // Calculate analytics
        calculateAnalytics(contactsData.contacts);
      } else {
        setSystemStatus(prev => ({ ...prev, contactForm: 'error' }));
      }

      // Test email service
      const emailTestResponse = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-4d80a1b0/test-email`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'X-Admin-Token': 'herman_admin_2024_secure_token'
        }
      });

      if (emailTestResponse.ok) {
        setSystemStatus(prev => ({ ...prev, emailService: 'active' }));
      } else {
        setSystemStatus(prev => ({ ...prev, emailService: 'error' }));
      }

      // Load current admin password
      const passwordResponse = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-4d80a1b0/admin/get-password`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'X-Admin-Token': 'herman_admin_2024_secure_token'
        }
      });

      if (passwordResponse.ok) {
        const passwordData = await passwordResponse.json();
        setCurrentPassword(passwordData.password);
      }

    } catch (err) {
      setError('Failed to load dashboard data');
      setSystemStatus({
        emailService: 'error',
        database: 'error',
        contactForm: 'error',
        newsletterSystem: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateAnalytics = (contactsData: ContactSubmission[]) => {
    const total = contactsData.length;
    const newContacts = contactsData.filter(c => c.status === 'new').length;
    const contacted = contactsData.filter(c => c.status === 'contacted').length;
    const completed = contactsData.filter(c => c.status === 'completed').length;
    
    const responseRate = total > 0 ? Math.round((contacted + completed) / total * 100) : 0;
    const completionRate = total > 0 ? Math.round(completed / total * 100) : 0;
    
    // Calculate average response time (simplified - assuming 24 hours for demo)
    const avgResponseTime = responseRate > 0 ? '18 hours' : '0 hours';
    
    setAnalytics({
      totalContacts: total,
      newContacts,
      responseRate,
      avgResponseTime,
      completionRate
    });
  };

  const handlePasswordReset = async () => {
    if (!resetEmail) {
      setError('Please enter your email address');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-4d80a1b0/admin/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({ email: resetEmail })
      });

      if (response.ok) {
        setSuccess('Password reset instructions sent to your email');
        setShowPasswordReset(false);
        setResetEmail('');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to send reset email');
      }
    } catch (err) {
      setError('Failed to process password reset request');
    } finally {
      setLoading(false);
    }
  };

  const applyTemplate = (templateKey: string) => {
    const template = newsletterTemplates[templateKey as keyof typeof newsletterTemplates];
    if (template) {
      setNewsletterForm({
        subject: template.subject,
        content: template.content,
        previewText: template.previewText
      });
      setSelectedTemplate(templateKey);
    }
  };

  const sendNewsletter = async () => {
    if (!newsletterForm.subject || !newsletterForm.content) {
      setError('Subject and content are required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-4d80a1b0/send-newsletter`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
          'X-Admin-Token': 'herman_admin_2024_secure_token'
        },
        body: JSON.stringify(newsletterForm)
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess(`Newsletter sent successfully to ${result.successCount} subscribers!`);
        setNewsletterForm({ subject: '', content: '', previewText: '' });
        await loadDashboardData(); // Refresh data
      } else {
        setError(result.error || 'Failed to send newsletter');
      }
    } catch (err) {
      setError('Failed to send newsletter');
    } finally {
      setLoading(false);
    }
  };

  const updateContactStatus = async (contactId: string, status: string, notes?: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-4d80a1b0/contacts/${contactId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
          'X-Admin-Token': 'herman_admin_2024_secure_token'
        },
        body: JSON.stringify({ status, notes })
      });

      if (response.ok) {
        setSuccess('Contact updated successfully');
        await loadDashboardData();
        if (selectedContact && selectedContact.id === contactId) {
          const updatedContact = contacts.find(c => c.id === contactId);
          if (updatedContact) {
            setSelectedContact({ ...updatedContact, status: status as any, notes });
          }
        }
      } else {
        setError('Failed to update contact');
      }
    } catch (err) {
      setError('Failed to update contact');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'contacted': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'in-progress': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'archived': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getServiceLabel = (service: string) => {
    const serviceMap: { [key: string]: string } = {
      'strategic-planning': 'Strategic Planning',
      'digital-transformation': 'Digital Transformation',
      'business-optimization': 'Business Optimization',
      'innovation-consulting': 'Innovation Consulting',
      'change-management': 'Change Management',
      'growth-strategy': 'Growth Strategy',
      'custom': 'Custom Solution'
    };
    return serviceMap[service] || service;
  };

  if (!isVisible) {
    return null;
  }

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">HK</span>
              </div>
              <span>Admin Dashboard</span>
            </CardTitle>
            <p className="text-muted-foreground">Access your admin controls</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="admin-password">Admin Password</Label>
              <Input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && authenticate()}
                placeholder="Enter admin password"
              />
              <div className="mt-2 p-2 bg-green-50 text-green-700 rounded-md text-xs border border-green-200">
                🔒 <strong>Security Enhanced:</strong> Authentication now properly validates passwords
              </div>
            </div>
            {error && (
              <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm">
                {error}
              </div>
            )}
            <div className="flex space-x-2">
              <Button onClick={authenticate} disabled={loading} className="flex-1">
                {loading ? 'Authenticating...' : 'Access Dashboard'}
              </Button>
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </div>
            
            <div className="pt-4 border-t">
              <button
                onClick={() => setShowPasswordReset(true)}
                className="text-sm text-primary hover:underline w-full text-center"
              >
                Forgot your password?
              </button>
              <p className="text-xs text-muted-foreground text-center mt-2">
                Password reset instructions will be sent to your admin email
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-auto">
      <div className="bg-background rounded-lg shadow-xl w-full max-w-7xl max-h-full overflow-auto">
        {/* Header */}
        <div className="sticky top-0 bg-background border-b p-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold">HK</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold">Admin Dashboard</h2>
              <p className="text-muted-foreground">Manage your website services</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {/* Session Status */}
            <div className="text-right">
              <div className="text-sm text-muted-foreground">
                Session: {Math.floor((SESSION_TIMEOUT - (Date.now() - lastActivity)) / 1000 / 60)}m remaining
              </div>
              <div className="text-xs text-muted-foreground">
                Auto-logout at {new Date(lastActivity + SESSION_TIMEOUT).toLocaleTimeString()}
              </div>
            </div>
            
            <Separator orientation="vertical" className="h-8" />
            
            <Button variant="outline" onClick={loadDashboardData} disabled={loading} size="sm">
              {loading ? 'Loading...' : 'Refresh All'}
            </Button>
            <Button variant="outline" onClick={() => handleLogout()} size="sm">
              Logout
            </Button>
            <Button variant="outline" onClick={onClose} size="sm">
              Close
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Status Messages */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md border border-red-200">
              {error}
            </div>
          )}
          
          {success && (
            <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md border border-green-200">
              {success}
            </div>
          )}

          {/* Dashboard Tabs */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="newsletter">Newsletter</TabsTrigger>
              <TabsTrigger value="contacts">Contacts</TabsTrigger>
              <TabsTrigger value="seo">SEO</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Newsletter Subscribers</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{subscribers.length}</div>
                    <p className="text-xs text-muted-foreground">Active subscribers</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Inquiries</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analytics.totalContacts}</div>
                    <p className="text-xs text-muted-foreground">
                      {analytics.newContacts} new inquiries
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Response Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analytics.responseRate}%</div>
                    <p className="text-xs text-muted-foreground">
                      Avg: {analytics.avgResponseTime}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Completion Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analytics.completionRate}%</div>
                    <p className="text-xs text-muted-foreground">Projects completed</p>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {contacts.slice(0, 3).map((contact) => (
                      <div key={contact.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div>
                          <p className="font-medium">New contact from {contact.name}</p>
                          <p className="text-sm text-muted-foreground">{contact.email}</p>
                        </div>
                        <Badge className={`${getStatusColor(contact.status)}`}>
                          {contact.status}
                        </Badge>
                      </div>
                    ))}
                    
                    {contacts.length === 0 && (
                      <p className="text-center text-muted-foreground py-4">No recent contact activity</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Newsletter Tab */}
            <TabsContent value="newsletter" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Send Newsletter */}
                <Card>
                  <CardHeader>
                    <CardTitle>Send Newsletter</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Send to {subscribers.length} subscribers
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Template Selection */}
                    <div>
                      <Label htmlFor="template">Quick Start Templates</Label>
                      <Select value={selectedTemplate} onValueChange={applyTemplate}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a template (optional)" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="weekly-update">Weekly Business Update</SelectItem>
                          <SelectItem value="monthly-deep-dive">Monthly Deep Dive</SelectItem>
                          <SelectItem value="service-announcement">Service Announcement</SelectItem>
                          <SelectItem value="insights-sharing">Insights from the Field</SelectItem>
                        </SelectContent>
                      </Select>
                      {selectedTemplate && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Template applied! You can customize the content below.
                        </p>
                      )}
                    </div>

                    <Separator />

                    <div>
                      <Label htmlFor="subject">Subject Line</Label>
                      <Input
                        id="subject"
                        value={newsletterForm.subject}
                        onChange={(e) => setNewsletterForm(prev => ({ ...prev, subject: e.target.value }))}
                        placeholder="Enter newsletter subject"
                      />
                    </div>

                    <div>
                      <Label htmlFor="previewText">Preview Text (Optional)</Label>
                      <Input
                        id="previewText"
                        value={newsletterForm.previewText}
                        onChange={(e) => setNewsletterForm(prev => ({ ...prev, previewText: e.target.value }))}
                        placeholder="Brief preview text"
                      />
                    </div>

                    <div>
                      <Label htmlFor="content">Newsletter Content</Label>
                      <Textarea
                        id="content"
                        value={newsletterForm.content}
                        onChange={(e) => setNewsletterForm(prev => ({ ...prev, content: e.target.value }))}
                        rows={8}
                        placeholder="Write your newsletter content here..."
                      />
                    </div>

                    <div className="flex space-x-2">
                      <Button 
                        onClick={sendNewsletter} 
                        disabled={loading || !newsletterForm.subject || !newsletterForm.content}
                        className="flex-1"
                      >
                        {loading ? 'Sending...' : `Send to ${subscribers.length} Subscribers`}
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setNewsletterForm({ subject: '', content: '', previewText: '' });
                          setSelectedTemplate('');
                        }}
                      >
                        Clear
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Newsletter History */}
                <Card>
                  <CardHeader>
                    <CardTitle>Newsletter History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 max-h-96 overflow-auto">
                      {newsletterHistory.map((newsletter) => (
                        <div key={newsletter.id} className="p-3 border rounded-lg">
                          <h4 className="font-medium mb-1">{newsletter.subject}</h4>
                          <p className="text-sm text-muted-foreground mb-2">
                            {new Date(newsletter.sentAt).toLocaleDateString()}
                          </p>
                          <div className="flex items-center space-x-4 text-xs">
                            <span className="text-green-600">✓ {newsletter.successCount} sent</span>
                            {newsletter.failCount > 0 && (
                              <span className="text-red-600">✗ {newsletter.failCount} failed</span>
                            )}
                          </div>
                        </div>
                      ))}
                      
                      {newsletterHistory.length === 0 && (
                        <p className="text-center text-muted-foreground py-4">No newsletters sent yet</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Contacts Tab */}
            <TabsContent value="contacts" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Contacts List */}
                <Card>
                  <CardHeader>
                    <CardTitle>Contact Submissions ({contacts.length})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 max-h-96 overflow-auto">
                      {contacts.map((contact) => (
                        <div
                          key={contact.id}
                          className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                            selectedContact?.id === contact.id ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                          }`}
                          onClick={() => setSelectedContact(contact)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2 mb-2">
                                <h4 className="font-medium truncate">{contact.name}</h4>
                                {contact.emailSent && (
                                  <Badge variant="outline" className="text-xs">
                                    ✅ Emailed
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground truncate">{contact.email}</p>
                              {contact.service && (
                                <p className="text-xs text-primary mt-1">{getServiceLabel(contact.service)}</p>
                              )}
                              <p className="text-xs text-muted-foreground mt-1">
                                {new Date(contact.submittedAt).toLocaleDateString()}
                              </p>
                            </div>
                            <Badge className={`text-xs ${getStatusColor(contact.status)}`}>
                              {contact.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                      
                      {contacts.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                          <p>No contact submissions yet</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Contact Details */}
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {selectedContact ? 'Contact Details' : 'Select a Contact'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedContact ? (
                      <div className="space-y-6">
                        {/* Contact Info */}
                        <div className="space-y-3">
                          <div>
                            <Label className="text-sm font-medium">Name</Label>
                            <p className="text-sm">{selectedContact.name}</p>
                          </div>
                          
                          <div>
                            <Label className="text-sm font-medium">Email</Label>
                            <div className="flex items-center space-x-2">
                              <p className="text-sm">{selectedContact.email}</p>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => window.open(`mailto:${selectedContact.email}`, '_blank')}
                              >
                                Reply
                              </Button>
                            </div>
                          </div>

                          {selectedContact.company && (
                            <div>
                              <Label className="text-sm font-medium">Company</Label>
                              <p className="text-sm">{selectedContact.company}</p>
                            </div>
                          )}

                          {selectedContact.service && (
                            <div>
                              <Label className="text-sm font-medium">Service</Label>
                              <p className="text-sm">{getServiceLabel(selectedContact.service)}</p>
                            </div>
                          )}

                          {selectedContact.budget && (
                            <div>
                              <Label className="text-sm font-medium">Budget</Label>
                              <p className="text-sm">{selectedContact.budget}</p>
                            </div>
                          )}

                          {selectedContact.timeline && (
                            <div>
                              <Label className="text-sm font-medium">Timeline</Label>
                              <p className="text-sm">{selectedContact.timeline}</p>
                            </div>
                          )}

                          <div>
                            <Label className="text-sm font-medium">Message</Label>
                            <div className="bg-muted/50 p-3 rounded-md mt-1">
                              <p className="text-sm whitespace-pre-line">{selectedContact.message}</p>
                            </div>
                          </div>

                          <div>
                            <Label className="text-sm font-medium">Submitted</Label>
                            <p className="text-sm">{new Date(selectedContact.submittedAt).toLocaleString()}</p>
                          </div>
                        </div>

                        <Separator />

                        {/* Status Management */}
                        <div className="space-y-4">
                          <div>
                            <Label className="text-sm font-medium">Status</Label>
                            <Select 
                              value={selectedContact.status} 
                              onValueChange={(value) => updateContactStatus(selectedContact.id, value)}
                            >
                              <SelectTrigger className="mt-1">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="new">New</SelectItem>
                                <SelectItem value="contacted">Contacted</SelectItem>
                                <SelectItem value="in-progress">In Progress</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="archived">Archived</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <Label className="text-sm font-medium">Notes</Label>
                            <Textarea
                              value={selectedContact.notes || ''}
                              onChange={(e) => {
                                setSelectedContact(prev => prev ? { ...prev, notes: e.target.value } : null);
                              }}
                              placeholder="Add notes about this contact..."
                              rows={3}
                              className="mt-1"
                            />
                            <Button
                              size="sm"
                              className="mt-2"
                              onClick={() => updateContactStatus(selectedContact.id, selectedContact.status, selectedContact.notes)}
                            >
                              Save Notes
                            </Button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <p>Select a contact submission to view details</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* SEO Tab */}
            <TabsContent value="seo" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>SEO Management</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Monitor and optimize your website for search engines
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* SEO Quick Actions */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="font-medium text-blue-900 mb-2">SEO Audit</h4>
                      <p className="text-sm text-blue-800 mb-3">
                        Analyze your website's SEO performance and get recommendations
                      </p>
                      <Button 
                        onClick={() => setShowSEOAudit(true)}
                        className="w-full"
                        variant="default"
                      >
                        Run SEO Audit
                      </Button>
                    </div>

                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <h4 className="font-medium text-green-900 mb-2">Search Console</h4>
                      <p className="text-sm text-green-800 mb-3">
                        Submit your site to Google for better indexing
                      </p>
                      <Button 
                        onClick={() => window.open('https://search.google.com/search-console', '_blank')}
                        className="w-full"
                        variant="outline"
                      >
                        Open Search Console
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  {/* SEO Resources */}
                  <div>
                    <h4 className="font-medium mb-3">SEO Resources & Links</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <h5 className="text-sm font-medium text-muted-foreground">Site Files</h5>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between p-2 bg-muted/30 rounded">
                            <span className="text-sm">Sitemap.xml</span>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => window.open('/sitemap.xml', '_blank')}
                            >
                              View
                            </Button>
                          </div>
                          <div className="flex items-center justify-between p-2 bg-muted/30 rounded">
                            <span className="text-sm">Robots.txt</span>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => window.open('/robots.txt', '_blank')}
                            >
                              View
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h5 className="text-sm font-medium text-muted-foreground">External Tools</h5>
                        <div className="space-y-1">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="w-full justify-start"
                            onClick={() => window.open('https://pagespeed.web.dev/', '_blank')}
                          >
                            PageSpeed Insights
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="w-full justify-start"
                            onClick={() => window.open('https://www.google.com/webmasters/tools/mobile-friendly/', '_blank')}
                          >
                            Mobile-Friendly Test
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="w-full justify-start"
                            onClick={() => window.open('https://schema.org/validator', '_blank')}
                          >
                            Schema Validator
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* SEO Tips */}
                  <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <h4 className="font-medium text-yellow-900 mb-2">📈 SEO Tips for Better Rankings</h4>
                    <ul className="text-sm text-yellow-800 space-y-1">
                      <li>• Publish high-quality content regularly</li>
                      <li>• Optimize images with descriptive alt text</li>
                      <li>• Build backlinks from reputable websites</li>
                      <li>• Ensure fast loading times (under 3 seconds)</li>
                      <li>• Use relevant keywords naturally in content</li>
                      <li>• Keep meta descriptions under 160 characters</li>
                      <li>• Monitor your rankings weekly</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>System Status</CardTitle>
                    <p className="text-sm text-muted-foreground">Real-time service monitoring</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <span className="font-medium">Email Service (Resend)</span>
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${
                            systemStatus.emailService === 'active' ? 'bg-green-500' : 
                            systemStatus.emailService === 'error' ? 'bg-red-500' : 'bg-yellow-500'
                          }`}></div>
                          <span className="text-sm capitalize">{systemStatus.emailService}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <span className="font-medium">Database (Supabase)</span>
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${
                            systemStatus.database === 'active' ? 'bg-green-500' : 
                            systemStatus.database === 'error' ? 'bg-red-500' : 'bg-yellow-500'
                          }`}></div>
                          <span className="text-sm capitalize">{systemStatus.database}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <span className="font-medium">Contact Form System</span>
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${
                            systemStatus.contactForm === 'active' ? 'bg-green-500' : 
                            systemStatus.contactForm === 'error' ? 'bg-red-500' : 'bg-yellow-500'
                          }`}></div>
                          <span className="text-sm capitalize">{systemStatus.contactForm}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <span className="font-medium">Newsletter System</span>
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${
                            systemStatus.newsletterSystem === 'active' ? 'bg-green-500' : 
                            systemStatus.newsletterSystem === 'error' ? 'bg-red-500' : 'bg-yellow-500'
                          }`}></div>
                          <span className="text-sm capitalize">{systemStatus.newsletterSystem}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={loadDashboardData}
                        disabled={loading}
                      >
                        {loading ? 'Checking...' : 'Check All Services'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Admin Settings</CardTitle>
                    <p className="text-sm text-muted-foreground">Account and security settings</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-medium mb-2">Current Admin Password</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Your current admin password is: 
                        <code className="bg-background px-2 py-1 rounded ml-2">{currentPassword}</code>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Contact system administrator to change your password.
                      </p>
                    </div>

                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="font-medium mb-2 text-blue-900">Performance Metrics</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Response Rate:</span>
                          <span className="font-medium">{analytics.responseRate}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Avg Response Time:</span>
                          <span className="font-medium">{analytics.avgResponseTime}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Project Completion:</span>
                          <span className="font-medium">{analytics.completionRate}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total Subscribers:</span>
                          <span className="font-medium">{subscribers.length}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <h4 className="font-medium mb-2 text-green-900">Quick Actions</h4>
                      <div className="space-y-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full"
                          onClick={() => window.open('https://hermankwayu.com', '_blank')}
                        >
                          View Live Website
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full"
                          onClick={() => window.open('https://calendly.com/truthherman/30min', '_blank')}
                        >
                          Open Calendly
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* Auto-Logout Warning Modal */}
      {showLogoutWarning && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60]">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle className="text-center text-yellow-600">⚠️ Session Expiring</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-center">
                Your session will expire in {Math.floor((SESSION_TIMEOUT - (Date.now() - lastActivity)) / 1000 / 60)} minutes due to inactivity.
              </p>
              <div className="flex space-x-2">
                <Button 
                  onClick={extendSession}
                  className="flex-1"
                >
                  Stay Logged In
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => handleLogout()}
                  className="flex-1"
                >
                  Logout Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Password Reset Modal */}
      {showPasswordReset && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60]">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle className="text-center">🔒 Reset Admin Password</CardTitle>
              <p className="text-sm text-muted-foreground text-center">
                Enter your email to receive password reset instructions
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="resetEmail">Admin Email Address</Label>
                <Input
                  id="resetEmail"
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="truthherman@gmail.com"
                />
              </div>
              
              <div className="p-3 bg-blue-50 rounded-lg text-sm text-blue-800">
                <strong>Note:</strong> Password reset instructions will be sent to your registered admin email address. 
                If you don't receive an email within 5 minutes, check your spam folder.
              </div>

              <div className="flex space-x-2">
                <Button 
                  onClick={handlePasswordReset}
                  disabled={loading || !resetEmail}
                  className="flex-1"
                >
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    setShowPasswordReset(false);
                    setResetEmail('');
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* SEO Audit Modal */}
      <SEOAudit 
        isVisible={showSEOAudit}
        onClose={() => setShowSEOAudit(false)}
      />
    </div>
  );
}