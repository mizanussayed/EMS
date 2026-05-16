interface TabNavigation {
  label: string;
  key: string;
  icon?: React.ReactNode;
}

interface TabNavigationProps {
  tabs: TabNavigation[];
  activeTab: string;
  onChange: (key: string) => void;
  className?: string;
}

export default function TabNavigation({ tabs, activeTab, onChange, className = '' }: TabNavigationProps) {
  return (
    <div className={`border-b border-gray-100 ${className}`}>
      <div className="flex gap-4">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            className={`px-6 py-4 font-bold uppercase text-xs tracking-widest border-b-2 transition-all flex items-center gap-2 ${
              activeTab === tab.key
                ? 'border-[#2D6CDF] text-[#2D6CDF]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
