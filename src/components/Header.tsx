import { Button } from "./ui/button";

export function Header() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-b border-border z-50">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded-full"></div>
          <span className="font-medium">Herman Kwayu</span>
        </div>
        
        <nav className="hidden md:flex items-center space-x-8">
          <button 
            onClick={() => scrollToSection('about')}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            About
          </button>
          <button 
            onClick={() => scrollToSection('services')}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Services
          </button>
          <button 
            onClick={() => scrollToSection('portfolio')}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Portfolio
          </button>
          <button 
            onClick={() => scrollToSection('testimonials')}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Testimonials
          </button>
          <Button 
            onClick={() => scrollToSection('contact')}
            variant="default"
          >
            Contact
          </Button>
        </nav>

        {/* Mobile menu button */}
        <Button variant="ghost" size="sm" className="md:hidden">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </Button>
      </div>
    </header>
  );
}