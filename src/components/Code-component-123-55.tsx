import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface PasswordDiagnosticProps {
  onClose: () => void;
}

export function PasswordDiagnostic({ onClose }: PasswordDiagnosticProps) {
  const [testPassword, setTestPassword] = useState('');
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testPasswordMatch = async () => {
    if (!testPassword) return;
    
    setLoading(true);
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-4d80a1b0/debug/password-test`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({ password: testPassword })
      });

      if (response.ok) {
        const data = await response.json();
        setResults(data);
      } else {
        setResults({ error: `HTTP ${response.status}: ${response.statusText}` });
      }
    } catch (error) {
      setResults({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl max-h-[80vh] overflow-auto">
      <CardHeader>
        <CardTitle className="text-center">Password Diagnostic Tool</CardTitle>
        <p className="text-sm text-muted-foreground text-center">
          Test password matching to debug authentication issues
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Test Password:</label>
          <Input
            type="password"
            value={testPassword}
            onChange={(e) => setTestPassword(e.target.value)}
            placeholder="Enter password to test..."
          />
        </div>

        <div className="flex gap-2">
          <Button onClick={testPasswordMatch} disabled={loading || !testPassword}>
            {loading ? 'Testing...' : 'Test Password'}
          </Button>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>

        {results && (
          <div className="space-y-4 p-4 bg-muted rounded-lg">
            <h3 className="font-medium">Diagnostic Results:</h3>
            
            {results.error ? (
              <div className="text-destructive">{results.error}</div>
            ) : (
              <div className="space-y-3 text-sm">
                <div>
                  <strong>Password Source:</strong> {results.source}
                </div>
                
                <div>
                  <strong>Input Password:</strong>
                  <ul className="ml-4 mt-1">
                    <li>Length: {results.provided?.length || 0}</li>
                    <li>Trimmed: "{results.provided?.trimmed || ''}"</li>
                  </ul>
                </div>
                
                <div>
                  <strong>Expected Password:</strong>
                  <ul className="ml-4 mt-1">
                    <li>Length: {results.expected?.length || 0}</li>
                    <li>Trimmed: "{results.expected?.trimmed || ''}"</li>
                  </ul>
                </div>
                
                <div>
                  <strong>Comparison Results:</strong>
                  <ul className="ml-4 mt-1">
                    <li>Direct match: {results.comparison?.direct ? '✅ Yes' : '❌ No'}</li>
                    <li>Trimmed match: {results.comparison?.trimmed ? '✅ Yes' : '❌ No'}</li>
                    <li>Case insensitive: {results.comparison?.normalized ? '✅ Yes' : '❌ No'}</li>
                  </ul>
                </div>

                {results.comparison?.direct && (
                  <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded text-green-800 dark:text-green-200">
                    ✅ Password matches! Authentication should work.
                  </div>
                )}

                {!results.comparison?.direct && (
                  <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded text-red-800 dark:text-red-200">
                    ❌ Password mismatch detected. This explains the authentication failure.
                  </div>
                )}
              </div>
            )}
            
            <div className="text-xs text-muted-foreground">
              Timestamp: {results.timestamp}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}