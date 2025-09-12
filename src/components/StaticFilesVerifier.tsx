import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { CheckCircle, XCircle, Clock, RefreshCw } from 'lucide-react';

interface FileStatus {
  url: string;
  name: string;
  status: 'loading' | 'success' | 'error';
  statusCode?: number;
  contentType?: string;
  error?: string;
}

export function StaticFilesVerifier() {
  const [files, setFiles] = useState<FileStatus[]>([
    { url: '/sitemap.xml', name: 'Sitemap', status: 'loading' },
    { url: '/robots.txt', name: 'Robots.txt', status: 'loading' },
    { url: '/manifest.json', name: 'Manifest', status: 'loading' },
    { url: '/sw.js', name: 'Service Worker', status: 'loading' }
  ]);
  
  const [isChecking, setIsChecking] = useState(false);

  const checkFileStatus = async (file: FileStatus): Promise<FileStatus> => {
    try {
      const response = await fetch(file.url, { 
        method: 'HEAD',
        cache: 'no-cache'
      });
      
      return {
        ...file,
        status: response.ok ? 'success' : 'error',
        statusCode: response.status,
        contentType: response.headers.get('content-type') || undefined,
        error: response.ok ? undefined : `HTTP ${response.status}`
      };
    } catch (error) {
      return {
        ...file,
        status: 'error',
        error: error instanceof Error ? error.message : 'Network error'
      };
    }
  };

  const checkAllFiles = async () => {
    setIsChecking(true);
    
    const promises = files.map(checkFileStatus);
    const results = await Promise.all(promises);
    
    setFiles(results);
    setIsChecking(false);
  };

  useEffect(() => {
    checkAllFiles();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-500 animate-spin" />;
    }
  };

  const getStatusBadge = (file: FileStatus) => {
    if (file.status === 'success') {
      return <Badge variant="default" className="bg-green-100 text-green-800">✅ {file.statusCode}</Badge>;
    } else if (file.status === 'error') {
      return <Badge variant="destructive">❌ {file.error}</Badge>;
    }
    return <Badge variant="secondary">⏳ Checking...</Badge>;
  };

  const allSuccess = files.every(f => f.status === 'success');
  const anyError = files.some(f => f.status === 'error');

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {isChecking ? (
            <RefreshCw className="w-5 h-5 animate-spin" />
          ) : allSuccess ? (
            <CheckCircle className="w-5 h-5 text-green-500" />
          ) : anyError ? (
            <XCircle className="w-5 h-5 text-red-500" />
          ) : (
            <Clock className="w-5 h-5 text-yellow-500" />
          )}
          Static Files Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3">
          {files.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                {getStatusIcon(file.status)}
                <div>
                  <div className="font-medium">{file.name}</div>
                  <div className="text-sm text-muted-foreground">{file.url}</div>
                  {file.contentType && (
                    <div className="text-xs text-muted-foreground mt-1">
                      Content-Type: {file.contentType}
                    </div>
                  )}
                </div>
              </div>
              {getStatusBadge(file)}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            {allSuccess ? (
              '🎉 All static files are accessible!'
            ) : anyError ? (
              '⚠️ Some files have issues - check Vercel deployment'
            ) : (
              '⏳ Checking file accessibility...'
            )}
          </div>
          
          <Button 
            onClick={checkAllFiles}
            disabled={isChecking}
            variant="outline"
            size="sm"
          >
            {isChecking ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Checking...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Recheck
              </>
            )}
          </Button>
        </div>

        {allSuccess && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="text-sm text-green-800">
              <strong>✅ Perfect!</strong> All static files are working correctly. 
              You can now submit your sitemap to Google Search Console:
              <br />
              <code className="mt-1 block bg-white px-2 py-1 rounded">
                https://www.hermankwayu.com/sitemap.xml
              </code>
            </div>
          </div>
        )}

        {anyError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="text-sm text-red-800">
              <strong>❌ Issues Found:</strong> Some static files are not accessible. 
              This usually means Vercel deployment needs to be redeployed.
              <br />
              <strong>Solution:</strong> Push any change to trigger a new deployment.
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}