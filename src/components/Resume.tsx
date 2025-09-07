import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

export function Resume() {
  const generateResumePDF = () => {
    // This will create a simple text-based resume for download
    // In a real implementation, you might use a library like jsPDF or html2canvas
    const resumeContent = `
HERMAN KWAYU
Project Management Consultant & Digital Innovator

CONTACT INFORMATION
Email: truthherman@gmail.com
LinkedIn: https://www.linkedin.com/in/herman-kwayu-044733135
Location: Tanzania, East Africa

PROFESSIONAL SUMMARY
Strategic Project Management Consultant and Digital Innovator with over 8 years of experience in the telecom and fintech industries. Expertise spans KYC, compliance, customer experience, and technical project management. Successfully led cross-functional teams to deliver complex, high-impact projects while combining strategic insight with innovative digital solutions to help organizations streamline operations, enhance compliance, and drive sustainable growth.

PROFESSIONAL EXPERIENCE

Group Lead KYC & Simswap Compliance and Experience
Airtel Africa HQ | April 2024 - Present
• Leading KYC, SIM swap, and Airtel Money processes to ensure regulatory compliance and seamless customer experience across 14 African countries
• Driving operational excellence while maintaining competitive advantage for the entire continent's operations
• Managing cross-functional teams across multiple jurisdictions

Sr. Tech Project Manager-PMO
Ramani.io, Dar es Salaam, Tanzania | April 2022 - April 2024
• Reported to CTO leading cross-functional teams to deliver complex projects spanning multiple business units
• Managed resources, schedules, and financials while ensuring quality delivery within time and cost constraints
• Contributed to process improvement initiatives and maintained day-to-day project operations

Project Manager-Products and Design
Ramani.io, Dar es Salaam, Tanzania | April 2022 - January 2023
• Reported to CEO managing project execution, budget adherence, and scope delivery
• Developed work breakdown structures for IT projects, coordinated project personnel
• Prepared comprehensive status reports while ensuring quality standards and milestone achievements

Senior Business Simulation Analyst-Customer Experience
Airtel Tanzania Ltd, Dar es Salaam, Tanzania | July 2019 - April 2022
• Led contact and digital project design, CRM maintenance, and product performance analysis
• Achieved 85% customer satisfaction increase through proactive simulation, validation, and quality assurance
• Reduced call center complaints through effective customer-facing issue resolution and process simplification

Revenue Assurance Business Simulation Analyst
Airtel Tanzania Ltd, Dar es Salaam, Tanzania | August 2017 - July 2019
• Ensured no revenue leakage in any revenue stream from both new and existing products
• Conducted thorough analysis and validation of revenue processes

CORE COMPETENCIES
• Project Management
• KYC & Compliance
• Customer Experience
• Revenue Assurance
• Business Simulation
• Product Management
• Process Optimization
• Cross-functional Leadership
• Quality Assurance
• Digital Transformation
• Telecom Operations
• Fintech Solutions

SERVICES OFFERED
• Strategic Planning & Consultation
• Digital Transformation Leadership
• Process Optimization & Automation
• Compliance & Risk Management
• Project Management & Delivery
• Customer Experience Enhancement
• Business Analysis & Innovation

APPROACH
Every engagement begins with discovery to understand objectives, followed by designing and delivering tailored processes, products, and systems that drive measurable results through:
• Discovery and market research
• Experimentation and validation
• UI/UX design
• User testing and feedback
• Implementation and release
• Change management and ongoing support

Generated on: ${new Date().toLocaleDateString()}
    `;

    const blob = new Blob([resumeContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Herman_Kwayu_Resume.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const skills = [
    "Project Management", "KYC & Compliance", "Customer Experience",
    "Revenue Assurance", "Business Simulation", "Product Management",
    "Process Optimization", "Cross-functional Leadership", "Quality Assurance",
    "Digital Transformation", "Telecom Operations", "Fintech Solutions"
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">Professional Resume</h2>
            <p className="text-lg text-muted-foreground">
              Download my complete professional background and expertise summary
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4">Professional Summary</h3>
                  <p className="text-muted-foreground mb-6">
                    Strategic Project Management Consultant and Digital Innovator with over 8 years 
                    of experience in telecom and fintech industries. Proven track record of leading 
                    cross-functional teams, ensuring regulatory compliance, and driving operational excellence 
                    across multiple African markets.
                  </p>
                  
                  <h4 className="font-semibold mb-3">Key Achievements</h4>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span>Led KYC and compliance processes across 14 African countries</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span>Achieved 85% increase in customer satisfaction through process optimization</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span>Successfully managed complex projects spanning multiple business units</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span>Reduced revenue leakage through comprehensive business simulation analysis</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4">Core Competencies</h3>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="text-sm">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="mb-4">
                    <svg className="w-16 h-16 mx-auto text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="font-bold mb-2">Download Resume</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Get my complete professional background in a downloadable format
                  </p>
                  <Button onClick={generateResumePDF} className="w-full" data-track="resume-download">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3" />
                    </svg>
                    Download CV
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold mb-3">Experience Highlights</h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <div className="font-medium">8+ Years</div>
                      <div className="text-muted-foreground">Professional Experience</div>
                    </div>
                    <div>
                      <div className="font-medium">50+ Projects</div>
                      <div className="text-muted-foreground">Successfully Delivered</div>
                    </div>
                    <div>
                      <div className="font-medium">14 Countries</div>
                      <div className="text-muted-foreground">Multi-market Experience</div>
                    </div>
                    <div>
                      <div className="font-medium">Telecom & Fintech</div>
                      <div className="text-muted-foreground">Industry Expertise</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <h4 className="font-medium mb-2">Ready to Collaborate?</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Let's discuss how my expertise can help drive your next project to success.
                  </p>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => {
                      const element = document.getElementById('contact');
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                  >
                    Get in Touch
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}