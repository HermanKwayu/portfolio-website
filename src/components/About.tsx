import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";

export function About() {
  const skills = [
    "Project Management",
    "KYC & Compliance", 
    "Customer Experience",
    "Revenue Assurance",
    "Business Simulation",
    "Product Management",
    "Process Optimization",
    "Cross-functional Leadership",
    "Quality Assurance",
    "Digital Transformation",
    "Telecom Operations",
    "Fintech Solutions",
  ];

  const experiences = [
    {
      role: "Group Lead KYC & Simswap Compliance and Experience",
      company: "Airtel Africa HQ",
      period: "April 2024 - Present",
      description:
        "Leading KYC, SIM swap, and Airtel Money processes to ensure regulatory compliance and seamless customer experience across 14 African countries. Driving operational excellence while maintaining competitive advantage for the entire continent's operations.",
      highlight: "14 Countries",
    },
    {
      role: "Sr. Tech Project Manager-PMO",
      company: "Ramani.io, Dar es Salaam, Tanzania",
      period: "Feb 2023 - April 2024",
      description:
        "Reported to CTO leading cross-functional teams to deliver complex projects spanning multiple business units. Managed resources, schedules, and financials while ensuring quality delivery within time and cost constraints.",
      highlight: "PMO Lead",
    },
    {
      role: "Project Manager-Products and Design",
      company: "Ramani.io, Dar es Salaam, Tanzania", 
      period: "April 2022 - January 2023",
      description:
        "Reported to CEO managing project execution, budget adherence, and scope delivery. Developed work breakdown structures for IT projects, coordinated project personnel, and prepared comprehensive status reports.",
      highlight: "CEO Direct",
    },
    {
      role: "Senior Business Simulation Analyst-Customer Experience",
      company: "Airtel Tanzania Ltd, Dar es Salaam, Tanzania",
      period: "July 2019 - April 2022",
      description:
        "Led contact and digital project design, CRM maintenance, and product performance analysis. Achieved 85% customer satisfaction increase through proactive simulation, validation, and quality assurance.",
      highlight: "85% Improvement",
    },
    {
      role: "Revenue Assurance Business Simulation Analyst",
      company: "Airtel Tanzania Ltd, Dar es Salaam, Tanzania",
      period: "August 2017 - July 2019",
      description:
        "Ensuring no revenue leakage in any revenue stream from both new and existing products through comprehensive business simulation and analysis.",
      highlight: "Revenue Protection",
    },
  ];

  const approachSteps = [
    { step: "01", title: "Discovery", desc: "Market research & analysis" },
    { step: "02", title: "Strategy", desc: "Experimentation & validation" },
    { step: "03", title: "Design", desc: "UI/UX & user testing" },
    { step: "04", title: "Implementation", desc: "Development & release" },
    { step: "05", title: "Support", desc: "Change management & iteration" },
  ];

  return (
    <section id="about" className="py-24 bg-gradient-to-b from-secondary/20 to-background">
      <div className="container mx-auto px-6">
        {/* Header Section */}
        <div className="max-w-4xl mx-auto text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-6">
            <span className="text-sm font-medium text-primary">About Herman</span>
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Transforming <span className="text-primary">Ideas</span> into Reality
          </h2>
          
          <div className="h-1 w-24 bg-gradient-to-r from-primary to-primary/50 rounded-full mx-auto mb-8"></div>
          
          <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto mb-8">
            With over 8 years of experience in telecom and fintech, I specialize in KYC compliance, 
            customer experience optimization, and technical project management. I help organizations 
            streamline operations, enhance compliance, and drive sustainable growth through innovative 
            digital solutions.
          </p>

          {/* Contact Links */}
          <div className="flex flex-col sm:flex-row gap-6 items-center justify-center">
            <a 
              href="mailto:truthherman@gmail.com"
              className="flex items-center gap-3 px-6 py-3 rounded-full bg-primary/10 hover:bg-primary/20 text-primary transition-all duration-300 group"
            >
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 7.89a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              truthherman@gmail.com
            </a>
            <a 
              href="https://www.linkedin.com/in/herman-kwayu-044733135"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-6 py-3 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 group shadow-lg shadow-primary/25"
            >
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              Connect on LinkedIn
            </a>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left Column - Approach & Skills */}
          <div className="space-y-12">
            {/* My Approach */}
            <div>
              <h3 className="text-3xl font-bold mb-6 text-foreground">
                My <span className="text-primary">Approach</span>
              </h3>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                I believe in a collaborative, data-driven approach that transforms ideas into 
                impactful outcomes. Every engagement follows a proven methodology designed to 
                deliver measurable results.
              </p>

              <div className="space-y-4">
                {approachSteps.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 group">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center font-bold text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                      {item.step}
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                        {item.title}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Core Skills */}
            <div>
              <h3 className="text-3xl font-bold mb-6 text-foreground">
                Core <span className="text-primary">Expertise</span>
              </h3>
              <div className="flex flex-wrap gap-3">
                {skills.map((skill, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="px-4 py-2 text-sm bg-primary/10 text-primary border-primary/20 hover:bg-primary hover:text-primary-foreground transition-all duration-300 cursor-default"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Experience */}
          <div className="space-y-8">
            <h3 className="text-3xl font-bold text-foreground">
              Professional <span className="text-primary">Journey</span>
            </h3>
            
            <div className="space-y-6">
              {experiences.map((exp, index) => (
                <Card
                  key={index}
                  className="relative overflow-hidden border-border/50 hover:border-primary/30 transition-all duration-500 group bg-card/80 backdrop-blur-sm hover:shadow-lg hover:shadow-primary/10"
                >
                  {/* Left Border Accent */}
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-primary/50 group-hover:w-2 transition-all duration-300"></div>
                  
                  <CardContent className="p-6 pl-8">
                    <div className="space-y-4">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <h4 className="font-bold text-foreground group-hover:text-primary transition-colors duration-300 leading-tight">
                            {exp.role}
                          </h4>
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-2">
                            <span className="text-muted-foreground font-medium">
                              {exp.company}
                            </span>
                            <span className="text-sm text-muted-foreground bg-secondary/50 px-3 py-1 rounded-full">
                              {exp.period}
                            </span>
                          </div>
                        </div>
                        
                        {/* Highlight Badge */}
                        <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap">
                          {exp.highlight}
                        </div>
                      </div>
                      
                      <p className="text-muted-foreground leading-relaxed">
                        {exp.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Experience Summary */}
            <div className="bg-gradient-to-br from-primary/5 to-secondary/10 rounded-2xl p-6 border border-primary/10">
              <div className="grid grid-cols-2 gap-6 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary mb-1">8+</div>
                  <div className="text-sm text-muted-foreground">Years Experience</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary mb-1">14</div>
                  <div className="text-sm text-muted-foreground">Countries Served</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}