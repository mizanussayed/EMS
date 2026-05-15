import React from 'react';
import { X } from 'lucide-react';

interface ModalHeaderProps {
  title: string;
  subtitle?: string;
  onClose: () => void;
}

function ModalHeader({ title, subtitle, onClose }: ModalHeaderProps) {
  return (
    <div className="p-6 border-b border-gray-100 flex items-start justify-between gap-4 bg-gray-50/50">
      <div className="min-w-0">
        <h2 className="text-gray-900 font-bold text-xl">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
      </div>
      <button
        onClick={onClose}
        className="shrink-0 p-2 hover:bg-white rounded-xl transition-all shadow-sm hover:shadow-md active:scale-95"
        aria-label="Close modal"
      >
        <X className="w-5 h-5 text-gray-500" />
      </button>
    </div>
  );
}

export default ModalHeader;