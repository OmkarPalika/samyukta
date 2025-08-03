'use client';

import { useState, useEffect } from 'react';
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
  isStartupOnly?: boolean;
  isHackathonOnly?: boolean;
  slots: {
    workshops: {
      cloud: { remaining: number; closed: boolean };
      ai: { remaining: number; closed: boolean };
      cybersecurity: { remaining: number; closed: boolean };
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
  isStartupOnly = false,
  isHackathonOnly = false,
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

  // Initialize tracks for startup-only tickets
  useEffect(() => {
    if (isStartupOnly) {
      const tracksNeedUpdate = memberTracks.length !== members.length || 
        memberTracks.some(track => track.competitionTrack !== "Startup Pitch" || track.workshopTrack !== "");
      
      if (tracksNeedUpdate) {
        const newTracks = Array(members.length).fill({
          workshopTrack: "",
          competitionTrack: "Startup Pitch"
        });
        onTrackChange(newTracks);
      }
    }
  }, [isStartupOnly, members.length, memberTracks, onTrackChange]);

  // Initialize tracks for hackathon-only tickets
  useEffect(() => {
    if (isHackathonOnly) {
      const tracksNeedUpdate = memberTracks.length !== members.length || 
        memberTracks.some(track => track.competitionTrack !== "Hackathon" || track.workshopTrack !== "");
      
      if (tracksNeedUpdate) {
        const newTracks = Array(members.length).fill({
          workshopTrack: "",
          competitionTrack: "Hackathon"
        });
        onTrackChange(newTracks);
      }
    }
  }, [isHackathonOnly, members.length, memberTracks, onTrackChange]);

  // Handle pitch data updates separately
  useEffect(() => {
    if (isStartupOnly && startupPitchData[0]?.startupName && memberTracks.length > 0) {
      // Only trigger if tracks are not already set correctly
      const tracksAreCorrect = memberTracks.every(track => 
        track.competitionTrack === "Startup Pitch" && track.workshopTrack === ""
      );
      
      if (!tracksAreCorrect) {
        const newTracks = Array(members.length).fill({
          workshopTrack: "",
          competitionTrack: "Startup Pitch"
        });
        onTrackChange(newTracks);
      }
    }
  }, [isStartupOnly, startupPitchData, members.length, memberTracks, onTrackChange]);

  if (isStartupOnly) {
    return (
      <div className="space-y-6">
        <Card className="bg-pink-500/10 border-pink-500/20">
          <CardHeader>
            <CardTitle className="text-pink-400">Startup Pitch Only - Track Selection</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-pink-500/10 border border-pink-500/20 rounded-lg p-4">
              <h4 className="text-pink-400 font-medium mb-2">Your Registration Includes:</h4>
              <ul className="text-gray-300 space-y-1">
                <li>• Startup Pitch Competition</li>
                <li>• Mentorship Sessions</li>
                <li>• Networking Access</li>
                <li>• Meals & Refreshments</li>
                <li>• Certificate of Participation</li>
              </ul>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300">Competition Track (Pre-selected)</Label>
              <div className="bg-gray-700/50 border border-gray-600 rounded-md p-3">
                <div className="flex items-center justify-between">
                  <span className="text-white">Startup Pitch Competition</span>
                  <Badge className="bg-pink-500/10 text-pink-400">Included</Badge>
                </div>
              </div>
            </div>

            {/* Pitch details section */}
            <div className="space-y-2">
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
                <div className="space-y-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // Add a small delay for mobile devices to ensure proper dialog opening
                      setTimeout(() => onOpenPitchDialog(0), 100);
                    }}
                    className="text-purple-400 border-purple-400 hover:bg-purple-400/10 w-full sm:w-auto"
                  >
                    Add Pitch Details for Team
                  </Button>
                  <p className="text-xs text-gray-400">
                    📱 <strong>Mobile users:</strong> If the dialog doesn&apos;t open, try tapping again or refresh the page.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isHackathonOnly) {
    return (
      <div className="space-y-6">
        <Card className="bg-green-500/10 border-green-500/20">
          <CardHeader>
            <CardTitle className="text-green-400">Hackathon Only - Track Selection</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
              <h4 className="text-green-400 font-medium mb-2">Your Registration Includes:</h4>
              <ul className="text-gray-300 space-y-1">
                <li>• 6-hour Hackathon Competition</li>
                <li>• Mentorship & Technical Support</li>
                <li>• Meals & Refreshments</li>
                <li>• Certificate of Participation</li>
                <li>• Access to Prize Pool</li>
                <li>• Networking Opportunities</li>
              </ul>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300">Competition Track (Pre-selected)</Label>
              <div className="bg-gray-700/50 border border-gray-600 rounded-md p-3">
                <div className="flex items-center justify-between">
                  <span className="text-white">6-hour Hackathon</span>
                  <Badge className="bg-green-500/10 text-green-400">Included</Badge>
                </div>
              </div>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
              <h4 className="text-blue-400 font-medium mb-2">Ready to Code!</h4>
              <p className="text-gray-300 text-sm">
                You&apos;re all set for the hackathon. No additional setup required - just bring your coding skills and creativity!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Default return for non-startup-only tickets
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
                <SelectItem value="Cybersecurity" disabled={slots?.workshops.cybersecurity?.closed}>
                  <div className="flex items-center justify-between w-full">
                    <span>Cybersecurity</span>
                    <Badge className={`ml-2 text-xs ${slots?.workshops.cybersecurity?.closed ? 'bg-red-500/10 text-red-400' : 'bg-orange-500/10 text-orange-400'}`}>
                      {slots?.workshops.cybersecurity?.closed ? 'FULL' : `${slots?.workshops.cybersecurity?.remaining || 0} left`}
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