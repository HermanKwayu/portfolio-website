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
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Newsletter state
  const [subscribers, setSubscribers] = useState<string[]>([]);
  const [newsletterHistory, setNewsletterHistory] = useState<Newsletter[]>([]);
  const [newsletterForm, setNewsletterForm] = useState({
    subject: '',
    content: '',
    previewText: ''
  });
  
  // Contact state
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [selectedContact, setSelectedContact] = useState<ContactSubmission | null>(null);

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

  const authenticate = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-4d80a1b0/subscribers`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'X-Admin-Token': 'herman_admin_2024_secure_token'
        }
      });

      if (response.ok) {
        setIsAuthenticated(true);
        await loadDashboardData();
      } else {
        setError('Invalid admin password');
      }
    } catch (err) {
      setError('Authentication failed');
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
      }

    } catch (err) {
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
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
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={loadDashboardData} disabled={loading}>
              {loading ? 'Loading...' : 'Refresh All'}
            </Button>
            <Button variant="outline" onClick={onClose}>
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
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="newsletter">Newsletter</TabsTrigger>
              <TabsTrigger value="contacts">Contacts</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                    <CardTitle className="text-sm font-medium text-muted-foreground">Contact Inquiries</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{contacts.length}</div>
                    <p className="text-xs text-muted-foreground">
                      {contacts.filter(c => c.status === 'new').length} new inquiries
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Newsletters Sent</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{newsletterHistory.length}</div>
                    <p className="text-xs text-muted-foreground">Total campaigns</p>
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

                    <Button 
                      onClick={sendNewsletter} 
                      disabled={loading || !newsletterForm.subject || !newsletterForm.content}
                      className="w-full"
                    >
                      {loading ? 'Sending...' : `Send Newsletter to ${subscribers.length} Subscribers`}
                    </Button>
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

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Dashboard Settings</CardTitle>
                  <p className="text-sm text-muted-foreground">Configure your admin preferences</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-medium mb-2">Current Admin Password</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Your current admin password is: <code className="bg-background px-2 py-1 rounded">HermanAdmin2024!</code>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Contact system administrator to change your password.
                    </p>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-medium mb-2 text-blue-900">System Status</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Email Service: Active</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Database: Connected</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Contact Form: Active</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}