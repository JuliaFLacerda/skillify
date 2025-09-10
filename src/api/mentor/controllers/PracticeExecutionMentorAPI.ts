// src/api/mentor/PracticeExecutionMentorAPI.ts


export class PracticeExecutionMentorAPI {
  /**
   * Gets all practice executions for mentor
   * @returns Promise containing array of practice execution DTOs
   */
  static async getAllMentorPracticeExecutions(): Promise<PracticeExecutionResponseDTO[]> {
    try {
      const response = await api.get<PracticeExecutionResponseDTO[]>('/api/mentor/practice-executions');
      return response.data;
    } catch (error) {
      console.error('Error fetching all mentor practice executions:', error);
      throw error;
    }
  }

  /**
   * Gets a practice execution by ID for mentor
   * @param id Execution ID
   * @returns Promise containing practice execution DTO
   */
  static async getPracticeExecutionById(id: string): Promise<PracticeExecutionResponseDTO> {
    try {
      const response = await api.get<PracticeExecutionResponseDTO>(`/api/mentor/practice-executions/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching practice execution by ID:', error);
      throw error;
    }
  }

  /**
   * Creates a new practice execution for mentor
   * @param execution Execution creation data
   * @returns Promise containing created practice execution DTO
   */
  static async createPracticeExecution(execution: PracticeExecutionCreateDTO): Promise<PracticeExecutionResponseDTO> {
    try {
      const response = await api.post<PracticeExecutionResponseDTO>('/api/mentor/practice-executions', execution);
      return response.data;
    } catch (error) {
      console.error('Error creating practice execution:', error);
      throw error;
    }
  }

  /**
   * Updates an existing practice execution for mentor
   * @param id Execution ID
   * @param execution Execution update data
   * @returns Promise containing updated practice execution DTO
   */
  static async updatePracticeExecution(id: string, execution: PracticeExecutionCreateDTO): Promise<PracticeExecutionResponseDTO> {
    try {
      const response = await api.put<PracticeExecutionResponseDTO>(`/api/mentor/practice-executions/${id}`, execution);
      return response.data;
    } catch (error) {
      console.error('Error updating practice execution:', error);
      throw error;
    }
  }

  /**
   * Deletes a practice execution for mentor
   * @param id Execution ID
   * @returns Promise containing void
   */
  static async deletePracticeExecution(id: string): Promise<void> {
    try {
      await api.delete(`/api/mentor/practice-executions/${id}`);
    } catch (error) {
      console.error('Error deleting practice execution:', error);
      throw error;
    }
  }
}

// src/api/student/PracticeExecutionStudentAPI.ts
import api from '../../api';
import { PracticeExecutionCreateDTO, PracticeExecutionResponseDTO } from '../../dtos/practiceExecutionDtos';

export class PracticeExecutionStudentAPI {
  /**
   * Gets all practice executions for student
   * @returns Promise containing array of practice execution DTOs
   */
  static async getAllStudentPracticeExecutions(): Promise<PracticeExecutionResponseDTO[]> {
    try {
      const response = await api.get<PracticeExecutionResponseDTO[]>('/api/student/practice-executions');
      return response.data;
    } catch (error) {
      console.error('Error fetching all student practice executions:', error);
      throw error;
    }
  }

  /**
   * Gets a practice execution by ID for student
   * @param id Execution ID
   * @returns Promise containing practice execution DTO
   */
  static async getPracticeExecutionById(id: string): Promise<PracticeExecutionResponseDTO> {
    try {
      const response = await api.get<PracticeExecutionResponseDTO>(`/api/student/practice-executions/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching practice execution by ID:', error);
      throw error;
    }
  }

  /**
   * Creates a new practice execution for student
   * @param execution Execution creation data
   * @returns Promise containing created practice execution DTO
   */
  static async createPracticeExecution(execution: PracticeExecutionCreateDTO): Promise<PracticeExecutionResponseDTO> {
    try {
      const response = await api.post<PracticeExecutionResponseDTO>('/api/student/practice-executions', execution);
      return response.data;
    } catch (error) {
      console.error('Error creating practice execution:', error);
      throw error;
    }
  }

  /**
   * Updates an existing practice execution for student
   * @param id Execution ID
   * @param execution Execution update data
   * @returns Promise containing updated practice execution DTO
   */
  static async updatePracticeExecution(id: string, execution: PracticeExecutionCreateDTO): Promise<PracticeExecutionResponseDTO> {
    try {
      const response = await api.put<PracticeExecutionResponseDTO>(`/api/student/practice-executions/${id}`, execution);
      return response.data;
    } catch (error) {
      console.error('Error updating practice execution:', error);
      throw error;
    }
  }
}

// Usage example:
/*
async function handlePracticeExecutionOperations() {
  try {
    // Mentor operations
    const mentorExecutions = await PracticeExecutionMentorAPI.getAllMentorPracticeExecutions();
    console.log('Mentor executions:', mentorExecutions);

    const newExecution: PracticeExecutionCreateDTO = {
      studentId: "student123",
      practiceId: "practice456",
      selectedAnswerIds: new Set(["answer1", "answer2"]),
      correctAnswers: 2
    };

    const createdExecution = await PracticeExecutionMentorAPI.createPracticeExecution(newExecution);
    console.log('Created execution:', createdExecution);

    // Student operations
    const studentExecutions = await PracticeExecutionStudentAPI.getAllStudentPracticeExecutions();
    console.log('Student executions:', studentExecutions);

    const execution = await PracticeExecutionStudentAPI.getPracticeExecutionById(createdExecution.id);
    console.log('Execution:', execution);

    const updatedExecution = await PracticeExecutionStudentAPI.updatePracticeExecution(createdExecution.id, {
      ...newExecution,
      correctAnswers: 3
    });
    console.log('Updated execution:', updatedExecution);

    await PracticeExecutionMentorAPI.deletePracticeExecution(createdExecution.id);
    console.log('Execution deleted successfully');
  } catch (error) {
    console.error('Practice execution operation failed:', error);
  }
}
*/