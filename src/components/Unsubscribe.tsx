import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { projectId, publicAnonKey } from '../utils/supabase/info';

export function Unsubscribe() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{type: 'success' | 'error', message: string} | null>(null);
  const [autoEmail, setAutoEmail] = useState('');

  useEffect(() => {
    // Check if email is provided in URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const emailParam = urlParams.get('email');
    const newsletterId = urlParams.get('id');
    const unsubscribeParam = urlParams.get('unsubscribe');
    const pathname = window.location.pathname;
    
    if (emailParam) {
      setEmail(emailParam);
      setAutoEmail(emailParam);
      
      // Auto-unsubscribe if:
      // 1. It's a new format link with unsubscribe=true
      // 2. OR it's an old format link from /unsubscribe path with newsletter ID
      const shouldAutoUnsubscribe = (unsubscribeParam === 'true') || 
                                   (pathname.includes('unsubscribe') && newsletterId);
      
      if (shouldAutoUnsubscribe) {
        handleDirectUnsubscribe(emailParam);
      }
    }
  }, [projectId, publicAnonKey]);

  const handleDirectUnsubscribe = async (emailToUnsubscribe: string) => {
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-4d80a1b0/unsubscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({ email: emailToUnsubscribe.trim().toLowerCase() })
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitStatus({
          type: 'success',
          message: result.message || 'You have been successfully unsubscribed from the newsletter.'
        });
      } else {
        setSubmitStatus({
          type: 'error',
          message: result.error || 'Failed to unsubscribe. Please try the manual form below.'
        });
      }
    } catch (error) {
      console.error('Direct unsubscribe error:', error);
      setSubmitStatus({
        type: 'error',
        message: 'Failed to automatically unsubscribe. Please use the form below.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUnsubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-4d80a1b0/unsubscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({ email: email.trim().toLowerCase() })
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitStatus({
          type: 'success',
          message: 'You have been successfully unsubscribed from the newsletter. Sorry to see you go!'
        });
      } else {
        setSubmitStatus({
          type: 'error',
          message: result.error || 'Failed to unsubscribe. Please try again or contact support.'
        });
      }
    } catch (error) {
      console.error('Unsubscribe error:', error);
      setSubmitStatus({
        type: 'error',
        message: 'Failed to unsubscribe. Please check your connection and try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 flex items-center justify-center p-6">
      <Card className="w-full max-w-md border-border/50 shadow-xl bg-card/80 backdrop-blur-sm">
        <CardHeader className="text-center pb-6">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 7.89a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <CardTitle className="text-2xl text-foreground">Unsubscribe from Newsletter</CardTitle>
          <p className="text-muted-foreground mt-2">
            We're sorry to see you go. You can unsubscribe from Herman Kwayu's newsletter below.
          </p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleUnsubscribe} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground font-medium">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="bg-input-background border-border/50 focus:border-primary transition-colors"
                disabled={!!autoEmail}
              />
              {autoEmail && !submitStatus && (
                <p className="text-xs text-muted-foreground">
                  Email automatically detected from unsubscribe link. Processing...
                </p>
              )}
              {autoEmail && submitStatus?.type === 'success' && (
                <p className="text-xs text-green-600">
                  Automatically processed from email link.
                </p>
              )}
            </div>

            {submitStatus && (
              <div className={`p-4 rounded-xl border ${
                submitStatus.type === 'success' 
                  ? 'bg-green-50 text-green-800 border-green-200' 
                  : 'bg-red-50 text-red-800 border-red-200'
              }`}>
                {submitStatus.message}
              </div>
            )}

            <div className="space-y-3">
              {!(submitStatus?.type === 'success' && autoEmail) && (
                <Button 
                  type="submit" 
                  className="w-full bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                      <span>Unsubscribing...</span>
                    </div>
                  ) : (
                    'Unsubscribe from Newsletter'
                  )}
                </Button>
              )}

              <Button 
                type="button" 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  // Clean URL and go to home
                  window.history.replaceState({}, document.title, '/');
                  window.location.reload();
                }}
              >
                Return to Website
              </Button>
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-border/50 text-center">
            <p className="text-sm text-muted-foreground mb-3">
              Before you go, would you like to:
            </p>
            <div className="space-y-2">
              <Button 
                variant="ghost" 
                size="sm"
                className="w-full text-primary hover:bg-primary/10"
                onClick={() => window.open('https://www.linkedin.com/in/herman-kwayu-044733135', '_blank')}
              >
                Connect on LinkedIn instead
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                className="w-full text-primary hover:bg-primary/10"
                onClick={() => {
                  window.history.replaceState({}, document.title, '/#contact');
                  window.location.reload();
                }}
              >
                Get in touch directly
              </Button>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs text-muted-foreground">
              If you're having trouble unsubscribing, please contact{' '}
              <a href="mailto:truthherman@gmail.com" className="text-primary hover:underline">
                truthherman@gmail.com
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}