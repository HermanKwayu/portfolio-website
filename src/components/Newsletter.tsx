import { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { projectId, publicAnonKey } from '../utils/supabase/info';

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{type: 'success' | 'error', message: string} | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-4d80a1b0/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({ email: email.trim() })
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitStatus({
          type: 'success',
          message: 'Thank you for subscribing! You\'ll receive insights on business strategy and digital transformation.'
        });
        setEmail('');
      } else {
        setSubmitStatus({
          type: 'error',
          message: result.error || 'Failed to subscribe. Please try again.'
        });
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      setSubmitStatus({
        type: 'error',
        message: 'Failed to subscribe. Please check your connection and try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-20 bg-primary text-primary-foreground">
      <div className="container mx-auto px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Stay Ahead of the Curve
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-8">
            Get exclusive insights on business strategy, digital transformation, 
            and project management best practices delivered to your inbox.
          </p>

          <Card className="bg-primary-foreground/5 border-primary-foreground/20">
            <CardContent className="p-8">
              <div className="flex flex-col space-y-4">
                <h3 className="text-xl font-semibold">Subscribe to My Newsletter</h3>
                <p className="text-primary-foreground/80 text-sm">
                  Join 500+ professionals receiving weekly insights on:
                </p>
                
                <div className="grid md:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-primary-foreground rounded-full"></div>
                    <span>Project management trends</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-primary-foreground rounded-full"></div>
                    <span>Digital transformation strategies</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-primary-foreground rounded-full"></div>
                    <span>Compliance best practices</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-primary-foreground rounded-full"></div>
                    <span>Industry case studies</span>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="flex-1 bg-background text-foreground border-primary-foreground/20"
                    />
                    <Button
                      type="submit"
                      variant="secondary"
                      disabled={isSubmitting}
                      className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                          <span>Subscribing...</span>
                        </div>
                      ) : (
                        'Subscribe'
                      )}
                    </Button>
                  </div>

                  {submitStatus && (
                    <div className={`p-3 rounded-lg text-sm ${
                      submitStatus.type === 'success' 
                        ? 'bg-green-500/20 text-green-100 border border-green-500/30' 
                        : 'bg-red-500/20 text-red-100 border border-red-500/30'
                    }`}>
                      {submitStatus.message}
                    </div>
                  )}
                </form>

                <p className="text-xs text-primary-foreground/60">
                  No spam, ever. Unsubscribe anytime with one click.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}