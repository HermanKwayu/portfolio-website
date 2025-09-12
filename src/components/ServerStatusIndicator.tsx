import React, { useState, useEffect } from 'react';
import { Badge } from "./ui/badge";
import { API_CONFIG } from '../utils/api';
import { Wifi, WifiOff, AlertCircle } from 'lucide-react';

export function ServerStatusIndicator() {
  const [status, setStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [lastCheck, setLastCheck] = useState<number>(0);

  const checkServerStatus = async () => {
    try {
      const response = await fetch(`${API_CONFIG.baseUrl}/health`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${API_CONFIG.publicAnonKey}`,
        },
        signal: AbortSignal.timeout(3000), // 3 second timeout
      });

      if (response.ok) {
        setStatus('online');
        console.log('✅ Server status: Online');
      } else {
        setStatus('offline');
        console.log('❌ Server status: Offline');
      }
    } catch (error) {
      setStatus('offline');
      console.log('❌ Server status check failed:', error);
    } finally {
      setLastCheck(Date.now());
    }
  };

  // Check status on mount and every 30 seconds
  useEffect(() => {
    checkServerStatus();
    const interval = setInterval(checkServerStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = () => {
    switch (status) {
      case 'online':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'offline':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'online':
        return <Wifi className="w-3 h-3" />;
      case 'offline':
        return <WifiOff className="w-3 h-3" />;
      default:
        return <AlertCircle className="w-3 h-3" />;
    }
  };

  return (
    <div className="fixed top-4 left-4 z-50">
      <Badge 
        className={`flex items-center space-x-1 px-2 py-1 ${getStatusColor()}`}
        onClick={checkServerStatus}
        style={{ cursor: 'pointer' }}
      >
        {getStatusIcon()}
        <span className="text-xs">
          API: {status.toUpperCase()}
        </span>
      </Badge>
    </div>
  );
}