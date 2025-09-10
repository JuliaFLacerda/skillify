// src/api/mentor/controllers/EssayExecutionMentorAPI.ts
import { EssayExecutionResponseDTO } from '@/api/dtos/essayExecutionDtos';
import api from '../../api';

export class EssayExecutionMentorAPI {
  /**
   * Gets all essay executions for the authenticated mentor's classrooms
   * @returns Promise containing array of essay execution DTOs
   */
  static async getAllEssayExecutions(): Promise<EssayExecutionResponseDTO[]> {
    try {
      const response = await api.get<EssayExecutionResponseDTO[]>('/api/mentor/essay-executions');
      return response.data;
    } catch (error) {
      console.error('Error fetching mentor essay executions:', error);
      throw error;
    }
  }

  /**
   * Gets a specific essay execution by ID for the authenticated mentor
   * @param id Essay execution ID
   * @returns Promise containing essay execution DTO
   */
  static async getEssayExecutionById(id: string): Promise<EssayExecutionResponseDTO> {
    try {
      const response = await api.get<EssayExecutionResponseDTO>(`/api/mentor/essay-executions/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching essay execution by ID:', error);
      throw error;
    }
  }
}

// Usage example:
/*
async function handleMentorEssayExecutionOperations() {
  try {
    // Get all essay executions for mentor's classrooms
    const executions = await EssayExecutionMentorAPI.getAllEssayExecutions();
    console.log('All essay executions in my classrooms:', executions);

    // Get specific essay execution
    const execution = await EssayExecutionMentorAPI.getEssayExecutionById("execution123");
    console.log('Specific essay execution:', execution);

  } catch (error) {
    console.error('Mentor essay execution operation failed:', error);
  }
}
*/