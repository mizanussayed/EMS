import React from 'react';
import { Search, Plus } from 'lucide-react';
import FilterBar from './FilterBar';
import StatSummaryCard from './StatSummaryCard';

interface GenericGridProps<T> {
  data: T[];
  renderCard: (item: T) => React.ReactNode;
  onAdd?: () => void;
  addLabel?: string;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  isLoading?: boolean;
  title: string;
  description?: string;
  stats?: { label: string; value: string | number; color?: string }[];
  canAdd?: boolean;
}

function GridList<T extends { id: string | number }>({
  data,
  renderCard,
  onAdd,
  addLabel = 'Add New',
  searchTerm,
  onSearchChange,
  searchPlaceholder = 'Search...',
  isLoading = false,
  title,
  description,
  stats = [],
  canAdd = true
}: GenericGridProps<T>) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-gray-900 font-bold text-2xl">{title}</h1>
          {description && <p className="text-gray-600 mt-1">{description}</p>}
        </div>
        {canAdd && onAdd && (
          <button
            onClick={onAdd}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#2D6CDF] text-white rounded-xl font-bold hover:bg-[#1a4ba8] transition-all active:scale-95 shadow-lg shadow-[#2D6CDF]/20"
          >
            <Plus className="w-4 h-4" />
            {addLabel}
          </button>
        )}
      </div>

      {stats.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <StatSummaryCard key={idx} label={stat.label} value={stat.value} color={stat.color} />
          ))}
        </div>
      )}

      <FilterBar
        searchTerm={searchTerm}
        onSearchChange={onSearchChange}
        searchPlaceholder={searchPlaceholder}
      />

      {isLoading ? (
        <div className="py-20 text-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 border-4 border-[#2D6CDF] border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-500 font-medium">Loading records...</p>
          </div>
        </div>
      ) : data.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-2xl border border-dashed border-gray-200">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-10 h-10 text-gray-300" />
          </div>
          <h3 className="text-gray-900 font-bold text-xl mb-1">No results found</h3>
          <p className="text-gray-500">We couldn't find any records matching your search</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 hover:bg-gray-100 transition-colors">
          {data.map((item) => (
            <React.Fragment key={item.id}>
              {renderCard(item)}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
}

export default GridList;
