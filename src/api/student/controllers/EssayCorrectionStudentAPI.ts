// src/api/student/controllers/EssayCorrectionStudentAPI.ts
import api from '../../api';
import { EssayCorrectionResponseDTO } from '../../dtos/essayCorrectionDtos';

export class EssayCorrectionStudentAPI {
  /**
   * Gets all essay corrections for the authenticated student (student only)
   * @returns Promise containing array of essay correction DTOs
   */
  static async getAllEssayCorrections(): Promise<EssayCorrectionResponseDTO[]> {
    try {
      const response = await api.get<EssayCorrectionResponseDTO[]>('/api/student/essay-corrections');
      return response.data;
    } catch (error) {
      console.error('Error fetching all essay corrections:', error);
      throw error;
    }
  }

  /**
   * Gets an essay correction by ID for the authenticated student (student only)
   * @param id Essay correction ID
   * @returns Promise containing essay correction DTO
   */
  static async getEssayCorrectionById(id: string): Promise<EssayCorrectionResponseDTO> {
    try {
      const response = await api.get<EssayCorrectionResponseDTO>(`/api/student/essay-corrections/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching essay correction by ID:', error);
      throw error;
    }
  }

  /**
   * Gets an essay correction by execution ID for the authenticated student (student only)
   * @param executionId Essay execution ID
   * @returns Promise containing essay correction DTO
   */
  static async getEssayCorrectionByExecution(executionId: string): Promise<EssayCorrectionResponseDTO> {
    try {
      const response = await api.get<EssayCorrectionResponseDTO>(`/api/student/essay-corrections/essay-execution/${executionId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching essay correction by execution ID:', error);
      throw error;
    }
  }
}

// Usage example:
/*
async function handleEssayCorrectionStudentOperations() {
  try {
    // Get all essay corrections
    const allCorrections = await EssayCorrectionStudentAPI.getAllEssayCorrections();
    console.log('All essay corrections:', allCorrections);

    // Get specific essay correction
    const correction = await EssayCorrectionStudentAPI.getEssayCorrectionById("correction123");
    console.log('Essay correction:', correction);

    // Get essay correction by execution
    const correctionByExecution = await EssayCorrectionStudentAPI.getEssayCorrectionByExecution("execution456");
    console.log('Essay correction by execution:', correctionByExecution);
  } catch (error) {
    console.error('Essay correction student operation failed:', error);
  }
}
*/