// src/api/mentor/controllers/ClassroomAccessTokenMentorAPI.ts
import api from '../../api';
import { ClassroomAccessTokenResponseDTO, ClassroomAccessTokenCreateDTO } from '../../dtos/classroomAccessTokenDtos';

export class ClassroomAccessTokenMentorAPI {
  /**
   * Gets tokens by classroom ID for the current mentor (mentor only)
   * @param classroomId Classroom ID
   * @returns Promise containing array of classroom access token DTOs
   */
  static async getTokensByClassroom(classroomId: string): Promise<ClassroomAccessTokenResponseDTO[]> {
    try {
      const response = await api.get<ClassroomAccessTokenResponseDTO[]>(`/api/mentor/classroom-tokens/classroom/${classroomId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching tokens by classroom:', error);
      throw error;
    }
  }

  /**
   * Generates a new token for a classroom (mentor only)
   * @param classroomId Classroom ID
   * @returns Promise containing generated classroom access token DTO
   */
  static async generateToken(classroomId: string): Promise<ClassroomAccessTokenResponseDTO> {
    try {
      const response = await api.post<ClassroomAccessTokenResponseDTO>(`/api/mentor/classroom-tokens/classroom/${classroomId}`);
      return response.data;
    } catch (error) {
      console.error('Error generating classroom token:', error);
      throw error;
    }
  }

  /**
   * Creates a new classroom access token (mentor only)
   * @param token Token creation data
   * @returns Promise containing created classroom access token DTO
   */
  static async createToken(token: ClassroomAccessTokenCreateDTO): Promise<ClassroomAccessTokenResponseDTO> {
    try {
      const response = await api.post<ClassroomAccessTokenResponseDTO>('/api/mentor/classroom-tokens', token);
      return response.data;
    } catch (error) {
      console.error('Error creating classroom token:', error);
      throw error;
    }
  }

  /**
   * Deletes a classroom access token (mentor only)
   * @param id Token ID
   * @returns Promise containing void
   */
  static async deleteToken(id: string): Promise<void> {
    try {
      await api.delete(`/api/mentor/classroom-tokens/${id}`);
    } catch (error) {
      console.error('Error deleting classroom token:', error);
      throw error;
    }
  }
}

// Usage example:
/*
async function handleClassroomAccessTokenMentorOperations() {
  try {
    // Get tokens by classroom
    const classroomTokens = await ClassroomAccessTokenMentorAPI.getTokensByClassroom("classroom123");
    console.log('Classroom tokens:', classroomTokens);

    // Generate new token
    const generatedToken = await ClassroomAccessTokenMentorAPI.generateToken("classroom123");
    console.log('Generated token:', generatedToken);

    // Create new token
    const newToken: ClassroomAccessTokenCreateDTO = {
      classroomId: "classroom123",
      token: "custom-token-456"
    };
    const createdToken = await ClassroomAccessTokenMentorAPI.createToken(newToken);
    console.log('Created token:', createdToken);

    // Delete token
    await ClassroomAccessTokenMentorAPI.deleteToken(createdToken.id);
    console.log('Token deleted successfully');
  } catch (error) {
    console.error('Classroom access token mentor operation failed:', error);
  }
}
*/