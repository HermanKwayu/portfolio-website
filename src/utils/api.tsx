/**
 * Production API Configuration
 * Centralized API configuration to ensure all calls go to production
 * 🚀 ALL APIS ARE HARDCODED TO PRODUCTION - NO ENVIRONMENT SWITCHING
 */

// Production configuration - ALWAYS use production URLs (no env switching)
const PRODUCTION_PROJECT_ID = "ugyhqxxevikymkhmaqir";
const PRODUCTION_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVneWhxeHhldmlreW1raG1hcWlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2MjMyODgsImV4cCI6MjA3MjE5OTI4OH0.lxYDtyqYPbaAreFP_niJyoxhRaAjeXjcVDwCEEKKJUA";

// PRODUCTION ONLY - All API calls will use these production endpoints
export const API_CONFIG = {
  projectId: PRODUCTION_PROJECT_ID,
  publicAnonKey: PRODUCTION_ANON_KEY,
  baseUrl: `https://${PRODUCTION_PROJECT_ID}.supabase.co/functions/v1/make-server-4d80a1b0`,
  supabaseUrl: `https://${PRODUCTION_PROJECT_ID}.supabase.co`,
};

// API helper functions
export const getApiUrl = (endpoint: string) => {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  return `${API_CONFIG.baseUrl}/${cleanEndpoint}`;
};

export const getApiHeaders = (includeAdminToken: boolean = false) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${API_CONFIG.publicAnonKey}`,
  };

  if (includeAdminToken) {
    const adminToken = localStorage.getItem('admin_token');
    if (adminToken) {
      headers['X-Admin-Token'] = adminToken;
    }
  }

  return headers;
};

// Make API request with proper error handling
export const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = getApiUrl(endpoint);
  
  console.log(`🚀 PRODUCTION API call: ${url}`);
  console.log(`🔧 Request options:`, {
    method: options.method || 'GET',
    hasBody: !!options.body,
    headers: Object.keys(options.headers || {}),
  });
  
  const defaultOptions: RequestInit = {
    headers: getApiHeaders(true),
    ...options,
  };

  try {
    const response = await fetch(url, defaultOptions);
    
    console.log(`📡 Response status: ${response.status} ${response.statusText}`);
    
    if (!response.ok) {
      let errorText = '';
      let errorData = null;
      
      try {
        // Try to parse as JSON first
        errorData = await response.json();
        errorText = errorData.error || errorData.message || `HTTP ${response.status}`;
      } catch {
        // Fall back to text
        errorText = await response.text() || `HTTP ${response.status}`;
      }
      
      console.error(`❌ API Error: ${response.status} - ${errorText}`);
      
      const apiError = new Error(`API request failed: ${response.status} - ${errorText}`);
      (apiError as any).status = response.status;
      (apiError as any).data = errorData;
      throw apiError;
    }

    const result = await response.json();
    console.log(`✅ API Success:`, {
      endpoint,
      status: response.status,
      dataKeys: Object.keys(result),
    });
    
    return result;
  } catch (error: any) {
    console.error(`❌ API request failed for ${endpoint}:`, {
      message: error.message,
      status: error.status,
      name: error.name,
    });
    throw error;
  }
};

// Specialized API functions
export const adminApiRequest = async (endpoint: string, options: RequestInit = {}) => {
  return apiRequest(endpoint, {
    ...options,
    headers: {
      ...getApiHeaders(true),
      ...(options.headers || {}),
    },
  });
};

export const publicApiRequest = async (endpoint: string, options: RequestInit = {}) => {
  return apiRequest(endpoint, {
    ...options,
    headers: {
      ...getApiHeaders(false),
      ...(options.headers || {}),
    },
  });
};

// Legacy exports for backward compatibility
export const projectId = API_CONFIG.projectId;
export const publicAnonKey = API_CONFIG.publicAnonKey;