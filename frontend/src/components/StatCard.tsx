import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/utils/utils';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color: 'blue' | 'purple' | 'green' | 'orange' | 'red';
  trend?: string;
  className?: string;
}

const colorMap = {
  blue: {
    bg: 'bg-blue-50',
    text: 'text-blue-600',
    dot: 'bg-blue-500',
    border: 'border-blue-100',
    shadow: 'shadow-blue-500/5'
  },
  purple: {
    bg: 'bg-purple-50',
    text: 'text-purple-600',
    dot: 'bg-purple-500',
    border: 'border-purple-100',
    shadow: 'shadow-purple-500/5'
  },
  green: {
    bg: 'bg-green-50',
    text: 'text-green-600',
    dot: 'bg-green-500',
    border: 'border-green-100',
    shadow: 'shadow-green-500/5'
  },
  orange: {
    bg: 'bg-orange-50',
    text: 'text-orange-600',
    dot: 'bg-orange-500',
    border: 'border-orange-100',
    shadow: 'shadow-orange-500/5'
  },
  red: {
    bg: 'bg-red-50',
    text: 'text-red-600',
    dot: 'bg-red-500',
    border: 'border-red-100',
    shadow: 'shadow-red-500/5'
  }
};

export const StatCard: React.FC<StatCardProps> = ({ label, value, icon: Icon, color, trend, className }) => {
  const styles = colorMap[color];
  
  return (
    <div className={cn(
      "bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden",
      styles.shadow,
      className
    )}>
      <div className={cn("absolute -right-4 -bottom-4 w-32 h-32 opacity-[0.03] rounded-full group-hover:scale-110 transition-transform", styles.dot)}></div>
      <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6", styles.bg, styles.text)}>
        <Icon className="w-7 h-7" />
      </div>
      <p className="text-gray-400 text-xs font-black uppercase tracking-widest mb-1">{label}</p>
      <h3 className="text-gray-900 text-3xl font-black mb-3">{value}</h3>
      {trend && (
        <div className={cn("text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full inline-block", styles.bg, styles.text)}>
          {trend}
        </div>
      )}
    </div>
  );
};
