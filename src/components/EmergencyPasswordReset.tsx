import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Alert, AlertDescription } from "./ui/alert";
import { API_CONFIG } from '../utils/api';
import { Shield, AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';

export function EmergencyPasswordReset() {
  const [emergencyKey, setEmergencyKey] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const resetPassword = async () => {
    if (!emergencyKey.trim() || !newPassword.trim()) {
      setError('Please enter both emergency key and new password');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      console.log('🚨 Attempting emergency password reset...');
      
      const response = await fetch(`${API_CONFIG.baseUrl}/admin/emergency-reset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_CONFIG.publicAnonKey}`,
        },
        body: JSON.stringify({
          emergencyKey,
          newPassword
        }),
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        setResult(data);
        console.log('✅ Emergency password reset successful!', data);
        setEmergencyKey('');
        setNewPassword('');
      } else {
        throw new Error(data.error || 'Password reset failed');
      }
      
    } catch (err: any) {
      console.error('❌ Emergency password reset failed:', err);
      setError(`Reset failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const fillEmergencyKey = () => {
    setEmergencyKey('herman_emergency_2024');
    setNewPassword('HermanAdmin2024!');
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <Card className="w-80">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-yellow-500" />
            <span>Emergency Password Reset</span>
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Use only when locked out of admin account
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="emergency-key">Emergency Key</Label>
            <Input
              id="emergency-key"
              value={emergencyKey}
              onChange={(e) => setEmergencyKey(e.target.value)}
              placeholder="Enter emergency reset key"
            />
          </div>

          <div>
            <Label htmlFor="new-password">New Password</Label>
            <Input
              id="new-password"
              type="text"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Min 8 characters required
            </p>
          </div>

          <div className="flex space-x-2">
            <Button 
              onClick={resetPassword}
              disabled={loading || !emergencyKey.trim() || !newPassword.trim()}
              size="sm"
              variant="destructive"
              className="flex-1"
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </Button>
            <Button 
              onClick={fillEmergencyKey}
              variant="outline"
              size="sm"
            >
              Fill
            </Button>
          </div>

          {result && (
            <Alert>
              <CheckCircle className="w-4 h-4" />
              <AlertDescription>
                <div className="space-y-1 text-xs">
                  <div className="font-semibold text-green-700">✅ Password Reset Successful!</div>
                  <div>{result.message}</div>
                  <div>New password length: {result.newPasswordLength} characters</div>
                  <div className="text-blue-600 mt-2">
                    You can now use the new password in the admin login
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="w-4 h-4" />
              <AlertDescription className="text-xs">{error}</AlertDescription>
            </Alert>
          )}

          <div className="text-xs text-muted-foreground text-center">
            ⚠️ Use responsibly - for emergency access only
          </div>
        </CardContent>
      </Card>
    </div>
  );
}