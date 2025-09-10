// src/api/student/controllers/StudentOrderAPI.ts
import api from '../../api';
import { OrderRequestDTO, OrderResponseDTO } from '../../dtos/orderDtos';

export class StudentOrderAPI {
  /**
   * Gets all orders for the authenticated student (student only)
   * @param userId User ID of the authenticated student
   * @returns Promise containing array of order DTOs
   */
  static async getMyOrders(userId: string): Promise<OrderResponseDTO[]> {
    try {
      const response = await api.get<OrderResponseDTO[]>('/api/student/orders/my', {
        params: { userId }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching my orders:', error);
      throw error;
    }
  }

  /**
   * Gets the active order for the authenticated student (student only)
   * @param userId User ID of the authenticated student
   * @returns Promise containing order DTO or undefined if none active
   */
  static async getMyActiveOrder(userId: string): Promise<OrderResponseDTO | undefined> {
    try {
      const response = await api.get<OrderResponseDTO>('/api/student/orders/my/active', {
        params: { userId }
      });
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        return undefined; // Handle 404 as no active order
      }
      console.error('Error fetching active order:', error);
      throw error;
    }
  }

  /**
   * Creates a new order for the authenticated student (student only)
   * @param orderRequest Order creation data
   * @returns Promise containing created order DTO
   */
  static async createOrder(orderRequest: OrderRequestDTO): Promise<OrderResponseDTO> {
    try {
      const response = await api.post<OrderResponseDTO>('/api/student/orders', orderRequest);
      return response.data;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

  /**
   * Checks if the authenticated student has an active subscription (student only)
   * @param userId User ID of the authenticated student
   * @returns Promise containing boolean indicating subscription status
   */
  static async checkSubscriptionStatus(userId: string): Promise<boolean> {
    try {
      const response = await api.get<boolean>('/api/student/orders/subscription/status', {
        params: { userId }
      });
      return response.data;
    } catch (error) {
      console.error('Error checking subscription status:', error);
      throw error;
    }
  }

  /**
   * Gets current order details for the authenticated student (student only)
   * @param userId User ID of the authenticated student
   * @returns Promise containing current order DTO or undefined if none
   */
  static async getCurrentOrderDetails(userId: string): Promise<OrderResponseDTO | undefined> {
    try {
      const response = await api.get<OrderResponseDTO>('/api/student/orders/current', {
        params: { userId }
      });
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        return undefined; // Handle 404 as no current order
      }
      console.error('Error fetching current order details:', error);
      throw error;
    }
  }
}

// Usage example:
/*
async function handleStudentOrderOperations(userId: string) {
  try {
    // Get all orders
    const myOrders = await StudentOrderAPI.getMyOrders(userId);
    console.log('My orders:', myOrders);

    // Get active order
    const activeOrder = await StudentOrderAPI.getMyActiveOrder(userId);
    console.log('Active order:', activeOrder || 'No active order');

    // Create new order
    const newOrder: OrderRequestDTO = {
      salesPlanId: "plan123",
      userId: userId,
      // Add other required fields based on your OrderRequestDTO
    };
    const createdOrder = await StudentOrderAPI.createOrder(newOrder);
    console.log('Created order:', createdOrder);

    // Check subscription status
    const hasSubscription = await StudentOrderAPI.checkSubscriptionStatus(userId);
    console.log('Has active subscription:', hasSubscription);

    // Get current order details
    const currentOrder = await StudentOrderAPI.getCurrentOrderDetails(userId);
    console.log('Current order:', currentOrder || 'No current order');
  } catch (error) {
    console.error('Student order operation failed:', error);
  }
}
*/