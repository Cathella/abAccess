interface TabFilterProps {
  tabs: { key: string; label: string }[];
  activeTab: string;
  onTabChange: (key: string) => void;
}

export default function TabFilter({ tabs, activeTab, onTabChange }: TabFilterProps) {
  return (
    <div className="flex gap-1 bg-[#F7F9FC] rounded-[12px] p-1">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;

        return (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={`
              flex-1 px-4 py-2.5 rounded-[10px]
              font-medium text-[14px] leading-none
              cursor-pointer transition-all duration-200
              ${
                isActive
                  ? 'bg-white text-neutral-900 shadow-[0_1px_3px_rgba(0,0,0,0.1)]'
                  : 'bg-transparent text-neutral-600'
              }
            `}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
