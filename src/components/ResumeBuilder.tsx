import React, { useState, useEffect } from 'react';
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
  const [showPDFModal, setShowPDFModal] = useState(false);

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
          // Handle different download methods based on format
          const downloadUrl = result.downloadUrl;
          const fileName = result.fileName || `${resumeData.personalInfo.fullName.replace(/\s+/g, '_')}_Resume.${format}`;
          
          if (format === 'pdf') {
            // Open in new tab for PDF generation
            const newWindow = window.open(downloadUrl, '_blank');
            if (newWindow) {
              // Show professional modal instructions
              setTimeout(() => {
                setShowPDFModal(true);
              }, 1000);
            } else {
              // Fallback if popup blocked
              const link = document.createElement('a');
              link.href = downloadUrl;
              link.target = '_blank';
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              
              setTimeout(() => {
                setShowPDFModal(true);
              }, 500);
            }
          } else {
            // Direct download for DOCX
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }
          
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
          
          console.log(`✅ Resume generated successfully: ${format}`);
          
          // Show success message
          if (result.instructions) {
            setDownloadError(''); // Clear any previous errors
            // Could show a success toast here instead of error field
          }
        } else {
          throw new Error(result.error || 'Download failed');
        }
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error occurred' }));
        throw new Error(errorData.error || `Server error (${response.status})`);
      }
    } catch (error) {
      console.error('Download error:', error);
      setDownloadError(`Generation failed: ${error.message || 'Please try again. Make sure all required fields are filled.'}`);
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
                          {isDownloading ? 'Generating...' : 'Generate PDF'}
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => handleDownload('docx')} 
                          className="flex items-center gap-2"
                          disabled={isDownloading}
                        >
                          <Download className="w-4 h-4" />
                          {isDownloading ? 'Generating...' : 'Generate DOCX'}
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
                        {isDownloading ? 'Generating PDF...' : 'Generate PDF'}
                      </Button>
                      <Button 
                        onClick={() => handleDownload('docx')} 
                        variant="outline" 
                        className="w-full border-green-600 text-green-600 hover:bg-green-50"
                        disabled={isDownloading}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        {isDownloading ? 'Generating DOCX...' : 'Generate DOCX'}
                      </Button>
                      {downloadError && (
                        <div className="text-red-600 text-sm mt-3 p-2 bg-red-50 rounded border border-red-200">
                          <div className="font-medium mb-1">Generation Error:</div>
                          {downloadError}
                        </div>
                      )}
                      
                      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-center gap-2 text-blue-700 mb-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="font-medium text-sm">How it works:</span>
                        </div>
                        <ul className="text-xs text-blue-600 space-y-1">
                          <li><strong>PDF:</strong> Opens in new tab - use Ctrl+P and "Save as PDF"</li>
                          <li><strong>DOCX:</strong> Downloads directly - open in Word/Google Docs</li>
                          <li><strong>Mobile:</strong> Use "Share" then "Print" to save as PDF</li>
                        </ul>
                      </div>
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
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L5.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
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

                    {downloadError && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 text-red-700 mb-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L5.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                          </svg>
                          <span className="font-medium text-sm">Generation Issue</span>
                        </div>
                        <p className="text-xs text-red-600 mb-3">{downloadError}</p>
                        <div className="text-xs text-red-600">
                          <strong>Troubleshooting:</strong>
                          <ul className="mt-1 space-y-1 ml-2">
                            <li>• Ensure name and email are filled out</li>
                            <li>• Try refreshing the page and re-entering data</li>
                            <li>• Check your internet connection</li>
                            <li>• Try a different browser if the issue persists</li>
                          </ul>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Professional PDF Generation Modal */}
      {showPDFModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-xl shadow-2xl max-w-md w-full mx-4 transform animate-scale-in">
            <div className="relative">
              {/* Header with gradient background matching your brand */}
              <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-purple-700 p-6 rounded-t-xl">
                <div className="text-center">
                  <h3 className="text-white text-lg font-semibold opacity-75">
                    {resumeData.personalInfo.fullName || 'Professional Resume'}
                  </h3>
                </div>
              </div>
              
              {/* Modal content */}
              <div className="p-6 space-y-4">
                <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                  <p className="text-foreground text-sm leading-relaxed">
                    Your resume has opened in a new tab. Use <span className="font-semibold">Ctrl+P</span> (Cmd+P on Mac) 
                    and select <span className="font-semibold">"Save as PDF"</span> to download the PDF version.
                  </p>
                </div>
                
                {/* Additional helpful instructions */}
                <div className="text-xs text-muted-foreground space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="font-medium">💡</span>
                    <div>
                      <strong>Desktop:</strong> Press Ctrl+P (or Cmd+P), then choose "Save as PDF" as destination
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-medium">📱</span>
                    <div>
                      <strong>Mobile:</strong> Use your browser's "Share" button, then select "Print" or "Save as PDF"
                    </div>
                  </div>
                </div>
                
                <Button 
                  onClick={() => setShowPDFModal(false)}
                  className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-3 rounded-full"
                >
                  OK
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}