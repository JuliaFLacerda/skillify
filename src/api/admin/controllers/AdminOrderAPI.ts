// src/api/admin/controllers/AdminOrderAPI.ts
import api from '../../api';
import { OrderRequestDTO, OrderResponseDTO } from '../../dtos/orderDtos';

export class AdminOrderAPI {
  /**
   * Gets all orders (admin only)
   * @returns Promise containing array of order DTOs
   */
  static async getAllOrders(): Promise<OrderResponseDTO[]> {
    try {
      const response = await api.get<OrderResponseDTO[]>('/api/admin/orders');
      return response.data;
    } catch (error) {
      console.error('Error fetching all orders:', error);
      throw error;
    }
  }

  /**
   * Gets an order by ID (admin only)
   * @param id Order ID
   * @returns Promise containing order DTO
   */
  static async getOrderById(id: string): Promise<OrderResponseDTO> {
    try {
      const response = await api.get<OrderResponseDTO>(`/api/admin/orders/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching order by ID:', error);
      throw error;
    }
  }

  /**
   * Gets orders by user ID (admin only)
   * @param userId User ID
   * @returns Promise containing array of order DTOs
   */
  static async getOrdersByUser(userId: string): Promise<OrderResponseDTO[]> {
    try {
      const response = await api.get<OrderResponseDTO[]>(`/api/admin/orders/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching orders by user:', error);
      throw error;
    }
  }

  /**
   * Gets orders by sales plan ID (admin only)
   * @param planId Sales plan ID
   * @returns Promise containing array of order DTOs
   */
  static async getOrdersBySalesPlan(planId: string): Promise<OrderResponseDTO[]> {
    try {
      const response = await api.get<OrderResponseDTO[]>(`/api/admin/orders/plan/${planId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching orders by sales plan:', error);
      throw error;
    }
  }

  /**
   * Gets all active orders (admin only)
   * @returns Promise containing array of order DTOs
   */
  static async getActiveOrders(): Promise<OrderResponseDTO[]> {
    try {
      const response = await api.get<OrderResponseDTO[]>('/api/admin/orders/active');
      return response.data;
    } catch (error) {
      console.error('Error fetching active orders:', error);
      throw error;
    }
  }

  /**
   * Gets all expired orders (admin only)
   * @returns Promise containing array of order DTOs
   */
  static async getExpiredOrders(): Promise<OrderResponseDTO[]> {
    try {
      const response = await api.get<OrderResponseDTO[]>('/api/admin/orders/expired');
      return response.data;
    } catch (error) {
      console.error('Error fetching expired orders:', error);
      throw error;
    }
  }

  /**
   * Creates a new order (admin only)
   * @param order Order creation data
   * @returns Promise containing created order DTO
   */
  static async createOrder(order: OrderRequestDTO): Promise<OrderResponseDTO> {
    try {
      const response = await api.post<OrderResponseDTO>('/api/admin/orders', order);
      return response.data;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

  /**
   * Updates an existing order (admin only)
   * @param id Order ID
   * @param order Order update data
   * @returns Promise containing updated order DTO
   */
  static async updateOrder(id: string, order: OrderResponseDTO): Promise<OrderResponseDTO> {
    try {
      const response = await api.put<OrderResponseDTO>(`/api/admin/orders/${id}`, order);
      return response.data;
    } catch (error) {
      console.error('Error updating order:', error);
      throw error;
    }
  }

  /**
   * Deactivates all expired orders (admin only)
   * @returns Promise containing void
   */
  static async deactivateExpiredOrders(): Promise<void> {
    try {
      await api.post('/api/admin/orders/deactivate-expired');
    } catch (error) {
      console.error('Error deactivating expired orders:', error);
      throw error;
    }
  }

  /**
   * Deletes an order (admin only)
   * @param id Order ID
   * @returns Promise containing void
   */
  static async deleteOrder(id: string): Promise<void> {
    try {
      await api.delete(`/api/admin/orders/${id}`);
    } catch (error) {
      console.error('Error deleting order:', error);
      throw error;
    }
  }
}

// Usage example:
/*
async function handleAdminOrderOperations() {
  try {
    // Get all orders
    const allOrders = await AdminOrderAPI.getAllOrders();
    console.log('All orders:', allOrders);

    // Create new order
    const newOrder: OrderRequestDTO = {
      userId: "user123",
      planId: "plan456",
      months: 12
    };
    const createdOrder = await AdminOrderAPI.createOrder(newOrder);
    console.log('Created order:', createdOrder);

    // Get orders by user
    const userOrders = await AdminOrderAPI.getOrdersByUser("user123");
    console.log('User orders:', userOrders);

    // Get orders by sales plan
    const planOrders = await AdminOrderAPI.getOrdersBySalesPlan("plan456");
    console.log('Plan orders:', planOrders);

    // Get active orders
    const activeOrders = await AdminOrderAPI.getActiveOrders();
    console.log('Active orders:', activeOrders);

    // Get expired orders
    const expiredOrders = await AdminOrderAPI.getExpiredOrders();
    console.log('Expired orders:', expiredOrders);

    // Update order
    const updatedOrder = await AdminOrderAPI.updateOrder(createdOrder.id, {
      ...createdOrder,
      active: false
    });
    console.log('Updated order:', updatedOrder);

    // Deactivate expired orders
    await AdminOrderAPI.deactivateExpiredOrders();
    console.log('Expired orders deactivated');

    // Delete order
    await AdminOrderAPI.deleteOrder(createdOrder.id);
    console.log('Order deleted successfully');
  } catch (error) {
    console.error('Admin order operation failed:', error);
  }
}
*/