// src/api/student/dtos/courseLessonContentWatchEventDtos.ts
export interface CourseLessonContentWatchEventRequestDTO {
    courseLessonContentId: string;
    studentId: string;
  }
  
  export interface CourseLessonContentWatchEventResponseDTO {
    id: string;
    courseLessonContentId: string;
    studentId: string;
    createdAt: string;
    updatedAt: string;
  }
  