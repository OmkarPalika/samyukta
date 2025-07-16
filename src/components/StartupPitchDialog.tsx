'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, X } from 'lucide-react';

interface StartupPitchData {
  startupName: string;
  pitchCategory: string;
  briefDescription: string;
  problemStatement: string;
  targetMarket: string;
  currentStage: string;
  teamSize: string;
  fundingStatus: string;
  pitchDeck: File | null;
  pitchDeckUrl?: string;
  demoUrl: string;
}

interface StartupPitchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: StartupPitchData) => void;
  initialData?: StartupPitchData;
}

const defaultData: StartupPitchData = {
  startupName: '',
  pitchCategory: '',
  briefDescription: '',
  problemStatement: '',
  targetMarket: '',
  currentStage: '',
  teamSize: '',
  fundingStatus: '',
  pitchDeck: null,
  demoUrl: ''
};

export default function StartupPitchDialog({ open, onOpenChange, onSave, initialData }: StartupPitchDialogProps) {
  const [data, setData] = useState<StartupPitchData>(initialData || defaultData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState(false);

  const pitchCategories = ['Early Stage', 'Growth Stage', 'Social Impact', 'Tech Innovation', 'Other'];
  const currentStages = ['Idea Stage', 'Prototype', 'MVP', 'Revenue Generating', 'Scaling'];
  const fundingStatuses = ['Self-funded', 'Angel Investment', 'VC Funded', 'Grant Funded', 'Seeking Investment', 'Not Applicable'];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!data.startupName) newErrors.startupName = 'Startup/Project name is required';
    if (!data.pitchCategory) newErrors.pitchCategory = 'Pitch category is required';
    if (!data.briefDescription) newErrors.briefDescription = 'Brief description is required';
    else if (data.briefDescription.split(' ').filter(word => word.length > 0).length < 150 || data.briefDescription.split(' ').filter(word => word.length > 0).length > 300) {
      newErrors.briefDescription = 'Description must be 150-300 words';
    }
    if (!data.problemStatement) newErrors.problemStatement = 'Problem statement is required';
    else if (data.problemStatement.split(' ').filter(word => word.length > 0).length < 100 || data.problemStatement.split(' ').filter(word => word.length > 0).length > 200) {
      newErrors.problemStatement = 'Problem statement must be 100-200 words';
    }
    if (!data.targetMarket) newErrors.targetMarket = 'Target market is required';
    if (!data.currentStage) newErrors.currentStage = 'Current stage is required';
    if (!data.teamSize) newErrors.teamSize = 'Team size is required';
    else if (isNaN(Number(data.teamSize)) || Number(data.teamSize) < 1) {
      newErrors.teamSize = 'Team size must be a valid number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (validateForm()) {
      setUploading(true);
      let uploadedData = { ...data };
      
      if (data.pitchDeck) {
        try {
          const formData = new FormData();
          formData.append('file', data.pitchDeck);
          
          const response = await fetch('/api/upload/pitch-deck', {
            method: 'POST',
            body: formData
          });
          
          if (response.ok) {
            const result = await response.json();
            uploadedData = { ...uploadedData, pitchDeck: null, pitchDeckUrl: result.file_url };
          } else {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Upload failed');
          }
        } catch (error) {
          console.error('Upload failed:', error);
          alert(`Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
          setUploading(false);
          return;
        }
      }
      
      setUploading(false);
      onSave(uploadedData);
      onOpenChange(false);
    }
  };

  const handleCancel = () => {
    setData(defaultData);
    setErrors({});
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gray-800 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white">Startup Pitch Details</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-gray-300">Startup/Project Name *</Label>
              <Input
                value={data.startupName}
                onChange={(e) => setData({ ...data, startupName: e.target.value })}
                className="bg-gray-700/50 border-gray-600 text-white"
                placeholder="Enter startup/project name"
              />
              {errors.startupName && <p className="text-red-400 text-sm">{errors.startupName}</p>}
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300">Pitch Category *</Label>
              <Select value={data.pitchCategory} onValueChange={(value) => setData({ ...data, pitchCategory: value })}>
                <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {pitchCategories.map((category) => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.pitchCategory && <p className="text-red-400 text-sm">{errors.pitchCategory}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-300">Brief Description * (150-300 words)</Label>
            <Textarea
              value={data.briefDescription}
              onChange={(e) => setData({ ...data, briefDescription: e.target.value })}
              className="bg-gray-700/50 border-gray-600 text-white min-h-[100px]"
              placeholder="Describe your startup/project..."
            />
            <div className="text-xs text-gray-400">
              {data.briefDescription.split(' ').filter(word => word.length > 0).length} words
            </div>
            {errors.briefDescription && <p className="text-red-400 text-sm">{errors.briefDescription}</p>}
          </div>

          <div className="space-y-2">
            <Label className="text-gray-300">Problem Statement * (100-200 words)</Label>
            <Textarea
              value={data.problemStatement}
              onChange={(e) => setData({ ...data, problemStatement: e.target.value })}
              className="bg-gray-700/50 border-gray-600 text-white min-h-[80px]"
              placeholder="What problem are you solving?"
            />
            <div className="text-xs text-gray-400">
              {data.problemStatement.split(' ').filter(word => word.length > 0).length} words
            </div>
            {errors.problemStatement && <p className="text-red-400 text-sm">{errors.problemStatement}</p>}
          </div>

          <div className="space-y-2">
            <Label className="text-gray-300">Target Market *</Label>
            <Input
              value={data.targetMarket}
              onChange={(e) => setData({ ...data, targetMarket: e.target.value })}
              className="bg-gray-700/50 border-gray-600 text-white"
              placeholder="Describe your target audience/market"
            />
            {errors.targetMarket && <p className="text-red-400 text-sm">{errors.targetMarket}</p>}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-gray-300">Current Stage *</Label>
              <Select value={data.currentStage} onValueChange={(value) => setData({ ...data, currentStage: value })}>
                <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
                  <SelectValue placeholder="Select current stage" />
                </SelectTrigger>
                <SelectContent>
                  {currentStages.map((stage) => (
                    <SelectItem key={stage} value={stage}>{stage}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.currentStage && <p className="text-red-400 text-sm">{errors.currentStage}</p>}
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300">Team Size *</Label>
              <Input
                type="number"
                min="1"
                value={data.teamSize}
                onChange={(e) => setData({ ...data, teamSize: e.target.value })}
                className="bg-gray-700/50 border-gray-600 text-white"
                placeholder="Number of team members"
              />
              {errors.teamSize && <p className="text-red-400 text-sm">{errors.teamSize}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-300">Funding Status (Optional)</Label>
            <Select value={data.fundingStatus} onValueChange={(value) => setData({ ...data, fundingStatus: value })}>
              <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
                <SelectValue placeholder="Select funding status" />
              </SelectTrigger>
              <SelectContent>
                {fundingStatuses.map((status) => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-300">Pitch Deck Upload (Optional, PDF/PPT max 10MB)</Label>
            <div className="border-2 border-dashed border-gray-600 rounded-lg p-4">
              {data.pitchDeck ? (
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 text-sm">{data.pitchDeck.name}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setData({ ...data, pitchDeck: null })}
                    className="text-red-400 hover:text-red-300"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <label className="flex flex-col items-center cursor-pointer">
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-gray-400 text-sm">Upload PDF or PowerPoint file</span>
                  <input
                    type="file"
                    accept=".pdf,.ppt,.pptx"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file && file.size <= 10 * 1024 * 1024) {
                        setData({ ...data, pitchDeck: file });
                      }
                    }}
                  />
                </label>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-300">Demo/Website URL (Optional)</Label>
            <Input
              type="url"
              value={data.demoUrl}
              onChange={(e) => setData({ ...data, demoUrl: e.target.value })}
              className="bg-gray-700/50 border-gray-600 text-white"
              placeholder="https://your-demo-or-website.com"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button variant="outline" onClick={handleCancel} className="border-gray-600 text-gray-600">
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={uploading} className="bg-purple-600 hover:bg-purple-700">
            {uploading ? 'Uploading...' : 'Save Details'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}