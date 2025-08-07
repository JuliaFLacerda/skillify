import api from '../../api';
import { SalesPlanAdminReturnDTO, SalesPlanAdminCreateDTO, SalesPlanAdminMembershipEventReturnDTO, SalesPlanAdminMembershipEventCreateDTO } from '../../dtos/salesPlanAdminDtos';

export class AdminSalesPlanAdminAPI {
  /**
   * Gets all sales plans for admin
   * @returns Promise containing a list of sales plan DTOs
   */
  static async getAllSalesPlans(): Promise<SalesPlanAdminReturnDTO[]> {
    try {
      const response = await api.get<SalesPlanAdminReturnDTO[]>('/api/admin/pacotes');
      return response.data;
    } catch (error) {
      console.error('Error fetching all sales plans:', error);
      throw error;
    }
  }

  /**
   * Gets a sales plan by ID for admin
   * @param id Sales plan ID
   * @returns Promise containing a sales plan DTO or null if not found
   */
  static async getSalesPlanById(id: string): Promise<SalesPlanAdminReturnDTO | null> {
    try {
      const response = await api.get<SalesPlanAdminReturnDTO>(`/api/admin/pacotes/${id}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      console.error('Error fetching sales plan by ID:', error);
      throw error;
    }
  }

  /**
   * Gets sales plans by creator ID for admin
   * @param creatorId Creator ID
   * @returns Promise containing a list of sales plan DTOs
   */
  static async getSalesPlansByCreator(creatorId: string): Promise<SalesPlanAdminReturnDTO[]> {
    try {
      const response = await api.get<SalesPlanAdminReturnDTO[]>(`/api/admin/pacotes/creator/${creatorId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching sales plans by creator:', error);
      throw error;
    }
  }

  /**
   * Creates a new sales plan for admin
   * @param createDTO Sales plan creation data
   * @param creatorId Creator ID
   * @returns Promise containing the created sales plan DTO
   */
  static async createSalesPlan(createDTO: SalesPlanAdminCreateDTO, creatorId: string): Promise<SalesPlanAdminReturnDTO> {
    try {
      const response = await api.post<SalesPlanAdminReturnDTO>('/api/admin/pacotes', createDTO, {
        params: { creatorId },
      });
      return response.data;
    } catch (error) {
      console.error('Error creating sales plan:', error);
      throw error;
    }
  }

  /**
   * Updates an existing sales plan for admin
   * @param id Sales plan ID
   * @param updateDTO Sales plan update data
   * @returns Promise containing the updated sales plan DTO
   */
  static async updateSalesPlan(id: string, updateDTO: SalesPlanAdminCreateDTO): Promise<SalesPlanAdminReturnDTO> {
    try {
      const response = await api.put<SalesPlanAdminReturnDTO>(`/api/admin/pacotes/${id}`, updateDTO);
      return response.data;
    } catch (error) {
      console.error('Error updating sales plan:', error);
      throw error;
    }
  }

  /**
   * Deletes a sales plan by ID for admin
   * @param id Sales plan ID
   * @returns Promise resolving when deletion is successful
   */
  static async deleteSalesPlan(id: string): Promise<void> {
    try {
      await api.delete(`/api/admin/pacotes/${id}`);
    } catch (error) {
      console.error('Error deleting sales plan:', error);
      throw error;
    }
  }

  /**
   * Gets all membership events for admin
   * @returns Promise containing a list of membership event DTOs
   */
  static async getAllMembershipEvents(): Promise<SalesPlanAdminMembershipEventReturnDTO[]> {
    try {
      const response = await api.get<SalesPlanAdminMembershipEventReturnDTO[]>('/api/admin/pacotes/membership-events');
      return response.data;
    } catch (error) {
      console.error('Error fetching all membership events:', error);
      throw error;
    }
  }

  /**
   * Gets a membership event by ID for admin
   * @param id Membership event ID
   * @returns Promise containing a membership event DTO or null if not found
   */
  static async getMembershipEventById(id: string): Promise<SalesPlanAdminMembershipEventReturnDTO | null> {
    try {
      const response = await api.get<SalesPlanAdminMembershipEventReturnDTO>(`/api/admin/pacotes/membership-events/${id}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      console.error('Error fetching membership event by ID:', error);
      throw error;
    }
  }

  /**
   * Creates a new membership event for admin
   * @param createDTO Membership event creation data
   * @returns Promise containing the created membership event DTO
   */
  static async createMembershipEvent(createDTO: SalesPlanAdminMembershipEventCreateDTO): Promise<SalesPlanAdminMembershipEventReturnDTO> {
    try {
      const response = await api.post<SalesPlanAdminMembershipEventReturnDTO>('/api/admin/pacotes/membership-events', createDTO);
      return response.data;
    } catch (error) {
      console.error('Error creating membership event:', error);
      throw error;
    }
  }

  /**
   * Updates an existing membership event for admin
   * @param id Membership event ID
   * @param updateDTO Membership event update data
   * @returns Promise containing the updated membership event DTO
   */
  static async updateMembershipEvent(id: string, updateDTO: SalesPlanAdminMembershipEventCreateDTO): Promise<SalesPlanAdminMembershipEventReturnDTO> {
    try {
      const response = await api.put<SalesPlanAdminMembershipEventReturnDTO>(`/api/admin/pacotes/membership-events/${id}`, updateDTO);
      return response.data;
    } catch (error) {
      console.error('Error updating membership event:', error);
      throw error;
    }
  }

  /**
   * Deletes a membership event by ID for admin
   * @param id Membership event ID
   * @returns Promise resolving when deletion is successful
   */
  static async deleteMembershipEvent(id: string): Promise<void> {
    try {
      await api.delete(`/api/admin/pacotes/membership-events/${id}`);
    } catch (error) {
      console.error('Error deleting membership event:', error);
      throw error;
    }
  }
}

// Usage example:
/*
async function handleAdminSalesPlanOperations() {
  try {
    // Get all sales plans
    const allPlans = await AdminSalesPlanAdminAPI.getAllSalesPlans();
    console.log('All sales plans:', allPlans);

    // Get sales plan by ID
    const salesPlan = await AdminSalesPlanAdminAPI.getSalesPlanById("plan123");
    console.log('Sales plan:', salesPlan);

    // Get sales plans by creator
    const creatorPlans = await AdminSalesPlanAdminAPI.getSalesPlansByCreator("creator456");
    console.log('Creator sales plans:', creatorPlans);

    // Create a sales plan
    const newPlan = await AdminSalesPlanAdminAPI.createSalesPlan(
      { name: "New Plan", description: "Description", price: 99.99, type: PlanType.PREMIUM, resources: ["resource1"] },
      "creator456"
    );
    console.log('Created sales plan:', newPlan);

    // Update a sales plan
    const updatedPlan = await AdminSalesPlanAdminAPI.updateSalesPlan("plan123", {
      name: "Updated Plan",
      description: "Updated Description",
      price: 149.99,
      type: PlanType.PREMIUM,
      resources: ["resource1", "resource2"],
    });
    console.log('Updated sales plan:', updatedPlan);

    // Delete a sales plan
    await AdminSalesPlanAdminAPI.deleteSalesPlan("plan123");
    console.log('Sales plan deleted');

    // Get all membership events
    const allEvents = await AdminSalesPlanAdminAPI.getAllMembershipEvents();
    console.log('All membership events:', allEvents);

    // Get membership event by ID
    const membershipEvent = await AdminSalesPlanAdminAPI.getMembershipEventById("event123");
    console.log('Membership event:', membershipEvent);

    // Create a membership event
    const newEvent = await AdminSalesPlanAdminAPI.createMembershipEvent({
      customerId: "customer789",
      salesPlanId: "plan123",
      status: SalesPlanMembershipType.ACTIVE,
    });
    console.log('Created membership event:', newEvent);

    // Update a membership event
    const updatedEvent = await AdminSalesPlanAdminAPI.updateMembershipEvent("event123", {
      customerId: "customer789",
      salesPlanId: "plan123",
      status: SalesPlanMembershipType.NOT_ACTIVE,
    });
    console.log('Updated membership event:', updatedEvent);

    // Delete a membership event
    await AdminSalesPlanAdminAPI.deleteMembershipEvent("event123");
    console.log('Membership event deleted');
  } catch (error) {
    console.error('Admin sales plan operation failed:', error);
  }
}
*/