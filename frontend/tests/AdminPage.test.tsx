import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { AdminPage } from '../src/pages/AdminPage';
import { AuthProvider } from '../src/context/AuthContext';
import { api } from '../src/api/client';
import { Vehicle } from '../src/types';

vi.mock('../src/api/client', () => ({
  api: {
    auth: {
      login: vi.fn(),
      getProfile: vi.fn()
    },
    vehicles: {
      getAll: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      restock: vi.fn()
    }
  }
}));

const mockVehicles: Vehicle[] = [
  {
    id: 101,
    make: 'BMW',
    model: 'M3 Competition',
    category: 'Sports',
    price: 85000,
    quantity: 2,
    vin: 'WBA33AY08NFP12345',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 102,
    make: 'Tesla',
    model: 'Model Y Long Range',
    category: 'Electric',
    price: 49990,
    quantity: 0,
    vin: '7SAYGDEE4PF12345',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

describe('AdminPage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('renders unauthorized notice if user is not logged in as ADMIN', () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <AdminPage />
        </AuthProvider>
      </MemoryRouter>
    );

    expect(screen.getByText(/Admin Access Required/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Switch to Admin Demo Account/i })).toBeInTheDocument();
  });

  it('renders admin inventory console and table when user is authenticated as ADMIN', async () => {
    const adminUser = {
      id: 1,
      name: 'Staff Admin',
      email: 'admin@dealership.com',
      role: 'ADMIN',
      created_at: new Date().toISOString()
    };
    localStorage.setItem('apex_user', JSON.stringify(adminUser));
    localStorage.setItem('apex_token', 'admin-token');
    (api.auth.getProfile as any).mockResolvedValue(adminUser);

    (api.vehicles.getAll as any).mockResolvedValue(mockVehicles);

    render(
      <MemoryRouter>
        <AuthProvider>
          <AdminPage />
        </AuthProvider>
      </MemoryRouter>
    );

    expect(screen.getByText(/Admin Inventory Console/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/BMW M3 Competition/i)).toBeInTheDocument();
      expect(screen.getByText(/Tesla Model Y Long Range/i)).toBeInTheDocument();
      expect(screen.getByText(/1 Sold Out/i)).toBeInTheDocument();
    });
  });

  it('deletes a vehicle after confirmation dialog is confirmed', async () => {
    const adminUser = {
      id: 1,
      name: 'Staff Admin',
      email: 'admin@dealership.com',
      role: 'ADMIN',
      created_at: new Date().toISOString()
    };
    localStorage.setItem('apex_user', JSON.stringify(adminUser));
    localStorage.setItem('apex_token', 'admin-token');
    (api.auth.getProfile as any).mockResolvedValue(adminUser);

    const user = userEvent.setup();
    (api.vehicles.getAll as any).mockResolvedValue(mockVehicles);
    (api.vehicles.delete as any).mockResolvedValueOnce({ message: 'Deleted' });

    render(
      <MemoryRouter>
        <AuthProvider>
          <AdminPage />
        </AuthProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/BMW M3 Competition/i)).toBeInTheDocument();
    });

    const deleteBtns = screen.getAllByTitle(/Delete vehicle/i);
    await user.click(deleteBtns[0]);

    expect(screen.getByText(/Delete Vehicle Record/i)).toBeInTheDocument();

    const confirmBtn = screen.getByRole('button', { name: /^Delete$/i });
    await user.click(confirmBtn);

    await waitFor(() => {
      expect(api.vehicles.delete).toHaveBeenCalledWith(101);
    });
  });
});
