import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Separator } from "./ui/separator";
import { FileText, HandHeart, Shield, CheckCircle2, Users, Scale } from "lucide-react";

interface TermsOfServiceProps {
  onBack?: () => void;
}

export function TermsOfService({ onBack }: TermsOfServiceProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground py-8">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div>
                <span className="font-medium text-xl">Herman Kwayu</span>
                <p className="text-primary-foreground/80 text-sm">Terms of Service</p>
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
              <HandHeart className="w-8 h-8 text-primary" />
              <h1 className="text-4xl font-bold text-foreground">Fair & Simple Terms</h1>
            </div>
            <p className="text-xl text-muted-foreground mb-4">
              We believe in transparent, fair terms that protect both of us. 
              These terms are written in plain English so you know exactly what to expect.
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
              <Scale className="w-6 h-6 text-primary" />
              <span>What These Terms Cover</span>
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="border-primary/20">
                <CardContent className="p-6 text-center">
                  <Shield className="w-8 h-8 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Your Rights</h3>
                  <p className="text-sm text-muted-foreground">Clear guidelines on what you can expect from our services and how we protect you.</p>
                </CardContent>
              </Card>
              <Card className="border-primary/20">
                <CardContent className="p-6 text-center">
                  <Users className="w-8 h-8 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Fair Usage</h3>
                  <p className="text-sm text-muted-foreground">Simple rules for using our services respectfully and legally.</p>
                </CardContent>
              </Card>
              <Card className="border-primary/20">
                <CardContent className="p-6 text-center">
                  <FileText className="w-8 h-8 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Clear Boundaries</h3>
                  <p className="text-sm text-muted-foreground">What we're responsible for and what you're responsible for.</p>
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
                    <h2 className="text-2xl font-semibold text-foreground">What We Offer</h2>
                  </div>
                  
                  <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 p-6 rounded-lg">
                    <h3 className="font-semibold text-blue-800 dark:text-blue-400 mb-4">Our Services Include:</h3>
                    <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-700 dark:text-blue-300">
                      <div>
                        <h4 className="font-medium mb-2">Consulting Services:</h4>
                        <ul className="space-y-1">
                          <li>• Strategic planning & business development</li>
                          <li>• Digital transformation consulting</li>
                          <li>• Process optimization & improvement</li>
                          <li>• Project management support</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Free Tools & Resources:</h4>
                        <ul className="space-y-1">
                          <li>• Professional Resume Builder (no signup required)</li>
                          <li>• Business insights newsletter</li>
                          <li>• Educational content & articles</li>
                          <li>• Professional networking opportunities</li>
                        </ul>
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
                    <h2 className="text-2xl font-semibold text-foreground">How to Use Our Services Respectfully</h2>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 p-6 rounded-lg">
                      <h3 className="font-semibold text-green-800 dark:text-green-400 mb-4">✅ What's Encouraged:</h3>
                      <ul className="space-y-2 text-sm text-green-700 dark:text-green-300">
                        <li className="flex items-start space-x-2">
                          <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>Use our services for legitimate business purposes</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>Create professional resumes for your job search</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>Share our content with proper attribution</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>Provide accurate information when contacting us</span>
                        </li>
                      </ul>
                    </div>

                    <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 p-6 rounded-lg">
                      <h3 className="font-semibold text-red-800 dark:text-red-400 mb-4">❌ What's Not Allowed:</h3>
                      <ul className="space-y-2 text-sm text-red-700 dark:text-red-300">
                        <li>• Using our services for illegal or harmful activities</li>
                        <li>• Attempting to hack, disrupt, or damage our website</li>
                        <li>• Sending spam or unwanted promotional content</li>
                        <li>• Impersonating Herman Kwayu or our business</li>
                        <li>• Redistributing our tools or content commercially without permission</li>
                      </ul>
                    </div>
                  </div>
                </section>

                <Separator />

                <section>
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-primary font-bold text-sm">3</span>
                    </div>
                    <h2 className="text-2xl font-semibold text-foreground">Your Rights & Our Responsibilities</h2>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <Card className="border-primary/20">
                      <CardContent className="p-6">
                        <h3 className="font-semibold text-primary mb-4">Your Rights:</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li>• Access our free tools without hidden costs</li>
                          <li>• Receive professional, ethical consulting services</li>
                          <li>• Have your privacy respected (see our Privacy Policy)</li>
                          <li>• Cancel or modify service agreements</li>
                          <li>• Get clear, honest communication from us</li>
                        </ul>
                      </CardContent>
                    </Card>
                    <Card className="border-primary/20">
                      <CardContent className="p-6">
                        <h3 className="font-semibold text-primary mb-4">Our Commitments:</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li>• Provide services with professional standards</li>
                          <li>• Protect your personal information</li>
                          <li>• Maintain our website and tools</li>
                          <li>• Be transparent about costs and timelines</li>
                          <li>• Act in your best business interests</li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </section>

                <Separator />

                <section>
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-primary font-bold text-sm">4</span>
                    </div>
                    <h2 className="text-2xl font-semibold text-foreground">About Our Free Resume Builder</h2>
                  </div>
                  
                  <div className="bg-gradient-to-r from-primary/5 to-accent/5 p-6 rounded-lg">
                    <h3 className="font-semibold text-foreground mb-4">Free Forever, No Catches</h3>
                    <div className="grid md:grid-cols-2 gap-6 text-sm">
                      <div>
                        <h4 className="font-medium text-foreground mb-2">What You Get:</h4>
                        <ul className="space-y-1 text-muted-foreground">
                          <li>• 4 professional resume templates</li>
                          <li>• Unlimited resume creation</li>
                          <li>• Download in multiple formats</li>
                          <li>• No registration required</li>
                          <li>• No watermarks or branding</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground mb-2">Important Notes:</h4>
                        <ul className="space-y-1 text-muted-foreground">
                          <li>• For personal job search use only</li>
                          <li>• You're responsible for accuracy of information</li>
                          <li>• We don't guarantee job placement results</li>
                          <li>• Templates can't be resold or redistributed</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </section>

                <Separator />

                <section>
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-primary font-bold text-sm">5</span>
                    </div>
                    <h2 className="text-2xl font-semibold text-foreground">Consulting Services</h2>
                  </div>
                  
                  <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 p-6 rounded-lg">
                    <h3 className="font-semibold text-amber-800 dark:text-amber-400 mb-4">How Consulting Works:</h3>
                    <div className="space-y-4 text-sm text-amber-700 dark:text-amber-300">
                      <p>
                        <strong>Individual Agreements:</strong> Each consulting project has its own separate agreement with specific terms, timelines, and costs.
                      </p>
                      <p>
                        <strong>Professional Standards:</strong> All consulting follows industry best practices and ethical guidelines.
                      </p>
                      <p>
                        <strong>Confidentiality:</strong> Your business information is kept strictly confidential.
                      </p>
                      <p>
                        <strong>Clear Communication:</strong> We'll always be upfront about what we can and can't do for your business.
                      </p>
                    </div>
                  </div>
                </section>

                <Separator />

                <section className="bg-muted/30 p-6 rounded-lg">
                  <h2 className="text-xl font-semibold text-foreground mb-4 text-center">Questions About These Terms?</h2>
                  <p className="text-muted-foreground text-center mb-4">
                    We want you to feel confident about using our services. If anything isn't clear, just ask!
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
                    We'll explain anything that seems confusing - no legal jargon needed!
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