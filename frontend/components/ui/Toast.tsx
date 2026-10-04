'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';

export type ToastType = 'success' | 'info' | 'warning' | 'error';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
}

interface ToastContextValue {
  showToast: (title: string, description?: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (title: string, description?: string, type: ToastType = 'success') => {
      const id = 'toast-' + Math.random().toString(36).substring(2, 9);
      setToasts((prev) => [...prev.slice(-2), { id, title, description, type }]);
      setTimeout(() => {
        removeToast(id);
      }, 3500);
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast Notification Container (Bottom-Right, above HUD) */}
      <div className="fixed bottom-20 right-5 z-50 flex flex-col gap-2.5 max-w-sm pointer-events-none">
        {toasts.map((toast) => {
          const isSuccess = toast.type === 'success';
          const isWarning = toast.type === 'warning';
          const isError = toast.type === 'error';

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto p-3.5 rounded-2xl border shadow-2xl backdrop-blur-xl transition-all duration-300 flex items-start gap-3 animate-in fade-in slide-in-from-bottom-3 ${
                isSuccess
                  ? 'bg-slate-950/95 border-emerald-500/40 text-emerald-200 shadow-emerald-950/40'
                  : isWarning
                  ? 'bg-slate-950/95 border-amber-500/40 text-amber-200 shadow-amber-950/40'
                  : isError
                  ? 'bg-slate-950/95 border-rose-500/40 text-rose-200 shadow-rose-950/40'
                  : 'bg-slate-950/95 border-cyan-500/40 text-cyan-200 shadow-cyan-950/40'
              }`}
            >
              <div className="shrink-0 mt-0.5">
                {isSuccess && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                {isWarning && <AlertTriangle className="w-4 h-4 text-amber-400" />}
                {isError && <XCircle className="w-4 h-4 text-rose-400" />}
                {!isSuccess && !isWarning && !isError && <Info className="w-4 h-4 text-cyan-400" />}
              </div>

              <div className="flex-1 space-y-0.5 pr-2">
                <div className="text-xs font-bold font-sans text-white leading-tight">
                  {toast.title}
                </div>
                {toast.description && (
                  <div className="text-[11px] text-slate-400 leading-snug">
                    {toast.description}
                  </div>
                )}
              </div>

              <button
                onClick={() => removeToast(toast.id)}
                className="text-slate-500 hover:text-white shrink-0 mt-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return ctx;
};
