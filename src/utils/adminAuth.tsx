/**
 * Secure Admin Authentication Utilities
 * Provides session management and secure API communication
 */

import { projectId, publicAnonKey } from './supabase/info';

// Session constants
const SESSION_KEY = 'admin_session_token';
const SESSION_EXPIRY_KEY = 'admin_session_expiry';
const ADMIN_TOKEN = 'herman_admin_2024_secure_token';

// Session management utilities
export const adminAuth = {
  // Check if current session is valid
  isSessionValid(): boolean {
    try {
      const token = sessionStorage.getItem(SESSION_KEY);
      const expiry = sessionStorage.getItem(SESSION_EXPIRY_KEY);
      
      if (!token || !expiry) return false;
      
      const expiryTime = parseInt(expiry);
      const isValid = Date.now() < expiryTime && token === ADMIN_TOKEN;
      
      if (!isValid) {
        this.clearSession();
      }
      
      return isValid;
    } catch (error) {
      console.error('Session validation error:', error);
      return false;
    }
  },

  // Set secure session
  setSession(token: string): void {
    try {
      if (token !== ADMIN_TOKEN) {
        throw new Error('Invalid token format');
      }
      
      const expiryTime = Date.now() + (4 * 60 * 60 * 1000); // 4 hours
      sessionStorage.setItem(SESSION_KEY, token);
      sessionStorage.setItem(SESSION_EXPIRY_KEY, expiryTime.toString());
      
      console.log('🔐 Admin session established (expires in 4 hours)');
    } catch (error) {
      console.error('Session creation error:', error);
      this.clearSession();
    }
  },

  // Clear session data
  clearSession(): void {
    try {
      sessionStorage.removeItem(SESSION_KEY);
      sessionStorage.removeItem(SESSION_EXPIRY_KEY);
      console.log('🔓 Admin session cleared');
    } catch (error) {
      console.error('Session clearing error:', error);
    }
  },

  // Get session token for API calls
  getToken(): string | null {
    try {
      if (!this.isSessionValid()) return null;
      return sessionStorage.getItem(SESSION_KEY);
    } catch (error) {
      console.error('Token retrieval error:', error);
      return null;
    }
  },

  // Get session expiry time
  getSessionExpiry(): Date | null {
    try {
      const expiry = sessionStorage.getItem(SESSION_EXPIRY_KEY);
      return expiry ? new Date(parseInt(expiry)) : null;
    } catch (error) {
      console.error('Expiry retrieval error:', error);
      return null;
    }
  },

  // Check if session expires soon (within 30 minutes)
  isSessionExpiringSoon(): boolean {
    try {
      const expiry = this.getSessionExpiry();
      if (!expiry) return true;
      
      const thirtyMinutes = 30 * 60 * 1000;
      return (expiry.getTime() - Date.now()) < thirtyMinutes;
    } catch (error) {
      console.error('Session expiry check error:', error);
      return true;
    }
  }
};

// Secure API utilities for admin calls
export const adminAPI = {
  // Make authenticated API call
  async request(endpoint: string, options: RequestInit = {}): Promise<Response> {
    const token = adminAuth.getToken();
    
    if (!token) {
      throw new Error('No valid admin session. Please login again.');
    }

    const headers = {
      'Authorization': `Bearer ${publicAnonKey}`,
      'X-Admin-Token': token,
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const url = `https://${projectId}.supabase.co/functions/v1/make-server-4d80a1b0${endpoint}`;
    
    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      // Handle unauthorized responses
      if (response.status === 401) {
        adminAuth.clearSession();
        throw new Error('Session expired. Please login again.');
      }

      return response;
    } catch (error) {
      if (error instanceof Error && error.message.includes('Session expired')) {
        throw error;
      }
      
      console.error('Admin API request failed:', error);
      throw new Error('Network error. Please check your connection.');
    }
  },

  // Get admin dashboard data
  async getDashboardData(): Promise<any> {
    try {
      const response = await this.request('/admin/dashboard-data');
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch dashboard data');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Dashboard data fetch error:', error);
      throw error;
    }
  },

  // Get subscribers
  async getSubscribers(): Promise<any> {
    try {
      const response = await this.request('/subscribers');
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch subscribers');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Subscribers fetch error:', error);
      throw error;
    }
  },

  // Send newsletter
  async sendNewsletter(data: { subject: string; content: string; previewText?: string }): Promise<any> {
    try {
      const response = await this.request('/send-newsletter', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send newsletter');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Newsletter send error:', error);
      throw error;
    }
  },

  // Get newsletter history
  async getNewsletters(): Promise<any> {
    try {
      const response = await this.request('/newsletters');
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch newsletters');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Newsletters fetch error:', error);
      throw error;
    }
  },

  // Test connection
  async testConnection(): Promise<boolean> {
    try {
      const response = await this.request('/admin/health');
      const data = await response.json();
      return response.ok && data.authorized;
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  }
};

// Authentication helper for login
export const adminLogin = {
  async authenticate(password: string): Promise<{ success: boolean; token?: string; error?: string }> {
    try {
      const url = `https://${projectId}.supabase.co/functions/v1/make-server-4d80a1b0/admin/authenticate`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: password.trim() })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        adminAuth.setSession(data.token);
        return { success: true, token: data.token };
      } else {
        return { success: false, error: data.error || 'Authentication failed' };
      }
    } catch (error) {
      console.error('Authentication error:', error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  }
};

// Export all utilities
export default {
  auth: adminAuth,
  api: adminAPI,
  login: adminLogin
};