// src/api/mentor/controllers/EssayMentorAPI.ts
import api from '../../api';
import { EssayCreateDTO, EssayResponseDTO } from '../../dtos/essayDtos';

export class EssayMentorAPI {
  /**
   * Gets essays by classroom ID (mentor only)
   * @param classroomId Classroom ID
   * @returns Promise containing array of essay DTOs
   */
  static async getEssaysByClassroom(classroomId: string): Promise<EssayResponseDTO[]> {
    try {
      const response = await api.get<EssayResponseDTO[]>(`/api/mentor/essays/classroom/${classroomId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching essays by classroom:', error);
      throw error;
    }
  }

  /**
   * Gets an essay by ID (mentor only)
   * @param id Essay ID
   * @returns Promise containing essay DTO
   */
  static async getEssayById(id: string): Promise<EssayResponseDTO> {
    try {
      const response = await api.get<EssayResponseDTO>(`/api/mentor/essays/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching essay by ID:', error);
      throw error;
    }
  }

  /**
   * Creates a new essay (mentor only)
   * @param essay Essay creation data
   * @returns Promise containing created essay DTO
   */
  static async createEssay(essay: EssayCreateDTO): Promise<EssayResponseDTO> {
    try {
      const response = await api.post<EssayResponseDTO>('/api/mentor/essays', essay);
      return response.data;
    } catch (error) {
      console.error('Error creating essay:', error);
      throw error;
    }
  }

  /**
   * Updates an existing essay (mentor only)
   * @param id Essay ID
   * @param essay Essay update data
   * @returns Promise containing updated essay DTO
   */
  static async updateEssay(id: string, essay: EssayCreateDTO): Promise<EssayResponseDTO> {
    try {
      const response = await api.put<EssayResponseDTO>(`/api/mentor/essays/${id}`, essay);
      return response.data;
    } catch (error) {
      console.error('Error updating essay:', error);
      throw error;
    }
  }

  /**
   * Deletes an essay (mentor only)
   * @param id Essay ID
   * @returns Promise containing void
   */
  static async deleteEssay(id: string): Promise<void> {
    try {
      await api.delete(`/api/mentor/essays/${id}`);
    } catch (error) {
      console.error('Error deleting essay:', error);
      throw error;
    }
  }
}

// Usage example:
/*
async function handleEssayMentorOperations() {
  try {
    // Get essays by classroom
    const classroomEssays = await EssayMentorAPI.getEssaysByClassroom("classroom123");
    console.log('Classroom essays:', classroomEssays);

    // Create new essay
    const newEssay: EssayCreateDTO = {
      theme: "Climate Change",
      description: "Write about climate impacts",
      minWords: 500,
      maxDate: "2025-04-01T23:59:59",
      classroomId: "classroom123"
    };
    const createdEssay = await EssayMentorAPI.createEssay(newEssay);
    console.log('Created essay:', createdEssay);

    // Get specific essay
    const essay = await EssayMentorAPI.getEssayById(createdEssay.id);
    console.log('Essay:', essay);

    // Update essay
    const updatedEssay = await EssayMentorAPI.updateEssay(createdEssay.id, {
      ...newEssay,
      theme: "Updated Climate Change"
    });
    console.log('Updated essay:', updatedEssay);

    // Delete essay
    await EssayMentorAPI.deleteEssay(createdEssay.id);
    console.log('Essay deleted successfully');
  } catch (error) {
    console.error('Essay mentor operation failed:', error);
  }
}
*/