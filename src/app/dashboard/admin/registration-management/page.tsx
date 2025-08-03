'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import AdminLayout from '@/components/layout/AdminLayout';
import { RegistrationManagementTable } from '@/components/admin/RegistrationManagementTable';
import { User } from '@/entities/User';
import { User as UserType } from '@/lib/types';
import { toast } from 'sonner';
import { FileText } from 'lucide-react';

interface TeamMember {
  _id: string;
  participant_id?: string;
  full_name: string;
  email: string;
  phone?: string;
  whatsapp: string;
  year: string;
  department: string;
  college?: string;
  gender?: string;
  accommodation: boolean;
  food_preference: 'veg' | 'non-veg';
  is_club_lead?: boolean;
  club_name?: string;
}

interface Registration {
  _id: string;
  team_id: string;
  college: string;
  team_size: number;
  ticket_type: 'Combo' | 'Custom' | 'startup_only';
  workshop_track: 'Cloud' | 'AI' | 'Cybersecurity' | 'None' | null;
  competition_track: 'Hackathon' | 'Pitch' | 'None';
  total_amount: number;
  transaction_id?: string;
  payment_screenshot_url?: string;
  status: 'completed' | 'pending_review' | 'confirmed' | 'pending';
  registration_code?: string;
  qr_code_url?: string;
  created_at: string;
  updated_at: string;
  members: TeamMember[];
  // Startup pitch specific data (if available)
  startup_pitch_data?: {
    startup_name: string;
    pitch_category: string;
    brief_description: string;
    problem_statement: string;
    target_market: string;
    current_stage: string;
    team_size: string;
    funding_status: string;
    pitch_deck_url?: string;
    demo_url?: string;
    team_members?: string[];
    external_members?: string[];
  };
}

// Fetch registrations function
const fetchRegistrations = async (): Promise<Registration[]> => {
  const response = await fetch('/api/registrations?limit=250', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch registrations');
  }

  const data = await response.json();
  return data.registrations || [];
};

export default function RegistrationManagementPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [, setCurrentUser] = useState<UserType | null>(null);

  // TanStack Query for registrations
  const {
    data: registrations = [],
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['registrations'],
    queryFn: fetchRegistrations,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
    refetchOnWindowFocus: false,
  });

  const loadUserData = useCallback(async () => {
    try {
      const user = await User.me();
      if (!user || user.role !== 'admin') {
        router.push('/dashboard');
        return;
      }
      setCurrentUser(user);
    } catch (error) {
      console.error('Failed to load user data:', error);
      router.push('/login');
    }
  }, [router]);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  // Handle query error
  useEffect(() => {
    if (isError && error) {
      console.error('Failed to load registrations:', error);
      toast.error('Failed to load registrations');
    }
  }, [isError, error]);

  const handleRefresh = useCallback(() => {
    refetch();
    queryClient.invalidateQueries({ queryKey: ['registrations'] });
  }, [refetch, queryClient]);

  if (isLoading) {
    return (
      <AdminLayout 
        title="Registration Management"
        subtitle="Manage event registrations and team details"
      >
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading registrations...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout 
      title="Registration Management"
      subtitle="Manage event registrations and team details"
      showRefresh={true}
      onRefresh={handleRefresh}
      refreshing={isLoading}
    >
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <FileText className="h-8 w-8 text-blue-400" />
              Registration Management
            </h1>
            <p className="text-gray-400 mt-2">
              Manage event registrations and team details with advanced table features
            </p>
          </div>
        </div>

        {/* TanStack Table */}
        <RegistrationManagementTable
          registrations={registrations}
          loading={isLoading}
          onRefresh={handleRefresh}
        />
      </div>
    </AdminLayout>
  );
}