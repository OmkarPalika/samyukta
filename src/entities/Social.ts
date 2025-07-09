// Social entity for photo/media social management
import { SocialResponse } from '@/lib/types'

export class Social {
  static async create(socialData: {
    uploaded_by: string;
    file_url: string;
    caption: string;
  }): Promise<SocialResponse> {
    const response = await fetch('/api/social', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(socialData),
    });

    if (!response.ok) {
      throw new Error('Failed to create social item');
    }

    return response.json();
  }

  static async getAll(): Promise<SocialResponse[]> {
    const response = await fetch('/api/social');
    
    if (!response.ok) {
      throw new Error('Failed to fetch social items');
    }

    return response.json();
  }

  static async getById(itemId: string): Promise<SocialResponse> {
    const response = await fetch(`/api/social/${itemId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch social item');
    }

    return response.json();
  }

  static async update(itemId: string, updateData: { 
    caption?: string; 
    status?: 'pending' | 'approved' | 'rejected' 
  }): Promise<SocialResponse> {
    const response = await fetch(`/api/social/${itemId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      throw new Error('Failed to update social item');
    }

    return response.json();
  }

  static async delete(itemId: string): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`/api/social/${itemId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete social item');
    }

    return response.json();
  }
}