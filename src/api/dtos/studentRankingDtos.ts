export interface StudentRankingResponseDTO {
    classroomId: string;
    classroomName: string;
    ranking: StudentRankingPositionDTO[];
    yourPosition: number;
  }
  
  export interface StudentRankingPositionDTO {
    userId: string;
    userName: string;
    xpAmount: number;
    avatar: string | null;
    position: number;
  }