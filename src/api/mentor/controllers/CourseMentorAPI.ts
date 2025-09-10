// src/api/mentor/controllers/CourseMentorAPI.ts
import api from '../../api';
import { CourseCreateDTO, CourseResponseDTO } from '../../dtos/courseDtos';

export class CourseMentorAPI {
  /**
   * Gets all courses by the current mentor (mentor only)
   * @returns Promise containing array of course DTOs
   */
  static async getAllCoursesByMentor(): Promise<CourseResponseDTO[]> {
    try {
      const response = await api.get<CourseResponseDTO[]>('/api/mentor/courses');
      return response.data;
    } catch (error) {
      console.error('Error fetching all courses by mentor:', error);
      throw error;
    }
  }

  /**
   * Gets a course by ID (mentor only)
   * @param id Course ID
   * @returns Promise containing course DTO
   */
  static async getCourseById(id: string): Promise<CourseResponseDTO> {
    try {
      const response = await api.get<CourseResponseDTO>(`/api/mentor/courses/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching course by ID:', error);
      throw error;
    }
  }

  /**
   * Creates a new course (mentor only)
   * @param course Course creation data
   * @returns Promise containing created course DTO
   */
  static async createCourse(course: CourseCreateDTO): Promise<CourseResponseDTO> {
    try {
      const response = await api.post<CourseResponseDTO>('/api/mentor/courses', course);
      return response.data;
    } catch (error) {
      console.error('Error creating course:', error);
      throw error;
    }
  }

  /**
   * Updates an existing course (mentor only)
   * @param id Course ID
   * @param course Course update data
   * @returns Promise containing updated course DTO
   */
  static async updateCourse(id: string, course: CourseCreateDTO): Promise<CourseResponseDTO> {
    try {
      const response = await api.put<CourseResponseDTO>(`/api/mentor/courses/${id}`, course);
      return response.data;
    } catch (error) {
      console.error('Error updating course:', error);
      throw error;
    }
  }

  /**
   * Deletes a course (mentor only)
   * @param id Course ID
   * @returns Promise containing void
   */
  static async deleteCourse(id: string): Promise<void> {
    try {
      await api.delete(`/api/mentor/courses/${id}`);
    } catch (error) {
      console.error('Error deleting course:', error);
      throw error;
    }
  }
}

// Usage example:
/*
async function handleCourseMentorOperations() {
  try {
    // Get all courses by mentor
    const allCourses = await CourseMentorAPI.getAllCoursesByMentor();
    console.log('All courses:', allCourses);

    // Create new course
    const newCourse: CourseCreateDTO = {
      title: "Mathematics 101",
      description: "Basic math course",
      categoryId: "category123"
    };
    const createdCourse = await CourseMentorAPI.createCourse(newCourse);
    console.log('Created course:', createdCourse);

    // Get specific course
    const course = await CourseMentorAPI.getCourseById(createdCourse.id);
    console.log('Course:', course);

    // Update course
    const updatedCourse = await CourseMentorAPI.updateCourse(createdCourse.id, {
      ...newCourse,
      title: "Mathematics 102"
    });
    console.log('Updated course:', updatedCourse);

    // Delete course
    await CourseMentorAPI.deleteCourse(createdCourse.id);
    console.log('Course deleted successfully');
  } catch (error) {
    console.error('Course mentor operation failed:', error);
  }
}
*/