import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatSummaryCardProps {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  iconColor?: string;
  iconBackground?: string;
  color?: string;
  className?: string;
}

function StatSummaryCard({
  label,
  value,
  icon: Icon,
  iconColor = 'text-[#2D6CDF]',
  iconBackground = 'bg-blue-50',
  color = 'text-gray-900',
  className = '',
}: StatSummaryCardProps) {
  return (
    <div className={`bg-white rounded-2xl p-6 border border-gray-100 shadow-sm transition-all hover:shadow-md ${className}`.trim()}>
      {Icon && (
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 ${iconBackground}`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
      )}
      <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">{label}</p>
      <p className={`text-3xl font-bold mt-2 ${color}`}>{value}</p>
    </div>
  );
}

export default StatSummaryCard;