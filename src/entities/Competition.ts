// Competition entity for managing competition registrations
import {
  Competition as CompetitionData,
  CompetitionRegistration,
  UserCompetitionData
} from '@/lib/types'

export class Competition {
  static async getAll(): Promise<CompetitionData[]> {
    const response = await fetch('/api/competitions');
    if (!response.ok) {
      throw new Error('Failed to fetch competitions');
    }
    return response.json();
  }

  static async getById(id: string): Promise<CompetitionData> {
    const response = await fetch(`/api/competitions/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch competition');
    }
    return response.json();
  }

  static async joinCompetition(data: {
    competition_id: string;
    user_id: string;
    team_id?: string;
    registration_type: 'individual' | 'team';
    transaction_id: string;
    payment_screenshot: File;
  }): Promise<CompetitionRegistration> {
    const { uploadFile, validateFile } = await import('@/lib/file-upload');
    const { UPLOAD_TYPES } = await import('@/lib/gdrive');
    
    validateFile(data.payment_screenshot, undefined, UPLOAD_TYPES.COMPETITION_PAYMENTS);
    const uploadResult = await uploadFile(data.payment_screenshot, '/api/upload', UPLOAD_TYPES.COMPETITION_PAYMENTS);
    
    const response = await fetch('/api/competitions/join', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        competition_id: data.competition_id,
        user_id: data.user_id,
        team_id: data.team_id,
        registration_type: data.registration_type,
        transaction_id: data.transaction_id,
        payment_screenshot_url: uploadResult.file_url
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to join competition');
    }

    return response.json();
  }

  static async getUserCompetitions(userId: string): Promise<UserCompetitionData[]> {
    const response = await fetch(`/api/competitions/user/${userId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch user competitions');
    }
    return response.json();
  }

  static async checkUserRegistration(userId: string, competitionId: string): Promise<CompetitionRegistration | null> {
    const response = await fetch(`/api/competitions/${competitionId}/user/${userId}`);
    if (response.status === 404) {
      return null;
    }
    if (!response.ok) {
      throw new Error('Failed to check registration');
    }
    return response.json();
  }

  static async uploadPaymentScreenshot(file: File): Promise<{ file_url: string }> {
    const { uploadFile, validateFile } = await import('@/lib/file-upload');
    const { UPLOAD_TYPES } = await import('@/lib/gdrive');
    validateFile(file, undefined, UPLOAD_TYPES.COMPETITION_PAYMENTS);
    return uploadFile(file, '/api/upload', UPLOAD_TYPES.COMPETITION_PAYMENTS);
  }
}
