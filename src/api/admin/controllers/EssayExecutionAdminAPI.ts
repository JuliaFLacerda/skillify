// src/api/admin/controllers/EssayExecutionAdminAPI.ts
import api from '../../api';
import { EssayExecutionCreateDTO, EssayExecutionResponseDTO } from '../../dtos/essayExecutionDtos';

export class EssayExecutionAdminAPI {
  /**
   * Gets all essay executions (admin only)
   * @returns Promise containing array of essay execution DTOs
   */
  static async getAllExecutions(): Promise<EssayExecutionResponseDTO[]> {
    try {
      const response = await api.get<EssayExecutionResponseDTO[]>('/api/admin/essay-executions');
      return response.data;
    } catch (error) {
      console.error('Error fetching all essay executions:', error);
      throw error;
    }
  }

  /**
   * Gets an essay execution by ID (admin only)
   * @param id Execution ID
   * @returns Promise containing essay execution DTO
   */
  static async getExecutionById(id: string): Promise<EssayExecutionResponseDTO> {
    try {
      const response = await api.get<EssayExecutionResponseDTO>(`/api/admin/essay-executions/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching essay execution by ID:', error);
      throw error;
    }
  }

  /**
   * Gets essay executions by student ID (admin only)
   * @param studentId Student ID
   * @returns Promise containing array of essay execution DTOs
   */
  static async getExecutionsByStudent(studentId: string): Promise<EssayExecutionResponseDTO[]> {
    try {
      const response = await api.get<EssayExecutionResponseDTO[]>(`/api/admin/essay-executions/student/${studentId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching essay executions by student:', error);
      throw error;
    }
  }

  /**
   * Creates a new essay execution (admin only)
   * @param execution Execution creation data
   * @returns Promise containing created essay execution DTO
   */
  static async createExecution(execution: EssayExecutionCreateDTO): Promise<EssayExecutionResponseDTO> {
    try {
      const response = await api.post<EssayExecutionResponseDTO>('/api/admin/essay-executions', execution);
      return response.data;
    } catch (error) {
      console.error('Error creating essay execution:', error);
      throw error;
    }
  }

  /**
   * Updates an existing essay execution (admin only)
   * @param id Execution ID
   * @param execution Execution update data
   * @returns Promise containing updated essay execution DTO
   */
  static async updateExecution(id: string, execution: EssayExecutionCreateDTO): Promise<EssayExecutionResponseDTO> {
    try {
      const response = await api.put<EssayExecutionResponseDTO>(`/api/admin/essay-executions/${id}`, execution);
      return response.data;
    } catch (error) {
      console.error('Error updating essay execution:', error);
      throw error;
    }
  }

  /**
   * Deletes an essay execution (admin only)
   * @param id Execution ID
   * @returns Promise containing void
   */
  static async deleteExecution(id: string): Promise<void> {
    try {
      await api.delete(`/api/admin/essay-executions/${id}`);
    } catch (error) {
      console.error('Error deleting essay execution:', error);
      throw error;
    }
  }
}

// Usage example:
/*
async function handleEssayExecutionAdminOperations() {
  try {
    // Get all executions
    const allExecutions = await EssayExecutionAdminAPI.getAllExecutions();
    console.log('All executions:', allExecutions);

    // Create new execution
    const newExecution: EssayExecutionCreateDTO = {
      studentId: "student123",
      essayId: "essay456",
      text: "This is my essay about climate change..."
    };
    const createdExecution = await EssayExecutionAdminAPI.createExecution(newExecution);
    console.log('Created execution:', createdExecution);

    // Get executions by student
    const studentExecutions = await EssayExecutionAdminAPI.getExecutionsByStudent("student123");
    console.log('Student executions:', studentExecutions);

    // Get specific execution
    const execution = await EssayExecutionAdminAPI.getExecutionById(createdExecution.id);
    console.log('Execution:', execution);

    // Update execution
    const updatedExecution = await EssayExecutionAdminAPI.updateExecution(createdExecution.id, {
      ...newExecution,
      text: "This is my updated essay about climate change..."
    });
    console.log('Updated execution:', updatedExecution);

    // Delete execution
    await EssayExecutionAdminAPI.deleteExecution(createdExecution.id);
    console.log('Execution deleted successfully');
  } catch (error) {
    console.error('Essay execution admin operation failed:', error);
  }
}
*/