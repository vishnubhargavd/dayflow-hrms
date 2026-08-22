import React, { createContext, useContext, useState, type ReactNode } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = (message: string, type: ToastType = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast Render Container */}
      <div
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 999999,
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          maxWidth: '380px',
          width: 'calc(100vw - 48px)',
          pointerEvents: 'none',
        }}
      >
        {toasts.map((toast) => {
          const isSuccess = toast.type === 'success';
          const isError = toast.type === 'error';
          const isWarning = toast.type === 'warning';

          const bg = isSuccess ? '#0D120F' : isError ? '#1C0D0D' : isWarning ? '#1C190D' : '#0D120F';
          const borderColor = isSuccess ? '#7CFFB2' : isError ? '#E97870' : isWarning ? '#E7B95E' : '#D6C38A';
          const textColor = isSuccess ? '#7CFFB2' : isError ? '#E97870' : isWarning ? '#E7B95E' : '#F3F1E8';

          return (
            <div
              key={toast.id}
              style={{
                pointerEvents: 'auto',
                background: bg,
                border: `1px solid ${borderColor}`,
                borderRadius: 'var(--radius-md)',
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                animation: 'toastSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {isSuccess && <CheckCircle2 size={18} color={textColor} />}
                {isError && <AlertCircle size={18} color={textColor} />}
                {isWarning && <AlertCircle size={18} color={textColor} />}
                {!isSuccess && !isError && !isWarning && <Info size={18} color={textColor} />}
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#F3F1E8' }}>{toast.message}</span>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                style={{ background: 'transparent', border: 'none', color: '#8A918A', cursor: 'pointer', padding: '2px' }}
              >
                <X size={14} />
              </button>
            </div>
          );
        })}
      </div>
      <style>{`
        @keyframes toastSlideIn {
          0% { transform: translateY(12px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
