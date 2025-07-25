import { User as UserData, UserResponse, LoginCredentials } from '@/lib/types'

export class User {
  static async create(userData: Omit<UserData, 'id' | 'created_at'>): Promise<UserData> {
    const { insertOne } = await import('@/lib/db-utils')
    return insertOne('users', userData) as Promise<UserData>
  }

  static async findById(id: string): Promise<UserData | null> {
    const { findById } = await import('@/lib/db-utils')
    return findById('users', id) as Promise<UserData | null>
  }

  static async findByEmail(email: string): Promise<UserData | null> {
    const { getCollection } = await import('@/lib/db-utils')
    const users = await getCollection('users')
    const user = await users.findOne({ email })
    return user ? { id: user._id.toString(), ...user } as unknown as UserData : null
  }

  static async getAll(): Promise<UserData[]> {
    try {
      const response = await fetch('/api/users', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      
      const data = await response.json();
      return data.users || [];
    } catch (error) {
      console.error('Failed to fetch users:', error);
      throw error;
    }
  }
  static async me(): Promise<UserData> {
    try {
      // Replace with your actual API endpoint
      const response = await fetch('/api/auth/me', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      
      if (response.status === 401) {
        // Handle 401 silently - user is not authenticated
        throw new Error('Not authenticated');
      }
      
      if (!response.ok) {
        throw new Error(`Authentication failed: ${response.status}`);
      }
      
      const userData = await response.json();
      return userData;
    } catch (error) {
      // Don't log expected authentication errors to console
      if (error instanceof Error && error.message === 'Not authenticated') {
        throw error;
      }
      // Log unexpected errors
      console.error('Unexpected authentication error:', error);
      throw new Error('Not authenticated');
    }
  }

  static async logout(): Promise<void> {
    try {
      // Replace with your actual API endpoint
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Logout failed');
      }
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  }

  static async checkEmail(email: string): Promise<{ exists: boolean; role?: 'admin' | 'coordinator' | 'participant' }> {
    try {
      const response = await fetch('/api/auth/check-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to check email');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Email check failed:', error);
      throw error;
    }
  }

  static async login(credentials: LoginCredentials): Promise<UserResponse> {
    try {
      console.log('Attempting login with:', { email: credentials.email });
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
        credentials: 'include',
      });
      
      const responseData = await response.json();
      console.log('Login response:', { status: response.status, data: responseData });
      
      if (!response.ok) {
        throw new Error(responseData.error || `Login failed with status ${response.status}`);
      }
      
      return responseData;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  static async updateRole(userId: string, role: string): Promise<void> {
    try {
      const response = await fetch(`/api/users/${userId}/role`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role }),
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Failed to update user role');
      }
    } catch (error) {
      console.error('Failed to update user role:', error);
      throw error;
    }
  }

  static async resetPassword(userId: string): Promise<void> {
    try {
      const response = await fetch(`/api/users/${userId}/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Failed to reset password');
      }
    } catch (error) {
      console.error('Failed to reset password:', error);
      throw error;
    }
  }

  static async updateProfile(userId: string, profileData: Partial<UserData>): Promise<UserData> {
    try {
      const response = await fetch(`/api/users/${userId}/profile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
        credentials: 'include',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update profile');
      }

      const result = await response.json();
      return result.user;
    } catch (error) {
      console.error('Failed to update profile:', error);
      throw error;
    }
  }
}