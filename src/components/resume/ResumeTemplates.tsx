import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

interface Template {
  id: string;
  name: string;
  category: string;
  description: string;
  features: string[];
  preview: string;
}

const templates: Template[] = [
  {
    id: 'modern-professional',
    name: 'Modern Professional',
    category: 'Corporate',
    description: 'Clean, modern design perfect for corporate environments and traditional industries.',
    features: ['ATS-Friendly', 'Two-Column Layout', 'Professional Typography', 'Skills Section'],
    preview: `
      <div class="bg-white p-6 text-black text-xs leading-tight">
        <div class="mb-4">
          <h1 class="text-lg font-bold text-slate-800 mb-1">JOHN DEVELOPER</h1>
          <p class="text-slate-600">Full Stack Developer</p>
          <p class="text-slate-500 text-xs">john@email.com • +255 123 456 789 • Dar es Salaam</p>
        </div>
        
        <div class="grid grid-cols-3 gap-4">
          <div class="col-span-2">
            <div class="mb-3">
              <h2 class="font-semibold text-sm text-slate-800 border-b border-slate-300 pb-1 mb-2">EXPERIENCE</h2>
              <div class="mb-2">
                <h3 class="font-medium text-xs text-slate-800">Senior Developer</h3>
                <p class="text-xs text-slate-600">Tech Company • 2020 - Present</p>
                <p class="text-xs text-slate-500 mt-1">Led development of web applications...</p>
              </div>
            </div>
            
            <div class="mb-3">
              <h2 class="font-semibold text-sm text-slate-800 border-b border-slate-300 pb-1 mb-2">EDUCATION</h2>
              <div>
                <h3 class="font-medium text-xs text-slate-800">Bachelor of Computer Science</h3>
                <p class="text-xs text-slate-600">University of Dar es Salaam • 2018</p>
              </div>
            </div>
          </div>
          
          <div>
            <div class="mb-3">
              <h2 class="font-semibold text-sm text-slate-800 border-b border-slate-300 pb-1 mb-2">SKILLS</h2>
              <div class="text-xs text-slate-600 space-y-1">
                <p>• React & Node.js</p>
                <p>• Python & Django</p>
                <p>• SQL & NoSQL</p>
                <p>• Cloud Platforms</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `
  },
  {
    id: 'creative-designer',
    name: 'Creative Designer',
    category: 'Creative',
    description: 'Eye-catching design with creative elements, perfect for designers and creative professionals.',
    features: ['Visual Appeal', 'Color Accents', 'Portfolio Section', 'Creative Typography'],
    preview: `
      <div class="bg-gradient-to-r from-blue-50 to-purple-50 p-6 text-xs leading-tight">
        <div class="bg-white rounded-lg p-4 shadow-sm">
          <div class="text-center mb-4">
            <h1 class="text-lg font-bold text-purple-800 mb-1">SARAH DESIGNER</h1>
            <div class="w-16 h-1 bg-purple-500 mx-auto mb-2"></div>
            <p class="text-slate-600">UI/UX Designer</p>
            <p class="text-slate-500 text-xs">sarah@email.com • Portfolio: sarah-designs.com</p>
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <div class="mb-3">
                <h2 class="font-semibold text-sm text-purple-800 mb-2">EXPERIENCE</h2>
                <div class="border-l-2 border-purple-200 pl-3">
                  <h3 class="font-medium text-xs text-slate-800">Lead Designer</h3>
                  <p class="text-xs text-slate-600">Creative Agency • 2021 - Present</p>
                </div>
              </div>
              
              <div>
                <h2 class="font-semibold text-sm text-purple-800 mb-2">PROJECTS</h2>
                <div class="text-xs text-slate-600">
                  <p class="mb-1">• Mobile Banking App</p>
                  <p class="mb-1">• E-commerce Platform</p>
                  <p>• Brand Identity System</p>
                </div>
              </div>
            </div>
            
            <div>
              <div class="mb-3">
                <h2 class="font-semibold text-sm text-purple-800 mb-2">SKILLS</h2>
                <div class="flex flex-wrap gap-1">
                  <span class="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">Figma</span>
                  <span class="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">Adobe CC</span>
                  <span class="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">Sketch</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `
  },
  {
    id: 'executive-premium',
    name: 'Executive Premium',
    category: 'Executive',
    description: 'Sophisticated design for senior professionals, executives, and leadership roles.',
    features: ['Executive Summary', 'Achievement Focus', 'Premium Typography', 'Leadership Emphasis'],
    preview: `
      <div class="bg-slate-50 p-6 text-black text-xs leading-tight">
        <div class="bg-white p-4 border-t-4 border-slate-800">
          <div class="border-b border-slate-200 pb-3 mb-4">
            <h1 class="text-lg font-bold text-slate-800 tracking-wide mb-1">MICHAEL EXECUTIVE</h1>
            <p class="text-slate-600 font-medium">Chief Technology Officer</p>
            <p class="text-slate-500 text-xs">michael@company.com • +255 987 654 321 • LinkedIn: /michael-exec</p>
          </div>
          
          <div class="mb-3">
            <h2 class="font-bold text-sm text-slate-800 tracking-wide mb-2">EXECUTIVE SUMMARY</h2>
            <p class="text-xs text-slate-700 leading-relaxed">
              Strategic technology leader with 15+ years driving digital transformation...
            </p>
          </div>
          
          <div class="grid grid-cols-2 gap-6">
            <div>
              <h2 class="font-bold text-sm text-slate-800 tracking-wide mb-2">LEADERSHIP EXPERIENCE</h2>
              <div class="mb-2">
                <h3 class="font-semibold text-xs text-slate-800">Chief Technology Officer</h3>
                <p class="text-xs text-slate-600 font-medium">Global Tech Corp • 2018 - Present</p>
                <ul class="text-xs text-slate-600 mt-1 ml-2">
                  <li>• Led 50+ engineering team</li>
                  <li>• Increased revenue by 300%</li>
                </ul>
              </div>
            </div>
            
            <div>
              <h2 class="font-bold text-sm text-slate-800 tracking-wide mb-2">KEY ACHIEVEMENTS</h2>
              <div class="text-xs text-slate-700 space-y-1">
                <p>• $50M+ budget management</p>
                <p>• 10 successful product launches</p>
                <p>• Industry recognition awards</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `
  },
  {
    id: 'tech-minimal',
    name: 'Tech Minimal',
    category: 'Technology',
    description: 'Clean, minimal design optimized for tech roles and software developers.',
    features: ['GitHub Integration', 'Project Showcase', 'Tech Stack Emphasis', 'Minimal Design'],
    preview: `
      <div class="bg-gray-900 p-6 text-xs leading-tight text-white">
        <div class="bg-white text-black p-4">
          <div class="flex items-start justify-between mb-4">
            <div>
              <h1 class="text-lg font-mono font-bold text-green-600 mb-1">alex_developer</h1>
              <p class="text-slate-700">Full Stack Engineer</p>
            </div>
            <div class="text-right text-xs text-slate-600">
              <p>github.com/alexdev</p>
              <p>alex@dev.com</p>
            </div>
          </div>
          
          <div class="bg-slate-50 p-3 rounded mb-3">
            <p class="text-xs text-slate-700 font-mono">
              $ Building scalable web applications with modern tech stack
            </p>
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <h2 class="font-mono font-bold text-sm text-slate-800 mb-2">// experience</h2>
              <div class="mb-2">
                <h3 class="font-medium text-xs text-slate-800">Senior Developer</h3>
                <p class="text-xs text-slate-600">StartupCo • 2022 - Present</p>
                <div class="font-mono text-xs text-green-600 mt-1">
                  <p>→ React, Node.js, AWS</p>
                </div>
              </div>
            </div>
            
            <div>
              <h2 class="font-mono font-bold text-sm text-slate-800 mb-2">// tech_stack</h2>
              <div class="font-mono text-xs text-slate-700 space-y-1">
                <p><span class="text-green-600">></span> JavaScript, Python</p>
                <p><span class="text-green-600">></span> React, Django</p>
                <p><span class="text-green-600">></span> PostgreSQL, Redis</p>
                <p><span class="text-green-600">></span> Docker, Kubernetes</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `
  }
];

