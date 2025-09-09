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
    const response = await apiCall<AuthResponse>(
      '/login',
      {
        method: 'POST',
        body: JSON.stringify(credentials),
      },
      true // Use auth API
    );

    if (response.success && response.data) {
      localStorage.setItem('attendmate_token', response.data.token);
      localStorage.setItem('attendmate_user', JSON.stringify(response.data.user));
    }

    return response;
  }

  async register(userData: RegisterData): Promise<ApiResponse<AuthResponse>> {
    const response = await apiCall<AuthResponse>(
      '/register',
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
    return userStr ? JSON.parse(userStr) : null;
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