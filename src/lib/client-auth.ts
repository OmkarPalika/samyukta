import { User as UserType } from '@/lib/types';

export class ClientAuth {
  static async me(): Promise<UserType | null> {
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include'
      });
      if (!response.ok) {
        console.log('Auth check failed with status:', response.status);
        return null;
      }
      
      const contentType = response.headers.get('content-type');
      if (!contentType?.includes('application/json')) {
        console.error('API returned non-JSON response');
        return null;
      }
      
      return await response.json();
    } catch (error) {
      console.error('Auth check failed:', error);
      return null;
    }
  }

  static async login(email: string, credential: string): Promise<UserType | null> {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password: credential, passkey: credential }),
      });
      
      const contentType = response.headers.get('content-type');
      if (!contentType?.includes('application/json')) {
        console.error('Login API returned non-JSON response');
        throw new Error('Invalid server response');
      }
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }
      
      return data;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  static async logout(): Promise<boolean> {
    try {
      const response = await fetch('/api/auth/logout', { method: 'POST' });
      return response.ok;
    } catch {
      return false;
    }
  }

  static async getDashboardData(): Promise<Record<string, unknown> | null> {
    try {
      const response = await fetch('/api/dashboard/stats');
      if (!response.ok) return null;
      
      const contentType = response.headers.get('content-type');
      if (!contentType?.includes('application/json')) {
        console.error('Dashboard API returned non-JSON response');
        return null;
      }
      
      return await response.json();
    } catch (error) {
      console.error('Dashboard data fetch failed:', error);
      return null;
    }
  }
}