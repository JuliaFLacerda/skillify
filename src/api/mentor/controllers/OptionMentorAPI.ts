// src/api/mentor/controllers/OptionMentorAPI.ts
import { OptionCreateDTO } from '@/api/dtos/optionDtos';
import api from '../../api';
import { OptionResponseDTO } from '@/api/dtos/questionDtos';

export class OptionMentorAPI {
  /**
   * Creates a new option for a question (mentor only)
   * @param option Option creation data
   * @returns Promise containing created option DTO
   */
  static async createOption(option: OptionCreateDTO): Promise<OptionResponseDTO> {
    try {
      const response = await api.post<OptionResponseDTO>('/api/mentor/options', option);
      return response.data;
    } catch (error) {
      console.error('Error creating option:', error);
      throw error;
    }
  }

  /**
   * Gets a specific option by ID (mentor only)
   * @param optionId The ID of the option to retrieve
   * @returns Promise containing option DTO
   */
  static async getOption(optionId: string): Promise<OptionResponseDTO> {
    try {
      const response = await api.get<OptionResponseDTO>(`/api/mentor/options/${optionId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching option:', error);
      throw error;
    }
  }

  /**
   * Gets all options for a specific question (mentor only)
   * @param questionId The ID of the question to get options for
   * @returns Promise containing array of option DTOs
   */
  static async getOptionsByQuestion(questionId: string): Promise<OptionResponseDTO[]> {
    try {
      const response = await api.get<OptionResponseDTO[]>(`/api/mentor/options/question/${questionId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching options for question:', error);
      throw error;
    }
  }

  /**
   * Updates an existing option (mentor only)
   * @param optionId The ID of the option to update
   * @param option Option update data
   * @returns Promise containing updated option DTO
   */
  static async updateOption(optionId: string, option: OptionCreateDTO): Promise<OptionResponseDTO> {
    try {
      const response = await api.put<OptionResponseDTO>(`/api/mentor/options/${optionId}`, option);
      return response.data;
    } catch (error) {
      console.error('Error updating option:', error);
      throw error;
    }
  }

  /**
   * Deletes an option (mentor only)
   * @param optionId The ID of the option to delete
   * @returns Promise that resolves when deletion is complete
   */
  static async deleteOption(optionId: string): Promise<void> {
    try {
      await api.delete(`/api/mentor/options/${optionId}`);
    } catch (error) {
      console.error('Error deleting option:', error);
      throw error;
    }
  }
}