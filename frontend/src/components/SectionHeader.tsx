import React from 'react';
import { LucideIcon } from 'lucide-react';

interface SectionHeaderProps {
  icon?: LucideIcon;
  title: string;
  subtitle?: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: LucideIcon;
  };
  className?: string;
}

export default function SectionHeader({ icon: Icon, title, subtitle, action, className }: SectionHeaderProps) {
  const ActionIcon = action?.icon;

  return (
    <div className={`flex items-center justify-between ${className}`}>
      <div>
        <h2 className="text-gray-900 font-bold text-xl flex items-center gap-2">
          {Icon && <Icon className="w-5 h-5 text-[#2D6CDF]" />}
          {title}
        </h2>
        {subtitle && <p className="text-gray-500 text-sm mt-1">{subtitle}</p>}
      </div>
      {action && (
        <button
          onClick={action.onClick}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#2D6CDF] text-white rounded-xl hover:bg-[#1a4ba8] font-bold shadow-lg transition-all"
        >
          {ActionIcon && <ActionIcon className="w-4 h-4" />}
          {action.label}
        </button>
      )}
    </div>
  );
}
