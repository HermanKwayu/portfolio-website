  import { Button } from "./ui/button";
  
  export function Footer() {
    const scrollToSection = (sectionId: string) => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    };
  
    const socialLinks = [
      { 
        name: "LinkedIn", 
        url: "https://www.linkedin.com/in/herman-kwayu-044733135",
        icon: (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
        )
      },
      { 
        name: "Email", 
        url: "mailto:truthherman@gmail.com",
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 7.89a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        )
      }
    ];
  
    const quickLinks = [
      { name: "About", action: () => scrollToSection('about') },
      { name: "Services", action: () => scrollToSection('services') },
      { name: "Portfolio", action: () => scrollToSection('portfolio') },
      { name: "Testimonials", action: () => scrollToSection('testimonials') },
      { name: "Contact", action: () => scrollToSection('contact') }
    ];
  
    return (
      <footer className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-6 py-16">
          <div className="grid lg:grid-cols-4 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-primary-foreground rounded-full flex items-center justify-center">
                    <span className="text-primary font-bold text-sm">HK</span>
                  </div>
                  <span className="font-medium text-xl">Herman Kwayu</span>
                </div>
                <p className="text-primary-foreground/80 max-w-md">
                  Strategic consultant and digital innovator helping businesses transform 
                  their operations and unlock sustainable growth through data-driven solutions.
                </p>
              </div>
  
              <div>
                <h4 className="font-medium mb-3">Connect With Me</h4>
                <div className="flex space-x-4">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.url}
                      className="flex items-center justify-center w-10 h-10 bg-primary-foreground/10 hover:bg-primary-foreground/20 rounded-full transition-colors"
                      aria-label={social.name}
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>
  
            <div>
              <h4 className="font-medium mb-4">Quick Links</h4>
              <ul className="space-y-2">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <button
                      onClick={link.action}
                      className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                    >
                      {link.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
  
            <div>
              <h4 className="font-medium mb-4">Newsletter</h4>
              <p className="text-primary-foreground/80 text-sm mb-4">
                Subscribe to get insights on business strategy and digital transformation.
              </p>
              <div className="space-y-3">
                <div className="flex">
                  <input
                    type="email"
                    placeholder="Your email"
                    className="flex-1 px-3 py-2 bg-primary-foreground/10 border border-primary-foreground/20 rounded-l-md text-primary-foreground placeholder:text-primary-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary-foreground/20"
                  />
                  <Button
                    variant="secondary"
                    className="rounded-l-none"
                    size="sm"
                  >
                    Subscribe
                  </Button>
                </div>
                <p className="text-xs text-primary-foreground/60">
                  No spam. Unsubscribe anytime.
                </p>
              </div>
            </div>
          </div>
  
          <div className="border-t border-primary-foreground/20 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 text-sm text-primary-foreground/80">
                <p>&copy; 2025 Herman Kwayu. All rights reserved.</p>
                <div className="flex space-x-4">
                  <a href="#" className="hover:text-primary-foreground transition-colors">Privacy Policy</a>
                  <a href="#" className="hover:text-primary-foreground transition-colors">Terms of Service</a>
                </div>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10"
              >
                Back to Top ↑
              </Button>
            </div>
          </div>
        </div>
      </footer>
    );
  }