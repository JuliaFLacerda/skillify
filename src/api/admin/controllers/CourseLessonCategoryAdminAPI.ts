// src/api/admin/controllers/CourseLessonCategoryAdminAPI.ts
import api from '../../api';
import { CourseLessonCategoryCreateDTO, CourseLessonCategoryResponseDTO } from '../../dtos/courseLessonCategoryDtos';

export class CourseLessonCategoryAdminAPI {
  /**
   * Gets all course lesson categories (admin only)
   * @returns Promise containing array of course lesson category DTOs
   */
  static async getAllCategories(): Promise<CourseLessonCategoryResponseDTO[]> {
    try {
      const response = await api.get<CourseLessonCategoryResponseDTO[]>('/api/admin/course-lesson-categories');
      return response.data;
    } catch (error) {
      console.error('Error fetching all course lesson categories:', error);
      throw error;
    }
  }

  /**
   * Gets a course lesson category by ID (admin only)
   * @param id Category ID
   * @returns Promise containing course lesson category DTO
   */
  static async getCategoryById(id: string): Promise<CourseLessonCategoryResponseDTO> {
    try {
      const response = await api.get<CourseLessonCategoryResponseDTO>(`/api/admin/course-lesson-categories/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching course lesson category by ID:', error);
      throw error;
    }
  }

  /**
   * Gets course lesson categories by course ID (admin only)
   * @param courseId Course ID
   * @returns Promise containing array of course lesson category DTOs
   */
  static async getCategoriesByCourse(courseId: string): Promise<CourseLessonCategoryResponseDTO[]> {
    try {
      const response = await api.get<CourseLessonCategoryResponseDTO[]>(`/api/admin/course-lesson-categories/course/${courseId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching course lesson categories by course:', error);
      throw error;
    }
  }

  /**
   * Creates a new course lesson category (admin only)
   * @param category Category creation data
   * @returns Promise containing created course lesson category DTO
   */
  static async createCategory(category: CourseLessonCategoryCreateDTO): Promise<CourseLessonCategoryResponseDTO> {
    try {
      const response = await api.post<CourseLessonCategoryResponseDTO>('/api/admin/course-lesson-categories', category);
      return response.data;
    } catch (error) {
      console.error('Error creating course lesson category:', error);
      throw error;
    }
  }

  /**
   * Updates an existing course lesson category (admin only)
   * @param id Category ID
   * @param category Category update data
   * @returns Promise containing updated course lesson category DTO
   */
  static async updateCategory(id: string, category: CourseLessonCategoryCreateDTO): Promise<CourseLessonCategoryResponseDTO> {
    try {
      const response = await api.put<CourseLessonCategoryResponseDTO>(`/api/admin/course-lesson-categories/${id}`, category);
      return response.data;
    } catch (error) {
      console.error('Error updating course lesson category:', error);
      throw error;
    }
  }

  /**
   * Deletes a course lesson category (admin only)
   * @param id Category ID
   * @returns Promise containing void
   */
  static async deleteCategory(id: string): Promise<void> {
    try {
      await api.delete(`/api/admin/course-lesson-categories/${id}`);
    } catch (error) {
      console.error('Error deleting course lesson category:', error);
      throw error;
    }
  }
}

// Usage example:
/*
async function handleCourseLessonCategoryAdminOperations() {
  try {
    // Get all categories
    const allCategories = await CourseLessonCategoryAdminAPI.getAllCategories();
    console.log('All categories:', allCategories);

    // Create new category
    const newCategory: CourseLessonCategoryCreateDTO = {
      courseId: "course123",
      name: "Introduction"
    };
    const createdCategory = await CourseLessonCategoryAdminAPI.createCategory(newCategory);
    console.log('Created category:', createdCategory);

    // Get categories by course
    const courseCategories = await CourseLessonCategoryAdminAPI.getCategoriesByCourse("course123");
    console.log('Course categories:', courseCategories);

    // Get specific category
    const category = await CourseLessonCategoryAdminAPI.getCategoryById(createdCategory.id);
    console.log('Category:', category);

    // Update category
    const updatedCategory = await CourseLessonCategoryAdminAPI.updateCategory(createdCategory.id, {
      courseId: "course123",
      name: "Introduction Updated"
    });
    console.log('Updated category:', updatedCategory);

    // Delete category
    await CourseLessonCategoryAdminAPI.deleteCategory(createdCategory.id);
    console.log('Category deleted successfully');
  } catch (error) {
    console.error('Course lesson category admin operation failed:', error);
  }
}
*/