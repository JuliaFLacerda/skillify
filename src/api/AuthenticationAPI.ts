// src/api/admin/controllers/AuthenticationAPI.ts
import api from './api';
import { RegisterRequest, AuthenticationRequest, AuthenticationResponse } from './dtos/authDtos';

export class AuthenticationAPI {
  static async register(request: RegisterRequest): Promise<AuthenticationResponse> {
    try {
      const response = await api.post<AuthenticationResponse>('/api/auth/register', request);
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  static async login(request: AuthenticationRequest): Promise<AuthenticationResponse> {
    try {
      const response = await api.post<AuthenticationResponse>('/api/auth/authenticate', request);
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  static async registerWithClassroom(request: RegisterRequest, classId: string): Promise<AuthenticationResponse> {
    try {
      const response = await api.post<AuthenticationResponse>(
        `/api/auth/register-with-classroom?classId=${encodeURIComponent(classId)}`,
        request
      );
      return response.data;
    } catch (error) {
      console.error('Register with classroom error:', error);
      throw error;
    }
  }

  static async validateToken(token: string): Promise<boolean> {
    try {
      const response = await api.post<boolean>(`/api/auth/validateToken/${encodeURIComponent(token)}`);
      return response.data;
    } catch (error) {
      console.error('Token validation error:', error);
      throw error;
    }
  }
}