interface ResumeTemplatesProps {
  onSelectTemplate: (templateId: string) => void;
}

export function ResumeTemplates({ onSelectTemplate }: ResumeTemplatesProps) {
  return (
    <div className="space-y-6">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold mb-4">Choose Your Template</h2>
        <p className="text-muted-foreground text-lg">
          Select from our professionally designed templates. Each template is optimized for 
          Applicant Tracking Systems (ATS) and modern hiring practices.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {templates.map((template) => (
          <Card key={template.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
            <CardContent className="p-0">
              {/* Template Preview */}
              <div className="h-64 overflow-hidden bg-gray-50">
                <div 
                  className="transform scale-75 origin-top-left w-[133%] h-[133%]"
                  dangerouslySetInnerHTML={{ __html: template.preview }}
                />
              </div>

              {/* Template Info */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-lg mb-1">{template.name}</h3>
                    <Badge variant="secondary" className="mb-2">{template.category}</Badge>
                  </div>
                </div>

                <p className="text-muted-foreground text-sm mb-4">{template.description}</p>

                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-2">Features:</h4>
                  <div className="flex flex-wrap gap-1">
                    {template.features.map((feature, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button 
                  onClick={() => onSelectTemplate(template.id)}
                  className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                >
                  Use This Template
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Additional Info */}
      <div className="bg-muted/50 rounded-lg p-6 text-center">
        <h3 className="font-semibold mb-2">All Templates Include</h3>
        <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
          <span>✓ ATS-Friendly Format</span>
          <span>✓ Professional Typography</span>
          <span>✓ Mobile-Responsive</span>
          <span>✓ Easy Customization</span>
          <span>✓ Multiple Export Formats</span>
        </div>
      </div>
    </div>
  );
}