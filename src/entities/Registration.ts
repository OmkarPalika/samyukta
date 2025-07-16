// Registration entity for event registration management
import {
  TeamMember,
  RegistrationCreateRequest,
  RegistrationUpdateRequest,
  RegistrationResponse,
  RegistrationFilters,
  RegistrationStats
} from '@/lib/types'

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
    const { uploadFile, validateFile } = await import('@/lib/file-upload');
    const { UPLOAD_TYPES } = await import('@/lib/gdrive');
    validateFile(file, undefined, UPLOAD_TYPES.PAYMENT_SCREENSHOTS);
    return uploadFile(file, '/api/upload', UPLOAD_TYPES.PAYMENT_SCREENSHOTS);
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

  static async resendConfirmationEmails(teamId: string, memberEmails?: string[]): Promise<{
    success: boolean;
    message: string;
    results: {
      total: number;
      successful: number;
      failed: number;
      failed_emails: string[];
    };
  }> {
    const response = await fetch('/api/email/resend-registration', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        team_id: teamId,
        member_emails: memberEmails 
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to resend confirmation emails');
    }

    return response.json();
  }

  static async updateEmail(teamId: string, oldEmail: string, newEmail: string): Promise<{
    success: boolean;
    message: string;
  }> {
    const response = await fetch('/api/registrations/update-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        team_id: teamId,
        old_email: oldEmail,
        new_email: newEmail
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to update email');
    }

    return response.json();
  }
}