import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { ArrowLeft, Eye, Download, CheckCircle, Gift } from 'lucide-react';
import { ResumeTemplates } from './resume/ResumeTemplates';
import { ResumeEditor } from './resume/ResumeEditor';
import { ResumePreview } from './resume/ResumePreview';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { analytics } from './NoOpAnalytics';

interface ResumeData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    website: string;
    linkedin: string;
    summary: string;
  };
  experience: Array<{
    id: string;
    company: string;
    position: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
  }>;
  education: Array<{
    id: string;
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
    gpa?: string;
  }>;
  skills: Array<{
    id: string;
    category: string;
    items: string[];
  }>;
  projects: Array<{
    id: string;
    name: string;
    description: string;
    technologies: string[];
    url?: string;
  }>;
  certifications: Array<{
    id: string;
    name: string;
    issuer: string;
    date: string;
    url?: string;
  }>;
}

const initialResumeData: ResumeData = {
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    linkedin: '',
    summary: ''
  },
  experience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: []
};

interface ResumeBuilderProps {
  onBack: () => void;
}

export function ResumeBuilder({ onBack }: ResumeBuilderProps) {
  const [currentStep, setCurrentStep] = useState<'templates' | 'editor' | 'preview'>('templates');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState('');

  // Track resume builder visit
  useEffect(() => {
    analytics.trackResumeBuilderVisit();
  }, []);

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    setCurrentStep('editor');
    
    // Track template selection
    const templateNames = {
      'modern': 'Modern Professional',
      'classic': 'Classic Executive', 
      'creative': 'Creative Designer',
      'minimal': 'Minimal Clean'
    };
    analytics.trackResumeTemplateSelected(templateId, templateNames[templateId as keyof typeof templateNames] || templateId);
  };

  const handleDataUpdate = (newData: ResumeData) => {
    setResumeData(newData);
  };

  const handlePreview = () => {
    setCurrentStep('preview');
    
    // Track resume creation
    const templateNames = {
      'modern': 'Modern Professional',
      'classic': 'Classic Executive', 
      'creative': 'Creative Designer',
      'minimal': 'Minimal Clean'
    };
    
    const hasContent = !!(resumeData.personalInfo.fullName && resumeData.personalInfo.email);
    analytics.trackResumeCreated(
      selectedTemplate, 
      templateNames[selectedTemplate as keyof typeof templateNames] || selectedTemplate,
      hasContent
    );
  };

  const handleDownload = async (format: 'pdf' | 'docx') => {
    setDownloadError('');
    setIsDownloading(true);

    try {
      // Validate required data
      if (!resumeData.personalInfo.fullName || !resumeData.personalInfo.email) {
        setDownloadError('Please fill in your name and email before downloading.');
        setIsDownloading(false);
        return;
      }

      // Call the free download endpoint
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-4d80a1b0/generate-resume`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({
          resumeData,
          template: selectedTemplate,
          format
        })
      });

      if (response.ok) {
        const result = await response.json();
        
        if (result.success) {
          // Create download link and trigger download
          const downloadUrl = result.downloadUrl;
          const link = document.createElement('a');
          link.href = downloadUrl;
          link.download = `${resumeData.personalInfo.fullName.replace(/\s+/g, '_')}_Resume.${format}`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          // Track successful download
          const templateNames = {
            'modern': 'Modern Professional',
            'classic': 'Classic Executive', 
            'creative': 'Creative Designer',
            'minimal': 'Minimal Clean'
          };
          analytics.trackResumeDownloaded(
            selectedTemplate, 
            templateNames[selectedTemplate as keyof typeof templateNames] || selectedTemplate,
            format.toUpperCase()
          );
          
          console.log(`✅ Resume downloaded successfully: ${format}`);
        } else {
          throw new Error(result.error || 'Download failed');
        }
      } else {
        const errorText = await response.text();
        throw new Error(`Download failed (${response.status}): ${errorText}`);
      }
    } catch (error) {
      console.error('Download error:', error);
      setDownloadError(`Download failed: ${error.message || 'Please try again.'}`);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Portfolio
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Resume Builder</h1>
                <p className="text-muted-foreground">Create professional resumes in minutes</p>
                <p className="text-xs text-green-600 mt-1">🔒 Privacy-first: Your data is never stored or saved</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Gift className="w-3 h-3" />
                Free Download
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                No Payment Required
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-4 mb-8">
          <div className={`flex items-center gap-2 ${currentStep === 'templates' ? 'text-primary' : 'text-muted-foreground'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
              currentStep === 'templates' ? 'border-primary bg-primary text-primary-foreground' : 
              selectedTemplate ? 'border-primary bg-primary text-primary-foreground' : 'border-muted-foreground'
            }`}>
              1
            </div>
            <span className="font-medium">Choose Template</span>
          </div>
          <div className={`w-8 h-0.5 ${selectedTemplate ? 'bg-primary' : 'bg-muted-foreground/30'}`} />
          <div className={`flex items-center gap-2 ${currentStep === 'editor' ? 'text-primary' : 'text-muted-foreground'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
              currentStep === 'editor' ? 'border-primary bg-primary text-primary-foreground' : 
              currentStep === 'preview' ? 'border-primary bg-primary text-primary-foreground' :
              'border-muted-foreground'
            }`}>
              2
            </div>
            <span className="font-medium">Edit Details</span>
          </div>
          <div className={`w-8 h-0.5 ${currentStep === 'preview' ? 'bg-primary' : 'bg-muted-foreground/30'}`} />
          <div className={`flex items-center gap-2 ${currentStep === 'preview' ? 'text-primary' : 'text-muted-foreground'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
              currentStep === 'preview' ? 'border-primary bg-primary text-primary-foreground' : 'border-muted-foreground'
            }`}>
              3
            </div>
            <span className="font-medium">Preview & Download</span>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {currentStep === 'templates' && (
            <ResumeTemplates onSelectTemplate={handleTemplateSelect} />
          )}

          {currentStep === 'editor' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      Resume Editor
                      <Button variant="outline" onClick={handlePreview} className="flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        Preview
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResumeEditor 
                      data={resumeData}
                      onDataUpdate={handleDataUpdate}
                      onPreview={handlePreview}
                    />
                  </CardContent>
                </Card>
              </div>
              <div className="lg:sticky lg:top-24">
                <Card>
                  <CardHeader>
                    <CardTitle>Live Preview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="scale-75 origin-top-left transform-gpu">
                      <ResumePreview 
                        template={selectedTemplate}
                        data={resumeData}
                        previewMode={true}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {currentStep === 'preview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      Final Preview
                      <div className="flex gap-2">
                        <Button variant="outline" onClick={() => setCurrentStep('editor')}>
                          Edit
                        </Button>
                        <Button 
                          onClick={() => handleDownload('pdf')} 
                          className="flex items-center gap-2"
                          disabled={isDownloading}
                        >
                          <Download className="w-4 h-4" />
                          {isDownloading ? 'Generating...' : 'Download PDF'}
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => handleDownload('docx')} 
                          className="flex items-center gap-2"
                          disabled={isDownloading}
                        >
                          <Download className="w-4 h-4" />
                          {isDownloading ? 'Generating...' : 'Download DOCX'}
                        </Button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResumePreview 
                      template={selectedTemplate}
                      data={resumeData}
                      previewMode={false}
                    />
                  </CardContent>
                </Card>
              </div>
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Gift className="w-5 h-5 text-green-600" />
                      Free Download
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center p-6 border rounded-lg bg-green-50 border-green-200">
                      <h3 className="font-semibold text-lg mb-2 text-green-800">Professional Resume</h3>
                      <p className="text-green-700 mb-4">High-quality PDF and Word formats</p>
                      <div className="text-3xl font-bold text-green-600 mb-4">FREE</div>
                      <Button 
                        onClick={() => handleDownload('pdf')} 
                        className="w-full mb-2 bg-green-600 hover:bg-green-700"
                        disabled={isDownloading}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        {isDownloading ? 'Generating PDF...' : 'Download PDF'}
                      </Button>
                      <Button 
                        onClick={() => handleDownload('docx')} 
                        variant="outline" 
                        className="w-full border-green-600 text-green-600 hover:bg-green-50"
                        disabled={isDownloading}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        {isDownloading ? 'Generating DOCX...' : 'Download DOCX'}
                      </Button>
                      {downloadError && (
                        <div className="text-red-600 text-sm mt-3 p-2 bg-red-50 rounded">
                          {downloadError}
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium text-green-800">What you get:</h4>
                      <ul className="text-sm text-green-700 space-y-1">
                        <li>• High-resolution PDF format</li>
                        <li>• Editable Word document</li>
                        <li>• Professional formatting</li>
                        <li>• ATS-friendly layout</li>
                        <li>• Instant download</li>
                      </ul>
                    </div>

                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
                      <div className="flex items-center gap-2 text-green-700 text-sm">
                        <CheckCircle className="w-4 h-4" />
                        <span className="font-medium">100% Free & Private</span>
                      </div>
                      <p className="text-xs text-green-600 mt-1">
                        No hidden costs, no data storage, no sign-up required. Your information stays private!
                      </p>
                    </div>

                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-2 text-blue-700 text-sm mb-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        <span className="font-medium">Privacy Promise</span>
                      </div>
                      <ul className="text-xs text-blue-600 space-y-1">
                        <li>• Your resume data is never saved or stored</li>
                        <li>• No user accounts or profiles created</li>
                        <li>• Information processed only during generation</li>
                        <li>• No tracking or data collection</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>


    </div>
  );
}