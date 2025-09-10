// src/api/admin/controllers/TutorSessionAdminAPI.ts
import api from '../../api';
import { TutorSessionCreateDTO, TutorSessionResponseDTO, SessionType } from '../../dtos/tutorSessionDtos';

export class TutorSessionAdminAPI {
  /**
   * Gets all tutor sessions (admin only)
   * @returns Promise containing array of tutor session DTOs
   */
  static async getAllSessions(): Promise<TutorSessionResponseDTO[]> {
    try {
      const response = await api.get<TutorSessionResponseDTO[]>('/api/admin/tutor-sessions');
      return response.data;
    } catch (error) {
      console.error('Error fetching all tutor sessions:', error);
      throw error;
    }
  }

  /**
   * Gets a tutor session by ID (admin only)
   * @param id Session ID
   * @returns Promise containing tutor session DTO
   */
  static async getSessionById(id: string): Promise<TutorSessionResponseDTO> {
    try {
      const response = await api.get<TutorSessionResponseDTO>(`/api/admin/tutor-sessions/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching tutor session by ID:', error);
      throw error;
    }
  }

  /**
   * Gets tutor sessions by mentor ID (admin only)
   * @param mentorId Mentor ID
   * @returns Promise containing array of tutor session DTOs
   */
  static async getSessionsByMentor(mentorId: string): Promise<TutorSessionResponseDTO[]> {
    try {
      const response = await api.get<TutorSessionResponseDTO[]>(`/api/admin/tutor-sessions/mentor/${mentorId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching tutor sessions by mentor:', error);
      throw error;
    }
  }

  /**
   * Gets tutor sessions by student ID (admin only)
   * @param studentId Student ID
   * @returns Promise containing array of tutor session DTOs
   */
  static async getSessionsByStudent(studentId: string): Promise<TutorSessionResponseDTO[]> {
    try {
      const response = await api.get<TutorSessionResponseDTO[]>(`/api/admin/tutor-sessions/student/${studentId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching tutor sessions by student:', error);
      throw error;
    }
  }

  /**
   * Gets tutor sessions by mentor ID and date (admin only)
   * @param mentorId Mentor ID
   * @param date ISO date string (e.g., "2025-03-25")
   * @returns Promise containing array of tutor session DTOs
   */
  static async getSessionsByMentorAndDate(mentorId: string, date: string): Promise<TutorSessionResponseDTO[]> {
    try {
      const response = await api.get<TutorSessionResponseDTO[]>(`/api/admin/tutor-sessions/mentor/${mentorId}/date/${date}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching tutor sessions by mentor and date:', error);
      throw error;
    }
  }

  /**
   * Gets tutor sessions by student ID and date (admin only)
   * @param studentId Student ID
   * @param date ISO date string (e.g., "2025-03-25")
   * @returns Promise containing array of tutor session DTOs
   */
  static async getSessionsByStudentAndDate(studentId: string, date: string): Promise<TutorSessionResponseDTO[]> {
    try {
      const response = await api.get<TutorSessionResponseDTO[]>(`/api/admin/tutor-sessions/student/${studentId}/date/${date}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching tutor sessions by student and date:', error);
      throw error;
    }
  }

  /**
   * Creates a new tutor session (admin only)
   * @param session Session creation data
   * @returns Promise containing created tutor session DTO
   */
  static async createSession(session: TutorSessionCreateDTO): Promise<TutorSessionResponseDTO> {
    try {
      const response = await api.post<TutorSessionResponseDTO>('/api/admin/tutor-sessions', session);
      return response.data;
    } catch (error) {
      console.error('Error creating tutor session:', error);
      throw error;
    }
  }

  /**
   * Updates an existing tutor session (admin only)
   * @param id Session ID
   * @param session Session update data
   * @returns Promise containing updated tutor session DTO
   */
  static async updateSession(id: string, session: TutorSessionCreateDTO): Promise<TutorSessionResponseDTO> {
    try {
      const response = await api.put<TutorSessionResponseDTO>(`/api/admin/tutor-sessions/${id}`, session);
      return response.data;
    } catch (error) {
      console.error('Error updating tutor session:', error);
      throw error;
    }
  }

  /**
   * Deletes a tutor session (admin only)
   * @param id Session ID
   * @returns Promise containing void
   */
  static async deleteSession(id: string): Promise<void> {
    try {
      await api.delete(`/api/admin/tutor-sessions/${id}`);
    } catch (error) {
      console.error('Error deleting tutor session:', error);
      throw error;
    }
  }
}

// Usage example:
/*
async function handleTutorSessionAdminOperations() {
  try {
    // Get all sessions
    const allSessions = await TutorSessionAdminAPI.getAllSessions();
    
    // Create new session
    const newSession: TutorSessionCreateDTO = {
      mentorId: "mentor123",
      title: "Math Tutoring",
      date: "2025-03-25",
      dateHour: "2025-03-25T14:00:00",
      type: SessionType.CHAMADA_DE_VIDEO,
      link: "https://video.call/123",
      studentId: "student456"
    };
    const createdSession = await TutorSessionAdminAPI.createSession(newSession);
    
    // Get sessions by mentor and date
    const mentorSessions = await TutorSessionAdminAPI.getSessionsByMentorAndDate("mentor123", "2025-03-25");
    
    // Update session
    const updatedSession = await TutorSessionAdminAPI.updateSession(createdSession.id, {
      ...newSession,
      title: "Updated Math Tutoring"
    });
    
    // Delete session
    await TutorSessionAdminAPI.deleteSession(createdSession.id);
  } catch (error) {
    console.error('Tutor session admin operation failed:', error);
  }
}
*/