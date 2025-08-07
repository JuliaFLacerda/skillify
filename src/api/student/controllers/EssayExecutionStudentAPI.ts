// src/api/student/controllers/EssayExecutionStudentAPI.ts
import { EssayExecutionCreateDTO, EssayExecutionResponseDTO } from '@/api/dtos/essayExecutionDtos';
import api from '../../api';

export class EssayExecutionStudentAPI {
  /**
   * Gets all essay executions for the authenticated student
   * @returns Promise containing array of essay execution DTOs
   */
  static async getAllMyEssayExecutions(): Promise<EssayExecutionResponseDTO[]> {
    try {
      const response = await api.get<EssayExecutionResponseDTO[]>('/api/student/essay-executions');
      return response.data;
    } catch (error) {
      console.error('Error fetching student essay executions:', error);
      throw error;
    }
  }

  /**
   * Gets a specific essay execution by ID for the authenticated student
   * @param id Essay execution ID
   * @returns Promise containing essay execution DTO
   */
  static async getEssayExecutionById(id: string): Promise<EssayExecutionResponseDTO> {
    try {
      const response = await api.get<EssayExecutionResponseDTO>(`/api/student/essay-executions/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching essay execution by ID:', error);
      throw error;
    }
  }

  /**
   * Creates a new essay execution for the authenticated student
   * @param execution Essay execution creation data
   * @returns Promise containing created essay execution DTO
   */
  static async createEssayExecution(execution: EssayExecutionCreateDTO): Promise<EssayExecutionResponseDTO> {
    try {
      const response = await api.post<EssayExecutionResponseDTO>('/api/student/essay-executions', execution);
      return response.data;
    } catch (error) {
      console.error('Error creating essay execution:', error);
      throw error;
    }
  }

  /**
   * Updates an existing essay execution for the authenticated student
   * @param id Essay execution ID
   * @param execution Essay execution update data
   * @returns Promise containing updated essay execution DTO
   */
  static async updateEssayExecution(id: string, execution: EssayExecutionCreateDTO): Promise<EssayExecutionResponseDTO> {
    try {
      const response = await api.put<EssayExecutionResponseDTO>(`/api/student/essay-executions/${id}`, execution);
      return response.data;
    } catch (error) {
      console.error('Error updating essay execution:', error);
      throw error;
    }
  }
}

// Usage example:
/*
async function handleEssayExecutionOperations() {
  try {
    // Get all essay executions
    const executions = await EssayExecutionStudentAPI.getAllMyEssayExecutions();
    console.log('My essay executions:', executions);

    // Get specific essay execution
    const execution = await EssayExecutionStudentAPI.getEssayExecutionById("execution123");
    console.log('Essay execution:', execution);

    // Create new essay execution
    const newExecution: EssayExecutionCreateDTO = {
      studentId: "student123", // This might be handled by backend authentication
      essayId: "essay456",
      text: "This is my essay text about technology impacts..."
    };
    const createdExecution = await EssayExecutionStudentAPI.createEssayExecution(newExecution);
    console.log('Created execution:', createdExecution);

    // Update essay execution
    const updatedExecution = await EssayExecutionStudentAPI.updateEssayExecution(createdExecution.id, {
      ...newExecution,
      text: "Updated essay text about technology impacts..."
    });
    console.log('Updated execution:', updatedExecution);

  } catch (error) {
    console.error('Essay execution operation failed:', error);
  }
}
*/