import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { 
  CreditCard, 
  Smartphone, 
  Download, 
  CheckCircle, 
  Loader2,
  Phone,
  FileText,
  Shield,
  Clock,
  AlertTriangle,
  Banknote,
  Lock,
  Zap
} from 'lucide-react';
import { projectId, publicAnonKey } from '../../utils/supabase/info';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (format: string) => void;
  amount: number;
  resumeData: any;
  template: string;
}

export function PaymentModal({ isOpen, onClose, onSuccess, amount, resumeData, template }: PaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<'mobile' | 'card'>('mobile');
  const [mobileProvider, setMobileProvider] = useState<'mpesa' | 'airtel' | 'tigo'>('mpesa');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const [step, setStep] = useState<'method' | 'processing' | 'success'>('method');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    
    // Format as +255 XXX XXX XXX
    if (digits.startsWith('255')) {
      const number = digits.substring(3);
      if (number.length <= 3) return `+255 ${number}`;
      if (number.length <= 6) return `+255 ${number.substring(0, 3)} ${number.substring(3)}`;
      return `+255 ${number.substring(0, 3)} ${number.substring(3, 6)} ${number.substring(6, 9)}`;
    }
    
    // Format 0XXX XXX XXX
    if (digits.startsWith('0')) {
      if (digits.length <= 4) return digits;
      if (digits.length <= 7) return `${digits.substring(0, 4)} ${digits.substring(4)}`;
      return `${digits.substring(0, 4)} ${digits.substring(4, 7)} ${digits.substring(7, 10)}`;
    }
    
    return value;
  };

  const formatCardNumber = (value: string) => {
    const digits = value.replace(/\D/g, '');
    const groups = digits.match(/.{1,4}/g) || [];
    return groups.join(' ').substring(0, 19); // Max 16 digits + 3 spaces
  };

  const handleMobilePayment = async () => {
    setError('');
    
    // Validate phone number
    if (!phoneNumber) {
      setError('Please enter your mobile number');
      return;
    }

    // Validate phone number format (Tanzanian numbers)
    const cleanPhone = phoneNumber.replace(/\s/g, '');
    const phoneRegex = /^(\+255|0)[6-9]\d{8}$/;
    if (!phoneRegex.test(cleanPhone)) {
      setError('Please enter a valid Tanzanian mobile number (e.g., +255 754 123 456 or 0754 123 456)');
      return;
    }

    // Validate resume data before sending
    if (!resumeData?.personalInfo?.email || !resumeData?.personalInfo?.fullName) {
      setError('Please ensure you have entered your name and email in the resume editor before proceeding with payment.');
      return;
    }

    setIsProcessing(true);
    setStep('processing');
    
    try {
      // Send payment request to backend
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-4d80a1b0/process-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({
          amount,
          phoneNumber: cleanPhone,
          provider: mobileProvider,
          type: 'mobile_money',
          resumeData,
          template,
          formats: ['pdf', 'docx']
        })
      });

      if (response.ok) {
        const result = await response.json();
        
        if (result.success) {
          setStep('success');
          setPaymentComplete(true);
          setTimeout(() => {
            onSuccess('both');
            onClose();
            resetModal();
          }, 3000);
        } else {
          throw new Error(result.error || 'Payment processing failed');
        }
      } else {
        const errorText = await response.text();
        throw new Error(`Payment failed (${response.status}): ${errorText}`);
      }
    } catch (error) {
      console.error('Mobile payment error:', error);
      setError(`Payment failed: ${error.message || 'Please try again.'}`);
      setStep('method');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCardPayment = async () => {
    setError('');
    
    // Validate card details
    if (!cardDetails.number || !cardDetails.expiry || !cardDetails.cvv || !cardDetails.name) {
      setError('Please fill in all card details');
      return;
    }

    // Basic card number validation (must be 16 digits)
    const cardNumber = cardDetails.number.replace(/\s/g, '');
    if (!/^\d{16}$/.test(cardNumber)) {
      setError('Please enter a valid 16-digit card number');
      return;
    }

    // Expiry validation (MM/YY format)
    if (!/^\d{2}\/\d{2}$/.test(cardDetails.expiry)) {
      setError('Please enter expiry in MM/YY format');
      return;
    }

    // CVV validation (3-4 digits)
    if (!/^\d{3,4}$/.test(cardDetails.cvv)) {
      setError('Please enter a valid CVV (3-4 digits)');
      return;
    }

    // Validate resume data before sending
    if (!resumeData?.personalInfo?.email || !resumeData?.personalInfo?.fullName) {
      setError('Please ensure you have entered your name and email in the resume editor before proceeding with payment.');
      return;
    }

    setIsProcessing(true);
    setStep('processing');
    
    try {
      // Send card payment request to backend
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-4d80a1b0/process-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({
          amount,
          cardDetails,
          type: 'card',
          resumeData,
          template,
          formats: ['pdf', 'docx']
        })
      });

      if (response.ok) {
        const result = await response.json();
        
        if (result.success) {
          setStep('success');
          setPaymentComplete(true);
          setTimeout(() => {
            onSuccess('both');
            onClose();
            resetModal();
          }, 3000);
        } else {
          throw new Error(result.error || 'Payment processing failed');
        }
      } else {
        const errorText = await response.text();
        throw new Error(`Payment failed (${response.status}): ${errorText}`);
      }
    } catch (error) {
      console.error('Card payment error:', error);
      setError(`Payment failed: ${error.message || 'Please try again.'}`);
      setStep('method');
    } finally {
      setIsProcessing(false);
    }
  };

  const resetModal = () => {
    setStep('method');
    setPaymentComplete(false);
    setError('');
    setPhoneNumber('');
    setCardDetails({ number: '', expiry: '', cvv: '', name: '' });
  };

  const getProviderDetails = (provider: string) => {
    switch (provider) {
      case 'mpesa':
        return { name: 'M-Pesa', subtitle: 'Vodacom', color: 'bg-red-500', textColor: 'text-red-600' };
      case 'airtel':
        return { name: 'Airtel Money', subtitle: 'Airtel', color: 'bg-red-600', textColor: 'text-red-600' };
      case 'tigo':
        return { name: 'Tigo Pesa', subtitle: 'Tigo', color: 'bg-blue-600', textColor: 'text-blue-600' };
      default:
        return { name: 'Mobile Money', subtitle: '', color: 'bg-gray-500', textColor: 'text-gray-600' };
    }
  };

  // Success Screen
  if (step === 'success') {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <div className="text-center py-8">
            <div className="relative">
              <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
              <div className="absolute -top-1 -right-1 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Zap className="w-4 h-4 text-green-600" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-green-600 mb-3">Payment Successful!</h2>
            <p className="text-lg text-muted-foreground mb-6">
              Your professional resume is being generated
            </p>
            <div className="flex items-center justify-center gap-3 text-sm text-muted-foreground bg-green-50 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-green-600" />
                <span className="font-medium">PDF Ready</span>
              </div>
              <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-green-600" />
                <span className="font-medium">DOCX Ready</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Downloads will start automatically...
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Processing Screen
  if (step === 'processing') {
    const providerDetails = getProviderDetails(mobileProvider);
    
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <div className="text-center py-8">
            <div className="relative mb-6">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                {paymentMethod === 'mobile' ? (
                  <Smartphone className="w-4 h-4 text-white" />
                ) : (
                  <CreditCard className="w-4 h-4 text-white" />
                )}
              </div>
            </div>
            <h2 className="text-2xl font-bold text-blue-600 mb-3">Processing Payment</h2>
            <p className="text-muted-foreground mb-6">
              {paymentMethod === 'mobile' 
                ? `Please check your ${providerDetails.name} app and enter your PIN to complete the payment`
                : 'Securely processing your card payment...'
              }
            </p>
            {paymentMethod === 'mobile' && (
              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <div className="flex items-center justify-center gap-2 text-sm text-blue-700">
                  <Clock className="w-4 h-4" />
                  <span>Waiting for confirmation from {providerDetails.name}</span>
                </div>
              </div>
            )}
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Shield className="w-3 h-3" />
              <span>Secure payment processing</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Main Payment Form
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Download className="w-5 h-5 text-white" />
            </div>
            Complete Payment - {amount.toLocaleString()} TSH
          </DialogTitle>
          <DialogDescription className="text-lg">
            Choose your preferred payment method to download your professional resume in PDF and Word formats.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            <AlertDescription className="text-red-700">
              {error}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Options */}
          <div className="lg:col-span-2">
            <Tabs value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as 'mobile' | 'card')}>
              <TabsList className="grid w-full grid-cols-2 h-14">
                <TabsTrigger value="mobile" className="flex items-center gap-3 text-base">
                  <Smartphone className="w-5 h-5" />
                  <div className="text-left">
                    <div>Mobile Money</div>
                    <div className="text-xs text-muted-foreground">Most Popular</div>
                  </div>
                </TabsTrigger>
                <TabsTrigger value="card" className="flex items-center gap-3 text-base">
                  <CreditCard className="w-5 h-5" />
                  <div className="text-left">
                    <div>Visa/Mastercard</div>
                    <div className="text-xs text-muted-foreground">International</div>
                  </div>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="mobile" className="space-y-6 mt-6">
                <Card className="border-2">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <Phone className="w-4 h-4 text-green-600" />
                      </div>
                      Mobile Money Payment
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <Label className="text-base font-medium">Select Provider</Label>
                      <div className="grid grid-cols-3 gap-3 mt-3">
                        {(['mpesa', 'airtel', 'tigo'] as const).map((provider) => {
                          const details = getProviderDetails(provider);
                          return (
                            <Button
                              key={provider}
                              variant={mobileProvider === provider ? 'default' : 'outline'}
                              onClick={() => setMobileProvider(provider)}
                              className={`h-20 flex flex-col gap-2 relative ${
                                mobileProvider === provider ? details.color + ' text-white' : ''
                              }`}
                            >
                              <span className="font-bold text-lg">{details.name}</span>
                              <span className="text-xs opacity-80">{details.subtitle}</span>
                              {mobileProvider === provider && (
                                <CheckCircle className="w-4 h-4 absolute top-2 right-2" />
                              )}
                            </Button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="phone" className="text-base font-medium">Mobile Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+255 754 123 456"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(formatPhoneNumber(e.target.value))}
                        className="mt-2 h-12 text-lg"
                      />
                    </div>

                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
                      <h4 className="font-semibold mb-3 text-blue-900 flex items-center gap-2">
                        <Zap className="w-4 h-4" />
                        How it works:
                      </h4>
                      <ol className="space-y-2 text-sm text-blue-800">
                        <li className="flex items-center gap-2">
                          <span className="w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
                          Click "Pay Now" below
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
                          You'll receive a payment prompt on your phone
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
                          Enter your PIN to confirm payment
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">4</span>
                          Your resume will download automatically
                        </li>
                      </ol>
                    </div>

                    <Button 
                      onClick={handleMobilePayment} 
                      className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700" 
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                          Processing Payment...
                        </>
                      ) : (
                        <>
                          <Banknote className="w-5 h-5 mr-3" />
                          Pay {amount.toLocaleString()} TSH with {getProviderDetails(mobileProvider).name}
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="card" className="space-y-6 mt-6">
                <Card className="border-2">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <CreditCard className="w-4 h-4 text-blue-600" />
                      </div>
                      Visa / Mastercard Payment
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <Label htmlFor="cardName" className="text-base font-medium">Cardholder Name</Label>
                      <Input
                        id="cardName"
                        placeholder="John Doe"
                        value={cardDetails.name}
                        onChange={(e) => setCardDetails(prev => ({ ...prev, name: e.target.value }))}
                        className="mt-2 h-12 text-lg"
                      />
                    </div>

                    <div>
                      <Label htmlFor="cardNumber" className="text-base font-medium">Card Number</Label>
                      <Input
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={cardDetails.number}
                        onChange={(e) => setCardDetails(prev => ({ ...prev, number: formatCardNumber(e.target.value) }))}
                        className="mt-2 h-12 text-lg font-mono"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiry" className="text-base font-medium">Expiry Date</Label>
                        <Input
                          id="expiry"
                          placeholder="MM/YY"
                          value={cardDetails.expiry}
                          onChange={(e) => {
                            let value = e.target.value.replace(/\D/g, '');
                            if (value.length >= 2) {
                              value = value.substring(0, 2) + '/' + value.substring(2, 4);
                            }
                            setCardDetails(prev => ({ ...prev, expiry: value }));
                          }}
                          className="mt-2 h-12 text-lg font-mono"
                          maxLength={5}
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvv" className="text-base font-medium">CVV</Label>
                        <Input
                          id="cvv"
                          placeholder="123"
                          value={cardDetails.cvv}
                          onChange={(e) => setCardDetails(prev => ({ ...prev, cvv: e.target.value.replace(/\D/g, '').substring(0, 4) }))}
                          className="mt-2 h-12 text-lg font-mono"
                          maxLength={4}
                        />
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl border">
                      <div className="flex items-center gap-3 text-sm text-gray-700">
                        <Lock className="w-4 h-4 text-green-600" />
                        <span className="font-medium">Secured by 256-bit SSL encryption</span>
                      </div>
                      <p className="text-xs text-gray-600 mt-2">
                        Your card information is encrypted and secure. We never store your card details.
                      </p>
                    </div>

                    <Button 
                      onClick={handleCardPayment} 
                      className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700" 
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                          Processing Payment...
                        </>
                      ) : (
                        <>
                          <Lock className="w-5 h-5 mr-3" />
                          Pay {amount.toLocaleString()} TSH Securely
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-900">
                  <FileText className="w-5 h-5" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2">
                    <span className="font-medium">Professional Resume</span>
                    <span className="font-bold text-lg">{amount.toLocaleString()} TSH</span>
                  </div>
                  <div className="flex justify-between items-center text-sm text-muted-foreground">
                    <span>Template</span>
                    <Badge variant="outline" className="bg-white">
                      {template.charAt(0).toUpperCase() + template.slice(1)}
                    </Badge>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-lg">Total</span>
                    <span className="font-bold text-2xl text-green-600">{amount.toLocaleString()} TSH</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-blue-900">You will receive:</h4>
                  <div className="space-y-3">
                    {[
                      { icon: FileText, text: 'High-quality PDF document', color: 'text-red-600' },
                      { icon: FileText, text: 'Editable Word document', color: 'text-blue-600' },
                      { icon: CheckCircle, text: 'ATS-optimized format', color: 'text-green-600' },
                      { icon: CheckCircle, text: 'Professional design', color: 'text-purple-600' }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <item.icon className={`w-4 h-4 ${item.color}`} />
                        <span className="text-sm">{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg border border-yellow-200">
                  <p className="text-sm text-yellow-800">
                    <span className="font-bold">💡 One-time payment</span> - Download your resume anytime, anywhere!
                  </p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 text-green-700 text-sm">
                    <Shield className="w-4 h-4" />
                    <span className="font-medium">100% Secure Payment</span>
                  </div>
                  <p className="text-xs text-green-600 mt-1">
                    Your payment is protected by enterprise-grade security
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}