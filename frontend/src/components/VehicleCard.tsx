import React from 'react';
import { ShoppingCart, Edit3, Trash2, Plus, Sparkles, Check, AlertOctagon } from 'lucide-react';
import { Vehicle } from '../types';
import { useAuth } from '../context/AuthContext';

interface VehicleCardProps {
  vehicle: Vehicle;
  onPurchase: (vehicle: Vehicle) => void;
  onEdit: (vehicle: Vehicle) => void;
  onRestock: (vehicle: Vehicle) => void;
  onDelete: (vehicle: Vehicle) => void;
  isPurchasing: boolean;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({
  vehicle,
  onPurchase,
  onEdit,
  onRestock,
  onDelete,
  isPurchasing
}) => {
  const { isAuthenticated, isAdmin } = useAuth();
  const isOutOfStock = vehicle.quantity === 0;
  const isLowStock = vehicle.quantity > 0 && vehicle.quantity <= 2;

  const fallbackImage = 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80';

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className={`group relative bg-slate-900/90 border rounded-3xl overflow-hidden backdrop-blur-md transition-all duration-300 hover:shadow-2xl hover:shadow-sky-500/10 flex flex-col justify-between ${
      isOutOfStock ? 'border-slate-800/60 opacity-80' : 'border-slate-800 hover:border-slate-700'
    }`}>
      {/* Top Media & Badges */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
        <img
          src={vehicle.imageUrl || fallbackImage}
          alt={`${vehicle.make} ${vehicle.model}`}
          onError={(e) => {
            (e.target as HTMLImageElement).src = fallbackImage;
          }}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/30" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-slate-900/80 backdrop-blur-md text-slate-200 border border-slate-700/60">
            {vehicle.category}
          </span>
          <span className="px-2 py-1 rounded-full text-[11px] font-semibold bg-sky-950/80 backdrop-blur-md text-sky-300 border border-sky-500/30">
            {vehicle.year}
          </span>
        </div>

        {/* Stock Status Badge */}
        <div className="absolute top-3 right-3">
          {isOutOfStock ? (
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-rose-950/90 border border-rose-500/40 text-rose-300 backdrop-blur-md">
              <AlertOctagon className="w-3 h-3" /> Out of Stock
            </span>
          ) : isLowStock ? (
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-950/90 border border-amber-500/40 text-amber-300 backdrop-blur-md animate-pulse">
              <Sparkles className="w-3 h-3" /> Only {vehicle.quantity} Left
            </span>
          ) : (
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-950/90 border border-emerald-500/40 text-emerald-300 backdrop-blur-md">
              <Check className="w-3 h-3" /> {vehicle.quantity} In Stock
            </span>
          )}
        </div>

        {/* Price overlay on image */}
        <div className="absolute bottom-3 left-3">
          <p className="text-2xl font-black text-white drop-shadow-md tracking-tight">
            {formatPrice(vehicle.price)}
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="mb-2">
            <h3 className="text-lg font-bold text-white group-hover:text-sky-400 transition-colors">
              {vehicle.make} <span className="font-medium text-slate-200">{vehicle.model}</span>
            </h3>
            {vehicle.vin && (
              <p className="text-[11px] font-mono text-slate-500 mt-0.5">
                VIN: {vehicle.vin}
              </p>
            )}
          </div>

          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
            {vehicle.description || 'Premium engineered vehicle with advanced safety, luxury interior, and high-performance powertrain.'}
          </p>
        </div>

        {/* Actions & Inventory */}
        <div className="pt-3 border-t border-slate-800/80 flex flex-col gap-3">
          {/* Purchase Button */}
          <button
            onClick={() => onPurchase(vehicle)}
            disabled={isOutOfStock || isPurchasing}
            className={`w-full py-3 px-4 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all duration-200 shadow-md ${
              isOutOfStock
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
                : 'bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white shadow-sky-500/20 active:scale-95'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>
              {isOutOfStock
                ? 'Out of Stock'
                : isPurchasing
                ? 'Processing...'
                : isAuthenticated
                ? 'Purchase Vehicle'
                : 'Sign In to Purchase'}
            </span>
          </button>

          {/* Admin Management Toolbar */}
          {isAdmin && (
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/60">
              <button
                onClick={() => onRestock(vehicle)}
                title="Restock vehicle inventory"
                className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-xl text-[11px] font-semibold bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-500/30 text-emerald-300 transition-all"
              >
                <Plus className="w-3.5 h-3.5" /> Restock
              </button>
              <button
                onClick={() => onEdit(vehicle)}
                title="Edit vehicle details"
                className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-xl text-[11px] font-semibold bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-all"
              >
                <Edit3 className="w-3.5 h-3.5" /> Edit
              </button>
              <button
                onClick={() => onDelete(vehicle)}
                title="Delete vehicle from inventory"
                className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-xl text-[11px] font-semibold bg-rose-950/60 hover:bg-rose-900/80 border border-rose-500/30 text-rose-300 transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
