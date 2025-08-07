// src/api/mentor/controllers/CourseLessonMentorAPI.ts
import api from '../../api';
import { CourseLessonCreateDTO, CourseLessonResponseDTO } from '../../dtos/courseLessonDtos';

export class CourseLessonMentorAPI {
  /**
   * Gets all lessons by the current mentor (mentor only)
   * @returns Promise containing array of course lesson DTOs
   */
  static async getAllLessonsByMentor(): Promise<CourseLessonResponseDTO[]> {
    try {
      const response = await api.get<CourseLessonResponseDTO[]>('/api/mentor/course-lessons');
      return response.data;
    } catch (error) {
      console.error('Error fetching all lessons by mentor:', error);
      throw error;
    }
  }

  /**
   * Gets lessons by course ID (mentor only)
   * @param courseId Course ID
   * @returns Promise containing array of course lesson DTOs
   */
  static async getLessonsByCourse(courseId: string): Promise<CourseLessonResponseDTO[]> {
    try {
      const response = await api.get<CourseLessonResponseDTO[]>(`/api/mentor/course-lessons/course/${courseId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching lessons by course:', error);
      throw error;
    }
  }

  /**
   * Gets lessons by category ID (mentor only)
   * @param categoryId Category ID
   * @returns Promise containing array of course lesson DTOs
   */
  static async getLessonsByCategory(categoryId: string): Promise<CourseLessonResponseDTO[]> {
    try {
      const response = await api.get<CourseLessonResponseDTO[]>(`/api/mentor/course-lessons/category/${categoryId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching lessons by category:', error);
      throw error;
    }
  }

  /**
   * Gets a lesson by ID (mentor only)
   * @param id Lesson ID
   * @returns Promise containing course lesson DTO
   */
  static async getLessonById(id: string): Promise<CourseLessonResponseDTO> {
    try {
      const response = await api.get<CourseLessonResponseDTO>(`/api/mentor/course-lessons/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching lesson by ID:', error);
      throw error;
    }
  }

  /**
   * Creates a new course lesson (mentor only)
   * @param lesson Lesson creation data
   * @returns Promise containing created course lesson DTO
   */
  static async createLesson(lesson: CourseLessonCreateDTO): Promise<CourseLessonResponseDTO> {
    try {
      const response = await api.post<CourseLessonResponseDTO>('/api/mentor/course-lessons', lesson);
      return response.data;
    } catch (error) {
      console.error('Error creating lesson:', error);
      throw error;
    }
  }

  /**
   * Updates an existing course lesson (mentor only)
   * @param id Lesson ID
   * @param lesson Lesson update data
   * @returns Promise containing updated course lesson DTO
   */
  static async updateLesson(id: string, lesson: CourseLessonCreateDTO): Promise<CourseLessonResponseDTO> {
    try {
      const response = await api.put<CourseLessonResponseDTO>(`/api/mentor/course-lessons/${id}`, lesson);
      return response.data;
    } catch (error) {
      console.error('Error updating lesson:', error);
      throw error;
    }
  }

  /**
   * Deletes a course lesson (mentor only)
   * @param id Lesson ID
   * @returns Promise containing void
   */
  static async deleteLesson(id: string): Promise<void> {
    try {
      await api.delete(`/api/mentor/course-lessons/${id}`);
    } catch (error) {
      console.error('Error deleting lesson:', error);
      throw error;
    }
  }
}

// Usage example:
/*
async function handleCourseLessonMentorOperations() {
  try {
    // Get all lessons by mentor
    const allLessons = await CourseLessonMentorAPI.getAllLessonsByMentor();
    console.log('All lessons:', allLessons);

    // Get lessons by course
    const courseLessons = await CourseLessonMentorAPI.getLessonsByCourse("course123");
    console.log('Course lessons:', courseLessons);

    // Get lessons by category
    const categoryLessons = await CourseLessonMentorAPI.getLessonsByCategory("category456");
    console.log('Category lessons:', categoryLessons);

    // Create new lesson
    const newLesson: CourseLessonCreateDTO = {
      title: "Introduction to Algebra",
      courseId: "course123",
      categoryId: "category456",
      description: "Basic algebra concepts",
      videoUrl: "https://example.com/video"
    };
    const createdLesson = await CourseLessonMentorAPI.createLesson(newLesson);
    console.log('Created lesson:', createdLesson);

    // Get specific lesson
    const lesson = await CourseLessonMentorAPI.getLessonById(createdLesson.id);
    console.log('Lesson:', lesson);

    // Update lesson
    const updatedLesson = await CourseLessonMentorAPI.updateLesson(createdLesson.id, {
      ...newLesson,
      title: "Advanced Algebra"
    });
    console.log('Updated lesson:', updatedLesson);

    // Delete lesson
    await CourseLessonMentorAPI.deleteLesson(createdLesson.id);
    console.log('Lesson deleted successfully');
  } catch (error) {
    console.error('Course lesson mentor operation failed:', error);
  }
}
*/