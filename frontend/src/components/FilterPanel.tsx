import React from 'react';
import { FilterState } from '../types';
import { Filter, RotateCcw, DollarSign } from 'lucide-react';

const CATEGORIES = ['All', 'Sedan', 'SUV', 'Electric', 'Sports', 'Truck', 'Luxury'];

interface FilterPanelProps {
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  onReset: () => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({ filters, onFilterChange, onReset }) => {
  const handleCategorySelect = (category: string) => {
    onFilterChange({ ...filters, category });
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 backdrop-blur-sm space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2 text-white font-bold text-sm">
          <Filter className="w-4 h-4 text-cyan-400" />
          <span>Filter Inventory</span>
        </div>
        <button
          onClick={onReset}
          className="text-xs text-slate-400 hover:text-cyan-400 transition-colors flex items-center gap-1 font-medium"
        >
          <RotateCcw className="w-3 h-3" />
          Reset Filters
        </button>
      </div>

      {/* Categories */}
      <div>
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
          Vehicle Category
        </label>
        <div className="flex flex-wrap gap-1.5">
          {CATEGORIES.map((cat) => {
            const isSelected = filters.category === cat;
            return (
              <button
                key={cat}
                onClick={() => handleCategorySelect(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                    : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
            Min Price ($)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-500">
              <DollarSign className="w-3.5 h-3.5" />
            </div>
            <input
              type="number"
              min="0"
              placeholder="0"
              value={filters.min_price}
              onChange={(e) => onFilterChange({ ...filters, min_price: e.target.value })}
              className="w-full pl-7 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
            Max Price ($)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-500">
              <DollarSign className="w-3.5 h-3.5" />
            </div>
            <input
              type="number"
              min="0"
              placeholder="Any"
              value={filters.max_price}
              onChange={(e) => onFilterChange({ ...filters, max_price: e.target.value })}
              className="w-full pl-7 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-all"
            />
          </div>
        </div>
      </div>

      {/* In-Stock Only Toggle */}
      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
        <label htmlFor="inStockToggle" className="text-xs font-semibold text-slate-300 cursor-pointer">
          Show In-Stock Only
        </label>
        <input
          id="inStockToggle"
          type="checkbox"
          checked={filters.inStockOnly}
          onChange={(e) => onFilterChange({ ...filters, inStockOnly: e.target.checked })}
          className="w-4 h-4 rounded bg-slate-950 border-slate-700 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-slate-900 cursor-pointer accent-cyan-500"
        />
      </div>
    </div>
  );
};
