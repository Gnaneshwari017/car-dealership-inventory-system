import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
  return (
    <div
      role="alert"
      className="p-6 bg-rose-950/40 border border-rose-500/30 rounded-3xl text-center my-6 backdrop-blur-sm"
    >
      <AlertCircle className="w-8 h-8 text-rose-400 mx-auto mb-2" />
      <h3 className="text-sm font-bold text-rose-200 mb-1">An Error Occurred</h3>
      <p className="text-xs text-rose-300/80 max-w-md mx-auto">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-rose-900/60 hover:bg-rose-900 text-rose-200 text-xs font-semibold rounded-xl border border-rose-500/30 transition-all active:scale-95"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Try Again
        </button>
      )}
    </div>
  );
};
