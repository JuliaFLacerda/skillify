// src/api/mentor/controllers/EssayCorrectionMentorAPI.ts
import { EssayCorrectionCreateDTO, EssayCorrectionResponseDTO } from '@/api/dtos/essayCorrectionDtos';
import api from '../../api';

export class EssayCorrectionMentorAPI {
  /**
   * Gets all essay corrections for the authenticated mentor
   * @returns Promise containing array of essay correction DTOs
   */
  static async getAllEssayCorrections(): Promise<EssayCorrectionResponseDTO[]> {
    try {
      const response = await api.get<EssayCorrectionResponseDTO[]>('/api/mentor/essay-corrections');
      return response.data;
    } catch (error) {
      console.error('Error fetching mentor essay corrections:', error);
      throw error;
    }
  }

  /**
   * Gets a specific essay correction by ID for the authenticated mentor
   * @param id Essay correction ID
   * @returns Promise containing essay correction DTO
   */
  static async getEssayCorrectionById(id: string): Promise<EssayCorrectionResponseDTO> {
    try {
      const response = await api.get<EssayCorrectionResponseDTO>(`/api/mentor/essay-corrections/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching essay correction by ID:', error);
      throw error;
    }
  }

  /**
   * Creates a new essay correction for the authenticated mentor
   * @param createDTO Data for creating the essay correction
   * @returns Promise containing the created essay correction DTO
   */
  static async createEssayCorrection(createDTO: EssayCorrectionCreateDTO): Promise<EssayCorrectionResponseDTO> {
    try {
      const response = await api.post<EssayCorrectionResponseDTO>('/api/mentor/essay-corrections', createDTO);
      return response.data;
    } catch (error) {
      console.error('Error creating essay correction:', error);
      throw error;
    }
  }

  /**
   * Updates an existing essay correction for the authenticated mentor
   * @param id Essay correction ID
   * @param updateDTO Data for updating the essay correction
   * @returns Promise containing the updated essay correction DTO
   */
  static async updateEssayCorrection(id: string, updateDTO: EssayCorrectionCreateDTO): Promise<EssayCorrectionResponseDTO> {
    try {
      const response = await api.put<EssayCorrectionResponseDTO>(`/api/mentor/essay-corrections/${id}`, updateDTO);
      return response.data;
    } catch (error) {
      console.error('Error updating essay correction:', error);
      throw error;
    }
  }

  /**
   * Deletes an essay correction for the authenticated mentor
   * @param id Essay correction ID
   * @returns Promise that resolves when deletion is successful
   */
  static async deleteEssayCorrection(id: string): Promise<void> {
    try {
      await api.delete(`/api/mentor/essay-corrections/${id}`);
    } catch (error) {
      console.error('Error deleting essay correction:', error);
      throw error;
    }
  }
}

// Usage example:
/*
async function handleMentorEssayCorrectionOperations() {
  try {
    // Get all essay corrections for mentor
    const corrections = await EssayCorrectionMentorAPI.getAllEssayCorrections();
    console.log('All my essay corrections:', corrections);

    // Get specific essay correction
    const correction = await EssayCorrectionMentorAPI.getEssayCorrectionById("correction123");
    console.log('Specific essay correction:', correction);

    // Create new essay correction
    const newCorrectionDTO: EssayCorrectionCreateDTO = {
      essayId: "essay123",
      mentorId: "mentor123",
      essayExecutionId: "execution123",
      estruturaCoesaoComentario: "Good structure",
      argumentacaoComentario: "Solid arguments",
      conquistas: new Set([EssayConquest.ARGUMENTACAO_SOLIDA]),
      competencia1Score: 80,
      competencia2Score: 85,
      competencia3Score: 75,
      competencia4Score: 90,
      competencia5Score: 88
    };
    const createdCorrection = await EssayCorrectionMentorAPI.createEssayCorrection(newCorrectionDTO);
    console.log('Created correction:', createdCorrection);

    // Update existing correction
    const updatedCorrection = await EssayCorrectionMentorAPI.updateEssayCorrection(
      "correction123",
      { ...newCorrectionDTO, competencia1Score: 85 }
    );
    console.log('Updated correction:', updatedCorrection);

    // Delete correction
    await EssayCorrectionMentorAPI.deleteEssayCorrection("correction123");
    console.log('Correction deleted successfully');

  } catch (error) {
    console.error('Mentor essay correction operation failed:', error);
  }
}
*/