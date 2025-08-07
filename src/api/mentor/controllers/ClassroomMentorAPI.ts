// src/api/mentor/controllers/ClassroomMentorAPI.ts
import api from '../../api';
import { ClassroomCreateDTO, ClassroomResponseDTO } from '../../dtos/classroomDtos';

export class ClassroomMentorAPI {
  /**
   * Gets all classrooms for the authenticated mentor (mentor only)
   * @returns Promise containing array of classroom DTOs
   */
  static async getAllClassrooms(): Promise<ClassroomResponseDTO[]> {
    try {
      const response = await api.get<ClassroomResponseDTO[]>('/api/mentor/classrooms');
      return response.data;
    } catch (error) {
      console.error('Error fetching all classrooms:', error);
      throw error;
    }
  }

  /**
   * Gets a classroom by ID (mentor only)
   * @param id Classroom ID
   * @returns Promise containing classroom DTO
   */
  static async getClassroomById(id: string): Promise<ClassroomResponseDTO> {
    try {
      const response = await api.get<ClassroomResponseDTO>(`/api/mentor/classrooms/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching classroom by ID:', error);
      throw error;
    }
  }

  /**
   * Creates a new classroom for the authenticated mentor (mentor only)
   * @param classroom Classroom creation data
   * @returns Promise containing created classroom DTO
   */
  static async createClassroom(classroom: ClassroomCreateDTO): Promise<ClassroomResponseDTO> {
    try {
      const response = await api.post<ClassroomResponseDTO>('/api/mentor/classrooms', {
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
   * Updates an existing classroom for the authenticated mentor (mentor only)
   * @param id Classroom ID
   * @param classroom Classroom update data
   * @returns Promise containing updated classroom DTO
   */
  static async updateClassroom(id: string, classroom: ClassroomCreateDTO): Promise<ClassroomResponseDTO> {
    try {
      const response = await api.put<ClassroomResponseDTO>(`/api/mentor/classrooms/${id}`, {
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
   * Deletes a classroom for the authenticated mentor (mentor only)
   * @param id Classroom ID
   * @returns Promise containing void
   */
  static async deleteClassroom(id: string): Promise<void> {
    try {
      await api.delete(`/api/mentor/classrooms/${id}`);
    } catch (error) {
      console.error('Error deleting classroom:', error);
      throw error;
    }
  }

   /**
   * Updates the students of an existing classroom for the authenticated mentor (mentor only)
   * @param id Classroom ID
   * @param userIds Array of user IDs to set as students
   * @returns Promise containing updated classroom DTO
   */
  static async updateClassroomStudents(id: string, userIds: string[]): Promise<ClassroomResponseDTO> {
    try {
      const response = await api.put<ClassroomResponseDTO>(`/api/mentor/classrooms/${id}/students`, userIds);
      return response.data;
    } catch (error) {
      console.error('Error updating classroom students:', error);
      throw error;
    }
  }

}

// Usage example:
/*
async function handleClassroomMentorOperations() {
  try {
    // Get all classrooms
    const allClassrooms = await ClassroomMentorAPI.getAllClassrooms();
    console.log('All classrooms:', allClassrooms);

    // Create new classroom
    const newClassroom: ClassroomCreateDTO = {
      name: "Math 101",
      studentIds: new Set(["student1", "student2"]),
      mentorId: "currentMentorId" // Will be set by backend based on auth
    };
    const createdClassroom = await ClassroomMentorAPI.createClassroom(newClassroom);
    console.log('Created classroom:', createdClassroom);

    // Get specific classroom
    const classroom = await ClassroomMentorAPI.getClassroomById(createdClassroom.id);
    console.log('Classroom:', classroom);

    // Update classroom
    const updatedClassroom = await ClassroomMentorAPI.updateClassroom(createdClassroom.id, {
      ...newClassroom,
      name: "Math 102"
    });
    console.log('Updated classroom:', updatedClassroom);

    // Delete classroom
    await ClassroomMentorAPI.deleteClassroom(createdClassroom.id);
    console.log('Classroom deleted successfully');
  } catch (error) {
    console.error('Classroom mentor operation failed:', error);
  }
}
*/