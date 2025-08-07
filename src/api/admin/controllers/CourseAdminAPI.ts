// src/api/admin/controllers/CourseAdminAPI.ts
import api from '../../api';
import { CourseCreateDTO, CourseResponseDTO } from '../../dtos/courseDtos';
import { CourseCategoryResponseDTO } from '../../dtos/courseCategoryDtos';

export class CourseAdminAPI {
  /**
   * Gets all courses (admin only)
   * @returns Promise containing array of course DTOs
   */
  static async getAllCourses(): Promise<CourseResponseDTO[]> {
    try {
      const response = await api.get<CourseResponseDTO[]>('/api/admin/courses');
      return response.data;
    } catch (error) {
      console.error('Error fetching all courses:', error);
      throw error;
    }
  }

  /**
   * Gets a course by ID (admin only)
   * @param id Course ID
   * @returns Promise containing course DTO
   */
  static async getCourseById(id: string): Promise<CourseResponseDTO> {
    try {
      const response = await api.get<CourseResponseDTO>(`/api/admin/courses/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching course by ID:', error);
      throw error;
    }
  }

  /**
   * Creates a new course (admin only)
   * @param course Course creation data
   * @returns Promise containing created course DTO
   */
  static async createCourse(course: CourseCreateDTO): Promise<CourseResponseDTO> {
    try {
      const response = await api.post<CourseResponseDTO>('/api/admin/courses', course);
      return response.data;
    } catch (error) {
      console.error('Error creating course:', error);
      throw error;
    }
  }

  /**
   * Updates an existing course (admin only)
   * @param id Course ID
   * @param course Course update data
   * @returns Promise containing updated course DTO
   */
  static async updateCourse(id: string, course: CourseCreateDTO): Promise<CourseResponseDTO> {
    try {
      const response = await api.put<CourseResponseDTO>(`/api/admin/courses/${id}`, course);
      return response.data;
    } catch (error) {
      console.error('Error updating course:', error);
      throw error;
    }
  }

  /**
   * Deletes a course (admin only)
   * @param id Course ID
   * @returns Promise containing void
   */
  static async deleteCourse(id: string): Promise<void> {
    try {
      await api.delete(`/api/admin/courses/${id}`);
    } catch (error) {
      console.error('Error deleting course:', error);
      throw error;
    }
  }

  /**
   * Gets all course categories (admin only)
   * @returns Promise containing array of course category DTOs
   */
  static async getAllCategories(): Promise<CourseCategoryResponseDTO[]> {
    try {
      const response = await api.get<CourseCategoryResponseDTO[]>('/api/admin/courses/categories');
      return response.data;
    } catch (error) {
      console.error('Error fetching all course categories:', error);
      throw error;
    }
  }

  /**
   * Creates a new course category (admin only)
   * @param category Category data
   * @returns Promise containing created course category DTO
   */
  static async createCategory(category: { categoryName: string }): Promise<CourseCategoryResponseDTO> {
    try {
      const response = await api.post<CourseCategoryResponseDTO>('/api/admin/courses/categories', category);
      return response.data;
    } catch (error) {
      console.error('Error creating course category:', error);
      throw error;
    }
  }

  /**
   * Deletes a course category (admin only)
   * @param id Category ID
   * @returns Promise containing void
   */
  static async deleteCategory(id: string): Promise<void> {
    try {
      await api.delete(`/api/admin/courses/categories/${id}`);
    } catch (error) {
      console.error('Error deleting course category:', error);
      throw error;
    }
  }

  /**
   * Updates course categories (admin only)
   * @param courseId Course ID
   * @param categoryIds Set of category IDs
   * @returns Promise containing updated course DTO
   */
  static async updateCourseCategories(courseId: string, categoryIds: Set<string>): Promise<CourseResponseDTO> {
    try {
      const response = await api.put<CourseResponseDTO>(`/api/admin/courses/${courseId}/categories`, Array.from(categoryIds));
      return response.data;
    } catch (error) {
      console.error('Error updating course categories:', error);
      throw error;
    }
  }
}

// Usage example:
/*
async function handleCourseAdminOperations() {
  try {
    // Get all courses
    const allCourses = await CourseAdminAPI.getAllCourses();
    
    // Create new course
    const newCourse: CourseCreateDTO = {
      categoryIds: new Set(["cat1", "cat2"]),
      level: "Intermediate",
      name: "Web Development",
      description: "Learn web dev",
      creatorId: "user123",
      duration: 120,
      imageUrl: "http://example.com/image.jpg"
    };
    const createdCourse = await CourseAdminAPI.createCourse(newCourse);
    
    // Get all categories
    const categories = await CourseAdminAPI.getAllCategories();
    
    // Create new category
    const newCategory = await CourseAdminAPI.createCategory({ categoryName: "Programming" });
    
    // Update course categories
    const updatedCourse = await CourseAdminAPI.updateCourseCategories(createdCourse.id, new Set([newCategory.id]));
    
    // Delete course
    await CourseAdminAPI.deleteCourse(createdCourse.id);
    
    // Delete category
    await CourseAdminAPI.deleteCategory(newCategory.id);
  } catch (error) {
    console.error('Course admin operation failed:', error);
  }
}
*/