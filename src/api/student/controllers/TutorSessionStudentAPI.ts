// src/api/student/controllers/TutorSessionStudentAPI.ts
import api from '../../api';
import { TutorSessionCreateDTO, TutorSessionResponseDTO } from '../../dtos/tutorSessionDtos';

export class TutorSessionStudentAPI {
  /**
   * Gets all tutor sessions for the authenticated student (student only)
   * @returns Promise containing array of tutor session DTOs
   */
  static async getMyTutorSessions(): Promise<TutorSessionResponseDTO[]> {
    try {
      const response = await api.get<TutorSessionResponseDTO[]>('/api/student/tutor-sessions');
      return response.data;
    } catch (error) {
      console.error('Error fetching my tutor sessions:', error);
      throw error;
    }
  }

  /**
   * Gets a tutor session by ID for the authenticated student (student only)
   * @param id Tutor session ID
   * @returns Promise containing tutor session DTO
   */
  static async getTutorSessionById(id: string): Promise<TutorSessionResponseDTO> {
    try {
      const response = await api.get<TutorSessionResponseDTO>(`/api/student/tutor-sessions/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching tutor session by ID:', error);
      throw error;
    }
  }

  /**
   * Requests a new tutor session for the authenticated student (student only)
   * @param sessionDTO Tutor session creation data
   * @returns Promise containing created tutor session DTO
   */
  static async requestTutorSession(sessionDTO: TutorSessionCreateDTO): Promise<TutorSessionResponseDTO> {
    try {
      const response = await api.post<TutorSessionResponseDTO>('/api/student/tutor-sessions', sessionDTO);
      return response.data;
    } catch (error) {
      console.error('Error requesting tutor session:', error);
      throw error;
    }
  }

    /**
   * Gets tutor sessions for a specific mentor and date (student only)
   * @param mentorId ID of the mentor
   * @param date ISO string (yyyy-MM-dd)
   * @returns Promise containing array of tutor session DTOs
   */
  static async getSessionsByMentorAndDate(mentorId: string, date: string): Promise<TutorSessionResponseDTO[]> {
    try {
      const response = await api.get<TutorSessionResponseDTO[]>('/api/student/tutor-sessions/by-mentor-and-date', {
        params: { mentorId, date }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching sessions by mentor and date:', error);
      throw error;
    }
  }


  /**
   * Deletes a tutor session by ID for the authenticated student (student only)
   * @param id Tutor session ID
   * @returns Promise resolving when deletion is successful
   */
  static async deleteTutorSession(id: string): Promise<void> {
    try {
      await api.delete(`/api/student/tutor-sessions/${id}`);
    } catch (error) {
      console.error('Error deleting tutor session:', error);
      throw error;
    }
  }
}

// Usage example:
/*
async function handleTutorSessionStudentOperations() {
  try {
    // Get all tutor sessions
    const mySessions = await TutorSessionStudentAPI.getMyTutorSessions();
    console.log('My tutor sessions:', mySessions);

    // Get specific tutor session
    const session = await TutorSessionStudentAPI.getTutorSessionById("session123");
    console.log('Tutor session:', session);

    // Request new tutor session
    const newSession: TutorSessionCreateDTO = {
      studentId: "student456", // Will be overridden by backend auth
      mentorId: "mentor789",
      startTime: "2025-03-26T10:00:00",
      endTime: "2025-03-26T11:00:00",
      subject: "Math Tutoring"
    };
    const createdSession = await TutorSessionStudentAPI.requestTutorSession(newSession);
    console.log('Created tutor session:', createdSession);
  } catch (error) {
    console.error('Tutor session student operation failed:', error);
  }
}
*/