// src/api/admin/dtos/authDtos.ts
export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  tel?: string;
  biography?: string;
  emailNotifications?: boolean;
  pushNotifications?: boolean;
  weeklyReport?: boolean;
  studyReminder?: boolean;
  role: string;
  classId?: string;
  expertise? : string;
  horarios? : string[];
}
  
  export interface AuthenticationRequest {
    email: string;
    password: string;
  }
  
  export interface AuthenticationResponse {
    token: string;
    userRole: string;
    userId: string;
  }