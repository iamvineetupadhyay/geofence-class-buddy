// Xano API Configuration
export const API_CONFIG = {
  BASE_URL: 'https://x8ki-letl-twmt.n7.xano.io/api:EUQ89ale',
  AUTH_URL: 'https://x8ki-letl-twmt.n7.xano.io/api:_DwOvQad',
} as const;

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  institution_id: string;
  role: 'student' | 'teacher' | 'admin';
  class_id?: number;
  created_at: string;
  active: boolean;
}

export interface Session {
  id: number;
  class_id: number;
  teacher_id: number;
  start_time: string;
  end_time: string;
  status: string;
}

export interface Attendance {
  id: number;
  session_id: number;
  student_id: number;
  check_in_time: string;
  check_out_time?: string;
  status: 'present' | 'late' | 'absent';
}

export interface Message {
  id: number;
  sender_id: number;
  class_id: number;
  message: string;
  file_url?: string;
  created_at: string;
}

export interface Note {
  id: number;
  subject_id: number;
  title: string;
  file_url: string;
  uploaded_by: number;
  uploaded_at: string;
  download_count: number;
}

export interface Event {
  id: number;
  title: string;
  description: string;
  media_url?: string;
  created_by: number;
  created_at: string;
}

export interface Faculty {
  id: number;
  name: string;
  email: string;
  phone: string;
  designation: string;
  department: string;
}

// Generic API call function
export async function apiCall<T = any>(
  endpoint: string,
  options: RequestInit = {},
  useAuthApi: boolean = false
): Promise<ApiResponse<T>> {
  const baseUrl = useAuthApi ? API_CONFIG.AUTH_URL : API_CONFIG.BASE_URL;
  const token = localStorage.getItem('attendmate_token');

  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${baseUrl}${endpoint}`, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || 'API call failed',
      };
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}