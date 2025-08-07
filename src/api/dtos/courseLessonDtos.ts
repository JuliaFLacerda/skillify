// Updated courseLessonDtos.ts
// src/api/dtos/courseLessonDtos.ts
import { CourseResponseDTO } from './courseDtos';
import { CourseLessonCategoryResponseDTO } from './courseLessonCategoryDtos';
import { CourseLessonContentResponseDTO } from './courseLessonContentDtos';

export interface ClassroomResponseDTO {
  id: string;
  // Add other fields as needed when the actual DTO is available
  name?: string;
}

export interface CourseLessonCreateDTO {
  courseId: string;
  courseLessonCategoryId: string;
  files: string[];
  name: string;
  duration: number;
}

export interface CourseLessonResponseDTO {
  id: string; // From BaseResponseDTO
  course: CourseResponseDTO;
  courseLessonCategory: CourseLessonCategoryResponseDTO;
  classroom: ClassroomResponseDTO;
  files: string[];
  name: string;
  duration: number;
  content: CourseLessonContentResponseDTO[]; // Added content array
}