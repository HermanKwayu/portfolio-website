import React from 'react';
import { QRScannerApp } from './components/QRScannerApp';

export default function MobileScanner() {
  return (
    <div className="min-h-screen bg-gray-50">
      <QRScannerApp />
    </div>
  );
}