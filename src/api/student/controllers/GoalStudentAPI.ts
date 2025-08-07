// src/api/student/controllers/GoalStudentAPI.ts
import api from '../../api';
import { GoalResponseDTO } from '../../dtos/goalDtos';

export class GoalStudentAPI {
  /**
   * Gets all goals for the authenticated student (student only)
   * @returns Promise containing array of goal DTOs
   */
  static async getAllGoals(): Promise<GoalResponseDTO[]> {
    try {
      const response = await api.get<GoalResponseDTO[]>('/api/student/goals');
      return response.data;
    } catch (error) {
      console.error('Error fetching all goals:', error);
      throw error;
    }
  }

  /**
   * Gets active goals for the authenticated student (student only)
   * @returns Promise containing array of goal DTOs
   */
  static async getActiveGoals(): Promise<GoalResponseDTO[]> {
    try {
      const response = await api.get<GoalResponseDTO[]>('/api/student/goals/active');
      return response.data;
    } catch (error) {
      console.error('Error fetching active goals:', error);
      throw error;
    }
  }

  /**
   * Gets upcoming goals for the authenticated student (student only)
   * @returns Promise containing array of goal DTOs
   */
  static async getUpcomingGoals(): Promise<GoalResponseDTO[]> {
    try {
      const response = await api.get<GoalResponseDTO[]>('/api/student/goals/upcoming');
      return response.data;
    } catch (error) {
      console.error('Error fetching upcoming goals:', error);
      throw error;
    }
  }

  /**
   * Gets past goals for the authenticated student (student only)
   * @returns Promise containing array of goal DTOs
   */
  static async getPastGoals(): Promise<GoalResponseDTO[]> {
    try {
      const response = await api.get<GoalResponseDTO[]>('/api/student/goals/past');
      return response.data;
    } catch (error) {
      console.error('Error fetching past goals:', error);
      throw error;
    }
  }

  /**
   * Gets a specific goal by ID for the authenticated student (student only)
   * @param goalId Goal ID
   * @returns Promise containing goal DTO
   */
  static async getGoalById(goalId: string): Promise<GoalResponseDTO> {
    try {
      const response = await api.get<GoalResponseDTO>(`/api/student/goals/${goalId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching goal by ID:', error);
      throw error;
    }
  }
}

// Usage example:
/*
async function handleGoalStudentOperations() {
  try {
    // Get all goals
    const allGoals = await GoalStudentAPI.getAllGoals();
    console.log('All goals:', allGoals);

    // Get active goals
    const activeGoals = await GoalStudentAPI.getActiveGoals();
    console.log('Active goals:', activeGoals);

    // Get upcoming goals
    const upcomingGoals = await GoalStudentAPI.getUpcomingGoals();
    console.log('Upcoming goals:', upcomingGoals);

    // Get past goals
    const pastGoals = await GoalStudentAPI.getPastGoals();
    console.log('Past goals:', pastGoals);

    // Get specific goal
    const goal = await GoalStudentAPI.getGoalById("goal123");
    console.log('Goal:', goal);
  } catch (error) {
    console.error('Goal student operation failed:', error);
  }
}
*/