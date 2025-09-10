// src/api/student/controllers/MessageStudentAPI.ts
import { UserResponseDTO } from '@/api/dtos/userDtos';
import api from '../../api';
import { MessageCreateDTO, MessageResponseDTO } from '../../dtos/messageDtos';

export class MessageStudentAPI {
  /**
   * Gets all sent messages for the authenticated student (student only)
   * @returns Promise containing array of message DTOs
   */
  static async getSentMessages(): Promise<MessageResponseDTO[]> {
    try {
      const response = await api.get<MessageResponseDTO[]>('/api/student/messages/sent');
      return response.data;
    } catch (error) {
      console.error('Error fetching sent messages:', error);
      throw error;
    }
  }

  /**
   * Gets all received messages for the authenticated student (student only)
   * @returns Promise containing array of message DTOs
   */
  static async getReceivedMessages(): Promise<MessageResponseDTO[]> {
    try {
      const response = await api.get<MessageResponseDTO[]>('/api/student/messages/received');
      return response.data;
    } catch (error) {
      console.error('Error fetching received messages:', error);
      throw error;
    }
  }

  /**
   * Sends a message from the authenticated student to a mentor (student only)
   * @param message Message creation data
   * @returns Promise containing created message DTO
   */
  static async sendMessage(message: MessageCreateDTO): Promise<MessageResponseDTO> {
    try {
      const response = await api.post<MessageResponseDTO>('/api/student/messages', message);
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

    /**
   * Finds all available mentors that the student can chat with
   * @returns Promise containing set of mentor DTOs
   */
    static async findAvailableMentorsForChat(): Promise<UserResponseDTO[]> {
      try {
        const response = await api.get<UserResponseDTO[]>('/api/student/messages/mentors');
        return response.data;
      } catch (error) {
        console.error('Error fetching available mentors:', error);
        throw error;
      }
    }
}

// Usage example:
/*
async function handleMessageStudentOperations() {
  try {
    // Get sent messages
    const sentMessages = await MessageStudentAPI.getSentMessages();
    console.log('Sent messages:', sentMessages);

    // Get received messages
    const receivedMessages = await MessageStudentAPI.getReceivedMessages();
    console.log('Received messages:', receivedMessages);

    // Send a message
    const newMessage: MessageCreateDTO = {
      remetenteId: "student123", // Will be overridden by backend auth
      destinatarioId: "mentor456",
      content: "Hello, I need help with my homework!"
    };
    const sentMessage = await MessageStudentAPI.sendMessage(newMessage);
    console.log('Sent message:', sentMessage);
  } catch (error) {
    console.error('Message student operation failed:', error);
  }
}
*/