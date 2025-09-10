import api from '../../api';
import { CourseLessonContentResponseDTO, CourseLessonContentCreateDTO } from '../../dtos/courseLessonContentDtos';

export class CourseLessonContentMentorAPI {
  /**
   * Gets all course lesson content available to the authenticated mentor
   * @returns Promise containing array of course lesson content DTOs
   */
  static async getAllMentorContent(): Promise<CourseLessonContentResponseDTO[]> {
    try {
      const response = await api.get<CourseLessonContentResponseDTO[]>('/api/mentor/course-lesson-content/all');
      return response.data;
    } catch (error) {
      console.error('Error fetching mentor course lesson content:', error);
      throw error;
    }
  }

  /**
   * Gets a specific course lesson content by ID for the authenticated mentor
   * @param id The ID of the content to retrieve
   * @returns Promise containing the course lesson content DTO
   */
  static async getContentById(id: string): Promise<CourseLessonContentResponseDTO> {
    try {
      const response = await api.get<CourseLessonContentResponseDTO>(`/api/mentor/course-lesson-content/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching course lesson content with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Creates new course lesson content for the authenticated mentor
   * @param content The content creation DTO with required fields
   * @returns Promise containing the created course lesson content DTO
   */
  static async createContent(content: CourseLessonContentCreateDTO): Promise<CourseLessonContentResponseDTO> {
    try {
      const formData = new FormData();
      formData.append('courseLessonId', content.courseLessonId);
      formData.append('position', content.position.toString());
      formData.append('type', content.type);
      formData.append('value', content.value);
      if (content.videoFile) {
        formData.append('videoFile', content.videoFile);
      }

      const response = await api.post<CourseLessonContentResponseDTO>(
        '/api/mentor/course-lesson-content',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error creating course lesson content:', error);
      throw error;
    }
  }

  /**
   * Updates existing course lesson content for the authenticated mentor
   * @param id The ID of the content to update
   * @param content The content update DTO with updated fields
   * @returns Promise containing the updated course lesson content DTO
   */
  static async updateContent(id: string, content: CourseLessonContentCreateDTO): Promise<CourseLessonContentResponseDTO> {
    try {
      const formData = new FormData();
      formData.append('courseLessonId', content.courseLessonId);
      formData.append('position', content.position.toString());
      formData.append('type', content.type);
      formData.append('value', content.value);
      if (content.videoFile) {
        formData.append('videoFile', content.videoFile);
      }

      const response = await api.put<CourseLessonContentResponseDTO>(
        `/api/mentor/course-lesson-content/${id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating course lesson content with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Deletes course lesson content for the authenticated mentor
   * @param id The ID of the content to delete
   * @returns Promise resolving when deletion is complete
   */
  static async deleteContent(id: string): Promise<void> {
    try {
      await api.delete(`/api/mentor/course-lesson-content/${id}`);
    } catch (error) {
      console.error(`Error deleting course lesson content with ID ${id}:`, error);
      throw error;
    }
  }
}
// Usage example:
/*
async function handleMentorContentOperations() {
  try {
    // Get all content for the mentor
    const allContent = await CourseLessonContentMentorAPI.getAllMentorContent();
    console.log('Mentor content:', allContent);

    // Create new content
    const newContent: CourseLessonContentCreateDTO = {
      courseLessonId: 'some-lesson-id',
      position: 1,
      type: CourseLessonContentType.TEXT,
      value: 'New content text'
    };
    const createdContent = await CourseLessonContentMentorAPI.createContent(newContent);
    console.log('Created content:', createdContent);

    // Update existing content
    const updatedContent: CourseLessonContentCreateDTO = {
      ...newContent,
      value: 'Updated content text'
    };
    const updatedResult = await CourseLessonContentMentorAPI.updateContent(createdContent.id, updatedContent);
    console.log('Updated content:', updatedResult);

    // Delete content
    await CourseLessonContentMentorAPI.deleteContent(createdContent.id);
    console.log('Content deleted successfully');
  } catch (error) {
    console.error('Mentor content operation failed:', error);
  }
}
*/