import { apiCall, Attendance, Session, ApiResponse } from '@/lib/api';

export interface AttendanceMarkRequest {
  session_id: number;
  gps_lat: number;
  gps_long: number;
}

export interface AttendanceStats {
  total_sessions: number;
  present: number;
  late: number;
  absent: number;
  attendance_percentage: number;
}

class AttendanceService {
  async markAttendance(data: AttendanceMarkRequest): Promise<ApiResponse<Attendance>> {
    return apiCall<Attendance>('/attendance/mark', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getStudentAttendance(studentId: number): Promise<ApiResponse<Attendance[]>> {
    return apiCall<Attendance[]>(`/attendance/student/${studentId}`);
  }

  async getClassAttendance(classId: number): Promise<ApiResponse<Attendance[]>> {
    return apiCall<Attendance[]>(`/attendance/class/${classId}`);
  }

  async getAttendanceStats(studentId: number): Promise<ApiResponse<AttendanceStats>> {
    return apiCall<AttendanceStats>(`/attendance/stats/${studentId}`);
  }

  async getCurrentSession(classId: number): Promise<ApiResponse<Session>> {
    return apiCall<Session>(`/sessions/current/${classId}`);
  }

  async getClassSessions(classId: number): Promise<ApiResponse<Session[]>> {
    return apiCall<Session[]>(`/sessions/class/${classId}`);
  }

  async createSession(sessionData: Omit<Session, 'id'>): Promise<ApiResponse<Session>> {
    return apiCall<Session>('/sessions/create', {
      method: 'POST',
      body: JSON.stringify(sessionData),
    });
  }

  async endSession(sessionId: number): Promise<ApiResponse<Session>> {
    return apiCall<Session>(`/sessions/end/${sessionId}`, {
      method: 'PUT',
    });
  }
}

export const attendanceService = new AttendanceService();