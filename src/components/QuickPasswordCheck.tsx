import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Alert, AlertDescription } from "./ui/alert";
import { API_CONFIG } from '../utils/api';
import { Eye, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';

export function QuickPasswordCheck() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const checkPassword = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      console.log('🔍 Checking admin password configuration...');
      
      const response = await fetch(`${API_CONFIG.baseUrl}/debug/admin-password`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_CONFIG.publicAnonKey}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setResult(data);
        console.log('✅ Password check result:', data);
      } else {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
    } catch (err: any) {
      console.error('❌ Password check failed:', err);
      setError(`Failed to check password: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Auto-check on mount
  useEffect(() => {
    checkPassword();
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="w-80">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center space-x-2">
            <Eye className="w-4 h-4" />
            <span>Quick Password Check</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button 
            onClick={checkPassword}
            disabled={loading}
            size="sm"
            className="w-full"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                Checking...
              </>
            ) : (
              <>
                <Eye className="w-4 h-4 mr-2" />
                Check Current Password
              </>
            )}
          </Button>

          {result && (
            <Alert>
              <CheckCircle className="w-4 h-4" />
              <AlertDescription>
                <div className="space-y-1 text-xs">
                  <div><strong>Source:</strong> {result.source}</div>
                  <div><strong>Current Password:</strong></div>
                  <div className="font-mono bg-muted p-2 rounded text-sm mt-1">
                    {result.actualPassword}
                  </div>
                  <div className="text-muted-foreground mt-2">
                    Use this password in the admin login
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
        </CardContent>
      </Card>
    </div>
  );
}