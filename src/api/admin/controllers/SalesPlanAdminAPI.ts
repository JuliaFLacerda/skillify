// src/api/admin/controllers/SalesPlanAdminAPI.ts
import api from '../../api';
import { SalesPlanCreateDTO, SalesPlanResponseDTO, PlanType } from '../../dtos/salesPlanDtos';

export class SalesPlanAdminAPI {
  /**
   * Gets all sales plans (admin only)
   * @returns Promise containing array of sales plan DTOs
   */
  static async getAllPlans(): Promise<SalesPlanResponseDTO[]> {
    try {
      const response = await api.get<SalesPlanResponseDTO[]>('/api/admin/sales-plans');
      return response.data;
    } catch (error) {
      console.error('Error fetching all sales plans:', error);
      throw error;
    }
  }

  /**
   * Gets a sales plan by ID (admin only)
   * @param id Plan ID
   * @returns Promise containing sales plan DTO
   */
  static async getPlanById(id: string): Promise<SalesPlanResponseDTO> {
    try {
      const response = await api.get<SalesPlanResponseDTO>(`/api/admin/sales-plans/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching sales plan by ID:', error);
      throw error;
    }
  }

  /**
   * Gets sales plans by type (admin only)
   * @param type Plan type
   * @returns Promise containing array of sales plan DTOs
   */
  static async getPlansByType(type: PlanType): Promise<SalesPlanResponseDTO[]> {
    try {
      const response = await api.get<SalesPlanResponseDTO[]>(`/api/admin/sales-plans/type/${type}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching sales plans by type:', error);
      throw error;
    }
  }

  /**
   * Creates a new sales plan (admin only)
   * @param plan Plan creation data
   * @returns Promise containing created sales plan DTO
   */
  static async createPlan(plan: SalesPlanCreateDTO): Promise<SalesPlanResponseDTO> {
    try {
      const response = await api.post<SalesPlanResponseDTO>('/api/admin/sales-plans', plan);
      return response.data;
    } catch (error) {
      console.error('Error creating sales plan:', error);
      throw error;
    }
  }

  /**
   * Updates an existing sales plan (admin only)
   * @param id Plan ID
   * @param plan Plan update data
   * @returns Promise containing updated sales plan DTO
   */
  static async updatePlan(id: string, plan: SalesPlanCreateDTO): Promise<SalesPlanResponseDTO> {
    try {
      const response = await api.put<SalesPlanResponseDTO>(`/api/admin/sales-plans/${id}`, plan);
      return response.data;
    } catch (error) {
      console.error('Error updating sales plan:', error);
      throw error;
    }
  }

  /**
   * Deletes a sales plan (admin only)
   * @param id Plan ID
   * @returns Promise containing void
   */
  static async deletePlan(id: string): Promise<void> {
    try {
      await api.delete(`/api/admin/sales-plans/${id}`);
    } catch (error) {
      console.error('Error deleting sales plan:', error);
      throw error;
    }
  }
}

// Usage example:
/*
async function handleSalesPlanAdminOperations() {
  try {
    // Get all plans
    const allPlans = await SalesPlanAdminAPI.getAllPlans();
    console.log('All plans:', allPlans);

    // Create new plan
    const newPlan: SalesPlanCreateDTO = {
      name: "Basic Plan",
      description: "Basic access to features",
      price: "9.99", // String representation of BigDecimal
      type: PlanType.BASIC,
      resources: ["Feature 1", "Feature 2"]
    };
    const createdPlan = await SalesPlanAdminAPI.createPlan(newPlan);
    console.log('Created plan:', createdPlan);

    // Get plans by type
    const basicPlans = await SalesPlanAdminAPI.getPlansByType(PlanType.BASIC);
    console.log('Basic plans:', basicPlans);

    // Get specific plan
    const plan = await SalesPlanAdminAPI.getPlanById(createdPlan.id);
    console.log('Plan:', plan);

    // Update plan
    const updatedPlan = await SalesPlanAdminAPI.updatePlan(createdPlan.id, {
      ...newPlan,
      price: "12.99"
    });
    console.log('Updated plan:', updatedPlan);

    // Delete plan
    await SalesPlanAdminAPI.deletePlan(createdPlan.id);
    console.log('Plan deleted successfully');
  } catch (error) {
    console.error('Sales plan admin operation failed:', error);
  }
}
*/