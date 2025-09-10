// src/api/admin/dtos/questionDtos.ts
import { CourseResponseDTO } from './courseDtos';
import { UserResponseDTO } from './userDtos';

export enum QuestionSuperAdminType {
  MATEMATICA = 'MATEMATICA',
  FISICA = 'FISICA',
  GEOGRAFIA = 'GEOGRAFIA',
  BIOLOGIA = 'BIOLOGIA',
  ENEM = 'ENEM',
  FUVEST = 'FUVEST',
}

export enum QuestionContentType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
}

export interface OptionResponseDTO {
  id: string;
  title: string;
  correct: boolean;
}

export interface QuestionContentCreateDTO {
  questionId: string;
  position: number;
  type: QuestionContentType;
  value: string;
}

export interface QuestionContentReturnDTO {
  id: string;
  question: QuestionResponseDTO;
  position: number;
  type: QuestionContentType;
  value: string;
  createdAt: string;
  updatedAt: string;
}

export interface QuestionCreateDTO {
  title: string;
  mentorId: string;
  courseId?: string;
  superAdminTypes?: QuestionSuperAdminType[];
}

export interface QuestionResponseDTO {
  id: string;
  title: string;
  options: OptionResponseDTO[]; // Changed from Set to array
  mentor: UserResponseDTO;
  course?: CourseResponseDTO;
  superAdminTypes?: QuestionSuperAdminType[];
  content: QuestionContentReturnDTO[];
  createdAt: string;
  updatedAt: string;
}