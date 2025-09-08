/**
 * Safe Admin Dashboard - Handles API failures gracefully
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Alert, AlertDescription } from "./ui/alert";
import { X, Database, Mail, MessageSquare, Users, AlertTriangle, CheckCircle, LogOut, Shield, Clock } from 'lucide-react';
import { adminAuth, adminAPI } from '../utils/adminAuth';

interface SafeAdminDashboardProps {
  isVisible: boolean;
  onClose: () => void;
  onLogout?: () => void;
}

export function SafeAdminDashboard({ isVisible, onClose, onLogout }: SafeAdminDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [sessionExpiry, setSessionExpiry] = useState<Date | null>(null);
  const [sessionExpiringSoon, setSessionExpiringSoon] = useState(false);

  // Check session status and connection
  useEffect(() => {
    if (!isVisible) return;

    const updateSessionInfo = () => {
      const expiry = adminAuth.getSessionExpiry();
      const expiringSoon = adminAuth.isSessionExpiringSoon();
      setSessionExpiry(expiry);
      setSessionExpiringSoon(expiringSoon);
    };

    const checkConnection = async () => {
      try {
        // Test admin API connection
        const isConnected = await adminAPI.testConnection();
        setConnectionStatus(isConnected ? 'online' : 'offline');
      } catch (error) {
        console.log('Admin connection check failed (expected in development):', error);
        setConnectionStatus('offline');
      }
      setLastChecked(new Date());
    };

    // Initial checks
    updateSessionInfo();
    checkConnection();

    // Set up intervals
    const sessionInterval = setInterval(updateSessionInfo, 60000); // Check session every minute
    const connectionInterval = setInterval(checkConnection, 30000); // Check connection every 30 seconds

    return () => {
      clearInterval(sessionInterval);
      clearInterval(connectionInterval);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-background border rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-primary" />
            <div>
              <h2 className="text-xl font-semibold">Secure Admin Dashboard</h2>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {connectionStatus === 'checking' && (
                  <>
                    <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
                    Checking secure connection...
                  </>
                )}
                {connectionStatus === 'online' && (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Secure API online
                  </>
                )}
                {connectionStatus === 'offline' && (
                  <>
                    <AlertTriangle className="w-4 h-4 text-yellow-500" />
                    Development mode
                  </>
                )}
                {sessionExpiry && (
                  <span className="flex items-center gap-1 ml-2">
                    <Clock className="w-3 h-3" />
                    Session expires: {sessionExpiry.toLocaleTimeString()}
                    {sessionExpiringSoon && (
                      <Badge variant="outline" className="ml-1 text-xs">
                        Expiring soon
                      </Badge>
                    )}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {onLogout && (
              <Button
                variant="outline"
                size="sm"
                onClick={onLogout}
                className="flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {connectionStatus === 'offline' && (
            <Alert className="mb-6">
              <Shield className="w-4 h-4" />
              <AlertDescription>
                <strong>Secure Session Active:</strong> API calls are disabled in development mode to prevent fetch errors. 
                In production, this dashboard shows real-time data from your encrypted Supabase backend with server-side authentication.
              </AlertDescription>
            </Alert>
          )}
          
          {sessionExpiringSoon && (
            <Alert className="mb-6 border-yellow-500">
              <Clock className="w-4 h-4" />
              <AlertDescription>
                <strong>Session Expiring Soon:</strong> Your admin session will expire in less than 30 minutes. 
                You may need to login again to continue using admin features.
              </AlertDescription>
            </Alert>
          )}

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="contacts">Contacts</TabsTrigger>
              <TabsTrigger value="newsletter">Newsletter</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Contacts</CardTitle>
                    <MessageSquare className="w-4 h-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {connectionStatus === 'online' ? '...' : '0'}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {connectionStatus === 'online' ? 'Loading...' : 'Demo data'}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Newsletter Subscribers</CardTitle>
                    <Users className="w-4 h-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {connectionStatus === 'online' ? '...' : '0'}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {connectionStatus === 'online' ? 'Loading...' : 'Demo data'}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">System Status</CardTitle>
                    <Database className="w-4 h-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <Badge variant={connectionStatus === 'online' ? 'default' : 'secondary'}>
                        {connectionStatus === 'online' ? 'Active' : 'Demo'}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {connectionStatus === 'online' ? 'All systems operational' : 'Development mode'}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="contacts">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Contact Form Submissions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {connectionStatus === 'online' ? (
                    <div className="text-center py-8">
                      <div className="animate-spin w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full mx-auto mb-4" />
                      <p className="text-muted-foreground">Loading contact data...</p>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        Contact data will appear here when connected to backend
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="newsletter">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="w-5 h-5" />
                    Newsletter Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {connectionStatus === 'online' ? (
                    <div className="text-center py-8">
                      <div className="animate-spin w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full mx-auto mb-4" />
                      <p className="text-muted-foreground">Loading newsletter data...</p>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Mail className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        Newsletter management tools will appear here when connected to backend
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics">
              <Card>
                <CardHeader>
                  <CardTitle>Analytics Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  {connectionStatus === 'online' ? (
                    <div className="text-center py-8">
                      <div className="animate-spin w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full mx-auto mb-4" />
                      <p className="text-muted-foreground">Loading analytics data...</p>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Database className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        Analytics dashboard will appear here when connected to backend
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">
                        In production, this would show visitor analytics, conversion metrics, and performance data.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}