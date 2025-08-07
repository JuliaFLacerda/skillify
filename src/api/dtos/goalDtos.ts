// src/api/admin/dtos/goalDtos.ts
import { ClassroomResponseDTO } from './classroomDtos';

export enum GoalType {
  QUESTION = "QUESTION",
  ESSAY = "ESSAY",
  LESSON = "LESSON"
}

export interface GoalRequestDTO {
  classroomIds: string[];
  number: number;
  type: GoalType;
  openingDate: string; // ISO datetime string (e.g., "2025-03-25T14:30:00")
  finalDate: string;   // ISO datetime string
}

export interface GoalResponseDTO {
  id: string;
  classrooms: ClassroomResponseDTO[];
  number: number;
  type: GoalType;
  openingDate: string; // ISO datetime string
  finalDate: string;   // ISO datetime string
  createdAt: string;   // ISO datetime string
  updatedAt: string;   // ISO datetime string
}