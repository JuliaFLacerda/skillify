import api from '../../api';
import { CourseLessonCategoryResponseDTO } from '../../dtos/courseLessonCategoryDtos';

export class CourseLessonCategoryStudentAPI {
  /**
   * Gets categories by course ID (student only)
   * @param courseId Course ID
   * @returns Promise containing array of course lesson category DTOs
   */
  static async getCategoriesByCourse(courseId: string): Promise<CourseLessonCategoryResponseDTO[]> {
    try {
      const response = await api.get<CourseLessonCategoryResponseDTO[]>(`/api/student/course-categories/course/${courseId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching categories by course:', error);
      throw error;
    }
  }

  /**
   * Gets a category by ID (student only)
   * @param id Category ID
   * @returns Promise containing course lesson category DTO
   */
  static async getCategoryById(id: string): Promise<CourseLessonCategoryResponseDTO> {
    try {
      const response = await api.get<CourseLessonCategoryResponseDTO>(`/api/student/course-categories/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching category by ID:', error);
      throw error;
    }
  }
}