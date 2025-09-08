/**
 * Secure Admin Authentication - Server-side validation with session management
 */

import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { SafeAdminDashboard } from './SafeAdminDashboard';
import { X, Lock, Shield, AlertCircle } from 'lucide-react';
import { adminAuth, adminLogin } from '../utils/adminAuth';

interface FastAdminAuthProps {
  isVisible: boolean;
  onClose: () => void;
}

export function FastAdminAuth({ isVisible, onClose }: FastAdminAuthProps) {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionInfo, setSessionInfo] = useState<{ expiry: Date | null; expiringSoon: boolean }>({
    expiry: null,
    expiringSoon: false
  });

  // Check for existing valid session and update session info
  useEffect(() => {
    if (isVisible) {
      const isValid = adminAuth.isSessionValid();
      setIsAuthenticated(isValid);
      
      if (isValid) {
        const expiry = adminAuth.getSessionExpiry();
        const expiringSoon = adminAuth.isSessionExpiringSoon();
        setSessionInfo({ expiry, expiringSoon });
      }
    }
  }, [isVisible]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isVisible) {
      setPassword('');
      setError(null);
      setIsLoading(false);
      // Don't reset authentication state - preserve session
    }
  }, [isVisible]);

  const handleAuth = async () => {
    if (!password.trim()) {
      setError('Password is required');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await adminLogin.authenticate(password);

      if (result.success) {
        setIsAuthenticated(true);
        setError(null);
        setPassword(''); // Clear password for security
        
        // Update session info
        const expiry = adminAuth.getSessionExpiry();
        const expiringSoon = adminAuth.isSessionExpiringSoon();
        setSessionInfo({ expiry, expiringSoon });
        
        console.log('✅ Admin authentication successful');
      } else {
        setError(result.error || 'Authentication failed');
        setPassword(''); // Clear password on failure
      }
    } catch (error) {
      console.error('Authentication error:', error);
      setError('Unexpected error. Please try again.');
      setPassword('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      e.preventDefault();
      handleAuth();
    }
  };

  const handleLogout = () => {
    adminAuth.clearSession();
    setIsAuthenticated(false);
    setPassword('');
    setError(null);
    setSessionInfo({ expiry: null, expiringSoon: false });
    console.log('🔓 Admin logged out');
  };

  if (!isVisible) return null;

  // If authenticated, show safe admin dashboard with logout capability
  if (isAuthenticated) {
    return (
      <SafeAdminDashboard 
        isVisible={isVisible}
        onClose={onClose}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Secure Admin Access
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-6 w-6 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="admin-password">Password</Label>
            <Input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter admin password"
              autoFocus
              disabled={isLoading}
              className="focus-ring"
            />
            {error && (
              <p className="text-sm text-destructive flex items-center gap-2">
                <X className="w-4 h-4" />
                {error}
              </p>
            )}
          </div>
          <Button 
            onClick={handleAuth}
            disabled={!password.trim() || isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                Authenticating...
              </>
            ) : (
              <>
                <Lock className="w-4 h-4 mr-2" />
                Secure Login
              </>
            )}
          </Button>
          <div className="text-xs text-muted-foreground text-center space-y-1">
            <p className="flex items-center justify-center gap-1">
              <Shield className="w-3 h-3" />
              Server-side encrypted authentication
            </p>
            <p>Session expires in 4 hours • Zero password exposure</p>
            <p className="text-[10px] opacity-75">
              Credentials validated server-side only
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}