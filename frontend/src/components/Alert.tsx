import React from 'react';
import { AlertCircle, CheckCircle, AlertTriangle, Info } from 'lucide-react';

interface AlertProps {
  type: 'success' | 'warning' | 'error' | 'info';
  title?: string;
  children?: React.ReactNode;
}

export function Alert({ type, title, children }: AlertProps) {
  const config = {
    success: {
      icon: CheckCircle,
      colorClass: 'text-success',
      borderClass: 'border-l-success',
      bgClass: 'bg-success-light',
    },
    warning: {
      icon: AlertTriangle,
      colorClass: 'text-warning',
      borderClass: 'border-l-warning',
      bgClass: 'bg-warning-light',
    },
    error: {
      icon: AlertCircle,
      colorClass: 'text-danger',
      borderClass: 'border-l-danger',
      bgClass: 'bg-danger-light',
    },
    info: {
      icon: Info,
      colorClass: 'text-info',
      borderClass: 'border-l-info',
      bgClass: 'bg-info-light',
    },
  };

  const currentConfig = config[type];
  const Icon = currentConfig.icon;

  return (
    <div className={`${currentConfig.bgClass} border-l-4 ${currentConfig.borderClass} rounded-lg p-4 mb-4`}>
      <div className="flex gap-3 items-start">
        <Icon size={24} className={`${currentConfig.colorClass} shrink-0 mt-0.5`} />
        <div className="flex-1">
          {title && (
            <div className={`font-bold ${currentConfig.colorClass} mb-1 text-[1.05rem]`}>
              {title}
            </div>
          )}
          {children && (
            <div className="text-clinical-800 leading-relaxed font-medium">
              {children}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
