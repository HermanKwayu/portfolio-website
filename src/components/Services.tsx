import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";

interface ServicesProps {
  onNavigateToResume?: () => void;
}

export function Services({ onNavigateToResume }: ServicesProps) {
  const services = [
    {
      icon: "🎯",
      title: "Strategic Planning",
      description: "Develop comprehensive strategic plans that align with your business objectives and market opportunities.",
      features: ["Market Analysis", "Competitive Intelligence", "Strategic Roadmapping", "KPI Development"],
      gradient: "from-primary/20 to-primary/5",
      action: "contact"
    },
    {
      icon: "🚀",
      title: "Digital Transformation",
      description: "Modernize your operations with digital solutions that improve efficiency and customer experience.",
      features: ["Process Automation", "Technology Integration", "Digital Workflows", "Change Management"],
      gradient: "from-primary/15 to-secondary/10",
      action: "contact"
    },
    {
      icon: "📊",
      title: "Business Optimization",
      description: "Identify and eliminate inefficiencies while optimizing your operations for maximum performance.",
      features: ["Process Analysis", "Cost Reduction", "Performance Metrics", "Operational Excellence"],
      gradient: "from-secondary/20 to-primary/10",
      action: "contact"
    },
    {
      icon: "📄",
      title: "Professional Resume Builder",
      description: "Create stunning, ATS-friendly resumes with our professional templates. Completely free for all job seekers worldwide!",
      features: ["Modern Templates", "ATS-Optimized", "PDF & Word Export", "Privacy-First (No Data Stored)"],
      gradient: "from-green-200/20 to-blue-200/20",
      action: "resume",
      price: "FREE",
      popular: true
    },

    {
      icon: "💡",
      title: "Innovation Consulting",
      description: "Foster innovation culture and develop new business models to stay ahead of the competition.",
      features: ["Innovation Workshops", "Idea Generation", "Product Development", "Market Testing"],
      gradient: "from-primary/10 to-secondary/15",
      action: "contact"
    },
    {
      icon: "👥",
      title: "Change Management",
      description: "Successfully navigate organizational changes with structured change management methodologies.",
      features: ["Change Strategy", "Communication Plans", "Training Programs", "Adoption Support"],
      gradient: "from-secondary/15 to-primary/20",
      action: "contact"
    },
    {
      icon: "📈",
      title: "Growth Strategy",
      description: "Develop and execute growth strategies that scale your business sustainably.",
      features: ["Growth Planning", "Market Expansion", "Partnership Strategy", "Revenue Optimization"],
      gradient: "from-primary/25 to-secondary/5",
      action: "contact"
    }
  ];

  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const openResumeBuilder = () => {
    if (onNavigateToResume) {
      // Update URL for better UX
      window.history.pushState({}, '', '/resume-builder');
      onNavigateToResume();
    } else {
      // Fallback to page reload
      window.location.href = '/resume-builder';
    }
  };



  const handleServiceAction = (action: string) => {
    if (action === 'resume') {
      openResumeBuilder();
    } else {
      scrollToContact();
    }
  };

  return (
    <section id="services" className="py-24 bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-6">
        {/* Header Section */}
        <div className="max-w-4xl mx-auto text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-6">
            <span className="text-sm font-medium text-primary">Services & Expertise</span>
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Comprehensive <span className="text-primary">Consulting</span> Solutions
          </h2>
          
          <div className="h-1 w-24 bg-gradient-to-r from-primary to-primary/50 rounded-full mx-auto mb-8"></div>
          
          <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            From strategic planning to digital transformation, I provide end-to-end consulting services 
            that drive meaningful business results and sustainable growth.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {services.map((service, index) => (
            <Card 
              key={index} 
              className={`relative overflow-hidden group hover:shadow-xl hover:shadow-primary/10 transition-all duration-500 border-border/50 hover:border-primary/30 bg-card/80 backdrop-blur-sm ${service.popular ? 'ring-2 ring-primary/30' : ''}`}
            >
              {/* Popular Badge */}
              {service.popular && (
                <div className="absolute top-4 right-4 z-20">
                  <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    FREE!
                  </div>
                </div>
              )}

              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
              
              <CardHeader className="pb-4 relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-5xl">{service.icon}</div>
                  <div className="flex items-center gap-2">
                    {service.price && (
                      <div className={`text-sm font-bold px-2 py-1 rounded ${
                        service.price === 'FREE' 
                          ? 'text-green-700 bg-green-100' 
                          : 'text-primary bg-primary/10'
                      }`}>
                        {service.price}
                      </div>
                    )}
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                      <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                </div>
                <CardTitle className="text-xl text-foreground group-hover:text-primary transition-colors duration-300">
                  {service.title}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-6 relative z-10">
                <p className="text-muted-foreground leading-relaxed">{service.description}</p>
                
                <div className="space-y-3">
                  <h4 className="font-semibold text-foreground">What's Included:</h4>
                  <ul className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="text-sm text-muted-foreground flex items-center group/item">
                        <div className="w-2 h-2 bg-primary rounded-full mr-3 group-hover/item:scale-125 transition-transform duration-200"></div>
                        <span className="group-hover/item:text-foreground transition-colors duration-200">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Hover Action */}
                <div className="pt-4 border-t border-border/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button 
                    variant={service.action === 'resume' ? 'default' : 'ghost'}
                    size="sm" 
                    onClick={() => handleServiceAction(service.action)}
                    className={`w-full ${
                      service.action === 'resume' 
                        ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white hover:from-green-700 hover:to-blue-700' 
                        : 'text-primary hover:text-primary-foreground hover:bg-primary'
                    }`}
                  >
                    {service.action === 'resume' 
                      ? 'Build Free Resume' 
                      : 'Learn More'}
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="relative bg-gradient-to-br from-primary/5 to-secondary/10 rounded-3xl p-12 max-w-4xl mx-auto border border-primary/10 overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-0 left-0 w-40 h-40 bg-primary rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-primary rounded-full blur-3xl"></div>
            </div>
            
            <div className="relative z-10">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              
              <h3 className="text-3xl font-bold mb-4 text-foreground">
                Need a <span className="text-primary">Custom Solution?</span>
              </h3>
              
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
                Every business is unique. Let's discuss your specific challenges and create 
                a tailored consulting package that delivers exactly what you need.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  onClick={scrollToContact}
                  className="px-8 py-4 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25"
                >
                  Start a Conversation
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Button>
                
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => window.open('https://www.linkedin.com/in/herman-kwayu', '_blank')}
                  className="px-8 py-4 border-primary/30 text-primary hover:bg-primary/10"
                >
                  Connect on LinkedIn
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}