// Game entity for QR quest and imposter game functionality
import { GameStats, GameCreateRequest, GameResponse } from '@/lib/types'

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

  static async scanQR(userId: string, qrData: string): Promise<GameResponse> {
    const response = await fetch('/api/games', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        userId,
        action: 'qr_scan',
        data: qrData
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to process QR scan');
    }

    return response.json();
  }

  static async addSuspect(userId: string, suspectId: string): Promise<GameResponse> {
    const response = await fetch('/api/games', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        userId,
        action: 'suspect_added',
        suspectId
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to add suspect');
    }

    return response.json();
  }

  static async getStats(): Promise<GameStats> {
    const response = await fetch('/api/games');
    
    if (!response.ok) {
      throw new Error('Failed to fetch game stats');
    }

    const data = await response.json();
    return data.stats || { totalScans: 0, activePlayers: 0, totalSuspects: 0 };
  }
}