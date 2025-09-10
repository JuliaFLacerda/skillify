import { UserResponseDTO } from '@/api/dtos/userDtos';
import api from '../../api';
import { MessageCreateDTO, MessageResponseDTO } from '../../dtos/messageDtos';
import { LevelProgressResponseDTO } from '@/api/dtos/levelProgressDtos';
import { StudentRankingResponseDTO } from '@/api/dtos/studentRankingDtos';

// Define RegisterRequest interface to match backend DTO
interface RegisterRequest {
  name: string;
  email: string;
  password?: string; // Optional, as profile updates may not include password
  tel: string;
  biography: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  weeklyReport: boolean;
  studyReminder: boolean;
  role: string;
}

interface PasswordUpdateRequest {
  currentPassword: string;
  newPassword: string;
}

export class UserStudentAPI {
  /**
   * Finds all available mentors
   * @returns Promise containing set of mentor DTOs
   */
  static async findAvailableMentors(): Promise<UserResponseDTO[]> {
    try {
      const response = await api.get<UserResponseDTO[]>('/api/student/users/mentors');
      return response.data;
    } catch (error) {
      console.error('Error fetching available mentors:', error);
      throw error;
    }
  }

  /**
   * Gets the level progress for the authenticated student
   * @returns Promise containing the level progress DTO
   */
  static async getLevelProgress(): Promise<LevelProgressResponseDTO> {
    try {
      const response = await api.get<LevelProgressResponseDTO>('/api/student/users/level-progress');
      return response.data;
    } catch (error) {
      console.error('Error fetching level progress:', error);
      throw error;
    }
  }

  /**
   * Gets the profile for the authenticated student
   * @returns Promise containing the student profile DTO
   */
  static async getStudentProfile(): Promise<UserResponseDTO> {
    try {
      const response = await api.get<UserResponseDTO>('/api/student/users/profile');
      return response.data;
    } catch (error) {
      console.error('Error fetching student profile:', error);
      throw error;
    }
  }

  /**
   * Updates the profile for the authenticated student
   * @param request The updated profile data
   * @returns Promise containing the updated student profile DTO
   */
  static async updateStudentProfile(request: RegisterRequest): Promise<UserResponseDTO> {
    try {
      const response = await api.post<UserResponseDTO>('/api/student/users/profile', request);
      return response.data;
    } catch (error) {
      console.error('Error updating student profile:', error);
      throw error;
    }
  }

  static async updateStudentPassword(request: PasswordUpdateRequest): Promise<UserResponseDTO> {
    try {
      const response = await api.post<UserResponseDTO>('/api/student/users/password', request);
      return response.data;
    } catch (error) {
      console.error('Error updating student password:', error);
      throw error;
    }
  }

  static async updateStudentAvatar(avatar: { imageUrl: string }): Promise<UserResponseDTO> {
    try {
      const response = await api.post<UserResponseDTO>("/api/student/users/avatar", avatar);
      return response.data;
    } catch (error) {
      console.error("Error updating student avatar:", error);
      throw error;
    }
  }

  /**
 * Gets the ranking for a specific classroom
 * @param classroomId The ID of the classroom
 * @param page The page number for pagination (default: 0)
 * @param size The number of items per page (default: 10)
 * @returns Promise containing the student ranking DTO
 */
static async getStudentRanking(classroomId: string, page: number = 0, size: number = 10): Promise<StudentRankingResponseDTO> {
  try {
    const response = await api.get<StudentRankingResponseDTO>(`/api/student/users/classroom/${classroomId}/ranking`, {
      params: { page, size }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching student ranking:', error);
    throw error;
  }
}

/**
 * Gets the rankings for all classrooms the student is enrolled in
 * @param page The page number for pagination (default: 0)
 * @param size The number of items per page (default: 10)
 * @returns Promise containing a list of student ranking DTOs
 */
static async getStudentRankingsForAllClassrooms(page: number = 0, size: number = 10): Promise<StudentRankingResponseDTO[]> {
  try {
    const response = await api.get<StudentRankingResponseDTO[]>('/api/student/users/classrooms/rankings', {
      params: { page, size }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching rankings for all classrooms:', error);
    throw error;
  }
}
}