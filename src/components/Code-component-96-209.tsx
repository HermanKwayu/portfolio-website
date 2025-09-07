import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Switch } from "./ui/switch";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";
import { Calendar, MapPin, Clock, Users, Send, QrCode, Scan, BarChart3, Settings, Phone, MessageCircle, Mail, Camera, Gift, Heart, Briefcase, PartyPopper, GraduationCap, ArrowLeft, Download, Upload, Eye, Edit, Trash2, CheckCircle, XCircle, Clock3, UserPlus, Share2, Star } from 'lucide-react';
import QRCode from 'qrcode';

interface Guest {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'pending' | 'confirmed' | 'declined' | 'checked-in';
  checkedInAt?: string;
  plusOnes: number;
  dietaryRestrictions: string;
  category: 'regular' | 'vip' | 'speaker' | 'staff';
  qrCode?: string;
}

interface Event {
  id: string;
  title: string;
  description: string;
  type: 'wedding' | 'corporate' | 'birthday' | 'conference' | 'graduation' | 'other';
  date: string;
  time: string;
  venue: string;
  address: string;
  dresscode: string;
  maxGuests: number;
  rsvpDeadline: string;
  createdAt: string;
  guests: Guest[];
  settings: {
    allowPlusOnes: boolean;
    requireRSVP: boolean;
    enableQRScanning: boolean;
    sendReminders: boolean;
    collectDietaryInfo: boolean;
    enablePhotoSharing: boolean;
  };
}

interface EventManagerProps {
  onBack: () => void;
}

