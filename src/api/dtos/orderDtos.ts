// src/api/admin/dtos/orderDtos.ts
export interface OrderRequestDTO {
    userId: string;
    planId: string;
    months?: number; // Optional field
  }
  
  export interface OrderResponseDTO {
    id: string;
    salesPlanId: string;
    salesPlanName: string;
    userId: string;
    userName: string;
    purchaseDate: string; // ISO datetime string (e.g., "2025-03-25T14:30:00")
    expirationDate: string; // ISO datetime string
    active: boolean;
    price: string; // Using string to represent BigDecimal
  }