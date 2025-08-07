// src/api/admin/dtos/classroomDtos.ts
import { UserResponseDTO } from './userDtos';

export interface ClassroomCreateDTO {
  name: string;
  studentIds: Set<string>;
  mentorId: string;
  courseIds?: string[];
}

export interface ClassroomResponseDTO {
  id: string; // Assuming BaseResponseDTO provides this
  name: string;
  students: UserResponseDTO[];
  mentor: UserResponseDTO;
  courses: ClassroomCourseReturnDTO[];
}

// Interface for ClassroomAccessToken (assuming basic structure)
export interface ClassroomAccessToken {
  id: string;
  token: string; // Assuming there's a token string
  classroomId: string; // Assuming reference to classroom
  // Add other fields as needed when actual entity structure is known
}

export interface ClassroomCourseReturnDTO {
  id: string;
  name: string;
}
