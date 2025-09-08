import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";

interface PerformanceMetric {
  timestamp: number;
  endpoint: string;
  duration: number;
  cacheStatus: 'HIT' | 'MISS' | 'STALE' | 'ERROR-FALLBACK';
  success: boolean;
}

interface AdminPerformanceMonitorProps {
  isVisible: boolean;
}

export function AdminPerformanceMonitor({ isVisible }: AdminPerformanceMonitorProps) {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [stats, setStats] = useState({
    avgResponseTime: 0,
    cacheHitRate: 0,
    successRate: 0,
    totalRequests: 0,
    slowRequests: 0
  });

  useEffect(() => {
    if (!isVisible) return;

    // Mock some initial metrics for demonstration
    const mockMetrics: PerformanceMetric[] = [
      { timestamp: Date.now() - 30000, endpoint: '/dashboard-data', duration: 250, cacheStatus: 'MISS', success: true },
      { timestamp: Date.now() - 25000, endpoint: '/subscribers', duration: 150, cacheStatus: 'HIT', success: true },
      { timestamp: Date.now() - 20000, endpoint: '/contacts', duration: 300, cacheStatus: 'MISS', success: true },
      { timestamp: Date.now() - 15000, endpoint: '/newsletters', duration: 100, cacheStatus: 'HIT', success: true },
      { timestamp: Date.now() - 10000, endpoint: '/dashboard-data', duration: 180, cacheStatus: 'HIT', success: true }
    ];

    setMetrics(mockMetrics);

    // Calculate stats
    const totalRequests = mockMetrics.length;
    const successfulRequests = mockMetrics.filter(m => m.success).length;
    const cacheHits = mockMetrics.filter(m => m.cacheStatus === 'HIT').length;
    const slowRequests = mockMetrics.filter(m => m.duration > 1000).length;
    const avgDuration = mockMetrics.reduce((sum, m) => sum + m.duration, 0) / totalRequests;

    setStats({
      avgResponseTime: Math.round(avgDuration),
      cacheHitRate: Math.round((cacheHits / totalRequests) * 100),
      successRate: Math.round((successfulRequests / totalRequests) * 100),
      totalRequests,
      slowRequests
    });

    // Listen for real performance data from fetch operations
    const handlePerformanceUpdate = (event: CustomEvent) => {
      const newMetric: PerformanceMetric = event.detail;
      setMetrics(prev => {
        const updated = [...prev, newMetric].slice(-20); // Keep last 20 metrics
        return updated;
      });
    };

    window.addEventListener('admin-performance-update', handlePerformanceUpdate as EventListener);

    return () => {
      window.removeEventListener('admin-performance-update', handlePerformanceUpdate as EventListener);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  const getCacheStatusColor = (status: PerformanceMetric['cacheStatus']) => {
    switch (status) {
      case 'HIT': return 'bg-green-100 text-green-800';
      case 'MISS': return 'bg-yellow-100 text-yellow-800';
      case 'STALE': return 'bg-orange-100 text-orange-800';
      case 'ERROR-FALLBACK': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDurationColor = (duration: number) => {
    if (duration < 200) return 'text-green-600';
    if (duration < 500) return 'text-yellow-600';
    if (duration < 1000) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Performance Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.avgResponseTime}ms</div>
              <div className="text-sm text-muted-foreground">Avg Response</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.cacheHitRate}%</div>
              <div className="text-sm text-muted-foreground">Cache Hit Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-600">{stats.successRate}%</div>
              <div className="text-sm text-muted-foreground">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.totalRequests}</div>
              <div className="text-sm text-muted-foreground">Total Requests</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{stats.slowRequests}</div>
              <div className="text-sm text-muted-foreground">Slow Requests</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {metrics.slice().reverse().map((metric, index) => (
              <div key={index} className="flex items-center justify-between p-2 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Badge className={getCacheStatusColor(metric.cacheStatus)}>
                    {metric.cacheStatus}
                  </Badge>
                  <span className="font-medium">{metric.endpoint}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`font-medium ${getDurationColor(metric.duration)}`}>
                    {metric.duration}ms
                  </span>
                  <Badge variant={metric.success ? "default" : "destructive"}>
                    {metric.success ? "✓" : "✗"}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {new Date(metric.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
            {metrics.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                No performance data available yet
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Performance Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Cache hit rate above 70% indicates good performance</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span>Response times under 500ms provide the best user experience</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Batch endpoints reduce total request count and improve performance</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>Background refresh keeps data current without user-facing delays</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}