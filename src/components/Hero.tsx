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
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary/20 pt-20">
      <div className="container mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                Project Management Consultant &
                <span className="block text-primary">
                  Digital Innovator
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-lg">
                I help businesses, startups, and organizations
                to turn ideas into reality — guiding them
                through ideation, discovery, experimentation,
                design (UI/UX), implementation, release, and
                continuous iteration while remaining Compliant
                to the law & regulations.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                onClick={() => scrollToSection("contact")}
                className="text-lg px-8 py-3"
              >
                Start a Project
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => scrollToSection("portfolio")}
                className="text-lg px-8 py-3"
              >
                View My Work
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-border">
              <div>
                <div className="font-bold text-2xl">50+</div>
                <div className="text-sm text-muted-foreground">
                  Projects Completed
                </div>
              </div>
              <div>
                <div className="font-bold text-2xl">8+</div>
                <div className="text-sm text-muted-foreground">
                  Years Experience
                </div>
              </div>
              <div>
                {/*<div className="font-bold text-2xl">95%</div>
                <div className="text-sm text-muted-foreground">Client Satisfaction</div>*/}
              </div>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              <div className="w-80 h-80 rounded-full bg-gradient-to-br from-primary/20 to-secondary/30 flex items-center justify-center">
                <ImageWithFallback
                  src={
                    image_bf6dd4d1eca6857b142279e4493da8cb776e21a5
                  }
                  alt="Professional headshot"
                  className="w-72 h-72 rounded-full object-cover border-4 border-background shadow-xl"
                />
              </div>
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary rounded-full flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-primary-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}