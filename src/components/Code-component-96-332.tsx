import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Heart, Briefcase, PartyPopper, GraduationCap, Calendar, MessageCircle, Phone, Mail, QrCode, Scan, BarChart3, Users, Send, CheckCircle, Star, MapPin, Clock } from 'lucide-react';

interface EventDemoProps {
  onStartDemo: () => void;
}

export function EventDemo({ onStartDemo }: EventDemoProps) {
  const features = [
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Multi-Event Support",
      description: "Create weddings, corporate events, birthdays, conferences, and more",
      examples: ["Wedding ceremonies", "Corporate meetings", "Birthday celebrations", "Graduation parties"]
    },
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: "Multi-Channel Invitations",
      description: "Send invites via WhatsApp, SMS, and Email with personalized messages",
      examples: ["WhatsApp Business integration", "SMS gateway support", "Professional email templates", "Personalized QR codes"]
    },
    {
      icon: <QrCode className="w-6 h-6" />,
      title: "QR Code Entry Management",
      description: "Generate unique QR codes for each guest and scan for entry",
      examples: ["Contactless check-in", "Real-time attendance tracking", "Guest category management", "Entry validation"]
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Real-Time Analytics",
      description: "Track RSVPs, attendance, and event performance with detailed insights",
      examples: ["Response rate tracking", "Check-in statistics", "Guest categorization", "Event success metrics"]
    }
  ];

  const eventTypes = [
    { icon: <Heart className="w-8 h-8 text-pink-500" />, name: "Weddings", color: "bg-pink-50 border-pink-200" },
    { icon: <Briefcase className="w-8 h-8 text-blue-500" />, name: "Corporate", color: "bg-blue-50 border-blue-200" },
    { icon: <PartyPopper className="w-8 h-8 text-purple-500" />, name: "Birthday", color: "bg-purple-50 border-purple-200" },
    { icon: <GraduationCap className="w-8 h-8 text-green-500" />, name: "Graduation", color: "bg-green-50 border-green-200" }
  ];

  const workflow = [
    {
      step: 1,
      title: "Create Event",
      description: "Set up your event details, venue, date, and preferences",
      icon: <Calendar className="w-6 h-6" />
    },
    {
      step: 2,
      title: "Add Guests",
      description: "Import or manually add guests with contact information",
      icon: <Users className="w-6 h-6" />
    },
    {
      step: 3,
      title: "Send Invitations",
      description: "Choose channels and send personalized invites with QR codes",
      icon: <Send className="w-6 h-6" />
    },
    {
      step: 4,
      title: "Track & Manage",
      description: "Monitor RSVPs and check-in guests at the event",
      icon: <Scan className="w-6 h-6" />
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-6">
            <span className="text-sm font-medium text-primary">Professional Event Management</span>
          </div>
          
          <h1 className="text-4xl lg:text-6xl font-bold mb-6">
            Digital Event <span className="text-primary">Management</span> Platform
          </h1>
          
          <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto mb-8">
            Transform your events with our comprehensive digital platform. From digital invitations 
            to QR code entry management, handle everything seamlessly in one place.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" onClick={onStartDemo} className="px-8 py-4">
              <Calendar className="w-5 h-5 mr-2" />
              Start Creating Events
            </Button>
            <Button variant="outline" size="lg" className="px-8 py-4">
              <QrCode className="w-5 h-5 mr-2" />
              View Demo
            </Button>
          </div>
        </div>

        {/* Event Types */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Perfect for Any Event Type</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {eventTypes.map((type, index) => (
              <Card key={index} className={`${type.color} text-center hover:shadow-lg transition-shadow`}>
                <CardContent className="p-6">
                  <div className="mx-auto mb-4">
                    {type.icon}
                  </div>
                  <h3 className="font-semibold">{type.name}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Key Features */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Comprehensive Event Management</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="text-primary">
                      {feature.icon}
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                  </div>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {feature.examples.map((example, exIndex) => (
                      <div key={exIndex} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm">{example}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Workflow */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Simple 4-Step Process</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {workflow.map((item, index) => (
              <div key={index} className="text-center">
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <div className="text-primary">
                      {item.icon}
                    </div>
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                    {item.step}
                  </div>
                  {index < workflow.length - 1 && (
                    <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-primary/20 -z-10"></div>
                  )}
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Sample Event Card */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Real Event Example</h2>
          <div className="max-w-4xl mx-auto">
            <Card className="overflow-hidden">
              <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">Herman & Sarah's Wedding</h3>
                    <p className="opacity-90">Join us as we celebrate our love and begin our journey together</p>
                  </div>
                  <Heart className="w-12 h-12 opacity-80" />
                </div>
              </div>
              
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-medium">Date & Time</p>
                        <p className="text-muted-foreground">June 15, 2024 at 3:00 PM</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-medium">Venue</p>
                        <p className="text-muted-foreground">Serena Hotel Dar es Salaam</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Users className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-medium">Expected Guests</p>
                        <p className="text-muted-foreground">200 invitees</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Clock className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-medium">RSVP Deadline</p>
                        <p className="text-muted-foreground">May 15, 2024</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <div className="flex flex-wrap gap-4 items-center justify-between">
                    <div className="flex space-x-2">
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        142 Confirmed
                      </Badge>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700">
                        <QrCode className="w-3 h-3 mr-1" />
                        98 Checked-in
                      </Badge>
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                        <Clock className="w-3 h-3 mr-1" />
                        28 Pending
                      </Badge>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        WhatsApp
                      </Button>
                      <Button size="sm" variant="outline">
                        <Mail className="w-4 h-4 mr-2" />
                        Email
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-primary/10 to-secondary/10 rounded-3xl p-12">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Events?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of event organizers who trust our platform for their most important celebrations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={onStartDemo} className="px-8 py-4">
              <Calendar className="w-5 h-5 mr-2" />
              Create Your First Event
            </Button>
            <Button variant="outline" size="lg" className="px-8 py-4">
              <BarChart3 className="w-5 h-5 mr-2" />
              View Analytics Demo
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}