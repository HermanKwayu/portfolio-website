import React, { useState } from 'react';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

export function ConnectionDiagnostic() {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<string[]>([]);

  const addResult = (message: string) => {
    setResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const runDiagnostic = async () => {
    setIsRunning(true);
    setResults([]);
    
    addResult('🔍 Starting connection diagnostic...');
    
    // Test 1: Basic network connectivity
    addResult('📡 Testing basic network connectivity...');
    try {
      const response = await fetch('https://www.google.com', { method: 'HEAD', mode: 'no-cors' });
      addResult('✅ Basic internet connectivity: OK');
    } catch (error) {
      addResult('❌ Basic internet connectivity: FAILED');
      addResult(`   Error: ${error}`);
    }

    // Test 2: Supabase project URL
    const supabaseUrl = `https://${projectId}.supabase.co`;
    addResult(`🔗 Testing Supabase project URL: ${supabaseUrl}`);
    try {
      const response = await fetch(supabaseUrl, { method: 'HEAD', mode: 'cors' });
      addResult(`✅ Supabase project reachable: ${response.status} ${response.statusText}`);
    } catch (error) {
      addResult('❌ Supabase project unreachable');
      addResult(`   Error: ${error}`);
    }

    // Test 3: Edge Functions endpoint
    const functionsUrl = `https://${projectId}.supabase.co/functions/v1`;
    addResult(`⚙️ Testing Edge Functions endpoint: ${functionsUrl}`);
    try {
      const response = await fetch(functionsUrl, { 
        method: 'HEAD', 
        mode: 'cors',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        }
      });
      addResult(`✅ Edge Functions endpoint reachable: ${response.status} ${response.statusText}`);
    } catch (error) {
      addResult('❌ Edge Functions endpoint unreachable');
      addResult(`   Error: ${error}`);
    }

    // Test 4: Debug password format
    const debugUrl = `https://${projectId}.supabase.co/functions/v1/make-server-4d80a1b0/debug/password`;
    addResult(`🔐 Testing password format: ${debugUrl}`);
    try {
      const response = await fetch(debugUrl, { 
        method: 'GET',
        mode: 'cors',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        }
      });
      if (response.ok) {
        const result = await response.json();
        addResult(`✅ Expected password: "${result.expected}" (length: ${result.length})`);
        addResult(`   Password char codes: ${result.charCodes.map(c => `${c.char}:${c.code}`).join(' ')}`);
      } else {
        addResult(`⚠️ Debug endpoint returned: ${response.status}`);
      }
    } catch (error) {
      addResult('❌ Debug endpoint unreachable');
      addResult(`   Error: ${error}`);
    }

    // Test 5: Admin auth endpoint with correct password
    const authUrl = `https://${projectId}.supabase.co/functions/v1/make-server-4d80a1b0/admin/authenticate`;
    addResult(`🔐 Testing admin auth endpoint: ${authUrl}`);
    try {
      const testPassword = 'HermanAdmin2024!';
      const response = await fetch(authUrl, { 
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({ password: testPassword })
      });
      addResult(`✅ Admin endpoint reachable: ${response.status} ${response.statusText}`);
      
      if (response.ok) {
        const result = await response.json();
        addResult(`✅ Authentication successful with correct password!`);
      } else if (response.status === 401) {
        addResult('❌ Authentication failed - password mismatch detected');
        const errorResult = await response.json();
        if (errorResult.debug) {
          addResult(`   Debug info: received="${errorResult.debug.received}" vs expected="${errorResult.debug.expected}"`);
        }
      }
    } catch (error) {
      addResult('❌ Admin endpoint unreachable');
      addResult(`   Error: ${error}`);
    }

    // Test 5: Environment variables
    addResult('🔧 Checking environment variables...');
    addResult(`   Project ID: ${projectId ? '✅ Set' : '❌ Missing'}`);
    addResult(`   Public Key: ${publicAnonKey ? '✅ Set' : '❌ Missing'}`);

    // Test 6: Browser environment
    addResult('🌐 Checking browser environment...');
    addResult(`   Navigator online: ${navigator.onLine ? '✅ Online' : '❌ Offline'}`);
    addResult(`   User Agent: ${navigator.userAgent.substring(0, 50)}...`);

    addResult('🏁 Diagnostic complete!');
    setIsRunning(false);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>🔍 Connection Diagnostic Tool</CardTitle>
        <p className="text-sm text-muted-foreground">
          This tool helps diagnose connectivity issues with the Supabase backend.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={runDiagnostic} disabled={isRunning} className="w-full">
          {isRunning ? 'Running Diagnostic...' : 'Run Connection Test'}
        </Button>
        
        {results.length > 0 && (
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <h4 className="font-medium mb-2">Diagnostic Results:</h4>
            <div className="space-y-1 text-sm font-mono max-h-80 overflow-y-auto">
              {results.map((result, index) => (
                <div key={index} className="whitespace-pre-wrap">
                  {result}
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm">
          <strong>💡 Common Issues:</strong>
          <ul className="mt-2 space-y-1 text-xs">
            <li>• If Supabase project is unreachable: Check if your Supabase project is active</li>
            <li>• If Edge Functions fail: Ensure the make-server-4d80a1b0 function is deployed</li>
            <li>• If CORS errors occur: Check Supabase project settings</li>
            <li>• If network fails: Check firewall/proxy settings</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}