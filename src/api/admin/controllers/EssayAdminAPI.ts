// src/api/admin/controllers/EssayAdminAPI.ts
import api from '../../api';
import { EssayCreateDTO, EssayResponseDTO } from '../../dtos/essayDtos';

export class EssayAdminAPI {
  /**
   * Gets all essays (admin only)
   * @returns Promise containing array of essay DTOs
   */
  static async getAllEssays(): Promise<EssayResponseDTO[]> {
    try {
      const response = await api.get<EssayResponseDTO[]>('/api/admin/essays');
      return response.data;
    } catch (error) {
      console.error('Error fetching all essays:', error);
      throw error;
    }
  }

  /**
   * Gets an essay by ID (admin only)
   * @param id Essay ID
   * @returns Promise containing essay DTO
   */
  static async getEssayById(id: string): Promise<EssayResponseDTO> {
    try {
      const response = await api.get<EssayResponseDTO>(`/api/admin/essays/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching essay by ID:', error);
      throw error;
    }
  }

  /**
   * Gets essays by classroom ID (admin only)
   * @param classroomId Classroom ID
   * @returns Promise containing array of essay DTOs
   */
  static async getEssaysByClassroom(classroomId: string): Promise<EssayResponseDTO[]> {
    try {
      const response = await api.get<EssayResponseDTO[]>(`/api/admin/essays/classroom/${classroomId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching essays by classroom:', error);
      throw error;
    }
  }

  /**
   * Creates a new essay (admin only)
   * @param essay Essay creation data
   * @returns Promise containing created essay DTO
   */
  static async createEssay(essay: EssayCreateDTO): Promise<EssayResponseDTO> {
    try {
      const response = await api.post<EssayResponseDTO>('/api/admin/essays', essay);
      return response.data;
    } catch (error) {
      console.error('Error creating essay:', error);
      throw error;
    }
  }

  /**
   * Updates an existing essay (admin only)
   * @param id Essay ID
   * @param essay Essay update data
   * @returns Promise containing updated essay DTO
   */
  static async updateEssay(id: string, essay: EssayCreateDTO): Promise<EssayResponseDTO> {
    try {
      const response = await api.put<EssayResponseDTO>(`/api/admin/essays/${id}`, essay);
      return response.data;
    } catch (error) {
      console.error('Error updating essay:', error);
      throw error;
    }
  }

  /**
   * Deletes an essay (admin only)
   * @param id Essay ID
   * @returns Promise containing void
   */
  static async deleteEssay(id: string): Promise<void> {
    try {
      await api.delete(`/api/admin/essays/${id}`);
    } catch (error) {
      console.error('Error deleting essay:', error);
      throw error;
    }
  }
}

// Usage example:
/*
async function handleEssayAdminOperations() {
  try {
    // Get all essays
    const allEssays = await EssayAdminAPI.getAllEssays();
    console.log('All essays:', allEssays);

    // Create new essay
    const newEssay: EssayCreateDTO = {
      theme: "Climate Change",
      description: "Write about the effects of climate change",
      minWords: 500,
      maxDate: "2025-04-01T23:59:59",
      classroomId: "classroom123"
    };
    const createdEssay = await EssayAdminAPI.createEssay(newEssay);
    console.log('Created essay:', createdEssay);

    // Get essays by classroom
    const classroomEssays = await EssayAdminAPI.getEssaysByClassroom("classroom123");
    console.log('Classroom essays:', classroomEssays);

    // Get specific essay
    const essay = await EssayAdminAPI.getEssayById(createdEssay.id);
    console.log('Essay:', essay);

    // Update essay
    const updatedEssay = await EssayAdminAPI.updateEssay(createdEssay.id, {
      ...newEssay,
      theme: "Updated Climate Change"
    });
    console.log('Updated essay:', updatedEssay);

    // Delete essay
    await EssayAdminAPI.deleteEssay(createdEssay.id);
    console.log('Essay deleted successfully');
  } catch (error) {
    console.error('Essay admin operation failed:', error);
  }
}
*/