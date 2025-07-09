// HelpTicket entity for support and assistance requests
import { HelpTicketCreateRequest, HelpTicketUpdateRequest, HelpTicketResponse } from '@/lib/types'

export class HelpTicket {
  static async create(ticketData: HelpTicketCreateRequest): Promise<HelpTicketResponse> {
    const response = await fetch('/api/help-tickets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ticketData),
    });

    if (!response.ok) {
      throw new Error('Failed to create help ticket');
    }

    return response.json();
  }

  static async getAll(filters?: {
    status?: 'open' | 'in_progress' | 'resolved';
    priority?: 'low' | 'medium' | 'high';
    assigned_to?: string;
    submitted_by?: string;
  }): Promise<HelpTicketResponse[]> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
    }
    
    const response = await fetch(`/api/help-tickets?${params.toString()}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch help tickets');
    }

    return response.json();
  }

  static async getById(ticketId: string): Promise<HelpTicketResponse> {
    const response = await fetch(`/api/help-tickets/${ticketId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch help ticket');
    }

    return response.json();
  }

  static async update(ticketId: string, updateData: HelpTicketUpdateRequest): Promise<HelpTicketResponse> {
    const response = await fetch(`/api/help-tickets/${ticketId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      throw new Error('Failed to update help ticket');
    }

    return response.json();
  }

  static async delete(ticketId: string): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`/api/help-tickets/${ticketId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete help ticket');
    }

    return response.json();
  }

  static async assignTicket(ticketId: string, assigneeId: string): Promise<HelpTicketResponse> {
    const response = await fetch(`/api/help-tickets/${ticketId}/assign`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ assigned_to: assigneeId }),
    });

    if (!response.ok) {
      throw new Error('Failed to assign help ticket');
    }

    return response.json();
  }

  static async getMyTickets(userId: string): Promise<HelpTicketResponse[]> {
    const response = await fetch(`/api/help-tickets/my-tickets?user_id=${userId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch user tickets');
    }

    return response.json();
  }

  static async getStats(): Promise<{
    total: number;
    open: number;
    in_progress: number;
    resolved: number;
    by_priority: Record<string, number>;
  }> {
    const response = await fetch('/api/help-tickets/stats');
    
    if (!response.ok) {
      throw new Error('Failed to fetch ticket statistics');
    }

    return response.json();
  }

  static async uploadFile(file: File): Promise<{ file_url: string }> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/help-tickets/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload file');
    }

    return response.json();
  }
}