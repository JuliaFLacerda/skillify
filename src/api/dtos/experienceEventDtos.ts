export interface ExperienceEventResponseDTO {
    id: string;
    userId: string;
    xp: number;
    createdAt: string; // ISO string format for LocalDateTime
  }