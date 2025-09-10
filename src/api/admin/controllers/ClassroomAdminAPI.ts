// src/api/admin/controllers/ClassroomAdminAPI.ts
import api from '../../api';
import { ClassroomCreateDTO, ClassroomResponseDTO, ClassroomAccessToken } from '../../dtos/classroomDtos';

export class ClassroomAdminAPI {
  /**
   * Gets all classrooms (admin only)
   * @returns Promise containing array of classroom DTOs
   */
  static async getAllClassrooms(): Promise<ClassroomResponseDTO[]> {
    try {
      const response = await api.get<ClassroomResponseDTO[]>('/api/admin/classrooms');
      return response.data;
    } catch (error) {
      console.error('Error fetching all classrooms:', error);
      throw error;
    }
  }

  /**
   * Gets a classroom by ID (admin only)
   * @param id Classroom ID
   * @returns Promise containing classroom DTO
   */
  static async getClassroomById(id: string): Promise<ClassroomResponseDTO> {
    try {
      const response = await api.get<ClassroomResponseDTO>(`/api/admin/classrooms/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching classroom by ID:', error);
      throw error;
    }
  }

  /**
   * Creates a new classroom (admin only)
   * @param classroom Classroom creation data
   * @returns Promise containing created classroom DTO
   */
  static async createClassroom(classroom: ClassroomCreateDTO): Promise<ClassroomResponseDTO> {
    try {
      const response = await api.post<ClassroomResponseDTO>('/api/admin/classrooms', {
        ...classroom,
        studentIds: Array.from(classroom.studentIds) // Convert Set to Array for JSON
      });
      return response.data;
    } catch (error) {
      console.error('Error creating classroom:', error);
      throw error;
    }
  }

  /**
   * Updates an existing classroom (admin only)
   * @param id Classroom ID
   * @param classroom Classroom update data
   * @returns Promise containing updated classroom DTO
   */
  static async updateClassroom(id: string, classroom: ClassroomCreateDTO): Promise<ClassroomResponseDTO> {
    try {
      const response = await api.put<ClassroomResponseDTO>(`/api/admin/classrooms/${id}`, {
        ...classroom,
        studentIds: Array.from(classroom.studentIds) // Convert Set to Array for JSON
      });
      return response.data;
    } catch (error) {
      console.error('Error updating classroom:', error);
      throw error;
    }
  }

  /**
   * Deletes a classroom (admin only)
   * @param id Classroom ID
   * @returns Promise containing void
   */
  static async deleteClassroom(id: string): Promise<void> {
    try {
      await api.delete(`/api/admin/classrooms/${id}`);
    } catch (error) {
      console.error('Error deleting classroom:', error);
      throw error;
    }
  }

  /**
   * Gets access tokens for a classroom (admin only)
   * @param id Classroom ID
   * @returns Promise containing array of classroom access tokens
   */
  static async getClassroomTokens(id: string): Promise<ClassroomAccessToken[]> {
    try {
      const response = await api.get<ClassroomAccessToken[]>(`/api/admin/classrooms/${id}/tokens`);
      return response.data;
    } catch (error) {
      console.error('Error fetching classroom tokens:', error);
      throw error;
    }
  }

  /**
   * Creates a new access token for a classroom (admin only)
   * @param id Classroom ID
   * @returns Promise containing created classroom access token
   */
  static async createClassroomToken(id: string): Promise<ClassroomAccessToken> {
    try {
      const response = await api.post<ClassroomAccessToken>(`/api/admin/classrooms/${id}/tokens`);
      return response.data;
    } catch (error) {
      console.error('Error creating classroom token:', error);
      throw error;
    }
  }

  /**
   * Deletes a classroom access token (admin only)
   * @param tokenId Token ID
   * @returns Promise containing void
   */
  static async deleteClassroomToken(tokenId: string): Promise<void> {
    try {
      await api.delete(`/api/admin/classrooms/tokens/${tokenId}`);
    } catch (error) {
      console.error('Error deleting classroom token:', error);
      throw error;
    }
  }

  /**
   * Updates classroom mentor (admin only)
   * @param id Classroom ID
   * @param mentorId Mentor ID
   * @returns Promise containing updated classroom DTO
   */
  static async updateClassroomMentor(id: string, mentorId: string): Promise<ClassroomResponseDTO> {
    try {
      const response = await api.put<ClassroomResponseDTO>(`/api/admin/classrooms/${id}/mentor`, mentorId);
      return response.data;
    } catch (error) {
      console.error('Error updating classroom mentor:', error);
      throw error;
    }
  }

  /**
   * Updates classroom students (admin only)
   * @param id Classroom ID
   * @param studentIds Set of student IDs
   * @returns Promise containing updated classroom DTO
   */
  static async updateClassroomStudents(id: string, studentIds: Set<string>): Promise<ClassroomResponseDTO> {
    try {
      const response = await api.put<ClassroomResponseDTO>(`/api/admin/classrooms/${id}/students`, Array.from(studentIds));
      return response.data;
    } catch (error) {
      console.error('Error updating classroom students:', error);
      throw error;
    }
  }

  /**
   * Edits courses for a classroom (admin only)
   * @param id Classroom ID
   * @param classroom Classroom data with course updates
   * @returns Promise containing updated classroom DTO
   */
  static async editCourseClassrooms(id: string, classroom: ClassroomCreateDTO): Promise<ClassroomResponseDTO> {
    try {
      const response = await api.put<ClassroomResponseDTO>(
        `/api/admin/classrooms/${id}/courses`,
        {
          ...classroom,
          studentIds: Array.from(classroom.studentIds) // Convert Set to Array for JSON
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error editing classroom courses:', error);
      throw error;
    }
  }
}

// Usage example:
/*
async function handleClassroomAdminOperations() {
  try {
    // Get all classrooms
    const allClassrooms = await ClassroomAdminAPI.getAllClassrooms();
    
    // Create new classroom
    const newClassroom: ClassroomCreateDTO = {
      name: "Math 101",
      studentIds: new Set(["student1", "student2"]),
      mentorId: "mentor123"
    };
    const createdClassroom = await ClassroomAdminAPI.createClassroom(newClassroom);
    
    // Get classroom tokens
    const tokens = await ClassroomAdminAPI.getClassroomTokens(createdClassroom.id);
    
    // Create new token
    const newToken = await ClassroomAdminAPI.createClassroomToken(createdClassroom.id);
    
    // Update mentor
    const updatedWithMentor = await ClassroomAdminAPI.updateClassroomMentor(createdClassroom.id, "mentor456");
    
    // Update students
    const updatedWithStudents = await ClassroomAdminAPI.updateClassroomStudents(createdClassroom.id, new Set(["student3", "student4"]));
    
    // Delete token
    await ClassroomAdminAPI.deleteClassroomToken(newToken.id);
    
    // Delete classroom
    await ClassroomAdminAPI.deleteClassroom(createdClassroom.id);
  } catch (error) {
    console.error('Classroom admin operation failed:', error);
  }
}
*/