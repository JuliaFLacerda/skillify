// src/api/mentor/controllers/SalesPlanMentorAPI.ts
import api from '../../api';
import { SalesPlanResponseDTO, PlanType } from '../../dtos/salesPlanDtos';

export class SalesPlanMentorAPI {
  /**
   * Gets all sales plans (mentor only)
   * @returns Promise containing array of sales plan DTOs
   */
  static async getAllPlans(): Promise<SalesPlanResponseDTO[]> {
    try {
      const response = await api.get<SalesPlanResponseDTO[]>('/api/mentor/sales-plans');
      return response.data;
    } catch (error) {
      console.error('Error fetching all sales plans:', error);
      throw error;
    }
  }

  /**
   * Gets a sales plan by ID (mentor only)
   * @param id Plan ID
   * @returns Promise containing sales plan DTO
   */
  static async getPlanById(id: string): Promise<SalesPlanResponseDTO> {
    try {
      const response = await api.get<SalesPlanResponseDTO>(`/api/mentor/sales-plans/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching sales plan by ID:', error);
      throw error;
    }
  }

  /**
   * Gets sales plans by type (mentor only)
   * @param type Plan type
   * @returns Promise containing array of sales plan DTOs
   */
  static async getPlansByType(type: PlanType): Promise<SalesPlanResponseDTO[]> {
    try {
      const response = await api.get<SalesPlanResponseDTO[]>(`/api/mentor/sales-plans/type/${type}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching sales plans by type:', error);
      throw error;
    }
  }
}

// Usage example:
/*
async function handleSalesPlanMentorOperations() {
  try {
    // Get all plans
    const allPlans = await SalesPlanMentorAPI.getAllPlans();
    console.log('All plans:', allPlans);

    // Get specific plan
    const plan = await SalesPlanMentorAPI.getPlanById("plan123");
    console.log('Plan:', plan);

    // Get plans by type
    const basicPlans = await SalesPlanMentorAPI.getPlansByType(PlanType.BASIC);
    console.log('Basic plans:', basicPlans);
  } catch (error) {
    console.error('Sales plan mentor operation failed:', error);
  }
}
*/