// src/api/admin/dtos/courseDtos.ts
import { CourseCategoryResponseDTO } from './courseCategoryDtos';
import { UserResponseDTO } from './userDtos';

export interface CourseCreateDTO {
  categoryIds: string[];
  level: string;
  name: string;
  description: string;
  creatorId: string;
  duration: number;
  imageUrl: string;
}

export interface CourseResponseDTO {
  id: string; // Assuming BaseResponseDTO provides this
  categories: CourseCategoryResponseDTO[];
  level: string;
  name: string;
  description: string;
  creator: UserResponseDTO;
  duration: number;
  imageUrl: string;
}