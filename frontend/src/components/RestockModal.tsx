import React, { useState } from 'react';
import { X, PackagePlus, Plus } from 'lucide-react';
import { Vehicle } from '../types';

interface RestockModalProps {
  isOpen: boolean;
  vehicle: Vehicle | null;
  onClose: () => void;
  onRestock: (id: number, quantity: number) => Promise<void>;
}

export const RestockModal: React.FC<RestockModalProps> = ({
  isOpen,
  vehicle,
  onClose,
  onRestock
}) => {
  const [quantity, setQuantity] = useState('5');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !vehicle) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const qty = parseInt(quantity, 10);
    if (isNaN(qty) || qty <= 0) {
      setError('Please enter a restock quantity greater than 0');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await onRestock(vehicle.id, qty);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Restock failed');
    } finally {
      setLoading(false);
    }
  };

  const setPreset = (qty: number) => {
    setQuantity(qty.toString());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-emerald-950/30">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
            <PackagePlus className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Restock Inventory</h2>
            <p className="text-xs text-slate-400">
              {vehicle.make} {vehicle.model}
            </p>
          </div>
        </div>

        <div className="mb-4 p-3 bg-slate-950/80 rounded-2xl border border-slate-800 flex justify-between items-center text-xs">
          <span className="text-slate-400">Current In-Stock Quantity:</span>
          <span className="font-bold text-white text-sm">{vehicle.quantity} units</span>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-950/80 border border-rose-500/40 rounded-xl text-xs text-rose-300 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Units to Add to Stock
            </label>
            <input
              type="number"
              min="1"
              required
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Quick presets */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-500 font-medium">Presets:</span>
            {[1, 3, 5, 10, 20].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => setPreset(num)}
                className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-950 border border-slate-800 text-slate-300 hover:text-white hover:border-emerald-500/50 transition-all"
              >
                +{num}
              </button>
            ))}
          </div>

          <div className="pt-3 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-700 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-1.5 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-600/25 transition-all disabled:opacity-50 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              {loading ? 'Restocking...' : `Add +${quantity || 0} Units`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
