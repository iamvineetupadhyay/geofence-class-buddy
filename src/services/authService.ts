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
    const response = await apiCall<any>(
      '/auth/login',
      {
        method: 'POST',
        body: JSON.stringify(credentials),
      },
      true
    );

    if (response.success && response.data) {
      const raw = response.data as any;
      const token: string | undefined =
        raw.token || raw.authToken || raw.auth_token || raw.access_token || raw.jwt;
      const existingUser = this.getCurrentUser();
      const user: User | undefined = raw.user || raw.profile || raw.me;

      if (token) {
        localStorage.setItem('attendmate_token', token);
      }

      if (user) {
        // Preserve previously known role if Xano doesn't return it
        const merged: User = {
          ...(existingUser || {} as User),
          ...user,
          role: (user as any).role || existingUser?.role || 'student',
        } as User;
        localStorage.setItem('attendmate_user', JSON.stringify(merged));
        return { success: true, data: { user: merged, token: token || '' } };
      }

      // Try to get user profile with the new token
      try {
        const profileResponse = await this.getProfile();
        if (profileResponse.success && profileResponse.data) {
          const existing = existingUser || this.getCurrentUser();
          const profileUser = profileResponse.data as User;
          const merged: User = {
            ...(existing || {} as User),
            ...profileUser,
            role: (profileUser as any).role || existing?.role || 'student',
          } as User;
          localStorage.setItem('attendmate_user', JSON.stringify(merged));
          return { success: true, data: { user: merged, token: token || '' } };
        }
      } catch (error) {
        console.log('Profile fetch failed:', error);
      }

      // Preserve any existing user (keeps correct role from prior signup/session)
      if (existingUser) {
        localStorage.setItem('attendmate_user', JSON.stringify(existingUser));
        return { success: true, data: { user: existingUser, token: token || '' } };
      }

      // Final minimal fallback (no role assumption beyond student)
      const fallbackUser: User = {
        id: 0,
        name: 'User',
        email: credentials.email,
        role: 'student',
        phone: '',
        institution_id: '',
        class_id: undefined,
        created_at: new Date().toISOString(),
        active: true,
      };
      localStorage.setItem('attendmate_user', JSON.stringify(fallbackUser));
      return { success: true, data: { user: fallbackUser, token: token || '' } };
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
      const user = JSON.parse(userStr) as User;
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
