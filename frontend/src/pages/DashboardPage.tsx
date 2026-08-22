import React, { useState, useEffect, useCallback } from 'react';
import { HeroStats } from '../components/HeroStats';
import { FilterBar } from '../components/FilterBar';
import { VehicleGrid } from '../components/VehicleGrid';
import { VehicleModal } from '../components/VehicleModal';
import { RestockModal } from '../components/RestockModal';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { ErrorMessage } from '../components/ErrorMessage';
import { Toast } from '../components/Toast';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import { Vehicle, FilterState, ToastMessage, VehicleCreateInput, VehicleUpdateInput } from '../types';
import { RefreshCw, ShoppingBag, Shield, Plus } from 'lucide-react';

const CATEGORIES = ['All', 'Sedan', 'SUV', 'Electric', 'Sports', 'Truck', 'Coupe', 'Luxury'];

export const DashboardPage: React.FC = () => {
  const { isAuthenticated, isAdmin } = useAuth();

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [purchasingId, setPurchasingId] = useState<number | null>(null);

  // Modals state
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [isRestockOpen, setIsRestockOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [restockingVehicle, setRestockingVehicle] = useState<Vehicle | null>(null);
  const [deletingVehicle, setDeletingVehicle] = useState<Vehicle | null>(null);

  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    category: 'All',
    minPrice: '',
    maxPrice: '',
    inStockOnly: false
  });

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

  // Fetch Vehicles
  const fetchVehicles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const hasFilters =
        filters.search.trim() !== '' ||
        filters.category !== 'All' ||
        (filters.minPrice !== undefined && filters.minPrice !== '') ||
        (filters.maxPrice !== undefined && filters.maxPrice !== '') ||
        filters.inStockOnly;

      if (hasFilters) {
        const minVal = filters.minPrice ? parseFloat(filters.minPrice) : undefined;
        const maxVal = filters.maxPrice ? parseFloat(filters.maxPrice) : undefined;

        const res = await api.vehicles.search({
          make: filters.search.trim() || undefined,
          model: filters.search.trim() || undefined,
          category: filters.category,
          min_price: minVal,
          max_price: maxVal,
          in_stock_only: filters.inStockOnly
        });

        let filtered = res;
        if (filters.inStockOnly) {
          filtered = filtered.filter((v) => v.quantity > 0);
        }
        setVehicles(filtered);
      } else {
        const res = await api.vehicles.getAll();
        setVehicles(res);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load vehicles from server');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  // Handler: Purchase
  const handlePurchase = async (vehicle: Vehicle) => {
    if (!isAuthenticated) {
      addToast('info', 'Please sign in or register to complete your purchase');
      return;
    }

    if (vehicle.quantity <= 0) {
      addToast('error', 'Sorry, this vehicle is currently out of stock!');
      return;
    }

    setPurchasingId(vehicle.id);
    try {
      const res = await api.vehicles.purchase(vehicle.id);
      addToast('success', `🎉 Purchased ${vehicle.make} ${vehicle.model}! (Audit ID: #${res.purchase_id})`);
      setVehicles((prev) => prev.map((v) => (v.id === vehicle.id ? res.vehicle : v)));
    } catch (err: any) {
      addToast('error', err.message || 'Purchase failed');
    } finally {
      setPurchasingId(null);
    }
  };

  // Handler: Save Vehicle (Create or Edit)
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
      addToast('success', `Updated ${res.make} ${res.model} successfully`);
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
      addToast('success', `Added ${res.make} ${res.model} to dealership inventory`);
      setVehicles((prev) => [res, ...prev]);
    }
    setIsVehicleModalOpen(false);
    setEditingVehicle(null);
  };

  // Handler: Delete Vehicle Confirmation
  const handleConfirmDelete = async () => {
    if (!deletingVehicle) return;

    try {
      await api.vehicles.delete(deletingVehicle.id);
      addToast('success', `Removed ${deletingVehicle.make} ${deletingVehicle.model} from inventory`);
      setVehicles((prev) => prev.filter((v) => v.id !== deletingVehicle.id));
    } catch (err: any) {
      addToast('error', err.message || 'Failed to delete vehicle');
    } finally {
      setDeletingVehicle(null);
    }
  };

  // Handler: Restock
  const handleRestock = async (id: number, quantity: number) => {
    const res = await api.vehicles.restock(id, quantity);
    addToast('success', `Restocked +${quantity} units for ${res.vehicle.make} ${res.vehicle.model}`);
    setVehicles((prev) => prev.map((v) => (v.id === id ? res.vehicle : v)));
  };

  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Toast notifications */}
      <Toast toasts={toasts} onDismiss={removeToast} />

      {/* Admin Notice Banner */}
      {isAdmin && (
        <div className="mb-6 p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 flex items-center justify-between backdrop-blur-sm shadow-lg shadow-indigo-950/20">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-indigo-400 shrink-0" />
            <div>
              <p className="text-xs font-bold text-white">Staff Admin Mode Active</p>
              <p className="text-[11px] text-slate-400">
                You have administrative permissions to create, edit, restock, and delete vehicles.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setEditingVehicle(null);
              setIsVehicleModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-md transition-all active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Vehicle</span>
          </button>
        </div>
      )}

      {/* Metrics Header */}
      <HeroStats vehicles={vehicles} />

      {/* Search & Filter Bar */}
      <FilterBar
        filters={filters}
        onFilterChange={setFilters}
        categories={CATEGORIES}
      />

      {/* Inventory Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-cyan-400" />
          <h2 className="text-xl font-extrabold text-white tracking-tight">Dealership Catalog</h2>
          <span className="ml-2 px-2.5 py-0.5 rounded-full bg-slate-800 text-xs font-bold text-slate-300 border border-slate-700">
            {vehicles.length} {vehicles.length === 1 ? 'vehicle' : 'vehicles'}
          </span>
        </div>

        <button
          onClick={() => fetchVehicles()}
          disabled={loading}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-xl hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-all"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Error state */}
      {error && (
        <ErrorMessage
          message={error}
          onRetry={() => fetchVehicles()}
        />
      )}

      {/* Vehicle Grid */}
      <VehicleGrid
        vehicles={vehicles}
        loading={loading}
        onPurchase={handlePurchase}
        onEdit={(v) => {
          setEditingVehicle(v);
          setIsVehicleModalOpen(true);
        }}
        onRestock={(v) => {
          setRestockingVehicle(v);
          setIsRestockOpen(true);
        }}
        onDelete={(v) => setDeletingVehicle(v)}
        purchasingId={purchasingId}
        onClearFilters={() =>
          setFilters({
            search: '',
            category: 'All',
            minPrice: '',
            maxPrice: '',
            inStockOnly: false
          })
        }
      />

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
        title="Confirm Vehicle Deletion"
        message={`Are you sure you want to permanently delete the ${deletingVehicle?.make} ${deletingVehicle?.model} from inventory? This action is immediate and cannot be undone.`}
        confirmLabel="Delete Vehicle"
        cancelLabel="Cancel"
        isDestructive={true}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingVehicle(null)}
      />
    </div>
  );
};
