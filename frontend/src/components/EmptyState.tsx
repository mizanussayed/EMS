interface EmptyStateProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export default function EmptyState({ title, subtitle, icon, action }: EmptyStateProps) {
  return (
    <div className="text-center py-12 border border-dashed border-gray-200 rounded-xl">
      {icon && <div className="flex justify-center mb-4">{icon}</div>}
      <p className="text-gray-500 font-medium">{title}</p>
      {subtitle && <p className="text-gray-400 text-sm mt-1">{subtitle}</p>}
      {action && (
        <button
          onClick={action.onClick}
          className="mt-4 px-4 py-2 bg-[#2D6CDF] text-white rounded-lg hover:bg-[#1a4ba8] font-medium transition-all"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
