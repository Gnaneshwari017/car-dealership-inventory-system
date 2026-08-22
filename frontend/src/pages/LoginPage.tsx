import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LoginForm } from '../components/LoginForm';
import { Car, ShieldCheck, Zap, Database } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Left Column: Branding & Value Proposition */}
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
            Engineered for high concurrency, thread-safe inventory locks, and seamless full-stack performance.
          </p>

          <div className="space-y-4 pt-2">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-cyan-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Role-Based Security</h4>
                <p className="text-xs text-slate-400">JWT token bearer authentication with user and admin access controls.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-emerald-400">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Atomic Transactions</h4>
                <p className="text-xs text-slate-400">Row-locking safeguards prevent negative inventory under heavy concurrency.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-amber-400">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Persistent Storage</h4>
                <p className="text-xs text-slate-400">Production-grade relational database with Alembic migration versioning.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Login Form */}
        <div className="flex flex-col items-center">
          <LoginForm
            onSuccess={() => navigate('/dashboard')}
          />
          <p className="mt-4 text-xs text-slate-400">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-semibold text-cyan-400 hover:text-cyan-300 transition-colors">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
