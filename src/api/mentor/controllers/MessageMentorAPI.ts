// src/api/mentor/controllers/MessageMentorAPI.ts
import api from '../../api';
import { MessageCreateDTO, MessageResponseDTO } from '../../dtos/messageDtos';

export class MessageMentorAPI {
  /**
   * Gets all sent messages for the authenticated mentor (mentor only)
   * @returns Promise containing array of message DTOs
   */
  static async getSentMessages(): Promise<MessageResponseDTO[]> {
    try {
      const response = await api.get<MessageResponseDTO[]>('/api/mentor/messages/sent');
      return response.data;
    } catch (error) {
      console.error('Error fetching sent messages:', error);
      throw error;
    }
  }

  /**
   * Gets all received messages for the authenticated mentor (mentor only)
   * @returns Promise containing array of message DTOs
   */
  static async getReceivedMessages(): Promise<MessageResponseDTO[]> {
    try {
      const response = await api.get<MessageResponseDTO[]>('/api/mentor/messages/received');
      return response.data;
    } catch (error) {
      console.error('Error fetching received messages:', error);
      throw error;
    }
  }

  /**
   * Sends a message from the authenticated mentor to a student or admin
   * @param message Message creation data
   * @returns Promise containing created message DTO
   */
  static async sendMessage(message: MessageCreateDTO): Promise<MessageResponseDTO> {
    try {
      const response = await api.post<MessageResponseDTO>('/api/mentor/messages', message);
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  /**
   * Gets all messages exchanged between the authenticated mentor and a specific student
   * @param studentId The ID of the student to get messages for
   * @returns Promise containing array of message DTOs
   * @throws Error if student is not in mentor's classroom or if request fails
   */
  static async getMessagesWithStudent(studentId: string): Promise<MessageResponseDTO[]> {
    try {
      const response = await api.get<MessageResponseDTO[]>(`/api/mentor/messages/received/${studentId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching messages with student:', error);
      throw error;
    }
  }
}