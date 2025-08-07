import api from '../../api';
import { ExperienceEventResponseDTO } from '@/api/dtos/experienceEventDtos';

export class ExperienceEventStudentAPI {
  /**
   * Gets all experience events for student
   * @returns Promise containing array of experience event DTOs
   */
  static async getAllExperienceEvents(): Promise<ExperienceEventResponseDTO[]> {
    try {
      const response = await api.get<ExperienceEventResponseDTO[]>('/api/student/experience-events');
      return response.data;
    } catch (error) {
      console.error('Error fetching all experience events:', error);
      throw error;
    }
  }

  /**
   * Gets an experience event by ID for student
   * @param id Experience event ID
   * @returns Promise containing experience event DTO
   */
  static async getExperienceEventById(id: string): Promise<ExperienceEventResponseDTO> {
    try {
      const response = await api.get<ExperienceEventResponseDTO>(`/api/student/experience-events/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching experience event by ID:', error);
      throw error;
    }
  }

  /**
   * Gets the experience event streak for student
   * @returns Promise containing the streak count
   */
  static async getExperienceEventStreak(): Promise<number> {
    try {
      const response = await api.get<number>('/api/student/experience-events/streak');
      return response.data;
    } catch (error) {
      console.error('Error fetching experience event streak:', error);
      throw error;
    }
  }

  /**
   * Gets the total experience points for a specific month and year
   * @param year The year to query
   * @param month The month to query
   * @returns Promise containing the total XP
   */
  static async getExperiencePerMonth(year: number, month: number): Promise<number> {
    try {
      const response = await api.get<number>(`/api/student/experience-events/xp-per-month?year=${year}&month=${month}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching experience per month:', error);
      throw error;
    }
  }
}