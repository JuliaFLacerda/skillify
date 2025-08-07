// src/api/mentor/controllers/PracticeMentorAPI.ts
import api from '../../api';
import { PracticeCreateDTO, PracticeResponseDTO } from '../../dtos/practiceDtos';

export class PracticeMentorAPI {
  /**
   * Gets all practices for the authenticated mentor (mentor only)
   * @returns Promise containing array of practice DTOs
   */
  static async getAllPractices(): Promise<PracticeResponseDTO[]> {
    try {
      const response = await api.get<PracticeResponseDTO[]>('/api/mentor/practices');
      return response.data;
    } catch (error) {
      console.error('Error fetching all practices:', error);
      throw error;
    }
  }

  /**
   * Gets a practice by ID for the authenticated mentor (mentor only)
   * @param id Practice ID
   * @returns Promise containing practice DTO
   */
  static async getPracticeById(id: string): Promise<PracticeResponseDTO> {
    try {
      const response = await api.get<PracticeResponseDTO>(`/api/mentor/practices/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching practice by ID:', error);
      throw error;
    }
  }

  /**
   * Gets practices by classroom ID for the authenticated mentor (mentor only)
   * @param classroomId Classroom ID
   * @returns Promise containing array of practice DTOs
   */
  static async getPracticesByClassroom(classroomId: string): Promise<PracticeResponseDTO[]> {
    try {
      const response = await api.get<PracticeResponseDTO[]>(`/api/mentor/practices/classroom/${classroomId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching practices by classroom:', error);
      throw error;
    }
  }

  /**
   * Creates a new practice for the authenticated mentor (mentor only)
   * @param practice Practice creation data
   * @returns Promise containing created practice DTO
   */
  static async createPractice(practice: PracticeCreateDTO): Promise<PracticeResponseDTO> {
    try {
      const response = await api.post<PracticeResponseDTO>('/api/mentor/practices', {
        ...practice,
        questionIds: Array.from(practice.questionIds) // Convert Set to Array for JSON
      });
      return response.data;
    } catch (error) {
      console.error('Error creating practice:', error);
      throw error;
    }
  }

  /**
   * Updates an existing practice for the authenticated mentor (mentor only)
   * @param id Practice ID
   * @param practice Practice update data
   * @returns Promise containing updated practice DTO
   */
  static async updatePractice(id: string, practice: PracticeCreateDTO): Promise<PracticeResponseDTO> {
    try {
      const response = await api.put<PracticeResponseDTO>(`/api/mentor/practices/${id}`, {
        ...practice,
        questionIds: Array.from(practice.questionIds) // Convert Set to Array for JSON
      });
      return response.data;
    } catch (error) {
      console.error('Error updating practice:', error);
      throw error;
    }
  }

  /**
   * Deletes a practice for the authenticated mentor (mentor only)
   * @param id Practice ID
   * @returns Promise containing void
   */
  static async deletePractice(id: string): Promise<void> {
    try {
      await api.delete(`/api/mentor/practices/${id}`);
    } catch (error) {
      console.error('Error deleting practice:', error);
      throw error;
    }
  }

  /**
   * Adds a question to a practice (mentor only)
   * @param practiceId Practice ID
   * @param questionId Question ID
   * @returns Promise containing updated practice DTO
   */
  static async addQuestionToPractice(practiceId: string, questionId: string): Promise<PracticeResponseDTO> {
    try {
      const response = await api.post<PracticeResponseDTO>(`/api/mentor/practices/${practiceId}/questions/${questionId}`);
      return response.data;
    } catch (error) {
      console.error('Error adding question to practice:', error);
      throw error;
    }
  }

  /**
   * Removes a question from a practice (mentor only)
   * @param practiceId Practice ID
   * @param questionId Question ID
   * @returns Promise containing updated practice DTO
   */
  static async removeQuestionFromPractice(practiceId: string, questionId: string): Promise<PracticeResponseDTO> {
    try {
      const response = await api.delete<PracticeResponseDTO>(`/api/mentor/practices/${practiceId}/questions/${questionId}`);
      return response.data;
    } catch (error) {
      console.error('Error removing question from practice:', error);
      throw error;
    }
  }
}

// Usage example:
/*
async function handlePracticeMentorOperations() {
  try {
    // Get all practices
    const allPractices = await PracticeMentorAPI.getAllPractices();
    console.log('All practices:', allPractices);

    // Create new practice
    const newPractice: PracticeCreateDTO = {
      mentorId: "mentor123",
      classroomId: "classroom456",
      title: "Math Practice",
      numberOfQuestions: 10,
      duracao: 60,
      openingDate: "2025-03-25T09:00:00",
      maximumDate: "2025-03-25T23:59:59",
      questionIds: new Set(["question1", "question2"])
    };
    const createdPractice = await PracticeMentorAPI.createPractice(newPractice);
    console.log('Created practice:', createdPractice);

    // Get practices by classroom
    const classroomPractices = await PracticeMentorAPI.getPracticesByClassroom("classroom456");
    console.log('Classroom practices:', classroomPractices);

    // Get specific practice
    const practice = await PracticeMentorAPI.getPracticeById(createdPractice.id);
    console.log('Practice:', practice);

    // Update practice
    const updatedPractice = await PracticeMentorAPI.updatePractice(createdPractice.id, {
      ...newPractice,
      title: "Updated Math Practice"
    });
    console.log('Updated practice:', updatedPractice);

    // Add question
    const practiceWithQuestion = await PracticeMentorAPI.addQuestionToPractice(createdPractice.id, "question3");
    console.log('Practice with added question:', practiceWithQuestion);

    // Remove question
    const practiceWithoutQuestion = await PracticeMentorAPI.removeQuestionFromPractice(createdPractice.id, "question3");
    console.log('Practice with removed question:', practiceWithoutQuestion);

    // Delete practice
    await PracticeMentorAPI.deletePractice(createdPractice.id);
    console.log('Practice deleted successfully');
  } catch (error) {
    console.error('Practice mentor operation failed:', error);
  }
}
*/