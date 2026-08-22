import React from 'react';
import { Search, SlidersHorizontal, RotateCcw, CheckSquare, Square } from 'lucide-react';
import { FilterState } from '../types';

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  categories: string[];
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  categories
}) => {
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, search: e.target.value });
  };

  const handleCategoryClick = (category: string) => {
    onFilterChange({ ...filters, category });
  };

  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, minPrice: e.target.value });
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, maxPrice: e.target.value });
  };

  const toggleInStock = () => {
    onFilterChange({ ...filters, inStockOnly: !filters.inStockOnly });
  };

  const resetFilters = () => {
    onFilterChange({
      search: '',
      category: 'All',
      minPrice: '',
      maxPrice: '',
      inStockOnly: false
    });
  };

  const hasActiveFilters =
    filters.search !== '' ||
    filters.category !== 'All' ||
    filters.minPrice !== '' ||
    filters.maxPrice !== '' ||
    filters.inStockOnly;

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 sm:p-6 mb-8 backdrop-blur-md shadow-xl shadow-black/40">
      {/* Top row: Search input + Price ranges + Reset button */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={filters.search}
            onChange={handleTextChange}
            placeholder="Search by Make or Model (e.g. Porsche, Tesla, BMW, RAV4)..."
            className="w-full bg-slate-950/80 border border-slate-700/80 rounded-2xl pl-12 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition-all"
          />
        </div>

        {/* Price filter inputs */}
        <div className="flex items-center gap-2">
          <div className="relative w-28 sm:w-32">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 font-semibold">$</span>
            <input
              type="number"
              value={filters.minPrice}
              onChange={handleMinPriceChange}
              placeholder="Min Price"
              className="w-full bg-slate-950/80 border border-slate-700/80 rounded-2xl pl-7 pr-3 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-all"
            />
          </div>
          <span className="text-slate-500 text-xs font-bold">-</span>
          <div className="relative w-28 sm:w-32">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 font-semibold">$</span>
            <input
              type="number"
              value={filters.maxPrice}
              onChange={handleMaxPriceChange}
              placeholder="Max Price"
              className="w-full bg-slate-950/80 border border-slate-700/80 rounded-2xl pl-7 pr-3 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-all"
            />
          </div>
        </div>

        {/* In-Stock Toggle & Reset */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleInStock}
            className={`flex items-center gap-2 px-4 py-3 rounded-2xl text-xs font-semibold border transition-all select-none ${
              filters.inStockOnly
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-slate-950/80 border-slate-700/80 text-slate-400 hover:text-slate-200'
            }`}
          >
            {filters.inStockOnly ? (
              <CheckSquare className="w-4 h-4 text-emerald-400" />
            ) : (
              <Square className="w-4 h-4 text-slate-500" />
            )}
            <span>In Stock Only</span>
          </button>

          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              title="Reset all filters"
              className="flex items-center gap-1.5 px-3 py-3 rounded-2xl text-xs font-medium text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Category Pills */}
      <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mr-1 shrink-0 flex items-center gap-1">
          <SlidersHorizontal className="w-3 h-3" /> Category:
        </span>
        {categories.map((cat) => {
          const isSelected = filters.category === cat;
          return (
            <button
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                isSelected
                  ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/25 scale-105'
                  : 'bg-slate-950/60 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
};
