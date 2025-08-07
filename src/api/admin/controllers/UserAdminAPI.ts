// src/api/admin/controllers/UserAdminAPI.ts
import api from '../../api';
import { RegisterRequest } from '../../dtos/authDtos';
import { UserResponseDTO, UserUpdateRequest } from '../../dtos/userDtos';

export class UserAdminAPI {
  static async getAllUsers(): Promise<UserResponseDTO[]> {
    try {
      const response = await api.get<UserResponseDTO[]>('/api/admin/users');
      return response.data;
    } catch (error) {
      console.error('Error fetching all users:', error);
      throw error;
    }
  }

  static async getUserById(id: string): Promise<UserResponseDTO> {
    try {
      const response = await api.get<UserResponseDTO>(`/api/admin/users/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      throw error;
    }
  }

  static async getAllMentors(): Promise<UserResponseDTO[]> {
    try {
      const response = await api.get<UserResponseDTO[]>('/api/admin/users/mentors');
      return response.data;
    } catch (error) {
      console.error('Error fetching all mentors:', error);
      throw error;
    }
  }

  static async createUser(user: RegisterRequest): Promise<UserResponseDTO> {
    try {
      const response = await api.post<UserResponseDTO>('/api/admin/users', user);
      return response.data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  static async updateUser(id: string, user: UserUpdateRequest): Promise<UserResponseDTO> {
    try {
      const response = await api.put<UserResponseDTO>(`/api/admin/users/${id}`, user);
      return response.data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  static async deleteUser(id: string): Promise<void> {
    try {
      await api.delete(`/api/admin/users/${id}`);
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

    static async getMentorsCount(): Promise<number> {
    try {
      const response = await api.get<number>('/api/admin/users/mentors/count');
      return response.data;
    } catch (error) {
      console.error('Error fetching mentors count:', error);
      throw error;
    }
  }

  static async getStudentsCount(): Promise<number> {
    try {
      const response = await api.get<number>('/api/admin/users/students/count');
      return response.data;
    } catch (error) {
      console.error('Error fetching students count:', error);
      throw error;
    }
  }
}