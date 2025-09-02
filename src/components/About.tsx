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
    },
    {
      role: "Sr. Tech Project Manager-PMO",
      company: "Ramani.io, Dar es Salaam, Tanzania",
      period: "April 2022 - April 2024",
      description:
        "Reported to CTO leading cross-functional teams to deliver complex projects spanning multiple business units. Managed resources, schedules, and financials while ensuring quality delivery within time and cost constraints. Contributed to process improvement initiatives and maintained day-to-day project operations.",
    },
    {
      role: "Project Manager-Products and Design",
      company: "Ramani.io, Dar es Salaam, Tanzania",
      period: "April 2022 - January 2023",
      description:
        "Reported to CEO managing project execution, budget adherence, and scope delivery. Developed work breakdown structures for IT projects, coordinated project personnel, and prepared comprehensive status reports while ensuring quality standards and milestone achievements.",
    },
    {
      role: "Senior Business Simulation Analyst-Customer Experience",
      company: "Airtel Tanzania Ltd, Dar es Salaam, Tanzania",
      period: "July 2019 - April 2022",
      description:
        "Led contact and digital project design, CRM maintenance, and product performance analysis. Achieved 85% customer satisfaction increase through proactive simulation, validation, and quality assurance. Reduced call center complaints through effective customer-facing issue resolution and process simplification.",
    },
    {
      role: "Revenue Assurance Business Simulation Analyst",
      company: "Airtel Tanzania Ltd, Dar es Salaam, Tanzania",
      period: "August 2017 - July 2019",
      description:
        "making sure there is no revenue leakage  in any revenue stream from both new and existing Products .",
    },
  ];

  return (
    <section id="about" className="py-20 bg-secondary/10">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            About Me
          </h2>
          <p className="text-lg text-muted-foreground">
            I am a Project Management Consultant and Digital
            Innovator with over 8 years of experience in the
            telecom and fintech industries. My expertise spans
            KYC, compliance, customer experience, and technical
            project management, where I have successfully led
            cross-functional teams to deliver complex,
            high-impact projects. Known for combining strategic
            insight with innovative digital solutions, I help
            organizations streamline operations, enhance
            compliance, and drive sustainable growth.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">
                My Approach
              </h3>
              <p className="text-muted-foreground mb-6">
                I believe in a collaborative, data-driven
                approach that transforms ideas into impactful
                outcomes. Every engagement begins with discovery
                to understand objectives, followed by designing
                and delivering tailored processes, products, and
                systems that drive measurable results.
              </p>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>
                    Discovery and market research
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>
                    Experimentation and validation
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>
                    UI/UX design
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>
                    User testing and feedback
                  </span>
                                  </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>
                    Implementation and release
                  </span>
                                  </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>
                    Change management and ongoing support
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-4">
                Core Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="text-sm"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-2xl font-bold">Experience</h3>
            {experiences.map((exp, index) => (
              <Card
                key={index}
                className="border-l-4 border-l-primary"
              >
                <CardContent className="p-6">
                  <div className="space-y-2">
                    <h4 className="font-bold">{exp.role}</h4>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">
                        {exp.company}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {exp.period}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-3">
                      {exp.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}