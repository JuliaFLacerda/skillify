// src/api/dtos/essayExecutionDtos.ts
import { UserResponseDTO } from './userDtos';
import { EssayResponseDTO } from './essayDtos';

export interface EssayExecutionCreateDTO {
  studentId: string;
  essayId: string;
  text: string;
}

export interface EssayExecutionResponseDTO {
  id: string; // Assuming BaseResponseDTO provides this
  student: UserResponseDTO;
  essay: EssayResponseDTO;
  text: string;
}