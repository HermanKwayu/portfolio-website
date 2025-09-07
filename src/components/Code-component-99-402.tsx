import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Alert, AlertDescription } from "./ui/alert";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { QrCode, Camera, CheckCircle, XCircle, User, Clock, MapPin, Users, Smartphone, Download, ScanLine, AlertTriangle, Wifi, WifiOff } from 'lucide-react';
import { toast } from "sonner@2.0.3";

interface QRScannerAppProps {
  eventId?: string;
  organizerMode?: boolean;
}

interface ScannedGuest {
  id: string;
  name: string;
  email: string;
  phone: string;
  category: string;
  checkedIn: boolean;
  checkedInAt?: string;
  qrCode: string;
}

interface ScanResult {
  success: boolean;
  guest?: ScannedGuest;
  error?: string;
  timestamp: string;
}

export function QRScannerApp({ eventId, organizerMode = false }: QRScannerAppProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResults, setScanResults] = useState<ScanResult[]>([]);
  const [checkedInGuests, setCheckedInGuests] = useState<ScannedGuest[]>([]);
  const [eventData, setEventData] = useState<any>(null);
  const [cameraPermission, setCameraPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingScans, setPendingScans] = useState<string[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if running on mobile
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Setup online/offline detection
    const handleOnline = () => {
      setIsOnline(true);
      processPendingScans();
    };
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Load event data if eventId provided
    if (eventId) {
      loadEventData();
    }

    // Request camera permission on mobile
    if (isMobile) {
      requestCameraPermission();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      stopCamera();
    };
  }, [eventId]);

  const loadEventData = async () => {
    try {
      const response = await fetch(`/api/events/${eventId}`);
      if (response.ok) {
        const data = await response.json();
        setEventData(data);
      }
    } catch (error) {
      console.error('Failed to load event data:', error);
    }
  };

  const requestCameraPermission = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      setCameraPermission('granted');
    } catch (error) {
      console.error('Camera permission denied:', error);
      setCameraPermission('denied');
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsScanning(true);
        startQRDetection();
      }
    } catch (error) {
      console.error('Failed to start camera:', error);
      toast.error('Failed to access camera. Please check permissions.');
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsScanning(false);
  };

  const startQRDetection = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    const detectQR = () => {
      if (!isScanning || !video.videoWidth || !video.videoHeight) {
        if (isScanning) {
          requestAnimationFrame(detectQR);
        }
        return;
      }

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context?.drawImage(video, 0, 0);

      try {
        // Use Web APIs or libraries like jsQR for actual QR detection
        // For now, we'll simulate QR detection with click events
        const imageData = context?.getImageData(0, 0, canvas.width, canvas.height);
        // const qrCode = jsQR(imageData.data, imageData.width, imageData.height);
        
        // if (qrCode) {
        //   handleQRCodeDetected(qrCode.data);
        // }
      } catch (error) {
        console.error('QR detection error:', error);
      }

      if (isScanning) {
        requestAnimationFrame(detectQR);
      }
    };

    requestAnimationFrame(detectQR);
  };

  const handleQRCodeDetected = async (qrData: string) => {
    if (!qrData) return;

    // Prevent duplicate scans
    if (scanResults.some(result => result.guest?.qrCode === qrData && Date.now() - new Date(result.timestamp).getTime() < 5000)) {
      return;
    }

    try {
      if (isOnline) {
        await processQRScan(qrData);
      } else {
        // Store for offline processing
        setPendingScans(prev => [...prev, qrData]);
        toast.warning('Offline mode: Scan saved for later processing');
      }
    } catch (error) {
      console.error('QR processing error:', error);
    }
  };

  const processQRScan = async (qrData: string) => {
    try {
      const response = await fetch('/api/events/scan-qr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          qrCode: qrData,
          eventId: eventId,
          timestamp: new Date().toISOString()
        })
      });

      const result = await response.json();
      
      const scanResult: ScanResult = {
        success: result.success,
        guest: result.guest,
        error: result.error,
        timestamp: new Date().toISOString()
      };

      setScanResults(prev => [scanResult, ...prev]);

      if (result.success && result.guest) {
        setCheckedInGuests(prev => {
          const existing = prev.find(g => g.id === result.guest.id);
          if (existing) {
            return prev.map(g => g.id === result.guest.id ? { ...result.guest, checkedIn: true, checkedInAt: new Date().toISOString() } : g);
          }
          return [...prev, { ...result.guest, checkedIn: true, checkedInAt: new Date().toISOString() }];
        });

        toast.success(`✅ ${result.guest.name} checked in successfully!`);
        
        // Vibration feedback on mobile
        if ('vibrate' in navigator) {
          navigator.vibrate(200);
        }
      } else {
        toast.error(`❌ ${result.error || 'Invalid QR code'}`);
        
        // Error vibration
        if ('vibrate' in navigator) {
          navigator.vibrate([100, 50, 100]);
        }
      }
    } catch (error) {
      console.error('Scan processing error:', error);
      toast.error('Failed to process QR scan');
    }
  };

  const processPendingScans = async () => {
    if (pendingScans.length === 0) return;

    for (const qrData of pendingScans) {
      await processQRScan(qrData);
    }
    
    setPendingScans([]);
    toast.success(`Processed ${pendingScans.length} pending scans`);
  };

  const manualQREntry = () => {
    const qrCode = prompt('Enter QR code manually:');
    if (qrCode) {
      handleQRCodeDetected(qrCode);
    }
  };

  const downloadAPKInstructions = () => {
    alert(`To create a native mobile app:

📱 Android App:
1. Use React Native or Flutter
2. Install QR scanner library (react-native-qrcode-scanner)
3. Build APK with: npx react-native build-android

🍎 iOS App:
1. Use React Native or Swift
2. Submit to App Store for distribution
3. Configure camera permissions in Info.plist

🌐 Progressive Web App (Current):
• Works on all devices through browser
• Add to home screen for app-like experience
• Offline capability with service workers

This web version works great on mobile browsers and can be "installed" as a PWA!`);
  };

  const getCheckedInStats = () => {
    const total = checkedInGuests.length;
    const categories = checkedInGuests.reduce((acc, guest) => {
      acc[guest.category] = (acc[guest.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return { total, categories };
  };

  // Simulate QR code detection for demo purposes
  const simulateQRScan = () => {
    const sampleQRCodes = [
      'event_123_guest_456',
      'event_123_guest_789',
      'event_123_guest_101',
      'invalid_qr_code'
    ];
    
    const randomQR = sampleQRCodes[Math.floor(Math.random() * sampleQRCodes.length)];
    handleQRCodeDetected(randomQR);
  };

  const stats = getCheckedInStats();

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* PWA Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2">
          <QrCode className="w-8 h-8 text-primary" />
          <h1 className="text-2xl font-bold">Event QR Scanner</h1>
          {!isOnline && <WifiOff className="w-6 h-6 text-red-500" />}
          {isOnline && <Wifi className="w-6 h-6 text-green-500" />}
        </div>
        
        {eventData && (
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
            <CardContent className="pt-6">
              <h2 className="font-semibold text-lg">{eventData.title}</h2>
              <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground mt-2">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {eventData.venue}
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {new Date(eventData.date).toLocaleDateString()}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {pendingScans.length > 0 && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {pendingScans.length} scans pending sync (offline mode)
            </AlertDescription>
          </Alert>
        )}
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <Users className="w-8 h-8 mx-auto text-green-600 mb-2" />
            <div className="text-2xl font-bold text-green-600">{stats.total}</div>
            <p className="text-sm text-muted-foreground">Checked In</p>
          </CardContent>
        </Card>
        
        {Object.entries(stats.categories).map(([category, count]) => (
          <Card key={category}>
            <CardContent className="pt-6 text-center">
              <div className="text-lg font-semibold">{count}</div>
              <p className="text-sm text-muted-foreground capitalize">{category}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Scanner Interface */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center">
              <Camera className="w-5 h-5 mr-2" />
              QR Code Scanner
            </span>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={manualQREntry}>
                Manual Entry
              </Button>
              <Button variant="outline" size="sm" onClick={downloadAPKInstructions}>
                <Smartphone className="w-4 h-4 mr-2" />
                Native App
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {cameraPermission === 'denied' && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Camera permission denied. Please enable camera access in your browser settings.
              </AlertDescription>
            </Alert>
          )}

          <div className="relative bg-black rounded-lg overflow-hidden" style={{ aspectRatio: '16/9' }}>
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              autoPlay
              playsInline
              muted
            />
            
            {/* Scanning overlay */}
            {isScanning && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-64 h-64 border-2 border-white relative">
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary"></div>
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary"></div>
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary"></div>
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary"></div>
                  
                  <div className="absolute inset-0 flex items-center justify-center">
                    <ScanLine className="w-8 h-8 text-primary animate-pulse" />
                  </div>
                </div>
                <p className="absolute bottom-4 text-white text-center bg-black/50 px-4 py-2 rounded">
                  Position QR code within the frame
                </p>
              </div>
            )}

            {!isScanning && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-800/80">
                <div className="text-center text-white">
                  <QrCode className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>Camera not active</p>
                </div>
              </div>
            )}
          </div>
          
          <canvas ref={canvasRef} className="hidden" />

          <div className="flex justify-center space-x-4">
            {!isScanning ? (
              <Button onClick={startCamera} size="lg" className="flex-1">
                <Camera className="w-5 h-5 mr-2" />
                Start Scanning
              </Button>
            ) : (
              <Button onClick={stopCamera} variant="outline" size="lg" className="flex-1">
                Stop Scanning
              </Button>
            )}
            
            <Button onClick={simulateQRScan} variant="outline" size="lg">
              Demo Scan
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Scans */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Scans</CardTitle>
        </CardHeader>
        <CardContent>
          {scanResults.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <QrCode className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No scans yet</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {scanResults.map((result, index) => (
                <div key={index} className={`flex items-center justify-between p-3 rounded-lg ${
                  result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                }`}>
                  <div className="flex items-center space-x-3">
                    {result.success ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                    <div>
                      <p className="font-medium">
                        {result.guest?.name || 'Unknown Guest'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {result.success ? 'Successfully checked in' : result.error}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={result.success ? 'default' : 'destructive'}>
                      {result.guest?.category || 'Unknown'}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(result.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Checked-in Guests */}
      {organizerMode && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Checked-in Guests</span>
              <Badge variant="outline">{checkedInGuests.length} total</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {checkedInGuests.map((guest) => (
                <div key={guest.id} className="flex items-center justify-between p-2 bg-green-50 rounded">
                  <div className="flex items-center space-x-3">
                    <User className="w-4 h-4 text-green-600" />
                    <div>
                      <p className="font-medium">{guest.name}</p>
                      <p className="text-sm text-muted-foreground">{guest.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge>{guest.category}</Badge>
                    <p className="text-xs text-muted-foreground">
                      {guest.checkedInAt && new Date(guest.checkedInAt).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* PWA Install Prompt */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50">
        <CardContent className="pt-6 text-center">
          <Smartphone className="w-12 h-12 mx-auto mb-3 text-purple-600" />
          <h3 className="font-semibold mb-2">Install as Mobile App</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Add this scanner to your home screen for quick access
          </p>
          <Button variant="outline" onClick={() => alert('Look for "Add to Home Screen" in your browser menu!')}>
            <Download className="w-4 h-4 mr-2" />
            Install App
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}