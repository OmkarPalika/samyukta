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
    const formData = new FormData();
    formData.append('competition_id', data.competition_id);
    formData.append('user_id', data.user_id);
    formData.append('registration_type', data.registration_type);
    formData.append('transaction_id', data.transaction_id);
    formData.append('payment_screenshot', data.payment_screenshot);
    if (data.team_id) {
      formData.append('team_id', data.team_id);
    }

    const response = await fetch('/api/competitions/join', {
      method: 'POST',
      body: formData,
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
}
