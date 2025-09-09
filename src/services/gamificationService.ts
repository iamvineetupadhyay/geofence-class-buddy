import { apiCall, ApiResponse } from '@/lib/api';

export interface Badge {
  id: number;
  name: string;
  description: string;
  criteria: string;
  image_url?: string;
}

export interface StudentBadge {
  student_id: number;
  badge_id: number;
  awarded_at: string;
  badge: Badge;
}

export interface LeaderboardEntry {
  student_id: number;
  student_name: string;
  attendance_score: number;
  rank: number;
  badges_count: number;
}

export interface AttendanceStreak {
  current_streak: number;
  longest_streak: number;
  total_present: number;
  streak_start_date?: string;
}

class GamificationService {
  async getStudentBadges(studentId: number): Promise<ApiResponse<StudentBadge[]>> {
    return apiCall<StudentBadge[]>(`/gamification/badges/${studentId}`);
  }

  async getAttendanceStreak(studentId: number): Promise<ApiResponse<AttendanceStreak>> {
    return apiCall<AttendanceStreak>(`/gamification/streaks/${studentId}`);
  }

  async getClassLeaderboard(classId: number): Promise<ApiResponse<LeaderboardEntry[]>> {
    return apiCall<LeaderboardEntry[]>(`/gamification/leaderboard/class/${classId}`);
  }

  async getGlobalLeaderboard(): Promise<ApiResponse<LeaderboardEntry[]>> {
    return apiCall<LeaderboardEntry[]>('/gamification/leaderboard/global');
  }

  async getAllBadges(): Promise<ApiResponse<Badge[]>> {
    return apiCall<Badge[]>('/gamification/badges');
  }

  async checkAndAwardBadges(studentId: number): Promise<ApiResponse<StudentBadge[]>> {
    return apiCall<StudentBadge[]>(`/gamification/check-badges/${studentId}`, {
      method: 'POST',
    });
  }
}

export const gamificationService = new GamificationService();