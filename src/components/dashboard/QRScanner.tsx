'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { Camera, Scan, ZoomIn, ZoomOut } from 'lucide-react';
import { QRGenerator, QRPayload } from '@/lib/qr-generator';

interface QRScannerProps {
  onScan: (data: QRPayload) => void;
  onClose: () => void;
  title: string;
  description?: string;
}

export default function QRScanner({ onScan, onClose, title, description }: QRScannerProps) {
  const [manualInput, setManualInput] = useState('');
  const [error, setError] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [zoom, setZoom] = useState([1]);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        setError('Camera not supported on this device.');
        return;
      }
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        setIsScanning(true);
        
        const track = mediaStream.getVideoTracks()[0];
        const capabilities = track.getCapabilities();
        if ('zoom' in capabilities) {
          await track.applyConstraints({
            advanced: [{ zoom: zoom[0] } as MediaTrackConstraints]
          });
        }
      }
    } catch {
      setError('Camera access denied. Please use manual input.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsScanning(false);
  };

  const handleZoomChange = async (value: number[]) => {
    setZoom(value);
    if (stream && isScanning) {
      const track = stream.getVideoTracks()[0];
      const capabilities = track.getCapabilities();
      if ('zoom' in capabilities) {
        try {
          await track.applyConstraints({
            advanced: [{ zoom: value[0] } as MediaTrackConstraints]
          });
        } catch (error) {
          console.log('Zoom not supported:', error);
        }
      }
    }
  };

  const handleManualSubmit = () => {
    if (!manualInput.trim()) {
      setError('Please enter QR data or participant ID');
      return;
    }

    const qrData = QRGenerator.parseQRData(manualInput);
    if (qrData) {
      onScan(qrData);
      return;
    }

    const mockData: QRPayload = {
      id: manualInput.trim(),
      name: `Participant ${manualInput.trim()}`,
      role: 'participant',
      timestamp: Date.now()
    };
    onScan(mockData);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-md mx-auto bg-gray-800 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white">{title}</DialogTitle>
          {description && (
            <DialogDescription className="text-gray-400">{description}</DialogDescription>
          )}
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-3">
            <div className="aspect-square bg-gray-700 rounded-lg overflow-hidden relative max-w-xs mx-auto">
              {isScanning ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <Camera className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-400 text-sm">Camera preview</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="space-y-3">
              <div className="flex gap-2">
                {!isScanning ? (
                  <Button onClick={startCamera} className="flex-1">
                    <Camera className="w-4 h-4 mr-2" />
                    Start Camera
                  </Button>
                ) : (
                  <Button onClick={stopCamera} variant="outline" className="flex-1">
                    Stop Camera
                  </Button>
                )}
              </div>
              
              {isScanning && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-gray-300 text-sm">Zoom</Label>
                    <span className="text-gray-400 text-xs">{zoom[0].toFixed(1)}x</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ZoomOut className="w-4 h-4 text-gray-400" />
                    <Slider
                      value={zoom}
                      onValueChange={handleZoomChange}
                      max={3}
                      min={1}
                      step={0.1}
                      className="flex-1"
                    />
                    <ZoomIn className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-gray-600">
            <Label className="text-gray-300">Manual Input</Label>
            <Input
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
              placeholder="Enter QR data or participant ID"
              className="bg-gray-700 border-gray-600 text-white"
            />
            <Button onClick={handleManualSubmit} className="w-full">
              <Scan className="w-4 h-4 mr-2" />
              Process Input
            </Button>
          </div>

          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}
          

        </div>
      </DialogContent>
    </Dialog>
  );
}