import { useState } from 'react';
import { cn } from '@/lib/utils';

type TabType = 'all' | 'popular' | 'beginner' | 'advanced' | 'new';

const CategoryTabs = () => {
  const [activeTab, setActiveTab] = useState<TabType>('all');

  const tabs: { id: TabType; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'popular', label: 'Popular' },
    { id: 'beginner', label: 'Beginner Friendly' },
    { id: 'advanced', label: 'Advanced' },
    { id: 'new', label: 'New Releases' },
  ];

  return (
    <div className="mb-8">
      <div className="flex overflow-x-auto pb-2 scrollbar-hide border-b border-gray-200 dark:border-gray-700">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "px-4 py-2 font-medium text-sm border-b-2 whitespace-nowrap",
              activeTab === tab.id
                ? "border-primary dark:border-blue-400 text-primary dark:text-blue-400"
                : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryTabs;
