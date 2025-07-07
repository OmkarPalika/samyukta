// User entity and authentication methods
export interface UserData {
  id: string;
  full_name: string;
  email: string;
  role?: string;
  linkedin?: string;
  instagram?: string;
  portfolio?: string;
  college?: string;
  track?: string;
  year?: string;
  dept?: string;
  created_at?: string;
  updated_at?: string;
}

export interface UserResponse extends UserData {
  token?: string;
  session_id?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export class User {
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

  static async login(credentials: LoginCredentials): Promise<UserResponse> {
    try {
      // Replace with your actual API endpoint
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Login failed');
      }
      
      const userData = await response.json();
      return userData;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
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

  static async updateProfile(userId: string, profileData: any): Promise<void> {
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
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
      throw error;
    }
  }
}