import axios, { AxiosError } from 'axios';
import {
  User,
  AuthResponse,
  Vehicle,
  VehicleCreateInput,
  VehicleUpdateInput,
  PurchaseResponse,
  RestockResponse
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('apex_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ detail?: string | Array<{ msg: string }> }>) => {
    let errorMessage = 'An unexpected error occurred';
    if (error.response?.data) {
      const detail = error.response.data.detail;
      if (typeof detail === 'string') {
        errorMessage = detail;
      } else if (Array.isArray(detail)) {
        errorMessage = detail.map((d) => d.msg).join(', ');
      }
    } else if (error.message) {
      errorMessage = error.message;
    }
    return Promise.reject(new Error(errorMessage));
  }
);

export const api = {
  auth: {
    async register(data: { name: string; email: string; password: string; role?: 'USER' | 'ADMIN' }): Promise<AuthResponse> {
      const res = await apiClient.post<AuthResponse>('/auth/register', data);
      return res.data;
    },

    async login(data: { email: string; password: string }): Promise<AuthResponse> {
      const res = await apiClient.post<AuthResponse>('/auth/login', data);
      return res.data;
    },

    async getProfile(): Promise<User> {
      const res = await apiClient.get<User>('/auth/me');
      return res.data;
    }
  },

  vehicles: {
    async getAll(): Promise<Vehicle[]> {
      const res = await apiClient.get<Vehicle[]>('/vehicles');
      return res.data;
    },

    async search(params: {
      make?: string;
      model?: string;
      category?: string;
      min_price?: number;
      max_price?: number;
      in_stock_only?: boolean;
    }): Promise<Vehicle[]> {
      const cleanParams: Record<string, string | number | boolean> = {};
      if (params.make && params.make.trim()) cleanParams.make = params.make.trim();
      if (params.model && params.model.trim()) cleanParams.model = params.model.trim();
      if (params.category && params.category !== 'All' && params.category.trim()) cleanParams.category = params.category.trim();
      if (params.min_price !== undefined && !isNaN(params.min_price)) cleanParams.min_price = params.min_price;
      if (params.max_price !== undefined && !isNaN(params.max_price)) cleanParams.max_price = params.max_price;

      const res = await apiClient.get<Vehicle[]>('/vehicles/search', { params: cleanParams });
      return res.data;
    },

    async getById(id: number): Promise<Vehicle> {
      const res = await apiClient.get<Vehicle>(`/vehicles/${id}`);
      return res.data;
    },

    async create(data: VehicleCreateInput): Promise<Vehicle> {
      const res = await apiClient.post<Vehicle>('/vehicles', data);
      return res.data;
    },

    async update(id: number, data: VehicleUpdateInput): Promise<Vehicle> {
      const res = await apiClient.put<Vehicle>(`/vehicles/${id}`, data);
      return res.data;
    },

    async delete(id: number): Promise<{ message: string }> {
      const res = await apiClient.delete<{ message: string }>(`/vehicles/${id}`);
      return res.data;
    },

    async purchase(id: number): Promise<PurchaseResponse> {
      const res = await apiClient.post<PurchaseResponse>(`/vehicles/${id}/purchase`);
      return res.data;
    },

    async restock(id: number, quantity: number): Promise<RestockResponse> {
      const res = await apiClient.post<RestockResponse>(`/vehicles/${id}/restock`, { quantity });
      return res.data;
    }
  }
};
