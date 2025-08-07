import { PlanType } from '@/api/dtos/salesPlanDtos';
import api from '../../api';
import { SalesPlanAdminReturnDTO } from '../../dtos/salesPlanAdminDtos';

export class SalesPlanAdminMentorAPI {
  /**
   * Gets all sales plans available to the authenticated mentor
   * @returns Promise containing a list of sales plan DTOs
   */
  static async getAllSalesPlans(): Promise<SalesPlanAdminReturnDTO[]> {
    try {
      const response = await api.get<SalesPlanAdminReturnDTO[]>('/api/mentor/sales-plans-admin');
      return response.data;
    } catch (error) {
      console.error('Error fetching all sales plans:', error);
      throw error;
    }
  }

  /**
   * Gets a sales plan by ID for the authenticated mentor
   * @param id Sales plan ID
   * @returns Promise containing a sales plan DTO
   */
  static async getSalesPlanById(id: string): Promise<SalesPlanAdminReturnDTO> {
    try {
      const response = await api.get<SalesPlanAdminReturnDTO>(`/api/mentor/sales-plans-admin/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching sales plan by ID:', error);
      throw error;
    }
  }

  /**
   * Gets sales plans by type for the authenticated mentor
   * @param planType The type of sales plan (e.g., BASIC, PREMIUM)
   * @returns Promise containing a list of sales plan DTOs
   */
  static async getSalesPlansByType(planType: PlanType): Promise<SalesPlanAdminReturnDTO[]> {
    try {
      const response = await api.get<SalesPlanAdminReturnDTO[]>(`/api/mentor/sales-plans-admin/type/${planType}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching sales plans by type:', error);
      throw error;
    }
  }

  /**
   * Gets the authenticated mentor's sales plans
   * @returns Promise containing a list of sales plan DTOs
   */
  static async getUserSalesPlans(): Promise<SalesPlanAdminReturnDTO[]> {
    try {
      const response = await api.get<SalesPlanAdminReturnDTO[]>('/api/mentor/sales-plans-admin/my-plans');
      return response.data;
    } catch (error) {
      console.error('Error fetching user sales plans:', error);
      throw error;
    }
  }
}

// Usage example:
/*
async function handleSalesPlanMentorOperations() {
  try {
    // Get all sales plans
    const allPlans = await SalesPlanAdminMentorAPI.getAllSalesPlans();
    console.log('All sales plans:', allPlans);

    // Get specific sales plan by ID
    const salesPlan = await SalesPlanAdminMentorAPI.getSalesPlanById("plan123");
    console.log('Sales plan:', salesPlan);

    // Get sales plans by type
    const premiumPlans = await SalesPlanAdminMentorAPI.getSalesPlansByType(PlanType.PREMIUM);
    console.log('Premium sales plans:', premiumPlans);

    // Get mentor's sales plans
    const userPlans = await SalesPlanAdminMentorAPI.getUserSalesPlans();
    console.log('Mentor sales plans:', userPlans);
  } catch (error) {
    console.error('Sales plan mentor operation failed:', error);
  }
}
*/