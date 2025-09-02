import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";

export function Services() {
  const services = [
    {
      icon: "🎯",
      title: "Strategic Planning",
      description: "Develop comprehensive strategic plans that align with your business objectives and market opportunities.",
      features: ["Market Analysis", "Competitive Intelligence", "Strategic Roadmapping", "KPI Development"],
    },
    {
      icon: "🚀",
      title: "Digital Transformation",
      description: "Modernize your operations with digital solutions that improve efficiency and customer experience.",
      features: ["Process Automation", "Technology Integration", "Digital Workflows", "Change Management"],
    },
    {
      icon: "📊",
      title: "Business Optimization",
      description: "Identify and eliminate inefficiencies while optimizing your operations for maximum performance.",
      features: ["Process Analysis", "Cost Reduction", "Performance Metrics", "Operational Excellence"],
    },
    {
      icon: "💡",
      title: "Innovation Consulting",
      description: "Foster innovation culture and develop new business models to stay ahead of the competition.",
      features: ["Innovation Workshops", "Idea Generation", "Product Development", "Market Testing"],
    },
    {
      icon: "👥",
      title: "Change Management",
      description: "Successfully navigate organizational changes with structured change management methodologies.",
      features: ["Change Strategy", "Communication Plans", "Training Programs", "Adoption Support"],
    },
    {
      icon: "📈",
      title: "Growth Strategy",
      description: "Develop and execute growth strategies that scale your business sustainably.",
      features: ["Growth Planning", "Market Expansion", "Partnership Strategy", "Revenue Optimization"],
    }
  ];

  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="services" className="py-20">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">Consulting Services</h2>
          <p className="text-lg text-muted-foreground">
            Comprehensive consulting solutions tailored to your business needs. 
            From strategy development to implementation, I provide end-to-end support for your transformation journey.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="relative overflow-hidden group hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-4">
                <div className="text-4xl mb-4">{service.icon}</div>
                <CardTitle className="text-xl">{service.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">{service.description}</p>
                
                <div className="space-y-2">
                  <h4 className="font-medium">What's Included:</h4>
                  <ul className="space-y-1">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="text-sm text-muted-foreground flex items-center">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-border">
                  <div className="font-medium text-primary mb-4">{service.price}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="text-center mt-16">
          <div className="bg-secondary/20 rounded-lg p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">Custom Solutions Available</h3>
            <p className="text-muted-foreground mb-6">
              Need something specific? I offer custom consulting packages tailored to your unique challenges and objectives.
            </p>
            <Button size="lg" onClick={scrollToContact}>
              Discuss Your Needs
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}