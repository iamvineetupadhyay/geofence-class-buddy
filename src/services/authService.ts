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
      
      // If all else fails, construct a minimal user from credentials and persist it
      const fallbackUser: User = {
        id: 0,
        name: 'User',
        email: credentials.email,
        role: 'student' as const, // Default fallback
        phone: '',
        institution_id: '',
        class_id: undefined,
        created_at: new Date().toISOString(),
        active: true,
      };
      localStorage.setItem('attendmate_user', JSON.stringify(fallbackUser));
      return {
        success: true,
        data: {
          user: fallbackUser,
          token: response.data.authToken,
        }
      };
    }

    return {
      success: false,
      error: response.error || 'Login failed'
    };
  }

  async register(userData: RegisterData): Promise<ApiResponse<AuthResponse>> {
    const response = await apiCall<any>(
      '/auth/signup',
      {
        method: 'POST',
        body: JSON.stringify(userData),
      },
      true // Use auth API
    );

    if (response.success && response.data) {
      const token: string | undefined = response.data.token || response.data.authToken;
      const user: User | undefined = response.data.user;

      if (token) {
        localStorage.setItem('attendmate_token', token);
      }

      if (user) {
        localStorage.setItem('attendmate_user', JSON.stringify(user));
        return { success: true, data: { user, token: token || '' } };
      }

      // Try to fetch profile if user wasn't returned in the signup response
      try {
        const profileResp = await this.getProfile();
        if (profileResp.success && profileResp.data) {
          localStorage.setItem('attendmate_user', JSON.stringify(profileResp.data));
          return { success: true, data: { user: profileResp.data, token: token || '' } };
        }
      } catch (e) {
        console.log('Signup profile fetch failed:', e);
      }

      // Fallback to the submitted data so the app can proceed (role-based UI works)
      const fallbackUser: User = {
        id: 0,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        phone: userData.phone,
        institution_id: userData.institution_id,
        class_id: userData.class_id,
        created_at: new Date().toISOString(),
        active: true,
      };
      localStorage.setItem('attendmate_user', JSON.stringify(fallbackUser));
      return { success: true, data: { user: fallbackUser, token: token || '' } };
    }

    return {
      success: false,
      error: response.error || 'Registration failed',
    };
  }

  async getProfile(): Promise<ApiResponse<User>> {
    // Try common Xano auth profile endpoints to ensure role is retrieved
    const endpoints = ['/profile', '/me', '/auth/me', '/users/me'];
    for (const ep of endpoints) {
      const res = await apiCall<User>(ep, {}, true);
      if (res.success && res.data) return res;
    }
    return { success: false, error: 'Profile fetch failed' };
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
      const user = JSON.parse(userStr);
      // Ensure role is always defined
      if (user && !user.role) {
        user.role = 'student';
      }
      return user;
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
