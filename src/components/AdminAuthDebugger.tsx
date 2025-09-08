import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { projectId, publicAnonKey } from '../utils/supabase/info';

export function AdminAuthDebugger() {
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [resetPassword, setResetPassword] = useState('');
  const [emergencyKey, setEmergencyKey] = useState('');
  const [message, setMessage] = useState('');

  const debugPasswordStatus = async () => {
    setLoading(true);
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-4d80a1b0/admin/debug-password`);
      const data = await response.json();
      setDebugInfo(data);
    } catch (error) {
      setMessage(`Debug failed: ${error}`);
    }
    setLoading(false);
  };

  const emergencyReset = async () => {
    if (!resetPassword || !emergencyKey) {
      setMessage('Please enter both emergency key and new password');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-4d80a1b0/admin/emergency-reset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emergencyKey,
          newPassword: resetPassword
        })
      });

      const data = await response.json();
      if (data.success) {
        setMessage(`✅ ${data.message}`);
        setResetPassword('');
        setEmergencyKey('');
        // Refresh debug info
        setTimeout(() => debugPasswordStatus(), 1000);
      } else {
        setMessage(`❌ ${data.error}`);
      }
    } catch (error) {
      setMessage(`❌ Reset failed: ${error}`);
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-auto">
        <CardHeader>
          <CardTitle className="text-red-600">🚨 Admin Authentication Debugger</CardTitle>
          <p className="text-sm text-muted-foreground">
            This is a temporary debugging tool to fix authentication issues. Remove this component after fixing.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Debug Info */}
          <div>
            <Button onClick={debugPasswordStatus} disabled={loading} className="w-full">
              {loading ? 'Checking...' : 'Check Password Status'}
            </Button>
            
            {debugInfo && (
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Debug Information:</h4>
                <div className="space-y-1 text-sm font-mono">
                  <p>Database Password Exists: {debugInfo.dbPasswordExists ? '✅ Yes' : '❌ No'}</p>
                  <p>Database Password Length: {debugInfo.dbPasswordLength}</p>
                  <p>Environment Password Exists: {debugInfo.envPasswordExists ? '✅ Yes' : '❌ No'}</p>
                  <p>Environment Password Length: {debugInfo.envPasswordLength}</p>
                  <p>Fallback Password Length: {debugInfo.fallbackPasswordLength}</p>
                  <div className="mt-2 p-2 bg-yellow-100 border border-yellow-300 rounded">
                    <p className="font-medium text-yellow-800">Current Expected Password:</p>
                    <p className="font-mono text-yellow-900 break-all">{debugInfo.expectedPassword}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Emergency Reset */}
          <div className="border-t pt-6">
            <h4 className="font-medium mb-4">Emergency Password Reset</h4>
            <div className="space-y-4">
              <div>
                <Label htmlFor="emergencyKey">Emergency Key</Label>
                <Input
                  id="emergencyKey"
                  type="text"
                  value={emergencyKey}
                  onChange={(e) => setEmergencyKey(e.target.value)}
                  placeholder="herman_emergency_2024"
                />
              </div>
              
              <div>
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={resetPassword}
                  onChange={(e) => setResetPassword(e.target.value)}
                  placeholder="Enter new admin password (min 8 chars)"
                />
              </div>
              
              <Button 
                onClick={emergencyReset} 
                disabled={loading || !resetPassword || !emergencyKey}
                variant="destructive"
                className="w-full"
              >
                {loading ? 'Resetting...' : 'Emergency Reset Password'}
              </Button>
            </div>
          </div>

          {/* Messages */}
          {message && (
            <div className={`p-3 rounded-lg ${
              message.includes('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
            }`}>
              {message}
            </div>
          )}

          {/* Instructions */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">How to Fix:</h4>
            <ol className="text-sm text-blue-800 space-y-1">
              <li>1. Click "Check Password Status" to see current password info</li>
              <li>2. Use Emergency Key: <code className="bg-blue-100 px-1 rounded">herman_emergency_2024</code></li>
              <li>3. Set a new password you'll remember (e.g., "Kilanya@121")</li>
              <li>4. Click "Emergency Reset Password"</li>
              <li>5. Try logging in with your new password</li>
              <li>6. Remove this debug component after fixing</li>
            </ol>
          </div>

          <Button 
            onClick={() => window.location.reload()} 
            variant="outline" 
            className="w-full"
          >
            Close & Reload Page
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}