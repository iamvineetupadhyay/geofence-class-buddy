import { apiCall, Note, ApiResponse } from '@/lib/api';

export interface Subject {
  id: number;
  name: string;
  teacher_id: number;
  class_id: number;
}

export interface UploadNoteRequest {
  subject_id: number;
  title: string;
  file_url: string;
}

class NotesService {
  async getSubjects(classId?: number): Promise<ApiResponse<Subject[]>> {
    const endpoint = classId ? `/subjects/class/${classId}` : '/subjects';
    return apiCall<Subject[]>(endpoint);
  }

  async getSubjectNotes(subjectId: number): Promise<ApiResponse<Note[]>> {
    return apiCall<Note[]>(`/notes/subject/${subjectId}`);
  }

  async uploadNote(data: UploadNoteRequest): Promise<ApiResponse<Note>> {
    return apiCall<Note>('/notes/upload', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async downloadNote(noteId: number): Promise<ApiResponse<{ download_url: string }>> {
    return apiCall<{ download_url: string }>(`/notes/download/${noteId}`, {
      method: 'PUT',
    });
  }

  async deleteNote(noteId: number): Promise<ApiResponse<void>> {
    return apiCall<void>(`/notes/${noteId}`, {
      method: 'DELETE',
    });
  }

  async searchNotes(query: string, classId?: number): Promise<ApiResponse<Note[]>> {
    const params = new URLSearchParams({ q: query });
    if (classId) params.append('class_id', classId.toString());
    
    return apiCall<Note[]>(`/notes/search?${params.toString()}`);
  }
}

export const notesService = new NotesService();