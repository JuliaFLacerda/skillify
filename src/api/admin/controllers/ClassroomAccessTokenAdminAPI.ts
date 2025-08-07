// src/api/admin/controllers/ClassroomAccessTokenAdminAPI.ts
import api from '../../api';
import { ClassroomAccessTokenCreateDTO, ClassroomAccessTokenResponseDTO } from '../../dtos/classroomAccessTokenDtos';

export class ClassroomAccessTokenAdminAPI {
  /**
   * Gets tokens by classroom ID (admin only, mentor-verified)
   * @param classroomId Classroom ID
   * @returns Promise containing array of classroom access token DTOs
   */
  static async getTokensByClassroom(classroomId: string): Promise<ClassroomAccessTokenResponseDTO[]> {
    try {
      const response = await api.get<ClassroomAccessTokenResponseDTO[]>(`/api/admin/classroom-tokens/classroom/${classroomId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching tokens by classroom:', error);
      throw error;
    }
  }

  /**
   * Generates a new token for a classroom (admin only, mentor-verified)
   * @param classroomId Classroom ID
   * @returns Promise containing generated classroom access token DTO
   */
  static async generateToken(classroomId: string): Promise<ClassroomAccessTokenResponseDTO> {
    try {
      const response = await api.post<ClassroomAccessTokenResponseDTO>(`/api/admin/classroom-tokens/classroom/${classroomId}`);
      return response.data;
    } catch (error) {
      console.error('Error generating classroom token:', error);
      throw error;
    }
  }

  /**
   * Creates a new classroom access token (admin only, mentor-verified)
   * @param token Token creation data
   * @returns Promise containing created classroom access token DTO
   */
  static async createToken(token: ClassroomAccessTokenCreateDTO): Promise<ClassroomAccessTokenResponseDTO> {
    try {
      const response = await api.post<ClassroomAccessTokenResponseDTO>('/api/admin/classroom-tokens', token);
      return response.data;
    } catch (error) {
      console.error('Error creating classroom token:', error);
      throw error;
    }
  }

  /**
   * Deletes a classroom access token (admin only, mentor-verified)
   * @param id Token ID
   * @returns Promise containing void
   */
  static async deleteToken(id: string): Promise<void> {
    try {
      await api.delete(`/api/admin/classroom-tokens/${id}`);
    } catch (error) {
      console.error('Error deleting classroom token:', error);
      throw error;
    }
  }
}

// Usage example:
/*
async function handleClassroomAccessTokenAdminOperations() {
  try {
    // Get tokens by classroom
    const classroomTokens = await ClassroomAccessTokenAdminAPI.getTokensByClassroom("classroom123");
    console.log('Classroom tokens:', classroomTokens);

    // Generate new token
    const generatedToken = await ClassroomAccessTokenAdminAPI.generateToken("classroom123");
    console.log('Generated token:', generatedToken);

    // Create new token
    const newToken: ClassroomAccessTokenCreateDTO = {
      classroomId: "classroom123",
      token: "custom-token-456"
    };
    const createdToken = await ClassroomAccessTokenAdminAPI.createToken(newToken);
    console.log('Created token:', createdToken);

    // Delete token
    await ClassroomAccessTokenAdminAPI.deleteToken(createdToken.id);
    console.log('Token deleted successfully');
  } catch (error) {
    console.error('Classroom access token admin operation failed:', error);
  }
}
*/