import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { cn } from '@/lib/utils';
import { Topic, LearningPath } from '@shared/schema';

interface SidebarProps {
  sidebarOpen: boolean;
}

const Sidebar = ({ sidebarOpen }: SidebarProps) => {
  const { data: topics } = useQuery<Topic[]>({
    queryKey: ['/api/topics']
  });

  const { data: learningPaths } = useQuery<LearningPath[]>({
    queryKey: ['/api/learning-paths']
  });

  return (
    <aside 
      className={cn(
        "fixed inset-y-0 left-0 transform transition duration-200 ease-in-out w-64 bg-white dark:bg-gray-800 shadow-lg md:static md:h-auto md:shadow overflow-y-auto pt-16 md:pt-0 z-40",
        sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      )}
    >
      <div className="px-4 py-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Topics</h2>
        
        {/* Topic List */}
        <nav className="space-y-1">
          {topics?.map((topic) => (
            <Link 
              key={topic.id}
              href={`/courses?topic=${topic.slug}`}
              className="flex items-center px-2 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md group"
            >
              <i className={`fas fa-${topic.icon} mr-3 text-gray-500 dark:text-gray-400`}></i>
              <span>{topic.name}</span>
            </Link>
          ))}
        </nav>
        
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Learning Paths</h2>
          <div className="space-y-2">
            {learningPaths?.map((path) => {
              const colorClass = path.color === 'blue' 
                ? 'bg-blue-50 dark:bg-blue-900/20 text-primary dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40'
                : path.color === 'green'
                  ? 'bg-green-50 dark:bg-green-900/20 text-secondary dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/40'
                  : 'bg-indigo-50 dark:bg-indigo-900/20 text-accent dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/40';
                  
              return (
                <Link 
                  key={path.id}
                  href={`/learning-paths/${path.slug}`}
                  className={`block px-3 py-2 rounded-md ${colorClass}`}
                >
                  {path.name}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
