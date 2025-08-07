// src/api/student/controllers/QuestionStudentAPI.ts
import api from '../../api';
import { QuestionResponseDTO } from '../../dtos/questionDtos';

export class QuestionStudentAPI {
  /**
   * Gets all available questions for the authenticated student (student only)
   * @returns Promise containing array of question DTOs
   */
  static async getAllQuestions(): Promise<QuestionResponseDTO[]> {
    try {
      const response = await api.get<QuestionResponseDTO[]>('/api/student/questions');
      return response.data;
    } catch (error) {
      console.error('Error fetching all questions:', error);
      throw error;
    }
  }

  /**
   * Gets a question by ID for the authenticated student (student only)
   * @param id Question ID
   * @returns Promise containing question DTO
   */
  static async getQuestionById(id: string): Promise<QuestionResponseDTO> {
    try {
      const response = await api.get<QuestionResponseDTO>(`/api/student/questions/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching question by ID:', error);
      throw error;
    }
  }

  /**
   * Gets questions by practice ID for the authenticated student (student only)
   * @param practiceId Practice ID
   * @returns Promise containing array of question DTOs
   */
  static async getQuestionsByPractice(practiceId: string): Promise<QuestionResponseDTO[]> {
    try {
      const response = await api.get<QuestionResponseDTO[]>(`/api/student/questions/practice/${practiceId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching questions by practice:', error);
      throw error;
    }
  }
}

// Usage example:
/*
async function handleQuestionStudentOperations() {
  try {
    // Get all questions
    const allQuestions = await QuestionStudentAPI.getAllQuestions();
    console.log('All questions:', allQuestions);

    // Get specific question
    const question = await QuestionStudentAPI.getQuestionById("question123");
    console.log('Question:', question);

    // Get questions by practice
    const practiceQuestions = await QuestionStudentAPI.getQuestionsByPractice("practice456");
    console.log('Practice questions:', practiceQuestions);
  } catch (error) {
    console.error('Question student operation failed:', error);
  }
}
*/