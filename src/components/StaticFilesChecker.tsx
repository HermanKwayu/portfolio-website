import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

interface FileStatus {
  url: string;
  name: string;
  status: 'checking' | 'success' | 'error';
  statusCode?: number;
  contentType?: string;
}

export function StaticFilesChecker() {
  const [fileStatuses, setFileStatuses] = useState<FileStatus[]>([
    { url: '/sitemap.xml', name: 'Sitemap', status: 'checking' },
    { url: '/robots.txt', name: 'Robots.txt', status: 'checking' },
    { url: '/manifest.json', name: 'Manifest', status: 'checking' },
    { url: '/sw.js', name: 'Service Worker', status: 'checking' },
  ]);
  const [isChecking, setIsChecking] = useState(false);

  const checkFiles = async () => {
    setIsChecking(true);
    const updatedStatuses = await Promise.all(
      fileStatuses.map(async (file) => {
        try {
          // Use both HEAD and GET requests for better compatibility
          let response = await fetch(file.url, { method: 'HEAD' });
          
          // If HEAD fails, try GET
          if (!response.ok) {
            response = await fetch(file.url, { 
              method: 'GET',
              cache: 'no-cache',
              headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache'
              }
            });
          }
          
          return {
            ...file,
            status: response.ok ? 'success' : 'error' as const,
            statusCode: response.status,
            contentType: response.headers.get('content-type') || undefined,
          };
        } catch (error) {
          console.error(`Error checking ${file.name}:`, error);
          return {
            ...file,
            status: 'error' as const,
            statusCode: 0,
          };
        }
      })
    );
    setFileStatuses(updatedStatuses);
    setIsChecking(false);
  };

  useEffect(() => {
    // Auto-check on mount
    checkFiles();
  }, []);

  const getStatusIcon = (status: FileStatus['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'checking':
        return <AlertCircle className="w-5 h-5 text-yellow-500 animate-pulse" />;
    }
  };

  const getStatusText = (file: FileStatus) => {
    if (file.status === 'checking') return 'Checking...';
    if (file.status === 'success') {
      return `✅ ${file.statusCode} - ${file.contentType || 'Unknown content type'}`;
    }
    return `❌ ${file.statusCode || 'Network Error'}`;
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          Static Files Status
        </CardTitle>
        <CardDescription>
          Check if sitemap.xml and robots.txt are accessible
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {fileStatuses.map((file) => (
            <div key={file.url} className="flex items-center justify-between p-2 rounded border">
              <div className="flex items-center gap-2">
                {getStatusIcon(file.status)}
                <span className="font-medium">{file.name}</span>
              </div>
              <div className="text-sm text-muted-foreground">
                {getStatusText(file)}
              </div>
            </div>
          ))}
          
          <Button 
            onClick={checkFiles} 
            disabled={isChecking}
            className="w-full mt-4"
            variant="outline"
          >
            {isChecking ? 'Checking...' : 'Recheck Files'}
          </Button>

          <div className="text-xs text-muted-foreground mt-4 p-2 bg-muted rounded">
            <strong>Quick Test URLs:</strong>
            <div className="mt-1 space-y-1">
              <div>• <a href="/sitemap.xml" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">/sitemap.xml</a></div>
              <div>• <a href="/robots.txt" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">/robots.txt</a></div>
              <div>• <a href="/manifest.json" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">/manifest.json</a></div>
            </div>
            <div className="mt-2 pt-2 border-t border-border">
              <strong>Deployment Info:</strong>
              <div className="mt-1">
                Environment: {process.env.NODE_ENV || 'development'}
              </div>
              <div>
                Current URL: {window.location.origin}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}