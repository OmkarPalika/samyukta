'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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
  teamMembers?: number[]; // Indices of team members participating in the pitch
  externalMembers?: string[]; // Names of external team members not in registration
}

interface StartupPitchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: StartupPitchData) => void;
  initialData?: StartupPitchData;
  registrationTeamSize?: number;
  teamMembers?: Array<{ fullName: string; email: string; }>;
  currentMemberIndex?: number;
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
  demoUrl: '',
  externalMembers: []
};

export default function StartupPitchDialog({ 
  open, 
  onOpenChange, 
  onSave, 
  initialData, 
  registrationTeamSize,
  teamMembers = [],
  currentMemberIndex = 0
}: StartupPitchDialogProps) {
  const [data, setData] = useState<StartupPitchData>(() => {
    const baseData = initialData || defaultData;
    // Set team size from registration if not already set
    if (!baseData.teamSize && registrationTeamSize) {
      return { ...baseData, teamSize: registrationTeamSize.toString() };
    }
    // Initialize teamMembers if not set
    if (!baseData.teamMembers) {
      return { ...baseData, teamMembers: [currentMemberIndex] };
    }
    return baseData;
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState(false);

  // Handle team size change and initialize external members if needed
  const handleTeamSizeChange = (value: string) => {
    // Initialize external members if team size increases beyond registration size
    if (Number(value) > (registrationTeamSize || 1)) {
      const currentExternalCount = data.externalMembers?.length || 0;
      const neededExternalCount = Number(value) - (registrationTeamSize || 1);
      
      if (currentExternalCount < neededExternalCount) {
        // Add empty slots for new external members
        const newExternalMembers = [...(data.externalMembers || [])];
        while (newExternalMembers.length < neededExternalCount) {
          newExternalMembers.push('');
        }
        setData({ ...data, teamSize: value, externalMembers: newExternalMembers });
      } else {
        setData({ ...data, teamSize: value });
      }
    } else {
      // If team size is less than or equal to registration size, no external members needed
      setData({ ...data, teamSize: value, externalMembers: [] });
    }
  };

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
    else if (isNaN(Number(data.teamSize)) || Number(data.teamSize) < 1 || Number(data.teamSize) > 5) {
      newErrors.teamSize = 'Team size must be between 1 and 5';
    }
    
    // Validate team members selection only if team size is changed
    if (Number(data.teamSize) !== (registrationTeamSize || 1) && 
        (!data.teamMembers || data.teamMembers.length === 0)) {
      newErrors.teamMembers = 'Please select at least one team member';
    }
    
    // Validate external members if pitch team size > registration team size
    if (Number(data.teamSize) > (registrationTeamSize || 1)) {
      const externalMembersNeeded = Number(data.teamSize) - (registrationTeamSize || 1);
      const externalMembersAdded = data.externalMembers?.filter(name => name.trim() !== '').length || 0;
      
      if (externalMembersAdded < externalMembersNeeded) {
        newErrors.externalMembers = `Please add ${externalMembersNeeded - externalMembersAdded} more external team member(s)`;
      }
      
      // Check if any external member name is empty
      if (data.externalMembers?.some(name => name.trim() === '')) {
        newErrors.externalMembersEmpty = 'External member names cannot be empty';
      }
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
      <DialogContent className="max-w-4xl w-[95vw] sm:w-[90vw] md:w-[80vw] lg:w-[70vw] max-h-[90vh] overflow-y-auto bg-gray-800 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white">Startup Pitch Details</DialogTitle>
          <DialogDescription className="text-gray-400">
            Fill in your startup pitch information for the competition
          </DialogDescription>
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
              <Label className="text-gray-300">Team Size * (1-5 members)</Label>
              <Input
                type="number"
                min="1"
                max="5"
                value={data.teamSize}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '' || (Number(value) >= 1 && Number(value) <= 5)) {
                    handleTeamSizeChange(value);
                  }
                }}
                className="bg-gray-700/50 border-gray-600 text-white"
                placeholder="Number of team members"
              />
              <p className="text-xs text-gray-400">Editable, but must be between 1-5 members</p>
              {errors.teamSize && <p className="text-red-400 text-sm">{errors.teamSize}</p>}
            </div>
          </div>
          
          {/* Show team members selection if team size is changed from registration team size */}
          {Number(data.teamSize) !== (registrationTeamSize || 1) && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-gray-300">Team Members Participating in Pitch *</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {teamMembers.map((member, index) => (
                    <div key={index} className="flex items-center space-x-2 bg-gray-700/30 p-2 rounded-md">
                      <input
                        type="checkbox"
                        id={`member-${index}`}
                        checked={data.teamMembers?.includes(index) || false}
                        onChange={(e) => {
                          const isChecked = e.target.checked;
                          setData(prev => {
                            const currentMembers = prev.teamMembers || [];
                            if (isChecked && !currentMembers.includes(index)) {
                              return { ...prev, teamMembers: [...currentMembers, index] };
                            } else if (!isChecked) {
                              return { ...prev, teamMembers: currentMembers.filter(i => i !== index) };
                            }
                            return prev;
                          });
                        }}
                        className="rounded border-gray-600"
                      />
                      <label htmlFor={`member-${index}`} className="text-gray-300 text-sm cursor-pointer flex-1">
                        {member.fullName || `Member ${index + 1}`} {index === currentMemberIndex && "(Current)"}
                      </label>
                    </div>
                  ))}
                </div>
                {data.teamMembers?.length === 0 && (
                  <p className="text-yellow-400 text-sm">Please select at least one team member</p>
                )}
              </div>
              
              {/* External team members section - show when pitch team size > registration team size */}
              {Number(data.teamSize) > (registrationTeamSize || 1) && (
                <div className="space-y-2 border-t border-gray-700 pt-4">
                  <Label className="text-gray-300 flex items-center justify-between">
                    <span>External Team Members</span>
                    <span className="text-xs text-gray-400">
                      {data.externalMembers?.length || 0} of {Number(data.teamSize) - (registrationTeamSize || 1)} added
                    </span>
                  </Label>
                  
                  <div className="space-y-2">
                    {data.externalMembers?.map((name, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Input
                          value={name}
                          onChange={(e) => {
                            const newExternalMembers = [...(data.externalMembers || [])];
                            newExternalMembers[index] = e.target.value;
                            setData({ ...data, externalMembers: newExternalMembers });
                          }}
                          className="bg-gray-700/50 border-gray-600 text-white flex-1"
                          placeholder={`External member ${index + 1} name`}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            const newExternalMembers = [...(data.externalMembers || [])];
                            newExternalMembers.splice(index, 1);
                            setData({ ...data, externalMembers: newExternalMembers });
                          }}
                          className="text-red-400 hover:text-red-300 h-10 w-10"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    
                    {(data.externalMembers?.length || 0) < (Number(data.teamSize) - (registrationTeamSize || 1)) && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newExternalMembers = [...(data.externalMembers || []), ''];
                          setData({ ...data, externalMembers: newExternalMembers });
                        }}
                        className="text-blue-400 border-blue-400 hover:bg-blue-400/10 w-full"
                      >
                        Add External Team Member
                      </Button>
                    )}
                    
                    {errors.externalMembers && (
                      <p className="text-red-400 text-sm">{errors.externalMembers}</p>
                    )}
                    {errors.externalMembersEmpty && (
                      <p className="text-red-400 text-sm">{errors.externalMembersEmpty}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

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
            <Label className="text-gray-300">Pitch Deck Upload (Optional, PDF/PPT max 50MB)</Label>
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
              ) : data.pitchDeckUrl ? (
                <div className="flex items-center justify-between bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <Upload className="w-4 h-4 text-green-400" />
                    <span className="text-green-400 text-sm">Pitch deck uploaded</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(data.pitchDeckUrl, '_blank')}
                      className="text-blue-400 hover:text-blue-300"
                    >
                      View
                    </Button>
                    <label className="cursor-pointer">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-400 hover:text-gray-300"
                        asChild
                      >
                        <span>Replace</span>
                      </Button>
                      <input
                        type="file"
                        accept=".pdf,.ppt,.pptx"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file && file.size <= 50 * 1024 * 1024) {
                            setData({ ...data, pitchDeck: file, pitchDeckUrl: undefined });
                          } else if (file && file.size > 50 * 1024 * 1024) {
                            alert('File size must be less than 50MB');
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>
              ) : (
                <label className="flex flex-col items-center cursor-pointer">
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-gray-400 text-sm">Upload PDF or PowerPoint file (max 50MB)</span>
                  <input
                    type="file"
                    accept=".pdf,.ppt,.pptx"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file && file.size <= 50 * 1024 * 1024) {
                        setData({ ...data, pitchDeck: file });
                      } else if (file && file.size > 50 * 1024 * 1024) {
                        alert('File size must be less than 50MB');
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