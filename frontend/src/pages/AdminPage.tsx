import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import { Vehicle, ToastMessage, VehicleCreateInput, VehicleUpdateInput } from '../types';
import { VehicleModal } from '../components/VehicleModal';
import { RestockModal } from '../components/RestockModal';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { Toast } from '../components/Toast';
import { ErrorMessage } from '../components/ErrorMessage';
import {
  ShieldAlert,
  Plus,
  Edit3,
  Trash2,
  PackagePlus,
  RefreshCw,
  Search,
  DollarSign,
  Car,
  Layers,
  AlertTriangle
} from 'lucide-react';
import { Link } from 'react-router-dom';

const CATEGORIES = ['All', 'Sedan', 'SUV', 'Electric', 'Sports', 'Truck', 'Coupe', 'Luxury'];

export const AdminPage: React.FC = () => {
  const { isAuthenticated, isAdmin, quickLogin } = useAuth();

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [isRestockOpen, setIsRestockOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [restockingVehicle, setRestockingVehicle] = useState<Vehicle | null>(null);
  const [deletingVehicle, setDeletingVehicle] = useState<Vehicle | null>(null);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'error' | 'info', message: string) => {
    const id = Date.now().toString() + Math.random().toString();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const fetchInventory = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.vehicles.getAll();
      setVehicles(res);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch inventory for administration');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      fetchInventory();
    }
  }, [isAuthenticated, isAdmin, fetchInventory]);

  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="max-w-xl mx-auto my-16 p-8 bg-slate-900 border border-slate-800 rounded-3xl text-center backdrop-blur-md shadow-2xl">
        <div className="w-16 h-16 rounded-3xl bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto mb-4 border border-rose-500/20">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Admin Access Required</h2>
        <p className="text-xs text-slate-400 max-w-md mx-auto mb-6 leading-relaxed">
          You must be logged in as an Administrator (Staff) to access inventory management controls, create or delete vehicle records, and restock units.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => quickLogin('admin')}
            className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
          >
            Switch to Admin Demo Account
          </button>
          <Link
            to="/login"
            className="w-full sm:w-auto px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl border border-slate-700 transition-all"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  // Handle Save
  const handleSaveVehicle = async (data: Partial<Vehicle>) => {
    if (editingVehicle) {
      const updateData: VehicleUpdateInput = {
        make: data.make,
        model: data.model,
        category: data.category,
        price: data.price,
        quantity: data.quantity,
        year: data.year,
        vin: data.vin,
        imageUrl: data.imageUrl,
        description: data.description
      };
      const res = await api.vehicles.update(editingVehicle.id, updateData);
      addToast('success', `Vehicle ${res.make} ${res.model} updated successfully`);
      setVehicles((prev) => prev.map((v) => (v.id === editingVehicle.id ? res : v)));
    } else {
      const createData: VehicleCreateInput = {
        make: data.make || '',
        model: data.model || '',
        category: data.category || 'Sedan',
        price: data.price || 0,
        quantity: data.quantity !== undefined ? data.quantity : 1,
        year: data.year,
        vin: data.vin,
        imageUrl: data.imageUrl,
        description: data.description
      };
      const res = await api.vehicles.create(createData);
      addToast('success', `Created vehicle ${res.make} ${res.model}`);
      setVehicles((prev) => [res, ...prev]);
    }
    setIsVehicleModalOpen(false);
    setEditingVehicle(null);
  };

  // Handle Delete
  const handleConfirmDelete = async () => {
    if (!deletingVehicle) return;
    try {
      await api.vehicles.delete(deletingVehicle.id);
      addToast('success', `Deleted ${deletingVehicle.make} ${deletingVehicle.model}`);
      setVehicles((prev) => prev.filter((v) => v.id !== deletingVehicle.id));
    } catch (err: any) {
      addToast('error', err.message || 'Failed to delete vehicle');
    } finally {
      setDeletingVehicle(null);
    }
  };

  // Handle Restock
  const handleRestock = async (id: number, quantity: number) => {
    const res = await api.vehicles.restock(id, quantity);
    addToast('success', `Restocked +${quantity} units for ${res.vehicle.make} ${res.vehicle.model}`);
    setVehicles((prev) => prev.map((v) => (v.id === id ? res.vehicle : v)));
  };

  const filteredVehicles = vehicles.filter((v) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      v.make.toLowerCase().includes(q) ||
      v.model.toLowerCase().includes(q) ||
      v.category.toLowerCase().includes(q) ||
      (v.vin && v.vin.toLowerCase().includes(q))
    );
  });

  const totalInventoryValue = vehicles.reduce((sum, v) => sum + v.price * v.quantity, 0);
  const totalStockUnits = vehicles.reduce((sum, v) => sum + v.quantity, 0);
  const outOfStockCount = vehicles.filter((v) => v.quantity === 0).length;

  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Toast */}
      <Toast toasts={toasts} onDismiss={removeToast} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Admin Inventory Console</h1>
          <p className="text-xs text-slate-400 mt-1">Manage catalog listings, restock counts, and vehicle specifications</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchInventory()}
            disabled={loading}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={() => {
              setEditingVehicle(null);
              setIsVehicleModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-cyan-500/20 hover:opacity-95 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>New Vehicle</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Total Value</p>
            <p className="text-2xl font-black text-white mt-1">
              {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(
                totalInventoryValue
              )}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Total Units</p>
            <p className="text-2xl font-black text-emerald-400 mt-1">{totalStockUnits} Units</p>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Restock Alerts</p>
            <p className="text-2xl font-black text-rose-400 mt-1">{outOfStockCount} Sold Out</p>
          </div>
          <div className="p-3 rounded-xl bg-rose-500/10 text-rose-400">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="mb-6 relative max-w-md">
        <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter by make, model, category, or VIN..."
          className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-all"
        />
      </div>

      {error && <ErrorMessage message={error} onRetry={fetchInventory} />}

      {/* Inventory Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-5 py-4">ID</th>
                <th className="px-5 py-4">Vehicle</th>
                <th className="px-5 py-4">Category</th>
                <th className="px-5 py-4">Price</th>
                <th className="px-5 py-4">Stock</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-slate-500 animate-pulse">
                    Loading administrative inventory...
                  </td>
                </tr>
              ) : filteredVehicles.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-slate-500">
                    No vehicles found matching "{searchQuery}".
                  </td>
                </tr>
              ) : (
                filteredVehicles.map((vehicle) => {
                  const isZero = vehicle.quantity === 0;
                  return (
                    <tr key={vehicle.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-5 py-4 font-mono text-slate-500">#{vehicle.id}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 shrink-0">
                            <Car className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="font-bold text-white">
                              {vehicle.make} {vehicle.model}
                            </span>
                            {vehicle.vin && (
                              <span className="block text-[10px] font-mono text-slate-500">
                                VIN: {vehicle.vin}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-medium">
                          {vehicle.category}
                        </span>
                      </td>
                      <td className="px-5 py-4 font-bold text-white">
                        ${vehicle.price.toLocaleString()}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full font-bold text-[10px] uppercase tracking-wider ${
                            isZero
                              ? 'bg-rose-950 text-rose-300 border border-rose-500/40'
                              : vehicle.quantity <= 2
                              ? 'bg-amber-950 text-amber-300 border border-amber-500/40'
                              : 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                          }`}
                        >
                          {vehicle.quantity} Units {isZero && '(Sold Out)'}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setRestockingVehicle(vehicle);
                              setIsRestockOpen(true);
                            }}
                            title="Restock units"
                            className="p-1.5 rounded-lg bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-900 transition-all"
                          >
                            <PackagePlus className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setEditingVehicle(vehicle);
                              setIsVehicleModalOpen(true);
                            }}
                            title="Edit vehicle"
                            className="p-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700 transition-all"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeletingVehicle(vehicle)}
                            title="Delete vehicle"
                            className="p-1.5 rounded-lg bg-rose-950/80 border border-rose-500/30 text-rose-300 hover:bg-rose-900 transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <VehicleModal
        isOpen={isVehicleModalOpen}
        onClose={() => {
          setIsVehicleModalOpen(false);
          setEditingVehicle(null);
        }}
        onSave={handleSaveVehicle}
        editingVehicle={editingVehicle}
        categories={CATEGORIES}
      />

      <RestockModal
        isOpen={isRestockOpen}
        vehicle={restockingVehicle}
        onClose={() => {
          setIsRestockOpen(false);
          setRestockingVehicle(null);
        }}
        onRestock={handleRestock}
      />

      <ConfirmDialog
        isOpen={!!deletingVehicle}
        title="Delete Vehicle Record"
        message={`Are you sure you want to delete ${deletingVehicle?.make} ${deletingVehicle?.model}? This action cannot be reversed.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        isDestructive={true}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingVehicle(null)}
      />
    </div>
  );
};
