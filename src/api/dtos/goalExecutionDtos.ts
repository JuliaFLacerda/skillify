import { GoalResponseDTO } from "./goalDtos";

export interface GoalExecutionResponseDTO {
    id: string;
    goal:GoalResponseDTO;
    studentId: string;
    createdAt: string;
    updatedAt: string;
  }
