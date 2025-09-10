// src/api/mentor/controllers/CourseLessonCategoryMentorAPI.ts
import api from '../../api';
import { CourseLessonCategoryCreateDTO, CourseLessonCategoryResponseDTO } from '../../dtos/courseLessonCategoryDtos';

export class CourseLessonCategoryMentorAPI {
  /**
   * Gets categories by course ID (mentor only)
   * @param courseId Course ID
   * @returns Promise containing array of course lesson category DTOs
   */
  static async getCategoriesByCourse(courseId: string): Promise<CourseLessonCategoryResponseDTO[]> {
    try {
      const response = await api.get<CourseLessonCategoryResponseDTO[]>(`/api/mentor/course-categories/course/${courseId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching categories by course:', error);
      throw error;
    }
  }

  /**
   * Gets a category by ID (mentor only)
   * @param id Category ID
   * @returns Promise containing course lesson category DTO
   */
  static async getCategoryById(id: string): Promise<CourseLessonCategoryResponseDTO> {
    try {
      const response = await api.get<CourseLessonCategoryResponseDTO>(`/api/mentor/course-categories/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching category by ID:', error);
      throw error;
    }
  }

  /**
   * Creates a new course lesson category (mentor only)
   * @param category Category creation data
   * @returns Promise containing created course lesson category DTO
   */
  static async createCategory(category: CourseLessonCategoryCreateDTO): Promise<CourseLessonCategoryResponseDTO> {
    try {
      const response = await api.post<CourseLessonCategoryResponseDTO>('/api/mentor/course-categories', category);
      return response.data;
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  }

  /**
   * Updates an existing course lesson category (mentor only)
   * @param id Category ID
   * @param category Category update data
   * @returns Promise containing updated course lesson category DTO
   */
  static async updateCategory(id: string, category: CourseLessonCategoryCreateDTO): Promise<CourseLessonCategoryResponseDTO> {
    try {
      const response = await api.put<CourseLessonCategoryResponseDTO>(`/api/mentor/course-categories/${id}`, category);
      return response.data;
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  }

  /**
   * Deletes a course lesson category (mentor only)
   * @param id Category ID
   * @returns Promise containing void
   */
  static async deleteCategory(id: string): Promise<void> {
    try {
      await api.delete(`/api/mentor/course-categories/${id}`);
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  }
}

// Usage example:
/*
async function handleCourseLessonCategoryMentorOperations() {
  try {
    // Get categories by course
    const courseCategories = await CourseLessonCategoryMentorAPI.getCategoriesByCourse("course123");
    console.log('Course categories:', courseCategories);

    // Create new category
    const newCategory: CourseLessonCategoryCreateDTO = {
      name: "Algebra",
      courseId: "course123"
    };
    const createdCategory = await CourseLessonCategoryMentorAPI.createCategory(newCategory);
    console.log('Created category:', createdCategory);

    // Get specific category
    const category = await CourseLessonCategoryMentorAPI.getCategoryById(createdCategory.id);
    console.log('Category:', category);

    // Update category
    const updatedCategory = await CourseLessonCategoryMentorAPI.updateCategory(createdCategory.id, {
      ...newCategory,
      name: "Advanced Algebra"
    });
    console.log('Updated category:', updatedCategory);

    // Delete category
    await CourseLessonCategoryMentorAPI.deleteCategory(createdCategory.id);
    console.log('Category deleted successfully');
  } catch (error) {
    console.error('Course lesson category mentor operation failed:', error);
  }
}
*/