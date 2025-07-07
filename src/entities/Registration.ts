// Registration entity for event registration management
export interface TeamMember {
  id?: string;
  participant_id?: string;
  passkey?: string;
  full_name: string;
  name?: string; // Alias for full_name
  email: string;
  whatsapp: string;
  year: string;
  department: string;
  accommodation: boolean;
  food_preference: 'veg' | 'non-veg';
  present?: boolean; // For attendance tracking
}

export interface RegistrationData {
  team_id?: string;
  college: string;
  team_size?: number;
  members: TeamMember[];
  ticket_type: 'Combo' | 'Custom';
  workshop_track: 'Cloud' | 'AI' | 'None';
  competition_track: 'Hackathon' | 'Pitch' | 'None';
  total_amount?: number;
  transaction_id?: string;
  payment_screenshot_url?: string;
  status?: 'completed' | 'pending_review';
}

export interface RegistrationCreateRequest {
  college: string;
  members: TeamMember[];
  ticket_type: 'Combo' | 'Custom';
  workshop_track: 'Cloud' | 'AI' | 'None';
  competition_track: 'Hackathon' | 'Pitch' | 'None';
  total_amount?: number;
  transaction_id?: string;
  payment_screenshot_url?: string;
}

export interface RegistrationUpdateRequest {
  college?: string;
  members?: TeamMember[];
  ticket_type?: 'Combo' | 'Custom';
  workshop_track?: 'Cloud' | 'AI' | 'None';
  competition_track?: 'Hackathon' | 'Pitch' | 'None';
  total_amount?: number;
  transaction_id?: string;
  payment_screenshot_url?: string;
  status?: 'completed' | 'pending_review';
}

export interface RegistrationResponse extends RegistrationData {
  id: string;
  team_id: string;
  team_size: number;
  total_amount: number;
  status: 'completed' | 'pending_review' | 'confirmed' | 'pending';
  created_at: string;
  updated_at: string;
  team_leader?: TeamMember;
  registration_code?: string;
  qr_code_url?: string;
}

export interface RegistrationFilters {
  college?: string;
  ticket_type?: 'Combo' | 'Custom';
  workshop_track?: 'Cloud' | 'AI' | 'None';
  competition_track?: 'Hackathon' | 'Pitch' | 'None';
  status?: 'completed' | 'pending_review';
  date_from?: string;
  date_to?: string;
  search?: string;
}

export interface RegistrationStats {
  total_registrations: number;
  total_participants: number;
  by_status: Record<string, number>;
  by_ticket_type: Record<string, number>;
  by_workshop_track: Record<string, number>;
  by_competition_track: Record<string, number>;
  by_college: Array<{ college: string; count: number }>;
  accommodation_requests: number;
  food_preferences: Record<string, number>;
  total_revenue: number;
}

export class Registration {
  static async create(registrationData: RegistrationCreateRequest): Promise<RegistrationResponse> {
    const response = await fetch('/api/registrations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(registrationData),
    });

    if (!response.ok) {
      throw new Error('Failed to create registration');
    }

    return response.json();
  }

  static async getAll(filters?: RegistrationFilters): Promise<RegistrationResponse[]> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
    }
    
    const response = await fetch(`/api/registrations?${params.toString()}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch registrations');
    }

    return response.json();
  }

  static async getById(registrationId: string): Promise<RegistrationResponse> {
    const response = await fetch(`/api/registrations/${registrationId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch registration');
    }

    return response.json();
  }

  static async getByTeamId(teamId: string): Promise<RegistrationResponse> {
    const response = await fetch(`/api/registrations/team/${teamId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch registration by team ID');
    }

    return response.json();
  }

  static async update(registrationId: string, updateData: RegistrationUpdateRequest): Promise<RegistrationResponse> {
    const response = await fetch(`/api/registrations/${registrationId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      throw new Error('Failed to update registration');
    }

    return response.json();
  }

  static async delete(registrationId: string): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`/api/registrations/${registrationId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete registration');
    }

    return response.json();
  }

  static async uploadPaymentScreenshot(file: File): Promise<{ file_url: string }> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/registrations/upload-payment', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload payment screenshot');
    }

    return response.json();
  }

  static async approveRegistration(registrationId: string): Promise<RegistrationResponse> {
    const response = await fetch(`/api/registrations/${registrationId}/approve`, {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error('Failed to approve registration');
    }

    return response.json();
  }

  static async rejectRegistration(registrationId: string, reason?: string): Promise<RegistrationResponse> {
    const response = await fetch(`/api/registrations/${registrationId}/reject`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ reason }),
    });

    if (!response.ok) {
      throw new Error('Failed to reject registration');
    }

    return response.json();
  }

  static async getStats(): Promise<RegistrationStats> {
    const response = await fetch('/api/registrations/stats');
    
    if (!response.ok) {
      throw new Error('Failed to fetch registration statistics');
    }

    return response.json();
  }

  static async getPendingReview(): Promise<RegistrationResponse[]> {
    const response = await fetch('/api/registrations/pending-review');
    
    if (!response.ok) {
      throw new Error('Failed to fetch pending registrations');
    }

    return response.json();
  }

  static async generateTeamQR(teamId: string): Promise<{ qr_code_url: string }> {
    const response = await fetch(`/api/registrations/team/${teamId}/qr-code`, {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error('Failed to generate team QR code');
    }

    return response.json();
  }

  static async validateRegistration(registrationCode: string): Promise<{
    valid: boolean;
    registration?: RegistrationResponse;
    error?: string;
  }> {
    const response = await fetch(`/api/registrations/validate?code=${registrationCode}`);
    
    if (!response.ok) {
      throw new Error('Failed to validate registration');
    }

    return response.json();
  }

  static async getMyRegistration(userId: string): Promise<RegistrationResponse | null> {
    const response = await fetch(`/api/registrations/my-registration?user_id=${userId}`);
    
    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error('Failed to fetch user registration');
    }

    return response.json();
  }

  static async calculateAmount(registrationData: {
    members: TeamMember[];
    ticket_type: 'Combo' | 'Custom';
    workshop_track: 'Cloud' | 'AI' | 'None';
    competition_track: 'Hackathon' | 'Pitch' | 'None';
  }): Promise<{
    total_amount: number;
    breakdown: {
      base_amount: number;
      workshop_fee: number;
      competition_fee: number;
      accommodation_fee: number;
      discount: number;
    };
  }> {
    const response = await fetch('/api/registrations/calculate-amount', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(registrationData),
    });

    if (!response.ok) {
      throw new Error('Failed to calculate registration amount');
    }

    return response.json();
  }

  static async getTeamMembers(teamId: string): Promise<TeamMember[]> {
    const response = await fetch(`/api/registrations/team/${teamId}/members`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch team members');
    }

    return response.json();
  }

  static async exportRegistrations(format: 'csv' | 'xlsx' = 'csv'): Promise<Blob> {
    const response = await fetch(`/api/registrations/export?format=${format}`);
    
    if (!response.ok) {
      throw new Error('Failed to export registrations');
    }

    return response.blob();
  }

  static async bulkUpdate(updates: Array<{
    id: string;
    data: RegistrationUpdateRequest;
  }>): Promise<{
    success: number;
    failed: number;
    results: Array<{
      id: string;
      success: boolean;
      data?: RegistrationResponse;
      error?: string;
    }>;
  }> {
    const response = await fetch('/api/registrations/bulk-update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ updates }),
    });

    if (!response.ok) {
      throw new Error('Failed to bulk update registrations');
    }

    return response.json();
  }
}