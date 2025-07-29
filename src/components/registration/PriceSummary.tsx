'use client';

import { useCallback, useMemo } from 'react';
import { Card } from "@/components/ui/card";

interface TeamMemberTrack {
  workshopTrack: string;
  competitionTrack: string;
}

interface StartupPitchData {
  startupName: string;
  teamMembers?: number[];
  pitchCategory: string;
  briefDescription: string;
  problemStatement: string;
  targetMarket: string;
  currentStage: string;
  teamSize: string;
  fundingStatus: string;
  pitchDeck: File | null;
  demoUrl: string;
}

interface PriceSummaryProps {
  isComboTicket: boolean;
  isStartupOnly?: boolean;
  teamSize: number;
  memberTracks: TeamMemberTrack[];
  startupPitchData?: Record<number, StartupPitchData>;
  trackSelectionMode?: 'shared' | 'individual';
}

export default function PriceSummary({
  isComboTicket,
  isStartupOnly = false,
  teamSize,
  memberTracks,
  startupPitchData = {},
  trackSelectionMode = 'individual'
}: PriceSummaryProps) {
  // Calculate the total price based on ticket type and selected tracks
  const calculatePrice = useCallback(() => {
    let total = 0;
    
    if (isStartupOnly) {
      // Startup-only ticket: ₹200 per person, only startup pitch competition
      total = 200 * teamSize;
    } else if (isComboTicket) {
      // Calculate combo pass price based on individual competition track selections
      // Ensure we calculate for all team members, even if memberTracks is shorter
      for (let i = 0; i < teamSize; i++) {
        const track = memberTracks[i];
        if (track?.competitionTrack === "Hackathon") {
          total += 950; // ₹950 for combo + hackathon
        } else if (track?.competitionTrack === "Startup Pitch") {
          total += 900; // ₹900 for combo + startup pitch
        } else {
          // Default combo price if no competition track selected yet
          total += 900;
        }
      }
      
      // Apply team discount for combo tickets
      if (teamSize > 1) {
        total -= teamSize * 10;
      }
    } else {
      // Base price for workshop-only tickets
      total = 800 * teamSize;
      
      if (trackSelectionMode === 'shared' && teamSize > 1) {
        // In shared mode, apply the same competition track to all members
        const sharedTrack = memberTracks[0] || { workshopTrack: "", competitionTrack: "" };
        
        if (sharedTrack.competitionTrack === "Hackathon") {
          // Add hackathon fee for all members
          total += 150 * teamSize;
        } else if (sharedTrack.competitionTrack === "Startup Pitch") {
          // In shared mode, charge per member for the pitch
          total += 100 * teamSize;
        }
      } else {
        // In individual mode, calculate based on individual selections
        // Count hackathon participants
        let hackathonCount = 0;
        let pitchCount = 0;
        
        // Count unique pitches for pricing
        const pitchOwners = new Set();
        
        memberTracks.forEach((track, index) => {
          if (track.competitionTrack === "Hackathon") {
            hackathonCount++;
          } else if (track.competitionTrack === "Startup Pitch") {
            // If this member has their own pitch data
            if (startupPitchData[index]) {
              pitchOwners.add(index);
            } else {
              // Individual pitch without startup data
              pitchCount++;
            }
          }
        });
        
        total += hackathonCount * 150;
        total += pitchCount * 100;
        total += pitchOwners.size * 100;
      }
    }
    
    return total;
  }, [isComboTicket, isStartupOnly, teamSize, memberTracks, trackSelectionMode, startupPitchData]);

  // Count how many members selected each competition track
  const countCompetitionTracks = useCallback(() => {
    const counts = {
      hackathon: 0,
      pitch: 0
    };
    
    if (trackSelectionMode === 'shared' && teamSize > 1) {
      // In shared mode, we count differently
      const sharedTrack = memberTracks[0] || { workshopTrack: "", competitionTrack: "" };
      
      if (sharedTrack.competitionTrack === "Hackathon") {
        counts.hackathon = teamSize; // All members participate
      } else if (sharedTrack.competitionTrack === "Startup Pitch") {
        counts.pitch = 1; // Only count as one pitch for the team
      }
    } else {
      // In individual mode, calculate based on individual selections
      // Count hackathon participants
      memberTracks.forEach(track => {
        if (track.competitionTrack === "Hackathon") counts.hackathon++;
      });
      
      // For startup pitch, we need to count unique pitches, not just members
      // A team might have multiple members in the same pitch
      const pitchOwners = new Set();
      const pitchParticipants = new Set();
      
      memberTracks.forEach((track, index) => {
        if (track.competitionTrack === "Startup Pitch") {
          // If this member has their own pitch data
          if (startupPitchData[index]) {
            pitchOwners.add(index);
            // Add all team members of this pitch
            if (startupPitchData[index].teamMembers) {
              startupPitchData[index].teamMembers.forEach(memberIndex => {
                pitchParticipants.add(memberIndex);
              });
            } else {
              // If no team members specified, just count the owner
              pitchParticipants.add(index);
            }
          }
        }
      });
      
      // For members who selected Startup Pitch but aren't part of any pitch yet
      memberTracks.forEach((track, index) => {
        if (track.competitionTrack === "Startup Pitch" && !pitchParticipants.has(index)) {
          counts.pitch++;
        }
      });
      
      // Add the number of unique pitches
      counts.pitch += pitchOwners.size;
    }
    
    return counts;
  }, [memberTracks, teamSize, trackSelectionMode, startupPitchData]);

  const trackCounts = useMemo(() => countCompetitionTracks(), [countCompetitionTracks]);
  const total = useMemo(() => calculatePrice(), [calculatePrice]);

  return (
    <Card className="bg-gray-800/40 rounded-lg p-6 border border-gray-700">
      <h4 className="text-lg font-bold text-white mb-4">Price Summary</h4>
      <div className="space-y-2">
        {isStartupOnly ? (
          // Show startup-only pricing
          <>
            <div className="flex justify-between text-gray-300">
              <span>Startup Pitch Only</span>
              <span>₹200</span>
            </div>
            
            <div className="flex justify-between text-gray-300">
              <span>Team Size</span>
              <span>x{teamSize}</span>
            </div>
          </>
        ) : isComboTicket ? (
          // Show individual combo pass pricing breakdown
          <>
            {Array.from({ length: teamSize }, (_, index) => {
              const track = memberTracks[index];
              return (
                <div key={index} className="flex justify-between text-gray-300">
                  <span>
                    Combo Pass - Member {index + 1}
                    {track?.competitionTrack && ` (${track.competitionTrack})`}
                  </span>
                  <span>
                    ₹{track?.competitionTrack === "Hackathon" ? 950 : 
                       track?.competitionTrack === "Startup Pitch" ? 900 : 900}
                  </span>
                </div>
              );
            })}
          </>
        ) : (
          // Show workshop pass pricing
          <>
            <div className="flex justify-between text-gray-300">
              <span>Workshop Pass</span>
              <span>₹800</span>
            </div>
            
            <div className="flex justify-between text-gray-300">
              <span>Team Size</span>
              <span>x{teamSize}</span>
            </div>
          </>
        )}
        
        {!isComboTicket && !isStartupOnly && trackCounts.hackathon > 0 && (
          <div className="flex justify-between text-gray-300">
            <span>
              {trackSelectionMode === 'shared' && teamSize > 1
                ? `Hackathon Add-on (${teamSize} members)`
                : `Hackathon Add-on (${trackCounts.hackathon} ${trackCounts.hackathon === 1 ? 'member' : 'members'})`
              }
            </span>
            <span>+₹{150 * trackCounts.hackathon}</span>
          </div>
        )}
        
        {!isComboTicket && !isStartupOnly && trackCounts.pitch > 0 && (
          <div className="flex justify-between text-gray-300">
            <span>
              {trackSelectionMode === 'shared' && teamSize > 1
                ? `Startup Pitch Add-on (${teamSize} members)`
                : `Startup Pitch Add-on (${trackCounts.pitch} ${trackCounts.pitch === 1 ? 'pitch' : 'pitches'})`
              }
            </span>
            <span>+₹{100 * trackCounts.pitch}</span>
          </div>
        )}
        
        {isStartupOnly && (
          <div className="flex justify-between text-gray-300">
            <span>Startup Pitch Competition</span>
            <span>Included</span>
          </div>
        )}
        
        {isComboTicket && (
          <div className="flex justify-between text-gray-300">
            <span>Competition Access</span>
            <span>Included</span>
          </div>
        )}
        
        {teamSize > 1 && isComboTicket && (
          <div className="flex justify-between text-green-400">
            <span>Team Discount</span>
            <span>-₹{teamSize * 10}</span>
          </div>
        )}
        
        <div className="border-t border-gray-600 pt-2 mt-2">
          <div className="flex justify-between text-xl font-bold text-white">
            <span>Total</span>
            <span>₹{total}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}