/**
 * Production Logger - Smart logging utility for development and production
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  data?: any;
  timestamp: string;
}

class ProductionLogger {
  private isDevelopment: boolean;
  private logs: LogEntry[] = [];
  private maxLogs = 100;

  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';
  }

  private createLogEntry(level: LogLevel, message: string, data?: any): LogEntry {
    return {
      level,
      message,
      data,
      timestamp: new Date().toISOString()
    };
  }

  private shouldLog(level: LogLevel): boolean {
    if (this.isDevelopment) return true;
    
    // In production, only log warnings and errors
    return level === 'warn' || level === 'error';
  }

  private addToBuffer(entry: LogEntry) {
    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }
  }

  debug(message: string, data?: any) {
    const entry = this.createLogEntry('debug', message, data);
    this.addToBuffer(entry);
    
    if (this.shouldLog('debug')) {
      console.log(`🔍 ${message}`, data || '');
    }
  }

  info(message: string, data?: any) {
    const entry = this.createLogEntry('info', message, data);
    this.addToBuffer(entry);
    
    if (this.shouldLog('info')) {
      console.log(`ℹ️ ${message}`, data || '');
    }
  }

  warn(message: string, data?: any) {
    const entry = this.createLogEntry('warn', message, data);
    this.addToBuffer(entry);
    
    if (this.shouldLog('warn')) {
      console.warn(`⚠️ ${message}`, data || '');
    }
  }

  error(message: string, data?: any) {
    const entry = this.createLogEntry('error', message, data);
    this.addToBuffer(entry);
    
    if (this.shouldLog('error')) {
      console.error(`🚨 ${message}`, data || '');
    }
  }

  // Production-specific methods
  performance(operation: string, duration: number) {
    if (duration > 1000) {
      this.warn(`Slow operation: ${operation} took ${duration}ms`);
    } else if (this.isDevelopment) {
      this.debug(`Performance: ${operation} completed in ${duration}ms`);
    }
  }

  apiCall(url: string, status: number, duration: number) {
    if (status >= 400) {
      this.error(`API call failed: ${status} ${url} (${duration}ms)`);
    } else if (duration > 2000) {
      this.warn(`Slow API call: ${url} took ${duration}ms`);
    } else if (this.isDevelopment) {
      this.debug(`API call: ${status} ${url} (${duration}ms)`);
    }
  }

  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  clearLogs() {
    this.logs = [];
  }
}

// Create singleton instance
export const logger = new ProductionLogger();

// React component for development log viewer
export function LogViewer() {
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return null; // Can be extended to show logs in dev mode
}