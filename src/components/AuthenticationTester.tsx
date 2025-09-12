import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Alert, AlertDescription } from "./ui/alert";
import { API_CONFIG } from '../utils/api';
import { Shield, Key, AlertCircle, CheckCircle } from 'lucide-react';

export function AuthenticationTester() {
  const [testPassword, setTestPassword] = useState('');
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const testAuthentication = async () => {
    if (!testPassword.trim()) {
      setError('Please enter a password to test');
      return;
    }

    setTesting(true);
    setError(null);
    setResult(null);

    try {
      console.log('🧪 Testing authentication with password:', testPassword);
      
      const response = await fetch(`${API_CONFIG.baseUrl}/admin/authenticate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_CONFIG.publicAnonKey}`,
        },
        body: JSON.stringify({ password: testPassword }),
      });

      const data = await response.json();
      
      setResult({
        status: response.status,
        statusText: response.statusText,
        success: response.ok && data.success,
        data: data,
        timestamp: new Date().toISOString()
      });

      if (response.ok && data.success) {
        console.log('✅ Authentication test successful!', data);
      } else {
        console.log('❌ Authentication test failed:', response.status, data);
      }
      
    } catch (err: any) {
      console.error('❌ Authentication test error:', err);
      setError(`Test failed: ${err.message}`);
    } finally {
      setTesting(false);
    }
  };

  const tryDefaultPassword = () => {
    setTestPassword('HermanAdmin2024!');
  };

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <Card className="w-80">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center space-x-2">
            <Shield className="w-4 h-4" />
            <span>Authentication Tester</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="test-password">Test Password</Label>
            <div className="flex space-x-2 mt-1">
              <Input
                id="test-password"
                type="text"
                value={testPassword}
                onChange={(e) => setTestPassword(e.target.value)}
                placeholder="Enter password to test"
                className="flex-1"
                onKeyDown={(e) => e.key === 'Enter' && !testing && testAuthentication()}
              />
            </div>
          </div>

          <div className="flex space-x-2">
            <Button 
              onClick={testAuthentication}
              disabled={testing || !testPassword.trim()}
              size="sm"
              className="flex-1"
            >
              {testing ? 'Testing...' : 'Test Auth'}
            </Button>
            <Button 
              onClick={tryDefaultPassword}
              variant="outline"
              size="sm"
            >
              <Key className="w-3 h-3" />
            </Button>
          </div>

          {result && (
            <Alert>
              {result.success ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              <AlertDescription>
                <div className="space-y-1 text-xs">
                  <div className={`font-semibold ${result.success ? 'text-green-700' : 'text-red-700'}`}>
                    {result.success ? '✅ Authentication Successful' : '❌ Authentication Failed'}
                  </div>
                  <div><strong>Status:</strong> {result.status} {result.statusText}</div>
                  {result.data?.error && (
                    <div className="text-red-600">
                      <strong>Error:</strong> {result.data.error}
                    </div>
                  )}
                  {result.data?.message && (
                    <div className="text-green-600">
                      <strong>Message:</strong> {result.data.message}
                    </div>
                  )}
                  {result.data?.token && (
                    <div><strong>Token:</strong> {result.data.token.substring(0, 20)}...</div>
                  )}
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
            Quick auth testing tool
          </div>
        </CardContent>
      </Card>
    </div>
  );
}