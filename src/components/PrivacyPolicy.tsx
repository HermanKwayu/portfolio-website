import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Separator } from "./ui/separator";
import { Shield, Lock, Eye, Heart, CheckCircle2, Mail, Users, Globe } from "lucide-react";

interface PrivacyPolicyProps {
  onBack?: () => void;
}

export function PrivacyPolicy({ onBack }: PrivacyPolicyProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground py-8">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <div>
                <span className="font-medium text-xl">Herman Kwayu</span>
                <p className="text-primary-foreground/80 text-sm">Privacy Policy</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onBack}
              className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10"
            >
              ← Back to Home
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/5 to-background py-12">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center space-x-2 mb-6">
              <Heart className="w-8 h-8 text-primary" />
              <h1 className="text-4xl font-bold text-foreground">Your Privacy Matters</h1>
            </div>
            <p className="text-xl text-muted-foreground mb-4">
              We believe in being transparent about how we collect, use, and protect your information. 
              This policy explains everything in simple, clear terms.
            </p>
            <div className="inline-flex items-center space-x-2 bg-primary/10 px-4 py-2 rounded-full">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-medium">Last updated: January 10, 2025</span>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Summary */}
      <section className="py-8 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-semibold text-center mb-8 flex items-center justify-center space-x-2">
              <Eye className="w-6 h-6 text-primary" />
              <span>Privacy at a Glance</span>
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="border-primary/20">
                <CardContent className="p-6 text-center">
                  <Lock className="w-8 h-8 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">We Keep It Secure</h3>
                  <p className="text-sm text-muted-foreground">Your data is encrypted and protected with industry-standard security measures.</p>
                </CardContent>
              </Card>
              <Card className="border-primary/20">
                <CardContent className="p-6 text-center">
                  <Users className="w-8 h-8 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">No Selling Data</h3>
                  <p className="text-sm text-muted-foreground">We never sell your personal information to third parties. Ever.</p>
                </CardContent>
              </Card>
              <Card className="border-primary/20">
                <CardContent className="p-6 text-center">
                  <Globe className="w-8 h-8 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">You Have Control</h3>
                  <p className="text-sm text-muted-foreground">Access, update, or delete your information anytime. It's your data.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <Card className="mb-8">
            <CardContent className="p-8">
              <div className="space-y-12">
                <section>
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-primary font-bold text-sm">1</span>
                    </div>
                    <h2 className="text-2xl font-semibold text-foreground">What Information Do We Collect?</h2>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="bg-muted/50 p-6 rounded-lg">
                      <h3 className="text-lg font-medium text-foreground mb-3 flex items-center space-x-2">
                        <Mail className="w-5 h-5 text-primary" />
                        <span>Information You Share With Us</span>
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        We only collect information when you choose to share it with us, such as when you:
                      </p>
                      <ul className="space-y-2 text-muted-foreground">
                        <li className="flex items-start space-x-2">
                          <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                          <span>Send us a message through our contact form</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                          <span>Subscribe to our newsletter for business insights</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                          <span>Use our free Resume Builder tool</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                          <span>Request information about our consulting services</span>
                        </li>
                      </ul>
                      <p className="text-sm text-muted-foreground mt-4 italic">
                        This typically includes your name, email address, phone number (if provided), and any messages you send us.
                      </p>
                    </div>

                    <div className="bg-accent/50 p-6 rounded-lg">
                      <h3 className="text-lg font-medium text-foreground mb-3">Technical Information (Automatically Collected)</h3>
                      <p className="text-muted-foreground mb-4">
                        Like most websites, we automatically collect some technical information to improve your experience:
                      </p>
                      <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                        <div>
                          <strong>Basic Device Info:</strong>
                          <ul className="list-disc pl-4 mt-1 space-y-1">
                            <li>Browser type (Chrome, Safari, etc.)</li>
                            <li>Operating system</li>
                          </ul>
                        </div>
                        <div>
                          <strong>Usage Information:</strong>
                          <ul className="list-disc pl-4 mt-1 space-y-1">
                            <li>Pages you visit</li>
                            <li>How long you stay</li>
                            <li>General location (country/city)</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                <Separator />

                <section>
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-primary font-bold text-sm">2</span>
                    </div>
                    <h2 className="text-2xl font-semibold text-foreground">How Do We Use Your Information?</h2>
                  </div>
                  
                  <div className="bg-gradient-to-r from-primary/5 to-accent/5 p-6 rounded-lg">
                    <p className="text-foreground font-medium mb-4">We use your information to provide and improve our services:</p>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-foreground mb-2">Direct Communication</h4>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                          <li>• Respond to your questions and inquiries</li>
                          <li>• Provide consulting services you requested</li>
                          <li>• Send helpful business insights (with your permission)</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground mb-2">Service Improvement</h4>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                          <li>• Make our website faster and more user-friendly</li>
                          <li>• Understand which content is most helpful</li>
                          <li>• Ensure website security and prevent fraud</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </section>

                <Separator />

                <section>
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-primary font-bold text-sm">3</span>
                    </div>
                    <h2 className="text-2xl font-semibold text-foreground">Do We Share Your Information?</h2>
                  </div>
                  
                  <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 p-6 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <Shield className="w-6 h-6 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-green-800 dark:text-green-400 mb-2">Simple Answer: We Don't Sell Your Data</h3>
                        <p className="text-green-700 dark:text-green-300 mb-4">
                          We never sell, trade, or rent your personal information to third parties for marketing purposes.
                        </p>
                        <h4 className="font-medium text-green-800 dark:text-green-400 mb-2">We Only Share Information When:</h4>
                        <ul className="space-y-2 text-sm text-green-700 dark:text-green-300">
                          <li className="flex items-start space-x-2">
                            <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span><strong>You ask us to</strong> (like when you request a consultation)</span>
                          </li>
                          <li className="flex items-start space-x-2">
                            <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span><strong>Legal requirements</strong> demand it (very rare)</span>
                          </li>
                          <li className="flex items-start space-x-2">
                            <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span><strong>Trusted service providers</strong> help us run our website (like email services)</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </section>

                <Separator />

                <section>
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-primary font-bold text-sm">4</span>
                    </div>
                    <h2 className="text-2xl font-semibold text-foreground">How Do We Protect Your Information?</h2>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-6">
                      <Card className="border-primary/20">
                        <CardContent className="p-4">
                          <Lock className="w-6 h-6 text-primary mb-2" />
                          <h4 className="font-medium mb-2">Encryption</h4>
                          <p className="text-sm text-muted-foreground">All data is encrypted when stored and transmitted</p>
                        </CardContent>
                      </Card>
                      <Card className="border-primary/20">
                        <CardContent className="p-4">
                          <Shield className="w-6 h-6 text-primary mb-2" />
                          <h4 className="font-medium mb-2">Secure Hosting</h4>
                          <p className="text-sm text-muted-foreground">We use trusted, security-focused hosting providers</p>
                        </CardContent>
                      </Card>
                    </div>
                    <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 p-4 rounded-lg">
                      <p className="text-sm text-amber-800 dark:text-amber-300">
                        <strong>Important:</strong> While we use industry-standard security measures, no internet transmission is 100% secure. We continuously monitor and update our security practices.
                      </p>
                    </div>
                  </div>
                </section>

                <Separator />

                <section>
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-primary font-bold text-sm">5</span>
                    </div>
                    <h2 className="text-2xl font-semibold text-foreground">Your Privacy Rights</h2>
                  </div>
                  
                  <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 p-6 rounded-lg">
                    <h3 className="font-semibold text-blue-800 dark:text-blue-400 mb-4">You're in Control of Your Data</h3>
                    <div className="grid md:grid-cols-2 gap-6 text-sm text-blue-700 dark:text-blue-300">
                      <div>
                        <h4 className="font-medium mb-2">What You Can Do:</h4>
                        <ul className="space-y-1">
                          <li>• View what information we have about you</li>
                          <li>• Update or correct your information</li>
                          <li>• Delete your information entirely</li>
                          <li>• Unsubscribe from our newsletter anytime</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">How to Exercise Your Rights:</h4>
                        <p className="mb-2">Simply send us an email at:</p>
                        <a href="mailto:truthherman@gmail.com" className="text-primary hover:underline font-medium">
                          truthherman@gmail.com
                        </a>
                        <p className="mt-2 text-xs">We'll respond within 48 hours.</p>
                      </div>
                    </div>
                  </div>
                </section>

                <Separator />

                <section>
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-primary font-bold text-sm">6</span>
                    </div>
                    <h2 className="text-2xl font-semibold text-foreground">Cookies & Website Analytics</h2>
                  </div>
                  
                  <div className="space-y-4">
                    <p className="text-muted-foreground">
                      We use cookies (small text files) to make our website work better for you. Here's what they do:
                    </p>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">Essential Cookies</h4>
                        <p className="text-sm text-muted-foreground">Keep the website functioning properly</p>
                      </div>
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">Analytics Cookies</h4>
                        <p className="text-sm text-muted-foreground">Help us understand how to improve the site</p>
                      </div>
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">Your Choice</h4>
                        <p className="text-sm text-muted-foreground">You can disable cookies in your browser settings</p>
                      </div>
                    </div>
                  </div>
                </section>

                <Separator />

                <section className="bg-muted/30 p-6 rounded-lg">
                  <h2 className="text-xl font-semibold text-foreground mb-4 text-center">Questions? We're Here to Help</h2>
                  <p className="text-muted-foreground text-center mb-4">
                    If you have any questions about privacy or how we handle your information, don't hesitate to reach out.
                  </p>
                  <div className="bg-background p-4 rounded-lg border">
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p><strong>Herman Kwayu Consulting</strong></p>
                        <p>Email: <a href="mailto:truthherman@gmail.com" className="text-primary hover:underline">truthherman@gmail.com</a></p>
                      </div>
                      <div>
                        <p>Location: Dar es Salaam, Tanzania</p>
                        <p>LinkedIn: <a href="https://www.linkedin.com/in/herman-kwayu-044733135" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">herman-kwayu-044733135</a></p>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground text-center mt-4">
                    We'll respond to privacy-related inquiries within 48 hours.
                  </p>
                </section>
              </div>
            </CardContent>
          </Card>

          {/* Back to Home Button */}
          <div className="text-center">
            <Button
              onClick={onBack}
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              ← Return to Home
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}