export type UserRole = 'USER' | 'ADMIN';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  created_at: string;
  updated_at?: string | null;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface Vehicle {
  id: number;
  make: string;
  model: string;
  category: string;
  price: number;
  quantity: number;
  year?: number;
  vin?: string;
  imageUrl?: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface VehicleCreateInput {
  make: string;
  model: string;
  category: string;
  price: number;
  quantity: number;
  year?: number;
  vin?: string;
  imageUrl?: string;
  description?: string;
}

export interface VehicleUpdateInput {
  make?: string;
  model?: string;
  category?: string;
  price?: number;
  quantity?: number;
  year?: number;
  vin?: string;
  imageUrl?: string;
  description?: string;
}

export interface PurchaseResponse {
  message: string;
  purchase_id: number;
  quantity: number;
  unit_price: number;
  total_price: number;
  purchased_at: string;
  vehicle: Vehicle;
}

export interface RestockResponse {
  message: string;
  added_quantity: number;
  vehicle: Vehicle;
}

export interface FilterState {
  search: string;
  category: string;
  min_price?: string;
  max_price?: string;
  minPrice?: string;
  maxPrice?: string;
  inStockOnly: boolean;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}
