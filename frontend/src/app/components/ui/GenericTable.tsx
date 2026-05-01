import React from 'react';
import { Search, Plus, Edit, Trash2, Eye, MoreVertical } from 'lucide-react';

export interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
  className?: string;
}

interface GenericTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onView?: (item: T) => void;
  onAdd?: () => void;
  addLabel?: string;
  searchPlaceholder?: string;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  isLoading?: boolean;
  title: string;
  description?: string;
  stats?: { label: string; value: string | number; color?: string }[];
  customFilters?: React.ReactNode;
  topActions?: React.ReactNode;
  canAdd?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
  canView?: boolean;
}

function GenericTable<T extends { id: string | number }>({
  data,
  columns,
  onEdit,
  onDelete,
  onView,
  onAdd,
  addLabel = 'Add New',
  searchPlaceholder = 'Search...',
  searchTerm,
  onSearchChange,
  isLoading = false,
  title,
  description,
  stats = [],
  customFilters,
  topActions,
  canAdd = true,
  canEdit = true,
  canDelete = true,
  canView = true
}: GenericTableProps<T>) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-gray-900 font-bold text-2xl">{title}</h1>
          {description && <p className="text-gray-600 mt-1">{description}</p>}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {topActions}
          {canAdd && onAdd && (
            <button
              onClick={onAdd}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-[#2D6CDF] text-white rounded-xl font-bold hover:bg-[#1a4ba8] transition-all active:scale-95 shadow-lg shadow-[#2D6CDF]/20"
            >
              <Plus className="w-5 h-5" />
              {addLabel}
            </button>
          )}
        </div>
      </div>

      {stats.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm transition-all hover:shadow-md">
              <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">{stat.label}</p>
              <p className={`text-3xl font-bold mt-2 ${stat.color || 'text-gray-900'}`}>{stat.value}</p>
            </div>
          ))}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {customFilters ? (
          <div className="p-5 border-b border-gray-100">
            {customFilters}
          </div>
        ) : (
          <div className="p-5 border-b border-gray-100">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full pl-11 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D6CDF]/20 focus:border-[#2D6CDF] transition-all"
              />
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {columns.map((col, idx) => (
                  <th key={idx} className="px-6 py-2 text-[15px] font-semibold text-gray-700">
                    {col.header}
                  </th>
                ))}
                {(onEdit || onDelete || onView) && (
                  <th className="px-6 py-2 text-[15px] font-semibold text-gray-600 text-center">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr>
                  <td colSpan={columns.length + 1} className="px-6 py-10 text-center text-gray-500 font-medium">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-10 h-10 border-4 border-[#2D6CDF] border-t-transparent rounded-full animate-spin" />
                      Loading records...
                    </div>
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + 1} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                        <Search className="w-8 h-8 text-gray-300" />
                      </div>
                      <p className="text-gray-500 font-medium">No records found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                data.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/30 transition-colors group">
                    {columns.map((col, idx) => (
                      <td key={idx} className={`px-6 py-5 text-[15px] ${idx === 0 ? 'font-bold text-gray-900' : 'text-gray-600 font-medium'} ${col.className || ''}`}>
                        {typeof col.accessor === 'function' 
                          ? col.accessor(item) 
                          : (item[col.accessor] as any)}
                      </td>
                    ))}
                    {(onEdit || onDelete || onView) && (
                      <td className="px-6 py-5 text-center">
                        <div className="flex items-center justify-center gap-3">
                          {canView && onView && (
                            <button
                              onClick={() => onView(item)}
                              className="text-blue-500 hover:scale-110 transition-transform"
                              title="View Details"
                            >
                              <Eye className="w-[18px] h-[18px]" />
                            </button>
                          )}
                          {canEdit && onEdit && (
                            <button
                              onClick={() => onEdit(item)}
                              className="text-gray-500 hover:scale-110 transition-transform"
                              title="Edit"
                            >
                              <Edit className="w-[18px] h-[18px]" />
                            </button>
                          )}
                          {canDelete && onDelete && (
                            <button
                              onClick={() => onDelete(item)}
                              className="text-red-500 hover:scale-110 transition-transform"
                              title="Delete"
                            >
                              <Trash2 className="w-[18px] h-[18px]" />
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default GenericTable;