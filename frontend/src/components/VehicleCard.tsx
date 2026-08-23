import React, { useEffect, useRef, useState } from 'react';
import {
  ShoppingCart,
  Edit3,
  Trash2,
  Plus,
  Sparkles,
  Check,
  AlertOctagon,
  X,
  ZoomIn,
  ZoomOut,
  RotateCcw
} from 'lucide-react';
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
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const dragStart = useRef({ x: 0, y: 0 });
  const lastPosition = useRef({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const didDrag = useRef(false);

  const vehicleImages: Record<string, string> = {
    toyota: '/images/cars/toyota-camry.png',
    honda: '/images/cars/honda-civic.png',
    ford: '/images/cars/ford-mustang.png',
    bmw: '/images/cars/bmw-x5.png',
    tesla: '/images/cars/tesla-model-3.png',
    hyundai: '/images/cars/hyundai-creta.png',
    porsche: '/images/cars/porsche-911.png',
    rivian: '/images/cars/rivian-r1t.png',
    'mercedes-benz': '/images/cars/mercedes-eqs.png',
    mercedes: '/images/cars/mercedes-eqs.png'
  };

  const defaultVehicleImage = '/images/cars/default-car.png';

  const getVehicleImage = (vehicle: Vehicle) => {
    const make = vehicle.make.trim().toLowerCase();

    return vehicleImages[make] || defaultVehicleImage;
  };

  const closeViewer = () => {
    setIsViewerOpen(false);
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  const updateZoom = (nextZoom: number) => {
    const boundedZoom = Math.min(3, Math.max(1, nextZoom));
    setZoom(boundedZoom);
    if (boundedZoom === 1) {
      setPosition({ x: 0, y: 0 });
    }
  };

  useEffect(() => {
    if (!isViewerOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeViewer();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isViewerOpen]);

  const handleImagePointerDown = (event: React.PointerEvent<HTMLImageElement>) => {
    if (zoom === 1) return;
    isDragging.current = true;
    didDrag.current = false;
    dragStart.current = { x: event.clientX, y: event.clientY };
    lastPosition.current = position;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handleImagePointerMove = (event: React.PointerEvent<HTMLImageElement>) => {
    if (!isDragging.current) return;
    const deltaX = event.clientX - dragStart.current.x;
    const deltaY = event.clientY - dragStart.current.y;
    if (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3) didDrag.current = true;
    setPosition({
      x: lastPosition.current.x + deltaX,
      y: lastPosition.current.y + deltaY
    });
  };

  const handleImagePointerUp = (event: React.PointerEvent<HTMLImageElement>) => {
    isDragging.current = false;
    event.currentTarget.releasePointerCapture(event.pointerId);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <>
      <div
      className={`group relative bg-slate-900/90 border rounded-3xl overflow-hidden backdrop-blur-md transition-all duration-300 hover:shadow-2xl hover:shadow-sky-500/10 flex flex-col justify-between ${
        isOutOfStock
          ? 'border-slate-800/60 opacity-80'
          : 'border-slate-800 hover:border-slate-700'
      }`}
    >
      {/* Top Media & Badges */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
        <img
          src={getVehicleImage(vehicle)}
          alt={`${vehicle.make} ${vehicle.model}`}
          onClick={() => {
            if (!didDrag.current) setIsViewerOpen(true);
            didDrag.current = false;
          }}
          onError={(e) => {
            const img = e.target as HTMLImageElement;
            img.src = defaultVehicleImage;
          }}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-zoom-in"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/30" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-slate-900/80 backdrop-blur-md text-slate-200 border border-slate-700/60">
            {vehicle.category}
          </span>

          {vehicle.year && (
            <span className="px-2 py-1 rounded-full text-[11px] font-semibold bg-sky-950/80 backdrop-blur-md text-sky-300 border border-sky-500/30">
              {vehicle.year}
            </span>
          )}
        </div>

        {/* Stock Status Badge */}
        <div className="absolute top-3 right-3">
          {isOutOfStock ? (
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-rose-950/90 border border-rose-500/40 text-rose-300 backdrop-blur-md">
              <AlertOctagon className="w-3 h-3" />
              Out of Stock
            </span>
          ) : isLowStock ? (
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-950/90 border border-amber-500/40 text-amber-300 backdrop-blur-md animate-pulse">
              <Sparkles className="w-3 h-3" />
              Only {vehicle.quantity} Left
            </span>
          ) : (
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-950/90 border border-emerald-500/30 text-emerald-300 backdrop-blur-md">
              <Check className="w-3 h-3" />
              {vehicle.quantity} In Stock
            </span>
          )}
        </div>

        {/* Price overlay */}
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
              {vehicle.make}{' '}
              <span className="font-medium text-slate-200">
                {vehicle.model}
              </span>
            </h3>

            {vehicle.vin && (
              <p className="text-[11px] font-mono text-slate-500 mt-0.5">
                VIN: {vehicle.vin}
              </p>
            )}
          </div>

          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
            {vehicle.description ||
              'Premium engineered vehicle with advanced safety, luxury interior, and high-performance powertrain.'}
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
              {/* Restock */}
              <button
                onClick={() => onRestock(vehicle)}
                title="Restock vehicle inventory"
                className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-xl text-[11px] font-semibold bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-500/30 text-emerald-300 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                Restock
              </button>

              {/* Edit */}
              <button
                onClick={() => onEdit(vehicle)}
                title="Edit vehicle details"
                className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-xl text-[11px] font-semibold bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-all"
              >
                <Edit3 className="w-3.5 h-3.5" />
                Edit
              </button>

              {/* Delete */}
              <button
                onClick={() => onDelete(vehicle)}
                title="Delete vehicle from inventory"
                className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-xl text-[11px] font-semibold bg-rose-950/60 hover:bg-rose-900/80 border border-rose-500/30 text-rose-300 transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete
              </button>
            </div>
          )}
        </div>
        </div>
      </div>

      {isViewerOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 p-4 animate-in fade-in duration-200"
          onClick={(event) => {
            if (event.target === event.currentTarget) closeViewer();
          }}
          role="dialog"
          aria-modal="true"
          aria-label={`${vehicle.make} ${vehicle.model} image viewer`}
        >
          <div className="relative flex h-full w-full max-w-6xl items-center justify-center overflow-hidden">
            <img
              src={getVehicleImage(vehicle)}
              alt={`${vehicle.make} ${vehicle.model} enlarged`}
              onError={(event) => {
                event.currentTarget.src = defaultVehicleImage;
              }}
              onPointerDown={handleImagePointerDown}
              onPointerMove={handleImagePointerMove}
              onPointerUp={handleImagePointerUp}
              onPointerCancel={handleImagePointerUp}
              onWheel={(event) => {
                event.preventDefault();
                updateZoom(zoom + (event.deltaY < 0 ? 0.25 : -0.25));
              }}
              style={{
                transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
                touchAction: zoom > 1 ? 'none' : 'pan-y'
              }}
              className={`max-h-full max-w-full select-none object-contain ${
                zoom > 1 ? 'cursor-grab active:cursor-grabbing' : 'cursor-zoom-in'
              }`}
              draggable={false}
            />

            <button
              type="button"
              onClick={closeViewer}
              aria-label="Close image viewer"
              title="Close image viewer"
              className="absolute right-2 top-2 rounded-full border border-slate-700 bg-slate-900/90 p-3 text-slate-200 transition hover:bg-slate-800 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-2xl border border-slate-700 bg-slate-900/95 p-2 shadow-2xl">
              <button
                type="button"
                onClick={() => updateZoom(zoom - 0.5)}
                aria-label="Zoom out"
                title="Zoom out"
                className="rounded-xl p-2 text-slate-200 transition hover:bg-slate-800 hover:text-white"
              >
                <ZoomOut className="h-5 w-5" />
              </button>
              <span className="min-w-12 text-center text-xs font-semibold text-slate-300">
                {Math.round(zoom * 100)}%
              </span>
              <button
                type="button"
                onClick={() => updateZoom(zoom + 0.5)}
                aria-label="Zoom in"
                title="Zoom in"
                className="rounded-xl p-2 text-slate-200 transition hover:bg-slate-800 hover:text-white"
              >
                <ZoomIn className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setZoom(1);
                  setPosition({ x: 0, y: 0 });
                }}
                aria-label="Reset image"
                title="Reset image"
                className="rounded-xl p-2 text-slate-200 transition hover:bg-slate-800 hover:text-white"
              >
                <RotateCcw className="h-5 w-5" />
              </button>
            </div>

            <p className="absolute bottom-20 left-1/2 -translate-x-1/2 whitespace-nowrap text-[11px] text-slate-400">
              Click to view • Drag to move • Scroll to zoom
            </p>
          </div>
        </div>
      )}
    </>
  );
};