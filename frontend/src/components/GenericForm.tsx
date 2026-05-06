import { SelectItem } from '../hooks/selectItem'; // Adjust the import path as needed
import React, { useState, useEffect } from 'react';

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'date' | 'time' | 'textarea' | 'select' | 'number' | 'password' | 'datetime-local' | 'checkbox';
  placeholder?: string;
  required?: boolean;
  options?: SelectItem[];
  colSpan?: 1 | 2;
  validate?: (value: any) => string | null;
  pattern?: string;
  patternMessage?: string;
}

interface GenericFormProps {
  fields: FormField[];
  initialData?: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  submitLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
  formCssClass?: string;
}

const GenericForm: React.FC<GenericFormProps> = ({
  fields,
  initialData = {},
  onSubmit,
  onCancel,
  submitLabel = 'Submit',
  cancelLabel = 'Cancel',
  isLoading = false,
  formCssClass = ''
}) => {
  const [formData, setFormData] = useState<any>(initialData);
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const initialDataRef = React.useRef<string>('');

  useEffect(() => {
    const serialized = JSON.stringify(initialData);
    if (serialized !== initialDataRef.current) {
      initialDataRef.current = serialized;
      setFormData(initialData);
    }
  }, [initialData]);

  const validateField = (field: FormField, value: any) => {
    if (field.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
      return `${field.label} is required`;
    }
    
    if (field.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) return 'Invalid email address';
    }

    if (field.pattern && value) {
      const regex = new RegExp(field.pattern);
      if (!regex.test(value)) return field.patternMessage || 'Invalid format';
    }

    if (field.validate) {
      return field.validate(value);
    }

    return null;
  };

  const handleChange = (field: FormField, value: any) => {
    const name = field.name;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
    
    if (touched[name]) {
      const error = validateField(field, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (field: FormField) => {
    const name = field.name;
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(field, formData[name]);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Validate all fields
    const newErrors: Record<string, string | null> = {};
    let hasErrors = false;
    
    fields.forEach(field => {
      const error = validateField(field, formData[field.name]);
      if (error) {
        newErrors[field.name] = error;
        hasErrors = true;
      }
    });

    setErrors(newErrors);
    
    // Mark all as touched to show errors
    const newTouched: Record<string, boolean> = {};
    fields.forEach(field => { newTouched[field.name] = true; });
    setTouched(newTouched);

    if (!hasErrors) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${formCssClass}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {fields.map((field) => {
          const hasError = touched[field.name] && errors[field.name];
          return (
            <div key={field.name} className={field.colSpan === 2 ? 'md:col-span-2' : ''}>
              <label className={`block font-bold text-sm mb-2 transition-colors ${hasError ? 'text-red-500' : 'text-gray-700'}`}>
                {field.label} {field.required && <span className="text-red-500">*</span>}
              </label>
              
              <div className="relative">
                {field.type === 'textarea' ? (
                  <textarea
                    value={formData[field.name] || ''}
                    onChange={(e) => handleChange(field, e.target.value)}
                    onBlur={() => handleBlur(field)}
                    placeholder={field.placeholder}
                    rows={3}
                    className={`w-full px-4 py-2 bg-gray-50 border rounded-xl focus:outline-none focus:ring-4 transition-all ${
                      hasError 
                        ? 'border-red-200 focus:ring-red-500/10 focus:border-red-500' 
                        : 'border-gray-200 focus:ring-[#2D6CDF]/10 focus:border-[#2D6CDF]'
                    }`}
                  />
                ) : field.type === 'select' ? (
                  <select
                    value={formData[field.name] || ''}
                    onChange={(e) => handleChange(field, e.target.value)}
                    onBlur={() => handleBlur(field)}
                    className={`w-full px-4 py-2 bg-gray-50 border rounded-xl focus:outline-none focus:ring-4 transition-all appearance-none ${
                      hasError 
                        ? 'border-red-200 focus:ring-red-500/10 focus:border-red-500' 
                        : 'border-gray-200 focus:ring-[#2D6CDF]/10 focus:border-[#2D6CDF]'
                    }`}
                  >
                    <option value="">Select {field.label}</option>
                    {field.options?.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                ): field.type === 'checkbox' ? (
                  <input
                    type={field.type}
                    checked={formData[field.name] as boolean}
                    onChange={(e) => handleChange(field, e.target.checked)}
                    onBlur={() => handleBlur(field)}
                    className={`w-5 h-5 inline text-[#2D6CDF] border-gray-300 focus:ring-[#2D6CDF] rounded focus:ring-2 transition-all`}
                  />
                )
                : (
                  <input
                    type={field.type}
                    value={formData[field.name] || ''}
                    onChange={(e) => handleChange(field, e.target.value)}
                    onBlur={() => handleBlur(field)}
                    placeholder={field.placeholder}
                    className={`w-full px-4 py-2 bg-gray-50 border rounded-xl focus:outline-none focus:ring-4 transition-all ${
                      hasError 
                        ? 'border-red-200 focus:ring-red-500/10 focus:border-red-500' 
                        : 'border-gray-200 focus:ring-[#2D6CDF]/10 focus:border-[#2D6CDF]'
                    }`}
                  />
                )}
                {hasError && (
                  <p className="mt-1.5 text-xs font-bold text-red-500 animate-in fade-in slide-in-from-top-1 duration-200">
                    {errors[field.name]}
                  </p>
                )}
              </div>
            </div>
          );
        })}
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
