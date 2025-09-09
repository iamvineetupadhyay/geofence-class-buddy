import { apiCall, Event, Faculty, ApiResponse } from '@/lib/api';

export interface CreateEventRequest {
  title: string;
  description: string;
  media_url?: string;
}

class EventsService {
  async getEvents(): Promise<ApiResponse<Event[]>> {
    return apiCall<Event[]>('/events/list');
  }

  async createEvent(data: CreateEventRequest): Promise<ApiResponse<Event>> {
    return apiCall<Event>('/events/create', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async deleteEvent(eventId: number): Promise<ApiResponse<void>> {
    return apiCall<void>(`/events/${eventId}`, {
      method: 'DELETE',
    });
  }

  async getFaculty(): Promise<ApiResponse<Faculty[]>> {
    return apiCall<Faculty[]>('/faculty/list');
  }

  async searchFaculty(query: string): Promise<ApiResponse<Faculty[]>> {
    return apiCall<Faculty[]>(`/faculty/search?q=${encodeURIComponent(query)}`);
  }
}

export const eventsService = new EventsService();