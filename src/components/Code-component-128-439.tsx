import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

interface FileStatus {
  name: string;
  url: string;
  status: 'loading' | 'success' | 'error';
  response?: string;
  error?: string;
}

export function StaticFileTest() {
  const [files, setFiles] = useState<FileStatus[]>([
    { name: 'Sitemap', url: '/sitemap.xml', status: 'loading' },
    { name: 'Robots.txt', url: '/robots.txt', status: 'loading' },
    { name: 'Manifest', url: '/manifest.json', status: 'loading' },
    { name: 'Service Worker', url: '/sw.js', status: 'loading' }
  ]);

  const testFile = async (file: FileStatus) => {
    try {
      const response = await fetch(file.url);
      const text = await response.text();
      
      if (response.ok) {
        return {
          ...file,
          status: 'success' as const,
          response: text.substring(0, 200) + (text.length > 200 ? '...' : '')
        };
      } else {
        return {
          ...file,
          status: 'error' as const,
          error: `HTTP ${response.status}: ${response.statusText}`
        };
      }
    } catch (error) {
      return {
        ...file,
        status: 'error' as const,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  };

  const testAllFiles = async () => {
    setFiles(files.map(f => ({ ...f, status: 'loading' })));
    
    const results = await Promise.all(files.map(testFile));
    setFiles(results);
  };

  useEffect(() => {
    testAllFiles();
  }, []);

  const getStatusBadge = (status: FileStatus['status']) => {
    switch (status) {
      case 'loading':
        return <Badge variant="secondary">Loading...</Badge>;
      case 'success':
        return <Badge variant="default" className="bg-green-500">✅ 200</Badge>;
      case 'error':
        return <Badge variant="destructive">❌ 404</Badge>;
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Static Files Status
          <Button onClick={testAllFiles} size="sm">
            Recheck Files
          </Button>
        </CardTitle>
        <p className="text-muted-foreground">
          Check if sitemap.xml and robots.txt are accessible
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {files.map((file) => (
          <div key={file.name} className="flex items-center justify-between p-3 rounded border">
            <div className="flex items-center gap-3">
              <span className="font-medium">{file.name}</span>
              {getStatusBadge(file.status)}
            </div>
            
            {file.status === 'error' && (
              <div className="text-sm text-red-600">
                {file.error}
              </div>
            )}
            
            {file.status === 'success' && (
              <div className="text-sm text-green-600">
                File accessible
              </div>
            )}
          </div>
        ))}
        
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium mb-2">How to test manually:</h4>
          <ul className="text-sm space-y-1 text-gray-600">
            <li>• Open: <code>http://localhost:4173/sitemap.xml</code></li>
            <li>• Open: <code>http://localhost:4173/robots.txt</code></li>
            <li>• Open: <code>http://localhost:4173/manifest.json</code></li>
            <li>• Open: <code>http://localhost:4173/sw.js</code></li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}