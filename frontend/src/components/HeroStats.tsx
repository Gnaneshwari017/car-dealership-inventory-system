import React from 'react';
import { Vehicle } from '../types';
import { Layers, CheckCircle2, AlertTriangle, XCircle, TrendingUp } from 'lucide-react';

interface HeroStatsProps {
  vehicles: Vehicle[];
}

export const HeroStats: React.FC<HeroStatsProps> = ({ vehicles }) => {
  const totalModels = vehicles.length;
  const inStockUnits = vehicles.reduce((sum, v) => sum + v.quantity, 0);
  const lowStockCount = vehicles.filter((v) => v.quantity > 0 && v.quantity <= 2).length;
  const outOfStockCount = vehicles.filter((v) => v.quantity === 0).length;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 my-6">
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 sm:p-5 backdrop-blur-sm relative overflow-hidden group hover:border-cyan-500/30 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Models</span>
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
            <Layers className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{totalModels}</span>
          <span className="text-xs text-slate-500 font-medium">Catalog listings</span>
        </div>
      </div>

      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 sm:p-5 backdrop-blur-sm relative overflow-hidden group hover:border-emerald-500/30 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Available Stock</span>
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400 tracking-tight">{inStockUnits}</span>
          <span className="text-xs text-slate-500 font-medium">Units ready for sale</span>
        </div>
      </div>

      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 sm:p-5 backdrop-blur-sm relative overflow-hidden group hover:border-amber-500/30 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Low Stock Alert</span>
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold text-amber-400 tracking-tight">{lowStockCount}</span>
          <span className="text-xs text-slate-500 font-medium">&le; 2 units left</span>
        </div>
      </div>

      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 sm:p-5 backdrop-blur-sm relative overflow-hidden group hover:border-rose-500/30 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Sold Out</span>
          <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400">
            <XCircle className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold text-rose-400 tracking-tight">{outOfStockCount}</span>
          <span className="text-xs text-slate-500 font-medium">Requires restock</span>
        </div>
      </div>
    </div>
  );
};
