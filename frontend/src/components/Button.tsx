import React from 'react';


import { twMerge } from 'tailwind-merge';
import { clsx, type ClassValue } from 'clsx';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  children,
  className,
  ...props
}: ButtonProps) {
  
  const baseStyle = "inline-flex items-center justify-center font-bold rounded-xl transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  
  const variantStyles = {
    primary: "bg-clinical-600 hover:bg-clinical-700 text-white shadow-clinical-200 focus:ring-clinical-500",
    success: "bg-success hover:bg-emerald-600 text-white shadow-emerald-200 focus:ring-success",
    warning: "bg-warning hover:bg-amber-600 text-white shadow-amber-200 focus:ring-warning",
    danger: "bg-danger hover:bg-red-600 text-white shadow-red-200 focus:ring-danger",
    secondary: "bg-white text-clinical-700 border-2 border-clinical-200 hover:border-clinical-300 hover:bg-clinical-50 focus:ring-clinical-100",
  };

  const sizeStyles = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  const widthStyle = fullWidth ? "w-full" : "w-auto";

  return (
    <button
      className={cn(baseStyle, variantStyles[variant], sizeStyles[size], widthStyle, className)}
      {...props}
    >
      {children}
    </button>
  );
}
