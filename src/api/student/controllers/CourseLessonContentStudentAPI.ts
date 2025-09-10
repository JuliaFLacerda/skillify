import api from '../../api';
import { CourseLessonContentResponseDTO } from '../../dtos/courseLessonContentDtos';

export class CourseLessonContentStudentAPI {
  /**
   * Gets all available course lesson content for the authenticated student
   * @returns Promise containing array of course lesson content DTOs
   */
  static async getAllStudentContent(): Promise<CourseLessonContentResponseDTO[]> {
    try {
      const response = await api.get<CourseLessonContentResponseDTO[]>('/api/student/course-lesson-content');
      return response.data;
    } catch (error) {
      console.error('Error fetching student course lesson content:', error);
      throw error;
    }
  }

  /**
   * Gets a specific course lesson content by ID for the authenticated student
   * @param id The ID of the content to retrieve
   * @returns Promise containing the course lesson content DTO
   */
  static async getContentById(id: string): Promise<CourseLessonContentResponseDTO> {
    try {
      const response = await api.get<CourseLessonContentResponseDTO>(`/api/student/course-lesson-content/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching course lesson content with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Gets all content for a specific lesson for the authenticated student
   * @param lessonId The ID of the lesson to retrieve content for
   * @returns Promise containing array of course lesson content DTOs
   */
  static async getContentByLessonId(lessonId: string): Promise<CourseLessonContentResponseDTO[]> {
    try {
      const response = await api.get<CourseLessonContentResponseDTO[]>(
        `/api/student/course-lesson-content/lesson/${lessonId}`
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching content for lesson with ID ${lessonId}:`, error);
      throw error;
    }
  }
}

// Usage example:
/*
async function handleStudentContentOperations() {
  try {
    // Get all available content for the authenticated student
    const allContent = await CourseLessonContentStudentAPI.getAllStudentContent();
    console.log('Available content for student:', allContent);
    
    // Get specific content by ID
    const contentId = 'some-content-id';
    const specificContent = await CourseLessonContentStudentAPI.getContentById(contentId);
    console.log('Specific content:', specificContent);

    // Get content for a specific lesson
    const lessonId = 'some-lesson-id';
    const lessonContent = await CourseLessonContentStudentAPI.getContentByLessonId(lessonId);
    console.log('Lesson content:', lessonContent);

    // Example processing
    lessonContent.forEach(content => {
      console.log(`Content type: ${content.type}, Value: ${content.value}`);
    });
  } catch (error) {
    console.error('Student content operation failed:', error);
  }
}
*/