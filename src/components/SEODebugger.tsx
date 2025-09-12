import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

interface SEOCheck {
  name: string;
  status: 'pass' | 'fail' | 'warn';
  value: string | number;
  optimal: string;
  priority: 'high' | 'medium' | 'low';
}

export function SEODebugger() {
  const [seoChecks, setSeoChecks] = useState<SEOCheck[]>([]);

  useEffect(() => {
    const performSEOChecks = () => {
      const checks: SEOCheck[] = [];

      // Check for H1 tags
      const h1Tags = document.querySelectorAll('h1');
      checks.push({
        name: 'H1 Tag',
        status: h1Tags.length === 1 ? 'pass' : h1Tags.length === 0 ? 'fail' : 'warn',
        value: h1Tags.length,
        optimal: '1',
        priority: 'high'
      });

      // Check title length
      const title = document.title;
      checks.push({
        name: 'Title Tag',
        status: title.length >= 30 && title.length <= 60 ? 'pass' : 'warn',
        value: title.length,
        optimal: '30-60 characters',
        priority: 'high'
      });

      // Check meta description
      const metaDesc = document.querySelector('meta[name="description"]')?.getAttribute('content') || '';
      checks.push({
        name: 'Meta Description',
        status: metaDesc.length >= 120 && metaDesc.length <= 160 ? 'pass' : 'warn',
        value: metaDesc.length,
        optimal: '120-160 characters',
        priority: 'high'
      });

      // Check for structured data
      const structuredData = document.querySelectorAll('script[type="application/ld+json"]');
      checks.push({
        name: 'Structured Data',
        status: structuredData.length > 0 ? 'pass' : 'fail',
        value: structuredData.length,
        optimal: '1+',
        priority: 'medium'
      });

      // Check for Open Graph tags
      const ogTags = document.querySelectorAll('meta[property^="og:"]');
      checks.push({
        name: 'Open Graph Tags',
        status: ogTags.length >= 4 ? 'pass' : 'warn',
        value: ogTags.length,
        optimal: '4+',
        priority: 'medium'
      });

      // Check for canonical URL
      const canonical = document.querySelector('link[rel="canonical"]');
      checks.push({
        name: 'Canonical URL',
        status: canonical ? 'pass' : 'fail',
        value: canonical ? 'Found' : 'Missing',
        optimal: 'Present',
        priority: 'medium'
      });

      // Check HTTPS
      checks.push({
        name: 'HTTPS',
        status: window.location.protocol === 'https:' ? 'pass' : 'fail',
        value: window.location.protocol,
        optimal: 'https:',
        priority: 'high'
      });

      setSeoChecks(checks);
    };

    // Run checks after a short delay to ensure all components are loaded
    const timer = setTimeout(performSEOChecks, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass':
        return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case 'fail':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'warn':
        return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pass':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">PASS</Badge>;
      case 'fail':
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">FAIL</Badge>;
      case 'warn':
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">WARN</Badge>;
      default:
        return null;
    }
  };

  const calculateScore = () => {
    const totalChecks = seoChecks.length;
    const passedChecks = seoChecks.filter(check => check.status === 'pass').length;
    const warnChecks = seoChecks.filter(check => check.status === 'warn').length;
    
    // Pass = 100%, Warn = 50%, Fail = 0%
    const score = Math.round(((passedChecks + warnChecks * 0.5) / totalChecks) * 100);
    return score;
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl">SEO Audit Report</CardTitle>
          <div className="text-right">
            <div className="text-3xl font-bold text-primary">{calculateScore()}%</div>
            <div className="text-sm text-muted-foreground">SEO Score</div>
          </div>
        </div>
        <p className="text-muted-foreground">Your website's search engine optimization analysis</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {seoChecks.map((check, index) => (
          <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-3">
              {getStatusIcon(check.status)}
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium">{check.name}</span>
                  {getStatusBadge(check.status)}
                  <Badge variant="outline" className="text-xs">
                    {check.priority.toUpperCase()} PRIORITY
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  Current: {check.value} | Optimal: {check.optimal}
                </div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}