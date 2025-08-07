import { MentorProgressStudent } from '@/api/dtos/mentorProgressDtos';
import { MonthlyStudentsXpDTO, UserResponseDTO } from '@/api/dtos/userDtos';
import { StudentRankingResponseDTO } from '@/api/dtos/studentRankingDtos';
import api from '../../api';

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

export class UserMentorAPI {
  static async getAllStudents(): Promise<UserResponseDTO[]> {
    try {
      const response = await api.get<UserResponseDTO[]>('/api/mentor/users');
      return response.data;
    } catch (error) {
      console.error('Error fetching mentor\'s students:', error);
      throw error;
    }
  }

  static async getStudentsForClassroom(classroomId: string): Promise<MentorProgressStudent[]> {
    try {
      const response = await api.get<MentorProgressStudent[]>(`/api/mentor/users/classroom/${classroomId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching students for classroom ${classroomId}:`, error);
      throw error;
    }
  }

  static async getStudentRankingsForAllClassrooms(page: number = 0, size: number = 10): Promise<StudentRankingResponseDTO[]> {
    try {
      const response = await api.get<StudentRankingResponseDTO[]>('/api/mentor/users/classrooms/rankings', {
        params: { page, size }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching rankings for all classrooms:', error);
      throw error;
    }
  }

  static async updateStudentProfile(studentId: string, request: RegisterRequest): Promise<UserResponseDTO> {
    try {
      const response = await api.put<UserResponseDTO>(`/api/mentor/users/${studentId}`, request);
      return response.data;
    } catch (error) {
      console.error(`Error updating student profile for student ${studentId}:`, error);
      throw error;
    }
  }

  static async deleteStudent(studentId: string): Promise<void> {
    try {
      await api.delete(`/api/mentor/users/${studentId}`);
    } catch (error) {
      console.error(`Error deleting student ${studentId}:`, error);
      throw error;
    }
  }

   static async createStudent(request: RegisterRequest): Promise<UserResponseDTO> {
    try {
      const response = await api.post<UserResponseDTO>('/api/mentor/users', request);
      return response.data;
    } catch (error) {
      console.error('Error creating student:', error);
      throw error;
    }
  }

    static async updateStudentClassrooms(studentId: string, classroomIds: string[]): Promise<void> {
    try {
      await api.put(`/api/mentor/users/${studentId}/classrooms`, classroomIds);
    } catch (error) {
      console.error(`Error updating classrooms for student ${studentId}:`, error);
      throw error;
    }
  }

    static async getXpCountAllStudentsMonthly(): Promise<MonthlyStudentsXpDTO[]> {
    try {
      const response = await api.get<MonthlyStudentsXpDTO[]>('/api/mentor/users/xp-monthly');
      return response.data;
    } catch (error) {
      console.error('Error fetching monthly XP for all students:', error);
      throw error;
    }
  }
}