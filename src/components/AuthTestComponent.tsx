import React, { useState } from 'react';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { projectId, publicAnonKey } from '../utils/supabase/info';

export function AuthTestComponent() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>('');

  const testAuth = async () => {
    setLoading(true);
    setResult('Testing authentication...');

    try {
      const authUrl = `https://${projectId}.supabase.co/functions/v1/make-server-4d80a1b0/admin/authenticate`;
      
      console.log('🔍 Testing auth endpoint:', authUrl);
      
      const response = await fetch(authUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({ password: password.trim() })
      });

      console.log('📡 Response status:', response.status);
      console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error response:', errorText);
        setResult(`❌ HTTP ${response.status}: ${response.statusText}\n\nResponse: ${errorText}`);
        return;
      }

      const data = await response.json();
      console.log('✅ Response data:', data);
      
      if (data.success) {
        setResult(`✅ Authentication successful!\n\nToken: ${data.token}\nMessage: ${data.message}`);
      } else {
        setResult(`❌ Authentication failed: ${data.error}`);
      }

    } catch (error: any) {
      console.error('❌ Network error:', error);
      setResult(`❌ Network Error: ${error.message}\n\nThis could indicate:\n- Server is not deployed\n- Network connectivity issues\n- CORS problems`);
    } finally {
      setLoading(false);
    }
  };

  const testServerWarmup = async () => {
    setLoading(true);
    setResult('Testing server warmup...');

    try {
      const warmUrl = `https://${projectId}.supabase.co/functions/v1/make-server-4d80a1b0/warm`;
      
      console.log('🔥 Testing warmup endpoint:', warmUrl);
      
      const response = await fetch(warmUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        }
      });

      console.log('📡 Warmup response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        setResult(`❌ Warmup failed - HTTP ${response.status}: ${response.statusText}\n\nResponse: ${errorText}`);
        return;
      }

      const data = await response.json();
      console.log('✅ Warmup response:', data);
      setResult(`✅ Server is responsive!\n\nMessage: ${data.message}\nTimestamp: ${data.timestamp}`);

    } catch (error: any) {
      console.error('❌ Warmup error:', error);
      setResult(`❌ Server Warmup Failed: ${error.message}\n\nThe server appears to be unreachable.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>🔧 Authentication Debug Tool</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="password">Test Password:</label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password to test"
            />
          </div>
          
          <div className="flex gap-2">
            <Button 
              onClick={testServerWarmup}
              disabled={loading}
              variant="outline"
            >
              {loading ? 'Testing...' : '🔥 Test Server'}
            </Button>
            
            <Button 
              onClick={testAuth}
              disabled={loading || !password.trim()}
            >
              {loading ? 'Testing...' : '🔐 Test Auth'}
            </Button>
            
            <Button 
              onClick={() => window.location.reload()}
              variant="secondary"
            >
              ❌ Close
            </Button>
          </div>

          {result && (
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
              <h3 className="mb-2">📊 Test Results:</h3>
              <pre className="whitespace-pre-wrap text-sm">{result}</pre>
            </div>
          )}

          <div className="text-sm text-gray-600 dark:text-gray-400">
            <p><strong>Project ID:</strong> {projectId}</p>
            <p><strong>Auth Endpoint:</strong> /functions/v1/make-server-4d80a1b0/admin/authenticate</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}