import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";

interface SEOMetric {
  name: string;
  status: 'pass' | 'warn' | 'fail';
  message: string;
  priority: 'high' | 'medium' | 'low';
}

interface SEOAuditProps {
  isVisible: boolean;
  onClose: () => void;
}

export function SEOAudit({ isVisible, onClose }: SEOAuditProps) {
  const [metrics, setMetrics] = useState<SEOMetric[]>([]);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (isVisible) {
      performSEOAudit();
    }
  }, [isVisible]);

  const performSEOAudit = () => {
    const auditResults: SEOMetric[] = [];

    // Check title tag
    const title = document.title;
    if (title && title.length >= 30 && title.length <= 60) {
      auditResults.push({
        name: 'Title Tag',
        status: 'pass',
        message: `Good title length: ${title.length} characters`,
        priority: 'high'
      });
    } else {
      auditResults.push({
        name: 'Title Tag',
        status: title ? 'warn' : 'fail',
        message: title ? `Title length: ${title.length} chars (optimal: 30-60)` : 'Missing title tag',
        priority: 'high'
      });
    }

    // Check meta description
    const metaDesc = document.querySelector('meta[name="description"]')?.getAttribute('content');
    if (metaDesc && metaDesc.length >= 120 && metaDesc.length <= 160) {
      auditResults.push({
        name: 'Meta Description',
        status: 'pass',
        message: `Good description length: ${metaDesc.length} characters`,
        priority: 'high'
      });
    } else {
      auditResults.push({
        name: 'Meta Description',
        status: metaDesc ? 'warn' : 'fail',
        message: metaDesc ? `Description length: ${metaDesc.length} chars (optimal: 120-160)` : 'Missing meta description',
        priority: 'high'
      });
    }

    // Check H1 tags
    const h1Tags = document.querySelectorAll('h1');
    if (h1Tags.length === 1) {
      auditResults.push({
        name: 'H1 Tag',
        status: 'pass',
        message: 'Exactly one H1 tag found',
        priority: 'high'
      });
    } else {
      auditResults.push({
        name: 'H1 Tag',
        status: h1Tags.length === 0 ? 'fail' : 'warn',
        message: `Found ${h1Tags.length} H1 tags (optimal: 1)`,
        priority: 'high'
      });
    }

    // Check for structured data
    const structuredData = document.querySelectorAll('script[type="application/ld+json"]');
    auditResults.push({
      name: 'Structured Data',
      status: structuredData.length > 0 ? 'pass' : 'fail',
      message: `Found ${structuredData.length} structured data scripts`,
      priority: 'medium'
    });

    // Check for Open Graph tags
    const ogTags = document.querySelectorAll('meta[property^="og:"]');
    auditResults.push({
      name: 'Open Graph Tags',
      status: ogTags.length >= 4 ? 'pass' : 'warn',
      message: `Found ${ogTags.length} Open Graph tags`,
      priority: 'medium'
    });

    // Check for Twitter Card tags
    const twitterTags = document.querySelectorAll('meta[name^="twitter:"]');
    auditResults.push({
      name: 'Twitter Cards',
      status: twitterTags.length >= 3 ? 'pass' : 'warn',
      message: `Found ${twitterTags.length} Twitter Card tags`,
      priority: 'medium'
    });

    // Check for canonical URL
    const canonical = document.querySelector('link[rel="canonical"]');
    auditResults.push({
      name: 'Canonical URL',
      status: canonical ? 'pass' : 'warn',
      message: canonical ? 'Canonical URL found' : 'Missing canonical URL',
      priority: 'medium'
    });

    // Check for sitemap
    const sitemap = document.querySelector('link[rel="sitemap"]');
    auditResults.push({
      name: 'Sitemap',
      status: sitemap ? 'pass' : 'warn',
      message: sitemap ? 'Sitemap linked' : 'Sitemap not linked in head',
      priority: 'low'
    });

    // Check for robots meta
    const robots = document.querySelector('meta[name="robots"]');
    auditResults.push({
      name: 'Robots Meta',
      status: robots ? 'pass' : 'warn',
      message: robots ? `Robots directive: ${robots.getAttribute('content')}` : 'Missing robots meta tag',
      priority: 'medium'
    });

    // Check image alt tags
    const images = document.querySelectorAll('img');
    const imagesWithoutAlt = Array.from(images).filter(img => !img.getAttribute('alt'));
    auditResults.push({
      name: 'Image Alt Tags',
      status: imagesWithoutAlt.length === 0 ? 'pass' : 'warn',
      message: `${images.length - imagesWithoutAlt.length}/${images.length} images have alt tags`,
      priority: 'medium'
    });

    // Check for HTTPS
    auditResults.push({
      name: 'HTTPS',
      status: location.protocol === 'https:' ? 'pass' : 'fail',
      message: location.protocol === 'https:' ? 'Site uses HTTPS' : 'Site should use HTTPS',
      priority: 'high'
    });

    // Check mobile viewport
    const viewport = document.querySelector('meta[name="viewport"]');
    auditResults.push({
      name: 'Mobile Viewport',
      status: viewport ? 'pass' : 'fail',
      message: viewport ? 'Viewport meta tag found' : 'Missing viewport meta tag',
      priority: 'high'
    });

    // Calculate score
    const passCount = auditResults.filter(r => r.status === 'pass').length;
    const totalCount = auditResults.length;
    const calculatedScore = Math.round((passCount / totalCount) * 100);

    setMetrics(auditResults);
    setScore(calculatedScore);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pass': return 'bg-green-100 text-green-800 border-green-200';
      case 'warn': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'fail': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-50 border-red-200';
      case 'medium': return 'bg-yellow-50 border-yellow-200';
      case 'low': return 'bg-green-50 border-green-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="sticky top-0 bg-background border-b p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">SEO Audit Report</h2>
            <p className="text-muted-foreground">Your website's search engine optimization analysis</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className={`text-3xl font-bold ${score >= 80 ? 'text-green-600' : score >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                {score}%
              </div>
              <p className="text-sm text-muted-foreground">SEO Score</p>
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
            >
              Close
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Summary */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-green-700">Passed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {metrics.filter(m => m.status === 'pass').length}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-yellow-700">Warnings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">
                  {metrics.filter(m => m.status === 'warn').length}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-red-700">Failed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {metrics.filter(m => m.status === 'fail').length}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Results */}
          <Card>
            <CardHeader>
              <CardTitle>Detailed Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {metrics.map((metric, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border ${getPriorityColor(metric.priority)}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="font-medium">{metric.name}</h4>
                          <Badge className={`text-xs ${getStatusColor(metric.status)}`}>
                            {metric.status.toUpperCase()}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {metric.priority.toUpperCase()} PRIORITY
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{metric.message}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>SEO Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900">Next Steps for Better Rankings:</h4>
                  <ul className="mt-2 space-y-1 text-blue-800 list-disc list-inside">
                    <li>Submit your sitemap to Google Search Console</li>
                    <li>Set up Google Analytics for traffic monitoring</li>
                    <li>Create high-quality content regularly</li>
                    <li>Build backlinks from reputable websites</li>
                    <li>Monitor your site's performance weekly</li>
                  </ul>
                </div>
                
                <div className="p-3 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-900">Search Console Setup:</h4>
                  <p className="text-green-800 mt-1">
                    Add your site to Google Search Console and submit your sitemap URL: 
                    <code className="bg-white px-2 py-1 rounded ml-2">https://www.hermankwayu.com/sitemap.xml</code>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}