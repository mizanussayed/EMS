// Common Tailwind CSS class utilities to reduce repetition across components
export const COLORS = {
  primary: '#2D6CDF',
  primaryDark: '#1a4ba8',
  success: '#22c55e',
  warning: '#f97316',
  error: '#ef4444',
  info: '#3b82f6',
} as const;

export const BUTTON_STYLES = {
  primary: 'px-4 py-2.5 bg-[#2D6CDF] text-white rounded-xl hover:bg-[#1a4ba8] font-bold shadow-lg transition-all',
  success: 'px-4 py-2.5 bg-green-500 text-white rounded-xl hover:bg-green-900 font-bold transition-all',
  secondary: 'px-4 py-2.5 bg-gray-100 text-gray-900 rounded-xl hover:bg-gray-200 font-bold transition-all',
  danger: 'px-4 py-2.5 bg-red-50 text-red-700 rounded-xl hover:bg-red-100 font-bold transition-all',
  ghost: 'px-4 py-2.5 text-gray-700 hover:bg-gray-50 rounded-xl font-bold transition-all',
  small: 'px-3 py-1.5 bg-[#2D6CDF] text-white rounded-lg hover:bg-[#1a4ba8] text-sm font-medium transition-all',
} as const;

export const ICON_BUTTON_STYLES = {
  primary: 'p-2 hover:bg-blue-50 rounded-lg text-blue-600 transition-colors',
  danger: 'p-2 hover:bg-red-50 rounded-lg text-red-600 transition-colors',
  success: 'p-2 hover:bg-green-50 rounded-lg text-green-600 transition-colors',
  default: 'p-2 hover:bg-gray-50 rounded-lg text-gray-600 transition-colors',
} as const;

export const CARD_STYLES = {
  default: 'bg-white rounded-xl border border-gray-100 p-5 hover:shadow-lg transition-shadow',
  elevated: 'bg-white rounded-xl border border-gray-100 p-5 shadow-md hover:shadow-xl transition-shadow',
  flat: 'bg-white rounded-xl p-5 border-b border-gray-100',
} as const;

export const BADGE_STYLES = {
  success: 'px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border bg-green-50 text-green-700 border-green-100',
  warning: 'px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border bg-orange-50 text-orange-700 border-orange-100',
  error: 'px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border bg-red-50 text-red-700 border-red-100',
  info: 'px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border bg-blue-50 text-blue-700 border-blue-100',
  default: 'px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border bg-gray-50 text-gray-700 border-gray-100',
} as const;

export const INPUT_STYLES = {
  default: 'w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D6CDF] focus:border-transparent',
  error: 'w-full px-4 py-2.5 border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent',
} as const;

export const SPACING = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  '2xl': '48px',
} as const;
