// src/api/dtos/salesPlanAdminDtos.ts

export interface SalesPlanAdminReturnDTO {
  id: string; // Assuming BaseResponseDTO provides this
  name: string;
  description: string;
  price: number; // Using number for BigDecimal, assuming client-side handling
  type: PlanType;
  resources: string[];
  membershipEvents: SalesPlanAdminMembershipEventReturnDTO[];
}

export interface SalesPlanAdminMembershipEventReturnDTO {
  id: string; // Assuming BaseResponseDTO provides this
  customerId: string;
  salesPlanId: string;
  status: SalesPlanMembershipType;
}

export enum PlanType {
  // Assuming possible values based on common use; adjust as needed
  BASIC = 'BASIC',
  PREMIUM = 'PREMIUM',
  // Add other plan types as defined in the backend PlanType enum
}


export interface SalesPlanAdminCreateDTO {
  name: string;
  description: string;
  price: number; 
  type: PlanType;
  resources: string[];
}

export enum SalesPlanMembershipType {
  ACTIVE = 'ACTIVE',
  NOT_ACTIVE = 'NOT_ACTIVE',
}

export interface SalesPlanAdminMembershipEventCreateDTO {
  customerId: string;
  salesPlanId: string;
  status: SalesPlanMembershipType;
}