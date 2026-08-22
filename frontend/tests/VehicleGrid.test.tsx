import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { VehicleGrid } from '../src/components/VehicleGrid';
import { AuthProvider } from '../src/context/AuthContext';
import { Vehicle } from '../src/types';

const mockVehicles: Vehicle[] = [
  {
    id: 1,
    make: 'Tesla',
    model: 'Model 3 Performance',
    category: 'Electric',
    price: 54990,
    quantity: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 2,
    make: 'Ford',
    model: 'Mustang GT',
    category: 'Sports',
    price: 43000,
    quantity: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

describe('VehicleGrid Component', () => {
  it('renders loading skeleton elements when loading with empty vehicles array', () => {
    render(
      <AuthProvider>
        <VehicleGrid
          vehicles={[]}
          loading={true}
          onPurchase={vi.fn()}
          onEdit={vi.fn()}
          onRestock={vi.fn()}
          onDelete={vi.fn()}
          purchasingId={null}
        />
      </AuthProvider>
    );

    expect(screen.getByTestId('loading-skeletons')).toBeInTheDocument();
  });

  it('renders empty state message when no vehicles are found', () => {
    const onClear = vi.fn();
    render(
      <AuthProvider>
        <VehicleGrid
          vehicles={[]}
          loading={false}
          onPurchase={vi.fn()}
          onEdit={vi.fn()}
          onRestock={vi.fn()}
          onDelete={vi.fn()}
          purchasingId={null}
          onClearFilters={onClear}
        />
      </AuthProvider>
    );

    expect(screen.getByText(/No vehicles found/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Clear All Filters/i })).toBeInTheDocument();
  });

  it('renders list of vehicle cards when vehicles are provided', () => {
    render(
      <AuthProvider>
        <VehicleGrid
          vehicles={mockVehicles}
          loading={false}
          onPurchase={vi.fn()}
          onEdit={vi.fn()}
          onRestock={vi.fn()}
          onDelete={vi.fn()}
          purchasingId={null}
        />
      </AuthProvider>
    );

    expect(screen.getByText(/Tesla/i)).toBeInTheDocument();
    expect(screen.getByText(/Model 3 Performance/i)).toBeInTheDocument();
    expect(screen.getByText(/Ford/i)).toBeInTheDocument();
    expect(screen.getByText(/Mustang GT/i)).toBeInTheDocument();
  });
});
