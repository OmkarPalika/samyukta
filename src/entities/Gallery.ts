// Gallery entity for photo/media management
export interface GalleryData {
  id: string;
  uploaded_by: string;
  file_url: string;
  caption?: string;
  approved?: boolean;
  status?: 'pending' | 'approved' | 'rejected';
  category?: string;
  likes?: number;
  created_at?: string;
  moderated_by?: string;
  tags?: string[];
}

export interface GalleryCreateRequest {
  uploaded_by: string;
  file_url: string;
  caption?: string;
  tags?: string[];
}

export interface GalleryUpdateRequest {
  caption?: string;
  approved?: boolean;
  moderated_by?: string;
  tags?: string[];
}

export interface GalleryResponse extends GalleryData {
  id: string;
  approved: boolean;
  status: 'pending' | 'approved' | 'rejected';
  tags: string[];
  created_at: string;
  updated_at: string;
  uploader_details?: {
    full_name: string;
    email: string;
  };
  moderator_details?: {
    full_name: string;
    email: string;
  };
  likes_count?: number;
  comments_count?: number;
  is_liked?: boolean; // For current user
}

export interface GalleryFilters {
  approved?: boolean;
  uploaded_by?: string;
  moderated_by?: string;
  tags?: string[];
  search?: string;
  date_from?: string;
  date_to?: string;
}

export class Gallery {
  static async create(galleryData: GalleryCreateRequest): Promise<GalleryResponse> {
    const response = await fetch('/api/gallery', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(galleryData),
    });

    if (!response.ok) {
      throw new Error('Failed to create gallery item');
    }

    return response.json();
  }

  static async getAll(filters?: GalleryFilters): Promise<GalleryResponse[]> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          if (Array.isArray(value)) {
            value.forEach(v => params.append(key, v));
          } else {
            params.append(key, value.toString());
          }
        }
      });
    }
    
    const response = await fetch(`/api/gallery?${params.toString()}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch gallery items');
    }

    return response.json();
  }

  static async getById(itemId: string): Promise<GalleryResponse> {
    const response = await fetch(`/api/gallery/${itemId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch gallery item');
    }

    return response.json();
  }

  static async update(itemId: string, updateData: GalleryUpdateRequest): Promise<GalleryResponse> {
    const response = await fetch(`/api/gallery/${itemId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      throw new Error('Failed to update gallery item');
    }

    return response.json();
  }

  static async delete(itemId: string): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`/api/gallery/${itemId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete gallery item');
    }

    return response.json();
  }

  static async uploadFile(file: File): Promise<{ file_url: string }> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/gallery/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload file');
    }

    return response.json();
  }

  static async approve(itemId: string, moderatorId: string): Promise<GalleryResponse> {
    const response = await fetch(`/api/gallery/${itemId}/approve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ moderated_by: moderatorId }),
    });

    if (!response.ok) {
      throw new Error('Failed to approve gallery item');
    }

    return response.json();
  }

  static async reject(itemId: string, moderatorId: string, reason?: string): Promise<GalleryResponse> {
    const response = await fetch(`/api/gallery/${itemId}/reject`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ moderated_by: moderatorId, reason }),
    });

    if (!response.ok) {
      throw new Error('Failed to reject gallery item');
    }

    return response.json();
  }

  static async like(itemId: string, userId: string): Promise<{ success: boolean; likes_count: number }> {
    const response = await fetch(`/api/gallery/${itemId}/like`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_id: userId }),
    });

    if (!response.ok) {
      throw new Error('Failed to like gallery item');
    }

    return response.json();
  }

  static async unlike(itemId: string, userId: string): Promise<{ success: boolean; likes_count: number }> {
    const response = await fetch(`/api/gallery/${itemId}/unlike`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_id: userId }),
    });

    if (!response.ok) {
      throw new Error('Failed to unlike gallery item');
    }

    return response.json();
  }

  static async getPendingApproval(): Promise<GalleryResponse[]> {
    const response = await fetch('/api/gallery/pending-approval');
    
    if (!response.ok) {
      throw new Error('Failed to fetch pending approval items');
    }

    return response.json();
  }

  static async getMyUploads(userId: string): Promise<GalleryResponse[]> {
    const response = await fetch(`/api/gallery/my-uploads?user_id=${userId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch user uploads');
    }

    return response.json();
  }

  static async getStats(): Promise<{
    total_items: number;
    approved_items: number;
    pending_approval: number;
    total_likes: number;
    unique_uploaders: number;
    popular_tags: Array<{ tag: string; count: number }>;
  }> {
    const response = await fetch('/api/gallery/stats');
    
    if (!response.ok) {
      throw new Error('Failed to fetch gallery statistics');
    }

    return response.json();
  }

  static async getTags(): Promise<string[]> {
    const response = await fetch('/api/gallery/tags');
    
    if (!response.ok) {
      throw new Error('Failed to fetch gallery tags');
    }

    return response.json();
  }

  static async bulkApprove(itemIds: string[], moderatorId: string): Promise<{
    success: number;
    failed: number;
    results: Array<{
      id: string;
      success: boolean;
      error?: string;
    }>;
  }> {
    const response = await fetch('/api/gallery/bulk-approve', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ item_ids: itemIds, moderated_by: moderatorId }),
    });

    if (!response.ok) {
      throw new Error('Failed to bulk approve items');
    }

    return response.json();
  }

  static async bulkDelete(itemIds: string[]): Promise<{
    success: number;
    failed: number;
    results: Array<{
      id: string;
      success: boolean;
      error?: string;
    }>;
  }> {
    const response = await fetch('/api/gallery/bulk-delete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ item_ids: itemIds }),
    });

    if (!response.ok) {
      throw new Error('Failed to bulk delete items');
    }

    return response.json();
  }
}