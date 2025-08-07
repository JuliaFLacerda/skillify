// src/api/admin/dtos/tutorSessionDtos.ts
import { UserResponseDTO, UserRole } from './userDtos';

// Enum for SessionType matching backend
export enum SessionType {
  CHAMADA_DE_VIDEO = "CHAMADA_DE_VIDEO",
  CHAT = "CHAT"
}

export interface TutorSessionCreateDTO {
  mentorId: string;
  title: string;
  date: string; // ISO date string (e.g., "2025-03-25")
  dateHour: string; // 8:00, 14:00  string
  type: SessionType;
  link: string;
  studentId: string;
}

export interface TutorSessionResponseDTO {
  id: string; // Assuming BaseResponseDTO provides this
  mentor: UserResponseDTO;
  title: string;
  date: string; // ISO date string (e.g., "2025-03-25")
  dateHour: string; // 8:00, 14:00  string
  type: SessionType;
  link: string;
  student: UserResponseDTO;
}