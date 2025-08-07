// src/api/student/controllers/ClassroomStudentAPI.ts
import api from '../../api';
import { ClassroomResponseDTO } from '../../dtos/classroomDtos';

export class ClassroomStudentAPI {
  /**
   * Gets a classroom by ID for the authenticated student (student only)
   * @param id Classroom ID
   * @returns Promise containing classroom DTO
   */
  static async getClassroomById(id: string): Promise<ClassroomResponseDTO> {
    try {
      const response = await api.get<ClassroomResponseDTO>(`/api/student/classrooms/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching classroom by ID:', error);
      throw error;
    }
  }

  /**
   * Joins a classroom using a token (student only)
   * @param token Classroom access token
   * @returns Promise containing joined classroom DTO
   */
  static async joinClassroom(token: string): Promise<ClassroomResponseDTO> {
    try {
      const response = await api.post<ClassroomResponseDTO>(`/api/student/classrooms/join/${token}`);
      return response.data;
    } catch (error) {
      console.error('Error joining classroom:', error);
      throw error;
    }
  }
}

// Usage example:
/*
async function handleClassroomStudentOperations() {
  try {
    // Get specific classroom
    const classroom = await ClassroomStudentAPI.getClassroomById("classroom123");
    console.log('Classroom:', classroom);

    // Join classroom with token
    const joinedClassroom = await ClassroomStudentAPI.joinClassroom("valid-token-456");
    console.log('Joined classroom:', joinedClassroom);
  } catch (error) {
    console.error('Classroom student operation failed:', error);
  }
}
*/