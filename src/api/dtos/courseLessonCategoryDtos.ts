// src/api/admin/dtos/courseLessonCategoryDtos.ts
import { CourseResponseDTO } from './courseDtos';

export interface CourseLessonCategoryCreateDTO {
  courseId: string;
  name: string;
}

export interface CourseLessonCategoryResponseDTO {
  id: string; // Assuming BaseResponseDTO provides this
  course: CourseResponseDTO;
  name: string;
}