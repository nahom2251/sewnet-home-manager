export type ApartmentPosition = 'front' | 'back' | 'single';
export type PaymentStatus = 'paid' | 'unpaid';
export type RentCycle = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
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
  rentStatus: PaymentStatus;
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
