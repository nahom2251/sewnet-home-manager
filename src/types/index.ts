export type ApartmentPosition = 'front' | 'back' | 'single';
export type PaymentStatus = 'paid' | 'unpaid';
export type RentCycle = 'monthly' | '3months' | '6months';
export type Language = 'en' | 'am';
export type BillType = 'rent' | 'water' | 'electricity';

export interface Apartment {
  id: string;
  floor: number;
  position: ApartmentPosition;
  tenantId?: string;
  status: 'occupied' | 'vacant';
}

export interface Tenant {
  id: string;
  name: string;
  phone: string;
  moveInDate: string;
  apartmentId: string;
  rentAmount: number;
  rentCycle: RentCycle;
  nextRentDue: string;
}

export interface Payment {
  id: string;
  apartmentId: string;
  tenantId: string;
  type: BillType;
  amount: number;
  date: string;
  month: string;
  status: PaymentStatus;
  details?: ElectricityDetails | WaterDetails | RentDetails;
}

export interface ElectricityDetails {
  kwhUsed: number;
  ratePerKwh: number;
  baseCost: number;
  serviceFee: number;
  tvTax: number;
  subtotal: number;
  taxAmount: number;
  total: number;
}

export interface WaterDetails {
  amount: number;
}

export interface RentDetails {
  cycle: RentCycle;
  period: string;
}
