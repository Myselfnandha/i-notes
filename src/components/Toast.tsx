import React from 'react';
import { ToastMessage } from '../types';
import { CheckCircle2, Info, AlertTriangle, XCircle } from 'lucide-react';

interface ToastProps {
  toasts: ToastMessage[];
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts }) => {
  return (
    <div className="toast-container">
      {toasts.map((toast) => {
        let Icon = Info;
        if (toast.type === 'success') Icon = CheckCircle2;
        if (toast.type === 'warning') Icon = AlertTriangle;
        if (toast.type === 'error') Icon = XCircle;

        return (
          <div key={toast.id} className={`toast toast-${toast.type}`}>
            <span className="toast-icon">
              <Icon size={20} />
            </span>
            <div className="toast-content">
              <h5 className="toast-title">{toast.title}</h5>
              {toast.desc && <p className="toast-desc">{toast.desc}</p>}
            </div>
          </div>
        );
      })}
    </div>
  );
};
