import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface Newsletter {
  id: string;
  subject: string;
  content: string;
  sentAt: string;
  subscriberCount: number;
  successCount?: number;
  failCount?: number;
  status: 'sending' | 'sent';
}

interface AdminStats {
  subscriberCount: number;
  newslettersSent: number;
  contacts: number;
}

export function NewsletterAdmin() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [stats, setStats] = useState<AdminStats>({ subscriberCount: 0, newslettersSent: 0, contacts: 0 });
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [subscribers, setSubscribers] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [testingEmail, setTestingEmail] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Newsletter form state
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [previewText, setPreviewText] = useState('');

  // Password change state
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  const baseUrl = `https://${projectId}.supabase.co/functions/v1/make-server-4d80a1b0`;

  // Admin authentication
  const handleAdminLogin = async () => {
    try {
      // Check if custom password exists, otherwise use default
      const response = await fetch(`${baseUrl}/admin/get-password`, {
        headers: getAuthHeaders()
      });
      
      let correctPassword = 'HermanAdmin2024!'; // Default password
      if (response.ok) {
        const data = await response.json();
        if (data.password) {
          correctPassword = data.password;
        }
      }

      if (adminPassword === correctPassword) {
        setIsAuthenticated(true);
        setAuthError('');
        localStorage.setItem('newsletter_admin_auth', 'true');
      } else {
        setAuthError('Incorrect password. Access denied.');
      }
    } catch (error) {
      // Fallback to default password if server error
      const correctPassword = 'HermanAdmin2024!';
      if (adminPassword === correctPassword) {
        setIsAuthenticated(true);
        setAuthError('');
        localStorage.setItem('newsletter_admin_auth', 'true');
      } else {
        setAuthError('Incorrect password. Access denied.');
      }
    }
  };

  // Password change function
  const handlePasswordChange = async () => {
    setPasswordError('');
    setPasswordSuccess('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('All fields are required');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters long');
      return;
    }

    setChangingPassword(true);

    try {
      const response = await fetch(`${baseUrl}/admin/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify({
          currentPassword,
          newPassword
        })
      });

      const data = await response.json();

      if (data.success) {
        setPasswordSuccess('Password changed successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        
        // Auto-hide success message and close section after 3 seconds
        setTimeout(() => {
          setPasswordSuccess('');
          setShowPasswordChange(false);
        }, 3000);
      } else {
        setPasswordError(data.error || 'Failed to change password');
      }
    } catch (error) {
      console.error('Password change error:', error);
      setPasswordError('Failed to change password');
    } finally {
      setChangingPassword(false);
    }
  };

  // Check if already authenticated on mount
  useEffect(() => {
    const storedAuth = localStorage.getItem('newsletter_admin_auth');
    if (storedAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAdminPassword('');
    localStorage.removeItem('newsletter_admin_auth');
    setIsOpen(false);
  };

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      loadDashboardData();
    }
  }, [isOpen, isAuthenticated]);

  const getAuthHeaders = () => ({
    'Authorization': `Bearer ${publicAnonKey}`,
    'X-Admin-Token': 'herman_admin_2024_secure_token' // This matches the server token
  });

  const loadDashboardData = async () => {
    try {
      // Load subscribers
      const subsResponse = await fetch(`${baseUrl}/subscribers`, {
        headers: getAuthHeaders()
      });
      const subsData = await subsResponse.json();
      
      // Load newsletters
      const newslettersResponse = await fetch(`${baseUrl}/newsletters`, {
        headers: getAuthHeaders()
      });
      const newslettersData = await newslettersResponse.json();

      // Load contacts
      const contactsResponse = await fetch(`${baseUrl}/contacts`, {
        headers: getAuthHeaders()
      });
      const contactsData = await contactsResponse.json();

      setSubscribers(subsData.subscribers || []);
      setNewsletters(newslettersData.newsletters || []);
      setStats({
        subscriberCount: subsData.count || 0,
        newslettersSent: newslettersData.newsletters?.length || 0,
        contacts: contactsData.contacts?.length || 0
      });
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError('Failed to load dashboard data');
    }
  };

  const testEmailService = async () => {
    setTestingEmail(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`${baseUrl}/test-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        }
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('✅ Email service is working! Your Resend API key is valid.');
      } else {
        setError(`❌ Email service test failed: ${data.error}`);
      }
    } catch (err) {
      console.error('Error testing email service:', err);
      setError('Failed to test email service');
    } finally {
      setTestingEmail(false);
    }
  };

  const sendNewsletter = async () => {
    if (!subject.trim() || !content.trim()) {
      setError('Subject and content are required');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`${baseUrl}/send-newsletter`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify({ subject, content, previewText })
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(`Newsletter sent to ${data.successCount} subscribers successfully!`);
        setSubject('');
        setContent('');
        setPreviewText('');
        await loadDashboardData(); // Refresh data
      } else {
        setError(data.error || 'Failed to send newsletter');
      }
    } catch (err) {
      console.error('Error sending newsletter:', err);
      setError('Failed to send newsletter');
    } finally {
      setLoading(false);
    }
  };

  // Quick access via keyboard shortcut
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'N') {
        e.preventDefault();
        setIsOpen(!isOpen);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isOpen]);

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button 
          onClick={() => setIsOpen(true)}
          variant="outline"
          size="sm"
          className="shadow-lg"
          title="Newsletter Admin (Ctrl+Shift+N)"
        >
          📧 Admin
        </Button>
      </div>
    );
  }

  // Authentication screen
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-background rounded-lg shadow-xl max-w-md w-full p-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold">Admin Access Required</h2>
            <p className="text-muted-foreground mt-2">This area is restricted to Herman Kwayu only</p>
          </div>

          {authError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm mb-4">
              {authError}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <Label htmlFor="admin-password">Admin Password</Label>
              <Input
                id="admin-password"
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="Enter admin password"
                onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
                className="mt-1"
              />
            </div>
            
            <div className="flex space-x-2">
              <Button onClick={handleAdminLogin} className="flex-1">
                🔐 Login
              </Button>
              <Button 
                onClick={() => setIsOpen(false)} 
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>

          <div className="mt-4 text-xs text-muted-foreground text-center">
            This newsletter admin panel is protected.<br/>
            Contact Herman for access.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-background rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Newsletter Admin</h2>
            <div className="flex space-x-2">
              <Button 
                onClick={() => setShowPasswordChange(!showPasswordChange)}
                variant="outline"
                size="sm"
                title="Change admin password"
              >
                🔑 Password
              </Button>
              <Button 
                onClick={handleLogout}
                variant="outline"
                size="sm"
                title="Logout and close admin panel"
              >
                🚪 Logout
              </Button>
              <Button 
                onClick={() => setIsOpen(false)}
                variant="outline"
                size="sm"
              >
                ✕ Close
              </Button>
            </div>
          </div>

          {/* Stats Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-primary">{stats.subscriberCount}</div>
                <div className="text-sm text-muted-foreground">Newsletter Subscribers</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-green-600">{stats.newslettersSent}</div>
                <div className="text-sm text-muted-foreground">Newsletters Sent</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-blue-600">{stats.contacts}</div>
                <div className="text-sm text-muted-foreground">Contact Inquiries</div>
              </CardContent>
            </Card>
          </div>

          {/* Password Change Section */}
          {showPasswordChange && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Change Admin Password</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {passwordError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm">
                    {passwordError}
                  </div>
                )}
                {passwordSuccess && (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded text-sm">
                    {passwordSuccess}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="current-password">Current Password *</Label>
                    <Input
                      id="current-password"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password"
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="new-password">New Password *</Label>
                    <Input
                      id="new-password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="confirm-password">Confirm New Password *</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button 
                    onClick={handlePasswordChange}
                    disabled={changingPassword || !currentPassword || !newPassword || !confirmPassword}
                    className="flex-1"
                  >
                    {changingPassword ? 'Changing...' : '🔑 Change Password'}
                  </Button>
                  <Button 
                    onClick={() => {
                      setShowPasswordChange(false);
                      setCurrentPassword('');
                      setNewPassword('');
                      setConfirmPassword('');
                      setPasswordError('');
                      setPasswordSuccess('');
                    }}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>

                <div className="text-xs text-muted-foreground">
                  <strong>Password Requirements:</strong>
                  <ul className="list-disc list-inside mt-1">
                    <li>At least 8 characters long</li>
                    <li>Consider using a mix of letters, numbers, and symbols</li>
                    <li>Choose something memorable but secure</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Newsletter Creation */}
            <Card>
              <CardHeader>
                <CardTitle>Create Newsletter</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded text-sm">
                    {success}
                  </div>
                )}

                <div>
                  <Label htmlFor="subject">Subject Line *</Label>
                  <Input
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Weekly insights on digital transformation..."
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="preview">Preview Text (Optional)</Label>
                  <Input
                    id="preview"
                    value={previewText}
                    onChange={(e) => setPreviewText(e.target.value)}
                    placeholder="This appears in email clients..."
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="content">Newsletter Content *</Label>
                  <Textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write your newsletter content here..."
                    rows={10}
                    className="mt-1"
                  />
                  <div className="text-xs text-muted-foreground mt-1">
                    Use simple HTML or plain text. Line breaks will be converted automatically.
                  </div>
                </div>

                <div className="space-y-2">
                  <Button 
                    onClick={testEmailService}
                    disabled={testingEmail}
                    variant="outline"
                    className="w-full"
                  >
                    {testingEmail ? 'Testing...' : '🧪 Test Email Service'}
                  </Button>
                  
                  <Button 
                    onClick={sendNewsletter}
                    disabled={loading || !subject.trim() || !content.trim()}
                    className="w-full"
                  >
                    {loading ? 'Sending...' : `Send to ${stats.subscriberCount} Subscribers`}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Newsletter History & Subscribers */}
            <div className="space-y-6">
              {/* Recent Newsletters */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Newsletters</CardTitle>
                </CardHeader>
                <CardContent>
                  {newsletters.length === 0 ? (
                    <p className="text-muted-foreground text-sm">No newsletters sent yet</p>
                  ) : (
                    <div className="space-y-3">
                      {newsletters.slice(0, 5).map((newsletter) => (
                        <div key={newsletter.id} className="border rounded p-3">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium text-sm">{newsletter.subject}</h4>
                            <Badge variant={newsletter.status === 'sent' ? 'default' : 'secondary'}>
                              {newsletter.status}
                            </Badge>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Sent {new Date(newsletter.sentAt).toLocaleDateString()} to {newsletter.subscriberCount} subscribers
                            {newsletter.successCount !== undefined && (
                              <span> • {newsletter.successCount} delivered, {newsletter.failCount} failed</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Subscribers Preview */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Subscribers</CardTitle>
                </CardHeader>
                <CardContent>
                  {subscribers.length === 0 ? (
                    <p className="text-muted-foreground text-sm">No subscribers yet</p>
                  ) : (
                    <div className="space-y-1">
                      {subscribers.slice(-10).reverse().map((email, index) => (
                        <div key={index} className="text-sm font-mono bg-muted p-2 rounded">
                          {email}
                        </div>
                      ))}
                      {subscribers.length > 10 && (
                        <div className="text-xs text-muted-foreground text-center pt-2">
                          ... and {subscribers.length - 10} more subscribers
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Quick Newsletter Templates */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Quick Templates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSubject("Weekly Business Insights from Herman");
                    setContent(`Hi there!

Hope your week is going well! Here are some insights I wanted to share:

## This Week's Focus: Digital Transformation

Digital transformation isn't just about technology - it's about reimagining how your business creates value for customers.

Key takeaways:
• Start with customer needs, not technology
• Build processes that scale with your growth
• Invest in your team's capabilities

## Project Spotlight

This week I helped a client streamline their KYC processes, reducing processing time by 60% while improving compliance accuracy.

## What's Next?

Next week I'll be sharing insights on process automation and how to identify the right processes to automate first.

Have questions? Just reply to this email - I read every response!

Best regards,
Herman`);
                    setPreviewText("Weekly insights on digital transformation and business strategy");
                  }}
                  className="h-auto p-4 text-left"
                >
                  <div>
                    <div className="font-medium">Weekly Insights Template</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Business insights and project updates
                    </div>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  onClick={() => {
                    setSubject("New Case Study: Process Optimization Success");
                    setContent(`Hi!

I'm excited to share a recent success story that might inspire your own transformation journey.

## Case Study: Telecom Process Optimization

**The Challenge:**
A major telecom operator was struggling with manual KYC processes that took days and caused customer frustration.

**The Solution:**
• Redesigned the workflow to eliminate bottlenecks
• Implemented automated validation checks
• Created real-time status tracking for customers

**The Results:**
• 85% reduction in processing time
• 95% improvement in customer satisfaction
• 40% cost reduction in operational overhead

## Key Lessons

1. **Start with the customer experience** - Every process should add value
2. **Automate the routine** - Let humans focus on complex decisions  
3. **Measure everything** - You can't improve what you don't track

## How This Applies to You

Whether you're in telecom, fintech, or any other industry, the principles remain the same:
- Map your current processes
- Identify pain points
- Design solutions that scale

Want to discuss how these insights apply to your business? Just reply!

Herman`);
                    setPreviewText("Real case study showing 85% process improvement results");
                  }}
                  className="h-auto p-4 text-left"
                >
                  <div>
                    <div className="font-medium">Case Study Template</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Share project successes and lessons
                    </div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}