import { CourseLessonResponseDTO } from './courseLessonDtos';

export enum CourseLessonContentType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO'
}

export interface CourseLessonContentCreateDTO {
  courseLessonId: string;
  position: number;
  type: CourseLessonContentType;
  value: string;
  videoFile?: File; // Added to match backend's MultipartFile
}

export interface CourseLessonContentResponseDTO {
  id: string; // From BaseResponseDTO
  courseLesson: CourseLessonResponseDTO;
  position: number;
  type: CourseLessonContentType;
  value: string;
  url?: string; // Added to match backend
}