import image_bf6dd4d1eca6857b142279e4493da8cb776e21a5 from "figma:asset/bf6dd4d1eca6857b142279e4493da8cb776e21a5.png";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function Hero() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section 
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      aria-label="Hero section - Herman Kwayu introduction"
    >
      {/* Sophisticated Background with Primary Colors */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-secondary/30" aria-hidden="true"></div>
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-40" aria-hidden="true">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-6 py-20 relative z-10 pt-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content Column */}
          <div className="space-y-8">
            {/* Badge */}
            <div 
              className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2"
              role="status"
              aria-label="Currently available for new projects"
            >
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" aria-hidden="true"></div>
              <span className="text-sm font-medium text-primary">Available for Projects</span>
            </div>

            {/* Main Heading */}
            <div className="space-y-6">
              <div className="space-y-3">
                <p className="text-lg text-muted-foreground font-medium" aria-label="Introduction">Hi, I'm</p>
                <h1 className="text-4xl font-bold">
                  Herman 
                </h1>
                <div className="h-1 w-20 bg-gradient-to-r from-primary to-primary/50 rounded-full" aria-hidden="true"></div>
              </div>
              
              <h2 className="text-2xl lg:text-3xl text-foreground font-medium leading-relaxed">
                Project Management Consultant &<br />
                <span className="text-primary">Digital Innovation</span> Expert
              </h2>
              
              <p className="text-xl text-muted-foreground max-w-xl leading-relaxed">
                I transform business ideas into reality through strategic project management, 
                digital innovation, and process optimization — helping organizations scale 
                efficiently while staying compliant.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4" role="group" aria-label="Primary actions">
              <Button
                size="lg"
                onClick={() => scrollToSection("contact")}
                className="text-lg px-8 py-4 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-300 hover:scale-105"
                data-track="hero-start-project"
                aria-describedby="start-project-description"
              >
                Start a Project
                <svg 
                  className="w-5 h-5 ml-2" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Button>
              <span id="start-project-description" className="sr-only">
                Navigate to contact section to discuss your project requirements
              </span>
              <Button
                variant="outline"
                size="lg"
                onClick={() => scrollToSection("portfolio")}
                className="text-lg px-8 py-4 border-primary/30 text-primary hover:bg-primary/10 transition-all duration-300 hover:scale-105"
                aria-describedby="portfolio-description"
              >
                View My Work
              </Button>
              <span id="portfolio-description" className="sr-only">
                Navigate to portfolio section to see completed projects and case studies
              </span>
            </div>

            {/* Stats with Enhanced Design */}
            <div className="grid grid-cols-2 gap-8 pt-12" role="region" aria-label="Professional statistics">
              <div className="group">
                <div className="p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/30 transition-all duration-300 hover:scale-105">
                  <div className="font-bold text-3xl text-primary mb-2" aria-label="Fifty plus">50+</div>
                  <div className="text-sm text-muted-foreground font-medium">
                    Projects Completed
                  </div>
                </div>
              </div>
              <div className="group">
                <div className="p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/30 transition-all duration-300 hover:scale-105">
                  <div className="font-bold text-3xl text-primary mb-2" aria-label="Eight plus">8+</div>
                  <div className="text-sm text-muted-foreground font-medium">
                    Years Experience
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Image Column */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative group" role="img" aria-label="Herman Kwayu professional portrait with experience highlights">
              {/* Decorative Background */}
              <div 
                className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/10 rounded-3xl rotate-6 group-hover:rotate-3 transition-transform duration-500"
                aria-hidden="true"
              ></div>
              
              {/* Main Image Container */}
              <div className="relative w-96 h-96 rounded-3xl bg-gradient-to-br from-primary/10 to-secondary/20 p-2 group-hover:scale-105 transition-transform duration-500">
                <ImageWithFallback
                  src={image_bf6dd4d1eca6857b142279e4493da8cb776e21a5}
                  alt="Herman Kwayu - Professional headshot of a confident business consultant"
                  className="w-full h-full rounded-2xl object-cover shadow-2xl"
                  loading="eager"
                />
                
                {/* Floating Badge */}
                <div 
                  className="absolute -bottom-6 -left-6 bg-primary text-primary-foreground p-4 rounded-2xl shadow-lg shadow-primary/25 group-hover:scale-110 transition-transform duration-300"
                  aria-label="Innovation indicator"
                >
                  <svg 
                    className="w-8 h-8" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>

              {/* Floating Elements */}
              <div 
                className="absolute top-4 -right-4 w-20 h-20 bg-secondary/80 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg"
                aria-label="Eight plus years of experience"
              >
                <div className="text-center">
                  <div className="text-sm font-bold text-primary">8+</div>
                  <div className="text-xs text-muted-foreground">Years</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center">
          <button
            onClick={() => scrollToSection("about")}
            className="flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-colors animate-bounce group"
            aria-label="Scroll down to about section"
          >
            <span className="text-sm font-medium group-hover:text-primary">Scroll to explore</span>
            <svg 
              className="w-5 h-5 group-hover:text-primary" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}