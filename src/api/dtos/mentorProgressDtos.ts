import { UserResponseDTO } from "./userDtos";

export interface MentorProgressStudent {
    user: UserResponseDTO;
    sequence: number;
    initiatedCourses: number;
  }