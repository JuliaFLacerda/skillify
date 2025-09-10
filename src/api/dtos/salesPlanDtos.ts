// src/api/admin/dtos/salesPlanDtos.ts

export enum PlanType {
  MENSAL = "MENSAL",
  ANUAL = "ANUAL"
}
  
  export interface SalesPlanCreateDTO {
    name: string;
    description: string;
    price: string; // Using string to represent BigDecimal
    type: PlanType;
    resources: string[];
  }
  
  export interface SalesPlanResponseDTO {
    id: string; // Assuming BaseResponseDTO provides this
    name: string;
    description: string;
    price: string; // Using string to represent BigDecimal
    type: PlanType;
    resources: string[];
  }