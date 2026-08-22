import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { VehicleCard } from '../src/components/VehicleCard';
import { AuthProvider } from '../src/context/AuthContext';
import { api } from '../src/api/client';
import { Vehicle } from '../src/types';

vi.mock('../src/api/client', () => ({
  api: {
    auth: {
      login: vi.fn(),
      getProfile: vi.fn()
    }
  }
}));

const mockVehicle: Vehicle = {
  id: 1,
  make: 'Toyota',
  model: 'Camry Hybrid',
  category: 'Sedan',
  price: 28500,
  quantity: 4,
  year: 2024,
  vin: '4T1B11HK5JU123456',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

const mockSoldOutVehicle: Vehicle = {
  id: 2,
  make: 'Porsche',
  model: '911 GT3',
  category: 'Sports',
  price: 182900,
  quantity: 0,
  year: 2024,
  vin: 'WP0AF2A97RS123456',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

describe('VehicleCard Component', () => {
  const onPurchase = vi.fn();
  const onEdit = vi.fn();
  const onRestock = vi.fn();
  const onDelete = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('renders vehicle details correctly (make, model, price, stock status)', () => {
    render(
      <AuthProvider>
        <VehicleCard
          vehicle={mockVehicle}
          onPurchase={onPurchase}
          onEdit={onEdit}
          onRestock={onRestock}
          onDelete={onDelete}
          isPurchasing={false}
        />
      </AuthProvider>
    );

    expect(screen.getByText(/Toyota/i)).toBeInTheDocument();
    expect(screen.getByText(/Camry Hybrid/i)).toBeInTheDocument();
    expect(screen.getByText(/\$28,500/i)).toBeInTheDocument();
    expect(screen.getByText(/4 In Stock/i)).toBeInTheDocument();
    expect(screen.getByText(/Sedan/i)).toBeInTheDocument();
  });

  it('allows purchase when vehicle is in stock and invokes onPurchase callback', async () => {
    const user = userEvent.setup();
    render(
      <AuthProvider>
        <VehicleCard
          vehicle={mockVehicle}
          onPurchase={onPurchase}
          onEdit={onEdit}
          onRestock={onRestock}
          onDelete={onDelete}
          isPurchasing={false}
        />
      </AuthProvider>
    );

    const purchaseBtn = screen.getByRole('button', { name: /Purchase Vehicle|Sign In to Purchase/i });
    expect(purchaseBtn).not.toBeDisabled();

    await user.click(purchaseBtn);
    expect(onPurchase).toHaveBeenCalledWith(mockVehicle);
  });

  it('disables purchase button and displays Out of Stock when quantity is 0', () => {
    render(
      <AuthProvider>
        <VehicleCard
          vehicle={mockSoldOutVehicle}
          onPurchase={onPurchase}
          onEdit={onEdit}
          onRestock={onRestock}
          onDelete={onDelete}
          isPurchasing={false}
        />
      </AuthProvider>
    );

    const outOfStockElements = screen.getAllByText(/Out of Stock/i);
    expect(outOfStockElements.length).toBeGreaterThan(0);
    const purchaseBtn = screen.getByRole('button', { name: /Out of Stock/i });
    expect(purchaseBtn).toBeDisabled();
  });

  it('shows admin action buttons (Restock, Edit, Delete) when authenticated as ADMIN', async () => {
    const adminUser = {
      id: 99,
      name: 'Admin User',
      email: 'admin@dealership.com',
      role: 'ADMIN',
      created_at: new Date().toISOString()
    };
    localStorage.setItem('apex_user', JSON.stringify(adminUser));
    localStorage.setItem('apex_token', 'admin-token');
    (api.auth.getProfile as any).mockResolvedValue(adminUser);

    const user = userEvent.setup();
    render(
      <AuthProvider>
        <VehicleCard
          vehicle={mockVehicle}
          onPurchase={onPurchase}
          onEdit={onEdit}
          onRestock={onRestock}
          onDelete={onDelete}
          isPurchasing={false}
        />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Restock/i })).toBeInTheDocument();
    });

    const restockBtn = screen.getByRole('button', { name: /Restock/i });
    const editBtn = screen.getByRole('button', { name: /Edit/i });
    const deleteBtn = screen.getByRole('button', { name: /Delete/i });

    await user.click(restockBtn);
    expect(onRestock).toHaveBeenCalledWith(mockVehicle);

    await user.click(editBtn);
    expect(onEdit).toHaveBeenCalledWith(mockVehicle);

    await user.click(deleteBtn);
    expect(onDelete).toHaveBeenCalledWith(mockVehicle);
  });

  it('hides admin action buttons for regular buyers/unauthenticated users', () => {
    render(
      <AuthProvider>
        <VehicleCard
          vehicle={mockVehicle}
          onPurchase={onPurchase}
          onEdit={onEdit}
          onRestock={onRestock}
          onDelete={onDelete}
          isPurchasing={false}
        />
      </AuthProvider>
    );

    expect(screen.queryByRole('button', { name: /Restock/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Edit/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Delete/i })).not.toBeInTheDocument();
  });
});
