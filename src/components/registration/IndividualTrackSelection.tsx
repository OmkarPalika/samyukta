'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check } from "lucide-react";

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

interface IndividualTrackSelectionProps {
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

export default function IndividualTrackSelection({
  members,
  memberTracks,
  startupPitchData,
  isComboTicket,
  slots,
  errors,
  onTrackChange,
  onOpenPitchDialog
}: IndividualTrackSelectionProps) {
  // Helper functions for this component instance
  const checkIfPartOfAnotherPitch = (memberIndex: number) => {
    for (const [pitchOwnerIndex, pitchData] of Object.entries(startupPitchData)) {
      const ownerIdx = Number(pitchOwnerIndex);
      if (ownerIdx !== memberIndex && pitchData.teamMembers?.includes(memberIndex)) {
        return true;
      }
    }
    return false;
  };

  const getOwnerName = (memberIndex: number) => {
    for (const [pitchOwnerIndex, pitchData] of Object.entries(startupPitchData)) {
      const ownerIdx = Number(pitchOwnerIndex);
      if (ownerIdx !== memberIndex && pitchData.teamMembers?.includes(memberIndex)) {
        return members[ownerIdx]?.fullName || `Member ${ownerIdx + 1}`;
      }
    }
    return "another team member";
  };

  // Ensure memberTracks array is properly initialized
  const ensureTracksInitialized = () => {
    const newTracks = [...memberTracks];
    while (newTracks.length < members.length) {
      newTracks.push({ workshopTrack: "", competitionTrack: "" });
    }
    return newTracks;
  };

  // Handle workshop track change for a specific member
  const handleWorkshopTrackChange = (index: number, value: string) => {
    const newTracks = ensureTracksInitialized();
    newTracks[index] = { ...newTracks[index], workshopTrack: value };
    onTrackChange(newTracks);
  };

  // Handle competition track change for a specific member
  const handleCompetitionTrackChange = (index: number, value: string) => {
    const newTracks = ensureTracksInitialized();
    newTracks[index] = { ...newTracks[index], competitionTrack: value };
    onTrackChange(newTracks);
  };

  return (
    <div className="space-y-6">
      {members.map((member, index) => {
        const memberTrack = memberTracks[index] || { workshopTrack: "", competitionTrack: "" };
        return (
          <Card key={index} className="bg-gray-800/40 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">
                {member.fullName || `Member ${index + 1}`} {index === 0 && "(Team Lead)"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Workshop track selection */}
              <div className="space-y-2">
                <Label className="text-gray-300">Workshop Track<span className="text-red-500"> *</span></Label>
                <Select
                  value={memberTrack.workshopTrack}
                  onValueChange={(value) => handleWorkshopTrackChange(index, value)}
                >
                  <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
                    <SelectValue placeholder="Select workshop track" />
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
                {errors[`member${index}Workshop`] && <p className="text-red-400 text-sm">{errors[`member${index}Workshop`]}</p>}
              </div>

              {/* Competition track selection */}
              {isComboTicket ? (
                <div className="space-y-2">
                  <Label className="text-gray-300">Competition Track<span className="text-red-500"> *</span></Label>
                  <Select
                    value={memberTrack.competitionTrack}
                    onValueChange={(value) => {
                      handleCompetitionTrackChange(index, value);
                      if (value === "Startup Pitch") {
                        onOpenPitchDialog(index);
                      }
                    }}
                  >
                    <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
                      <SelectValue placeholder="Select competition track" />
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
                  {errors[`member${index}Competition`] && <p className="text-red-400 text-sm">{errors[`member${index}Competition`]}</p>}
                  
                  {/* Startup pitch details */}
                  {memberTrack.competitionTrack === "Startup Pitch" && (
                    <div className="mt-2">
                      {startupPitchData[index] ? (
                        <div className="flex items-center justify-between bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                          <div className="flex flex-col">
                            <div className="flex items-center space-x-2">
                              <Check className="w-4 h-4 text-green-400" />
                              <span className="text-green-400 text-sm font-medium">Pitch details saved</span>
                            </div>
                            {startupPitchData[index]?.externalMembers && startupPitchData[index]?.externalMembers.length > 0 && (
                              <div className="text-xs text-gray-400 mt-1 ml-6">
                                + {startupPitchData[index]?.externalMembers?.length} external team member(s)
                              </div>
                            )}
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => onOpenPitchDialog(index)}
                            className="text-blue-400 hover:text-blue-300 h-auto p-1"
                          >
                            Edit Details
                          </Button>
                        </div>
                      ) : (
                        // Check if this member is part of another member's pitch
                        checkIfPartOfAnotherPitch(index) ? (
                          <div className="flex items-center justify-between bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                            <div className="flex items-center space-x-2">
                              <Check className="w-4 h-4 text-blue-400" />
                              <span className="text-blue-400 text-sm font-medium">
                                Part of {getOwnerName(index)}&apos;s pitch
                              </span>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => onOpenPitchDialog(index)}
                              className="text-blue-400 hover:text-blue-300 h-auto p-1"
                            >
                              View Details
                            </Button>
                          </div>
                        ) : (
                          <>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => onOpenPitchDialog(index)}
                              className="text-purple-400 border-purple-400 hover:bg-purple-400/10"
                            >
                              Add Pitch Details
                            </Button>
                            {errors[`member${index}PitchDetails`] && (
                              <p className="text-red-400 text-sm mt-1">{errors[`member${index}PitchDetails`]}</p>
                            )}
                            </>
                        )
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <Label className="text-gray-300">Add-ons (Optional)</Label>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`hackathon-${index}`}
                        checked={memberTrack.competitionTrack === "Hackathon"}
                        onCheckedChange={(checked) => {
                          handleCompetitionTrackChange(index, checked ? "Hackathon" : "");
                        }}
                      />
                      <Label htmlFor={`hackathon-${index}`} className="text-gray-300">
                        Hackathon (+₹150)
                        <Badge className={`ml-2 text-xs ${slots?.competitions.hackathon.closed ? 'bg-red-500/10 text-red-400' : 'bg-blue-500/10 text-blue-400'}`}>
                          {slots?.competitions.hackathon.closed ? 'FULL' : `${slots?.competitions.hackathon.remaining || 0} left`}
                        </Badge>
                      </Label>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`pitch-${index}`}
                          checked={memberTrack.competitionTrack === "Startup Pitch"}
                          onCheckedChange={(checked) => {
                            handleCompetitionTrackChange(index, checked ? "Startup Pitch" : "");
                            if (checked) {
                              onOpenPitchDialog(index);
                            }
                          }}
                        />
                        <Label htmlFor={`pitch-${index}`} className="text-gray-300">
                          Startup Pitch (+₹100)
                          <Badge className={`ml-2 text-xs ${slots?.competitions.pitch.closed ? 'bg-red-500/10 text-red-400' : 'bg-purple-500/10 text-purple-400'}`}>
                            {slots?.competitions.pitch.closed ? 'FULL' : `${slots?.competitions.pitch.remaining || 0} left`}
                          </Badge>
                        </Label>
                      </div>
                      
                      {/* Startup pitch details */}
                      {memberTrack.competitionTrack === "Startup Pitch" && (
                        <div className="mt-2">
                          {startupPitchData[index] ? (
                            <div className="flex items-center justify-between bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                              <div className="flex flex-col">
                                <div className="flex items-center space-x-2">
                                  <Check className="w-4 h-4 text-green-400" />
                                  <span className="text-green-400 text-sm font-medium">Pitch details saved</span>
                                </div>
                                {startupPitchData[index]?.externalMembers && startupPitchData[index]?.externalMembers.length > 0 && (
                                  <div className="text-xs text-gray-400 mt-1 ml-6">
                                    + {startupPitchData[index]?.externalMembers?.length} external team member(s)
                                  </div>
                                )}
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => onOpenPitchDialog(index)}
                                className="text-blue-400 hover:text-blue-300 h-auto p-1"
                              >
                                Edit Details
                              </Button>
                            </div>
                          ) : (
                            <>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => onOpenPitchDialog(index)}
                                className="text-purple-400 border-purple-400 hover:bg-purple-400/10"
                              >
                                Add Pitch Details
                              </Button>
                              {errors[`member${index}PitchDetails`] && (
                                <p className="text-red-400 text-sm mt-1">{errors[`member${index}PitchDetails`]}</p>
                              )}
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}