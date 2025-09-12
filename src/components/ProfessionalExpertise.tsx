import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { CheckCircle2, Target, TrendingUp, Shield, Database, Users } from "lucide-react";

export function ProfessionalExpertise() {
  const expertiseAreas = [
    {
      icon: Shield,
      title: "KYC & Compliance",
      experience: "5+ Years",
      description: "Regulatory compliance and identity verification across 14 African countries",
      achievements: [
        "100% compliance rate across Airtel Africa markets",
        "Reduced KYC processing time by 60%",
        "Led SIM swap fraud prevention initiatives"
      ],
      keyProjects: [
        "Airtel Africa Group KYC Harmonization",
        "Cross-border Compliance Framework",
        "Anti-fraud Detection System Implementation"
      ],
      highlight: "Leading 14 Countries",
      color: "from-blue-500/10 to-blue-600/5",
      iconColor: "text-blue-600 dark:text-blue-400"
    },
    {
      icon: Target,
      title: "Tech Project Management",
      experience: "4+ Years",
      description: "Cross-functional leadership and PMO operations for complex technical initiatives",
      achievements: [
        "Delivered 50+ projects on time and budget",
        "Managed $2M+ project portfolios",
        "95% stakeholder satisfaction rate"
      ],
      keyProjects: [
        "Digital Banking Platform Migration",
        "CRM System Overhaul (Ramani.io)",
        "Multi-country Product Launch Coordination"
      ],
      highlight: "PMO Leadership",
      color: "from-green-500/10 to-green-600/5",
      iconColor: "text-green-600 dark:text-green-400"
    },
    {
      icon: Database,
      title: "Data Analytics",
      experience: "6+ Years",
      description: "Business intelligence, simulation, and performance analysis for strategic decision making",
      achievements: [
        "85% improvement in customer satisfaction",
        "Identified $500K+ revenue opportunities",
        "Built predictive models for risk assessment"
      ],
      keyProjects: [
        "Customer Behavior Analysis Platform",
        "Revenue Leakage Detection System",
        "Business Simulation Models for Product Launch"
      ],
      highlight: "AI-Driven Insights",
      color: "from-purple-500/10 to-purple-600/5",
      iconColor: "text-purple-600 dark:text-purple-400"
    },
    {
      icon: Users,
      title: "Customer Experience",
      experience: "3+ Years",
      description: "End-to-end customer journey optimization and digital experience enhancement",
      achievements: [
        "Reduced customer complaints by 70%",
        "Improved NPS score from 6.2 to 8.5",
        "Streamlined onboarding process efficiency"
      ],
      keyProjects: [
        "Omnichannel Customer Support Platform",
        "Digital Onboarding Experience Redesign",
        "Customer Feedback Loop Automation"
      ],
      highlight: "85% Satisfaction",
      color: "from-orange-500/10 to-orange-600/5",
      iconColor: "text-orange-600 dark:text-orange-400"
    },
    {
      icon: TrendingUp,
      title: "Revenue Assurance",
      experience: "2+ Years",
      description: "Revenue protection and optimization through comprehensive business analysis",
      achievements: [
        "Zero revenue leakage in monitored streams",
        "Recovered $1.2M+ in revenue gaps",
        "Implemented automated monitoring systems"
      ],
      keyProjects: [
        "Real-time Revenue Monitoring Dashboard",
        "Fraud Detection Algorithm Development",
        "Business Process Automation Framework"
      ],
      highlight: "Revenue Protection",
      color: "from-red-500/10 to-red-600/5",
      iconColor: "text-red-600 dark:text-red-400"
    }
  ];

  return (
    <section id="expertise" className="py-24 bg-gradient-to-b from-background to-secondary/10">
      <div className="container mx-auto px-6">
        {/* Header Section */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-6">
            <Target className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Professional Expertise</span>
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Specialized <span className="text-primary">Domain Knowledge</span>
          </h2>
          
          <div className="h-1 w-24 bg-gradient-to-r from-primary to-primary/50 rounded-full mx-auto mb-8"></div>
          
          <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            Deep expertise across critical business functions, combining technical proficiency 
            with strategic insight to deliver measurable results in complex enterprise environments.
          </p>
        </div>

        {/* Expertise Grid */}
        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8 mb-16">
          {expertiseAreas.map((area, index) => {
            const IconComponent = area.icon;
            return (
              <Card 
                key={index}
                className="group relative overflow-hidden border-border/50 hover:border-primary/30 transition-all duration-500 bg-card/80 backdrop-blur-sm hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-2"
              >
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${area.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                {/* Top Accent Line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-primary/50 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                
                <CardContent className="relative p-8 space-y-6">
                  {/* Header */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${area.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <IconComponent className={`w-7 h-7 ${area.iconColor}`} />
                      </div>
                      <Badge className="bg-primary/10 text-primary border-primary/20 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                        {area.highlight}
                      </Badge>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                        {area.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs font-medium">
                          {area.experience}
                        </Badge>
                      </div>
                    </div>
                    
                    <p className="text-muted-foreground leading-relaxed">
                      {area.description}
                    </p>
                  </div>

                  {/* Achievements */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-foreground flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-primary" />
                      Key Achievements
                    </h4>
                    <ul className="space-y-2">
                      {area.achievements.map((achievement, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Key Projects */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-foreground flex items-center gap-2">
                      <Database className="w-4 h-4 text-primary" />
                      Notable Projects
                    </h4>
                    <div className="space-y-2">
                      {area.keyProjects.map((project, idx) => (
                        <div key={idx} className="text-sm text-muted-foreground bg-secondary/30 px-3 py-2 rounded-lg border border-border/30">
                          {project}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Summary Statistics */}
        <div className="bg-gradient-to-br from-primary/5 to-secondary/10 rounded-3xl p-8 border border-primary/10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">8+</div>
              <div className="text-sm text-muted-foreground">Years Combined Experience</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">50+</div>
              <div className="text-sm text-muted-foreground">Projects Delivered</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">14</div>
              <div className="text-sm text-muted-foreground">Countries Impacted</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">$2M+</div>
              <div className="text-sm text-muted-foreground">Portfolio Value Managed</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}