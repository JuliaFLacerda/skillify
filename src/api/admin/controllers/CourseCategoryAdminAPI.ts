import api from '../../api';
import { CourseCategoryCreateDTO, CourseCategoryResponseDTO } from '../../dtos/courseCategoryDtos';

export class CourseCategoryAdminAPI {
  /**
   * Gets all course categories for the current admin user
   * @returns Promise containing array of course category DTOs
   */
  static async getAllCategories(): Promise<CourseCategoryResponseDTO[]> {
    try {
      const response = await api.get<CourseCategoryResponseDTO[]>('/api/admin/course-categories');
      return response.data;
    } catch (error) {
      console.error('Error fetching course categories:', error);
      throw error;
    }
  }

  /**
   * Gets a course category by ID for the current admin user
   * @param id Category ID
   * @returns Promise containing course category DTO
   */
  static async getCategoryById(id: string): Promise<CourseCategoryResponseDTO> {
    try {
      const response = await api.get<CourseCategoryResponseDTO>(`/api/admin/course-categories/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching course category:', error);
      throw error;
    }
  }

  /**
   * Creates a new course category for the current admin user
   * @param category Category creation data
   * @returns Promise containing created course category DTO
   */
  static async createCategory(category: CourseCategoryCreateDTO): Promise<CourseCategoryResponseDTO> {
    try {
      const response = await api.post<CourseCategoryResponseDTO>('/api/admin/course-categories', category);
      return response.data;
    } catch (error) {
      console.error('Error creating course category:', error);
      throw error;
    }
  }

  /**
   * Updates an existing course category for the current admin user
   * @param id Category ID
   * @param category Category update data
   * @returns Promise containing updated course category DTO
   */
  static async updateCategory(id: string, category: CourseCategoryCreateDTO): Promise<CourseCategoryResponseDTO> {
    try {
      const response = await api.put<CourseCategoryResponseDTO>(`/api/admin/course-categories/${id}`, category);
      return response.data;
    } catch (error) {
      console.error('Error updating course category:', error);
      throw error;
    }
  }

  /**
   * Deletes a course category for the current admin user
   * @param id Category ID
   * @returns Promise containing void
   */
  static async deleteCategory(id: string): Promise<void> {
    try {
      await api.delete(`/api/admin/course-categories/${id}`);
    } catch (error) {
      console.error('Error deleting course category:', error);
      throw error;
    }
  }
}

// Updated usage example:
/*
async function handleCourseCategoryAdminOperations() {
  try {
    // Get all categories for current admin
    const myCategories = await CourseCategoryAdminAPI.getAllCategories();
    console.log('My categories:', myCategories);

    // Create new category
    const newCategory: CourseCategoryCreateDTO = {
      categoryName: "Mathematics"
    };
    const createdCategory = await CourseCategoryAdminAPI.createCategory(newCategory);
    console.log('Created category:', createdCategory);

    // Get specific category (only if it belongs to current admin)
    const category = await CourseCategoryAdminAPI.getCategoryById(createdCategory.id);
    console.log('Category details:', category);

    // Update category (only if it belongs to current admin)
    const updatedCategory = await CourseCategoryAdminAPI.updateCategory(createdCategory.id, {
      categoryName: "Advanced Mathematics"
    });
    console.log('Updated category:', updatedCategory);

    // Delete category (only if it belongs to current admin)
    await CourseCategoryAdminAPI.deleteCategory(createdCategory.id);
    console.log('Category deleted successfully');
  } catch (error) {
    console.error('Course category operation failed:', error);
    // Handle 403 Forbidden if trying to access another admin's categories
  }
}
*/