'use client';

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Users, User } from "lucide-react";

interface TrackSelectionModeProps {
  value: 'shared' | 'individual';
  onChange: (value: 'shared' | 'individual') => void;
}

export default function TrackSelectionMode({ value, onChange }: TrackSelectionModeProps) {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium text-white mb-3">How would you like to select tracks?</h3>
      <RadioGroup
        value={value}
        onValueChange={(val) => onChange(val as 'shared' | 'individual')}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <div>
          <RadioGroupItem
            value="shared"
            id="shared-tracks"
            className="peer sr-only"
          />
          <Label
            htmlFor="shared-tracks"
            className="flex flex-col items-center justify-between rounded-md border-2 border-gray-700 bg-gray-800/40 p-4 hover:bg-gray-800/60 hover:border-gray-600 peer-data-[state=checked]:border-blue-500 [&:has([data-state=checked])]:border-blue-500 cursor-pointer"
          >
            <Users className="h-6 w-6 mb-2 text-blue-400" />
            <div className="space-y-1 text-center">
              <p className="text-sm font-medium text-white">Same Tracks for All</p>
              <p className="text-xs text-gray-400">
                All team members will participate in the same workshop and competition tracks
              </p>
            </div>
          </Label>
        </div>

        <div>
          <RadioGroupItem
            value="individual"
            id="individual-tracks"
            className="peer sr-only"
          />
          <Label
            htmlFor="individual-tracks"
            className="flex flex-col items-center justify-between rounded-md border-2 border-gray-700 bg-gray-800/40 p-4 hover:bg-gray-800/60 hover:border-gray-600 peer-data-[state=checked]:border-purple-500 [&:has([data-state=checked])]:border-purple-500 cursor-pointer"
          >
            <User className="h-6 w-6 mb-2 text-purple-400" />
            <div className="space-y-1 text-center">
              <p className="text-sm font-medium text-white">Individual Track Selection</p>
              <p className="text-xs text-gray-400">
                Each team member can choose different workshop and competition tracks
              </p>
            </div>
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
}