import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { DarkModeToggle } from "./DarkModeToggle";
import { FastAdminAuth } from "./FastAdminAuth";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Menu, X } from "lucide-react";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false); // Close mobile menu after navigation
    }
  };

  const navigateToResume = () => {
    window.dispatchEvent(new CustomEvent('navigate-to-resume', { 
      detail: { view: 'resume' } 
    }));
    setMobileMenuOpen(false);
  };

  const navigateToAdmin = () => {
    window.dispatchEvent(new CustomEvent('navigate-to-admin', { 
      detail: { view: 'admin' } 
    }));
    setMobileMenuOpen(false);
  };

  const navigationItems = [
    { label: 'About', action: () => scrollToSection('about') },
    { label: 'Services', action: () => scrollToSection('services') },
    { label: 'Portfolio', action: () => scrollToSection('portfolio') },
    { label: 'Contact', action: () => scrollToSection('contact') },
    { label: 'Resume Builder', action: navigateToResume }
  ];

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 transition-all duration-300 border-b border-border z-50 ${
          isScrolled 
            ? 'bg-background/98 backdrop-blur-md shadow-sm' 
            : 'bg-background/95 backdrop-blur-sm'
        }`}
      >
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => scrollToSection('hero')}
            className="flex items-center space-x-3 group"
            aria-label="Herman Kwayu - Home"
          >
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="text-primary-foreground font-bold text-sm">HK</span>
            </div>
            <span className="font-medium group-hover:text-primary transition-colors">Herman Kwayu</span>
          </button>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <button 
                key={item.label}
                onClick={item.action}
                className="text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:text-primary"
              >
                {item.label}
              </button>
            ))}
            <button 
              onClick={navigateToAdmin}
              className="text-muted-foreground hover:text-primary transition-colors text-sm focus:outline-none"
            >
              Admin
            </button>
            <DarkModeToggle />
            <Button 
              onClick={() => scrollToSection('contact')}
              variant="default"
              className="hover:scale-105 transition-transform"
            >
              Get Started
            </Button>
          </nav>

          {/* Mobile Menu */}
          <div className="md:hidden flex items-center space-x-4">
            <DarkModeToggle />
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm"
                  aria-label="Open mobile menu"
                >
                  {mobileMenuOpen ? (
                    <X className="w-6 h-6" />
                  ) : (
                    <Menu className="w-6 h-6" />
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <SheetHeader>
                  <SheetTitle>Navigation</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col space-y-6 mt-8">
                  {navigationItems.map((item) => (
                    <button 
                      key={item.label}
                      onClick={item.action}
                      className="text-left text-lg text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:text-primary"
                    >
                      {item.label}
                    </button>
                  ))}
                  <hr className="border-border" />
                  <button 
                    onClick={navigateToAdmin}
                    className="text-left text-lg text-muted-foreground hover:text-primary transition-colors focus:outline-none"
                  >
                    Admin
                  </button>
                  <Button 
                    onClick={() => scrollToSection('contact')}
                    variant="default"
                    className="w-full mt-4"
                  >
                    Get Started
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

    </>
  );
}