import React from 'react';
import { Vehicle } from '../types';
import { VehicleCard } from './VehicleCard';
import { Car } from 'lucide-react';

interface VehicleGridProps {
  vehicles: Vehicle[];
  loading: boolean;
  onPurchase: (vehicle: Vehicle) => void;
  onEdit: (vehicle: Vehicle) => void;
  onRestock: (vehicle: Vehicle) => void;
  onDelete: (vehicle: Vehicle) => void;
  purchasingId: number | null;
  onClearFilters?: () => void;
}

export const VehicleGrid: React.FC<VehicleGridProps> = ({
  vehicles,
  loading,
  onPurchase,
  onEdit,
  onRestock,
  onDelete,
  purchasingId,
  onClearFilters
}) => {
  if (loading && vehicles.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="loading-skeletons">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <div
            key={n}
            className="bg-slate-900/50 border border-slate-800/80 rounded-3xl h-96 animate-pulse p-4 flex flex-col justify-between"
          >
            <div className="h-44 bg-slate-800/60 rounded-2xl" />
            <div className="space-y-2">
              <div className="h-4 bg-slate-800/60 rounded w-3/4" />
              <div className="h-3 bg-slate-800/40 rounded w-1/2" />
            </div>
            <div className="h-10 bg-slate-800/60 rounded-2xl" />
          </div>
        ))}
      </div>
    );
  }

  if (vehicles.length === 0) {
    return (
      <div className="text-center py-20 bg-slate-900/30 border border-slate-800/60 rounded-3xl p-8 backdrop-blur-sm">
        <Car className="w-12 h-12 text-slate-600 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-white mb-1">No vehicles found</h3>
        <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
          No inventory matched your current search and filter criteria. Try adjusting your query or price range.
        </p>
        {onClearFilters && (
          <button
            onClick={onClearFilters}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md shadow-cyan-600/20"
          >
            Clear All Filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="vehicle-grid">
      {vehicles.map((vehicle) => (
        <VehicleCard
          key={vehicle.id}
          vehicle={vehicle}
          onPurchase={onPurchase}
          onEdit={onEdit}
          onRestock={onRestock}
          onDelete={onDelete}
          isPurchasing={purchasingId === vehicle.id}
        />
      ))}
    </div>
  );
};
