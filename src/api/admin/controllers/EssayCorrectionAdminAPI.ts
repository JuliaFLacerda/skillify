// src/api/admin/controllers/EssayCorrectionAdminAPI.ts
import api from '../../api';
import { EssayCorrectionCreateDTO, EssayCorrectionResponseDTO, EssayConquest } from '../../dtos/essayCorrectionDtos';

export class EssayCorrectionAdminAPI {
  /**
   * Gets all essay corrections (admin only)
   * @returns Promise containing array of essay correction DTOs
   */
  static async getAllCorrections(): Promise<EssayCorrectionResponseDTO[]> {
    try {
      const response = await api.get<EssayCorrectionResponseDTO[]>('/api/admin/essay-corrections');
      return response.data;
    } catch (error) {
      console.error('Error fetching all essay corrections:', error);
      throw error;
    }
  }

  /**
   * Gets an essay correction by ID (admin only)
   * @param id Correction ID
   * @returns Promise containing essay correction DTO
   */
  static async getCorrectionById(id: string): Promise<EssayCorrectionResponseDTO> {
    try {
      const response = await api.get<EssayCorrectionResponseDTO>(`/api/admin/essay-corrections/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching essay correction by ID:', error);
      throw error;
    }
  }

  /**
   * Gets essay corrections by mentor ID (admin only)
   * @param mentorId Mentor ID
   * @returns Promise containing array of essay correction DTOs
   */
  static async getCorrectionsByMentor(mentorId: string): Promise<EssayCorrectionResponseDTO[]> {
    try {
      const response = await api.get<EssayCorrectionResponseDTO[]>(`/api/admin/essay-corrections/mentor/${mentorId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching essay corrections by mentor:', error);
      throw error;
    }
  }

  /**
   * Creates a new essay correction (admin only)
   * @param correction Correction creation data
   * @returns Promise containing created essay correction DTO
   */
  static async createCorrection(correction: EssayCorrectionCreateDTO): Promise<EssayCorrectionResponseDTO> {
    try {
      const response = await api.post<EssayCorrectionResponseDTO>('/api/admin/essay-corrections', {
        ...correction,
        conquistas: Array.from(correction.conquistas) // Convert Set to Array for JSON
      });
      return response.data;
    } catch (error) {
      console.error('Error creating essay correction:', error);
      throw error;
    }
  }

  /**
   * Updates an existing essay correction (admin only)
   * @param id Correction ID
   * @param correction Correction update data
   * @returns Promise containing updated essay correction DTO
   */
  static async updateCorrection(id: string, correction: EssayCorrectionCreateDTO): Promise<EssayCorrectionResponseDTO> {
    try {
      const response = await api.put<EssayCorrectionResponseDTO>(`/api/admin/essay-corrections/${id}`, {
        ...correction,
        conquistas: Array.from(correction.conquistas) // Convert Set to Array for JSON
      });
      return response.data;
    } catch (error) {
      console.error('Error updating essay correction:', error);
      throw error;
    }
  }

  /**
   * Deletes an essay correction (admin only)
   * @param id Correction ID
   * @returns Promise containing void
   */
  static async deleteCorrection(id: string): Promise<void> {
    try {
      await api.delete(`/api/admin/essay-corrections/${id}`);
    } catch (error) {
      console.error('Error deleting essay correction:', error);
      throw error;
    }
  }
}

// Usage example:
/*
async function handleEssayCorrectionAdminOperations() {
  try {
    // Get all corrections
    const allCorrections = await EssayCorrectionAdminAPI.getAllCorrections();
    console.log('All corrections:', allCorrections);

    // Create new correction
    const newCorrection: EssayCorrectionCreateDTO = {
      essayId: "essay123",
      mentorId: "mentor456",
      essayExecutionId: "execution789",
      estruturaCoesaoComentario: "Good cohesion",
      argumentacaoComentario: "Strong arguments",
      conquistas: new Set([EssayConquest.ARGUMENTACAO_SOLIDA, EssayConquest.COESAO_PERFEITA]),
      competencia1Score: 8,
      competencia2Score: 7,
      competencia3Score: 8,
      competencia4Score: 6,
      competencia5Score: 7
    };
    const createdCorrection = await EssayCorrectionAdminAPI.createCorrection(newCorrection);
    console.log('Created correction:', createdCorrection);

    // Get corrections by mentor
    const mentorCorrections = await EssayCorrectionAdminAPI.getCorrectionsByMentor("mentor456");
    console.log('Mentor corrections:', mentorCorrections);

    // Get specific correction
    const correction = await EssayCorrectionAdminAPI.getCorrectionById(createdCorrection.id);
    console.log('Correction:', correction);

    // Update correction
    const updatedCorrection = await EssayCorrectionAdminAPI.updateCorrection(createdCorrection.id, {
      ...newCorrection,
      estruturaCoesaoComentario: "Excellent cohesion"
    });
    console.log('Updated correction:', updatedCorrection);

    // Delete correction
    await EssayCorrectionAdminAPI.deleteCorrection(createdCorrection.id);
    console.log('Correction deleted successfully');
  } catch (error) {
    console.error('Essay correction admin operation failed:', error);
  }
}
*/