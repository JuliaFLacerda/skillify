// src/api/admin/controllers/CourseLessonAdminAPI.ts
import api from '../../api';
import { CourseLessonCreateDTO, CourseLessonResponseDTO } from '../../dtos/courseLessonDtos';

export class CourseLessonAdminAPI {
  /**
   * Gets all course lessons (admin only)
   * @returns Promise containing array of course lesson DTOs
   */
  static async getAllLessons(): Promise<CourseLessonResponseDTO[]> {
    try {
      const response = await api.get<CourseLessonResponseDTO[]>('/api/admin/course-lessons');
      return response.data;
    } catch (error) {
      console.error('Error fetching all course lessons:', error);
      throw error;
    }
  }

  /**
   * Gets a course lesson by ID (admin only)
   * @param id Lesson ID
   * @returns Promise containing course lesson DTO
   */
  static async getLessonById(id: string): Promise<CourseLessonResponseDTO> {
    try {
      const response = await api.get<CourseLessonResponseDTO>(`/api/admin/course-lessons/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching course lesson by ID:', error);
      throw error;
    }
  }

  /**
   * Gets course lessons by course ID (admin only)
   * @param courseId Course ID
   * @returns Promise containing array of course lesson DTOs
   */
  static async getLessonsByCourse(courseId: string): Promise<CourseLessonResponseDTO[]> {
    try {
      const response = await api.get<CourseLessonResponseDTO[]>(`/api/admin/course-lessons/course/${courseId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching course lessons by course:', error);
      throw error;
    }
  }

  /**
   * Gets course lessons by category ID (admin only)
   * @param categoryId Category ID
   * @returns Promise containing array of course lesson DTOs
   */
  static async getLessonsByCategory(categoryId: string): Promise<CourseLessonResponseDTO[]> {
    try {
      const response = await api.get<CourseLessonResponseDTO[]>(`/api/admin/course-lessons/category/${categoryId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching course lessons by category:', error);
      throw error;
    }
  }

  /**
   * Creates a new course lesson (admin only)
   * @param lesson Lesson creation data
   * @returns Promise containing created course lesson DTO
   */
  static async createLesson(lesson: CourseLessonCreateDTO): Promise<CourseLessonResponseDTO> {
    try {
      const response = await api.post<CourseLessonResponseDTO>('/api/admin/course-lessons', lesson);
      return response.data;
    } catch (error) {
      console.error('Error creating course lesson:', error);
      throw error;
    }
  }

  /**
   * Updates an existing course lesson (admin only)
   * @param id Lesson ID
   * @param lesson Lesson update data
   * @returns Promise containing updated course lesson DTO
   */
  static async updateLesson(id: string, lesson: CourseLessonCreateDTO): Promise<CourseLessonResponseDTO> {
    try {
      const response = await api.put<CourseLessonResponseDTO>(`/api/admin/course-lessons/${id}`, lesson);
      return response.data;
    } catch (error) {
      console.error('Error updating course lesson:', error);
      throw error;
    }
  }

  /**
   * Deletes a course lesson (admin only)
   * @param id Lesson ID
   * @returns Promise containing void
   */
  static async deleteLesson(id: string): Promise<void> {
    try {
      await api.delete(`/api/admin/course-lessons/${id}`);
    } catch (error) {
      console.error('Error deleting course lesson:', error);
      throw error;
    }
  }
}

// Usage example:
/*
async function handleCourseLessonAdminOperations() {
  try {
    // Get all lessons
    const allLessons = await CourseLessonAdminAPI.getAllLessons();
    console.log('All lessons:', allLessons);

    // Create new lesson
    const newLesson: CourseLessonCreateDTO = {
      courseId: "course123",
      courseLessonCategoryId: "category456",
      classroomId: "class789",
      files: ["file1.pdf", "file2.mp4"],
      name: "Introduction to Programming",
      duration: 45
    };
    const createdLesson = await CourseLessonAdminAPI.createLesson(newLesson);
    console.log('Created lesson:', createdLesson);

    // Get lessons by course
    const courseLessons = await CourseLessonAdminAPI.getLessonsByCourse("course123");
    console.log('Course lessons:', courseLessons);

    // Get lessons by category
    const categoryLessons = await CourseLessonAdminAPI.getLessonsByCategory("category456");
    console.log('Category lessons:', categoryLessons);

    // Get specific lesson
    const lesson = await CourseLessonAdminAPI.getLessonById(createdLesson.id);
    console.log('Lesson:', lesson);

    // Update lesson
    const updatedLesson = await CourseLessonAdminAPI.updateLesson(createdLesson.id, {
      ...newLesson,
      name: "Updated Introduction to Programming"
    });
    console.log('Updated lesson:', updatedLesson);

    // Delete lesson
    await CourseLessonAdminAPI.deleteLesson(createdLesson.id);
    console.log('Lesson deleted successfully');
  } catch (error) {
    console.error('Course lesson admin operation failed:', error);
  }
}
*/