// PitchRating entity for rating pitch presentations
import { PitchTeamScore, PitchRatingCreateRequest, PitchRatingUpdateRequest, PitchRatingResponse } from '@/lib/types'

export class PitchRating {
  static async create(ratingData: PitchRatingCreateRequest): Promise<PitchRatingResponse> {
    // Validate rating range
    if (ratingData.rating < 1 || ratingData.rating > 5) {
      throw new Error('Rating must be between 1 and 5');
    }

    const response = await fetch('/api/pitch-ratings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ratingData),
    });

    if (!response.ok) {
      throw new Error('Failed to create pitch rating');
    }

    return response.json();
  }

  static async getAll(filters?: {
    pitch_team_id?: string;
    voter_id?: string;
    pitch_round?: string;
  }): Promise<PitchRatingResponse[]> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
    }
    
    const response = await fetch(`/api/pitch-ratings?${params.toString()}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch pitch ratings');
    }

    return response.json();
  }

  static async getById(ratingId: string): Promise<PitchRatingResponse> {
    const response = await fetch(`/api/pitch-ratings/${ratingId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch pitch rating');
    }

    return response.json();
  }

  static async update(ratingId: string, updateData: PitchRatingUpdateRequest): Promise<PitchRatingResponse> {
    // Validate rating range if provided
    if (updateData.rating && (updateData.rating < 1 || updateData.rating > 5)) {
      throw new Error('Rating must be between 1 and 5');
    }

    const response = await fetch(`/api/pitch-ratings/${ratingId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      throw new Error('Failed to update pitch rating');
    }

    return response.json();
  }

  static async delete(ratingId: string): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`/api/pitch-ratings/${ratingId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete pitch rating');
    }

    return response.json();
  }

  static async getTeamScores(pitchRound?: string): Promise<PitchTeamScore[]> {
    const url = pitchRound 
      ? `/api/pitch-ratings/team-scores?pitch_round=${pitchRound}`
      : '/api/pitch-ratings/team-scores';
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Failed to fetch team scores');
    }

    return response.json();
  }

  static async getTeamScore(teamId: string, pitchRound?: string): Promise<PitchTeamScore> {
    const url = pitchRound 
      ? `/api/pitch-ratings/team-scores/${teamId}?pitch_round=${pitchRound}`
      : `/api/pitch-ratings/team-scores/${teamId}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Failed to fetch team score');
    }

    return response.json();
  }

  static async getMyRatings(voterId: string, pitchRound?: string): Promise<PitchRatingResponse[]> {
    const url = pitchRound 
      ? `/api/pitch-ratings/my-ratings?voter_id=${voterId}&pitch_round=${pitchRound}`
      : `/api/pitch-ratings/my-ratings?voter_id=${voterId}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Failed to fetch user ratings');
    }

    return response.json();
  }

  static async getRatingStats(pitchRound?: string): Promise<{
    total_ratings: number;
    average_rating: number;
    ratings_by_score: Record<string, number>;
    teams_evaluated: number;
    unique_voters: number;
  }> {
    const url = pitchRound 
      ? `/api/pitch-ratings/stats?pitch_round=${pitchRound}`
      : '/api/pitch-ratings/stats';
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Failed to fetch rating statistics');
    }

    return response.json();
  }

  static async checkVoterEligibility(voterId: string, teamId: string): Promise<{
    eligible: boolean;
    reason?: string;
    existing_rating?: PitchRatingResponse;
  }> {
    const response = await fetch(`/api/pitch-ratings/check-eligibility?voter_id=${voterId}&team_id=${teamId}`);
    
    if (!response.ok) {
      throw new Error('Failed to check voter eligibility');
    }

    return response.json();
  }

  static async submitBulkRatings(ratings: PitchRatingCreateRequest[]): Promise<{
    success: number;
    failed: number;
    results: Array<{
      success: boolean;
      data?: PitchRatingResponse;
      error?: string;
    }>;
  }> {
    const response = await fetch('/api/pitch-ratings/bulk', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ratings }),
    });

    if (!response.ok) {
      throw new Error('Failed to submit bulk ratings');
    }

    return response.json();
  }

  static async uploadPitchDeck(file: File): Promise<{ file_url: string }> {
    const { uploadFile, validateFile } = await import('@/lib/file-upload');
    const { UPLOAD_TYPES } = await import('@/lib/gdrive');
    
    validateFile(file, 50 * 1024 * 1024, UPLOAD_TYPES.PITCH_DECKS);
    return uploadFile(file, '/api/upload', UPLOAD_TYPES.PITCH_DECKS);
  }
}