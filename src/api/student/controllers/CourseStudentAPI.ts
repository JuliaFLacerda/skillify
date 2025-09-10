// src/api/student/controllers/CourseStudentAPI.ts
import api from '../../api';
import { CourseResponseDTO } from '../../dtos/courseDtos';
import { CourseLessonCategoryResponseDTO } from '../../dtos/courseLessonCategoryDtos';
import { CourseLessonResponseDTO } from '../../dtos/courseLessonDtos';

export class CourseStudentAPI {
  /**
   * Gets all available courses (student only)
   * @returns Promise containing array of course DTOs
   */
  static async getAllCourses(): Promise<CourseResponseDTO[]> {
    try {
      const response = await api.get<CourseResponseDTO[]>('/api/student/courses');
      return response.data;
    } catch (error) {
      console.error('Error fetching all courses:', error);
      throw error;
    }
  }

  /**
   * Gets a course by ID (student only)
   * @param id Course ID
   * @returns Promise containing course DTO
   */
  static async getCourseById(id: string): Promise<CourseResponseDTO> {
    try {
      const response = await api.get<CourseResponseDTO>(`/api/student/courses/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching course by ID:', error);
      throw error;
    }
  }

  /**
   * Gets enrolled courses for the authenticated student (student only)
   * @returns Promise containing array of course DTOs
   */
  static async getEnrolledCourses(): Promise<CourseResponseDTO[]> {
    try {
      const response = await api.get<CourseResponseDTO[]>('/api/student/courses/enrolled');
      return response.data;
    } catch (error) {
      console.error('Error fetching enrolled courses:', error);
      throw error;
    }
  }

  /**
   * Gets course lesson categories for a course (student only)
   * @param courseId Course ID
   * @returns Promise containing array of course lesson category DTOs
   */
  static async getCourseLessonCategories(courseId: string): Promise<CourseLessonCategoryResponseDTO[]> {
    try {
      const response = await api.get<CourseLessonCategoryResponseDTO[]>(`/api/student/courses/${courseId}/categories`);
      return response.data;
    } catch (error) {
      console.error('Error fetching course lesson categories:', error);
      throw error;
    }
  }

  /**
   * Gets course lessons for a course (student only)
   * @param courseId Course ID
   * @returns Promise containing array of course lesson DTOs
   */
  static async getCourseLessons(courseId: string): Promise<CourseLessonResponseDTO[]> {
    try {
      const response = await api.get<CourseLessonResponseDTO[]>(`/api/student/courses/${courseId}/lessons`);
      return response.data;
    } catch (error) {
      console.error('Error fetching course lessons:', error);
      throw error;
    }
  }

  /**
   * Gets lessons by category ID (student only)
   * @param categoryId Category ID
   * @returns Promise containing array of course lesson DTOs
   */
  static async getLessonsByCategory(categoryId: string): Promise<CourseLessonResponseDTO[]> {
    try {
      const response = await api.get<CourseLessonResponseDTO[]>(`/api/student/courses/categories/${categoryId}/lessons`);
      return response.data;
    } catch (error) {
      console.error('Error fetching lessons by category:', error);
      throw error;
    }
  }

  /**
   * Enrolls the authenticated student in a course (student only)
   * @param courseId Course ID
   * @returns Promise containing void
   */
  static async enrollInCourse(courseId: string): Promise<void> {
    try {
      await api.post(`/api/student/courses/${courseId}/enroll`);
    } catch (error) {
      console.error('Error enrolling in course:', error);
      throw error;
    }
  }
}

// Usage example:
/*
async function handleCourseStudentOperations() {
  try {
    // Get all courses
    const allCourses = await CourseStudentAPI.getAllCourses();
    console.log('All courses:', allCourses);

    // Get specific course
    const course = await CourseStudentAPI.getCourseById("course123");
    console.log('Course:', course);

    // Get enrolled courses
    const enrolledCourses = await CourseStudentAPI.getEnrolledCourses();
    console.log('Enrolled courses:', enrolledCourses);

    // Get course lesson categories
    const categories = await CourseStudentAPI.getCourseLessonCategories("course123");
    console.log('Course categories:', categories);

    // Get course lessons
    const lessons = await CourseStudentAPI.getCourseLessons("course123");
    console.log('Course lessons:', lessons);

    // Get lessons by category
    const categoryLessons = await CourseStudentAPI.getLessonsByCategory("category456");
    console.log('Category lessons:', categoryLessons);

    // Enroll in course
    await CourseStudentAPI.enrollInCourse("course123");
    console.log('Enrolled in course successfully');
  } catch (error) {
    console.error('Course student operation failed:', error);
  }
}
*/