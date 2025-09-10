import { GoalExecutionResponseDTO } from '@/api/dtos/goalExecutionDtos';
import api from '../../api';

export class GoalExecutionStudentAPI {
  /**
   * Gets all goal executions for the authenticated student (student only)
   * @returns Promise containing array of goal execution DTOs
   */
  static async getAllGoalExecutions(): Promise<GoalExecutionResponseDTO[]> {
    try {
      const response = await api.get<GoalExecutionResponseDTO[]>('/api/student/goal-executions');
      return response.data;
    } catch (error) {
      console.error('Error fetching all goal executions:', error);
      throw error;
    }
  }

  /**
   * Gets a goal execution by ID for the authenticated student (student only)
   * @param executionId Goal execution ID
   * @returns Promise containing goal execution DTO
   */
  static async getGoalExecutionById(executionId: string): Promise<GoalExecutionResponseDTO> {
    try {
      const response = await api.get<GoalExecutionResponseDTO>(`/api/student/goal-executions/${executionId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching goal execution by ID:', error);
      throw error;
    }
  }
}