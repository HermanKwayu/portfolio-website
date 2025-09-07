import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Heart, Briefcase, PartyPopper, GraduationCap, Calendar, MapPin, Clock, Upload, Eye, Edit, Palette, Image, Sparkles } from 'lucide-react';
import { unsplash_tool } from '../tools/unsplash';

interface TemplateData {
  id: string;
  name: string;
  type: 'wedding' | 'corporate' | 'birthday' | 'graduation' | 'conference' | 'other';
  category: 'elegant' | 'modern' | 'classic' | 'fun' | 'professional';
  backgroundImage?: string;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  font: 'serif' | 'sans' | 'script' | 'display';
  layout: 'centered' | 'split' | 'overlay' | 'card';
  preview: string;
  customizable: {
    backgroundImage: boolean;
    colors: boolean;
    fonts: boolean;
    layout: boolean;
  };
}

interface InvitationTemplatesProps {
  eventData: any;
  onTemplateSelect: (template: TemplateData) => void;
  onCustomizeTemplate: (template: TemplateData, customizations: any) => void;
}

export function InvitationTemplates({ eventData, onTemplateSelect, onCustomizeTemplate }: InvitationTemplatesProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateData | null>(null);
  const [showCustomizer, setShowCustomizer] = useState(false);
  const [customizations, setCustomizations] = useState({
    backgroundImage: '',
    backgroundColor: '',
    textColor: '',
    accentColor: '',
    font: 'sans',
    layout: 'centered'
  });
  const [loadingBackground, setLoadingBackground] = useState(false);

  const templates: TemplateData[] = [
    // Wedding Templates
    {
      id: 'wedding-elegant',
      name: 'Elegant Romance',
      type: 'wedding',
      category: 'elegant',
      backgroundColor: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%)',
      textColor: '#831843',
      accentColor: '#ec4899',
      font: 'serif',
      layout: 'centered',
      preview: 'Sophisticated floral design with gold accents',
      customizable: {
        backgroundImage: true,
        colors: true,
        fonts: true,
        layout: true,
      }
    },
    {
      id: 'wedding-modern',
      name: 'Modern Minimalist',
      type: 'wedding',
      category: 'modern',
      backgroundColor: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      textColor: '#1e293b',
      accentColor: '#0ea5e9',
      font: 'sans',
      layout: 'split',
      preview: 'Clean lines with geometric patterns',
      customizable: {
        backgroundImage: true,
        colors: true,
        fonts: true,
        layout: true,
      }
    },
    {
      id: 'wedding-vintage',
      name: 'Vintage Garden',
      type: 'wedding',
      category: 'classic',
      backgroundColor: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
      textColor: '#92400e',
      accentColor: '#d97706',
      font: 'script',
      layout: 'overlay',
      preview: 'Vintage botanicals with hand-lettered fonts',
      customizable: {
        backgroundImage: true,
        colors: true,
        fonts: true,
        layout: false,
      }
    },

    // Corporate Templates
    {
      id: 'corporate-professional',
      name: 'Executive Professional',
      type: 'corporate',
      category: 'professional',
      backgroundColor: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
      textColor: '#f8fafc',
      accentColor: '#3b82f6',
      font: 'sans',
      layout: 'card',
      preview: 'Professional corporate design with company branding',
      customizable: {
        backgroundImage: true,
        colors: true,
        fonts: false,
        layout: true,
      }
    },
    {
      id: 'corporate-modern',
      name: 'Modern Business',
      type: 'corporate',
      category: 'modern',
      backgroundColor: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
      textColor: '#334155',
      accentColor: '#0f172a',
      font: 'sans',
      layout: 'split',
      preview: 'Contemporary design with bold typography',
      customizable: {
        backgroundImage: true,
        colors: true,
        fonts: true,
        layout: true,
      }
    },

    // Birthday Templates
    {
      id: 'birthday-celebration',
      name: 'Celebration Party',
      type: 'birthday',
      category: 'fun',
      backgroundColor: 'linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%)',
      textColor: '#9a3412',
      accentColor: '#ea580c',
      font: 'display',
      layout: 'centered',
      preview: 'Colorful and festive with party elements',
      customizable: {
        backgroundImage: true,
        colors: true,
        fonts: true,
        layout: true,
      }
    },
    {
      id: 'birthday-elegant',
      name: 'Elegant Birthday',
      type: 'birthday',
      category: 'elegant',
      backgroundColor: 'linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)',
      textColor: '#581c87',
      accentColor: '#8b5cf6',
      font: 'serif',
      layout: 'overlay',
      preview: 'Sophisticated birthday celebration design',
      customizable: {
        backgroundImage: true,
        colors: true,
        fonts: true,
        layout: true,
      }
    },

    // Graduation Templates
    {
      id: 'graduation-classic',
      name: 'Academic Achievement',
      type: 'graduation',
      category: 'classic',
      backgroundColor: 'linear-gradient(135deg, #1e3a8a 0%, #3730a3 100%)',
      textColor: '#f8fafc',
      accentColor: '#fbbf24',
      font: 'serif',
      layout: 'centered',
      preview: 'Traditional academic colors with graduation cap',
      customizable: {
        backgroundImage: true,
        colors: true,
        fonts: false,
        layout: false,
      }
    }
  ];

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'wedding': return <Heart className="w-5 h-5" />;
      case 'corporate': return <Briefcase className="w-5 h-5" />;
      case 'birthday': return <PartyPopper className="w-5 h-5" />;
      case 'graduation': return <GraduationCap className="w-5 h-5" />;
      default: return <Calendar className="w-5 h-5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'elegant': return 'bg-purple-100 text-purple-800';
      case 'modern': return 'bg-blue-100 text-blue-800';
      case 'classic': return 'bg-green-100 text-green-800';
      case 'fun': return 'bg-orange-100 text-orange-800';
      case 'professional': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const generateBackgroundImage = async (searchTerm: string) => {
    try {
      setLoadingBackground(true);
      const imageUrl = await unsplash_tool({ query: searchTerm });
      setCustomizations(prev => ({ ...prev, backgroundImage: imageUrl }));
    } catch (error) {
      console.error('Failed to fetch background image:', error);
    } finally {
      setLoadingBackground(false);
    }
  };

  const renderTemplatePreview = (template: TemplateData) => {
    const bgStyle = template.backgroundImage 
      ? { backgroundImage: `url(${template.backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }
      : { background: template.backgroundColor };

    return (
      <div 
        className="w-full h-48 rounded-lg relative overflow-hidden border"
        style={bgStyle}
      >
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 h-full flex flex-col justify-center items-center text-center p-4">
          <div style={{ color: template.textColor }} className="space-y-2">
            <div className="flex items-center justify-center mb-2" style={{ color: template.accentColor }}>
              {getEventIcon(template.type)}
            </div>
            <h3 className={`text-lg font-bold ${template.font === 'serif' ? 'font-serif' : template.font === 'script' ? 'font-cursive' : 'font-sans'}`}>
              {eventData?.title || 'Event Title'}
            </h3>
            <p className="text-sm opacity-90">
              {eventData?.date ? new Date(eventData.date).toLocaleDateString() : 'Event Date'}
            </p>
            <p className="text-xs opacity-75">
              {eventData?.venue || 'Event Venue'}
            </p>
          </div>
        </div>
      </div>
    );
  };

  const TemplateCustomizer = ({ template }: { template: TemplateData }) => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="font-medium mb-3">Template Preview</h4>
          {renderTemplatePreview({
            ...template,
            ...customizations,
            backgroundColor: customizations.backgroundColor || template.backgroundColor,
            textColor: customizations.textColor || template.textColor,
            accentColor: customizations.accentColor || template.accentColor,
          })}
        </div>
        <div className="space-y-4">
          <div>
            <Label>Background Image</Label>
            <div className="flex space-x-2 mt-1">
              <Input
                value={customizations.backgroundImage}
                onChange={(e) => setCustomizations(prev => ({ ...prev, backgroundImage: e.target.value }))}
                placeholder="Enter image URL or upload"
              />
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => generateBackgroundImage(`${eventData?.type || 'event'} background`)}
                disabled={loadingBackground}
              >
                {loadingBackground ? <Sparkles className="w-4 h-4 animate-spin" /> : <Image className="w-4 h-4" />}
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {['wedding flowers', 'corporate office', 'birthday party', 'graduation ceremony', 'conference hall'].map((term) => (
                <Button
                  key={term}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => generateBackgroundImage(term)}
                  disabled={loadingBackground}
                >
                  {term}
                </Button>
              ))}
            </div>
          </div>

          {template.customizable.colors && (
            <>
              <div>
                <Label>Background Color</Label>
                <Input
                  type="color"
                  value={customizations.backgroundColor}
                  onChange={(e) => setCustomizations(prev => ({ ...prev, backgroundColor: e.target.value }))}
                  className="h-10 mt-1"
                />
              </div>
              <div>
                <Label>Text Color</Label>
                <Input
                  type="color"
                  value={customizations.textColor}
                  onChange={(e) => setCustomizations(prev => ({ ...prev, textColor: e.target.value }))}
                  className="h-10 mt-1"
                />
              </div>
              <div>
                <Label>Accent Color</Label>
                <Input
                  type="color"
                  value={customizations.accentColor}
                  onChange={(e) => setCustomizations(prev => ({ ...prev, accentColor: e.target.value }))}
                  className="h-10 mt-1"
                />
              </div>
            </>
          )}

          {template.customizable.fonts && (
            <div>
              <Label>Font Style</Label>
              <Select
                value={customizations.font}
                onValueChange={(value) => setCustomizations(prev => ({ ...prev, font: value }))}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sans">Sans Serif</SelectItem>
                  <SelectItem value="serif">Serif</SelectItem>
                  <SelectItem value="script">Script</SelectItem>
                  <SelectItem value="display">Display</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {template.customizable.layout && (
            <div>
              <Label>Layout Style</Label>
              <Select
                value={customizations.layout}
                onValueChange={(value) => setCustomizations(prev => ({ ...prev, layout: value }))}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="centered">Centered</SelectItem>
                  <SelectItem value="split">Split Layout</SelectItem>
                  <SelectItem value="overlay">Text Overlay</SelectItem>
                  <SelectItem value="card">Card Style</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Choose Your Invitation Template</h2>
        <p className="text-muted-foreground">
          Select and customize a professional template for your {eventData?.type || 'event'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates
          .filter(template => !eventData?.type || template.type === eventData.type || template.type === 'other')
          .map((template) => (
            <Card key={template.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="text-primary">
                      {getEventIcon(template.type)}
                    </div>
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                  </div>
                  <Badge className={getCategoryColor(template.category)}>
                    {template.category}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {renderTemplatePreview(template)}
                
                <p className="text-sm text-muted-foreground">{template.preview}</p>
                
                <div className="flex flex-wrap gap-1">
                  {template.customizable.backgroundImage && <Badge variant="outline" className="text-xs">🖼️ Background</Badge>}
                  {template.customizable.colors && <Badge variant="outline" className="text-xs">🎨 Colors</Badge>}
                  {template.customizable.fonts && <Badge variant="outline" className="text-xs">📝 Fonts</Badge>}
                  {template.customizable.layout && <Badge variant="outline" className="text-xs">📐 Layout</Badge>}
                </div>
                
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => onTemplateSelect(template)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Use Template
                  </Button>
                  <Dialog open={showCustomizer && selectedTemplate?.id === template.id} onOpenChange={setShowCustomizer}>
                    <DialogTrigger asChild>
                      <Button 
                        size="sm"
                        onClick={() => {
                          setSelectedTemplate(template);
                          setCustomizations({
                            backgroundImage: template.backgroundImage || '',
                            backgroundColor: template.backgroundColor,
                            textColor: template.textColor,
                            accentColor: template.accentColor,
                            font: template.font,
                            layout: template.layout
                          });
                        }}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Customize
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl">
                      <DialogHeader>
                        <DialogTitle className="flex items-center">
                          <Palette className="w-5 h-5 mr-2" />
                          Customize {template.name}
                        </DialogTitle>
                        <DialogDescription>
                          Personalize your invitation template with custom colors, fonts, and background images.
                        </DialogDescription>
                      </DialogHeader>
                      {selectedTemplate && <TemplateCustomizer template={selectedTemplate} />}
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setShowCustomizer(false)}>
                          Cancel
                        </Button>
                        <Button onClick={() => {
                          if (selectedTemplate) {
                            onCustomizeTemplate(selectedTemplate, customizations);
                            setShowCustomizer(false);
                          }
                        }}>
                          Apply Customizations
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>

      {templates.filter(template => !eventData?.type || template.type === eventData.type).length === 0 && (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-lg font-medium mb-2">No Templates Available</h3>
          <p className="text-muted-foreground">
            We're working on adding more templates for this event type.
          </p>
        </div>
      )}
    </div>
  );
}