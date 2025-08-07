// src/api/student/controllers/SalesPlanStudentAPI.ts
import api from '../../api';
import { SalesPlanResponseDTO, PlanType } from '../../dtos/salesPlanDtos';

export class SalesPlanStudentAPI {
  /**
   * Gets all sales plans for the authenticated student (student only)
   * @returns Promise containing array of sales plan DTOs
   */
  static async getAllSalesPlans(): Promise<SalesPlanResponseDTO[]> {
    try {
      const response = await api.get<SalesPlanResponseDTO[]>('/api/student/sales-plans');
      return response.data;
    } catch (error) {
      console.error('Error fetching all sales plans:', error);
      throw error;
    }
  }

  /**
   * Gets a sales plan by ID for the authenticated student (student only)
   * @param id Sales plan ID
   * @returns Promise containing sales plan DTO
   */
  static async getSalesPlanById(id: string): Promise<SalesPlanResponseDTO> {
    try {
      const response = await api.get<SalesPlanResponseDTO>(`/api/student/sales-plans/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching sales plan by ID:', error);
      throw error;
    }
  }

  /**
   * Gets sales plans by type for the authenticated student (student only)
   * @param planType Plan type
   * @returns Promise containing array of sales plan DTOs
   */
  static async getSalesPlansByType(planType: PlanType): Promise<SalesPlanResponseDTO[]> {
    try {
      const response = await api.get<SalesPlanResponseDTO[]>(`/api/student/sales-plans/type/${planType}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching sales plans by type:', error);
      throw error;
    }
  }
}

// Usage example:
/*
async function handleSalesPlanStudentOperations() {
  try {
    // Get all sales plans
    const allPlans = await SalesPlanStudentAPI.getAllSalesPlans();
    console.log('All sales plans:', allPlans);

    // Get specific sales plan
    const plan = await SalesPlanStudentAPI.getSalesPlanById("plan123");
    console.log('Sales plan:', plan);

    // Get sales plans by type
    const basicPlans = await SalesPlanStudentAPI.getSalesPlansByType(PlanType.BASIC);
    console.log('Basic sales plans:', basicPlans);
  } catch (error) {
    console.error('Sales plan student operation failed:', error);
  }
}
*/