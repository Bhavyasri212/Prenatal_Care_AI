import React from 'react';


interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
  hover?: boolean;
}

export function Card({ children, className = '', padding = 'lg', hover = false }: CardProps) {
  const paddingStyles = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const baseStyle = "bg-white rounded-2xl border-2 border-clinical-100 shadow-card transition-all duration-300";
  const hoverStyle = hover ? "hover:-translate-y-1 hover:border-clinical-300 hover:shadow-elevated" : "";

  return (
    <div className={`${baseStyle} ${paddingStyles[padding]} ${hoverStyle} ${className}`}>
      {children}
    </div>
  );
}

interface SectionCardProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function SectionCard({ title, icon, children, className = '' }: SectionCardProps) {
  return (
    <Card className={`overflow-hidden ${className}`}>
      <div className="flex items-center gap-3 text-clinical-700 text-2xl font-bold mb-6 pb-4 border-b-[3px] border-clinical-100">
        {icon && <span className="text-clinical-500">{icon}</span>}
        {title}
      </div>
      {children}
    </Card>
  );
}
