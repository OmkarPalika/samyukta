import { User as UserType } from '@/lib/types';

export class ClientAuth {
  static async me(): Promise<UserType | null> {
    try {
      const response = await fetch('/api/auth/me');
      if (!response.ok) return null;
      
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

  static async login(email: string, password: string): Promise<UserType | null> {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) return null;
      
      const contentType = response.headers.get('content-type');
      if (!contentType?.includes('application/json')) {
        console.error('Login API returned non-JSON response');
        return null;
      }
      
      return await response.json();
    } catch (error) {
      console.error('Login failed:', error);
      return null;
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