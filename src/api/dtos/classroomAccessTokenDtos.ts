// src/api/admin/dtos/classroomAccessTokenDtos.ts
import { ClassroomResponseDTO } from './classroomDtos';

export interface ClassroomAccessTokenCreateDTO {
  classroomId: string;
  token: string;
}

export interface ClassroomAccessTokenResponseDTO {
  id: string; // Assuming BaseResponseDTO provides this
  classroom: ClassroomResponseDTO;
  token: string;
}