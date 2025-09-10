// src/api/admin/dtos/userDtos.ts
export enum UserRole {
    ADMIN = "ADMIN",
    ESTUDANTE = "ESTUDANTE",
    MENTOR = "MENTOR",
    SUPERADMIn = "SUPERADMIN"
  }
  
  export interface UserResponseDTO {
    id: string;
    name: string;
    email: string;
    tel: string;
    biography: string;
    emailNotifications: boolean;
    pushNotifications: boolean;
    weeklyReport: boolean;
    studyReminder: boolean;
    role: UserRole;
    avatar? : string;
    xp? : string;
    level? : string;
    expertise? : string;
    horarios?: string[];
  }
  
  export interface UserUpdateRequest {
    name: string;
    email: string;
    tel: string;
    biography: string;
    expertise?: string;
    emailNotifications: boolean;
    pushNotifications: boolean;
    weeklyReport: boolean;
    studyReminder: boolean;
    role: string;
    horarios? : string[];
  }

  export interface RegisterRequest {
    name: string;
    email: string;
    password?: string; // Optional, as profile updates may not include password
    tel: string;
    biography: string;
    emailNotifications: boolean;
    pushNotifications: boolean;
    weeklyReport: boolean;
    studyReminder: boolean;
    role: string;
    horarios? : string[];
  }

  export interface MonthlyStudentsXpDTO {
  month: string; // Format: "YYYY-MM"
  totalXp: number;
}