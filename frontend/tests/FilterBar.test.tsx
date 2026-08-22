import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FilterBar } from '../src/components/FilterBar';
import { FilterState } from '../src/types';

const CATEGORIES = ['All', 'Sedan', 'SUV', 'Electric', 'Sports', 'Truck'];

describe('FilterBar Component', () => {
  it('renders search input, price filters, category pills, and in-stock toggle', () => {
    const filters: FilterState = {
      search: '',
      category: 'All',
      minPrice: '',
      maxPrice: '',
      inStockOnly: false
    };

    render(
      <FilterBar
        filters={filters}
        onFilterChange={vi.fn()}
        categories={CATEGORIES}
      />
    );

    expect(screen.getByPlaceholderText(/Search by Make or Model/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Min Price/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Max Price/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /In Stock Only/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^Sedan$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^SUV$/i })).toBeInTheDocument();
  });

  it('triggers onFilterChange when search query is typed', async () => {
    const user = userEvent.setup();
    const onFilterChange = vi.fn();
    const filters: FilterState = {
      search: '',
      category: 'All',
      minPrice: '',
      maxPrice: '',
      inStockOnly: false
    };

    render(
      <FilterBar
        filters={filters}
        onFilterChange={onFilterChange}
        categories={CATEGORIES}
      />
    );

    const input = screen.getByPlaceholderText(/Search by Make or Model/i);
    await user.type(input, 'Mustang');

    expect(onFilterChange).toHaveBeenCalled();
  });

  it('triggers onFilterChange when a category pill is selected', async () => {
    const user = userEvent.setup();
    const onFilterChange = vi.fn();
    const filters: FilterState = {
      search: '',
      category: 'All',
      minPrice: '',
      maxPrice: '',
      inStockOnly: false
    };

    render(
      <FilterBar
        filters={filters}
        onFilterChange={onFilterChange}
        categories={CATEGORIES}
      />
    );

    await user.click(screen.getByRole('button', { name: /^SUV$/i }));
    expect(onFilterChange).toHaveBeenCalledWith({
      ...filters,
      category: 'SUV'
    });
  });

  it('triggers onFilterChange when In Stock Only toggle is clicked', async () => {
    const user = userEvent.setup();
    const onFilterChange = vi.fn();
    const filters: FilterState = {
      search: '',
      category: 'All',
      minPrice: '',
      maxPrice: '',
      inStockOnly: false
    };

    render(
      <FilterBar
        filters={filters}
        onFilterChange={onFilterChange}
        categories={CATEGORIES}
      />
    );

    await user.click(screen.getByRole('button', { name: /In Stock Only/i }));
    expect(onFilterChange).toHaveBeenCalledWith({
      ...filters,
      inStockOnly: true
    });
  });

  it('resets filters when Reset button is clicked', async () => {
    const user = userEvent.setup();
    const onFilterChange = vi.fn();
    const filters: FilterState = {
      search: 'Porsche',
      category: 'Sports',
      minPrice: '50000',
      maxPrice: '200000',
      inStockOnly: true
    };

    render(
      <FilterBar
        filters={filters}
        onFilterChange={onFilterChange}
        categories={CATEGORIES}
      />
    );

    const resetBtn = screen.getByRole('button', { name: /Reset/i });
    expect(resetBtn).toBeInTheDocument();

    await user.click(resetBtn);
    expect(onFilterChange).toHaveBeenCalledWith({
      search: '',
      category: 'All',
      minPrice: '',
      maxPrice: '',
      inStockOnly: false
    });
  });
});
