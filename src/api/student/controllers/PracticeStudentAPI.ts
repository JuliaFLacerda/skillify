// src/api/student/controllers/PracticeStudentAPI.ts
import api from '../../api';
import { PracticeResponseDTO } from '../../dtos/practiceDtos';

export class PracticeStudentAPI {
  /**
   * Gets all practices for the authenticated student (student only)
   * @returns Promise containing array of practice DTOs
   */
  static async getAllPractices(): Promise<PracticeResponseDTO[]> {
    try {
      const response = await api.get<PracticeResponseDTO[]>('/api/student/practices');
      return response.data;
    } catch (error) {
      console.error('Error fetching all practices:', error);
      throw error;
    }
  }

  /**
   * Gets a practice by ID for the authenticated student (student only)
   * @param id Practice ID
   * @returns Promise containing practice DTO
   */
  static async getPracticeById(id: string): Promise<PracticeResponseDTO> {
    try {
      const response = await api.get<PracticeResponseDTO>(`/api/student/practices/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching practice by ID:', error);
      throw error;
    }
  }

  /**
   * Gets practices by classroom ID for the authenticated student (student only)
   * @param classroomId Classroom ID
   * @returns Promise containing array of practice DTOs
   */
  static async getPracticesByClassroom(classroomId: string): Promise<PracticeResponseDTO[]> {
    try {
      const response = await api.get<PracticeResponseDTO[]>(`/api/student/practices/classroom/${classroomId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching practices by classroom:', error);
      throw error;
    }
  }
}

// Usage example:
/*
async function handlePracticeStudentOperations() {
  try {
    // Get all practices
    const allPractices = await PracticeStudentAPI.getAllPractices();
    console.log('All practices:', allPractices);

    // Get specific practice
    const practice = await PracticeStudentAPI.getPracticeById("practice123");
    console.log('Practice:', practice);

    // Get practices by classroom
    const classroomPractices = await PracticeStudentAPI.getPracticesByClassroom("classroom456");
    console.log('Classroom practices:', classroomPractices);
  } catch (error) {
    console.error('Practice student operation failed:', error);
  }
}
*/