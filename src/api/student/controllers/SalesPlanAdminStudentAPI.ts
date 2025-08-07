// src/api/student/controllers/SalesPlanAdminStudentAPI.ts
import api from '../../api';
import { PlanType, SalesPlanAdminReturnDTO } from '../../dtos/salesPlanAdminDtos';

export class SalesPlanAdminStudentAPI {
  /**
   * Gets all sales plans available to the authenticated student
   * @returns Promise containing a list of sales plan DTOs
   */
  static async getAllSalesPlans(): Promise<SalesPlanAdminReturnDTO[]> {
    try {
      const response = await api.get<SalesPlanAdminReturnDTO[]>('/api/estudante/planos-venda-admin');
      return response.data;
    } catch (error) {
      console.error('Error fetching all sales plans:', error);
      throw error;
    }
  }

  /**
   * Gets a sales plan by ID for the authenticated student
   * @param id Sales plan ID
   * @returns Promise containing a sales plan DTO
   */
  static async getSalesPlanById(id: string): Promise<SalesPlanAdminReturnDTO> {
    try {
      const response = await api.get<SalesPlanAdminReturnDTO>(`/api/estudante/planos-venda-admin/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching sales plan by ID:', error);
      throw error;
    }
  }

  /**
   * Gets sales plans by type for the authenticated student
   * @param planType The type of sales plan (e.g., BASIC, PREMIUM)
   * @returns Promise containing a list of sales plan DTOs
   */
  static async getSalesPlansByType(planType: PlanType): Promise<SalesPlanAdminReturnDTO[]> {
    try {
      const response = await api.get<SalesPlanAdminReturnDTO[]>(`/api/estudante/planos-venda-admin/tipo/${planType}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching sales plans by type:', error);
      throw error;
    }
  }

  /**
   * Gets the authenticated student's sales plans
   * @returns Promise containing a list of sales plan DTOs
   */
  static async getUserSalesPlans(): Promise<SalesPlanAdminReturnDTO[]> {
    try {
      const response = await api.get<SalesPlanAdminReturnDTO[]>('/api/estudante/planos-venda-admin/meus-planos');
      return response.data;
    } catch (error) {
      console.error('Error fetching user sales plans:', error);
      throw error;
    }
  }
}

// Usage example:
/*
async function handleSalesPlanStudentOperations() {
  try {
    // Get all sales plans
    const allPlans = await SalesPlanAdminStudentAPI.getAllSalesPlans();
    console.log('All sales plans:', allPlans);

    // Get specific sales plan by ID
    const salesPlan = await SalesPlanAdminStudentAPI.getSalesPlanById("plan123");
    console.log('Sales plan:', salesPlan);

    // Get sales plans by type
    const premiumPlans = await SalesPlanAdminStudentAPI.getSalesPlansByType(PlanType.PREMIUM);
    console.log('Premium sales plans:', premiumPlans);

    // Get user's sales plans
    const userPlans = await SalesPlanAdminStudentAPI.getUserSalesPlans();
    console.log('User sales plans:', userPlans);
  } catch (error) {
    console.error('Sales plan student operation failed:', error);
  }
}
*/