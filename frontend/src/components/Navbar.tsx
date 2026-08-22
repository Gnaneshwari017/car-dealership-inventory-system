import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Car, Shield, User as UserIcon, LogOut, LogIn, UserPlus, Sparkles, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, isAdmin, logout, quickLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isDashboard = location.pathname === '/' || location.pathname === '/dashboard';
  const isAdminPage = location.pathname === '/admin';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link to="/dashboard" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-emerald-400 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            <Car className="w-5 h-5 text-slate-950 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl tracking-tight text-white">APEX</span>
              <span className="font-bold text-xl text-cyan-400">MOTORS</span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium tracking-wider uppercase">Dealership Inventory</p>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          <Link
            to="/dashboard"
            className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
              isDashboard
                ? 'bg-slate-900 text-white font-semibold'
                : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 text-cyan-400" />
            Dashboard
          </Link>

          {isAdmin && (
            <Link
              to="/admin"
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                isAdminPage
                  ? 'bg-indigo-950/80 text-indigo-300 font-semibold border border-indigo-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
              }`}
            >
              <Shield className="w-4 h-4" />
              Admin Portal
            </Link>
          )}
        </nav>

        {/* Right Section: Quick Switcher & User Profile */}
        <div className="flex items-center gap-3">
          {/* Quick Demo Switchers */}
          <div className="hidden lg:flex items-center gap-1.5 bg-slate-900/90 border border-slate-800 px-2.5 py-1 rounded-full text-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-slate-400 font-medium mr-1">Demo:</span>
            <button
              onClick={() => quickLogin('buyer')}
              className="text-cyan-400 hover:text-cyan-300 font-semibold px-2 py-0.5 rounded hover:bg-cyan-950/50 transition-colors"
              title="Quick login as Customer"
            >
              Buyer
            </button>
            <span className="text-slate-600">|</span>
            <button
              onClick={() => quickLogin('admin')}
              className="text-emerald-400 hover:text-emerald-300 font-semibold px-2 py-0.5 rounded hover:bg-emerald-950/50 transition-colors"
              title="Quick login as Admin"
            >
              Admin
            </button>
          </div>

          {isAuthenticated && user ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col text-right">
                <div className="flex items-center justify-end gap-1.5">
                  <span className="text-sm font-semibold text-white leading-tight">{user.name}</span>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded tracking-wide uppercase ${
                      user.role === 'ADMIN'
                        ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                        : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    }`}
                  >
                    {user.role}
                  </span>
                </div>
                <span className="text-xs text-slate-400 leading-tight truncate max-w-[140px]">{user.email}</span>
              </div>

              <button
                onClick={handleLogout}
                className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-900/50 hover:bg-rose-950/30 transition-all"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-3.5 py-1.5 rounded-lg text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-900 transition-colors flex items-center gap-1.5"
              >
                <LogIn className="w-4 h-4" />
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-3.5 py-1.5 rounded-lg text-sm font-semibold bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 hover:opacity-95 shadow-md shadow-cyan-500/10 transition-all flex items-center gap-1.5"
              >
                <UserPlus className="w-4 h-4 stroke-[2.5]" />
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
