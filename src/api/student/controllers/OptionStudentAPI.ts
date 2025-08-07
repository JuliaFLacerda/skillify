// src/api/student/controllers/OptionStudentAPI.ts
import api from '../../api';
import { OptionResponseDTO } from '../../dtos/optionDtos';

export class OptionStudentAPI {
  /**
   * Gets options by question ID for the authenticated student (student only)
   * @param questionId Question ID
   * @returns Promise containing array of option DTOs
   */
  static async getOptionsByQuestion(questionId: string): Promise<OptionResponseDTO[]> {
    try {
      const response = await api.get<OptionResponseDTO[]>(`/api/student/options/question/${questionId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching options by question:', error);
      throw error;
    }
  }

  /**
   * Gets an option by ID for the authenticated student (student only)
   * @param id Option ID
   * @returns Promise containing option DTO
   */
  static async getOptionById(id: string): Promise<OptionResponseDTO> {
    try {
      const response = await api.get<OptionResponseDTO>(`/api/student/options/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching option by ID:', error);
      throw error;
    }
  }
}

// Usage example:
/*
async function handleOptionStudentOperations() {
  try {
    // Get options by question
    const questionOptions = await OptionStudentAPI.getOptionsByQuestion("question123");
    console.log('Question options:', questionOptions);

    // Get specific option
    const option = await OptionStudentAPI.getOptionById("option456");
    console.log('Option:', option);
  } catch (error) {
    console.error('Option student operation failed:', error);
  }
}
*/