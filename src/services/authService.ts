import { apiCall, User, ApiResponse } from '@/lib/api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone: string;
  institution_id: string;
  role: 'student' | 'teacher' | 'admin';
  class_id?: number;
}

export interface AuthResponse {
  user: User;
  token: string;
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> {
    const response = await apiCall<{authToken: string, user?: User}>(
      '/auth/login',
      {
        method: 'POST',
        body: JSON.stringify(credentials),
      },
      true // Use auth API
    );

    if (response.success && response.data?.authToken) {
      // Store the token
      localStorage.setItem('attendmate_token', response.data.authToken);
      
      // If user data is included in login response, use it
      if (response.data.user) {
        localStorage.setItem('attendmate_user', JSON.stringify(response.data.user));
        return {
          success: true,
          data: {
            user: response.data.user,
            token: response.data.authToken
          }
        };
      }
      
      // Try to get user profile with the new token
      try {
        const profileResponse = await this.getProfile();
        if (profileResponse.success && profileResponse.data) {
          localStorage.setItem('attendmate_user', JSON.stringify(profileResponse.data));
          return {
            success: true,
            data: {
              user: profileResponse.data,
              token: response.data.authToken
            }
          };
        }
      } catch (error) {
        console.log('Profile fetch failed:', error);
      }
      
      // If all else fails, return success with token only and let the app handle it
      return {
        success: true,
        data: {
          user: {
            id: 0,
            name: 'User',
            email: credentials.email,
            role: 'student' as const, // Default fallback
            phone: '',
            institution_id: '',
            class_id: undefined,
            created_at: new Date().toISOString(),
            active: true
          },
          token: response.data.authToken
        }
      };
    }

    return {
      success: false,
      error: response.error || 'Login failed'
    };
  }

  async register(userData: RegisterData): Promise<ApiResponse<AuthResponse>> {
    const response = await apiCall<AuthResponse>(
      '/auth/signup',  // ✅ updated endpoint
      {
        method: 'POST',
        body: JSON.stringify(userData),
      },
      true // Use auth API
    );

    if (response.success && response.data) {
      localStorage.setItem('attendmate_token', response.data.token);
      localStorage.setItem('attendmate_user', JSON.stringify(response.data.user));
    }

    return response;
  }

  async getProfile(): Promise<ApiResponse<User>> {
    return apiCall<User>('/profile', {}, true);
  }

  async updateProfile(userData: Partial<User>): Promise<ApiResponse<User>> {
    return apiCall<User>(
      '/update-profile',
      {
        method: 'PUT',
        body: JSON.stringify(userData),
      },
      true
    );
  }

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('attendmate_user');
    if (!userStr || userStr === 'undefined' || userStr === 'null') {
      return null;
    }
    try {
      return JSON.parse(userStr);
    } catch (error) {
      console.error('Error parsing user data:', error);
      localStorage.removeItem('attendmate_user');
      return null;
    }
  }

  getToken(): string | null {
    return localStorage.getItem('attendmate_token');
  }

  logout(): void {
    localStorage.removeItem('attendmate_token');
    localStorage.removeItem('attendmate_user');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export const authService = new AuthService();
