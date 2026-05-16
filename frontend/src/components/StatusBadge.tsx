interface StatusBadgeProps {
  status: string;
  variant?: 'success' | 'warning' | 'error' | 'info' | 'default';
  className?: string;
}

// Map common status names to variants
const statusVariantMap: Record<string, 'success' | 'warning' | 'error' | 'info' | 'default'> = {
  'Paid': 'success',
  'Pending': 'error',
  'Partially Paid': 'warning',
  'Active': 'success',
  'Inactive': 'warning',
  'Completed': 'success',
  'In Progress': 'info',
  'Cancelled': 'error',
};

const variantStyles: Record<string, string> = {
  success: 'bg-green-50 text-green-700 border-green-100',
  warning: 'bg-orange-50 text-orange-700 border-orange-100',
  error: 'bg-red-50 text-red-700 border-red-100',
  info: 'bg-blue-50 text-blue-700 border-blue-100',
  default: 'bg-gray-50 text-gray-700 border-gray-100',
};

export default function StatusBadge({ status, variant, className = '' }: StatusBadgeProps) {
  const resolvedVariant = variant || statusVariantMap[status] || 'default';
  const styles = variantStyles[resolvedVariant];

  return (
    <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${styles} ${className}`}>
      {status}
    </span>
  );
}
