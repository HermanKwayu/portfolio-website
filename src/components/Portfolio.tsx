import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function Portfolio() {
  const projects = [
    {
      title: "Fortune 500 Digital Transformation",
      category: "Digital Strategy",
      image: "https://images.unsplash.com/photo-1623578240928-9473b76272ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwdHJhbnNmb3JtYXRpb24lMjB0ZWNobm9sb2d5fGVufDF8fHx8MTc1NjU1NTE1M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      description: "Led comprehensive digital transformation initiative for a Fortune 500 manufacturing company, resulting in 40% operational efficiency improvement.",
      results: ["40% efficiency increase", "25% cost reduction", "$2M annual savings"],
      tags: ["Digital Transformation", "Process Automation", "Change Management"],
      duration: "12 months"
    },
    {
      title: "Startup Growth Strategy",
      category: "Business Strategy",
      image: "https://images.unsplash.com/photo-1739287088753-73a9b8b771bc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMG1lZXRpbmclMjBjb3Jwb3JhdGUlMjBzdHJhdGVneXxlbnwxfHx8fDE3NTY2MjM4MDV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      description: "Developed and executed growth strategy for tech startup, scaling from 50 to 500 employees while maintaining operational excellence.",
      results: ["10x team growth", "300% revenue increase", "Series B funding secured"],
      tags: ["Growth Strategy", "Scaling Operations", "Organizational Design"],
      duration: "18 months"
    },
    {
      title: "Data-Driven Optimization",
      category: "Analytics & Optimization",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRhJTIwYW5hbHl0aWNzJTIwZGFzaGJvYXJkfGVufDF8fHx8MTc1NjYxMDY3Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      description: "Implemented advanced analytics framework for retail chain, enabling data-driven decision making across 200+ locations.",
      results: ["15% sales increase", "Real-time insights", "Predictive analytics"],
      tags: ["Data Analytics", "Business Intelligence", "Performance Optimization"],
      duration: "8 months"
    }
  ];

  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="portfolio" className="py-20 bg-secondary/10">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">Featured Projects</h2>
          <p className="text-lg text-muted-foreground">
            Real results from real engagements. Here are some of the transformative projects 
            I've led that demonstrate measurable impact and sustainable growth.
          </p>
        </div>

        <div className="space-y-12">
          {projects.map((project, index) => (
            <Card key={index} className="overflow-hidden">
              <div className={`grid lg:grid-cols-2 gap-0 ${index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''}`}>
                <div className={`relative h-64 lg:h-auto ${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                  <ImageWithFallback
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm">
                      {project.category}
                    </Badge>
                  </div>
                </div>

                <CardContent className={`p-8 flex flex-col justify-center ${index % 2 === 1 ? 'lg:col-start-1' : ''}`}>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-2xl font-bold mb-3">{project.title}</h3>
                      <p className="text-muted-foreground">{project.description}</p>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">Key Results:</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {project.results.map((result, resultIndex) => (
                          <div key={resultIndex} className="bg-secondary/20 rounded-lg p-3 text-center">
                            <div className="font-medium text-sm">{result}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag, tagIndex) => (
                        <Badge key={tagIndex} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <span className="text-sm text-muted-foreground">
                        Duration: {project.duration}
                      </span>
                      <Button variant="outline" onClick={scrollToContact}>
                        Similar Project?
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center mt-16">
          <div className="bg-background rounded-lg border p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">Ready to Start Your Project?</h3>
            <p className="text-muted-foreground mb-6">
              Every successful transformation starts with a conversation. Let's discuss how we can 
              achieve similar results for your organization.
            </p>
            <Button size="lg" onClick={scrollToContact}>
              Schedule a Consultation
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}