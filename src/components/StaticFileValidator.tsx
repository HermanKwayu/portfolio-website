import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { CheckCircle, XCircle, RefreshCw, ExternalLink, FileText, Map, Settings, Code } from 'lucide-react';

interface FileValidation {
  url: string;
  name: string;
  icon: React.ReactNode;
  status: 'pending' | 'success' | 'error';
  statusCode?: number;
  contentType?: string;
  size?: number;
  error?: string;
  content?: string;
}

export function StaticFileValidator() {
  const [validations, setValidations] = useState<FileValidation[]>([
    {
      url: '/sitemap.xml',
      name: 'Sitemap XML',
      icon: <Map className="w-4 h-4" />,
      status: 'pending'
    },
    {
      url: '/robots.txt',
      name: 'Robots.txt',
      icon: <FileText className="w-4 h-4" />,
      status: 'pending'
    },
    {
      url: '/manifest.json',
      name: 'Web Manifest',
      icon: <Settings className="w-4 h-4" />,
      status: 'pending'
    },
    {
      url: '/sw.js',
      name: 'Service Worker',
      icon: <Code className="w-4 h-4" />,
      status: 'pending'
    }
  ]);
  
  const [isValidating, setIsValidating] = useState(false);

  const validateFiles = async () => {
    setIsValidating(true);
    
    const updatedValidations = await Promise.all(
      validations.map(async (validation) => {
        try {
          // Force cache bypass
          const url = `${validation.url}?_t=${Date.now()}`;
          const response = await fetch(url, {
            method: 'GET',
            cache: 'no-cache',
            headers: {
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              'Pragma': 'no-cache',
              'Expires': '0'
            }
          });

          let content = '';
          let size = 0;
          
          if (response.ok) {
            const text = await response.text();
            content = text.slice(0, 200); // First 200 chars for preview
            size = text.length;
          }

          return {
            ...validation,
            status: response.ok ? 'success' : 'error' as const,
            statusCode: response.status,
            contentType: response.headers.get('content-type') || 'Unknown',
            size,
            content,
            error: response.ok ? undefined : `HTTP ${response.status}: ${response.statusText}`
          };
        } catch (error) {
          return {
            ...validation,
            status: 'error' as const,
            statusCode: 0,
            error: error instanceof Error ? error.message : 'Network error'
          };
        }
      })
    );

    setValidations(updatedValidations);
    setIsValidating(false);
  };

  const getStatusIcon = (status: FileValidation['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <RefreshCw className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (validation: FileValidation) => {
    if (validation.status === 'success') {
      return <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
        {validation.statusCode} OK
      </Badge>;
    }
    if (validation.status === 'error') {
      return <Badge variant="destructive">
        {validation.statusCode || 'ERROR'}
      </Badge>;
    }
    return <Badge variant="secondary">Pending</Badge>;
  };

  const formatFileSize = (size?: number) => {
    if (!size) return '';
    if (size < 1024) return `${size}B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)}KB`;
    return `${(size / (1024 * 1024)).toFixed(1)}MB`;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Static File Validator
        </CardTitle>
        <CardDescription>
          Validate that all static files are properly served with correct headers
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Button 
            onClick={validateFiles} 
            disabled={isValidating}
            className="w-full"
            variant="outline"
          >
            {isValidating ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Validating Files...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Validate All Files
              </>
            )}
          </Button>

          <div className="space-y-3">
            {validations.map((validation) => (
              <div key={validation.url} className="border rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {validation.icon}
                    <span className="font-medium">{validation.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(validation)}
                    {getStatusIcon(validation.status)}
                  </div>
                </div>

                <div className="text-sm text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <span>URL: {validation.url}</span>
                    <a 
                      href={validation.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-primary hover:underline"
                    >
                      Test <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  
                  {validation.contentType && (
                    <div>Content-Type: {validation.contentType}</div>
                  )}
                  
                  {validation.size !== undefined && (
                    <div>Size: {formatFileSize(validation.size)}</div>
                  )}
                  
                  {validation.error && (
                    <div className="text-red-600">Error: {validation.error}</div>
                  )}
                </div>

                {validation.content && validation.status === 'success' && (
                  <details className="text-xs">
                    <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                      Show Content Preview
                    </summary>
                    <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-x-auto">
                      {validation.content}
                      {validation.size && validation.size > 200 && '...'}
                    </pre>
                  </details>
                )}
              </div>
            ))}
          </div>

          <div className="text-xs text-muted-foreground p-3 bg-muted rounded">
            <strong>Troubleshooting Tips:</strong>
            <ul className="mt-1 space-y-1 list-disc list-inside">
              <li>Ensure files exist in the <code>/public</code> directory</li>
              <li>Check deployment platform configuration (Netlify/Vercel)</li>
              <li>Verify build process copies static files correctly</li>
              <li>Test locally with <code>npm run preview</code></li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}