import React, { useState, useEffect } from 'react';

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'date' | 'textarea' | 'select' | 'number';
  placeholder?: string;
  required?: boolean;
  options?: { label: string; value: any }[];
  colSpan?: 1 | 2;
}

interface GenericFormProps {
  fields: FormField[];
  initialData?: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  submitLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
}

const GenericForm: React.FC<GenericFormProps> = ({
  fields,
  initialData = {},
  onSubmit,
  onCancel,
  submitLabel = 'Submit',
  cancelLabel = 'Cancel',
  isLoading = false
}) => {
  const [formData, setFormData] = useState<any>(initialData);

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleChange = (name: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {fields.map((field) => (
          <div key={field.name} className={field.colSpan === 2 ? 'md:col-span-2' : ''}>
            <label className="block text-gray-700 font-bold text-sm mb-2">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            
            {field.type === 'textarea' ? (
              <textarea
                value={formData[field.name] || ''}
                onChange={(e) => handleChange(field.name, e.target.value)}
                placeholder={field.placeholder}
                required={field.required}
                rows={3}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]/20 focus:border-[#2D6CDF] transition-all"
              />
            ) : field.type === 'select' ? (
              <select
                value={formData[field.name] || ''}
                onChange={(e) => handleChange(field.name, e.target.value)}
                required={field.required}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]/20 focus:border-[#2D6CDF] transition-all appearance-none"
              >
                <option value="">Select {field.label}</option>
                {field.options?.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={field.type}
                value={formData[field.name] || ''}
                onChange={(e) => handleChange(field.name, e.target.value)}
                placeholder={field.placeholder}
                required={field.required}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]/20 focus:border-[#2D6CDF] transition-all"
              />
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2.5 text-gray-600 font-bold hover:bg-gray-50 rounded-xl transition-all"
        >
          {cancelLabel}
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-8 py-2.5 bg-[#2D6CDF] text-white rounded-xl font-bold hover:bg-[#1a4ba8] disabled:opacity-50 transition-all active:scale-95 shadow-lg shadow-[#2D6CDF]/20"
        >
          {isLoading ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  );
};

export default GenericForm;
