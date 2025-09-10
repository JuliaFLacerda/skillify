// src/api/mentor/controllers/TutorSessionMentorAPI.ts
import api from '../../api';
import { TutorSessionCreateDTO, TutorSessionResponseDTO } from '../../dtos/tutorSessionDtos';

export class TutorSessionMentorAPI {
  /**
   * Gets all tutor sessions for the authenticated mentor (mentor only)
   * @returns Promise containing array of tutor session DTOs
   */
  static async getAllSessions(): Promise<TutorSessionResponseDTO[]> {
    try {
      const response = await api.get<TutorSessionResponseDTO[]>('/api/mentor/tutor-sessions');
      return response.data;
    } catch (error) {
      console.error('Error fetching all tutor sessions:', error);
      throw error;
    }
  }

  /**
   * Gets a tutor session by ID for the authenticated mentor (mentor only)
   * @param id Session ID
   * @returns Promise containing tutor session DTO
   */
  static async getSessionById(id: string): Promise<TutorSessionResponseDTO> {
    try {
      const response = await api.get<TutorSessionResponseDTO>(`/api/mentor/tutor-sessions/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching tutor session by ID:', error);
      throw error;
    }
  }

  /**
   * Gets tutor sessions by date for the authenticated mentor (mentor only)
   * @param date Date in ISO format (e.g., "2025-03-25")
   * @returns Promise containing array of tutor session DTOs
   */
  static async getSessionsByDate(date: string): Promise<TutorSessionResponseDTO[]> {
    try {
      const response = await api.get<TutorSessionResponseDTO[]>(`/api/mentor/tutor-sessions/date/${date}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching tutor sessions by date:', error);
      throw error;
    }
  }

  /**
   * Gets tutor sessions by student ID for the authenticated mentor (mentor only)
   * @param studentId Student ID
   * @returns Promise containing array of tutor session DTOs
   */
  static async getSessionsByStudent(studentId: string): Promise<TutorSessionResponseDTO[]> {
    try {
      const response = await api.get<TutorSessionResponseDTO[]>(`/api/mentor/tutor-sessions/student/${studentId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching tutor sessions by student:', error);
      throw error;
    }
  }

  /**
   * Creates a new tutor session for the authenticated mentor (mentor only)
   * @param session Session creation data
   * @returns Promise containing created tutor session DTO
   */
  static async createSession(session: TutorSessionCreateDTO): Promise<TutorSessionResponseDTO> {
    try {
      const response = await api.post<TutorSessionResponseDTO>('/api/mentor/tutor-sessions', session);
      return response.data;
    } catch (error) {
      console.error('Error creating tutor session:', error);
      throw error;
    }
  }

  /**
   * Updates an existing tutor session for the authenticated mentor (mentor only)
   * @param id Session ID
   * @param session Session update data
   * @returns Promise containing updated tutor session DTO
   */
  static async updateSession(id: string, session: TutorSessionCreateDTO): Promise<TutorSessionResponseDTO> {
    try {
      const response = await api.put<TutorSessionResponseDTO>(`/api/mentor/tutor-sessions/${id}`, session);
      return response.data;
    } catch (error) {
      console.error('Error updating tutor session:', error);
      throw error;
    }
  }

  /**
   * Deletes a tutor session for the authenticated mentor (mentor only)
   * @param id Session ID
   * @returns Promise containing void
   */
  static async deleteSession(id: string): Promise<void> {
    try {
      await api.delete(`/api/mentor/tutor-sessions/${id}`);
    } catch (error) {
      console.error('Error deleting tutor session:', error);
      throw error;
    }
  }
}

// Usage example:
/*
async function handleTutorSessionMentorOperations() {
  try {
    // Get all sessions
    const allSessions = await TutorSessionMentorAPI.getAllSessions();
    console.log('All sessions:', allSessions);

    // Create new session
    const newSession: TutorSessionCreateDTO = {
      studentId: "student123",
      mentorId: "mentor456", // Will be overridden by backend auth
      startTime: "2025-03-25T10:00:00",
      endTime: "2025-03-25T11:00:00",
      subject: "Math Tutoring"
    };
    const createdSession = await TutorSessionMentorAPI.createSession(newSession);
    console.log('Created session:', createdSession);

    // Get specific session
    const session = await TutorSessionMentorAPI.getSessionById(createdSession.id);
    console.log('Session:', session);

    // Get sessions by date
    const dateSessions = await TutorSessionMentorAPI.getSessionsByDate("2025-03-25");
    console.log('Date sessions:', dateSessions);

    // Get sessions by student
    const studentSessions = await TutorSessionMentorAPI.getSessionsByStudent("student123");
    console.log('Student sessions:', studentSessions);

    // Update session
    const updatedSession = await TutorSessionMentorAPI.updateSession(createdSession.id, {
      ...newSession,
      subject: "Advanced Math Tutoring"
    });
    console.log('Updated session:', updatedSession);

    // Delete session
    await TutorSessionMentorAPI.deleteSession(createdSession.id);
    console.log('Session deleted successfully');
  } catch (error) {
    console.error('Tutor session mentor operation failed:', error);
  }
}
*/