export function EventManager({ onBack }: EventManagerProps) {
  const [currentView, setCurrentView] = useState<'dashboard' | 'create' | 'manage' | 'invitations' | 'scanner' | 'analytics'>('dashboard');
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [newEvent, setNewEvent] = useState<Partial<Event>>({
    type: 'wedding',
    settings: {
      allowPlusOnes: true,
      requireRSVP: true,
      enableQRScanning: true,
      sendReminders: true,
      collectDietaryInfo: true,
      enablePhotoSharing: true,
    }
  });
  const [scannerActive, setScannerActive] = useState(false);
  const [scannedGuests, setScannedGuests] = useState<string[]>([]);

  // Sample data for demo
  useEffect(() => {
    const sampleEvents: Event[] = [
      {
        id: '1',
        title: 'Herman & Sarah\'s Wedding',
        description: 'Join us as we celebrate our love and begin our journey together.',
        type: 'wedding',
        date: '2024-06-15',
        time: '15:00',
        venue: 'Serena Hotel Dar es Salaam',
        address: 'Ohio Street, Dar es Salaam, Tanzania',
        dresscode: 'Formal/Traditional',
        maxGuests: 200,
        rsvpDeadline: '2024-05-15',
        createdAt: '2024-04-01',
        guests: [
          {
            id: '1',
            name: 'John Mwangi',
            email: 'john@example.com',
            phone: '+255712345678',
            status: 'confirmed',
            plusOnes: 1,
            dietaryRestrictions: 'Vegetarian',
            category: 'regular',
          },
          {
            id: '2',
            name: 'Grace Kimani',
            email: 'grace@example.com',
            phone: '+255723456789',
            status: 'checked-in',
            checkedInAt: '2024-06-15T14:30:00',
            plusOnes: 0,
            dietaryRestrictions: '',
            category: 'vip',
          },
          {
            id: '3',
            name: 'Peter Njoroge',
            email: 'peter@example.com',
            phone: '+255734567890',
            status: 'pending',
            plusOnes: 2,
            dietaryRestrictions: 'None',
            category: 'regular',
          }
        ],
        settings: {
          allowPlusOnes: true,
          requireRSVP: true,
          enableQRScanning: true,
          sendReminders: true,
          collectDietaryInfo: true,
          enablePhotoSharing: true,
        }
      }
    ];
    setEvents(sampleEvents);
  }, []);

  const generateQRCode = async (guestId: string, eventId: string) => {
    try {
      const qrData = JSON.stringify({ guestId, eventId, timestamp: Date.now() });
      const qrCodeUrl = await QRCode.toDataURL(qrData);
      return qrCodeUrl;
    } catch (error) {
      console.error('Error generating QR code:', error);
      return '';
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'wedding': return <Heart className="w-5 h-5" />;
      case 'corporate': return <Briefcase className="w-5 h-5" />;
      case 'birthday': return <PartyPopper className="w-5 h-5" />;
      case 'graduation': return <GraduationCap className="w-5 h-5" />;
      default: return <Calendar className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'declined': return 'bg-red-100 text-red-800';
      case 'checked-in': return 'bg-blue-100 text-blue-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="w-4 h-4" />;
      case 'declined': return <XCircle className="w-4 h-4" />;
      case 'checked-in': return <QrCode className="w-4 h-4" />;
      default: return <Clock3 className="w-4 h-4" />;
    }
  };

  const handleCreateEvent = () => {
    const event: Event = {
      id: Date.now().toString(),
      title: newEvent.title || '',
      description: newEvent.description || '',
      type: newEvent.type || 'other',
      date: newEvent.date || '',
      time: newEvent.time || '',
      venue: newEvent.venue || '',
      address: newEvent.address || '',
      dresscode: newEvent.dresscode || '',
      maxGuests: newEvent.maxGuests || 100,
      rsvpDeadline: newEvent.rsvpDeadline || '',
      createdAt: new Date().toISOString(),
      guests: [],
      settings: newEvent.settings || {
        allowPlusOnes: true,
        requireRSVP: true,
        enableQRScanning: true,
        sendReminders: true,
        collectDietaryInfo: true,
        enablePhotoSharing: true,
      }
    };

    setEvents(prev => [...prev, event]);
    setNewEvent({ type: 'wedding', settings: event.settings });
    setCurrentView('dashboard');
  };

  const simulateQRScan = (guestId: string) => {
    if (selectedEvent) {
      const updatedEvent = {
        ...selectedEvent,
        guests: selectedEvent.guests.map(guest =>
          guest.id === guestId
            ? { ...guest, status: 'checked-in' as const, checkedInAt: new Date().toISOString() }
            : guest
        )
      };
      setSelectedEvent(updatedEvent);
      setEvents(prev => prev.map(event => event.id === selectedEvent.id ? updatedEvent : event));
      setScannedGuests(prev => [...prev, guestId]);
    }
  };

  const sendInvitations = (channels: string[]) => {
    // Simulation of sending invitations
    console.log(`Sending invitations via: ${channels.join(', ')}`);
    alert(`✅ Invitations sent successfully via ${channels.join(', ')}!\n\nSent to ${selectedEvent?.guests.length} guests with personalized QR codes.`);
  };

  const EventTemplates = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[
        { type: 'wedding', title: 'Wedding Ceremony', icon: <Heart className="w-8 h-8" />, color: 'bg-pink-50 border-pink-200' },
        { type: 'corporate', title: 'Corporate Event', icon: <Briefcase className="w-8 h-8" />, color: 'bg-blue-50 border-blue-200' },
        { type: 'birthday', title: 'Birthday Party', icon: <PartyPopper className="w-8 h-8" />, color: 'bg-purple-50 border-purple-200' },
        { type: 'conference', title: 'Conference', icon: <Users className="w-8 h-8" />, color: 'bg-green-50 border-green-200' },
        { type: 'graduation', title: 'Graduation', icon: <GraduationCap className="w-8 h-8" />, color: 'bg-yellow-50 border-yellow-200' },
        { type: 'other', title: 'Custom Event', icon: <Calendar className="w-8 h-8" />, color: 'bg-gray-50 border-gray-200' }
      ].map((template) => (
        <Card key={template.type} className={`cursor-pointer hover:shadow-lg transition-all ${template.color} ${newEvent.type === template.type ? 'ring-2 ring-primary' : ''}`}
              onClick={() => setNewEvent(prev => ({ ...prev, type: template.type as any }))}>
          <CardHeader className="text-center">
            <div className="mx-auto mb-2 text-primary">
              {template.icon}
            </div>
            <CardTitle className="text-lg">{template.title}</CardTitle>
          </CardHeader>
        </Card>
      ))}
    </div>
  );

  if (currentView === 'dashboard') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <Button variant="ghost" onClick={onBack} className="mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Website
              </Button>
              <h1 className="text-3xl font-bold text-gray-900">Event Management Hub</h1>
              <p className="text-gray-600">Create, manage, and track your events with ease</p>
            </div>
            <Button onClick={() => setCurrentView('create')} className="bg-primary hover:bg-primary/90">
              <Calendar className="w-4 h-4 mr-2" />
              Create New Event
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Total Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{events.length}</div>
                <p className="text-xs text-muted-foreground">Active events</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Total Guests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {events.reduce((total, event) => total + event.guests.length, 0)}
                </div>
                <p className="text-xs text-muted-foreground">Across all events</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Confirmed RSVPs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {events.reduce((total, event) => 
                    total + event.guests.filter(guest => guest.status === 'confirmed').length, 0
                  )}
                </div>
                <p className="text-xs text-muted-foreground">Attending</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Check-ins Today</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {events.reduce((total, event) => 
                    total + event.guests.filter(guest => guest.status === 'checked-in').length, 0
                  )}
                </div>
                <p className="text-xs text-muted-foreground">Guests arrived</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Your Events</CardTitle>
                <CardDescription>Manage your upcoming events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {events.map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center space-x-4">
                        <div className="text-primary">
                          {getEventIcon(event.type)}
                        </div>
                        <div>
                          <h3 className="font-medium">{event.title}</h3>
                          <p className="text-sm text-gray-500">
                            {new Date(event.date).toLocaleDateString()} at {event.time}
                          </p>
                          <p className="text-sm text-gray-500">{event.venue}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{event.guests.length} guests</Badge>
                        <Button variant="ghost" size="sm" onClick={() => {
                          setSelectedEvent(event);
                          setCurrentView('manage');
                        }}>
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {events.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No events created yet</p>
                      <p className="text-sm">Create your first event to get started</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common tasks and features</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" className="h-20 flex-col" onClick={() => setCurrentView('create')}>
                    <Calendar className="w-6 h-6 mb-2" />
                    Create Event
                  </Button>
                  <Button variant="outline" className="h-20 flex-col" onClick={() => setCurrentView('scanner')} disabled={!events.length}>
                    <QrCode className="w-6 h-6 mb-2" />
                    QR Scanner
                  </Button>
                  <Button variant="outline" className="h-20 flex-col" onClick={() => setCurrentView('analytics')} disabled={!events.length}>
                    <BarChart3 className="w-6 h-6 mb-2" />
                    Analytics
                  </Button>
                  <Button variant="outline" className="h-20 flex-col" onClick={() => setCurrentView('invitations')} disabled={!events.length}>
                    <Send className="w-6 h-6 mb-2" />
                    Send Invites
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (currentView === 'create') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-8">
            <Button variant="ghost" onClick={() => setCurrentView('dashboard')} className="mr-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Create New Event</h1>
              <p className="text-gray-600">Set up your event details and preferences</p>
            </div>
          </div>

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Choose Event Type</CardTitle>
                <CardDescription>Select the type of event you're organizing</CardDescription>
              </CardHeader>
              <CardContent>
                <EventTemplates />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Event Details</CardTitle>
                <CardDescription>Provide information about your event</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title">Event Title</Label>
                      <Input
                        id="title"
                        value={newEvent.title || ''}
                        onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Enter event title"
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={newEvent.description || ''}
                        onChange={(e) => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Describe your event"
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="venue">Venue</Label>
                      <Input
                        id="venue"
                        value={newEvent.venue || ''}
                        onChange={(e) => setNewEvent(prev => ({ ...prev, venue: e.target.value }))}
                        placeholder="Event venue"
                      />
                    </div>
                    <div>
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        value={newEvent.address || ''}
                        onChange={(e) => setNewEvent(prev => ({ ...prev, address: e.target.value }))}
                        placeholder="Full address"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="date">Event Date</Label>
                      <Input
                        id="date"
                        type="date"
                        value={newEvent.date || ''}
                        onChange={(e) => setNewEvent(prev => ({ ...prev, date: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="time">Event Time</Label>
                      <Input
                        id="time"
                        type="time"
                        value={newEvent.time || ''}
                        onChange={(e) => setNewEvent(prev => ({ ...prev, time: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="dresscode">Dress Code</Label>
                      <Input
                        id="dresscode"
                        value={newEvent.dresscode || ''}
                        onChange={(e) => setNewEvent(prev => ({ ...prev, dresscode: e.target.value }))}
                        placeholder="e.g., Formal, Casual, Traditional"
                      />
                    </div>
                    <div>
                      <Label htmlFor="maxGuests">Maximum Guests</Label>
                      <Input
                        id="maxGuests"
                        type="number"
                        value={newEvent.maxGuests || ''}
                        onChange={(e) => setNewEvent(prev => ({ ...prev, maxGuests: parseInt(e.target.value) }))}
                        placeholder="Expected number of guests"
                      />
                    </div>
                    <div>
                      <Label htmlFor="rsvpDeadline">RSVP Deadline</Label>
                      <Input
                        id="rsvpDeadline"
                        type="date"
                        value={newEvent.rsvpDeadline || ''}
                        onChange={(e) => setNewEvent(prev => ({ ...prev, rsvpDeadline: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Event Settings</CardTitle>
                <CardDescription>Configure features for your event</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Allow Plus Ones</Label>
                        <p className="text-sm text-gray-500">Let guests bring additional people</p>
                      </div>
                      <Switch
                        checked={newEvent.settings?.allowPlusOnes}
                        onCheckedChange={(checked) => 
                          setNewEvent(prev => ({
                            ...prev,
                            settings: { ...prev.settings!, allowPlusOnes: checked }
                          }))
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Require RSVP</Label>
                        <p className="text-sm text-gray-500">Guests must confirm attendance</p>
                      </div>
                      <Switch
                        checked={newEvent.settings?.requireRSVP}
                        onCheckedChange={(checked) => 
                          setNewEvent(prev => ({
                            ...prev,
                            settings: { ...prev.settings!, requireRSVP: checked }
                          }))
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Enable QR Scanning</Label>
                        <p className="text-sm text-gray-500">Use QR codes for entry management</p>
                      </div>
                      <Switch
                        checked={newEvent.settings?.enableQRScanning}
                        onCheckedChange={(checked) => 
                          setNewEvent(prev => ({
                            ...prev,
                            settings: { ...prev.settings!, enableQRScanning: checked }
                          }))
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Send Reminders</Label>
                        <p className="text-sm text-gray-500">Automatic reminder notifications</p>
                      </div>
                      <Switch
                        checked={newEvent.settings?.sendReminders}
                        onCheckedChange={(checked) => 
                          setNewEvent(prev => ({
                            ...prev,
                            settings: { ...prev.settings!, sendReminders: checked }
                          }))
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Collect Dietary Info</Label>
                        <p className="text-sm text-gray-500">Ask about dietary restrictions</p>
                      </div>
                      <Switch
                        checked={newEvent.settings?.collectDietaryInfo}
                        onCheckedChange={(checked) => 
                          setNewEvent(prev => ({
                            ...prev,
                            settings: { ...prev.settings!, collectDietaryInfo: checked }
                          }))
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Enable Photo Sharing</Label>
                        <p className="text-sm text-gray-500">Let guests share event photos</p>
                      </div>
                      <Switch
                        checked={newEvent.settings?.enablePhotoSharing}
                        onCheckedChange={(checked) => 
                          setNewEvent(prev => ({
                            ...prev,
                            settings: { ...prev.settings!, enablePhotoSharing: checked }
                          }))
                        }
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end space-x-4">
              <Button variant="outline" onClick={() => setCurrentView('dashboard')}>
                Cancel
              </Button>
              <Button onClick={handleCreateEvent} disabled={!newEvent.title || !newEvent.date}>
                Create Event
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentView === 'manage' && selectedEvent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <Button variant="ghost" onClick={() => setCurrentView('dashboard')} className="mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <h1 className="text-3xl font-bold text-gray-900">{selectedEvent.title}</h1>
              <p className="text-gray-600">
                {new Date(selectedEvent.date).toLocaleDateString()} at {selectedEvent.time} • {selectedEvent.venue}
              </p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => setCurrentView('invitations')}>
                <Send className="w-4 h-4 mr-2" />
                Send Invites
              </Button>
              <Button variant="outline" onClick={() => setCurrentView('scanner')}>
                <Scan className="w-4 h-4 mr-2" />
                QR Scanner
              </Button>
            </div>
          </div>

          <Tabs defaultValue="guests" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="guests">Guest List</TabsTrigger>
              <TabsTrigger value="details">Event Details</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="guests" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Total Invited</p>
                        <p className="text-2xl font-bold">{selectedEvent.guests.length}</p>
                      </div>
                      <Users className="w-8 h-8 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Confirmed</p>
                        <p className="text-2xl font-bold text-green-600">
                          {selectedEvent.guests.filter(g => g.status === 'confirmed').length}
                        </p>
                      </div>
                      <CheckCircle className="w-8 h-8 text-green-500" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Checked In</p>
                        <p className="text-2xl font-bold text-blue-600">
                          {selectedEvent.guests.filter(g => g.status === 'checked-in').length}
                        </p>
                      </div>
                      <QrCode className="w-8 h-8 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Pending</p>
                        <p className="text-2xl font-bold text-yellow-600">
                          {selectedEvent.guests.filter(g => g.status === 'pending').length}
                        </p>
                      </div>
                      <Clock3 className="w-8 h-8 text-yellow-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Guest Management</CardTitle>
                    <Button>
                      <UserPlus className="w-4 h-4 mr-2" />
                      Add Guest
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {selectedEvent.guests.map((guest) => (
                      <div key={guest.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                            {guest.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h3 className="font-medium">{guest.name}</h3>
                            <p className="text-sm text-gray-500">{guest.email}</p>
                            <p className="text-sm text-gray-500">{guest.phone}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <Badge className={getStatusColor(guest.status)}>
                            {getStatusIcon(guest.status)}
                            <span className="ml-1 capitalize">{guest.status}</span>
                          </Badge>
                          <Badge variant="outline">
                            {guest.category === 'vip' ? <Star className="w-3 h-3 mr-1" /> : null}
                            {guest.category.toUpperCase()}
                          </Badge>
                          {guest.plusOnes > 0 && (
                            <Badge variant="secondary">+{guest.plusOnes}</Badge>
                          )}
                          <div className="flex space-x-1">
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Share2 className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => simulateQRScan(guest.id)}>
                              <QrCode className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="details">
              <Card>
                <CardHeader>
                  <CardTitle>Event Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-5 h-5 text-gray-500" />
                        <div>
                          <p className="font-medium">Date & Time</p>
                          <p className="text-gray-600">
                            {new Date(selectedEvent.date).toLocaleDateString()} at {selectedEvent.time}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-5 h-5 text-gray-500" />
                        <div>
                          <p className="font-medium">Venue</p>
                          <p className="text-gray-600">{selectedEvent.venue}</p>
                          <p className="text-sm text-gray-500">{selectedEvent.address}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="w-5 h-5 text-gray-500" />
                        <div>
                          <p className="font-medium">Capacity</p>
                          <p className="text-gray-600">{selectedEvent.maxGuests} guests maximum</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <p className="font-medium">Description</p>
                        <p className="text-gray-600">{selectedEvent.description}</p>
                      </div>
                      <div>
                        <p className="font-medium">Dress Code</p>
                        <p className="text-gray-600">{selectedEvent.dresscode}</p>
                      </div>
                      <div>
                        <p className="font-medium">RSVP Deadline</p>
                        <p className="text-gray-600">
                          {new Date(selectedEvent.rsvpDeadline).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>RSVP Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {['confirmed', 'pending', 'declined', 'checked-in'].map((status) => {
                        const count = selectedEvent.guests.filter(g => g.status === status).length;
                        const percentage = (count / selectedEvent.guests.length) * 100 || 0;
                        return (
                          <div key={status}>
                            <div className="flex justify-between text-sm">
                              <span className="capitalize">{status}</span>
                              <span>{count} ({Math.round(percentage)}%)</span>
                            </div>
                            <Progress value={percentage} className="h-2" />
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Guest Categories</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {['regular', 'vip', 'speaker', 'staff'].map((category) => {
                        const count = selectedEvent.guests.filter(g => g.category === category).length;
                        const percentage = (count / selectedEvent.guests.length) * 100 || 0;
                        return (
                          <div key={category}>
                            <div className="flex justify-between text-sm">
                              <span className="capitalize">{category}</span>
                              <span>{count} ({Math.round(percentage)}%)</span>
                            </div>
                            <Progress value={percentage} className="h-2" />
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Event Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      {Object.entries(selectedEvent.settings).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between">
                          <div>
                            <Label className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</Label>
                            <p className="text-sm text-gray-500">
                              {key === 'allowPlusOnes' && 'Let guests bring additional people'}
                              {key === 'requireRSVP' && 'Guests must confirm attendance'}
                              {key === 'enableQRScanning' && 'Use QR codes for entry management'}
                              {key === 'sendReminders' && 'Automatic reminder notifications'}
                              {key === 'collectDietaryInfo' && 'Ask about dietary restrictions'}
                              {key === 'enablePhotoSharing' && 'Let guests share event photos'}
                            </p>
                          </div>
                          <Switch checked={value} disabled />
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    );
  }

  if (currentView === 'invitations') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-8">
            <Button variant="ghost" onClick={() => setCurrentView('dashboard')} className="mr-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Send Invitations</h1>
              <p className="text-gray-600">Choose how to reach your guests</p>
            </div>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Delivery Channels</CardTitle>
                <CardDescription>Select how you want to send invitations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="cursor-pointer hover:bg-green-50 border-green-200">
                    <CardContent className="p-6 text-center">
                      <MessageCircle className="w-12 h-12 mx-auto mb-4 text-green-600" />
                      <h3 className="font-medium mb-2">WhatsApp</h3>
                      <p className="text-sm text-gray-500">Personal messages with QR codes</p>
                      <Button 
                        className="mt-4 w-full bg-green-600 hover:bg-green-700"
                        onClick={() => sendInvitations(['WhatsApp'])}
                      >
                        Send via WhatsApp
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="cursor-pointer hover:bg-blue-50 border-blue-200">
                    <CardContent className="p-6 text-center">
                      <Phone className="w-12 h-12 mx-auto mb-4 text-blue-600" />
                      <h3 className="font-medium mb-2">SMS</h3>
                      <p className="text-sm text-gray-500">Text messages with event details</p>
                      <Button 
                        className="mt-4 w-full bg-blue-600 hover:bg-blue-700"
                        onClick={() => sendInvitations(['SMS'])}
                      >
                        Send via SMS
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="cursor-pointer hover:bg-purple-50 border-purple-200">
                    <CardContent className="p-6 text-center">
                      <Mail className="w-12 h-12 mx-auto mb-4 text-purple-600" />
                      <h3 className="font-medium mb-2">Email</h3>
                      <p className="text-sm text-gray-500">Formal invitations with attachments</p>
                      <Button 
                        className="mt-4 w-full bg-purple-600 hover:bg-purple-700"
                        onClick={() => sendInvitations(['Email'])}
                      >
                        Send via Email
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                <div className="mt-6">
                  <Button 
                    className="w-full"
                    onClick={() => sendInvitations(['WhatsApp', 'SMS', 'Email'])}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Send via All Channels
                  </Button>
                </div>
              </CardContent>
            </Card>

            {selectedEvent && (
              <Card>
                <CardHeader>
                  <CardTitle>Preview Invitation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-6">
                    <div className="text-center">
                      <div className="mb-4">
                        {getEventIcon(selectedEvent.type)}
                      </div>
                      <h2 className="text-2xl font-bold mb-2">{selectedEvent.title}</h2>
                      <p className="text-gray-600 mb-4">{selectedEvent.description}</p>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-center space-x-2">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(selectedEvent.date).toLocaleDateString()} at {selectedEvent.time}</span>
                        </div>
                        <div className="flex items-center justify-center space-x-2">
                          <MapPin className="w-4 h-4" />
                          <span>{selectedEvent.venue}</span>
                        </div>
                      </div>

                      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600 mb-2">Your personal QR code for entry:</p>
                        <div className="w-24 h-24 bg-white border border-gray-300 rounded-lg mx-auto flex items-center justify-center">
                          <QrCode className="w-12 h-12 text-gray-400" />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (currentView === 'scanner') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-8">
            <Button variant="ghost" onClick={() => setCurrentView('dashboard')} className="mr-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">QR Code Scanner</h1>
              <p className="text-gray-600">Scan guest QR codes for entry management</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Scanner Interface</CardTitle>
                <CardDescription>Point your camera at guest QR codes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-square bg-gray-900 rounded-lg flex items-center justify-center mb-4">
                  <div className="text-center text-white">
                    <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="mb-4">QR Code Scanner</p>
                    <p className="text-sm opacity-75">Camera feed would appear here</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <Button 
                    className="w-full" 
                    onClick={() => setScannerActive(!scannerActive)}
                    variant={scannerActive ? "destructive" : "default"}
                  >
                    {scannerActive ? "Stop Scanner" : "Start Scanner"}
                  </Button>

                  {selectedEvent && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Quick Scan Simulation:</p>
                      {selectedEvent.guests.filter(g => g.status !== 'checked-in').map((guest) => (
                        <Button
                          key={guest.id}
                          variant="outline"
                          size="sm"
                          className="w-full justify-start"
                          onClick={() => simulateQRScan(guest.id)}
                        >
                          <QrCode className="w-4 h-4 mr-2" />
                          Scan {guest.name}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Check-ins</CardTitle>
                <CardDescription>Guests who have been scanned in</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {selectedEvent?.guests
                    .filter(guest => guest.status === 'checked-in')
                    .sort((a, b) => new Date(b.checkedInAt || '').getTime() - new Date(a.checkedInAt || '').getTime())
                    .map((guest) => (
                      <div key={guest.id} className="flex items-center space-x-4 p-3 bg-green-50 rounded-lg border border-green-200">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">{guest.name}</h3>
                          <p className="text-sm text-gray-500">
                            Checked in at {guest.checkedInAt ? new Date(guest.checkedInAt).toLocaleTimeString() : 'Unknown'}
                          </p>
                        </div>
                        <Badge variant="outline" className="bg-green-100 text-green-800">
                          {guest.category.toUpperCase()}
                        </Badge>
                      </div>
                    ))}

                  {(!selectedEvent || selectedEvent.guests.filter(g => g.status === 'checked-in').length === 0) && (
                    <div className="text-center py-8 text-gray-500">
                      <QrCode className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No check-ins yet</p>
                      <p className="text-sm">Scanned guests will appear here</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {scannedGuests.length > 0 && (
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Scan Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{scannedGuests.length}</p>
                    <p className="text-sm text-gray-500">Guests Scanned</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">
                      {selectedEvent ? Math.round((scannedGuests.length / selectedEvent.guests.length) * 100) : 0}%
                    </p>
                    <p className="text-sm text-gray-500">Check-in Rate</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">
                      {selectedEvent ? selectedEvent.guests.length - scannedGuests.length : 0}
                    </p>
                    <p className="text-sm text-gray-500">Pending</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    );
  }

  if (currentView === 'analytics') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center mb-8">
            <Button variant="ghost" onClick={() => setCurrentView('dashboard')} className="mr-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Event Analytics</h1>
              <p className="text-gray-600">Insights and performance metrics</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Events</p>
                    <p className="text-2xl font-bold">{events.length}</p>
                  </div>
                  <Calendar className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Invitations</p>
                    <p className="text-2xl font-bold">
                      {events.reduce((total, event) => total + event.guests.length, 0)}
                    </p>
                  </div>
                  <Send className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Response Rate</p>
                    <p className="text-2xl font-bold">85%</p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Check-in Rate</p>
                    <p className="text-2xl font-bold">92%</p>
                  </div>
                  <QrCode className="w-8 h-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Event Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {events.map((event) => {
                    const confirmed = event.guests.filter(g => g.status === 'confirmed').length;
                    const checkedIn = event.guests.filter(g => g.status === 'checked-in').length;
                    const total = event.guests.length;
                    
                    return (
                      <div key={event.id} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <h3 className="font-medium">{event.title}</h3>
                          <span className="text-sm text-gray-500">{total} invited</span>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>Confirmed: {confirmed}</span>
                            <span>{Math.round((confirmed / total) * 100)}%</span>
                          </div>
                          <Progress value={(confirmed / total) * 100} className="h-2" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>Checked In: {checkedIn}</span>
                            <span>{Math.round((checkedIn / total) * 100)}%</span>
                          </div>
                          <Progress value={(checkedIn / total) * 100} className="h-2 bg-blue-100" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Platform Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-4">Popular Event Types</h3>
                    <div className="space-y-3">
                      {['Wedding', 'Corporate', 'Birthday', 'Conference'].map((type, index) => (
                        <div key={type} className="flex items-center justify-between">
                          <span className="text-sm">{type}</span>
                          <div className="flex items-center space-x-2">
                            <Progress value={[80, 65, 45, 30][index]} className="w-20 h-2" />
                            <span className="text-xs text-gray-500">{[80, 65, 45, 30][index]}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-4">Communication Channels</h3>
                    <div className="space-y-3">
                      {[
                        { name: 'WhatsApp', value: 92, icon: <MessageCircle className="w-4 h-4" /> },
                        { name: 'SMS', value: 78, icon: <Phone className="w-4 h-4" /> },
                        { name: 'Email', value: 65, icon: <Mail className="w-4 h-4" /> }
                      ].map((channel) => (
                        <div key={channel.name} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            {channel.icon}
                            <span className="text-sm">{channel.name}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Progress value={channel.value} className="w-20 h-2" />
                            <span className="text-xs text-gray-500">{channel.value}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return null;
}