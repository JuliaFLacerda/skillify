// src/api/student/controllers/CourseLessonContentWatchEventStudentAPI.ts
import { CourseLessonContentWatchEventRequestDTO, CourseLessonContentWatchEventResponseDTO } from '@/api/dtos/courseLessonContentWatchEventDtos';
import api from '../../api';

export class CourseLessonContentWatchEventStudentAPI {
  /**
   * Gets all watch events for the authenticated student (student only)
   * @returns Promise containing array of watch event DTOs
   */
  static async getAllWatchEvents(): Promise<CourseLessonContentWatchEventResponseDTO[]> {
    try {
      const response = await api.get<CourseLessonContentWatchEventResponseDTO[]>('/api/student/course-lesson-content-watch-events');
      return response.data;
    } catch (error) {
      console.error('Error fetching all watch events:', error);
      throw error;
    }
  }

  /**
   * Gets a watch event by ID for the authenticated student (student only)
   * @param id Watch event ID
   * @returns Promise containing watch event DTO
   */
  static async getWatchEventById(id: string): Promise<CourseLessonContentWatchEventResponseDTO> {
    try {
      const response = await api.get<CourseLessonContentWatchEventResponseDTO>(`/api/student/course-lesson-content-watch-events/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching watch event by ID:', error);
      throw error;
    }
  }

  /**
   * Creates a new watch event for the authenticated student (student only)
   * @param requestDTO Watch event creation data
   * @returns Promise containing created watch event DTO
   */
  static async createWatchEvent(requestDTO: CourseLessonContentWatchEventRequestDTO): Promise<CourseLessonContentWatchEventResponseDTO> {
    try {
      const response = await api.post<CourseLessonContentWatchEventResponseDTO>('/api/student/course-lesson-content-watch-events', requestDTO);
      return response.data;
    } catch (error) {
      console.error('Error creating watch event:', error);
      throw error;
    }
  }
}

// Usage example:
/*
async function handleCourseLessonContentWatchEventStudentOperations() {
  try {
    // Get all watch events
    const allWatchEvents = await CourseLessonContentWatchEventStudentAPI.getAllWatchEvents();
    console.log('All watch events:', allWatchEvents);

    // Get specific watch event
    const watchEvent = await CourseLessonContentWatchEventStudentAPI.getWatchEventById("watchEvent123");
    console.log('Watch event:', watchEvent);

    // Create new watch event
    const newWatchEvent = await CourseLessonContentWatchEventStudentAPI.createWatchEvent({
      courseLessonContentId: "content456",
      studentId: "student789"
    });
    console.log('Created watch event:', newWatchEvent);
  } catch (error) {
    console.error('Watch event student operation failed:', error);
  }
}
*/