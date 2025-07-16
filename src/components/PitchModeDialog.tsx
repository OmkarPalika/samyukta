'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink, FileText } from 'lucide-react';


interface PitchModeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectOffline: () => void;
}

export default function PitchModeDialog({ open, onOpenChange, onSelectOffline }: PitchModeDialogProps) {
  const handleOnlineSelection = () => {
    window.open('https://mmkuniverse.vercel.app', '_blank');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-[95vw] sm:w-[90vw] md:w-[80vw] lg:w-[70vw] bg-gray-800 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white text-center">Choose Your Pitch Mode</DialogTitle>
        </DialogHeader>
        
        <div className="grid md:grid-cols-2 gap-4">
          <Card 
            className="bg-gray-700/50 border-gray-600 cursor-pointer hover:bg-gray-700/70 transition-all"
            onClick={handleOnlineSelection}
          >
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <ExternalLink className="w-5 h-5 mr-2" />
                Online Platform
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-gray-300 text-sm">
                  Submit your pitch through our external platform with advanced features
                </p>
                <ul className="text-gray-400 text-xs space-y-1">
                  <li>• Video pitch submission</li>
                  <li>• Advanced analytics</li>
                  <li>• Investor networking</li>
                  <li>• Real-time feedback</li>
                </ul>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Continue Online
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card 
            className="bg-gray-700/50 border-gray-600 cursor-pointer hover:bg-gray-700/70 transition-all"
            onClick={() => {
              onSelectOffline();
              onOpenChange(false);
            }}
          >
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Offline Submission
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-gray-300 text-sm">
                  Fill out the pitch details form as part of your registration
                </p>
                <ul className="text-gray-400 text-xs space-y-1">
                  <li>• Integrated with registration</li>
                  <li>• PDF pitch deck upload</li>
                  <li>• Simple form submission</li>
                  <li>• Quick and easy</li>
                </ul>
                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  Continue Here
                  <FileText className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}