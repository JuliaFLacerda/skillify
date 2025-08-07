import { UserResponseDTO } from "./userDtos";

export interface CourseCategoryCreateDTO {
  categoryName: string;
}



export interface CourseCategoryResponseDTO {
  id: string;
  categoryName: string;
  user: UserResponseDTO; // Added user information
}