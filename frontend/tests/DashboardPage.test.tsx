import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { DashboardPage } from '../src/pages/DashboardPage';
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
      search: vi.fn(),
      purchase: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      restock: vi.fn()
    }
  }
}));

const mockVehicles: Vehicle[] = [
  {
    id: 1,
    make: 'Toyota',
    model: 'RAV4 Prime',
    category: 'SUV',
    price: 43500,
    quantity: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 2,
    make: 'Tesla',
    model: 'Model S Plaid',
    category: 'Electric',
    price: 89990,
    quantity: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

describe('DashboardPage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('fetches and renders vehicles list, metrics, and filter bar', async () => {
    (api.vehicles.getAll as any).mockResolvedValueOnce(mockVehicles);

    render(
      <MemoryRouter>
        <AuthProvider>
          <DashboardPage />
        </AuthProvider>
      </MemoryRouter>
    );

    expect(screen.getByText(/Dealership Catalog/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/Toyota/i)).toBeInTheDocument();
      expect(screen.getByText(/RAV4 Prime/i)).toBeInTheDocument();
      expect(screen.getByText(/Tesla/i)).toBeInTheDocument();
      expect(screen.getByText(/Model S Plaid/i)).toBeInTheDocument();
    });
  });

  it('performs purchase and updates stock when authenticated', async () => {
    const buyerUser = {
      id: 10,
      name: 'Verified Buyer',
      email: 'buyer@dealership.com',
      role: 'USER',
      created_at: new Date().toISOString()
    };
    localStorage.setItem('apex_user', JSON.stringify(buyerUser));
    localStorage.setItem('apex_token', 'valid-jwt-token');
    (api.auth.getProfile as any).mockResolvedValue(buyerUser);

    (api.vehicles.getAll as any).mockResolvedValue(mockVehicles);
    (api.vehicles.purchase as any).mockResolvedValueOnce({
      message: 'Purchase successful',
      purchase_id: 88,
      quantity: 1,
      unit_price: 43500,
      total_price: 43500,
      purchased_at: new Date().toISOString(),
      vehicle: {
        ...mockVehicles[0],
        quantity: 2
      }
    });

    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <AuthProvider>
          <DashboardPage />
        </AuthProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/RAV4 Prime/i)).toBeInTheDocument();
    });

    await waitFor(() => {
      const purchaseButtons = screen.getAllByRole('button', { name: /Purchase Vehicle/i });
      expect(purchaseButtons.length).toBeGreaterThan(0);
    });

    const purchaseButtons = screen.getAllByRole('button', { name: /Purchase Vehicle/i });
    await user.click(purchaseButtons[0]);

    await waitFor(() => {
      expect(api.vehicles.purchase).toHaveBeenCalledWith(1);
    });
  });
});
