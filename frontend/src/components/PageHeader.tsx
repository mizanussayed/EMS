import React from 'react';
import { Calendar } from 'lucide-react';
import { cn } from './ui/utils';

interface PageHeaderProps {
  title: string;
  subtitle: string;
  showDate?: boolean;
  actions?: React.ReactNode;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, showDate = true, actions, className }) => {
  return (
    <div className={cn("flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10", className)}>
      <div>
        <h1 className="text-gray-900 font-black text-4xl mb-2 tracking-tight">{title}</h1>
        <div className="flex items-center gap-2 text-gray-500 font-bold uppercase tracking-widest text-xs">
          {showDate && <Calendar className="w-4 h-4" />}
          {showDate ? `${new Date().toLocaleDateString()} • ` : ''}{subtitle}
        </div>
      </div>
      {actions && (
        <div className="flex items-center gap-3">
          {actions}
        </div>
      )}
    </div>
  );
};
