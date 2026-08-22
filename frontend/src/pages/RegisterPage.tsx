import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { RegisterForm } from '../components/RegisterForm';
import { Car, CheckCircle2, UserCheck, Shield } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Left Column: Information */}
        <div className="hidden md:flex flex-col space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Car className="w-6 h-6 text-slate-950 stroke-[2.5]" />
            </div>
            <h1 className="text-3xl font-black tracking-tight text-white">
              APEX <span className="text-cyan-400">MOTORS</span>
            </h1>
          </div>

          <p className="text-slate-400 text-sm leading-relaxed">
            Join the digital dealership experience. Select Customer role to buy cars, or Admin role to manage inventory catalog.
          </p>

          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
              <UserCheck className="w-5 h-5 text-cyan-400 shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-white">Buyer Role</h4>
                <p className="text-xs text-slate-400">Browse live vehicle inventory, filter by make & price, and execute one-click purchases.</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
              <Shield className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-white">Admin Staff Role</h4>
                <p className="text-xs text-slate-400">Full vehicle CRUD privileges, restock management, inventory tracking, and deletion authority.</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
              <CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-white">Instant Account Activation</h4>
                <p className="text-xs text-slate-400">Immediate access upon creation with automatic JWT token issue.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Register Form */}
        <div className="flex flex-col items-center">
          <RegisterForm
            onSuccess={() => navigate('/dashboard')}
          />
          <p className="mt-4 text-xs text-slate-400">
            Already registered?{' '}
            <Link to="/login" className="font-semibold text-cyan-400 hover:text-cyan-300 transition-colors">
              Sign into existing account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
