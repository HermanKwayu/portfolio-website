import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  MessageCircle, 
  Phone, 
  Mail, 
  QrCode,
  Calendar,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  Clock3
} from 'lucide-react';

interface AnalyticsData {
  totalEvents: number;
  totalInvitations: number;
  responseRate: number;
  checkInRate: number;
  popularEventTypes: Array<{ type: string; count: number; percentage: number }>;
  communicationChannels: Array<{ name: string; value: number; icon: React.ReactNode }>;
  monthlyTrends: Array<{ month: string; events: number; guests: number }>;
  topPerformingEvents: Array<{
    name: string;
    type: string;
    guests: number;
    responseRate: number;
    checkInRate: number;
  }>;
}

interface EventAnalyticsProps {
  data: AnalyticsData;
}

export function EventAnalytics({ data }: EventAnalyticsProps) {
  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Events</p>
                <p className="text-3xl font-bold">{data.totalEvents}</p>
                <p className="text-sm text-green-600 flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +12% this month
                </p>
              </div>
              <Calendar className="w-12 h-12 text-blue-500 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Invitations</p>
                <p className="text-3xl font-bold">{data.totalInvitations.toLocaleString()}</p>
                <p className="text-sm text-green-600 flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +8% this month
                </p>
              </div>
              <Users className="w-12 h-12 text-green-500 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Response Rate</p>
                <p className="text-3xl font-bold">{data.responseRate}%</p>
                <p className="text-sm text-green-600 flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +5% from last month
                </p>
              </div>
              <MessageCircle className="w-12 h-12 text-purple-500 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Check-in Rate</p>
                <p className="text-3xl font-bold">{data.checkInRate}%</p>
                <p className="text-sm text-green-600 flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +3% from last month
                </p>
              </div>
              <QrCode className="w-12 h-12 text-orange-500 opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Popular Event Types */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Popular Event Types
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.popularEventTypes.map((type, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium capitalize">{type.type}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">{type.count} events</span>
                      <Badge variant="secondary">{type.percentage}%</Badge>
                    </div>
                  </div>
                  <Progress value={type.percentage} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Communication Channels Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageCircle className="w-5 h-5 mr-2" />
              Communication Channels
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.communicationChannels.map((channel, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      {channel.icon}
                      <span className="font-medium">{channel.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">Success Rate</span>
                      <Badge variant="outline">{channel.value}%</Badge>
                    </div>
                  </div>
                  <Progress value={channel.value} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performing Events */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Top Performing Events
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.topPerformingEvents.map((event, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-12 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
                  <div>
                    <h3 className="font-medium">{event.name}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="capitalize">{event.type}</span>
                      <span>{event.guests} guests</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <p className="text-sm font-medium">{event.responseRate}%</p>
                    <p className="text-xs text-gray-500">Response</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium">{event.checkInRate}%</p>
                    <p className="text-xs text-gray-500">Check-in</p>
                  </div>
                  <div className="flex space-x-1">
                    {event.responseRate >= 80 && <CheckCircle className="w-4 h-4 text-green-500" />}
                    {event.checkInRate >= 85 && <QrCode className="w-4 h-4 text-blue-500" />}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Monthly Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Monthly Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.monthlyTrends.map((month, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-primary rounded-full"></div>
                  <span className="font-medium">{month.month}</span>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <p className="font-medium">{month.events}</p>
                    <p className="text-xs text-gray-500">Events</p>
                  </div>
                  <div className="text-center">
                    <p className="font-medium">{month.guests}</p>
                    <p className="text-xs text-gray-500">Guests</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Insights & Recommendations */}
      <Card className="border-l-4 border-l-primary">
        <CardHeader>
          <CardTitle className="text-primary">📊 Key Insights & Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3 text-green-600">✅ What's Working Well</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                  <span>WhatsApp has the highest engagement rate (92%)</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                  <span>QR code check-ins reduced entry time by 60%</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                  <span>Wedding events have 95% average attendance</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-3 text-blue-600">💡 Recommendations</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start space-x-2">
                  <TrendingUp className="w-4 h-4 text-blue-500 mt-0.5" />
                  <span>Send reminders 3 days before RSVP deadline</span>
                </li>
                <li className="flex items-start space-x-2">
                  <TrendingUp className="w-4 h-4 text-blue-500 mt-0.5" />
                  <span>Use personalized messages for VIP guests</span>
                </li>
                <li className="flex items-start space-x-2">
                  <TrendingUp className="w-4 h-4 text-blue-500 mt-0.5" />
                  <span>Consider adding photo sharing for engagement</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Sample data for demo
export const sampleAnalyticsData: AnalyticsData = {
  totalEvents: 24,
  totalInvitations: 3240,
  responseRate: 87,
  checkInRate: 92,
  popularEventTypes: [
    { type: 'wedding', count: 12, percentage: 50 },
    { type: 'corporate', count: 6, percentage: 25 },
    { type: 'birthday', count: 4, percentage: 17 },
    { type: 'graduation', count: 2, percentage: 8 },
  ],
  communicationChannels: [
    { name: 'WhatsApp', value: 92, icon: <MessageCircle className="w-4 h-4 text-green-500" /> },
    { name: 'SMS', value: 78, icon: <Phone className="w-4 h-4 text-blue-500" /> },
    { name: 'Email', value: 65, icon: <Mail className="w-4 h-4 text-purple-500" /> },
  ],
  monthlyTrends: [
    { month: 'Jan 2024', events: 3, guests: 420 },
    { month: 'Feb 2024', events: 5, guests: 680 },
    { month: 'Mar 2024', events: 4, guests: 520 },
    { month: 'Apr 2024', events: 6, guests: 750 },
    { month: 'May 2024', events: 4, guests: 580 },
    { month: 'Jun 2024', events: 2, guests: 290 },
  ],
  topPerformingEvents: [
    {
      name: "Herman & Sarah's Wedding",
      type: 'wedding',
      guests: 200,
      responseRate: 95,
      checkInRate: 98
    },
    {
      name: "Tech Conference 2024",
      type: 'corporate',
      guests: 150,
      responseRate: 88,
      checkInRate: 92
    },
    {
      name: "Birthday Celebration",
      type: 'birthday',
      guests: 80,
      responseRate: 82,
      checkInRate: 89
    }
  ]
};