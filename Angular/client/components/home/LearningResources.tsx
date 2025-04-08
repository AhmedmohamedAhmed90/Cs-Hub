import { useQuery } from '@tanstack/react-query';
import { Resource } from '@shared/schema';
import { Link } from 'wouter';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight } from 'lucide-react';

const LearningResources = () => {
  const { data: resources, isLoading: resourcesLoading } = useQuery<Resource[]>({
    queryKey: ['/api/resources']
  });

  const getIconColorClasses = (color: string) => {
    const colorMap: Record<string, string> = {
      'blue': 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
      'green': 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
      'purple': 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
      'yellow': 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400',
    };
    
    return colorMap[color] || colorMap['blue'];
  };

  return (
    <section className="mb-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Learning Resources</h2>
        <Link href="/resources" className="text-primary dark:text-blue-400 hover:underline">
          View All
        </Link>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {resourcesLoading ? (
          // Skeleton loading state
          Array(4).fill(0).map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md flex flex-col h-full">
              <Skeleton className="h-12 w-12 rounded-lg mb-4" />
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full mb-4 flex-grow" />
              <Skeleton className="h-4 w-24" />
            </div>
          ))
        ) : (
          resources?.map(resource => (
            <div key={resource.id} className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md hover:shadow-lg transition-shadow flex flex-col h-full">
              <div className={`flex items-center justify-center mb-4 h-12 w-12 rounded-lg ${getIconColorClasses(resource.color)}`}>
                <i className={`fas fa-${resource.icon} text-xl`}></i>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{resource.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 flex-grow">{resource.description}</p>
              <Link 
                href={resource.link} 
                className="text-primary dark:text-blue-400 font-medium hover:underline inline-flex items-center"
              >
                {resource.buttonText}
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default LearningResources;
