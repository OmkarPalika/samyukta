'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TeamMemberTrack {
  workshopTrack: string;
  competitionTrack: string;
}

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
  demoUrl: string;
  teamMembers?: number[];
  externalMembers?: string[];
}

interface TeamTrackSelectionProps {
  members: Array<{
    fullName: string;
    email: string;
  }>;
  memberTracks: TeamMemberTrack[];
  startupPitchData: Record<number, StartupPitchData>;
  isComboTicket: boolean;
  slots: {
    workshops: {
      cloud: { remaining: number; closed: boolean };
      ai: { remaining: number; closed: boolean };
    };
    competitions: {
      hackathon: { remaining: number; closed: boolean };
      pitch: { remaining: number; closed: boolean };
    };
  } | null;
  errors: Record<string, string>;
  onTrackChange: (memberTracks: TeamMemberTrack[]) => void;
  onOpenPitchDialog: (memberIndex: number) => void;
}

export default function TeamTrackSelection({
  members,
  memberTracks,
  startupPitchData,
  isComboTicket,
  slots,
  onTrackChange,
  onOpenPitchDialog
}: TeamTrackSelectionProps) {
  const [sharedTracks, setSharedTracks] = useState<{
    workshopTrack: string;
    competitionTrack: string;
  }>(() => {
    // Initialize with existing track data if available
    const firstMemberTrack = memberTracks[0];
    return {
      workshopTrack: firstMemberTrack?.workshopTrack || "",
      competitionTrack: firstMemberTrack?.competitionTrack || ""
    };
  });

  // Ensure memberTracks array is properly initialized
  const ensureTracksInitialized = () => {
    const newTracks = [...memberTracks];
    while (newTracks.length < members.length) {
      newTracks.push({ workshopTrack: "", competitionTrack: "" });
    }
    return newTracks;
  };

  return (
    <div className="space-y-8">
      {/* Shared track selection section */}
      <Card className="bg-blue-500/10 border-blue-500/20">
        <CardHeader>
          <CardTitle className="text-blue-400">Team Track Selection</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-gray-300">Workshop Track for All Team Members</Label>
            <Select
              value={sharedTracks.workshopTrack}
              onValueChange={(value) => {
                setSharedTracks({ ...sharedTracks, workshopTrack: value });
                // Always apply to all members
                const newTracks = ensureTracksInitialized();
                const updatedTracks = newTracks.map(track => ({ ...track, workshopTrack: value }));
                onTrackChange(updatedTracks);
              }}
            >
              <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
                <SelectValue placeholder="Select workshop track for all" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Cloud Computing (AWS)" disabled={slots?.workshops.cloud.closed}>
                  <div className="flex items-center justify-between w-full">
                    <span>Cloud Computing (AWS)</span>
                    <Badge className={`ml-2 text-xs ${slots?.workshops.cloud.closed ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400'}`}>
                      {slots?.workshops.cloud.closed ? 'FULL' : `${slots?.workshops.cloud.remaining || 0} left`}
                    </Badge>
                  </div>
                </SelectItem>
                <SelectItem value="AI/ML (Google)" disabled={slots?.workshops.ai.closed}>
                  <div className="flex items-center justify-between w-full">
                    <span>AI/ML (Google)</span>
                    <Badge className={`ml-2 text-xs ${slots?.workshops.ai.closed ? 'bg-red-500/10 text-red-400' : 'bg-orange-500/10 text-orange-400'}`}>
                      {slots?.workshops.ai.closed ? 'FULL' : `${slots?.workshops.ai.remaining || 0} left`}
                    </Badge>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isComboTicket ? (
            <div className="space-y-2">
              <Label className="text-gray-300">Competition Track for All Team Members</Label>
              <Select
                value={sharedTracks.competitionTrack}
                onValueChange={(value) => {
                  setSharedTracks({ ...sharedTracks, competitionTrack: value });
                  // Always apply to all members
                  const newTracks = ensureTracksInitialized();
                  const updatedTracks = newTracks.map(track => ({ ...track, competitionTrack: value }));
                  onTrackChange(updatedTracks);
                  
                  // Open pitch dialog if needed
                  if (value === "Startup Pitch") {
                    onOpenPitchDialog(0);
                  }
                }}
              >
                <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
                  <SelectValue placeholder="Select competition track for all" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Hackathon" disabled={slots?.competitions.hackathon.closed}>
                    <div className="flex items-center justify-between w-full">
                      <span>Hackathon</span>
                      <Badge className={`ml-2 text-xs ${slots?.competitions.hackathon.closed ? 'bg-red-500/10 text-red-400' : 'bg-blue-500/10 text-blue-400'}`}>
                        {slots?.competitions.hackathon.closed ? 'FULL' : `${slots?.competitions.hackathon.remaining || 0} left`}
                      </Badge>
                    </div>
                  </SelectItem>
                  <SelectItem value="Startup Pitch" disabled={slots?.competitions.pitch.closed}>
                    <div className="flex items-center justify-between w-full">
                      <span>Startup Pitch</span>
                      <Badge className={`ml-2 text-xs ${slots?.competitions.pitch.closed ? 'bg-red-500/10 text-red-400' : 'bg-purple-500/10 text-purple-400'}`}>
                        {slots?.competitions.pitch.closed ? 'FULL' : `${slots?.competitions.pitch.remaining || 0} left`}
                      </Badge>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>

              {sharedTracks.competitionTrack === "Startup Pitch" && (
                <div className="mt-2 space-y-2">
                  {startupPitchData[0] ? (
                    <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="text-purple-400 font-medium text-sm mb-1">Pitch Details Added</h4>
                          <p className="text-gray-300 text-sm">
                            <strong>Startup:</strong> {startupPitchData[0].startupName}
                          </p>
                          <p className="text-gray-300 text-sm">
                            <strong>Category:</strong> {startupPitchData[0].pitchCategory}
                          </p>
                          <p className="text-gray-300 text-sm">
                            <strong>Team Size:</strong> {startupPitchData[0].teamSize} members
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => onOpenPitchDialog(0)}
                          className="text-purple-400 border-purple-400 hover:bg-purple-400/10 ml-2"
                        >
                          Edit
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => onOpenPitchDialog(0)} // Open pitch dialog for team lead
                      className="text-purple-400 border-purple-400 hover:bg-purple-400/10"
                    >
                      Add Pitch Details for Team
                    </Button>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <Label className="text-gray-300">Add-ons for All Team Members</Label>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hackathon-all"
                    checked={sharedTracks.competitionTrack === "Hackathon"}
                    onCheckedChange={(checked) => {
                      const value = checked ? "Hackathon" : "";
                      setSharedTracks({ ...sharedTracks, competitionTrack: value });
                      // Apply to all members
                      const newTracks = ensureTracksInitialized();
                      newTracks.forEach((track, i) => {
                        newTracks[i] = { ...track, competitionTrack: value };
                      });
                      onTrackChange(newTracks);
                    }}
                  />
                  <Label htmlFor="hackathon-all" className="text-gray-300">
                    Hackathon (+₹150 per member)
                    <Badge className={`ml-2 text-xs ${slots?.competitions.hackathon.closed ? 'bg-red-500/10 text-red-400' : 'bg-blue-500/10 text-blue-400'}`}>
                      {slots?.competitions.hackathon.closed ? 'FULL' : `${slots?.competitions.hackathon.remaining || 0} left`}
                    </Badge>
                  </Label>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="pitch-all"
                      checked={sharedTracks.competitionTrack === "Startup Pitch"}
                      onCheckedChange={(checked) => {
                        const value = checked ? "Startup Pitch" : "";
                        setSharedTracks({ ...sharedTracks, competitionTrack: value });
                        // Apply to all members
                        const newTracks = ensureTracksInitialized();
                        newTracks.forEach((track, i) => {
                          newTracks[i] = { ...track, competitionTrack: value };
                        });
                        onTrackChange(newTracks);
                        
                        // Open pitch dialog if needed
                        if (checked) {
                          onOpenPitchDialog(0);
                        }
                      }}
                    />
                    <Label htmlFor="pitch-all" className="text-gray-300">
                      Startup Pitch (+₹100 per member)
                      <Badge className={`ml-2 text-xs ${slots?.competitions.pitch.closed ? 'bg-red-500/10 text-red-400' : 'bg-purple-500/10 text-purple-400'}`}>
                        {slots?.competitions.pitch.closed ? 'FULL' : `${slots?.competitions.pitch.remaining || 0} left`}
                      </Badge>
                    </Label>
                  </div>
                  
                  {sharedTracks.competitionTrack === "Startup Pitch" && (
                    <div className="mt-2 ml-6 space-y-2">
                      {startupPitchData[0] ? (
                        <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="text-purple-400 font-medium text-sm mb-1">Pitch Details Added</h4>
                              <p className="text-gray-300 text-sm">
                                <strong>Startup:</strong> {startupPitchData[0].startupName}
                              </p>
                              <p className="text-gray-300 text-sm">
                                <strong>Category:</strong> {startupPitchData[0].pitchCategory}
                              </p>
                              <p className="text-gray-300 text-sm">
                                <strong>Team Size:</strong> {startupPitchData[0].teamSize} members
                              </p>
                            </div>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => onOpenPitchDialog(0)}
                              className="text-purple-400 border-purple-400 hover:bg-purple-400/10 ml-2"
                            >
                              Edit
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => onOpenPitchDialog(0)} // Open pitch dialog for team lead
                          className="text-purple-400 border-purple-400 hover:bg-purple-400/10"
                        >
                          Add Pitch Details for Team
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}