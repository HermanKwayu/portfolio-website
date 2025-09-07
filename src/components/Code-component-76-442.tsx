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

export function ContactAdmin() {
  const [isVisible, setIsVisible] = useState(false);
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [selectedContact, setSelectedContact] = useState<ContactSubmission | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Toggle visibility with keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.key === 'C') {
        setIsVisible(prev => !prev);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const authenticate = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-4d80a1b0/contacts`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'X-Admin-Token': 'herman_admin_2024_secure_token'
        }
      });

      if (response.ok) {
        setIsAuthenticated(true);
        await loadContacts();
      } else {
        setError('Invalid password');
      }
    } catch (err) {
      setError('Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const loadContacts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-4d80a1b0/contacts`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'X-Admin-Token': 'herman_admin_2024_secure_token'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setContacts(data.contacts);
      } else {
        setError('Failed to load contacts');
      }
    } catch (err) {
      setError('Failed to load contacts');
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
        await loadContacts();
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
    return (
      <div className="fixed bottom-4 left-4 z-50">
        <div className="bg-primary/10 text-primary px-3 py-1 rounded-md text-xs">
          Press Ctrl+Shift+C for Contact Admin
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Contact Admin Access</CardTitle>
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
                {loading ? 'Authenticating...' : 'Access Admin'}
              </Button>
              <Button variant="outline" onClick={() => setIsVisible(false)}>
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
        <div className="sticky top-0 bg-background border-b p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Contact Form Admin</h2>
            <p className="text-muted-foreground">Manage contact form submissions</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={loadContacts} disabled={loading}>
              {loading ? 'Loading...' : 'Refresh'}
            </Button>
            <Button variant="outline" onClick={() => setIsVisible(false)}>
              Close
            </Button>
          </div>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
              {error}
            </div>
          )}
          
          {success && (
            <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md">
              {success}
            </div>
          )}

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
        </div>
      </div>
    </div>
  );
}