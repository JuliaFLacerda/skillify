// src/api/admin/dtos/essayDtos.ts
import { ClassroomResponseDTO } from './classroomDtos';

export interface EssayCreateDTO {
  theme: string;
  description: string;
  minWords: number;
  maxDate: string; // ISO datetime string (e.g., "2025-03-25T14:30:00")
  classroomId: string;
}

export interface EssayResponseDTO {
  id: string; // Assuming BaseResponseDTO provides this
  theme: string;
  description: string;
  minWords: number;
  maxDate: string; // ISO datetime string
  classroom: ClassroomResponseDTO;
  maxAttempts: number;
}