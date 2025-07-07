// Game entity for QR quest and imposter game functionality
export interface GameData {
  scanner_id: string;
  target_id: string;
  game_type: 'qr_quest' | 'imposter';
  points?: number;
  timestamp?: string;
  data?: Record<string, unknown>;
}

export interface GameCreateRequest {
  scanner_id: string;
  target_id: string;
  game_type: 'qr_quest' | 'imposter';
  points?: number;
  data?: Record<string, unknown>;
}

export interface GameResponse extends GameData {
  id: string;
  created_at: string;
  updated_at: string;
}

export class Game {
  static async create(gameData: GameCreateRequest): Promise<GameResponse> {
    const response = await fetch('/api/games', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(gameData),
    });

    if (!response.ok) {
      throw new Error('Failed to create game entry');
    }

    return response.json();
  }

  static async getByScanner(scannerId: string): Promise<GameResponse[]> {
    const response = await fetch(`/api/games?scanner_id=${scannerId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch games');
    }

    return response.json();
  }

  static async getByTarget(targetId: string): Promise<GameResponse[]> {
    const response = await fetch(`/api/games?target_id=${targetId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch games');
    }

    return response.json();
  }

  static async getByType(gameType: 'qr_quest' | 'imposter'): Promise<GameResponse[]> {
    const response = await fetch(`/api/games?game_type=${gameType}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch games');
    }

    return response.json();
  }

  static async getLeaderboard(gameType?: 'qr_quest' | 'imposter'): Promise<Array<{ user_id: string; total_points: number; game_count: number }>> {
    const url = gameType ? `/api/games/leaderboard?game_type=${gameType}` : '/api/games/leaderboard';
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Failed to fetch leaderboard');
    }

    return response.json();
  }

  static async scanQR(scannerId: string, qrData: string): Promise<GameResponse> {
    const response = await fetch('/api/games/scan-qr', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ scanner_id: scannerId, qr_data: qrData }),
    });

    if (!response.ok) {
      throw new Error('Failed to process QR scan');
    }

    return response.json();
  }

  static async reportImposter(scannerId: string, targetId: string, evidence?: Record<string, unknown>): Promise<GameResponse> {
    const response = await fetch('/api/games/report-imposter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        scanner_id: scannerId, 
        target_id: targetId, 
        data: evidence 
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to report imposter');
    }

    return response.json();
  }

  static async addSuspect(userId: string, suspectId: string): Promise<any> {
    const response = await fetch('/api/games', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        action: 'addSuspect',
        userId,
        data: suspectId
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to add suspect');
    }

    return response.json();
  }

  static async getStats(): Promise<any> {
    const response = await fetch('/api/games');
    
    if (!response.ok) {
      throw new Error('Failed to fetch game stats');
    }

    const data = await response.json();
    return data.stats || {};
  }
}