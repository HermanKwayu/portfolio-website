/**
 * NetworkBlocker - Prevents ALL analytics network requests in development
 * 
 * This component completely blocks any network requests that could be related to analytics
 * by intercepting them at the window.fetch level in development mode
 */

export function NetworkBlocker() {
  if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
    // Only set up once
    if (!(window as any).__analytics_blocked) {
      const originalFetch = window.fetch;
      
      window.fetch = async function(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
        // Convert input to string to check URL
        const url = typeof input === 'string' ? input : input.toString();
        
        // Block any URL that contains analytics endpoints
        if (url.includes('/analytics') || 
            url.includes('analytics') ||
            url.includes('tracking') ||
            url.includes('events')) {
          
          console.log(`🚫 NetworkBlocker: Blocked analytics request to ${url}`);
          
          // Return a fake successful response to prevent errors
          return Promise.resolve(new Response(
            JSON.stringify({ success: true, message: 'Blocked in development' }),
            {
              status: 200,
              statusText: 'OK',
              headers: { 'Content-Type': 'application/json' }
            }
          ));
        }
        
        // Allow all other requests to proceed normally
        return originalFetch.call(this, input, init);
      };
      
      (window as any).__analytics_blocked = true;
      console.log('🚫 NetworkBlocker: Analytics network requests blocked in development');
    }
  }
  
  return null;
}