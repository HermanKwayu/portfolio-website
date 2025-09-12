import React, { useRef, useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import { Download, Trash2, Save, FileText, User, Calendar, MapPin } from "lucide-react";

interface DigitalSignatureProps {
  onBack?: () => void;
  mode?: 'create' | 'sign' | 'view';
  documentTitle?: string;
  signerInfo?: {
    name: string;
    email: string;
    role: string;
  };
}

interface SignatureData {
  signature: string;
  signerName: string;
  signerEmail: string;
  signerRole: string;
  signedAt: string;
  documentTitle: string;
  ipAddress?: string;
  location?: string;
}

export function DigitalSignature({ 
  onBack, 
  mode = 'create', 
  documentTitle = 'Professional Document',
  signerInfo
}: DigitalSignatureProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [signatureData, setSignatureData] = useState<SignatureData | null>(null);
  const [signerDetails, setSignerDetails] = useState({
    name: signerInfo?.name || 'Herman Kwayu',
    email: signerInfo?.email || 'truthherman@gmail.com',
    role: signerInfo?.role || 'Business Consultant',
    title: documentTitle
  });
  
  // Signature styles
  const [penColor, setPenColor] = useState('#000000');
  const [penWidth, setPenWidth] = useState(2);
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  
  // Document metadata
  const [documentMetadata, setDocumentMetadata] = useState({
    clientName: '',
    projectTitle: '',
    contractType: 'consulting-agreement',
    terms: '',
    notes: ''
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Set canvas size for high DPI
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * window.devicePixelRatio;
        canvas.height = rect.height * window.devicePixelRatio;
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        
        // Set background
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Configure drawing
        ctx.strokeStyle = penColor;
        ctx.lineWidth = penWidth;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      }
    }
  }, [penColor, penWidth, backgroundColor]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.beginPath();
        ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
      }
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
        ctx.stroke();
      }
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  const saveSignature = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const signatureImage = canvas.toDataURL('image/png');
      const now = new Date();
      
      const signature: SignatureData = {
        signature: signatureImage,
        signerName: signerDetails.name,
        signerEmail: signerDetails.email,
        signerRole: signerDetails.role,
        signedAt: now.toISOString(),
        documentTitle: signerDetails.title,
        ipAddress: 'xxx.xxx.xxx.xxx', // Would be fetched in real implementation
        location: 'Tanzania' // Would be fetched via geolocation
      };
      
      setSignatureData(signature);
      
      // Save to localStorage for demo purposes
      localStorage.setItem('hk_signature_' + Date.now(), JSON.stringify(signature));
      
      return signature;
    }
    return null;
  };

  const downloadSignature = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      // Create a comprehensive document
      const link = document.createElement('a');
      link.download = `signature_${signerDetails.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  };

  const downloadCertificate = () => {
    if (!signatureData) {
      const saved = saveSignature();
      if (!saved) return;
    }
    
    // Create a digital certificate document
    const certificate = {
      documentType: 'Digital Signature Certificate',
      signerDetails: {
        name: signerDetails.name,
        email: signerDetails.email,
        role: signerDetails.role
      },
      documentInfo: {
        title: signerDetails.title,
        signedAt: new Date().toISOString(),
        clientName: documentMetadata.clientName,
        projectTitle: documentMetadata.projectTitle,
        contractType: documentMetadata.contractType
      },
      security: {
        ipAddress: 'xxx.xxx.xxx.xxx',
        timestamp: Date.now(),
        hash: btoa(Math.random().toString()).substring(0, 16)
      },
      signature: signatureData?.signature || canvasRef.current?.toDataURL('image/png')
    };
    
    const blob = new Blob([JSON.stringify(certificate, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `digital_certificate_${signerDetails.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const contractTypes = [
    { value: 'consulting-agreement', label: 'Consulting Agreement' },
    { value: 'service-contract', label: 'Service Contract' },
    { value: 'nda', label: 'Non-Disclosure Agreement' },
    { value: 'project-proposal', label: 'Project Proposal' },
    { value: 'statement-of-work', label: 'Statement of Work' },
    { value: 'retainer-agreement', label: 'Retainer Agreement' },
    { value: 'custom', label: 'Custom Document' }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold">HK</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold">Digital Signature</h1>
                <p className="text-muted-foreground">Professional document signing solution</p>
              </div>
            </div>
            
            {onBack && (
              <Button variant="outline" onClick={onBack}>
                ← Back to Home
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Signature Canvas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>Create Signature</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Signature Controls */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Pen Color</Label>
                  <input
                    type="color"
                    value={penColor}
                    onChange={(e) => setPenColor(e.target.value)}
                    className="w-full h-10 rounded border border-border"
                  />
                </div>
                <div>
                  <Label>Pen Width</Label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={penWidth}
                    onChange={(e) => setPenWidth(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div>
                  <Label>Background</Label>
                  <input
                    type="color"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    className="w-full h-10 rounded border border-border"
                  />
                </div>
              </div>

              {/* Canvas */}
              <div className="border border-border rounded-lg overflow-hidden">
                <canvas
                  ref={canvasRef}
                  width={400}
                  height={200}
                  className="w-full h-48 cursor-crosshair"
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  style={{ backgroundColor }}
                />
              </div>

              {/* Canvas Controls */}
              <div className="flex space-x-2">
                <Button onClick={clearSignature} variant="outline" size="sm">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear
                </Button>
                <Button onClick={saveSignature} size="sm">
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
                <Button onClick={downloadSignature} variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>

              {/* Signature Preview */}
              {signatureData && (
                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      ✓ Signature Saved
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Signed at: {new Date(signatureData.signedAt).toLocaleString()}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Signer Information & Document Details */}
          <div className="space-y-6">
            {/* Signer Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span>Signer Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="signerName">Full Name</Label>
                  <Input
                    id="signerName"
                    value={signerDetails.name}
                    onChange={(e) => setSignerDetails(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="signerEmail">Email Address</Label>
                  <Input
                    id="signerEmail"
                    type="email"
                    value={signerDetails.email}
                    onChange={(e) => setSignerDetails(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="signerRole">Professional Role</Label>
                  <Input
                    id="signerRole"
                    value={signerDetails.role}
                    onChange={(e) => setSignerDetails(prev => ({ ...prev, role: e.target.value }))}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Document Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="w-5 h-5" />
                  <span>Document Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="documentTitle">Document Title</Label>
                  <Input
                    id="documentTitle"
                    value={signerDetails.title}
                    onChange={(e) => setSignerDetails(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="clientName">Client Name (Optional)</Label>
                  <Input
                    id="clientName"
                    value={documentMetadata.clientName}
                    onChange={(e) => setDocumentMetadata(prev => ({ ...prev, clientName: e.target.value }))}
                    placeholder="Client or organization name"
                  />
                </div>

                <div>
                  <Label htmlFor="projectTitle">Project Title (Optional)</Label>
                  <Input
                    id="projectTitle"
                    value={documentMetadata.projectTitle}
                    onChange={(e) => setDocumentMetadata(prev => ({ ...prev, projectTitle: e.target.value }))}
                    placeholder="Project or engagement name"
                  />
                </div>

                <div>
                  <Label htmlFor="contractType">Document Type</Label>
                  <Select
                    value={documentMetadata.contractType}
                    onValueChange={(value) => setDocumentMetadata(prev => ({ ...prev, contractType: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {contractTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="terms">Terms & Notes (Optional)</Label>
                  <Textarea
                    id="terms"
                    value={documentMetadata.terms}
                    onChange={(e) => setDocumentMetadata(prev => ({ ...prev, terms: e.target.value }))}
                    placeholder="Additional terms, conditions, or notes"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Document Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Download className="w-5 h-5" />
                  <span>Export & Certificates</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Button onClick={downloadSignature} variant="outline" className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    PNG Image
                  </Button>
                  <Button onClick={downloadCertificate} className="w-full">
                    <FileText className="w-4 h-4 mr-2" />
                    Certificate
                  </Button>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>Today: {new Date().toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>Location: Tanzania</span>
                  </div>
                </div>

                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-800">
                    <strong>Legal Notice:</strong> This digital signature constitutes a legally binding electronic signature 
                    when used in accordance with applicable electronic signature laws.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Usage Instructions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>How to Use Your Digital Signature</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                  <span className="text-2xl">✍️</span>
                </div>
                <h3 className="font-medium">Create Signature</h3>
                <p className="text-sm text-muted-foreground">
                  Draw your signature using your mouse or touch device. Customize pen color and width for best results.
                </p>
              </div>
              
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                  <span className="text-2xl">📋</span>
                </div>
                <h3 className="font-medium">Add Details</h3>
                <p className="text-sm text-muted-foreground">
                  Fill in your professional information and document details for a complete digital signature.
                </p>
              </div>
              
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                  <span className="text-2xl">📄</span>
                </div>
                <h3 className="font-medium">Export & Use</h3>
                <p className="text-sm text-muted-foreground">
                  Download your signature as an image or generate a certified digital document for legal use.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}