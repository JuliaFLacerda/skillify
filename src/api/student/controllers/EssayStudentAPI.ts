// src/api/student/controllers/EssayStudentAPI.ts
import api from '../../api';
import { EssayResponseDTO } from '../../dtos/essayDtos';

export class EssayStudentAPI {
  /**
   * Gets all available essays for the authenticated student
   * @returns Promise containing array of essay DTOs
   */
  static async getStudentEssays(): Promise<EssayResponseDTO[]> {
    try {
      const response = await api.get<EssayResponseDTO[]>('/api/student/essays');
      return response.data;
    } catch (error) {
      console.error('Error fetching student essays:', error);
      throw error;
    }
  }

    /**
   * Gets a specific essay by ID for the authenticated student
   * @param id The ID of the essay to retrieve
   * @returns Promise containing the essay DTO
   */
    static async getEssayById(id: string): Promise<EssayResponseDTO> {
        try {
          const response = await api.get<EssayResponseDTO>(`/api/student/essays/${id}`);
          return response.data;
        } catch (error) {
          console.error(`Error fetching essay with ID ${id}:`, error);
          throw error;
        }
      }
    }


// Usage example:
/*
async function handleStudentEssayOperations() {
  try {
    // Get all available essays for the authenticated student
    const studentEssays = await EssayStudentAPI.getStudentEssays();
    console.log('Available essays for student:', studentEssays);
    
    // Example of processing the essays
    studentEssays.forEach(essay => {
      console.log(`Essay: ${essay.theme}, Due: ${essay.maxDate}`);
    });
  } catch (error) {
    console.error('Student essay operation failed:', error);
  }
}
*/