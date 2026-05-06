import { AlertTriangle, Trash2 } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning';
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  isOpen,
  title = 'Are you sure?',
  message,
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  variant = 'danger',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  const isDanger = variant === 'danger';

  return (
    <div className="fixed inset-0 z-[9000] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Dialog */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 animate-[fadeInScale_0.2s_ease-out]">
        {/* Icon */}
        <div
          className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 ${
            isDanger ? 'bg-red-50' : 'bg-orange-50'
          }`}
        >
          {isDanger ? (
            <Trash2 className="w-8 h-8 text-red-500" />
          ) : (
            <AlertTriangle className="w-8 h-8 text-orange-500" />
          )}
        </div>

        {/* Content */}
        <div className="text-center mb-8">
          <h2 className="text-xl font-black text-gray-900 mb-2">{title}</h2>
          <p className="text-gray-500 font-medium leading-relaxed">{message}</p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 px-6 bg-gray-100 text-gray-700 rounded-2xl font-bold hover:bg-gray-200 transition-all active:scale-95"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 py-3 px-6 rounded-2xl font-bold transition-all active:scale-95 shadow-lg ${
              isDanger
                ? 'bg-red-500 text-white hover:bg-red-600 shadow-red-500/20'
                : 'bg-orange-500 text-white hover:bg-orange-600 shadow-orange-500/20'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.95); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
