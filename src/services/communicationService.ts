import { apiCall, Message, ApiResponse } from '@/lib/api';

export interface SendMessageRequest {
  class_id: number;
  message: string;
  file_url?: string;
}

export interface SubmitDoubtRequest {
  class_id: number;
  question: string;
  anonymous?: boolean;
}

export interface Doubt {
  id: number;
  student_id: number;
  class_id: number;
  question: string;
  anonymous: boolean;
  created_at: string;
  student_name?: string;
}

class CommunicationService {
  async sendMessage(data: SendMessageRequest): Promise<ApiResponse<Message>> {
    return apiCall<Message>('/messages/send', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getClassMessages(classId: number): Promise<ApiResponse<Message[]>> {
    return apiCall<Message[]>(`/messages/class/${classId}`);
  }

  async submitDoubt(data: SubmitDoubtRequest): Promise<ApiResponse<Doubt>> {
    return apiCall<Doubt>('/doubts/submit', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getClassDoubts(classId: number): Promise<ApiResponse<Doubt[]>> {
    return apiCall<Doubt[]>(`/doubts/class/${classId}`);
  }

  async markDoubtResolved(doubtId: number): Promise<ApiResponse<Doubt>> {
    return apiCall<Doubt>(`/doubts/resolve/${doubtId}`, {
      method: 'PUT',
    });
  }
}

export const communicationService = new CommunicationService();