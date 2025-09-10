// src/api/mentor/controllers/GoalMentorAPI.ts
import api from '../../api';
import { GoalRequestDTO, GoalResponseDTO, GoalType } from '../../dtos/goalDtos';

export class GoalMentorAPI {
  /**
   * Creates a new goal (mentor only)
   * @param goal Goal creation data
   * @returns Promise containing created goal DTO
   */
  static async createGoal(goal: GoalRequestDTO): Promise<GoalResponseDTO> {
    try {
      const response = await api.post<GoalResponseDTO>('/api/mentor/goals', goal);
      return response.data;
    } catch (error) {
      console.error('Error creating goal:', error);
      throw error;
    }
  }

  /**
   * Updates an existing goal (mentor only)
   * @param goalId Goal ID
   * @param goal Goal update data
   * @returns Promise containing updated goal DTO
   */
  static async updateGoal(goalId: string, goal: GoalRequestDTO): Promise<GoalResponseDTO> {
    try {
      const response = await api.put<GoalResponseDTO>(`/api/mentor/goals/${goalId}`, goal);
      return response.data;
    } catch (error) {
      console.error('Error updating goal:', error);
      throw error;
    }
  }

  /**
   * Deletes a goal (mentor only)
   * @param goalId Goal ID
   * @returns Promise containing void
   */
  static async deleteGoal(goalId: string): Promise<void> {
    try {
      await api.delete(`/api/mentor/goals/${goalId}`);
    } catch (error) {
      console.error('Error deleting goal:', error);
      throw error;
    }
  }

  /**
   * Gets all goals for the current mentor (mentor only)
   * @returns Promise containing array of goal DTOs
   */
  static async getAllGoals(): Promise<GoalResponseDTO[]> {
    try {
      const response = await api.get<GoalResponseDTO[]>('/api/mentor/goals');
      return response.data;
    } catch (error) {
      console.error('Error fetching all goals:', error);
      throw error;
    }
  }

  /**
   * Gets active goals for the current mentor (mentor only)
   * @returns Promise containing array of goal DTOs
   */
  static async getActiveGoals(): Promise<GoalResponseDTO[]> {
    try {
      const response = await api.get<GoalResponseDTO[]>('/api/mentor/goals/active');
      return response.data;
    } catch (error) {
      console.error('Error fetching active goals:', error);
      throw error;
    }
  }

  /**
   * Gets a goal by ID for the current mentor (mentor only)
   * @param goalId Goal ID
   * @returns Promise containing goal DTO
   */
  static async getGoalById(goalId: string): Promise<GoalResponseDTO> {
    try {
      const response = await api.get<GoalResponseDTO>(`/api/mentor/goals/${goalId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching goal by ID:', error);
      throw error;
    }
  }

  /**
   * Gets goals by type for the current mentor (mentor only)
   * @param type Goal type
   * @returns Promise containing array of goal DTOs
   */
  static async getGoalsByType(type: GoalType): Promise<GoalResponseDTO[]> {
    try {
      const response = await api.get<GoalResponseDTO[]>(`/api/mentor/goals/type/${type}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching goals by type:', error);
      throw error;
    }
  }
}

// Usage example:
/*
async function handleGoalMentorOperations() {
  try {
    // Create new goal
    const newGoal: GoalRequestDTO = {
      classroomIds: ["classroom1", "classroom2"],
      number: 5,
      type: GoalType.QUESTION,
      openingDate: "2025-03-25T09:00:00",
      finalDate: "2025-03-30T23:59:59"
    };
    const createdGoal = await GoalMentorAPI.createGoal(newGoal);
    console.log('Created goal:', createdGoal);

    // Get all goals
    const allGoals = await GoalMentorAPI.getAllGoals();
    console.log('All goals:', allGoals);

    // Get active goals
    const activeGoals = await GoalMentorAPI.getActiveGoals();
    console.log('Active goals:', activeGoals);

    // Get specific goal
    const goal = await GoalMentorAPI.getGoalById(createdGoal.id);
    console.log('Goal:', goal);

    // Get goals by type
    const questionGoals = await GoalMentorAPI.getGoalsByType(GoalType.QUESTION);
    console.log('Question goals:', questionGoals);

    // Update goal
    const updatedGoal = await GoalMentorAPI.updateGoal(createdGoal.id, {
      ...newGoal,
      number: 10
    });
    console.log('Updated goal:', updatedGoal);

    // Delete goal
    await GoalMentorAPI.deleteGoal(createdGoal.id);
    console.log('Goal deleted successfully');
  } catch (error) {
    console.error('Goal mentor operation failed:', error);
  }
}
*/