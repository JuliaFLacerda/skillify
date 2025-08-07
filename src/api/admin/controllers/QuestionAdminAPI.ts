// src/api/admin/controllers/QuestionAdminAPI.ts
import api from '../../api';
import { QuestionCreateDTO, QuestionResponseDTO } from '../../dtos/questionDtos';

export class QuestionAdminAPI {
  /**
   * Gets all questions (admin only)
   * @returns Promise containing array of question DTOs
   */
  static async getAllQuestions(): Promise<QuestionResponseDTO[]> {
    try {
      const response = await api.get<QuestionResponseDTO[]>('/api/admin/questions');
      return response.data;
    } catch (error) {
      console.error('Error fetching all questions:', error);
      throw error;
    }
  }

  /**
   * Gets a question by ID (admin only)
   * @param id Question ID
   * @returns Promise containing question DTO
   */
  static async getQuestionById(id: string): Promise<QuestionResponseDTO> {
    try {
      const response = await api.get<QuestionResponseDTO>(`/api/admin/questions/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching question by ID:', error);
      throw error;
    }
  }

  /**
   * Gets questions by mentor ID (admin only)
   * @param mentorId Mentor ID
   * @returns Promise containing array of question DTOs
   */
  static async getQuestionsByMentor(mentorId: string): Promise<QuestionResponseDTO[]> {
    try {
      const response = await api.get<QuestionResponseDTO[]>(`/api/admin/questions/mentor/${mentorId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching questions by mentor:', error);
      throw error;
    }
  }

  /**
   * Creates a new question (admin only)
   * @param question Question creation data
   * @returns Promise containing created question DTO
   */
  static async createQuestion(question: QuestionCreateDTO): Promise<QuestionResponseDTO> {
    try {
      const response = await api.post<QuestionResponseDTO>('/api/admin/questions', question);
      return response.data;
    } catch (error) {
      console.error('Error creating question:', error);
      throw error;
    }
  }

  /**
   * Updates an existing question (admin only)
   * @param id Question ID
   * @param question Question update data
   * @returns Promise containing updated question DTO
   */
  static async updateQuestion(id: string, question: QuestionCreateDTO): Promise<QuestionResponseDTO> {
    try {
      const response = await api.put<QuestionResponseDTO>(`/api/admin/questions/${id}`, question);
      return response.data;
    } catch (error) {
      console.error('Error updating question:', error);
      throw error;
    }
  }

  /**
   * Deletes a question (admin only)
   * @param id Question ID
   * @returns Promise containing void
   */
  static async deleteQuestion(id: string): Promise<void> {
    try {
      await api.delete(`/api/admin/questions/${id}`);
    } catch (error) {
      console.error('Error deleting question:', error);
      throw error;
    }
  }
}

// Usage example remains the same:
/*
async function handleQuestionAdminOperations() {
  try {
    // Get all questions
    const allQuestions = await QuestionAdminAPI.getAllQuestions();
    console.log('All questions:', allQuestions);

    // Create new question
    const newQuestion: QuestionCreateDTO = {
      title: "What is JavaScript?",
      mentorId: "mentor123"
    };
    const createdQuestion = await QuestionAdminAPI.createQuestion(newQuestion);
    console.log('Created question:', createdQuestion);

    // Get questions by mentor
    const mentorQuestions = await QuestionAdminAPI.getQuestionsByMentor("mentor123");
    console.log('Mentor questions:', mentorQuestions);

    // Get specific question
    const question = await QuestionAdminAPI.getQuestionById(createdQuestion.id);
    console.log('Question:', question);

    // Update question
    const updatedQuestion = await QuestionAdminAPI.updateQuestion(createdQuestion.id, {
      title: "What is modern JavaScript?",
      mentorId: "mentor123"
    });
    console.log('Updated question:', updatedQuestion);

    // Delete question
    await QuestionAdminAPI.deleteQuestion(createdQuestion.id);
    console.log('Question deleted successfully');
  } catch (error) {
    console.error('Question admin operation failed:', error);
  }
}
*/